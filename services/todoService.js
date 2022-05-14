const todo = require('../models/todoModel');

exports.removeAllToDosOfUser=(userId,session=null)=>{
    return todo.todoModel.remove({ "userId": userId },{session})
}

exports.removeSingleToDo=(todoId,session=null)=>{
    return todo.todoModel.remove({"_id":todoId},{session});//returns deletedCount
}

exports.getToDo=(todoId)=>{
    return todo.todoModel.findById(todoId);
}

exports.createToDo=(payload,session=null)=>{
    return todo.todoModel.create([payload],{session});
}

exports.updateToDo=(todoId,payload,session=null)=>{
return todo.todoModel.updateOne({"_id":todoId},{$set:payload},{session})
}
