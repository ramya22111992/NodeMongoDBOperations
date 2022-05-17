
const { getUser, createUser, getAllUsers, deleteUser, updateUser,updateUserArray } = require('../services/userService')
const { removeAllToDosOfUser, removeSingleToDo, createToDo, updateToDo } = require('../services/todoService');
const { createPost, removeAllPostsOfUser, removeSinglePost, getPost, updatePost,updatePostArray } = require('../services/postService');
const { removeAllCommentsOfPost, getCommentsOfAPostForAUser, createComment } = require('../services/commentService');
const { executeTasksInSequence,executeTasksInParallel } = require('../utility');
const {executeTransaction}=require('../db');


exports.notSupportedRoute = (req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  res.status(403).json({
    message: `${req.method} is not supported on ${req.url}`
  })
}

exports.createUser = (req, res, next) => {
  const opts={};
  let payload=JSON.parse(JSON.stringify(req.body));
  createUser(payload,opts).then(newUser => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ message: `User created successfully`, result: newUser })
  })
  .catch(err => next(err))
}

exports.updateUser = (req, res, next) => {
  const opts={};
  updateUser(req.params.userId, req.body,opts).then(savedUser => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ message: `User updated successfully`, result: savedUser })
  }).catch(err => next(err))
}

exports.getUser = (req, res, next) => {
  const opts={};
  getUser(req.params.userId,opts).then(user => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ message: `All Users details retrieved successfully`, result: user })
  })
  .catch(err => next(err))
}

exports.getAllUsers = (req, res, next) => {
  const opts={};
  getAllUsers(opts).then(users => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ message: `All Users details retrieved successfully`, result: users })
  })
  .catch(err => next(err))
}

exports.deleteUser = async(req, res, next) => {
  /*
  Before deleting the user you must delete the user's todos,posts and its comments
  */
  try{
    await executeTransaction(async(session)=>{
      try{
        //session.startTransaction();
        const opts = { session };
        let user=await getUser(req.params.userId,opts);
        if(user){
          let listOfPromises = [removeAllPostsOfUser(req.params.userId,opts),
            removeAllToDosOfUser(req.params.userId,opts),
            ...user.posts.map(post => removeAllCommentsOfPost(post._id,opts))];

            let result=await executeTasksInSequence([executeTasksInParallel(listOfPromises), deleteUser(req.params.userId,opts)]);
            await session.commitTransaction();
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json({ message: `User with userId ${req.params.userId} deleted successfully`, result: result });
          }
          else{
            let err = new Error(`User ${req.params.userId} not found`);
            err.status=404;
            throw err;
          }

        }
        catch(e){
          console.log("Some error in the transaction.Aborting it");
          await session.abortTransaction();
          return next(e);
        }
        finally{
          console.log("ending session");
          await session.endSession();
        }
      })
    }
    catch(e){
      console.log("Some error occured while starting mongoose session",e);
      return next(e);
    }
  }

  exports.deleteAllToDosOfUser = async(req, res, next) => {
    try{
      await executeTransaction(async(session)=>{
        try{
          //session.startTransaction();
          const opts = { session };
          let result=await executeTasksInSequence([
            removeAllToDosOfUser(req.params.userId,opts),
            updateUser(req.params.userId,{"todos":[]},opts)
          ]);
          const [todo,user]=result;
          if(todo.deletedCount < 1 || user.modifiedCount <1){
            let err=new Error(`Some error occured while deleting the todos of the user`);
            throw err;
          }
          else{
            await session.commitTransaction();
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json({ message: `Deleted ToDo of ${req.params.userId}`, result: result })
          }
        }
        catch(e){
          console.log("Some error in the transaction.Aborting it");
          await session.abortTransaction();
          return next(e);
        }
        finally{
          console.log("ending session");
          await session.endSession();
        }
      })
    }
    catch(e){
      console.log("Some error occured while starting mongoose session",e);
      return next(e);
    }
  }

  exports.deleteToDo = async(req, res, next) => {
    try{
      await executeTransaction(async(session)=>{
        try{
          //session.startTransaction();
          const opts = { session };
          let result=await executeTasksInSequence([
            removeSingleToDo(req.params.todoId,opts),
            updateUserArray({"_id":req.params.userId},{$pull:{"todos":req.params.todoId}},opts)
          ]);
          const [todo,user]=result;

          if(todo.deletedCount < 1 || user.modifiedCount < 1){
            let err=new Error(`Some error occured while deleting the todos of the user`);
            throw err;
          }
          else{
            await session.commitTransaction();
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json({ message: `Deleted ToDo of ${req.params.todoId}`, result: result })
          }

        }
        catch(e){
          console.log("Some error in the transaction.Aborting it");
          await session.abortTransaction();
          return next(e);
        }
        finally{
          console.log("ending session");
          await session.endSession();
        }

      })
    }
    catch(e){
      console.log("Some error occured while starting mongoose session",e);
      return next(e);
    }
  }

  exports.updateToDo =async(req, res, next) => {
    /*
    example where 2 tasks are not dependent on each other to run in sequence
    */
    try{
      await executeTransaction(async(session)=>{
        try{
          //session.startTransaction();
          const opts = { session };
          let userUpdateQuery={"_id":req.params.userId,"todos._id":req.params.todoId};
          let userUpdatePayload={$set:{"todos.$.title":req.body.title,"todos.$.completed":req.body.completed}}
          let result= await executeTasksInSequence([
            updateToDo(req.params.todoId, req.body,opts),
            updateUserArray(userUpdateQuery,userUpdatePayload,opts)
          ]);
          const [todo,user]=result;
          if(todo.modifiedCount < 1 || user.modifiedCount < 1){
            let err=new Error(`Some error occured while updating the todo item`);
            throw err;
          }
          else{
            await session.commitTransaction();
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json({ message: `ToDo ${req.params.todoId} has been updated successfully`, result: result })
          }
        }
        catch(e){
          console.log("Some error in the transaction.Aborting it");
          await session.abortTransaction();
          return next(e);
        }
        finally{
          console.log("ending session");
          await session.endSession();
        }
      });
    }
    catch(e){
      console.log("Some error occured while starting mongoose session",e);
      return next(e);
    }
  }

  exports.getToDo = (req, res, next) => {
    //findById means find based on the _id field in the document
    const opts={};
    getUser(req.params.userId,opts).then(user => {
      if (user) {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({ message: `Retrieved ToDo details`, result: user.todos })
      }
      else {
        let err = new Error(`User ${req.params.userId} does not exist`);
        err.status=404;
        throw err; //will be caught in the catch block
      }
    })
    .catch(err => next(err))
  }

exports.createToDo = async(req, res, next) => {
    try{
      await executeTransaction(async(session)=>{
        try{
          //session.startTransaction();
          const opts = { session };
          let payload = JSON.parse(JSON.stringify(req.body));
          payload.userId = req.params.userId;
          let newTodo=await createToDo(payload,opts);
          let updatedUser= await updateUserArray({"_id":req.params.userId},{$push:{"todos":newTodo}},opts);
          if(!newTodo || updatedUser.modifiedCount < 1){
            let err=new Error(`Some error while creating todo item for user ${req.params.userId}`);
            throw err;
          }
          else{
            await session.commitTransaction();
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json({ message: "ToDo created successfully for User", result: updatedUser })
          }
        }
        catch(e){
          console.log("Some error in the transaction.Aborting it");
          await session.abortTransaction();
          return next(e);
        }
        finally{
          console.log("ending session");
          await session.endSession();
        }
      })
    }
    catch(e){
      console.log("Some error occured while starting mongoose session",e);
      return next(e);
    }
  }

exports.createPost = async(req, res, next) => {
    /*
    example scenario when updating user requires result from the createPost to complete.
    */
try{
  //await is required here in case the executeTransaction throws an error while starting session. Only if await is there
  //the error thrown from db.js will be caught in outer catch block of controller method.
  await executeTransaction(async(session)=>{
    try{
      //session.startTransaction();
      const opts = { session };
      let payload = JSON.parse(JSON.stringify(req.body))
      payload.userId = req.params.userId;
      let newPost=await createPost(payload,opts); //create post in posts collection
      let updatedUser=await updateUserArray({"_id":req.params.userId},{$push:{"posts":newPost[0]._id}},opts);

      if(updatedUser.modifiedCount < 1 || !newPost.length){
        let err=new Error(`Some error occured creating post for ${req.params.userId}`);
        err.status=404;
        throw err;
    }
    else{
        await session.commitTransaction();
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({ message: `Post ${newPost[0]._id} has been created for user ${req.params.userId}`, result: updatedUser })
      }
    }
    catch(e){
      console.log("Caught in the controller catch block");
      await session.abortTransaction();
      return next(e)
    }
    finally{
      console.log("ending session");
      await session.endSession();
    }
  })
}
catch(e){
  console.log("Error occured while starting the transaction session",e);
  return next(e);
}

}

exports.getAllPosts = (req, res, next) => {
  const opts={};
  getUser(req.params.userId,opts).populate({
    path: 'posts'
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
      err.status=404;
      throw err;
    }
  })
  .catch(err => next(err))
}


exports.deleteAllPostsOfUser = async(req, res, next) => {
  try{
    await executeTransaction(async(session)=>{
      try{
        //session.startTransaction();
        const opts = { session };
        let result=await executeTasksInSequence([
          removeAllPostsOfUser(req.params.userId,opts),
          updateUser(req.params.userId,{"posts":[]},opts)
        ]);
        const [post,user]=result;
        if(post.deletedCount < 1 || user.modifiedCount < 1){
        let err=new Error(`Some error occured while deleting the posts`);
        throw err;
        }
        else{
        await session.commitTransaction();
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({
        message: `All Posts of the user ${req.params.userId} deleted successfully`,
        result: result
      })
      }
    }
    catch(e){
      console.log("Some error in the transaction.Aborting it");
      await session.abortTransaction();
      return next(e);
    }
    finally{
      console.log("ending session");
      await session.endSession();
    }

  })
}
catch(e){
  console.log("Some error occured while starting mongoose session",e);
  return next(e);
}
}

exports.deleteSinglePost = async(req, res, next) => {
  try{
    await executeTransaction(async(session)=>{
      try{
      //  session.startTransaction();
        const opts = { session };
        let result=await executeTasksInSequence([
          removeSinglePost(req.params.postId,opts),//remove post from posts collection
          updateUserArray({"_id":req.params.userId},{$pull:{"posts":req.params.postId}},opts)
        ]);
        const [todo,user]=result;
        if(todo.deletedCount < 1 || user.modifiedCount < 1){
          let err=new Error(`Some error occured deleting post ${req.params.postId}`);
          throw err;
         }
        else{
          await session.commitTransaction();
          res.setHeader('Content-Type', 'application/json');
          res.status(200).json({
            message: `Post ${req.params.postId} deleted successfully`,
            result: result
          })
        }

      }
      catch(e){
        console.log("Some error in the transaction.Aborting it");
        await session.abortTransaction();
        return next(e);
      }
      finally{
        console.log("ending session");
        await session.endSession();
      }

    })
  }
  catch(e){
    console.log("Some error occured while starting mongoose session",e);
    return next(e);
  }
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

exports.createComment = async(req, res, next) => {
  try{
    await executeTransaction(async(session)=>{
      try{
      //  session.startTransaction();
        const opts = { session };
        let payload = JSON.parse(JSON.stringify(req.body));
        payload.postId = req.params.postId;
        payload.userId = req.params.userId;
        let newComment=await createComment(payload,opts);
        let updatedPost=await updatePostArray({"_id":req.params.postId},{$push:{"comments":newComment[0]._id}},opts);

        if (!newComment.length || updatedPost.modifiedCount < 1) {
          let err = new Error(`Some error occured creating comment for post ${req.params.postId}`);
          err.status=404;
          throw err;
        }
        else {
          await session.commitTransaction();
          res.setHeader('Content-Type', 'application/json');
          res.status(200).json({
            message: `Comment created successfully for Post ${req.params.postId} by user ${req.params.userId}`,
            result: updatedPost
          })
        }

      }
      catch(e){
        console.log("Some error in the transaction.Aborting it");
        await session.abortTransaction();
        return next(e);
      }
      finally{
        console.log("ending session");
        await session.endSession();
      }
    })
  }
  catch(e){
    console.log("Some error occured while starting mongoose session",e);
    return next(e);
  }

}

exports.deleteAllCommentsForAPPost = async(req, res, next) => {
  try{
    await executeTransaction(async(session)=>{
      try{
        //session.startTransaction();
        const opts = { session };
        let result=await executeTasksInSequence([
          removeAllCommentsOfPost(req.params.userId, req.params.postId,opts),
          updatePost(req.params.postId,{"comments":[]},opts)
        ]);

        const [comment,post]=result;

        if(comment.deletedCount < 1 || post.modifiedCount < 1){
          let err=new Error(`Some error occured while deleting the comments of the post`);
          throw err;
        }
        else{
          await session.commitTransaction();
          res.setHeader('Content-Type', 'application/json');
          res.status(200).json({
            message: `Deleted all comments created by user ${req.params.userId} for post ${req.params.postId}`,
            result: result
          })
        }
      }
      catch(e){
        console.log("Some error in the transaction.Aborting it");
        await session.abortTransaction();
        return next(e);
      }
      finally{
        console.log("ending session");
        await session.endSession();
      }

    })
  }
  catch(e){
    console.log("Some error occured while starting mongoose session",e);
    return next(e);
  }
}
