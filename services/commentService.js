const comment=require('../models/commentModel');

exports.createComment=(payload)=>{
    return comment.commentModel.create(payload);
}

exports.removeAllCommentsOfPost=(userId,postId)=>{
    return comment.commentModel.remove({ postId: postId,userId:userId });
}

exports.removeSingleComment=(commentId)=>{
    return comment.commentModel.findByIdAndRemove(commentId);
}

exports.getComment=(commentId)=>{
    return comment.commentModel.findById(commentId);
}

exports.getCommentsOfAPostForAUser=(userId,postId)=>{
    return comment.commentModel.find({userId:userId,postId:postId});
}

exports.updateComment=(commentId,payload)=>{
    return comment.commentModel.updateMany({_id:commentId},payload,{runValidators:true});
}

