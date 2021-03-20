var express = require('express');
var router = express.Router();

 // 암호화 모듈 및 암호화 키와 같은 데이터
const crypto = require('crypto');
const cryptoconfig  = require('../config/pwcryptset.json');
const MySqlHandler = require('../serverside_functions/MySqlHandler.js');

// 로그인 폼 작성 페이지. 메인 페이지가 될 예정
router.get('/', function(req, res) {
  res.render('login_form', {pageinfo: 'Login'});
});

// 회원가입 폼 작성 페이지
router.get('/sign_up', function(req, res) {
  res.render('sign_up', {pageinfo: 'Sign_up'});
});


module.exports = router;
