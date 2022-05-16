const userModel = require('../models/userModel');

exports.createUser=(payload,opts)=>{
return userModel.create([payload],opts);
}

exports.getUser=(userId,opts)=>{
    return userModel.findById(userId,opts);
}

exports.getAllUsers=(opts)=>{
    return userModel.find({},opts);
}

exports.deleteUser=(userId,opts)=>{
    return userModel.remove({"_id":userId},opts); //returns deletedCount
}

exports.updateUser=(userId,payload,opts)=>{
    return userModel.updateOne({"_id":userId},{$set:payload},opts);
}

exports.updateUserArray=(query,payload,opts)=>{
return userModel.updateOne(query,payload,opts);
}
