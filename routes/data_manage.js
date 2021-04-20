var express = require('express');
var router = express.Router();

 // 암호화 모듈 및 암호화 키와 같은 데이터
const MySqlHandler = require('../serverside_functions/MySqlHandler.js');

// 시간값 처리하는 함수들
const time_functions = require('../serverside_functions/time_functions.js');

// time_functions.Make_time() : 대한민국 표준시로 변환한 시간. YYYY-MM-DD HH-MM-SS 형식으로 출력

// Update 데이터 처리
router.post('/update_data', function(req, res) {

  function dataupdate_function (status_price, count_num) {
    if(count_num == 0) {
    // count가 0. 즉 "갱신"만 한 경우의 쿼리문
    MySqlHandler.myinvest_personal_DB.query(`INSERT INTO \`${req.user.id}_asset_recode\` (\`name\`, \`price\`, \`count\`, \`code\`, \`time\`, \`after_count\`, \`average_bought_price\`, \`actural_earn\`, \`status_price\`, \`status_count\`) VALUES ('${req.body.name}', '${req.body.price}', 0 , '${req.body.code}', '${time_functions.Make_time()}', ${req.body.before_count}, '${req.body.average_bought_price}', ${req.body.actural_earn} + (${req.body.price} - ${req.body.average_bought_price}) * ${count_num}, '${status_price}', 0);`, (err, rows1) => {
      MySqlHandler.myinvest_personal_DB.query(`UPDATE \`${req.user.id}_asset_status\` SET \`price\` = '${req.body.price}', \`time\` = '${time_functions.Make_time()}', \`status_price\` = '${status_price}', \`status_count\` = 0, \`actural_earn\` = ${req.body.actural_earn} + (${req.body.price} - ${req.body.average_bought_price}) * ${count_num}, \`before_price\` = '${req.body.before_price}'
        WHERE \`name\`= '${req.body.name}'`, (err, rows2) => {
          if(err) {
            req.flash('red_alert','잘못된 정보가 입력되었습니다.')
            res.redirect('back')
          } else {
            req.flash('green_alert','자산 정보가 업데이트되었습니다.')
            res.redirect('back')
          }
        })
      })
    }
    // "구매"한 경우. average_bought_price값이 변동 && actural_earn은 변동 X
    else if(req.body.type == 1) {
      MySqlHandler.myinvest_personal_DB.query(`INSERT INTO \`${req.user.id}_asset_recode\` (\`name\`, \`price\`, \`count\`, \`code\`, \`time\`, \`after_count\`, \`average_bought_price\`, \`actural_earn\`, \`status_price\`, \`status_count\`) VALUES ('${req.body.name}', '${req.body.price}', '${count_num}', '${req.body.code}', '${time_functions.Make_time()}', ${req.body.before_count} + ${count_num}, ((${req.body.average_bought_price} * ${req.body.before_count}) + (${req.body.price} * ${count_num})) / (${req.body.before_count} + ${count_num}), '${req.body.actural_earn}', '${status_price}', '${req.body.type}');`, (err, rows1) => {
        MySqlHandler.myinvest_personal_DB.query(`UPDATE \`${req.user.id}_asset_status\` SET \`price\` = '${req.body.price}', average_bought_price = ((${req.body.average_bought_price} * count) + (${req.body.price} * ${count_num})) / (count + ${count_num}) , count = count + '${count_num}' , \`time\` = '${time_functions.Make_time()}', \`status_price\` = '${status_price}', \`status_count\` = '${req.body.type}', \`before_price\` = '${req.body.before_price}'
        WHERE \`name\`= '${req.body.name}'`, (err, rows2) => {
          if(err) {
            req.flash('red_alert','잘못된 정보가 입력되었습니다.')
            res.redirect('back')
          } else {
            req.flash('green_alert','자산 정보가 업데이트되었습니다.')
            res.redirect('back')
          }
        })
      })
    } 
    else {
      // count가 양수가 아닌. 즉 "판매"했을 경우. average_bought_price값이 유지 && actural_earn 변동
      MySqlHandler.myinvest_personal_DB.query(`INSERT INTO \`${req.user.id}_asset_recode\` (\`name\`, \`price\`, \`count\`, \`code\`, \`time\`, \`after_count\`, \`average_bought_price\`, \`actural_earn\`, \`status_price\`, \`status_count\`) VALUES ('${req.body.name}', '${req.body.price}', (${count_num} * ${req.body.type}) , '${req.body.code}', '${time_functions.Make_time()}', ${req.body.before_count} + (${count_num} * ${req.body.type}), '${req.body.average_bought_price}', ${req.body.actural_earn} + (${req.body.price} - ${req.body.average_bought_price}) * ${count_num}, '${status_price}', '${req.body.type}');`, (err, rows1) => {
        MySqlHandler.myinvest_personal_DB.query(`UPDATE \`${req.user.id}_asset_status\` SET \`price\` = '${req.body.price}', count = count + (${count_num} * ${req.body.type}) , \`time\` = '${time_functions.Make_time()}', \`status_price\` = '${status_price}', \`status_count\` = '${req.body.type}', \`actural_earn\` = ${req.body.actural_earn} + (${req.body.price} - ${req.body.average_bought_price}) * ${count_num}, \`before_price\` = '${req.body.before_price}'
        WHERE \`name\`= '${req.body.name}'`, (err, rows2) => {
          if(err) {            
            req.flash('red_alert','잘못된 정보가 입력되었습니다.')
            res.redirect('back')
          } else {
            req.flash('green_alert','자산 정보가 업데이트되었습니다.')
            res.redirect('back')
          }
        })
      })
     }
  }

  // 가격이 상승, 유지, 하락한 경우 및 입력된 req.body.price값이 할당되지 않는 경우에 따라 나누어주는 if문
  if(req.body.price - req.body.before_price > 0){
    let status_price = 1;
    if(req.body.count){
      let count_num = req.body.count;
      dataupdate_function (status_price, count_num)
    } else {
      let count_num = 0;
      dataupdate_function (status_price, count_num)
    }
  } else if (req.body.before_price == req.body.price){
    let status_price = 0;
    if(req.body.count){
      let count_num = req.body.count;
      dataupdate_function (status_price, count_num)
    } else {
      let count_num = 0;
      dataupdate_function (status_price, count_num)
    }
  } else {
    let status_price = -1;
    if(req.body.count){
      let count_num = req.body.count;
      dataupdate_function (status_price, count_num)
    } else {
      let count_num = 0;
      dataupdate_function (status_price, count_num)
    }
  }
});

// 새로운 종목 생성
router.post('/create_data', function(req, res) {
  // 특수문자 정규식 변수(공백 미포함, 숫자 제외), req.body.name이 포함해서는 안되는 문자들
  var replaceChar_can_num = /[~!@\#$%^&*\()\-=+_'\;<>\/.\`:\"\\,\[\]?|{}]/gi;
  // 특수문자 정규식 변수(공백 포함), req.body.unit이 포함해서는 안되는 문자들
  var replaceChar = /[~!@\#$%^&*\()\-=+_'\;<>0-9\/.\`:\"\\,\[\]?|{}\s]/gi;

  if(replaceChar_can_num.test(req.body.name) == false && replaceChar.test(req.body.unit) == false){
    MySqlHandler.myinvest_personal_DB.query(`
      INSERT INTO \`${req.user.id}_asset_status\` (name, price, count, unit, time, average_bought_price, status_price, status_count, before_price, actural_earn) VALUES ('${req.body.name}', '${req.body.price}', '${req.body.count}', '${req.body.unit}', '${time_functions.Make_time()}', '${req.body.price}', 0, 0, '${req.body.price}', 0);
      INSERT INTO \`${req.user.id}_asset_recode\` (name, price, count, code, time, after_count, average_bought_price, actural_earn, status_price, status_count) VALUES ('${req.body.name}', '${req.body.price}', '${req.body.count}', last_insert_id(), '${time_functions.Make_time()}', '${req.body.count}', '${req.body.price}', 0, 0, 0);
      `, (err, rows) => {
        if(err) {        
          req.flash('red_alert','중복되는 종목 이름이 존재하는지 확인해주세요.')
          res.redirect('back');
        } else { 
        req.flash('green_alert','새 종목이 추가되었습니다.')
        res.redirect('back');
        }
    })
  } else {
    req.flash('red_alert','잘못된 데이터가 입력되었습니다.')
    res.redirect('back');
  }
});

// 입력 기록 삭제 && 만약 마지막 입력기록일 경우 모든 데이터 삭제
router.post('/delete_data', function(req, res) {
  // delete_all이 존재할 경우 : 그냥 전부 삭제
  if(req.body.delete_all == 1){
    MySqlHandler.myinvest_personal_DB.query(`DELETE FROM \`${req.user.id}_asset_recode\` WHERE \`code\`= ${req.body.code}; DELETE FROM \`${req.user.id}_asset_status\` WHERE \`code\`= ${req.body.code};`, (err, rows) => {
      req.flash('green_alert','종목 데이터가 모두 삭제되었습니다.')
      res.redirect('/');
    });
  // 그 외의 경우 : asset_status값을 역으로 수정해주어야함. + actural_earn 수정해주었음
  } else {
    // 구매기록 제거시
    if(req.body.count > 0){
      MySqlHandler.myinvest_personal_DB.query(`UPDATE \`${req.user.id}_asset_status\` SET average_bought_price = ((average_bought_price * count) - (price * ${req.body.count})) / (count - ${req.body.count}), \`price\` = '${req.body.old_price}' , count = count - '${req.body.count}' , \`time\` = '${time_functions.Make_time()}', \`status_price\` = '${req.body.status_price}', \`status_count\` = '${req.body.status_count}', \`before_price\` = '${req.body.before_price}', \`actural_earn\` = '${req.body.actural_earn}' WHERE \`code\`= '${req.body.code}';
      DELETE FROM \`${req.user.id}_asset_recode\` WHERE \`no\`= ${req.body.no}`, (err, rows) => {
        if(err) {throw err}
        else { 
          req.flash('green_alert','기록 내용이 삭제되었습니다.')
          res.redirect('back');
        }
      })
      // 판매 or 갱신기록 제거시
    } else {
      MySqlHandler.myinvest_personal_DB.query(`UPDATE \`${req.user.id}_asset_status\` SET \`price\` = '${req.body.old_price}' , count = count - '${req.body.count}' , \`time\` = '${time_functions.Make_time()}', \`actural_earn\` = actural_earn - (${req.body.old_price} - average_bought_price) * ${req.body.count}, \`status_price\` = '${req.body.status_price}', \`status_count\` = '${req.body.status_count}', \`before_price\` = '${req.body.before_price}', \`actural_earn\` = '${req.body.actural_earn}' WHERE \`code\`= '${req.body.code}';
      DELETE FROM \`${req.user.id}_asset_recode\` WHERE \`no\`= ${req.body.no}`, (err, rows) => {
        if(err) {throw err}
        else { 
          req.flash('green_alert','기록 내용이 삭제되었습니다.')
          res.redirect('back');
        }
      })
    }
  }
});

module.exports = router;

