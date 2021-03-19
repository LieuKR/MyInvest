var express = require('express');
var router = express.Router();

 // 암호화 모듈 및 암호화 키와 같은 데이터
const crypto = require('crypto');
const cryptoconfig  = require('../config/pwcryptset.json');
const MySqlHandler = require('../serverside_functions/MySqlHandler.js');


router.get('/', function(req, res) {
  res.render('login_form', {pageinfo: 'Login'});
});

module.exports = router;
