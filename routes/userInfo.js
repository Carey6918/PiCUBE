/**
 * Created by Administrator on 2017/11/5.
 */
var express = require('express');
var router = express.Router();
var fs = require("fs");
var file='./database/picube_data.db';
var sqlite = require('sqlite3');
var db = new sqlite.Database(file);

router.get('/', function(req, res, next) {
  //  console.log(req.query.username);
    db.all("SELECT * FROM User WHERE userid = ?",req.query.username, function(err, rows){
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
                res.render('userInfo', {username:req.query.username, fansNums: fansNums ,followNums:followNums,recordNums:recordNums });
            }
        }
    });
});

router.get('/getRec', function(req, res, next) {
    db.all("SELECT * FROM record where createrid = '"+req.query.user +"'"+
        " order by createTime desc;",function(err, rows) {
        res.json(rows);
    });
});
router.get('/checkFollow', function(req, res, next) {
    db.all("SELECT * FROM fanslist where followUser = '"+req.session.user+"' and beFollowedUser = '"+req.query.user+"';",function (err,rows) {
        if(rows.length==0){
            console.log("no follow relationship");
            res.json(false);
        }else{
            console.log("follow relationship");
            res.json(true);
        }
    });
});
router.get('/setFollow', function(req, res, next) {
    db.run("INSERT INTO fansList (followUser, beFollowedUser, category) " + "VALUES (?, ?, ?);",
        [req.session.user, req.query.user,req.query.category],function (err,rows) {
            db.run("UPDATE User SET fansNums = fansNums + 1 where userid = '"+req.query.user+"';");
            db.run("UPDATE User SET followNums = followNums + 1 where userid = '"+req.session.user+"';");
            res.redirect('/userInfo?username='+req.query.user);
            // res.render('/userInfo?username='+req.query.user);
        });
});

router.get('/noFollow', function(req, res, next) {
    db.run("DELETE FROM fansList where followUser = '"+req.session.user+"' and beFollowedUser = '"+req.query.user+"';",
        function (err,rows) {
            db.run("UPDATE User SET fansNums = fansNums - 1 where userid = '"+req.query.user+"';");
            db.run("UPDATE User SET followNums = followNums - 1 where userid = '"+req.session.user+"';");
            res.redirect('/userInfo?username='+req.query.user);
        });
});
router.post('/getCategories', function(req, res, next) {
    db.all("SELECT category FROM fansList where followUser = '"+req.session.user+"';",
        function (err,rows) {
        console.log(rows);
            res.json({category: rows});
        });
});
module.exports = router;