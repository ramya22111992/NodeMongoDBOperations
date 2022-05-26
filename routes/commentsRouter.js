const express = require('express');
const commentsControllerHandlers = require('../controllers/commentsController');
const commentsRouter = express.Router();
const cors=require('./cors');
const authenticateHandlers=require('../authenticate');

commentsRouter.route('/:commentId')

.get(cors.corsWithoutOptions,authenticateHandlers.isUserAuthenticated,commentsControllerHandlers.getComment)
.put(cors.corsWithOptions,authenticateHandlers.isUserAuthenticated,commentsControllerHandlers.updateComment);

module.exports = commentsRouter;
