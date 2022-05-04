const express = require('express');
const { getComment,updateComment } = require('../controllers/commentsController');
const commentsRouter = express.Router();
const cors=require('./cors');

commentsRouter.route('/:commentId')

.get(cors.corsWithoutOptions,getComment)
.put(cors.corsWithOptions,updateComment);

module.exports = commentsRouter;
