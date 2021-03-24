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
    MySqlHandler.myinvest_personal_DB.query(`SELECT * FROM \`${req.session.loginid.id}_asset_status\` ORDER BY \`time\` DESC`, (err, rows) => {
      res.render('my_asset_list', {pageinfo: 'Test', pagestatus : '1', loginid : req.session.loginid, table_data : rows});
    })
  } else {
    res.redirect('/')
  }
});



// post데이터 처리. 업데이트 데이터. asset_recode 테이블에 데이터 삽입. + 그 외 작업 필요함

router.post('/update_data', function(req, res) {
  let date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');

  MySqlHandler.myinvest_personal_DB.query(`INSERT INTO \`${req.session.loginid.id}_asset_recode\` (\`name\`, \`price\`, \`count\`, \`time\`) VALUES ('${req.body.name}', '${req.body.price}', '${req.body.count}', '${date}');`, (err, rows1) => {
    // count가 양수인 경우. "구매"한 경우. average_bought_price값이 변동
    if(req.body.count > 0) {
      MySqlHandler.myinvest_personal_DB.query(`UPDATE \`${req.session.loginid.id}_asset_status\` SET \`price\` = '${req.body.price}', average_bought_price = ((average_bought_price * count) + (${req.body.price} * ${req.body.count})) / (count + ${req.body.count}) , count = count + '${req.body.count}' , \`time\` = '${date}'
      WHERE \`name\`= '${req.body.name}'`, (err, rows2) => {
        if(err) {throw err}
        else {
          res.redirect('/')
        }
      })
      // count가 양수가 아님. 즉 "갱신"만 했거나, "판매"했을 경우. average_bought_price값이 유지
    } else {
      MySqlHandler.myinvest_personal_DB.query(`UPDATE \`${req.session.loginid.id}_asset_status\` SET \`price\` = '${req.body.price}', count = count + '${req.body.count}' , \`time\` = '${date}'
      WHERE \`name\`= '${req.body.name}'`, (err, rows2) => {
        if(err) {throw err}
        else {
          res.redirect('/')
        }
      })
    }
  })

});

// 새로운 종목 생성 탭
router.post('/create_data', function(req, res) {
  let date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');

  MySqlHandler.myinvest_personal_DB.query(`INSERT INTO \`${req.session.loginid.id}_asset_status\` (\`name\`, \`price\`, \`count\`, \`unit\`, \`time\`, \`average_bought_price\`) VALUES ('${req.body.name}', '${req.body.price}', '${req.body.count}', '${req.body.unit}', '${date}', '${req.body.price}');`, (err, rows) => {
    res.redirect('/')
  })


});


// 테스트를 위한 주소
router.get('/test', function(req, res) {
  res.render('test', {pageinfo: 'Test', pagestatus : '1'});
});




module.exports = router;
