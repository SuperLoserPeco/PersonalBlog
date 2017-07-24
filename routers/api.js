var express = require('express');
var router = express.Router();

//注册逻辑
//	用户名不为空
//	密码不能为空
//	密码输入一致

//	用户名是否被注册
//
//
var responseData;

router.use(function(req, res, next){
	responseData = {
		code: 0,
		message: ''
	};
	next();
});

router.post('/user/register', function(req, res, next){
	console.log(req.body);

	var username = req.body.username;
	var password = req.body.password;
	var repassword = req.body.repassword;

	if(username == ''){
		responseData.code = 1;
		responseData.message = '用户名不能为空';
		res.json(responseData);
		return;
	}
	if(password == ''){
		responseData.code = 2;
		responseData.message = '密码不能为空';
		res.json(responseData);
		return;
	}
	if(password != repassword){
		responseData.code = 3;
		responseData.message = '两次输入的密码不一致';
		res.json(responseData);
		return;
	}

	responseData.message = '注册成功';
	res.json(responseData);
	//res.send('User');
});

module.exports = router;