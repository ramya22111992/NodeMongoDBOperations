exports.executeTasksInSequence=(tasksList)=>{
return tasksList.reduce(async(prev, task) => {
  try{
  let prevResponse=await prev;
  let currentResponse=await task;

  return prevResponse.concat(currentResponse)
}
catch(e){
  console.log("error caught in sequence execution",e);
  throw e; //this error will caught in the controller catch block
}
  }, Promise.resolve([]))
}

exports.executeTasksInParallel=(tasksList)=>{
  return Promise.all(tasksList);
}
