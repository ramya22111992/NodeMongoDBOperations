const express=require('express');
const todoControllerHandlers = require('../controllers/todosController');
const todoRouter=express.Router();
const cors=require('./cors');
const authenticateHandlers=require('../authenticate');


todoRouter.route('/:todoId')

.get(cors.corsWithoutOptions,authenticateHandlers.isUserAuthenticated,todoControllerHandlers.getToDo);

module.exports=todoRouter;
