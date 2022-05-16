const comment = require('../models/commentModel');
const {getComment,updateComment}=require('../services/commentService');
const {createTransaction}=require('../db');

exports.getComment = (req, res, next) => {
  const opts={};
    getComment(req.params.commentId,opts).then(comment => {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json({
                message: `Comment ${req.params.commentId} retrieved successfully`,
                result: comment
            })
    })
        .catch(err => next(err))
}

exports.updateComment = (req, res, next) => {
  const opts={};
    updateComment(req.params.commentId,req.body,opts).then(savedComment=>{
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({
            message: `Comment ${req.params.commentId} updated successfully`,
            result: savedComment
        })
    })
    .catch(err=>next(err))
}
