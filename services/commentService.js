const comment=require('../models/commentModel');

exports.createComment=(payload)=>{
    return comment.commentModel.create(payload);
}

exports.removeAllCommentsOfPost=(postId)=>{
    return comment.commentModel.remove({ postId: postId });
}

exports.removeSingleComment=(commentId)=>{
    return comment.commentModel.findByIdAndRemove(commentId);
}

exports.getComment=(commentId)=>{
    return comment.commentModel.findById(commentId);
}

