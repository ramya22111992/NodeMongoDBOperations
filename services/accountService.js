const userModel = require('../models/userModel');

const accountServiceHandlers={};

accountServiceHandlers.createUser=(payload,password)=>{
let newUser=new userModel(payload);
return userModel.register(newUser,password);
}

accountServiceHandlers.changePassword=(user,oldPassword,newPassword)=>{
  return user.changePassword(oldPassword,newPassword);
}

accountServiceHandlers.unlockUserAccount=(user)=>{
  return user.resetAttempts();
}

module.exports=accountServiceHandlers;
