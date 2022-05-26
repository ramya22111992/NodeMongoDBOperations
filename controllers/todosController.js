const todo=require('../models/todoModel');
const todoServiceHandlers=require('../services/todoService')

const todoControllerHandlers={};

todoControllerHandlers.getToDo=(req,res,next)=>{
  const opts={};
    todoServiceHandlers.getToDo(req.params.todoId,opts).then(todo=>{
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({
          message: `ToDo ${req.params.todoId} retrieved successfully`,
          result: todo
        })
    })
    .catch(err=>next(err))
}

module.exports=todoControllerHandlers;
