const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport=require('passport');
const session=require('express-session');
const fileStore=require('session-file-store')(session);
//const cors=require('./routes/cors'); ----->To apply CORS at app level and not route level

var commentsRouter = require('./routes/commentsRouter');
const postRouter = require('./routes/postRouter');
const userRouter = require('./routes/userRouter');
const todoRouter = require('./routes/todoRouter');
const accountRouter=require('./routes/accountRouter');
const authenticate=require('./authenticate'); //passport initialisation logic
const db=require('./db'); //mongodb connection

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  name: 'session-id', //name of the cookie set in the browser
  secret: '1234-56789-9876-54321', //this is used to sign the session-id cookie
  saveUninitialized: false,
  resave: false,
  store: new fileStore() //session store instance. Default is memory store which does not persist on server restart
}))
//app.use(cors.corsWithOptions); ----->To apply CORS at app level and not route level

/*Uninitialised = false
It means that Your session is only Stored into your storage, when any of the Property is modified in req.session
Uninitialised = true
It means that Your session will be stored into your storage Everytime for request. It will not depend on the modification of req.session.
resave = true
It means when the modification is performed on the session it will re write the req.session.cookie object.
resave = false
It will not rewrite the req.session.cookie object. the initial req.session.cookie remains as it is.
  */

app.use(passport.initialize()); //adding passport to the express appln
app.use(passport.session()); // for persistent login sessions uing express-session

app.use('/account',accountRouter);
app.use('/comment', commentsRouter);
app.use('/post',postRouter);
app.use('/todo',todoRouter);
app.use('/user',userRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
