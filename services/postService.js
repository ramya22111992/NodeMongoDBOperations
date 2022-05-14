const post = require('../models/postModel');


exports.createPost = (payload,session=null) => {
    return post.postModel.create([payload],{session});
}

exports.removeAllPostsOfUser = (userId,session=null) => {
  return post.postModel.remove({ "userId": userId},{session}); //returns the deletedCount
}

exports.removeSinglePost = (postId,session=null) => {
    return post.postModel.remove({"_id":postId},{session}); //retuns the deletedCount
}

exports.getPost = (postId) => {
    return post.postModel.findById(postId);
}

exports.updatePost = (postId, payload,session=null) => {
    return post.postModel.updateOne({"_id": postId },{$set:payload},{session});
}

exports.updatePostArray=(query,payload,session=null)=>{
return post.postModel.updateOne(query,payload,{session});
}
