var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// Session 모듈 및 세션 세팅파일 로드
const session = require('express-session');
const MySQLStore = require('express-mysql-session');
const sessionconfig  = require('./config/sessionset.json');

// Socket.io 서버를 위한 모듈
const http = require("http");
const socketio = require("socket.io");

// Routers
var usersRouter = require('./routes/users');
var user_AssetRouter = require('./routes/user_asset');
var int_AssetRouter = require('./routes/int_asset');

var app = express();

// HTTP 서버 생성
const server = require('http').createServer(app); 

// Socket.io 서버 생성
const io = socketio(server);
const socketIOHandler = require('./serverside_functions/socketIOHandler.js')(io);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 세션과 Mysql DB 연결
app.use(session({
  secret: sessionconfig.secret,
  store: new MySQLStore(sessionconfig.storeset),
  resave: false,
  saveUninitialized: true,
  cookie: sessionconfig.cookieset
}))

app.use('/', usersRouter);
app.use('/asset', user_AssetRouter);
app.use('/int_asset', int_AssetRouter);

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

module.exports = {app:app, server:server}; 