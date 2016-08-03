var express = require('express');
var router = express.Router();
var util = require('../util');

/* GET users listing. */
// router.get('/', function(req, res, next) {
//     res.render('user/home');
// });

router.post('/reg', function(req, res, next) {
    var user = req.body;
    if (user.password != user.repassword) {
        req.flash('error', '两次输密码不一致');
        return res.redirect('/');
    }

    user.password = util.md5(user.password);
    Model('User').create(user, function(err, doc) {
        if (err) {
            req.flash('error', '注册失败，请重新注册');
            res.redirect('back');
        } else {
            if (doc) {
                req.session.user = doc;
                req.flash('success', '注册成功！亲爱的' + user.username + ', 欢迎您~');
                res.redirect('/' + encodeURI(user.username) + '/home');
            }
        }
    });
});

router.post('/login', function(req, res, next) {
    var user = req.body;
    user.password = util.md5(user.password);
    Model('User').findOne(user, function(err, doc) {
        if(err) {
            req.flash('error', '登录失败，请重新登录');
            res.redirect('back');
        } else {
            if(doc) {
                req.session.user = doc;
                req.flash('success', '登录成功！亲爱的' + user.username + ', 欢迎您~');
                res.redirect('/' + encodeURI(user.username) + '/home');
            } else {
                req.flash('error', '用户不存在或密码不正确, 请重新登录');
                res.redirect('back');
            }
        }
    });
});

router.get('/logout', function(req, res, next) {
    req.session.user = null;
    req.flash('success', '退出成功');
    res.redirect('/');
});

module.exports = router;
