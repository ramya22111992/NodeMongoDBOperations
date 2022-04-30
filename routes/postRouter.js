const express=require('express');
const { getAllPostsForUser } = require('../controllers/postController');
const postRouter=express.Router();
const cors=require('./cors');

postRouter.route('/')

.get(cors.corsWithoutOptions,getAllPostsForUser);


module.exports=postRouter;