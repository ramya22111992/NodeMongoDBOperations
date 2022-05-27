const { mongoUrl } = require('./config');
const {transactionOptions}=require('./config');
const {mongoose}=require('mongoose');

function gracefulExit() {
  //close the connection to database only when app shuts down. Dont close connection on every http request
  mongoose.connection.close(function () {
    console.log('Mongoose default connection with DB is disconnected through app termination');
    process.exit(0);
  });
}

function setRunValidators(){
  this.setOptions({runValidators:true});
}

mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(response=>{
  console.log("Successfully connected to DB");
})
.catch(err=>console.log(err))


// If the connection throws an error
mongoose.connection.on("error", function(err) {
  console.error('Failed to connect to DB ', err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
  console.log('Mongoose default connection to DB is disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', gracefulExit).on('SIGTERM', gracefulExit);


exports.validatorPlugin=(schema)=>{
  schema.pre('updateOne',setRunValidators);
  //update methods dont run validators on schema by default. They need to be turned on. You can add more update methods
  //ad required in the application. We are doing this at global level instead of adding it in every query.
  //create method will do the validation by default.
}

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
