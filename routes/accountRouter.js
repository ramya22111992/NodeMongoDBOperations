const express=require('express');
const bodyParser=require('body-parser');
const cors=require('./cors');
const passport=require('passport');
const accountControllerHandlers=require('../controllers/accountController');
const authenticateHandlers=require('../authenticate');


const accountRouter=express.Router();

accountRouter.use(bodyParser.json());

accountRouter.route('/create')
.post(cors.corsWithOptions,accountControllerHandlers.registerUser);

accountRouter.route('/login')
.post(cors.corsWithOptions,passport.authenticate('local'),accountControllerHandlers.loginUser);

accountRouter.route('/changePassword')
.post(cors.corsWithOptions,authenticateHandlers.isUserAuthenticated,accountControllerHandlers.changePassword);

accountRouter.route('/unlockAccount')
.post(cors.corsWithOptions,accountControllerHandlers.resetUserAccount);

accountRouter.route('/logout')
.get(cors.corsWithoutOptions,accountControllerHandlers.logoutUser);

module.exports=accountRouter;
