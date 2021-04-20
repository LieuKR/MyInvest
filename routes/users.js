var express = require('express');
var router = express.Router();

// 암호화 모듈 및 암호화 키와 같은 데이터
const crypto = require('crypto');
const cryptoconfig  = require('../config/pwcryptset.json');
const MySqlHandler = require('../serverside_functions/MySqlHandler.js');  

// 메인 페이지. 로그인이 필요하면 로그인 페이지, 로그인이 되어 있으면 다른 페이지로 리다이렉트
router.get('/', function(req, res) {
  if(req.user){
    // 로그인이 되어 있으면, 메인 페이지로 리다이렉트
    res.redirect('/my_table/own');
  } else {
    // 로그인 페이지 출력
    res.render('login_form', {pageinfo: 'MyInvest', alert_data: req.flash()});
  }
});

// 회원정보 페이지
router.get('/mypage', function(req, res) {
  if(req.user){
    MySqlHandler.myinvest_personal_DB.query(`SELECT COUNT(*) FROM \`${req.user.id}_asset_status\` WHERE count <> 0`, (err, rows1) => {
      MySqlHandler.myinvest_personal_DB.query(`SELECT COUNT(*) FROM \`${req.user.id}_asset_status\` `, (err, rows2) => {
        res.render('mypage_main', {pageinfo: 'MyInvest - 보유 자산', alert_data: req.flash() , pagestatus : '4', loginid : req.user, own_asset_count : Object.values(rows1[0])[0], int_asset_count : Object.values(rows2[0])[0]});
      })
    })
  } else {
    res.redirect('/')
  }
});

// 회원가입 폼 작성 페이지
router.get('/sign_up', function(req, res) {
  res.render('sign_up', {pageinfo: 'MyInvest - 회원 가입', alert_data: req.flash()});
});

// 회원가입 Post 데이터 처리 페이지
router.post('/sign_up', function(req, res) {
  // POST 데이터 유효성 검사. ID, Mail, PW 순
  if (!/^[a-zA-Z0-9]{8,20}$/.test(req.body.id)){
    req.flash('red_alert','아이디 양식이 잘못되었습니다.')
    res.redirect('back');
  } else {
    MySqlHandler.myinvest_mainDB.query(`SELECT EXISTS (SELECT \`id\` FROM \`users\` WHERE \`id\`='${req.body.id}') as success`,
      (err, rows1) => {
        if(rows1[0].success == 1){
          req.flash('red_alert','중복되는 아이디가 존재합니다.')
          res.redirect('back');
        } else { // ID 유효성 검사 통화한 상태
          // email 유효성검사
          let emailRule = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i; //이메일 정규식
          if (!emailRule.test(req.body.email)){
            req.flash('red_alert','이메일 양식을 만족하지 못하였습니다.')
            res.redirect('back');
          } else {
            MySqlHandler.myinvest_mainDB.query(`SELECT EXISTS (SELECT \`email\` FROM \`users\` WHERE \`email\`='${req.body.email}') as success`,
            (err, rows2) => {
              if(rows2[0].success == 1){
                req.flash('red_alert','중복 이메일 주소가 존재합니다.')
                res.redirect('back');
              } else { // ID, Email 유효성 검사 통화한 상태
                if(!/^(?=.*[a-zA-Z])((?=.*\d)|(?=.*\W)).{8,20}$/.test(req.body.pass)){
                  req.flash('red_alert','비밀번호 양식이 잘못되었습니다.')
                  res.redirect('back');
                } else if (req.body.pass !== req.body.re_pass) {
                  req.flash('red_alert','서로 다른 비밀번호가 입력되었습니다.')
                  res.redirect('back');
                } else { // 모든 데이터 유효성 검사 통화한 상태. 회원가입 진행
                  // crypto를 통한 비밀번호 암호화 -> 콜백함수 하나로 sql에 저장
                  crypto.pbkdf2(req.body.pass, cryptoconfig.salt, cryptoconfig.runnum, cryptoconfig.byte, 
                    cryptoconfig.method, (err, derivedKey) => {
                      MySqlHandler.myinvest_mainDB.query(`INSERT INTO users (id, password, email, name) VALUES 
                        ('${req.body.id}', '${derivedKey.toString('hex')}', '${req.body.email}', '${req.body.id}');`, 
                        (err, rows) => {
                          // 개인 데이터 테이블 두개 생성
                          MySqlHandler.myinvest_personal_DB.query(`CREATE TABLE \`${req.body.id}_asset_recode\` (
                            \`no\` int AUTO_INCREMENT PRIMARY KEY, 
                            \`code\` int,
                            \`name\` varchar(30), 
                            \`price\` float,
                            \`count\` float,
                            \`time\` datetime,
                            \`after_count\` float,
                            \`average_bought_price\` float,
                            \`actural_earn\` float,
                            \`status_price\` tinyint,
                            \`status_count\` tinyint
                            );
                            
                            CREATE TABLE \`myinvest_personal_data\`.\`${req.body.id}_asset_status\` (
                              \`code\` int AUTO_INCREMENT PRIMARY KEY,
                              \`name\` varchar(30) UNIQUE,
                              \`price\` float,
                              \`count\` float,
                              \`unit\` varchar(30),
                              \`time\` datetime,
                              \`average_bought_price\` float,
                              \`actural_earn\` float,
                              \`before_price\` float,
                              \`status_price\` tinyint,
                              \`status_count\` tinyint
                              );
                            `, (err, rows3) => {
                            req.flash('green_alert','회원가입에 성공하였습니다.')
                            res.redirect('/');
                          })
                        });
                    });
                }
              }
            })
          }
        }
      })
  }
});

/* 로그아웃 기능 페이지*/
router.get('/logout', function(req, res) {
  req.flash('green_alert','로그아웃 되었습니다.')
  req.logout();
  req.session.destroy(function(){
    res.redirect('/');
  });
});

// 회원탈퇴 비밀번호 확인 페이지
router.get('/sign_off_check', function(req, res) {
  if(req.user){
    MySqlHandler.myinvest_personal_DB.query(`SELECT COUNT(*) FROM \`${req.user.id}_asset_status\` WHERE count <> 0`, (err, rows1) => {
      MySqlHandler.myinvest_personal_DB.query(`SELECT COUNT(*) FROM \`${req.user.id}_asset_status\` `, (err, rows2) => {
        res.render('sign_off_check', {pageinfo: 'MyInvest - 회원 탈퇴', alert_data: req.flash(), pagestatus : '4', loginid : req.user, own_asset_count : Object.values(rows1[0])[0], int_asset_count : Object.values(rows2[0])[0]});
      })
    })
  } else {
    res.redirect('/')
  }
});


// 회원정보 변경 비밀번호 확인 페이지
router.get('/change_info', function(req, res) {
  if(req.user){
    MySqlHandler.myinvest_personal_DB.query(`SELECT COUNT(*) FROM \`${req.user.id}_asset_status\` WHERE count <> 0`, (err, rows1) => {
      MySqlHandler.myinvest_personal_DB.query(`SELECT COUNT(*) FROM \`${req.user.id}_asset_status\` `, (err, rows2) => {
        res.render('change_info_check', {pageinfo: 'MyInvest - 회원정보 변경', alert_data: req.flash() , pagestatus : '4', loginid : req.user, own_asset_count : Object.values(rows1[0])[0], int_asset_count : Object.values(rows2[0])[0]});
      })
    })
  } else {
    res.redirect('/')
  }
});

// 회원정보 변경 Form 페이지
router.post('/change_info', function(req, res) {
  if(req.user){
    // 비밀번호가 일치하면 rows가 선택됨.
    crypto.pbkdf2(req.body.pass, cryptoconfig.salt, cryptoconfig.runnum, cryptoconfig.byte, cryptoconfig.method, (err, derivedKey) => {
      MySqlHandler.myinvest_mainDB.query(`SELECT * FROM users WHERE  id='${req.user.id}' and \`password\`= '${derivedKey.toString('hex')}'`, (err, rows) => {
        if(rows[0]){
          MySqlHandler.myinvest_personal_DB.query(`SELECT COUNT(*) FROM \`${req.user.id}_asset_status\` WHERE count <> 0`, (err, rows1) => {
            MySqlHandler.myinvest_personal_DB.query(`SELECT COUNT(*) FROM \`${req.user.id}_asset_status\` `, (err, rows2) => {
              res.render('change_info_form', {pageinfo: 'MyInvest - 회원정보 변경', alert_data: req.flash() , pagestatus : '4', loginid : req.user, own_asset_count : Object.values(rows1[0])[0], int_asset_count : Object.values(rows2[0])[0]});
            })
          })
        } else {
        req.flash('red_alert','비밀번호가 잘못되었습니다.')
        res.redirect('back')
        }
      })
    })
  }
})

// 회원정보 변경 Form데이터 처리 페이지
router.post('/submit_info', function(req, res) {
  function update_function (logined_id, callback) {
    if(req.body.name) {
      MySqlHandler.myinvest_mainDB.query(`UPDATE users SET \`name\` = '${req.body.name}' WHERE \`id\`= '${logined_id}'`, (err, rows) => {
      })
    }
    if(req.body.pass){
      crypto.pbkdf2(req.body.pass, cryptoconfig.salt, cryptoconfig.runnum, cryptoconfig.byte, 
        cryptoconfig.method, (err, derivedKey) => {
          MySqlHandler.myinvest_mainDB.query(`UPDATE users SET \`password\` = '${derivedKey.toString('hex')}' WHERE \`id\`= '${logined_id}'`, 
            (err, rows) => {
            });
        });
    }
    callback()
  }
  update_function(req.user.id, () => {
    setTimeout(function() {  // 회원정보 변경 후 1초 뒤 로그아웃, 메인페이지로 전송
      req.session.destroy();
      res.redirect('/');
    }, 1000);
  })
});

// 회원탈퇴 Form데이터 처리 페이지
router.post('/sign_off', function(req, res) {
  // 회원탈퇴 기능은 미구현할 예정
  // 입력받은 비밀번호(req.body.password가 일치하면 회원탈퇴 처리 후 로그아웃, 메인화면으로 리다이렉트)
  // 일치하지 않을 경우 req.flash('red_alert','비밀번호가 잘못되었습니다.') 출력 후 전 페이지로 리다이렉트
  req.flash('red_alert','회원탈퇴 기능은 구현하지 않았습니다.')
  res.redirect('/');
});

module.exports = router;
