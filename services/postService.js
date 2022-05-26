const post = require('../models/postModel');
const postServiceHandlers={};

postServiceHandlers.createPost = (payload,opts) => {
    return post.postModel.create([payload],opts);
}

postServiceHandlers.removeAllPostsOfUser = (userId,opts) => {
  return post.postModel.remove({ "userId": userId},opts); //returns the deletedCount
}

postServiceHandlers.removeSinglePost = (postId,opts) => {
    return post.postModel.remove({"_id":postId},opts); //retuns the deletedCount
}

postServiceHandlers.getPost = (postId,opts) => {
    return post.postModel.findById(postId,opts);
}

postServiceHandlers.updatePost = (postId, payload,opts) => {
    return post.postModel.updateOne({"_id": postId },{$set:payload},opts);
}

postServiceHandlers.updatePostArray=(query,payload,opts)=>{
return post.postModel.updateOne(query,payload,opts);
}

module.exports=postServiceHandlers;
