var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
//const cors=require('./routes/cors'); ----->To apply CORS at app level and not route level

var indexRouter = require('./routes/index');
var commentsRouter = require('./routes/commentsRouter');
const postRouter = require('./routes/postRouter');
const userRouter = require('./routes/userRouter');
const todoRouter = require('./routes/todoRouter');
const {connectToMongoDB}=require('./db');

connectToMongoDB().then(response=>{
console.log("Successfully connected to DB");
})
.catch(err=>{
  console.log(err);
})

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//app.use(cors.corsWithOptions); ----->To apply CORS at app level and not route level

app.use('/', indexRouter);
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
