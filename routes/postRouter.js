const express = require('express');
const bodyParser = require('body-parser');
const postControllerHandlers = require('../controllers/postController');
const postRouter = express.Router();
const cors = require('./cors');
const authenticateHandlers=require('../authenticate');

postRouter.use(bodyParser.json());

postRouter.route('/:postId')

    .put(cors.corsWithOptions,authenticateHandlers.isUserAuthenticated, postControllerHandlers.updatePost)
    .get(cors.corsWithoutOptions,authenticateHandlers.isUserAuthenticated, postControllerHandlers.getSinglePost) //getting a single post of user

postRouter.route('/:postId/comments/:commentId')
    .delete(cors.corsWithOptions,authenticateHandlers.isUserAuthenticated, postControllerHandlers.deleteSingleComment)


module.exports = postRouter;
