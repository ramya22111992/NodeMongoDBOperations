const { mongoUrl } = require('./config');
const {transactionOptions}=require('./config');
const {mongoose}=require('mongoose');

exports.connectToMongoDB=()=>{
  return mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
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

/*exports.createTransaction=async(callback)=>{
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
}*/

exports.executeTransaction=async(callback)=>{
  try{
  let session=await mongoose.startSession();
  await session.startTransaction(transactionOptions);
  await callback(session);
}
catch(e){
  console.log("Some error while starting transaction session",e);
  throw e; //this error will caught in the outer catch block of the controller method.
}
}
