const todo = require('../models/todoModel');

exports.removeAllToDosOfUser=(userId)=>{
    return todo.todoModel.remove({ userId: userId });
}

exports.removeSingleToDo=(todoId)=>{
    return todo.todoModel.findByIdAndRemove(todoId);
}

exports.getToDo=(todoId)=>{
    return todo.todoModel.findById(todoId);
}

exports.createToDo=(payload)=>{
    return todo.todoModel.create(payload);
}

exports.updateToDo=(todoId,payload)=>{
return todo.todoModel.updateMany({_id:todoId},payload,{runValidators:true});
}