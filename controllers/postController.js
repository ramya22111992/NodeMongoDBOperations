const { getPost, updatePost } = require('../services/postService');
const { removeSingleComment } = require('../services/commentService');
const { saveDoc } = require('../services/commonService');
const {createTransaction}=require('../db');

exports.getSinglePost = (req, res, next) => {

  getPost(req.params.postId).then(post => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({
      message: `Post ${req.params.postId} retrieved successfully`,
      result: post
    })
  })
  .catch(err => next(err))

}

exports.updatePost =(req, res, next) => {
  updatePost(req.params.postId, req.body).then(result=>{
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({
      message: `Post ${req.params.postId} updated successfully`,
      result: result
    })
  })
  .catch(err=>next(err))
}

exports.deleteSingleComment = async(req, res, next) => {
  await createTransaction(async(session)=>{
    try{
      let post=await getPost(req.params.postId);
      let comment=await removeSingleComment(req.params.commentId,session);
      if(post){
        let commentToBeDeletedIndex = post.comments.findIndex(x => x == req.params.commentId);
        post.comments.splice(commentToBeDeletedIndex, 1);
        let updatedPost=await saveDoc(post);
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({
          message: `Comment ${req.params.commentId} successfully deleted for Post ${req.params.postId}`,
          result: updatedPost
        })
      }
      else{
        let err = new Error(`Post ${req.params.postId} not found`);
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
