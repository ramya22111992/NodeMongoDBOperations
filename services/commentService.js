const comment=require('../models/commentModel');

exports.createComment=(payload,session=null)=>{
    return comment.commentModel.create([payload],session);
}

exports.removeAllCommentsOfPost=(userId,postId,session=null)=>{
    return comment.commentModel.remove({ "postId": postId,"userId":userId },{session}); //returns deletedCount
}

exports.removeSingleComment=(commentId,session=null)=>{
    return comment.commentModel.remove({"_id":commentId},{session});//returns deletedCount
}

exports.getComment=(commentId)=>{
    return comment.commentModel.findById(commentId);
}

exports.getCommentsOfAPostForAUser=(userId,postId)=>{
    return comment.commentModel.find({"userId":userId,"postId":postId},{session});
}

exports.updateComment=(commentId,payload,session=null)=>{
    return comment.commentModel.updateOne({"_id":commentId},{$set:payload},{session});
}
