exports.executeTasksInSequence=(tasksList)=>{
return tasksList.reduce((prev, task) => {
    return prev
      .then((response) => {
        return task
          .then((resp) => {
            return response.concat(resp);
          })
          .catch((err) => reject(err));
      })
      .catch((err) => reject(err));
  }, Promise.resolve([]))
}

exports.mergeArrays=(previous,current,index,array) =>{
    console.log(`previous is ${previous} and current is ${current}`);
    return [...previous,...current];
}