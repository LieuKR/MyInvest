var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // 세션 작동 확인용
  req.session.Session_Test = "Test Session";
  res.render('index', { title: 'Express' });
});

module.exports = router;
