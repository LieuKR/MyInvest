var express = require('express');
var router = express.Router();

 // 암호화 모듈 및 암호화 키와 같은 데이터
const MySqlHandler = require('../serverside_functions/MySqlHandler.js');

// 시간값 처리하는 함수들
const time_functions = require('../serverside_functions/time_functions.js');

// 개별 자산 정보 페이지
router.get('/:code', function(req, res) {
  if(req.session.loginid){
    MySqlHandler.myinvest_personal_DB.query(`SELECT * FROM \`${req.session.loginid.id}_asset_status\` WHERE \`code\` = '${req.params.code}'`, (err, rows1) => {
      MySqlHandler.myinvest_personal_DB.query(`SELECT * FROM \`${req.session.loginid.id}_asset_recode\` WHERE \`code\` = '${req.params.code}' ORDER BY \`time\` DESC`, (err, rows2) => {
        MySqlHandler.myinvest_personal_DB.query(`SELECT \`name\`, \`code\` FROM \`${req.session.loginid.id}_asset_status\` WHERE \`code\` <> '${req.params.code}' ORDER BY \`time\` DESC`, (err, rows3) => {
          rows1.map(x => time_functions.dateform_time(x));
          rows2.map(x => time_functions.dateform_time(x));
          res.render('asset_info', {pageinfo: `자산정보 - ${rows1[0].name}`, pagestatus : '4', loginid : req.session.loginid, asset_status : rows1, asset_recode : rows2, asset_list : rows3});
        })
      })
    })
  } else {
    res.redirect('/')
  }
});

module.exports = router;