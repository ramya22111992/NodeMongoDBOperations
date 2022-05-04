const {getPost}=require('../services/postService');
const {createComment,removeAllCommentsOfPost,removeSingleComment}=require('../services/commentService');
const {saveDoc}=require('../services/commonService');


exports.getPost = (req, res, next) => {

  getPost(req.params.postId).then(post => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({
      message: `Post ${req.params.postId} retrieved successfully`,
      result: post
    })
  })
    .catch(err => next(err))

}

exports.updatePost = (req, res, next) => {

  getPost(req.params.postId).then(post => {
    if (post) {
      post.title = req.body.title;
      post.body = req.body.body;
      saveDoc(post).then(savedPost=>{
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({
          message: `Post ${req.params.postId} updated successfully`,
          result: savedPost
        })
      })
      .catch(err=>next(err))
    }
    else {
      let err = new Error(`Post ${req.params.postId} does not exist`);
      err.status = 404;
      return next(err);
    }
  })
    .catch(err => next(err))

}

exports.createComment = (req, res, next) => {
  let payload = JSON.parse(JSON.stringify(req.body));
  payload.postId = req.params.postId;
  createComment(payload).then(newComment => {
    getPost(req.params.postId).then(post => {
      post.comments.push(newComment._id);
      saveDoc(post).then(savedPost=>{
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({
          message: `Comment created successfully for Post ${req.params.postId}`,
          result: savedPost
        })
      })
      .catch(err=>next(err))
      
    })
      .catch(err => next(err))
  })
    .catch(err => next(err))
}

exports.deleteAllCommentsForAPPost = (req, res, next) => {
  removeAllCommentsOfPost(req.params.postId).then(deletedComments => {
    if (deletedComments.n != 0) {
      getPost(req.params.postId).then(post => {
        post.comments = [];
        saveDoc(post).then(savedPost=>{
          res.setHeader('Content-Type', 'application/json');
          res.status(200).json({
            message: `Deleted all comments for post ${req.params.postId}`,
            result: savedPost
          })
        })
        .catch(err=>next(err))
      })
        .catch(err => next(err))
    }
    else {
      let err = new Error(`No comments found to delete for Post ${req.params.postId}`);
      err.status = 404;
      return next(err);
    }
  })
    .catch(err => next(err))

}

exports.getAllCommentsForPost = (req, res, next) => {
  getPost(req.params.postId).populate('comments').then(post => {
    if (post) {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json({
        message: `Comment successfully retreived for Post ${req.params.postId}`,
        result: post.comments
      })
    }
    else {
      let err = new Error(`Post ${req.params.postId} does not exist`);
      err.status = 404;
      return next(err);
    }
  })
    .catch(err => next(err))
}

exports.deleteSingleComment=(req,res,next)=>{
  removeSingleComment(req.params.commentId).then(deletedComment=>{
    if(deletedComment){
      getPost(req.params.postId).then(post=>{
      if(post){
      let commentToBeDeletedIndex=post.comments.findIndex(x=>x==req.params.commentId);
      post.comments.splice(commentToBeDeletedIndex,1);
      saveDoc(post).then(savedPost=>{
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({
          message: `Comment ${req.params.commentId} successfully deleted for Post ${req.params.postId}`,
          result: post.comments
        })
      })
      .catch(err=>next(err))
      }
      else{
        let err=new Error(`Post ${req.params.postId} not found`);
        err.status=404;
        return next(err)
      }
      })
      .catch(err=>next(err))
    }
    else{
      let err=new Error(`Comment ${req.params.commentId} not found`);
      err.status=404;
      return next(err)
    }
  })
}

