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

exports.saveToDo=(todoDoc)=>{
    return todoDoc.save();
}

exports.createToDo=(payload)=>{
    return todo.todoModel.create(payload);
}