/**
 * Created by Administrator on 2017/11/1.
 */
var express = require('express');
var router = express.Router();
var fs = require("fs");
var file='./database/picube_data.db';

var sqlite = require('sqlite3');
var db = new sqlite.Database(file);

/* GET home page. 首页*/
router.get('/', function(req, res, next) {
    var fansNums = 123;
    db.all("SELECT * FROM User WHERE userid = ?",req.session.user, function(err, rows){
        {
            if(err){                                         //错误就返回给原post处（login.html) 状态码为500的错误
                res.send(500);
                console.log(err);
            }else if(!rows){                                 //查询不到用户名匹配信息，则用户名不存在
                req.session.error = '用户名不存在';
                res.send(404);                            //    状态码返回404
                //    res.redirect("/login");
            }else{
                var fansNums = rows[0].fansNums;
                var followNums = rows[0].followNums;
                var recordNums = rows[0].recordNums;
                res.render('homepage', { fansNums: fansNums ,followNums:followNums,recordNums:recordNums });
                }
            }
    });


});

module.exports = router;
