// MySql의 모듈
var exports = module.exports = {};

const mysql = require('mysql');

// DB 정보
const DBconfig  = require('../config/DBset.json'); 

// Main DB. 회원정보 및 세션을 활용하기 위한 스키마
exports.myinvest_mainDB = mysql.createConnection({
      host: DBconfig.host,
      port: DBconfig.port,
      user: DBconfig.user,
      password: DBconfig.password,
      database: DBconfig.myinvest
});