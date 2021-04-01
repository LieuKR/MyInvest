var express = require('express');
var router = express.Router();

 // 암호화 모듈 및 암호화 키와 같은 데이터
const crypto = require('crypto');
const cryptoconfig  = require('../config/pwcryptset.json');
const MySqlHandler = require('../serverside_functions/MySqlHandler.js');

// 시간값 처리하는 함수들
const time_functions = require('../serverside_functions/time_functions.js');

// let date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''); : 시간값 입력할때 쓰자

// 보유 자산 메인 페이지
router.get('/', function(req, res) {
  if(req.session.loginid){
    MySqlHandler.myinvest_personal_DB.query(`SELECT * FROM \`${req.session.loginid.id}_asset_status\` ORDER BY \`time\` DESC`, (err, rows1) => {
      MySqlHandler.myinvest_personal_DB.query(`SELECT COUNT(*) FROM \`${req.session.loginid.id}_asset_status\` WHERE count <> 0`, (err, rows2) => {
        rows1.map(x => time_functions.dateform_dateORtime(x));
        res.render('int_asset_list', {pageinfo: 'Test', pagestatus : '2', loginid : req.session.loginid, table_int_data : rows1, my_ass_count : Object.values(rows2[0])[0]});
      })
    })
  } else {
    res.redirect('/')
  }
});

// 새로운 관심자산 생성
router.post('/create_data', function(req, res) {
  let date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
  MySqlHandler.myinvest_personal_DB.query(`
      INSERT INTO \`${req.session.loginid.id}_asset_status\` (name, price, count, unit, time, average_bought_price, status_price, status_count, before_price) VALUES ('${req.body.name}', '${req.body.price}', 0, '${req.body.unit}', '${date}', '${req.body.price}', 0, 0, '${req.body.price}');
      INSERT INTO \`${req.session.loginid.id}_asset_recode\` (name, price, count, code, time, after_count) VALUES ('${req.body.name}', '${req.body.price}', 0 , last_insert_id(), '${date}', 0);
    `, (err, rows) => {
        if(err) {throw err}
        else {  
        res.redirect('/int_asset');
        }
  })
});

module.exports = router;

