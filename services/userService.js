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

exports.deleteUser=(userId,session=null)=>{
    return session ? userModel.findByIdAndRemove(userId).session(session):userModel.findByIdAndRemove(userId);
}

exports.deleteAllUsers=(session=null)=>{
    return session ? userModel.remove({}).session(session):userModel.remove({});
}

exports.updateUser=(userId,payload,session=null)=>{
  console.log(payload)
    return session ? userModel.updateOne({"_id":userId},{$set:payload},{runValidators:true}).session(session):
    userModel.updateOne({"_id":userId},{$set:payload},{runValidators:true});
}

exports.updateUserArray=(query,payload,session=null)=>{
return session ? userModel.findOneAndUpdate(query,payload,{runValidators:true,context:'query'}).session(session):
userModel.updateOne(query,payload,{runValidators:true});
}
