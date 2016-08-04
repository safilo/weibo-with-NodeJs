module.exports = {
    checkNotLogin(req, res, next) {
        if(req.session.user) {
            req.flash('success', '你已经登录');
            res.redirect('/' + req.session.user.username + '/home');
        } else {
            next();
        }
    },
    checkLogin(req, res, next) {
        if(req.session.user) {
            next();
        } else {
            req.flash('success', '请登录');
            res.redirect('/');
        }
    }
}
