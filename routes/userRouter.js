const express = require('express');
const bodyParser = require('body-parser')
const { createUser, getUser, getAllTodosOfUser, getToDo,
    deleteAllToDosOfUser, deleteUser, deleteToDo, updateToDo, createToDo, createPost, getAllPostsOfUser,
    deleteAllPostsOfUser } = require('../controllers/userController');
const userRouter = express.Router();
const cors = require('./cors');

userRouter.use(bodyParser.json());
userRouter.route('/')

    .post(cors.corsWithOptions, createUser) //creating a new user
    .get(cors.corsWithOptions, getUser) //getting all the users
    .delete(cors.corsWithOptions, deleteUser);//deleting all users

userRouter.route('/:userId')
    .delete(cors.corsWithOptions, deleteUser) //deleting a user
    .get(cors.corsWithOptions, getUser); //getting a single user

userRouter.route('/:userId/todos')

    .get(cors.corsWithoutOptions, getAllTodosOfUser) //getting all the todos of a user
    .delete(cors.corsWithOptions, deleteAllToDosOfUser) //deleting all the todos linked to a user
    .post(cors.corsWithOptions, createToDo); //creating a new todo

userRouter.route('/:userId/todos/:todoId')
    .get(cors.corsWithoutOptions, getToDo) //getting the details of a single todo
    .delete(cors.corsWithOptions, deleteToDo) //deleting a single todo
    .put(cors.corsWithOptions, updateToDo); //update the title/completed field of a todos document

usersRouter.router('/:userId/posts')
    .post(cors.corsWithOptions, createPost)
    .get(cors.corsWithoutOptions, getAllPostsOfUser)
    .delete(cors.corsWithoutOptions, deleteAllPostsOfUser)

module.exports = userRouter;