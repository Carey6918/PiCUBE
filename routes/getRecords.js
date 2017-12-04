/**
 * Created by Administrator on 2017/11/5.
 */
var express = require('express');
var router = express.Router();
var fs = require('fs');
var file ='./database/picube_data.db';
var sqlite = require('sqlite3');
var db = new sqlite.Database(file);


router.post('/', function(req, res, next) {
    if(req.session.category =='全部'||!req.session.category ){
    db.all("SELECT * FROM record where createrid in " +
        "(SELECT beFollowedUser FROM fansList " +
        " where followUser = '"+req.session.user+"'"+
        ") or createrid = '"+req.session.user +"'"+
        " order by createTime desc;",function(err, rows) {

            res.json(rows);
    });
    }else{
        db.all("SELECT * FROM record where createrid in " +
            "(SELECT beFollowedUser FROM fansList " +
            " where followUser = '"+req.session.user+"' and category = '"+req.session.category +"'"+
            ") or createrid = '"+req.session.user +"'"+
            " order by createTime desc;",function(err, rows) {
            res.json(rows);
        });
    }
});
router.get('/getPics', function(req, res, next) {
    db.all("SELECT * FROM picture where recordid = '"+req.query.recordid+"';",function (err,rows) {
        //console.log(rows);
        res.json(rows);
    });
});
router.get('/setCategorySession', function(req, res, next) {
    req.session.category = req.query.cateSession;
    res.json(true);
});
module.exports = router;