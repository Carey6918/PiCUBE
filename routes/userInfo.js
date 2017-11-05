/**
 * Created by Administrator on 2017/11/5.
 */
var express = require('express');
var router = express.Router();
var fs = require("fs");
var file='./database/picube_data.db';
var sqlite = require('sqlite3');
var db = new sqlite.Database(file);
/* GET home page. 首页*/
router.get('/', function(req, res, next) {
    console.log(req.query.username);
    db.all("SELECT * FROM User WHERE userid = ?",[req.query.username], function(err, rows){
        var paswd = rows[0].password;
        res.render('userInfo',{password: paswd});
    });
});

module.exports = router;