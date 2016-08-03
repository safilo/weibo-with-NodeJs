var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// mongoDB
require('./db');

// session && connect mongoDB
var settings = require('./settings'),
    session = require('express-session'),
    MongoStore = require('connect-mongo')(session);

// connect-flash
var flash = require('connect-flash');

// 路由
var routes = require('./routes/index');
var user = require('./routes/user');
var blog = require('./routes/blog');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('ejs').__express);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// session
app.use(session({
    secret : settings.cookieSecret,
    cookie : {
        // expires : new Date(Date.now() + 8 * 60 * 60 *1000 + 1000*10),
        // maxAge : 8 * 60 * 60 *1000 + 1000*60
    },
    resave : true,
    saveUninitialized : true,
    store : new MongoStore({
        url : settings.url
    })

}));
// connect-flash middleware
app.use(flash());

app.use(function(req, res, next) {
    // console.log('success: ',req.flash('success').toString(),'\n error: ', req.flash('error').toString());
    res.locals.user = req.session.user;
    res.locals.success = req.flash('success').toString();
    res.locals.error = req.flash('error').toString();
    next();
});

app.use('/', routes);
app.use('/user', user);
app.use('/blog', blog);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
