const express=require('express');
const { getToDo } = require('../controllers/todosController');
const todoRouter=express.Router();
const cors=require('./cors');

todoRouter.route('/:todoId')

.get(cors.corsWithoutOptions,getToDo);

module.exports=todoRouter;
