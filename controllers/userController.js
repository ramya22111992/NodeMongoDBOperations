const userModel = require('../models/userModel');
const todo = require('../models/todoModel');
const post = require('../models/postModel');

exports.createUser = (req, res, next) => {
  userModel.create(req.body).then(newUser => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ message: `User created successfully`, result: newUser })
  })
    .catch(err => next(err))
}

exports.getUser = (req, res, next) => {
  let getUserProm = req.params.userId ? userModel.findById(req.params.userId) : userModel.find({});
  getUserProm.then(users => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ message: `All Users details retrieved successfully`, result: users })
  })
    .catch(err => next(err))
}

exports.deleteUser = (req, res, next) => {
  let deleteUserProm = req.params.userId ? userModel.findByIdAndRemove(req.params.userId) : userModel.remove({});

  deleteUserProm.then(user => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ message: `User with userId ${req.params.userId} deleted successfully`, result: user });
  })
    .catch(err => next(err))
}

exports.getAllTodosOfUser = (req, res, next) => {
  userModel.findById(req.params.userId).then(user => {
    if (user) {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json({
        message: `ToDos of the user ${req.params.userId} retrieved successfully`,
        result: user.todos
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

exports.deleteAllToDosOfUser = (req, res, next) => {

  todo.todoModel.remove({ userId: req.params.userId }).then(userToDos => {
    //once all todos for the given user deleted from ToDos collection,delete from the Users collection as well

    userModel.findById(req.params.userId).then(userInfo => {
      if (userInfo) {
        //remove all objects from the todos subdocument
        for (let i = (userInfo.todos.length - 1); i >= 0; i--) {
          userInfo.todos.id(userInfo.todos[i]._id).remove();
        }
        userInfo.save((err, savedUser) => {
          if (err) {
            return next(err)
          }
          else {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json({ message: `Deleted all ToDos of ${req.params.userId}`, result: savedUser })
          }
        })
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

exports.deleteToDo = (req, res, next) => {
  todo.todoModel.findByIdAndRemove(req.params.todoId).then(deletedToDo => {
    if (deletedToDo) {
      userModel.findById(req.params.userId).then(user => {
        if (user) {
          //removing the todo from the todos subdocument of the users document
          //We are passing the _id of the todo subdocument to be removed to the todos subdocuments array
          user.todos.id(req.params.todoId).remove();
          user.save((err, savedUser) => {
            if (err) {
              return next(err);
            }
            else {
              res.setHeader('Content-Type', 'application/json');
              res.status(200).json({ message: `Deleted ToDo of ${req.params.todoId}`, result: savedUser })
            }
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
    else {
      let err = new Error(`ToDo Item ${req.params.todoId} does not exist`);
      err.status = 404;
      return next(err);
    }
  })
    .catch(err => next(err))
}

exports.updateToDo = (req, res, next) => {
  todo.todoModel.findById(req.params.todoId).then(todo => {
    if (todo) {
      todo.title = req.body.title;
      todo.completed = req.body.completed;

      todo.save((err, updatedToDo) => {
        //save the todos document
        if (err) {
          return next(err);
        }
        else {

          userModel.findById(req.params.userId).then(user => {
            if (user) {
              let updatedToDoIndex = user.todos.findIndex(x => x._id == req.params.todoId);
              if (updatedToDoIndex !== -1) {
                user.todos[updatedToDoIndex].title = req.body.title;
                user.todos[updatedToDoIndex].completed = req.body.completed;

                user.save((err, savedUser) => {
                  //save the users document
                  if (err) {
                    return next(err);
                  }
                  else {
                    res.setHeader('Content-Type', 'application/json');
                    res.status(200).json({ message: `ToDo ${req.params.todoId} has been updated successfully`, result: savedUser })
                  }
                })
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
        }
      })
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
  todo.todoModel.findById(req.params.todoId).then(todo => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ message: `Retrieved ToDo ${req.params.todoId} details`, result: todo })
  })
    .catch(err => next(err))
}

exports.createToDo = (req, res, next) => {
  let payload = JSON.parse(JSON.stringify(req.body));
  payload.userId = req.params.userId;
  todo.todoModel.create(payload).then(newTodo => {
    //once todo is created in ToDos collection, you need to add the todo in the Users collection as well
    userModel.findById(req.params.userId).then(user => {
      if (user) {
        user.todos.push(newTodo); //update the subdocument
        user.save((err, savedUser) => { //save the users document
          if (err) {
            return next(err);
          }
          else {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json({ message: "ToDo created successfully for User", result: newTodo })
          }
        })
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
  let payload = JSON.parse(JSON.stringify(req.body));
  payload.userId = req.params.userId;
  post.postModel.create(payload).then(newPost => {
    userModel.findById(req.params.userId).then(user => {
      user.posts.push(newPost._id);
      user.save((err, savedUser) => {
        if (err) {
          return next(err);
        }
        else {
          res.setHeader('Content-Type', 'application.json');
          res.status(200).json({ message: `Post ${newPost._id} has been created for user ${req.params.userId}`, result: savedUser })
        }
      })
    })
      .catch(err => next(err))
  })
    .catch(err => next(err))
}

exports.getAllPostsOfUser = (req, res, next) => {
  userModel.findById(req.params.userId).populate('posts').then(user => {
    if (user) {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json({
        message: `Posts of the user ${req.params.userId} retrieved successfully`,
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
  post.postModel.remove({ userId: req.params.userId }).then(deletedPosts => {
    userModel.findById(req.params.userId).then(user => {
      user.posts = [];
      user.save((err, savedUser) => {
        if (err) {
          return next(err)
        }
        else {
          res.setHeader('Content-Type', 'application/json');
          res.status(200).json({
            message: `All Posts of the user ${req.params.userId} deleted successfully`,
            result: savedUser
          })
        }
      })
    })
      .catch(err => next(err))
  })
    .catch(err => next(err))
}