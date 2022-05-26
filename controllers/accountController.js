const passport=require('passport');
const accountServiceHandlers = require('../services/accountService')
const userServiceHandlers=require('../services/userService')

const accountControllerHandlers={};

accountControllerHandlers.registerUser=(req,res,next)=>{
  let password=req.body.password;
  delete req.body.password;
  let payload=JSON.parse(JSON.stringify(req.body));
  payload.todos=[];
  payload.posts=[];
  accountServiceHandlers.createUser(payload,password).then(response=>{
    res.setHeader('Content-Type','application/json');
    res.status(200).json({message:"User created successfully",result:null})
  })
  .catch(err=>next(err))

}

accountControllerHandlers.resetUserAccount=async(req,res,next)=>{
  try{
  let opts={};
  console.log(req.user);
  let user=await userServiceHandlers.getUser(req.user._id,opts);
  let result=await accountServiceHandlers.unlockUserAccount(user);
  res.setHeader('Content-Type','application/json');
  res.status(200).json({message:`User ${req.user.email} account unlocked successfully`,result:result})
}
catch(e){
  return next(e)
}
}

accountControllerHandlers.changePassword=async(req,res,next)=>{
  try{
  let opts={};
  console.log(req.user);
  let user=await userServiceHandlers.getUser(req.user._id,opts);
  let result=await accountServiceHandlers.changePassword(user,req.body.oldPassword,req.body.newPassword);
  res.setHeader('Content-Type','application/json');
  res.status(200).json({message:"Password changed successfully",result:result})
}
catch(e){
  return next(e)
}
}

accountControllerHandlers.loginUser=(req,res,next)=>{
  //req.user property will be set containing an object with the selected fields of the account document in passport-local-mongoose config
//req.user object will only contain email,_id and admin fields
  res.setHeader('Content-Type','application/json');
  res.status(200).json({message:"User Authenticated Successfully",result:req.user.email})
}

accountControllerHandlers.logoutUser=(req,res,next)=>{
  if(req.user){
    req.logOut();
    res.clearCookie('session-id');
    res.setHeader('Content-Type','application/json');
    res.status(200).json({message:"User successfully logged out",result:req.user})
  }
  else{
    let err=new Error('User has not logged in');
    err.status=403;
    return next(err);
  }
}

module.exports=accountControllerHandlers;
