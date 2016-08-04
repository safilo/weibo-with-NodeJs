var express = require('express'),
    router = express.Router();
    middle = require('../middle');

/* GET home page. */
router.get('/', middle.checkNotLogin, function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/:username/home', middle.checkLogin, function(req, res, next) {
    res.render('user/home');
});

module.exports = router;
