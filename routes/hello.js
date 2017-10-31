/**
 * Created by Dell on 2017/10/19.
 * 这个是拉拉写的登录，目前没用它
 */
var express = require('express');
var router = express.Router();

var fs = require("fs");
var file='./database/test.db';


var sqlite = require('sqlite3');
var db = new sqlite.Database(file);


/* GET home page. */
router.get('/', function(req, res,next) {
    console.log(req.query)
    var result=false;
    db.all("SELECT password FROM user where username=?",[req.query.first_name] , function(err, rows) {
        if(!err){
            if(rows[0].password==req.query.last_name){
                result=true;
            } 
        }
        return res.render('login',{res:result});
    });
});

module.exports = router;