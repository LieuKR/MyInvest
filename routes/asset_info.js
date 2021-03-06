var express = require('express');
var router = express.Router();

 // 암호화 모듈 및 암호화 키와 같은 데이터
const MySqlHandler = require('../serverside_functions/MySqlHandler.js');

// 시간값 처리하는 함수들
const time_functions = require('../serverside_functions/time_functions.js');

router.get('/', function(req, res) {
  if(req.user){
    MySqlHandler.myinvest_personal_DB.query(`SELECT \`code\` FROM \`${req.user.id}_asset_status\` ORDER BY \`time\` DESC LIMIT 1`, (err, rows) => {
      if(rows[0]){
        res.redirect(`/asset_info/${rows[0].code}`)
      } else{
        req.flash('red_alert','데이터가 존재하지 않습니다.')
        res.redirect('/')
      }
    })
  } else {
    res.redirect('/')
  }
});

// 개별 자산 정보 페이지
router.get('/:code', function(req, res) {
  if(req.user){
    MySqlHandler.myinvest_personal_DB.query(`SELECT * FROM \`${req.user.id}_asset_status\` WHERE \`code\` = '${req.params.code}'`, (err, rows1) => {
      MySqlHandler.myinvest_personal_DB.query(`SELECT * FROM \`${req.user.id}_asset_recode\` WHERE \`code\` = '${req.params.code}' ORDER BY \`time\` DESC`, (err, rows2) => {
        MySqlHandler.myinvest_personal_DB.query(`SELECT \`name\`, \`code\` FROM \`${req.user.id}_asset_status\` WHERE \`code\` <> '${req.params.code}' AND \`count\` <> 0 ORDER BY \`time\` DESC`, (err, rows3) => {
          MySqlHandler.myinvest_personal_DB.query(`SELECT \`name\`, \`code\` FROM \`${req.user.id}_asset_status\` WHERE \`code\` <> '${req.params.code}' AND \`count\` = 0 ORDER BY \`time\` DESC`, (err, rows4) => {
            rows1.map(x => time_functions.dateform_time(x));
            rows2.map(x => time_functions.dateform_time(x));
            res.render('asset_info', {pageinfo: `자산정보 - ${rows1[0].name}`, alert_data: req.flash(), pagestatus : '3', loginid : req.user, asset_status : rows1, asset_recode : rows2, asset_own_list : rows3, asset_int_list : rows4});
          })
        })
      })
    })
  } else {
    res.redirect('/')
  }
});

module.exports = router;