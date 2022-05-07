
const { getUser, createUser, getAllUsers, deleteUser, updateUser } = require('../services/userService')
const { removeAllToDosOfUser, removeSingleToDo, createToDo, updateToDo } = require('../services/todoService');
const { createPost, removeAllPostsOfUser, removeSinglePost, getPost, updatePost } = require('../services/postService');
const { removeAllCommentsOfPost, getCommentsOfAPostForAUser, createComment } = require('../services/commentService');
const { saveDoc } = require('../services/commonService');
const { executeTasksInSequence } = require('../utility');

exports.notSupportedRoute = (req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  res.status(403).json({
    message: `${req.method} is not supported on ${req.url}`
  })
}

exports.createUser = (req, res, next) => {
  createUser(req.body).then(newUser => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ message: `User created successfully`, result: newUser })
  })
    .catch(err => next(err))
}

exports.updateUser = (req, res, next) => {
  updateUser(req.params.userId, req.body).then(savedUser => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ message: `User updated successfully`, result: savedUser })
  }).catch(err => next(err))
}

exports.getUser = (req, res, next) => {
  getUser(req.params.userId).then(user => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ message: `All Users details retrieved successfully`, result: user })
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
  getUser(req.params.userId)
    .then(user => {
      if (user) {
        //removal of todos,posts and comments can execute in parallel
        let listOfPromises = [removeAllPostsOfUser(req.params.userId),
        removeAllToDosOfUser(req.params.userId),
        ...user.posts.map(post => removeAllCommentsOfPost(post._id))];

        //listOfPromises must execute before the user is deleted. reduce method ensures sequence is maintainer
        executeTasksInSequence([Promise.all(listOfPromises), deleteUser(req.params.userId)])
          .then((results) => {
            console.log(results);
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json({ message: `User with userId ${req.params.userId} deleted successfully`, result: user });
          })
          .catch(err => next(err))

      }
      else {
        let err = new Error(`User ${req.params.userId} not found`);
        err.status = 404;
        return next(err);
      }
    })
    .catch(err => next(err))
}

exports.deleteAllToDosOfUser = (req, res, next) => {

  executeTasksInSequence([removeAllToDosOfUser(req.params.userId),
  updateUser(req.params.userId, { todos: [] })])
    .then(results => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json({ message: `Deleted all ToDos of ${req.params.userId}`, result: results })
    })
    .catch(err => next(err))
}

exports.deleteToDo = (req, res, next) => {
  Promise.all([removeSingleToDo(req.params.todoId),getUser(req.params.userId)])
  .then(results=>{
    console.log(results);
    const [deletedToDo,user]=results;
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
  .catch(err=>next(err))
  
  // removeSingleToDo(req.params.todoId).then(deletedToDo => {
  //   if (deletedToDo) {
  //     getUser(req.params.userId).then(user => {
  //       if (user) {
  //         //removing the todo from the todos subdocument of the users document
  //         //We are passing the _id of the todo subdocument to be removed to the todos subdocuments array
  //         user.todos.id(req.params.todoId).remove();

  //         saveDoc(user).then(savedUser => {
  //           res.setHeader('Content-Type', 'application/json');
  //           res.status(200).json({ message: `Deleted ToDo of ${req.params.todoId}`, result: savedUser })
  //         })
  //           .catch(err => next(err))
  //       }
  //       else {
  //         let err = new Error(`User ${req.params.userId} does not exist`);
  //         err.status = 404;
  //         return next(err);
  //       }
  //     })
  //       .catch(err => next(err))
  //   }
  //   else {
  //     let err = new Error(`ToDo Item ${req.params.todoId} does not exist`);
  //     err.status = 404;
  //     return next(err);
  //   }
  // })
  //   .catch(err => next(err))
}

exports.updateToDo = (req, res, next) => {

Promise.all([updateToDo(req.params.todoId, req.body),getUser(req.params.userId)])
.then(results=>{
console.log(results);
const [todo,user]=results;
if (user) {
  let updatedToDoIndex = user.todos.findIndex(x => x._id == req.params.todoId);
  if (updatedToDoIndex !== -1) {
    user.todos[updatedToDoIndex].title = req.body.title;
    user.todos[updatedToDoIndex].completed = req.body.completed;

    saveDoc(user).then(savedUser => {
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
.console.log(err=>next(err))

  // updateToDo(req.params.todoId, req.body).then(todo => {
  //   getUser(req.params.userId).then(user => {
  //     if (user) {
  //       let updatedToDoIndex = user.todos.findIndex(x => x._id == req.params.todoId);
  //       if (updatedToDoIndex !== -1) {
  //         user.todos[updatedToDoIndex].title = req.body.title;
  //         user.todos[updatedToDoIndex].completed = req.body.completed;

  //         saveDoc(user).then(savedUser => {
  //           res.setHeader('Content-Type', 'application/json');
  //           res.status(200).json({ message: `ToDo ${req.params.todoId} has been updated successfully`, result: savedUser })
  //         })
  //           .catch(err => next(err))
  //       }
  //       else {
  //         let err = new Error(`ToDo Item ${req.params.todoId} not linked to User ${req.params.userId}`);
  //         err.status = 404;
  //         return next(err);
  //       }
  //     }
  //     else {
  //       let err = new Error(`User ${req.params.userId} does not exist`);
  //       err.status = 404;
  //       return next(err);
  //     }
  //   }).catch(err => next(err))
  // }).catch(err => next(err))
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

  Promise.all([createToDo(payload), getUser(req.params.userId)])
    .then(results => {
      console.log(results);
      const [newTodo, user] = results;
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
    .catch(err => next(err))

  // createToDo(payload).then(newTodo => {
  //   //once todo is created in ToDos collection, you need to add the todo in the Users collection as well
  //   getUser(req.params.userId).then(user => {
  //     if (user) {
  //       user.todos.push(newTodo); //update the subdocument
  //       saveDoc(user).then(savedUser => {
  //         res.setHeader('Content-Type', 'application/json');
  //         res.status(200).json({ message: "ToDo created successfully for User", result: savedUser })
  //       })
  //         .catch(err => next(err))
  //     }
  //     else {
  //       let err = new Error(`User ${req.body.userId} does not exist`);
  //       err.status = 404;
  //       return next(err);
  //     }
  //   })
  //     .catch(err => next(err));
  // })
  //   .catch(err => next(err));
}

exports.createPost = (req, res, next) => {
  let payload = JSON.parse(JSON.stringify(req.body))
  payload.userId = req.params.userId;

  Promise.all([createPost(payload), getUser(req.params.userId)]).
    then(results => {
      const [newPost, user] = results;
      if (user) {
        user.posts.push(newPost._id);
        saveDoc(user).then(savedUser => {
          res.setHeader('Content-Type', 'application/json');
          res.status(200).json({ message: `Post ${newPost._id} has been created for user ${req.params.userId}`, result: savedUser })
        }).catch(err => next(err))
      }
      else {
        let err = new Error(`User ${req.params.userId} does not exist`);
        err.status = 404;
        return next(err);
      }
    }).catch(err => next(err))


  // createPost(payload).then(newPost => {
  //   getUser(req.params.userId).then(user => {
  //     if (user) {
  //       user.posts.push(newPost._id);
  //       saveDoc(user).then(savedUser => {
  //         res.setHeader('Content-Type', 'application/json');
  //         res.status(200).json({ message: `Post ${newPost._id} has been created for user ${req.params.userId}`, result: savedUser })
  //       })
  //         .catch(err => next(err))
  //     }
  //     else {
  //       let err = new Error(`User ${req.params.userId} does not exist`);
  //       err.status = 404;
  //       return next(err);
  //     }
  //   })
  //     .catch(err => next(err))
  // })
  //   .catch(err => next(err))
}

exports.getAllPosts = (req, res, next) => {
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

  executeTasksInSequence([removeAllPostsOfUser(req.params.userId),
  updateUser(req.params.userId, { posts: [] })])
    .then(results => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json({
        message: `All Posts of the user ${req.params.userId} deleted successfully`,
        result: results
      })
    })
    .catch(err => next(err))

}

exports.deleteSinglePost = (req, res, next) => {

  Promise.all([removeSinglePost(req.params.postId), getUser(req.params.userId)])
    .then(results => {
      console.log(results);
      const [removePost, user] = results;
      console.log(user);
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
  // removeSinglePost(req.params.postId).then(deletedPost => {
  //   if (deletedPost) {
  //     getUser(req.params.userId).then(user => {
  //       //user.posts is an array of ObjectIds
  //       if (user) {
  //         let postToBeDeletedIndex = user.posts.findIndex(x => x == req.params.postId);
  //         user.posts.splice(postToBeDeletedIndex, 1);
  //         saveDoc(user).then(savedUser => {
  //           res.setHeader('Content-Type', 'application/json');
  //           res.status(200).json({
  //             message: `Post ${req.params.postId} deleted successfully`,
  //             result: savedUser
  //           })
  //         })
  //           .catch(err => next(err))
  //       }
  //       else {
  //         let err = new Error(`User ${req.params.userId} does not exist`);
  //         err.status = 404;
  //         return next(err);
  //       }
  //     })
  //       .catch(err => next(err))
  //   }
  //   else {
  //     let err = new Error(`Post ${req.params.postId} does not exist`);
  //     err.status = 404;
  //     return next(err);
  //   }
  // })
  //   .catch(err => next(err))
}

exports.getAllCommentsOfTheUser = (req, res, next) => {
  getCommentsOfAPostForAUser(req.params.userId, req.params.postId).then(comments => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({
      message: `Comments by user ${req.params.userId} retrieved successfully for Post ${req.params.postId}`,
      result: comments
    })
  }).catch(err => next(err))
}

exports.createComment = (req, res, next) => {
  let payload = JSON.parse(JSON.stringify(req.body));
  payload.postId = req.params.postId;
  payload.userId = req.params.userId;

  Promise.all([createComment(payload), getPost(req.params.postId)])
    .then(results => {
      console.log(results);
      const [newComment, post] = results;
      console.log(post);
      if (post) {
        post.comments.push(newComment._id);
        saveDoc(post).then(savedPost => {
          res.setHeader('Content-Type', 'application/json');
          res.status(200).json({
            message: `Comment created successfully for Post ${req.params.postId} by user ${req.params.userId}`,
            result: savedPost
          })
        }).catch(err => next(err))
      }
      else {
        let err = new Error(`Post ${req.params.postId} does not exist`);
        err.status = 404;
        return next(err);
      }
    })
    .catch(err => next(err))

  // createComment(payload).then(newComment => {

  //   getPost(req.params.postId).then(post => {
  //     if (post) {
  //       post.comments.push(newComment._id);
  //       saveDoc(post).then(savedPost => {
  //         res.setHeader('Content-Type', 'application/json');
  //         res.status(200).json({
  //           message: `Comment created successfully for Post ${req.params.postId} by user ${req.params.userId}`,
  //           result: savedPost
  //         })
  //       }).catch(err => next(err))
  //     }
  //     else {
  //       let err = new Error(`Post ${req.params.postId} does not exist`);
  //       err.status = 404;
  //       return next(err);
  //     }

  //   }).catch(err => next(err))

  // })
  //   .catch(err => next(err))
}

exports.deleteAllCommentsForAPPost = (req, res, next) => {
  executeTasksInSequence([removeAllCommentsOfPost(req.params.userId, req.params.postId),
  updatePost(req.params.postId, { comments: [] })])
    .then(results => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json({
        message: `Deleted all comments created by user ${req.params.userId} for post ${req.params.postId}`,
        result: results
      })
    })
    .catch(err => next(err))
  // removeAllCommentsOfPost(req.params.userId, req.params.postId).then(deletedComments => {
  //   if (deletedComments.n != 0) {
  //     updatePost(req.params.postId, { comments: [] })
  //       .then(results => {
  //         res.setHeader('Content-Type', 'application/json');
  //         res.status(200).json({
  //           message: `Deleted all comments created by user ${req.params.userId} for post ${req.params.postId}`,
  //           result: results
  //         })
  //       })
  //       .catch(err => next(err))
  //   }
  //   else {
  //     let err = new Error(`No comments found to delete for Post ${req.params.postId}`);
  //     err.status = 404;
  //     return next(err);
  //   }
  // })
  //   .catch(err => next(err))

}




