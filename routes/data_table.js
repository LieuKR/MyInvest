var express = require('express');
var router = express.Router();

 // 암호화 모듈 및 암호화 키와 같은 데이터
const MySqlHandler = require('../serverside_functions/MySqlHandler.js');

// 시간값 처리하는 함수들
const time_functions = require('../serverside_functions/time_functions.js');

// time_functions.Make_time() : 대한민국 표준시로 변환한 시간. YYYY-MM-DD HH-MM-SS 형식으로 출력

// 보유 자산 목록 페이지
router.get('/own', function(req, res) {
  if(req.user){
    MySqlHandler.myinvest_personal_DB.query(`SELECT * FROM \`${req.user.id}_asset_status\` WHERE count <> 0 ORDER BY \`time\` DESC`, (err, rows1) => {
      MySqlHandler.myinvest_personal_DB.query(`SELECT COUNT(*) FROM \`${req.user.id}_asset_status\` `, (err, rows2) => {
        res.render('my_asset_list', {pageinfo: 'MyInvest - 보유 자산', pagestatus : '1', loginid : req.user, table_own_asset : rows1, int_ass_count : Object.values(rows2[0])[0]});
      })
    })
  } else {
    res.redirect('/')
  }
});

// 관심 자산 목록 페이지
router.get('/int', function(req, res) {
  if(req.user){
    MySqlHandler.myinvest_personal_DB.query(`SELECT * FROM \`${req.user.id}_asset_status\` ORDER BY \`time\` DESC`, (err, rows1) => {
      MySqlHandler.myinvest_personal_DB.query(`SELECT COUNT(*) FROM \`${req.user.id}_asset_status\` WHERE count <> 0`, (err, rows2) => {
        rows1.map(x => time_functions.dateform_time(x));
        res.render('int_asset_list', {pageinfo: 'MyInvest - 관심 자산', pagestatus : '2', loginid : req.user, table_int_data : rows1, my_ass_count : Object.values(rows2[0])[0]});
      })
    })
  } else {
    res.redirect('/')
  }
});

module.exports = router;

