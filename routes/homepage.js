/**
 * Created by Administrator on 2017/11/1.
 */
var express = require('express');
var router = express.Router();

/* GET home page. 首页*/
router.get('/', function(req, res, next) {
    res.render('homepage', { title: 'Express' });
});

module.exports = router;
