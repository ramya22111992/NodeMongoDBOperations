const express=require('express');
const bodyParser=require('body-parser');
const { getPost ,deleteSingleComment,updatePost,createComment,deleteAllCommentsForAPPost,
    getAllCommentsForPost} = require('../controllers/postController');
const postRouter=express.Router();
const cors=require('./cors');

postRouter.use(bodyParser.json());

postRouter.route('/:postId')

.get(cors.corsWithoutOptions,getPost)
.put(cors.corsWithOptions,updatePost)

postRouter.route('/:postId/comments')
.post(cors.corsWithOptions,createComment)
.delete(cors.corsWithOptions,deleteAllCommentsForAPPost)
.get(cors.corsWithOptions,getAllCommentsForPost)

postRouter.route('/:postId/comments/:commentId')
.delete(cors.corsWithOptions,deleteSingleComment)

module.exports=postRouter;