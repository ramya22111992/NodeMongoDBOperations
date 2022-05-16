const todo=require('../models/todoModel');
const {getToDo}=require('../services/todoService')

exports.getToDo=(req,res,next)=>{
  const opts={};
    getToDo(req.params.todoId,opts).then(todo=>{
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({
          message: `ToDo ${req.params.todoId} retrieved successfully`,
          result: todo
        })
    })
    .catch(err=>next(err))
}
