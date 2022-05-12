const todo = require('../models/todoModel');

exports.removeAllToDosOfUser=(userId,session)=>{
    return session ? todo.todoModel.remove({ "userId": userId }).session(session):
    todo.todoModel.remove({ userId: userId });
}

exports.removeSingleToDo=(todoId,session)=>{
    return session ? todo.todoModel.findByIdAndRemove(todoId).session(session):
    todo.todoModel.findByIdAndRemove(todoId);
}

exports.getToDo=(todoId)=>{
    return todo.todoModel.findById(todoId);
}

exports.createToDo=(payload)=>{
    return todo.todoModel.create(payload);
}

exports.updateToDo=(todoId,payload,session)=>{
return session ? todo.todoModel.updateOne({"_id":todoId},{$set:{...payload}},{runValidators:true}).session(session):
todo.todoModel.findOneAndUpdate({"_id":todoId},{$set:payload},{runValidators:true,context:'query'});
}
