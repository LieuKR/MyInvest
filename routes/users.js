var express = require('express');
var router = express.Router();

 // 암호화 모듈 및 암호화 키와 같은 데이터
const crypto = require('crypto');
const cryptoconfig  = require('../config/pwcryptset.json');
const MySqlHandler = require('../serverside_functions/MySqlHandler.js');
const e = require('express');

// 메인 페이지. 로그인이 필요하면 로그인 페이지, 로그인이 되어 있으면 다른 페이지로 리다이렉트
router.get('/', function(req, res) {
  if(req.session.loginid){
    // 로그인이 되어 있으면, 메인 페이지로 리다이렉트
    res.redirect('/my_table/own');
  } else {
    // 로그인 페이지 출력
    res.render('login_form', {pageinfo: 'MyInvest'});
  }
});

// 회원정보 페이지
router.get('/mypage', function(req, res) {
  if(req.session.loginid){
    MySqlHandler.myinvest_personal_DB.query(`SELECT COUNT(*) FROM \`${req.session.loginid.id}_asset_status\` WHERE count <> 0`, (err, rows1) => {
      MySqlHandler.myinvest_personal_DB.query(`SELECT COUNT(*) FROM \`${req.session.loginid.id}_asset_status\` `, (err, rows2) => {
        console.log(Object.values(rows1[0])[0]);
        res.render('mypage_main', {pageinfo: 'MyInvest - 보유 자산', pagestatus : '4', loginid : req.session.loginid, own_asset_count : Object.values(rows1[0])[0], int_asset_count : Object.values(rows2[0])[0]});
      })
    })
  } else {
    res.redirect('/')
  }
});

// 회원가입 폼 작성 페이지
router.get('/sign_up', function(req, res) {
  res.render('sign_up', {pageinfo: 'MyInvest - 회원 가입'});
});

// 회원가입 Post 데이터 처리 페이지
router.post('/sign_up', function(req, res) {
  // POST 데이터 유효성 검사. ID, Mail, PW 순
  if (!/^[a-zA-Z0-9]{8,20}$/.test(req.body.id)){
    console.log('8~20자리 영문, 숫자로 구성된 형식을 만족하지 못함')
    res.redirect('/');
  } else {
    MySqlHandler.myinvest_mainDB.query(`SELECT EXISTS (SELECT \`id\` FROM \`users\` WHERE \`id\`='${req.body.id}') as success`,
      (err, rows1) => {
        if(rows1[0].success == 1){
          console.log('중복되는 아이디가 존재함')
          res.redirect('/');
        } else { // ID 유효성 검사 통화한 상태
          // email 유효성검사
          let emailRule = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i; //이메일 정규식
          if (!emailRule.test(req.body.email)){
            console.log('이메일 양식을 만족하지 못함')
            res.redirect('/');
          } else {
            MySqlHandler.myinvest_mainDB.query(`SELECT EXISTS (SELECT \`email\` FROM \`users\` WHERE \`email\`='${req.body.email}') as success`,
            (err, rows2) => {
              if(rows2[0].success == 1){
                console.log('중복되는 이메일 주소가 존재함')
                res.redirect('/');
              } else { // ID, Email 유효성 검사 통화한 상태
                if(!/^(?=.*[a-zA-Z])((?=.*\d)|(?=.*\W)).{8,20}$/.test(req.body.pass)){
                  console.log('비밀번호 양식이 잘못됨')
                  res.redirect('/');
                } else if (req.body.pass !== req.body.re_pass) {
                  console.log('입력된 비밀번호가 서로 다름')
                  res.redirect('/');
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
                              \`name\` varchar(30),
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
                            console.log('회원가입이 성공하였습니다!');
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

// 로그인 post 데이터 처리 페이지
router.post('/login', function(req, res) {
  crypto.pbkdf2(req.body.pass, cryptoconfig.salt, cryptoconfig.runnum, cryptoconfig.byte, 
    cryptoconfig.method, (err, derivedKey) => {
      MySqlHandler.myinvest_mainDB.query(`SELECT * FROM users WHERE id='${req.body.id}' and password='${derivedKey.toString('hex')}'`, 
        (err, rows) => {
          if (rows[0] == null) {
            console.log('아이디, 비밀번호가 잘못되었습니다.');
            res.redirect('/');
          } else {
            console.log('로그인 되었습니다.');
            req.session.loginid = rows[0];
            res.redirect('/');
          };
        });
    });
});

/* 로그아웃 기능 페이지*/
router.get('/logout', function(req, res) {
  req.session.destroy();
  res.redirect('/');
});

// 회원탈퇴 비밀번호 확인 페이지
router.get('/sign_off_check', function(req, res) {
  if(req.session.loginid){
    MySqlHandler.myinvest_personal_DB.query(`SELECT COUNT(*) FROM \`${req.session.loginid.id}_asset_status\` WHERE count <> 0`, (err, rows1) => {
      MySqlHandler.myinvest_personal_DB.query(`SELECT COUNT(*) FROM \`${req.session.loginid.id}_asset_status\` `, (err, rows2) => {
        res.render('sign_off_check', {pageinfo: 'MyInvest - 회원 탈퇴', pagestatus : '4', loginid : req.session.loginid, own_asset_count : Object.values(rows1[0])[0], int_asset_count : Object.values(rows2[0])[0]});
      })
    })
  } else {
    res.redirect('/')
  }
});


// 회원정보 변경 비밀번호 확인 페이지
router.get('/change_info', function(req, res) {
  if(req.session.loginid){
    MySqlHandler.myinvest_personal_DB.query(`SELECT COUNT(*) FROM \`${req.session.loginid.id}_asset_status\` WHERE count <> 0`, (err, rows1) => {
      MySqlHandler.myinvest_personal_DB.query(`SELECT COUNT(*) FROM \`${req.session.loginid.id}_asset_status\` `, (err, rows2) => {
        res.render('change_info_check', {pageinfo: 'MyInvest - 회원정보 변경', pagestatus : '4', loginid : req.session.loginid, own_asset_count : Object.values(rows1[0])[0], int_asset_count : Object.values(rows2[0])[0]});
      })
    })
  } else {
    res.redirect('/')
  }
});

// 회원정보 변경 Form 페이지
router.post('/change_info', function(req, res) {
  if(req.session.loginid){
    // 비밀번호가 일치하면 rows가 선택됨.
    crypto.pbkdf2(req.body.pass, cryptoconfig.salt, cryptoconfig.runnum, cryptoconfig.byte, cryptoconfig.method, (err, derivedKey) => {
      MySqlHandler.myinvest_mainDB.query(`SELECT * FROM users WHERE  id='${req.session.loginid.id}' and \`password\`= '${derivedKey.toString('hex')}'`, (err, rows) => {
        if(rows[0]){
          MySqlHandler.myinvest_personal_DB.query(`SELECT COUNT(*) FROM \`${req.session.loginid.id}_asset_status\` WHERE count <> 0`, (err, rows1) => {
            MySqlHandler.myinvest_personal_DB.query(`SELECT COUNT(*) FROM \`${req.session.loginid.id}_asset_status\` `, (err, rows2) => {
              res.render('change_info_form', {pageinfo: 'MyInvest - 회원정보 변경', pagestatus : '4', loginid : req.session.loginid, own_asset_count : Object.values(rows1[0])[0], int_asset_count : Object.values(rows2[0])[0]});
            })
          })
        } else {
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
  update_function(req.session.loginid.id, () => {
    req.session.destroy();
    res.redirect('/');
  })
});

// 회원탈퇴 Form데이터 처리 페이지
router.post('/sign_off', function(req, res) {



});


module.exports = router;
