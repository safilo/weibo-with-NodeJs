var express = require('express'),
    router = express.Router(),
    querystring = require('querystring'),
    middle = require('../middle');

router.get('/getBlog', function(req, res, next) {
    Model('Blog').find(function(err, doc) {
        if (err) {
            req.flash('error', '获取失败');
            res.send('获取失败');
        } else {
            if (doc) {
                console.log(doc instanceof Array);
                req.flash('success', '获取成功');
                res.send(doc);
            } else {
                req.flash('error', '获取失败');
                res.send('获取失败');
            }
        }
    }).sort({
        releaseTime: -1
    });
});

router.post('/publishBlog', middle.checkLogin, function(req, res, next) {
    var blog = null;
    if (req.body　 && req._body) {
        console.log(' 已经指定 Content-Type ，body-parser可以解析');
        blog = req.body;
        saveBlog(req, res, blog);
    } else {
        var str = '';
        req.on('data', function(data) {
            console.log(' 没有指定 Content-Type ，body-parser不能解析');
            str += data;
        });
        req.on('end', function() {
            blog = JSON.parse(str);
            console.log('stream : ', blog);
            saveBlog(req, res, blog);
        });
    }
});

router.get('/getComment', middle.checkLogin, function(req, res, next) {
    Model('Comment').find({
        blog: req.query.rid
    }, function(err, doc) {
        if (err) {
            console.log('getComment error 1 : ', err);
            res.send('getComment error 1');
        } else {
            if (doc) {
                console.log('getComment success : ', doc);
                res.send(doc);
            } else {
                console.log('getComment error 2: ', err);
                res.send('getComment error 2');
            }
        }
    }).sort({
        releaseTime: -1
    });
});

router.post('/publishReply', middle.checkLogin, function(req, res, next) {
    var reply = req.body;
    console.log('req.body : ', reply);
    Model('Comment').create(reply, function(err, doc) {
        if (err) {
            console.log('publishReply error 1 : ', err);
            res.send('publishReply error 1');
        } else {
            if (doc) {
                // 更新相应博客的评论数
                Model('Blog').update({
                    _id: reply.blog
                }, {
                    $inc: {
                        commentCount: 1
                    }
                }, function(err, doc) {
                    if (err) {
                        console.log('更新评论数量失败-1');
                    } else {
                        if (doc) {
                            console.log(doc);
                        } else {
                            console.log('更新评论数量失败-2');
                        }
                    }
                });
                res.send(doc);
            } else {
                console.log('publishReply error 2 : ', err);
                res.send('publishReply error 2');
            }
        }
    });
});

// 保存发布的微博
function saveBlog(req, res, blog) {
    Model('Blog').create(blog, function(err, doc) {
        console.log('doc : ', doc);
        if (err) {
            console.log(err);
            req.flash('error', '发布失败');
            res.send('发布失败1');
        } else {
            if (doc) {
                req.flash('success', '发布成功');
                res.send(doc);
            } else {
                req.flash('error', '发布失败');
                res.send('发布失败');
            }
        }
    });
}

module.exports = router;
