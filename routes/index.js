var express = require('express'),
    router = express.Router();
    middle = require('../middle');

/* GET home page. */
router.get('/', middle.checkNotLogin, function(req, res, next) {
  res.render('index', { title: 'Express',sidebar : ['推荐','奥运', '明星', '视频', '搞笑', '情感', '社会', '综艺', '美妆', '美食', '美女模特', '...更多']});
});

router.get('/:username/home', middle.checkLogin, function(req, res, next) {
    res.render('user/home');
});

module.exports = router;
