/**
 * Created by Administrator on 2017/10/31.
 */
var express = require('express');
var router = express.Router();

var fs = require("fs");
var file='./database/picube_data.db';


var sqlite = require('sqlite3');
var db = new sqlite.Database(file);


/**
 * 这是我自己写的界面跳转，res.render是界面跳转语句
 */
router.get('/login', function(req, res,next) {
    db.all("SELECT * FROM User WHERE userid = ?",[req.query.username], function(err, rows){
        if(err){                                         //错误就返回给原post处（login.html) 状态码为500的错误
            res.send(500);
            console.log(err);
        }else if(!rows){                                 //查询不到用户名匹配信息，则用户名不存在
            req.session.error = '用户名不存在';
            res.send(404);                            //    状态码返回404
            //    res.redirect("/login");
        }else{
            if(req.query.password != rows[0].password){     //查询到匹配用户名的信息，但相应的password属性不匹配
                req.session.error = "密码错误";
                res.send(404);
                //    res.redirect("/login");
            }else{                                     //信息匹配成功，则将此对象（匹配到的user) 赋给session.user  并返回成功
                req.session.user = rows[0].userid;
               // console.log(req.session.user);
               // res.send(200);
                //    res.redirect("/home");
                //res.render('homepage', {title:'..'});
                res.redirect('/homepage');
            }
        }
    });
});
router.get('/toregister', function(req, res,next) {
    res.render('register',{ title: 'Rigister' });
});
/**
 * 注册一个账号
 */
router.get('/register', function(req, res,next) {
    if(req.query.password==req.query.cfmpassword){
        var exist = false;
        db.all("SELECT * FROM User WHERE userid = ?",[req.query.username], function(err, rows) {
            if (rows.length != 0) {
                exist = true;
                console.log(exist);
                //TODO 有没有更好的变现方式。
            } else {
                db.run("INSERT INTO User (userid, password) " + "VALUES (?, ?);",
                    [req.query.username, req.query.password],
                    function (error) {
                        if (error) {
                            console.log('FAIL on add ' + error);
                            //alert("w");
                            //callback(error);
                        } else {
                            //callback(null);
                            req.session.user = req.query.username;
                            console.log(req.session.user);
                            res.redirect('/homepage');

                        }
                    });
            }
        });
    }else{
        console.log("Sorry!Wrong confirm password!");
        alert("Sorry!Wrong confirm password!");
    }
});
router.get("/logout",function(req,res){    // 到达 /logout 路径则登出， session中user,error对象置空，并重定向到根路径
    req.session.user = null;
    req.session.error = null;
    res.redirect("/");
});
module.exports = router;