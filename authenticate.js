const passport=require('passport');
const userModel =require('./models/userModel');

const authenticateHandlers={};

authenticateHandlers.isUserAuthenticated=(req,res,next)=>{
  if(!req.user){
    //if the user property is not set it means the user is not authenticated
    let err=new Error(`You are not authenticated to perform this operation. Please login`);
    err.status=403;
    next(err);
  }
  else{
    console.log(req.user);
    next();
  }
}

authenticateHandlers.isUserAnAdmin=(req,res,next)=>{
  /*
the user property in the req object is an object that will actually contain the entire user document
but we have configured it to contain only email and admin fields. If the admin field is true then we know that the user
is an admin else no
  */
  if(!req.user.admin){
    let err=new Error(`${req.user.email} is not authorised to perform this operation`);
    err.status=403;
    next(err);
  }
  else{
    next()
  }
}


/*
passport uses a strategy to authenticate requests. Since we are using username-password
authentication, we are going for local strategy.pasport-local-mongoose takes care of configuring the strtagy
using the createStrategy()
*/

const strategy =userModel.createStrategy();
//configure the local strategy

passport.use(strategy); //register the configured strategy be calling use()

passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());

module.exports=authenticateHandlers;
