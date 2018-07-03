var express = require('express');
var router = express.Router();
var fs = require("fs");
var file='./database/picube_data.db';

var sqlite = require('sqlite3');
var db = new sqlite.Database(file);

/* GET home page. 首页*/
router.get('/', function(req, res, next) {
    res.render('hotpics');
});
router.post('/getHotpics', function(req, res, next) {
    db.all("select * from record where createTime >=datetime('now','start of day','-60 day') order by relayNums+likeNums+commentNums desc;",function (err,rows){
        res.json(rows);

    });
});
module.exports = router;
