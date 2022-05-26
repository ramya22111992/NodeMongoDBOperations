const postServiceHandlers = require('../services/postService');
const commentServiceHandlers = require('../services/commentService');
const {executeTransaction}=require('../db');
const { executeTasksInSequence,executeTasksInParallel } = require('../utility');

const postControllerHandlers={};

postControllerHandlers.getSinglePost = (req, res, next) => {
  const opts={};
  postServiceHandlers.getPost(req.params.postId,opts).then(post => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({
      message: `Post ${req.params.postId} retrieved successfully`,
      result: post
    })
  })
  .catch(err => next(err))

}

postControllerHandlers.updatePost =(req, res, next) => {
  const opts={};
  postServiceHandlers.updatePost(req.params.postId, req.body,opts).then(result=>{
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({
      message: `Post ${req.params.postId} updated successfully`,
      result: result
    })
  })
  .catch(err=>next(err))
}

postControllerHandlers.deleteSingleComment = async(req, res, next) => {
  try{
    await executeTransaction(async(session)=>{
      try{
        session.startTransaction();
        const opts = { session };
        let result=await executeTasksInSequence([
          commentServiceHandlers.removeSingleComment(req.params.commentId,opts),
          postServiceHandlers.updatePostArray({"_id":req.params.postId},{$pull:{"comments":req.params.commentId}},opts)
        ]);
        const [comment,post]=result;
        if(comment.deletedCount<1 || post.modifiedCount<1){
          let err=new Error(`Some error occured while deleting comment`);
          throw err;
        }
        else{
          await session.commitTransaction();
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

module.exports=postControllerHandlers;
