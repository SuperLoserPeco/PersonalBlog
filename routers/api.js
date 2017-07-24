var express = require('express');
var router = express.Router();

//注册逻辑
//	用户名不为空
//	密码不能为空
//	密码输入一致

//	用户名是否被注册
//
//
router.post('/user/register', function(req, res, next){
	console.log(req.body);
	//res.send('User');
});

module.exports = router;