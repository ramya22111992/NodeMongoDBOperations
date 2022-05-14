const { getPost, updatePost,updatePostArray } = require('../services/postService');
const { removeSingleComment } = require('../services/commentService');
const {createTransaction}=require('../db');
const { executeTasksInSequence,executeTasksInParallel } = require('../utility');


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
  try{
    await createTransaction(async(session)=>{
      try{
        let result=await executeTasksInSequence([
          removeSingleComment(req.params.commentId,session),
          updatePostArray({"_id":req.params.postId},{$pull:{"comments":req.params.commentId}})
        ]);
        const [comment,post]=result;
        if(comment.deletedCount<1 || post.modifiedCount<1){
          let err=new Error(`Some error occured while deleting comment`);
          throw err;
        }
        else{
          res.setHeader('Content-Type', 'application/json');
          res.status(200).json({
            message: `Comment ${req.params.commentId} successfully deleted for Post ${req.params.postId}`,
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
