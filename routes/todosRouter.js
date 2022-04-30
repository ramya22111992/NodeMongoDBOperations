const express=require('express');
const { getAllTodosOfUser } = require('../controllers/todosController');
const cors=require('./cors')
const todosRouter=express.Router();

todosRouter.route('/')

.get(cors.corsWithoutOptions,getAllTodosOfUser)

module.exports=todosRouter;