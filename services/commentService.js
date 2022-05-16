const comment=require('../models/commentModel');

exports.createComment=(payload,opts)=>{
    return comment.commentModel.create([payload],opts);
}

exports.removeAllCommentsOfPost=(userId,postId,opts)=>{
    return comment.commentModel.remove({ "postId": postId,"userId":userId },opts); //returns deletedCount
}

exports.removeSingleComment=(commentId,opts)=>{
    return comment.commentModel.remove({"_id":commentId},opts);//returns deletedCount
}

exports.getComment=(commentId,opts)=>{
    return comment.commentModel.findById(commentId,opts);
}

exports.getCommentsOfAPostForAUser=(userId,postId,opts)=>{
    return comment.commentModel.find({"userId":userId,"postId":postId},opts);
}

exports.updateComment=(commentId,payload,opts)=>{
    return comment.commentModel.updateOne({"_id":commentId},{$set:payload},opts);
}
