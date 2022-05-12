
const { getUser, createUser, getAllUsers, deleteUser, updateUser,updateUserArray } = require('../services/userService')
const { removeAllToDosOfUser, removeSingleToDo, createToDo, updateToDo } = require('../services/todoService');
const { createPost, removeAllPostsOfUser, removeSinglePost, getPost, updatePost } = require('../services/postService');
const { removeAllCommentsOfPost, getCommentsOfAPostForAUser, createComment } = require('../services/commentService');
const { saveDoc } = require('../services/commonService');
const { executeTasksInSequence,executeTasksInParallel } = require('../utility');
const {createTransaction}=require('../db');


exports.notSupportedRoute = (req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  res.status(403).json({
    message: `${req.method} is not supported on ${req.url}`
  })
}

exports.createUser = (req, res, next) => {
  let payload=JSON.parse(JSON.stringify(req.body));
  createUser(payload).then(newUser => {
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

exports.deleteUser = async(req, res, next) => {
  /*
  Before deleting the user you must delete the user's todos,posts and its comments
  */
  await createTransaction(async(session)=>{
    try{
      let user=await getUser(req.params.userId);
      if(user){
        let listOfPromises = [removeAllPostsOfUser(req.params.userId),
          removeAllToDosOfUser(req.params.userId),
          ...user.posts.map(post => removeAllCommentsOfPost(post._id))];

          let result=await executeTasksInSequence([executeTasksInParallel(listOfPromises), deleteUser(req.params.userId)]);

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

exports.deleteAllToDosOfUser = async(req, res, next) => {

  await createTransaction(async(session)=>{
    try{
      let user=await getUser(req.params.userId);
      let todo=await removeAllToDosOfUser(req.params.userId,session);
      if (user) {
        //removing the todo from the todos subdocument of the users document
        //We are passing the _id of the todo subdocument to be removed to the todos subdocuments array
        user.todos=[];
        let updatedUser=await saveDoc(user);

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({ message: `Deleted ToDo of ${req.params.userId}`, result: updatedUser })
      }
      else {
        let err = new Error(`User ${req.params.userId} does not exist`);
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

exports.deleteToDo = async(req, res, next) => {
  await createTransaction(async(session)=>{
    try{
      let user=await getUser(req.params.userId);
      let todo=await removeSingleToDo(req.params.todoId,session);
      if (user) {
        //removing the todo from the todos subdocument of the users document
        //We are passing the _id of the todo subdocument to be removed to the todos subdocuments array
        user.todos.id(req.params.todoId).remove();
        let updatedUser=await saveDoc(user);

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({ message: `Deleted ToDo of ${req.params.todoId}`, result: updatedUser })
      }
      else {
        let err = new Error(`User ${req.params.userId} does not exist`);
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

exports.updateToDo =async(req, res, next) => {
  await createTransaction(async(session)=>{
    try{
      let userUpdateQuery={"_id":req.params.userId,"todos._id":req.params.todoId};
      //let userUpdatePayload={$set:{"todos.$.title":req.body.title,"todos.$.completed":req.body.completed}}
      let result= await executeTasksInSequence([updateToDo(req.params.todoId, req.body,session),
        updateUserArray(userUpdateQuery,req.body,session)]);
        console.log(result);
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({ message: `ToDo ${req.params.todoId} has been updated successfully`, result: result })
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

  exports.getToDo = (req, res, next) => {
    //findById means find based on the _id field in the document
    getUser(req.params.userId).then(user => {
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

  //need to test
  exports.createToDo = async(req, res, next) => {
    await createTransaction(async(session)=>{
      try{
        let payload = JSON.parse(JSON.stringify(req.body));
        payload.userId = req.params.userId;
        let user=await getUser(req.params.userId);
        let newTodo=await createToDo(payload);

        if(user){
          user.todos.push(newTodo);
          let updatedUser=await saveDoc(user);
          res.setHeader('Content-Type', 'application/json');
          res.status(200).json({ message: "ToDo created successfully for User", result: newTodo })
        }
        else{
          let err=new Error(`User ${req.params.userId} not found`);
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

  exports.createPost = async(req, res, next) => {

    await createTransaction(async(session)=>{
      try{
        let payload = JSON.parse(JSON.stringify(req.body))
        payload.userId = req.params.userId;

        let user=await getUser(req.params.userId); //get the user detail
        let newPost=await createPost(payload); //create post in posts collection
        if(user){
          user.posts.push(newPost._id); //update the posts property in user object
          let updatedUser=await saveDoc(user); //save the user document

          res.setHeader('Content-Type', 'application/json');
          res.status(200).json({ message: `Post ${newPost._id} has been created for user ${req.params.userId}`, result: newPost })
        }
        else{
          let err=new Error(`User ${req.params.userId} not found`);
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

  exports.getAllPosts = (req, res, next) => {
    getUser(req.params.userId).populate({
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
    await createTransaction(async(session)=>{
      try{
        let user=await getUser(req.params.userId);
        let post=await removeAllPostsOfUser(req.params.userId,session);
        if(user){
          user.posts=[];
          let updatedUser=await saveDoc(user);
          res.setHeader('Content-Type', 'application/json');
          res.status(200).json({
            message: `All Posts of the user ${req.params.userId} deleted successfully`,
            result: updatedUser
          })
        }
        else{
          let err=new Error(`User ${req.params.userId} not found`);
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

  exports.deleteSinglePost = async(req, res, next) => {

    await createTransaction(async(session)=>{
      try{
        let user=await getUser(req.params.userId); //get user detail
        let post=await removeSinglePost(req.params.postId,session);//remove post from posts collection
        if(user){
          let postToBeDeletedIndex = user.posts.findIndex(x => x == req.params.postId);
          if(postToBeDeletedIndex === -1){
            let err=new Error(`Post ${req.params.postId} not created by use ${req.params.userId}`);
            throw err;
          }
          else{
            user.posts.splice(postToBeDeletedIndex, 1);//update posts pproperty of user object
            let updatedUser=await saveDoc(user); //save the updated user doc
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json({
              message: `Post ${req.params.postId} deleted successfully`,
              result: updatedUser
            })
          }
        }
        else{
          let err=new Error(`User ${req.params.userId} not found`);
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

  exports.getAllCommentsOfTheUser = (req, res, next) => {
    getCommentsOfAPostForAUser(req.params.userId, req.params.postId).then(comments => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json({
        message: `Comments by user ${req.params.userId} retrieved successfully for Post ${req.params.postId}`,
        result: comments
      })
    }).catch(err => next(err))
  }

  //need to test
  exports.createComment = async(req, res, next) => {
    await createTransaction(async(session)=>{
      try{
        let payload = JSON.parse(JSON.stringify(req.body));
        payload.postId = req.params.postId;
        payload.userId = req.params.userId;

        let post=await  getPost(req.params.postId);
        let comment=await createComment(payload);

        if (post) {
          post.comments.push(newComment._id);
          let updatedPost= await saveDoc(post);
          res.setHeader('Content-Type', 'application/json');
          res.status(200).json({
            message: `Comment created successfully for Post ${req.params.postId} by user ${req.params.userId}`,
            result: updatedPost
          })
        }
        else {
          let err = new Error(`Post ${req.params.postId} does not exist`);
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

  exports.deleteAllCommentsForAPPost = async(req, res, next) => {
    await createTransaction(async(session)=>{
      try{
        let post=await getPost(req.params.postId);
        let comment=removeAllCommentsOfPost(req.params.userId, req.params.postId,session);
        if(post){
          post.comments=[];
          let result=await saveDoc(post);
          res.setHeader('Content-Type', 'application/json');
          res.status(200).json({
            message: `Deleted all comments created by user ${req.params.userId} for post ${req.params.postId}`,
            result: result
          })
        }
        else{
          let err=new Error(`Post ${req.params.postId} not found`);
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
