const userModel = require('../models/userModel');

exports.createUser=(payload)=>{
return userModel.create(payload);
}

exports.getUser=(userId)=>{
    return userModel.findById(userId);
}

exports.getAllUsers=()=>{
    return userModel.find({});
}

exports.deleteUser=(userId)=>{
    return userModel.findByIdAndRemove(userId);
}

exports.deleteAllUsers=()=>{
    return userModel.remove({});
}

exports.saveUserDocument=(userDoc)=>{
    return userDoc.save();
}