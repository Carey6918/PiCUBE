var session = require('express-session');

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//每次新建一个routes里的js都要在这里加一个路径
var index = require('./routes/index');
var helloRouter = require('./routes/hello')
var user = require('./routes/user');
var homepage = require('./routes/homepage');
var upload = require('./routes/upload');
var userInfo = require('./routes/userInfo');
var getRecords = require('./routes/getRecords');
var detailInfo = require('./routes/detailInfo');
var settings = require('./routes/settings');
var app = express();
app.use(session({
    secret: "secret",
    cookie: {
        maxAge: 1000 * 60 * 30}}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
    res.locals.user = req.session.user;   // 从session 获取 user对象
    res.locals.category = req.session.category;
    var err = req.session.error;   //获取错误信息
    delete req.session.error;
    res.locals.message = "";   // 展示的信息 message
    if (err) {
        res.locals.message = '<div class="alert alert-danger" style="margin-bottom:20px;color:red;">' + err + '</div>';
    }
    next();  //中间件传递
});
//这里也要加一个
app.use('/', index);
app.use('/hello', helloRouter);
app.use('/user', user);
app.use('/homepage', homepage);
app.use('/upload',upload);
app.use('/userInfo',userInfo);
app.use('/getRecords',getRecords);
app.use('/detailInfo',detailInfo);
app.use('/settings',settings);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    // next(err);
    res.render('error');
    //console.log(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

app.listen(8000, function () {
    console.log("请在浏览器访问：http://localhost:8000/");
});

module.exports = app;
