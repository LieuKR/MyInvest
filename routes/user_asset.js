var express = require('express');
var router = express.Router();

 // 암호화 모듈 및 암호화 키와 같은 데이터
const crypto = require('crypto');
const cryptoconfig  = require('../config/pwcryptset.json');
const MySqlHandler = require('../serverside_functions/MySqlHandler.js');

// 시간값 처리하는 함수들
const time_functions = require('../serverside_functions/time_functions.js');

// let date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''); : 시간값 입력할때 쓰자

// 메인 페이지. 로그인이 필요하면 로그인 페이지, 로그인이 되어 있으면 다른 페이지로 리다이렉트
router.get('/', function(req, res) {
  if(req.session.loginid){
    res.render('my_asset_list', {pageinfo: 'Test', pagestatus : '1'});
  } else {
    res.redirect('/')
  }
});



// post데이터 처리. DB상에 데이터 삽입.

// req.body.name, req.body.price, req.body.count , date값까지 4개값 삽입한다.
router.post('/insert', function(req, res) {
  let date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');

  MySqlHandler.myinvest_personal_DB.query(`INSERT INTO \`shck1010_asset_recode\` (\`name\`, \`price\`, \`count\`, \`time\`) VALUES ('${req.body.name}', '${req.body.price}', '${req.body.count}', '${date}');`, (err, rows) => {
    res.redirect('/')
  })


});





// 테스트를 위한 주소
router.get('/test', function(req, res) {
  res.render('test', {pageinfo: 'Test', pagestatus : '1'});
});




module.exports = router;
