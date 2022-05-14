const userModel = require('../models/userModel');

exports.createUser=(payload,session=null)=>{
return userModel.create([payload],{session});
}

exports.getUser=(userId)=>{
    return userModel.findById(userId);
}

exports.getAllUsers=()=>{
    return userModel.find({});
}

exports.deleteUser=(userId,session=null)=>{
    return userModel.remove({"_id":userId},{session}); //returns deletedCount
}

exports.deleteAllUsers=(session=null)=>{
    return userModel.remove({},{session});
}

exports.updateUser=(userId,payload,session=null)=>{
    return userModel.updateOne({"_id":userId},{$set:payload},{session});
}

exports.updateUserArray=(query,payload,session=null)=>{
return userModel.updateOne(query,payload,{session});
}
