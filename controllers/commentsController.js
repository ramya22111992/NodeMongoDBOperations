const comment = require('../models/commentModel');
const {getComment}=require('../services/commentService');
const {saveDoc}=require('../services/commonService');

exports.getComment = (req, res, next) => {
    getComment(req.params.commentId).then(comment => {
        if (comment) {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json({
                message: `Comment ${req.params.commentId} retrieved successfully`,
                result: comment
            })
        }
        else {
            let err = new Error(`Comment ${req.params.commentId} not found`);
            err.status = 404;
            return next(err);
        }
    })
        .catch(err => next(err))
}

exports.updateComment = (req, res, next) => {
    getComment(req.params.commentId).then(comment=>{
    comment.name=req.body.name;
    comment.email=req.body.email;
    comment.body=req.body.body;

    saveDoc(comment).then(savedComment=>{
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({
            message: `Comment ${req.params.commentId} updated successfully`,
            result: savedComment
        })
    })
    .catch(err=>next(err))
   })
   .catch(err=>next(err))
}
