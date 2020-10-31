'use strict';

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const io = require('socket.io')();
const roomNamespace = io.of(/^\/[a-z]{3}-[a-z]{4}-[a-z]{3}$/);
const indexRouter = require('./routes/index');

const app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

/*
io.on('connection', function(socket){
  socket.emit('message', 'hello client!');

  socket.on('connected', function(data){
    console.log(data);
  });
});
*/
roomNamespace.on('connection', socket => {
  const roomSocket = socket.nsp;
  console.log('Someone connected');

  roomSocket.emit("message",`User successfully connected to ${roomSocket.name}`);

  socket.on('connected', data => {
    console.log("Client is saying : " + data);
  });
});


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


io.on("connection", socket => {
  console.log("Someone connected!");
  socket.emit("message");
})

module.exports = {app, io};
