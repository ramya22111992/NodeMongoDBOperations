const todo=require('../models/todoModel');

exports.getToDo=(req,res,next)=>{
    todo.todoModel.findById(req.params.todoId).then(todo=>{
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({
          message: `ToDo ${req.params.todoId} retrieved successfully`,
          result: todo
        })
    })
    .catch(err=>next(err))
}