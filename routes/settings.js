/**
 * Created by Administrator on 2017/11/15.
 */
var express = require('express');
var router = express.Router();
var fs = require("fs");
var file='./database/picube_data.db';

var sqlite = require('sqlite3');
var db = new sqlite.Database(file);

/* GET home page. 首页*/
router.get('/', function(req, res, next) {
    res.render('settings');
});
router.get('/submitSettings', function(req, res, next) {
    db.run("UPDATE user SET icon = ? where userid = ?",[req.query.icon,req.session.user],function (err){
        res.redirect('homepage');
    });
});
module.exports = router;