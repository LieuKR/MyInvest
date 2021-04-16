var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// Session 모듈 및 세션 세팅파일 로드
const session = require('express-session');
const MySQLStore = require('express-mysql-session');
const sessionconfig  = require('./config/sessionset.json');

const flash = require('connect-flash');

// Socket.io 서버를 위한 모듈
const http = require("http");
const socketio = require("socket.io");

// 암호화 모듈 및 암호화 키, Mysql 핸들러
const crypto = require('crypto');
const cryptoconfig  = require('./config/pwcryptset.json');
const MySqlHandler = require('./serverside_functions/MySqlHandler.js');

// Routers
var usersRouter = require('./routes/users');
var user_AssetRouter = require('./routes/data_table');
var info_AssetRouter = require('./routes/asset_info');
var data_AssetRouter = require('./routes/data_manage');

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
app.use('/node_modules', express.static(__dirname + '/node_modules'));

// 세션과 Mysql DB 연결
app.use(session({
  secret: sessionconfig.secret,
  store: new MySQLStore(sessionconfig.storeset),
  resave: false,
  saveUninitialized: true,
  cookie: sessionconfig.cookieset
}))

// connect-flash : 일회성 메시지 알람을 위한 미들웨어, cookie-parser, express-session을 사용
app.use(flash());

// Passport.js
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

app.use(passport.initialize()); // Express에 passport 연결
app.use(passport.session()); // passport에 세션 연결

// 로그인시 인증
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

// 매 페이지 로드할 때 마다 인증 여부 확인하고 인증될시 req.user에 로그인 데이터 삽입
passport.deserializeUser(function(id, done) {
  MySqlHandler.myinvest_mainDB.query(`SELECT id, email, name FROM users WHERE id='${id}'`, 
  (err, rows) => {
    if(rows[0] == null) {
      return done(err)
    } else {
      return done(null, rows[0])
    }
  });
});

passport.use(new LocalStrategy({
    usernameField: 'id',
    passwordField: 'pass',
    session: true,
    passReqToCallback: true
  },
  function(req, username, password, done) {
    if(req.body.remember_me){
      req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // 로그인 상태 유지시 세션 유효기간 30일
    }
    crypto.pbkdf2(password, cryptoconfig.salt, cryptoconfig.runnum, cryptoconfig.byte, 
      cryptoconfig.method, (err, derivedKey) => {
        MySqlHandler.myinvest_mainDB.query(`SELECT * FROM users WHERE id='${username}' and password='${derivedKey.toString('hex')}'`, 
          (err, rows) => {
            if (rows[0] == null) {
              req.flash('red_alert','아이디 또는 비밀번호가 잘못되었습니다.')
              return done(null, false)
            } else {
              req.flash('green_alert','로그인 되었습니다')
              return done(null, rows[0])
            }
          });
      });
  }
));

app.post('/login',
  passport.authenticate('local', { 
    successRedirect: '/',
    failureRedirect: '/'
  })
);

app.use('/', usersRouter);
app.use('/my_table', user_AssetRouter);
app.use('/asset_info', info_AssetRouter);
app.use('/data', data_AssetRouter);

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