const { getPost, updatePost } = require('../services/postService');
const { removeSingleComment } = require('../services/commentService');
const { saveDoc } = require('../services/commonService');

exports.getSinglePost = (req, res, next) => {

  getPost(req.params.postId).then(post => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({
      message: `Post ${req.params.postId} for User ${req.params.userId} retrieved successfully`,
      result: post
    })
  })
    .catch(err => next(err))

}


exports.updatePost = (req, res, next) => {
  updatePost(req.params.postId, req.body).then(results => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({
      message: `Post ${req.params.postId} updated successfully`,
      result: results
    })
  })
    .catch(err => next(err))
  // getPost(req.params.postId).then(post => {
  //   if (post) {
  //     post.title = req.body.title;
  //     post.body = req.body.body;
  //     saveDoc(post).then(savedPost=>{
  //       res.setHeader('Content-Type', 'application/json');
  //       res.status(200).json({
  //         message: `Post ${req.params.postId} updated successfully`,
  //         result: savedPost
  //       })
  //     })
  //     .catch(err=>next(err))
  //   }
  //   else {
  //     let err = new Error(`Post ${req.params.postId} does not exist`);
  //     err.status = 404;
  //     return next(err);
  //   }
  // })
  //   .catch(err => next(err))

}

exports.deleteSingleComment = (req, res, next) => {
  Promise.all([removeSingleComment(req.params.commentId), getPost(req.params.postId)])
    .then(results => {
      console.log(results);
      const [deletedComment, post] = results;
      if (post) {
        let commentToBeDeletedIndex = post.comments.findIndex(x => x == req.params.commentId);
        post.comments.splice(commentToBeDeletedIndex, 1);
        saveDoc(post).then(savedPost => {
          res.setHeader('Content-Type', 'application/json');
          res.status(200).json({
            message: `Comment ${req.params.commentId} created by user ${req.params.userId} successfully deleted for Post ${req.params.postId}`,
            result: savedPost
          })
        })
          .catch(err => next(err))
      }
      else {
        let err = new Error(`Post ${req.params.postId} not found`);
        err.status = 404;
        return next(err)
      }
    })
    .catch(err => next(err))
  // removeSingleComment(req.params.commentId).then(deletedComment => {
  //   if (deletedComment) {
  //     getPost(req.params.postId).then(post => {
  //       if (post) {
  //         let commentToBeDeletedIndex = post.comments.findIndex(x => x == req.params.commentId);
  //         post.comments.splice(commentToBeDeletedIndex, 1);
  //         saveDoc(post).then(savedPost => {
  //           res.setHeader('Content-Type', 'application/json');
  //           res.status(200).json({
  //             message: `Comment ${req.params.commentId} created by user ${req.params.userId} successfully deleted for Post ${req.params.postId}`,
  //             result: savedPost
  //           })
  //         })
  //           .catch(err => next(err))
  //       }
  //       else {
  //         let err = new Error(`Post ${req.params.postId} not found`);
  //         err.status = 404;
  //         return next(err)
  //       }
  //     })
  //       .catch(err => next(err))
  //   }
  //   else {
  //     let err = new Error(`Comment ${req.params.commentId} not found`);
  //     err.status = 404;
  //     return next(err)
  //   }
  // })
}



