var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/:username/home', function(req, res, next) {
    res.render('user/home');
});

module.exports = router;
