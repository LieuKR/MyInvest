var express = require('express');
var router = express.Router();

 // 암호화 모듈 및 암호화 키와 같은 데이터
const crypto = require('crypto');
const cryptoconfig  = require('../config/pwcryptset.json');
const MySqlHandler = require('../serverside_functions/MySqlHandler.js');

// 메인 페이지. 로그인이 필요하면 로그인 페이지, 로그인이 되어 있으면 다른 페이지로 리다이렉트
router.get('/', function(req, res) {
  if(req.session.loginid){
    // 로그인이 되어 있으면, 메인 페이지로 리다이렉트
    res.redirect('/asset');
  } else {
    // 로그인 페이지 출력
    res.render('login_form', {pageinfo: 'Login'});
  }
});

// 회원가입 폼 작성 페이지
router.get('/sign_up', function(req, res) {
  res.render('sign_up', {pageinfo: 'Sign_up'});
});

// 회원가입 Post 데이터 처리 페이지
router.post('/sign_up', function(req, res) {
  // crypto를 통한 비밀번호 암호화 -> 콜백함수 하나로 sql에 저장
  crypto.pbkdf2(req.body.pass, cryptoconfig.salt, cryptoconfig.runnum, cryptoconfig.byte, 
    cryptoconfig.method, (err, derivedKey) => {
      MySqlHandler.myinvest_mainDB.query(`INSERT INTO users (id, password, email) VALUES 
        ('${req.body.id}', '${derivedKey.toString('hex')}', '${req.body.email}');`, 
        (err, rows) => {
          if(err){
            console.log('에러가 발생하였습니다');
            res.redirect('/');
          } else {
            console.log('회원가입이 성공하였습니다!');
            res.redirect('/');
          };
        });
    });
});

// 로그인 post 데이터 처리 페이지
router.post('/login', function(req, res) {
  crypto.pbkdf2(req.body.pass, cryptoconfig.salt, cryptoconfig.runnum, cryptoconfig.byte, 
    cryptoconfig.method, (err, derivedKey) => {
      MySqlHandler.myinvest_mainDB.query(`SELECT * FROM users WHERE id='${req.body.id}' and password='${derivedKey.toString('hex')}'`, 
        (err, rows) => {
          if (rows[0] == null) {
            console.log('아이디, 비밀번호가 잘못되었습니다.');
            res.redirect('/');
          } else {
            console.log('로그인 되었습니다.');
            req.session.loginid = rows[0];
            res.redirect('/');
          };
        });
    });
});

/* 로그아웃 기능 페이지*/
router.get('/logout', function(req, res) {
  req.session.destroy();
  res.redirect('/');
});


module.exports = router;
