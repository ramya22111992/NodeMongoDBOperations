const express=require('express');
const { getUser } = require('../controllers/userController');
const userRouter=express.Router();
const cors=require('./cors');

userRouter.route('/')

.get(cors.corsWithOptions,getUser);

module.exports=userRouter;