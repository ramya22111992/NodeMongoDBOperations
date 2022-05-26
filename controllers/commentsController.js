const comment = require('../models/commentModel');
const commentServiceHandlers=require('../services/commentService');

const commentsControllerHandlers={};

commentsControllerHandlers.getComment = (req, res, next) => {
  const opts={};
    commentServiceHandlers.getComment(req.params.commentId,opts).then(comment => {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json({
                message: `Comment ${req.params.commentId} retrieved successfully`,
                result: comment
            })
    })
        .catch(err => next(err))
}

commentsControllerHandlers.updateComment = (req, res, next) => {
  const opts={};
    commentServiceHandlers.updateComment(req.params.commentId,req.body,opts).then(savedComment=>{
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({
            message: `Comment ${req.params.commentId} updated successfully`,
            result: savedComment
        })
    })
    .catch(err=>next(err))
}

module.exports=commentsControllerHandlers;
