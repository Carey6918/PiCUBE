/**
 * Created by Administrator on 2017/10/31.
 */
var express = require('express');
var router = express.Router();

var fs = require("fs");
var file='./database/test.db';


var sqlite = require('sqlite3');
var db = new sqlite.Database(file);


/**
 * 这是我自己写的界面跳转，res.render是界面跳转语句
 */
router.get('/login', function(req, res,next) {
    console.log(req.query);
    console.log("调用到Login");
    return res.render('homepage',{ title: 'Homepage' });
});
router.get('/toregister', function(req, res,next) {
    res.render('register',{ title: 'Rigister' });
});
router.get('/register', function(req, res,next) {

    res.render('homepage',{ title: 'Homepage' });
});
module.exports = router;