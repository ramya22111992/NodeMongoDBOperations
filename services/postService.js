const post = require('../models/postModel');

exports.createPost = (payload) => {
    return post.postModel.create(payload);
}

exports.removeAllPostsOfUser = (userId) => {
    return post.postModel.remove({ userId: userId });
}

exports.removeSinglePost = (postId) => {
    return post.postModel.findByIdAndRemove(postId);
}

exports.getPost = (postId) => {
    return post.postModel.findById(postId);
}

exports.updatePost = (postId, payload) => {
    return post.postModel.updateMany({ _id: postId }, payload, { runValidators: true });
}