const userModel = require('../models/userModel');

const userServiceHandlers={};

userServiceHandlers.getUser=(userId,opts)=>{
    return userModel.findById(userId,opts);
}

userServiceHandlers.getAllUsers=(opts)=>{
    return userModel.find({},opts);
}

userServiceHandlers.deleteUser=(userId,opts)=>{
    return userModel.remove({"_id":userId},opts); //returns deletedCount
}

userServiceHandlers.updateUser=(userId,payload,opts)=>{
    return userModel.updateOne({"_id":userId},{$set:payload},opts);
}

userServiceHandlers.updateUserArray=(query,payload,opts)=>{
return userModel.updateOne(query,payload,opts);
}

module.exports=userServiceHandlers;
