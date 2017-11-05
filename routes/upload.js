/**
 * Created by Administrator on 2017/11/3.
 */


var express = require('express');
var router = express.Router();
var multer = require('multer');
var fs = require('fs');
var file ='./database/picube_data.db';
var sqlite = require('sqlite3');
var db = new sqlite.Database(file);
var uploadDir ='./public/images/database/';
var recordPic = new Array;
var picPath = new Array;
router.post('/pic',multer({dest: uploadDir}).array('file'), function(req, res, next) {
    var responseJson = {
        origin_file: req.files[0]// 上传的文件信息
    };
    var src_path = req.files[0].path;
    var des_path = req.files[0].destination + req.files[0].originalname;
    var sql_path = "/images/database/" +req.files[0].originalname;
    fs.rename(src_path, des_path, function (err) {
        if (err) {
            throw err;
        }

        fs.stat(des_path, function (err, stat) {
            if (err) {
                throw err;
            }

            responseJson['upload_file'] = stat;
            // console.log(responseJson.origin_file.path);
            console.log(sql_path);
            recordPic.push(responseJson.origin_file.path);
            picPath.push(sql_path);
            return res.json(responseJson);
        });
    });

    // console.log(responseJson);
});
router.get('/commit', function(req, res,next) {
    if(recordPic==""){
        console.log("wrong");
    }else{
        var userid = req.session.user;
        var createTime = new Date();
        var content = req.query.description;
        var tag = req.query.tag;
        var recordid = userid+createTime;
        console.log(recordid);
        db.run("INSERT INTO record (recordid, createrid, content) " + "VALUES (?, ?,  ?);",
            [recordid,userid, content],
            function (error) {
                if (error) {
                    console.log('FAIL on add ' + error);
                } else {
                    while (recordPic!=""){
                        var picUrl = recordPic.pop();
                        var path = picPath.pop();
                        db.run("INSERT INTO picture (url, tag, recordid,path) " + "VALUES (?, ?, ?,?);",
                        [picUrl,tag,recordid,path]);
                    }
                    res.redirect("/homepage");
                }
            }
            );

    }
    // console.log(recordPic);
    // res.redirect('/homepage');
});
router.post('/headline', function(req, res, next) {
    var headLength = 6;
    var recordArray = new Array(headLength);
        db.all("SELECT * FROM record order by createTime desc limit 6;",function(err, rows) {
            for(var i = 0; i < headLength; i++) {
                recordArray[i] = rows[i];
            }
            res.json({record: recordArray});
        });
});
router.get('/headlinepic', function(req, res, next) {
    db.all("SELECT * FROM picture where recordid = '"+req.query.recordid+"';",function (err,rows) {
        res.json({ pic: rows[0]});
    });
});

function getPicture(val) {
    db.all("SELECT * FROM picture where recordid = '"+val+"';",function (err,rows) {
        // console.log(rows[0]);
        callback(rows[0]);
    });
}
module.exports = router;
