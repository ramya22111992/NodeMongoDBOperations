const express = require('express');
const bodyParser = require('body-parser');
const userControllerHandlers=require('../controllers/userController');
const userRouter = express.Router();
const cors = require('./cors');
const authenticateHandlers=require('../authenticate');


userRouter.use(bodyParser.json());
userRouter.route('/')

    .post(cors.corsWithOptions, userControllerHandlers.notSupportedRoute)
    .get(cors.corsWithOptions,authenticateHandlers.isUserAuthenticated,authenticateHandlers.isUserAnAdmin,
      userControllerHandlers.getAllUsers) //getting all the users
    .put(cors.corsWithOptions, userControllerHandlers.notSupportedRoute) //cannot update all users
    .delete(cors.corsWithOptions, userControllerHandlers.notSupportedRoute) //cannot delete all users

userRouter.route('/:userId')
    .delete(cors.corsWithOptions,authenticateHandlers.isUserAuthenticated,authenticateHandlers.isUserAnAdmin, userControllerHandlers.deleteUser) //deleting a user
    .get(cors.corsWithOptions,authenticateHandlers.isUserAuthenticated, userControllerHandlers.getUser) //getting a single user
    .post(cors.corsWithOptions, userControllerHandlers.notSupportedRoute) //cannot create an existing user
    .put(cors.corsWithOptions,authenticateHandlers.isUserAuthenticated, userControllerHandlers.updateUser) //updating the details of a user

userRouter.route('/:userId/todos')

    .get(cors.corsWithoutOptions,authenticateHandlers.isUserAuthenticated, userControllerHandlers.getToDo) //getting all the todos of a user
    .delete(cors.corsWithOptions,authenticateHandlers.isUserAuthenticated, userControllerHandlers.deleteAllToDosOfUser) //deleting all the todos linked to a user
    .post(cors.corsWithOptions,authenticateHandlers.isUserAuthenticated, userControllerHandlers.createToDo) //creating a new todo
    .put(cors.corsWithOptions, userControllerHandlers.notSupportedRoute) //cannot update all the todos

userRouter.route('/:userId/todos/:todoId')
    .delete(cors.corsWithOptions,authenticateHandlers.isUserAuthenticated, userControllerHandlers.deleteToDo) //deleting a single todo
    .put(cors.corsWithOptions,authenticateHandlers.isUserAuthenticated, userControllerHandlers.updateToDo) //update the title/completed field of a todos document
    .post(cors.corsWithOptions, userControllerHandlers.notSupportedRoute) //cannot create an existing todo

userRouter.route('/:userId/posts')
    .post(cors.corsWithOptions,authenticateHandlers.isUserAuthenticated, userControllerHandlers.createPost) //creating a new post
    .get(cors.corsWithoutOptions,authenticateHandlers.isUserAuthenticated, userControllerHandlers.getAllPosts) //getting all posts related to the user
    .delete(cors.corsWithoutOptions,authenticateHandlers.isUserAuthenticated, userControllerHandlers.deleteAllPostsOfUser) //delete all the posts related to the user
    .put(cors.corsWithOptions, userControllerHandlers.notSupportedRoute) //cannot update all the posts

userRouter.route('/:userId/posts/:postId')
    .delete(cors.corsWithOptions,authenticateHandlers.isUserAuthenticated, userControllerHandlers.deleteSinglePost) //deleting single post of the user
    .post(cors.corsWithOptions, userControllerHandlers.notSupportedRoute) //cannot update all the posts


userRouter.route('/:userId/posts/:postId/comments')
    .get(cors.corsWithoutOptions,authenticateHandlers.isUserAuthenticated,userControllerHandlers.getAllCommentsOfTheUser) //getting the comments of the user for a particular post
    .post(cors.corsWithOptions,authenticateHandlers.isUserAuthenticated,userControllerHandlers.createComment) //this user creates a comment on particular post
    .delete(cors.corsWithOptions,authenticateHandlers.isUserAuthenticated,userControllerHandlers.deleteAllCommentsForAPPost)
    .put(cors.corsWithOptions, userControllerHandlers.notSupportedRoute) //cannot update all the comments of the user for a post


module.exports = userRouter;
