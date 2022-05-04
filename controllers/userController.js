
const { getUser, createUser, getAllUsers, deleteUser, deleteAllUsers } = require('../services/userService')
const { removeAllToDosOfUser, removeSingleToDo, getToDo, createToDo } = require('../services/todoService');
const { createPost, removeAllPostsOfUser, removeSinglePost } = require('../services/postService');
const {removeAllCommentsOfPost}=require('../services/commentService');
const { saveDoc } = require('../services/commonService');


exports.createUser = (req, res, next) => {
  createUser(req.body).then(newUser => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ message: `User created successfully`, result: newUser })
  })
    .catch(err => next(err))
}

exports.getUser = (req, res, next) => {
  getUser(req.params.userId).then(users => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ message: `All Users details retrieved successfully`, result: users })
  })
    .catch(err => next(err))
}

exports.getAllUsers = (req, res, next) => {
  getAllUsers().then(users => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ message: `All Users details retrieved successfully`, result: users })
  })
    .catch(err => next(err))
}

exports.deleteUser = (req, res, next) => {
  /*
Before deleting the user you must delete the user's todos,posts and its comments
  */
//  removeAllToDosOfUser(req.params.userId).then(deletedToDos=>{
//   getUser(req.params.userId).then(user=>{
//     if(user){
//     const allPosts=[...user.posts];
    
//     removeAllPostsOfUser(req.params.userId).then(deletedPosts=>{
//       console.log("All posts deleted");
//     })
//     .catch(err=>next(err))

//     allPosts.forEach(postId=>{
//       removeAllCommentsOfPost(postId).then(deletedComment=>{
//         console.log("deleted comment");
//       })
//       .catch(err=>next(err))
//     })
//   }
//   else{
//     let err=new Error(`User ${req.params.userId} not found`);
//     err.status=404;
//     return next(err);
//   }
//   })
//   .catch(err=>next(err))
//  })
//  .catch(err=>next(err))

  deleteUser(req.params.userId).then(user => {
    if (user) {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json({ message: `User with userId ${req.params.userId} deleted successfully`, result: user });
    }
    else {
      let err = new Error(`User ${req.params.userId} does not exist`);
      err.status = 404;
      return next(err);
    }
  })
    .catch(err => next(err))
}

exports.deleteAllUsers = (req, res, next) => {
  deleteAllUsers().then(users => {
    if (users.n != 0) {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json({ message: `All users deleted successfully`, result: users });
    }
    else {
      let err = new Error(`No user found to delete`);
      err.status = 404;
      return next(err);
    }
  })
    .catch(err => next(err))
}


exports.deleteAllToDosOfUser = (req, res, next) => {

  removeAllToDosOfUser(req.params.userId).then(userToDos => {
    console.log(userToDos);
    //once all todos for the given user deleted from ToDos collection,delete from the Users collection as well
    if (userToDos.n != 0) {
      //we execute the below query only if there are todos which need to be deleted.
      getUser(req.params.userId).then(userInfo => {
        if (userInfo) {
          //remove all objects from the todos subdocument
          for (let i = (userInfo.todos.length - 1); i >= 0; i--) {
            userInfo.todos.id(userInfo.todos[i]._id).remove();
          }
          saveDoc(userInfo).then(savedUser => {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json({ message: `Deleted all ToDos of ${req.params.userId}`, result: savedUser })
          })
            .catch(err => next(err))
        }
        else {
          let err = new Error(`User ${req.params.userId} does not exist`);
          err.status = 404;
          return next(err);
        }
      })
        .catch(err => next(err))
    }
    else {
      let err = new Error(`No ToDos found to delete for user ${req.params.userId}`);
      err.status = 404;
      return next(err);
    }
  })
    .catch(err => next(err))
}

exports.deleteToDo = (req, res, next) => {
  removeSingleToDo(req.params.todoId).then(deletedToDo => {
    if (deletedToDo) {
      getUser(req.params.userId).then(user => {
        if (user) {
          //removing the todo from the todos subdocument of the users document
          //We are passing the _id of the todo subdocument to be removed to the todos subdocuments array
          user.todos.id(req.params.todoId).remove();

          saveDoc(user).then(savedUser => {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json({ message: `Deleted ToDo of ${req.params.todoId}`, result: savedUser })
          })
            .catch(err => next(err))
        }
        else {
          let err = new Error(`User ${req.params.userId} does not exist`);
          err.status = 404;
          return next(err);
        }
      })
        .catch(err => next(err))
    }
    else {
      let err = new Error(`ToDo Item ${req.params.todoId} does not exist`);
      err.status = 404;
      return next(err);
    }
  })
    .catch(err => next(err))
}

exports.updateToDo = (req, res, next) => {
  getToDo(req.params.todoId).then(todo => {
    if (todo) {
      todo.title = req.body.title;
      todo.completed = req.body.completed;

      saveDoc(todo).then(updatedToDo => {
        console.log(updatedToDo);
        getUser(req.params.userId).then(user => {
          if (user) {
            let updatedToDoIndex = user.todos.findIndex(x => x._id == req.params.todoId);
            if (updatedToDoIndex !== -1) {
              user.todos[updatedToDoIndex].title = req.body.title;
              user.todos[updatedToDoIndex].completed = req.body.completed;

              saveDoc(user).then(savedUser => {
                console.log(savedUser)
                res.setHeader('Content-Type', 'application/json');
                res.status(200).json({ message: `ToDo ${req.params.todoId} has been updated successfully`, result: savedUser })
              })
                .catch(err => next(err))
            }
            else {
              let err = new Error(`ToDo Item ${req.params.todoId} not linked to User ${req.params.userId}`);
              err.status = 404;
              return next(err);
            }
          }
          else {
            let err = new Error(`User ${req.params.userId} does not exist`);
            err.status = 404;
            return next(err);
          }
        })
          .catch(err => next(err))
      })
        .catch(err => next(err))
    }
    else {
      let err = new Error(`ToDo item ${req.params.todoId} does not exist`);
      err.status = 404;
      return next(err);
    }
  })
    .catch(err => next(err))
}

exports.getToDo = (req, res, next) => {
  //findById means find based on the _id field in the document
  getUser(req.params.userId).then(user => {
    if (user) {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json({ message: `Retrieved ToDo details`, result: user.todos })
    }
    else {
      let err = new Error(`User ${req.params.userId} does not exist`);
      err.status = 404;
      return next(err);
    }
  })
    .catch(err => next(err))
}

exports.createToDo = (req, res, next) => {
  let payload = JSON.parse(JSON.stringify(req.body));
  payload.userId = req.params.userId;
  createToDo(payload).then(newTodo => {
    //once todo is created in ToDos collection, you need to add the todo in the Users collection as well
    getUser(req.params.userId).then(user => {
      if (user) {
        user.todos.push(newTodo); //update the subdocument
        saveDoc(user).then(savedUser => {
          res.setHeader('Content-Type', 'application/json');
          res.status(200).json({ message: "ToDo created successfully for User", result: savedUser })
        })
          .catch(err => next(err))
      }
      else {
        let err = new Error(`User ${req.body.userId} does not exist`);
        err.status = 404;
        return next(err);
      }
    })
      .catch(err => next(err));
  })
    .catch(err => next(err));
}

exports.createPost = (req, res, next) => {
  let payload = JSON.parse(JSON.stringify(req.body))
  payload.userId = req.params.userId;
  createPost(payload).then(newPost => {
    getUser(req.params.userId).then(user => {
      if (user) {
        user.posts.push(newPost._id);
        saveDoc(user).then(savedUser => {
          res.setHeader('Content-Type', 'application/json');
          res.status(200).json({ message: `Post ${newPost._id} has been created for user ${req.params.userId}`, result: savedUser })
        })
          .catch(err => next(err))
      }
      else {
        let err = new Error(`User ${req.params.userId} does not exist`);
        err.status = 404;
        return next(err);
      }
    })
      .catch(err => next(err))
  })
    .catch(err => next(err))
}

exports.getPost = (req, res, next) => {
  getUser(req.params.userId).populate({
    path: 'posts',
    populate: {
      path: 'comments'
    }
  }).then(user => {
    if (user) {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json({
        message: `Post(s) retrieved successfully`,
        result: user.posts
      })
    }
    else {
      let err = new Error(`User ${req.params.userId} does not exist`);
      err.status = 404;
      return next(err);
    }
  })
    .catch(err => next(err))
}

exports.deleteAllPostsOfUser = (req, res, next) => {
  removeAllPostsOfUser(req.params.userId).then(deletedPosts => {
    console.log(deletedPosts); //{ n: 2, ok: 1, deletedCount: 2 }
    if (deletedPosts.n != 0) {
      getUser(req.params.userId).then(user => {
        user.posts = [];
        saveDoc(user).then(savedUser => {
          res.setHeader('Content-Type', 'application/json');
          res.status(200).json({
            message: `All Posts of the user ${req.params.userId} deleted successfully`,
            result: savedUser
          })
        })
          .catch(err => next(err))
      })
        .catch(err => next(err))
    }
    else {
      let err = new Error(`No posts found to delete for user ${req.params.userId}`);
      err.status = 404;
      return next(err);
    }
  })
    .catch(err => next(err))
}

exports.deleteSinglePost = (req, res, next) => {
  removeSinglePost(req.params.postId).then(deletedPost => {
    if (deletedPost) {
      getUser(req.params.userId).then(user => {
        //user.posts is an array of ObjectIds
        if (user) {
          let postToBeDeletedIndex = user.posts.findIndex(x => x == req.params.postId);
          user.posts.splice(postToBeDeletedIndex, 1);
          saveDoc(user).then(savedUser => {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json({
              message: `Post ${req.params.postId} deleted successfully`,
              result: savedUser
            })
          })
            .catch(err => next(err))
        }
        else {
          let err = new Error(`User ${req.params.userId} does not exist`);
          err.status = 404;
          return next(err);
        }
      })
        .catch(err => next(err))
    }
    else {
      let err = new Error(`Post ${req.params.postId} does not exist`);
      err.status = 404;
      return next(err);
    }
  })
    .catch(err => next(err))
}

