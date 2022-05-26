const comment=require('../models/commentModel');

const commentServiceHandlers={};

commentServiceHandlers.createComment=(payload,opts)=>{
    return comment.commentModel.create([payload],opts);
}

commentServiceHandlers.removeAllCommentsOfPost=(userId,postId,opts)=>{
    return comment.commentModel.remove({ "postId": postId,"userId":userId },opts); //returns deletedCount
}

commentServiceHandlers.removeSingleComment=(commentId,opts)=>{
    return comment.commentModel.remove({"_id":commentId},opts);//returns deletedCount
}

commentServiceHandlers.getComment=(commentId,opts)=>{
    return comment.commentModel.findById(commentId,opts);
}

commentServiceHandlers.getCommentsOfAPostForAUser=(userId,postId,opts)=>{
    return comment.commentModel.find({"userId":userId,"postId":postId},opts);
}

commentServiceHandlers.updateComment=(commentId,payload,opts)=>{
    return comment.commentModel.updateOne({"_id":commentId},{$set:payload},opts);
}

module.exports=commentServiceHandlers;
