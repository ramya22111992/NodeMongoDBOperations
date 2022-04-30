const express = require('express');
const { getAllCommentsForPost } = require('../controllers/commentsController');
const commentsRouter = express.Router();

commentsRouter.route('/')

.get(cors.corsWithoutOptions,getAllCommentsForPost)


module.exports = commentsRouter;
