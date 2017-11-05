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

    db.all("SELECT * FROM record where createrid = " +
        "(SELECT beFollowedUser FROM fansList " +
        " where followUser = '"+req.session.user+"'"+
        ") or createrid = '"+req.session.user +"'"+
        " order by createTime desc;",function(err, rows) {
            res.json(rows);
    });
});
router.get('/getPics', function(req, res, next) {
    db.all("SELECT * FROM picture where recordid = '"+req.query.recordid+"';",function (err,rows) {
        console.log(rows);
        res.json(rows);
    });
});
module.exports = router;