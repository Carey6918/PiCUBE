var express = require('express');
var router = express.Router();

/* GET home page. 首页*/
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});
router.post('/headline', function (req, res, next) {
    var headLength = 5;
    var recordArray = new Array(headLength);
    var pictureArray = new Arrau(headLength);
    db.all("SELECT * FROM record order by createTime desc limit 5;", function (err, rows) {
        if (!err) {
            for (var i = 0; i < headLength; i++) {
                recordArray[i] = rows[i];
                db.all("SELECT * FROM picture where recordid = '222Sat Nov 04 2017 18:54:18 GMT+0800 (中国标准时间)' ;", function (err, rows) {
                    if (!err) {
                        pictureArray[i] = rows[i];
                    }else{
                        // return res.json({error: true});
                    }
                })
            }
            return res.json({success: true, record: recordArray, picture: pictureArray});
        } else {
            return res.json({error: true});
        }
    });
});
module.exports = router;
