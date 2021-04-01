var express = require('express');
var router = express.Router();

 // 암호화 모듈 및 암호화 키와 같은 데이터
const MySqlHandler = require('../serverside_functions/MySqlHandler.js');

// 시간값 처리하는 함수들
const time_functions = require('../serverside_functions/time_functions.js');

// let date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''); : 시간값 입력할때 쓰자

// 개별 자산 정보 페이지
router.get('/:code', function(req, res) {
  if(req.session.loginid){
    res.render('asset_info', {pageinfo: 'Test', pagestatus : '4', loginid : req.session.loginid});
  } else {
    res.redirect('/')
  }
});

module.exports = router;

