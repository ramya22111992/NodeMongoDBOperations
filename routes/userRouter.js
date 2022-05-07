const express = require('express');
const bodyParser = require('body-parser')
const { createUser, getUser, getToDo,
    deleteAllToDosOfUser, deleteUser, getAllUsers, deleteToDo, updateToDo, createToDo, createPost, getAllPosts,
    deleteAllPostsOfUser, deleteSinglePost, getAllCommentsOfTheUser, deleteAllCommentsForAPPost,
    notSupportedRoute, updateUser, createComment } = require('../controllers/userController');
const userRouter = express.Router();
const cors = require('./cors');

userRouter.use(bodyParser.json());
userRouter.route('/')

    .post(cors.corsWithOptions, createUser) //creating a new user
    .get(cors.corsWithOptions, getAllUsers) //getting all the users
    .put(cors.corsWithOptions, notSupportedRoute) //cannot update all users
    .delete(cors.corsWithOptions, notSupportedRoute) //cannot delete all users

userRouter.route('/:userId')
    .delete(cors.corsWithOptions, deleteUser) //deleting a user
    .get(cors.corsWithOptions, getUser) //getting a single user
    .post(cors.corsWithOptions, notSupportedRoute) //cannot create an existing user
    .put(cors.corsWithOptions, updateUser) //updating the details of a user

userRouter.route('/:userId/todos')

    .get(cors.corsWithoutOptions, getToDo) //getting all the todos of a user
    .delete(cors.corsWithOptions, deleteAllToDosOfUser) //deleting all the todos linked to a user
    .post(cors.corsWithOptions, createToDo) //creating a new todo
    .put(cors.corsWithOptions, notSupportedRoute) //cannot update all the todos

userRouter.route('/:userId/todos/:todoId')
    .delete(cors.corsWithOptions, deleteToDo) //deleting a single todo
    .put(cors.corsWithOptions, updateToDo) //update the title/completed field of a todos document
    .post(cors.corsWithOptions, notSupportedRoute) //cannot create an existing todo

userRouter.route('/:userId/posts')
    .post(cors.corsWithOptions, createPost) //creating a new post
    .get(cors.corsWithoutOptions, getAllPosts) //getting all posts related to the user
    .delete(cors.corsWithoutOptions, deleteAllPostsOfUser) //delete all the posts related to the user
    .put(cors.corsWithOptions, notSupportedRoute) //cannot update all the posts

userRouter.route('/:userId/posts/:postId')
    .delete(cors.corsWithOptions, deleteSinglePost) //deleting single post
    .post(cors.corsWithOptions, notSupportedRoute) //cannot update all the posts


userRouter.route('/:userId/posts/:postId/comments')
    .get(cors.corsWithoutOptions, getAllCommentsOfTheUser) //getting the comments of the user for a particular post
    .post(cors.corsWithOptions, createComment) //this user creates a comment on particular post
    .delete(cors.corsWithOptions, deleteAllCommentsForAPPost)
    .put(cors.corsWithOptions, notSupportedRoute) //cannot update all the comments of the user for a post


module.exports = userRouter;