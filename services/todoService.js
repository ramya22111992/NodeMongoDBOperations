const todo = require('../models/todoModel');

const todoServiceHandlers={};

todoServiceHandlers.removeAllToDosOfUser=(userId,opts)=>{
    return todo.todoModel.remove({ "userId": userId },opts)
}

todoServiceHandlers.removeSingleToDo=(todoId,opts)=>{
    return todo.todoModel.remove({"_id":todoId},opts);//returns deletedCount
}

todoServiceHandlers.getToDo=(todoId,opts)=>{
    return todo.todoModel.findById(todoId,opts);
}

todoServiceHandlers.createToDo=(payload,opts)=>{
    return todo.todoModel.create([payload],opts);
}

todoServiceHandlers.updateToDo=(todoId,payload,opts)=>{
return todo.todoModel.updateOne({"_id":todoId},{$set:payload},opts)
}

module.exports=todoServiceHandlers;
