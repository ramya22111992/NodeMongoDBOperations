const { mongoUrl } = require('./config');
const {transactionOptions}=require('./config');
const {mongoose}=require('mongoose');

exports.connectToMongoDB=()=>{
  return mongoose.connect(mongoUrl);
}

exports.createTransaction=async(callback)=>{
  let result;
  let session;
  try{
  session=await mongoose.startSession();
  session.withTransaction(async(session)=>{
      result=await callback(session);
    },transactionOptions)
  return result;
}
catch(e){
  console.log("Some error in outer catch block",e);
  throw e;
}
}
