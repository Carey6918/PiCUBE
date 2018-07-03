/**
 * Created by Administrator on 2017/11/11.
 */
var express = require('express');
var router = express.Router();
var fs = require("fs");
var file='./database/picube_data.db';

var sqlite = require('sqlite3');
var db = new sqlite.Database(file);


router.get('/', function(req, res, next) {
    //处理recordid（不知道为什么“+”无法传过来）
    var tempVal = req.query.recordid.split("GMT ");
    var recordidVal = tempVal[0]+"GMT+"+tempVal[1];
    db.all("SELECT * FROM record where recordid = '"+recordidVal+"';",function (err,rows) {
        var recVal = rows[0];
        db.all("SELECT * FROM User where userid = '"+recVal.createrid+"';",function (err,rows) {
            res.render('detailInfo',{record:recVal,author:rows[0]});
        });
    });
});
router.get('/getRelatedPosts', function(req, res, next) {
    db.all("SELECT * FROM picture where tag = '"+req.query.tag+"' and recordid != '"+req.query.recordid+"' order by recordid limit 3;",function (err,rows) {
        res.json(rows);
    });
});
router.get('/getRecentPosts', function(req, res, next) {
    db.all("SELECT * FROM record where createrid = '"+req.query.createrid+"' order by createTime desc limit 5;",function (err,rows) {
        res.json(rows);
    });
});
router.get('/getFirstPic', function(req, res, next) {
    db.all("SELECT * FROM picture where recordid = '"+req.query.recordid+"';",function (err,rows) {

        res.json({ pic: rows[0]});
    });
});
router.get('/submitComment', function(req, res, next) {
    db.run("INSERT INTO commentList (recordid, createrid, content) " + "VALUES (?, ?, ?);",
        [req.query.recordid, req.session.user,req.query.content],function (err,rows) {
            db.run("UPDATE record SET commentNums = commentNums + 1 where recordid = '"+ req.query.recordid+"';");
            res.redirect('/detailInfo?recordid='+req.query.recordid);
            // res.render('/userInfo?username='+req.query.user);
        });
});
router.get('/getComments', function(req, res, next) {
    db.all("SELECT icon,recordid,createrid,createTime,content FROM commentList, User where recordid = '"+req.query.recordid+"' and userid = createrid;",function (err,rows) {
        res.json(rows);
    });
});
router.get('/setLike',function (req,res,next) {
    db.run("INSERT INTO likeList (userid, recordid) "+"VALUES (?,?);",[req.session.user,req.query.recordid],function (err,rows) {
        db.run("UPDATE record SET likeNums = likeNums + 1 where recordid = '"+ req.query.recordid+"';");
        res.json(true);
    });
});
router.get('/notsetLike',function (req,res,next) {
    db.run("DELETE FROM likeList where userid = '"+req.session.user+"' and recordid = '"+req.query.recordid+"';",function (err,rows) {
        db.run("UPDATE record SET likeNums = likeNums - 1 where recordid = '"+ req.query.recordid+"';");
        res.json(true);
    });
});
router.get('/isLike',function (req,res) {
       db.all("SELECT * FROM likeList where userid = '"+req.session.user+"' and recordid = '"+req.query.recordid+"';",function (err,rows) {
       // console.log(req.query.recordid);
       // console.log(rows[0]);
       if(rows.length!=0){

           res.json(true);

       }else{
           res.json(false);
       }
   }) ;
});
module.exports = router;