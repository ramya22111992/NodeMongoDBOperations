const { mongoUrl } = require('./config');
const {transactionOptions}=require('./config');
const {mongoose}=require('mongoose');

exports.connectToMongoDB=()=>{
  return mongoose.connect(mongoUrl);
}

function setRunValidators(){
  this.setOptions({runValidators:true});
}

exports.validatorPlugin=(schema)=>{
  schema.pre('updateOne',setRunValidators);
  //update methods dont run validators on schema by default. They need to be turned on. You can add more update methods
  //ad required in the application. We are doing this at global level instead of adding it in every query.
  //create method will do the validation by default.
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
