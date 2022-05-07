const express = require('express');
const bodyParser = require('body-parser');
const { updatePost, getSinglePost,deleteSingleComment } = require('../controllers/postController');
const postRouter = express.Router();
const cors = require('./cors');

postRouter.use(bodyParser.json());

postRouter.route('/:postId')

    .put(cors.corsWithOptions, updatePost)
    .get(cors.corsWithoutOptions, getSinglePost) //getting a single post of user

postRouter.route('/:postId/comments/:commentId')
    .delete(cors.corsWithOptions, deleteSingleComment)


module.exports = postRouter;