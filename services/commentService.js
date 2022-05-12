const comment=require('../models/commentModel');

exports.createComment=(payload)=>{
    return comment.commentModel.create(payload);
}

exports.removeAllCommentsOfPost=(userId,postId,session=null)=>{
    return session ? comment.commentModel.remove({ "postId": postId,"userId":userId }).session(session):
    comment.commentModel.remove({ "postId": postId,"userId":userId });
}

exports.removeSingleComment=(commentId,session=null)=>{
    return session ? comment.commentModel.findByIdAndRemove(commentId).session(session) :
    comment.commentModel.findByIdAndRemove(commentId);
}

exports.getComment=(commentId)=>{
    return comment.commentModel.findById(commentId);
}

exports.getCommentsOfAPostForAUser=(userId,postId)=>{
    return comment.commentModel.find({"userId":userId,"postId":postId});
}

exports.updateComment=(commentId,payload,session=null)=>{
    return session ? comment.commentModel.updateOne({"_id":commentId},{$set:payload},{runValidators:true}).session(session):
    comment.commentModel.updateOne({"_id":commentId},{$set:payload},{runValidators:true});
}
