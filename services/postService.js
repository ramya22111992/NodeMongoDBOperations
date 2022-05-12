const post = require('../models/postModel');

exports.createPost = (payload) => {
    return post.postModel.create(payload);
}

exports.removeAllPostsOfUser = (userId,session=null) => {
    return session ? post.postModel.deleteOne({ "userId": userId }).session(session) :
    post.postModel.deleteOne({ "userId": userId });
}

exports.removeSinglePost = (postId,session=null) => {
    return session ? post.postModel.findByIdAndRemove(postId).session(session):
    post.postModel.findByIdAndRemove(postId);
}

exports.getPost = (postId) => {
    return post.postModel.findById(postId);
}

exports.updatePost = (postId, payload,session=null) => {
    return session ? post.postModel.updateOne({"_id": postId },{$set:payload}, { runValidators: true }).session(session):
    post.postModel.updateOne({ "_id": postId },{$set:payload}, { runValidators: true });
}
