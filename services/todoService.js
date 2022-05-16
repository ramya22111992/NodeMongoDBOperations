const todo = require('../models/todoModel');

exports.removeAllToDosOfUser=(userId,opts)=>{
    return todo.todoModel.remove({ "userId": userId },opts)
}

exports.removeSingleToDo=(todoId,opts)=>{
    return todo.todoModel.remove({"_id":todoId},opts);//returns deletedCount
}

exports.getToDo=(todoId,opts)=>{
    return todo.todoModel.findById(todoId,opts);
}

exports.createToDo=(payload,opts)=>{
    return todo.todoModel.create([payload],opts);
}

exports.updateToDo=(todoId,payload,opts)=>{
return todo.todoModel.updateOne({"_id":todoId},{$set:payload},opts)
}
