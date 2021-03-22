var express = require('express');
var router = express.Router();

 // 암호화 모듈 및 암호화 키와 같은 데이터
const crypto = require('crypto');
const cryptoconfig  = require('../config/pwcryptset.json');
const MySqlHandler = require('../serverside_functions/MySqlHandler.js');

// 메인 페이지. 로그인이 필요하면 로그인 페이지, 로그인이 되어 있으면 다른 페이지로 리다이렉트
router.get('/', function(req, res) {
  if(req.session.loginid){
    res.render('my_asset_list', {pageinfo: 'Test', pagestatus : '1'});
  } else {
    res.redirect('/')
  }
});

module.exports = router;
