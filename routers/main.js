var express = require('express');
var router = express.Router();

//第二个参数 分配给模板使用的数据
router.get('/', function(req, res, next){
	console.log("-----up-----");
	console.log(req.userInfo.id);
	console.log("-----down-----");

	res.render('main/index', {
		userInfo: req.userInfo
	});
});

module.exports = router;