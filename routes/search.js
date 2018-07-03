var express = require('express');
var router = express.Router();
var fs = require("fs");
var file='./database/picube_data.db';

var sqlite = require('sqlite3');
var db = new sqlite.Database(file);


router.get('/', function(req, res, next) {
    res.render('search',{tag:req.query.tag});
});
router.get('/searchByTag', function(req, res, next) {
    db.all("select * from record where recordid in (select distinct recordid from picture where tag = '"+req.query.tag+"' ) OR createrid ='"+req.query.tag+"' or content like '%"+req.query.tag+"%';",function (err,rows){
        // console.log(rows);
        res.json(rows);
    });
});
module.exports = router;
