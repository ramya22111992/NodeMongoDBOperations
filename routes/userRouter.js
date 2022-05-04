const express = require('express');
const bodyParser = require('body-parser')
const { createUser, getUser, getToDo,
    deleteAllToDosOfUser, deleteUser,deleteAllUsers,getAllUsers, deleteToDo, updateToDo, createToDo, createPost, getPost,
    deleteAllPostsOfUser, deleteSinglePost } = require('../controllers/userController');
const userRouter = express.Router();
const cors = require('./cors');

userRouter.use(bodyParser.json());
userRouter.route('/')

    .post(cors.corsWithOptions, createUser) //creating a new user
    .get(cors.corsWithOptions, getAllUsers) //getting all the users
    .delete(cors.corsWithOptions, deleteAllUsers);//deleting all users

userRouter.route('/:userId')
    .delete(cors.corsWithOptions, deleteUser) //deleting a user
    .get(cors.corsWithOptions, getUser); //getting a single user

userRouter.route('/:userId/todos')

    .get(cors.corsWithoutOptions, getToDo) //getting all the todos of a user
    .delete(cors.corsWithOptions, deleteAllToDosOfUser) //deleting all the todos linked to a user
    .post(cors.corsWithOptions, createToDo); //creating a new todo

userRouter.route('/:userId/todos/:todoId')
    .delete(cors.corsWithOptions, deleteToDo) //deleting a single todo
    .put(cors.corsWithOptions, updateToDo); //update the title/completed field of a todos document

userRouter.route('/:userId/posts')
    .post(cors.corsWithOptions, createPost) //creating a new post
    .get(cors.corsWithoutOptions, getPost) //getting all posts related to the user
    .delete(cors.corsWithoutOptions, deleteAllPostsOfUser) //delete all the posts related to the user

userRouter.route('/:userId/posts/:postId')
    .delete(cors.corsWithOptions, deleteSinglePost) //deleting single post

module.exports = userRouter;