const post = require('../models/postModel');


exports.createPost = (payload,opts) => {
    return post.postModel.create([payload],opts);
}

exports.removeAllPostsOfUser = (userId,opts) => {
  return post.postModel.remove({ "userId": userId},opts); //returns the deletedCount
}

exports.removeSinglePost = (postId,opts) => {
    return post.postModel.remove({"_id":postId},opts); //retuns the deletedCount
}

exports.getPost = (postId,opts) => {
    return post.postModel.findById(postId,opts);
}

exports.updatePost = (postId, payload,opts) => {
    return post.postModel.updateOne({"_id": postId },{$set:payload},opts);
}

exports.updatePostArray=(query,payload,opts)=>{
return post.postModel.updateOne(query,payload,opts);
}
