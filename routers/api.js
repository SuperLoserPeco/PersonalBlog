var express = require('express');
var router = express.Router();

//得到需要操作的模型
var User = require('../models/User');

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

	User.findOne({
		username: username
	}).then(function(userInfo){
		if(userInfo){

			console.log(userInfo)
			responseData.code = 4;
			responseData.message = '用户名已经被注册';
			res.json(responseData);
			return;
		}
		var user = new User({
			username: username,
			password: password
		});
		return user.save();
	}).then(function(newUserInfo){
		console.log(newUserInfo);
		//responseData.code = 5;
		responseData.message = '用户名注册成功';
		res.json(responseData);
	});

	// responseData.message = '注册成功';
	// res.json(responseData);
	//res.send('User');
});

router.post('/user/login', function(req, res){
	var username = req.body.username;
	var password = req.body.password;
	if (username == '' || password == ''){
		responseData.code = 1;
		responseData.message = "用户名和密码不能为空";
		res.json(responseData);
		return;
	}

	User.findOne({
		username: username,
		password: password
	}).then(function(userInfo){
		if(!userInfo){
			responseData.code = 2;
			responseData.message = "用户名或密码错误";
			res.json(responseData)
			return;
		}

		responseData.message = "登入成功"
		responseData.userInfo = {
			id: userInfo._id,
			username: userInfo.username
		}
		req.cookies.set('userInfo', JSON.stringify({
			id: userInfo._id,
			username: userInfo.username	
		}));
		res.json(responseData);
		return;
	})


})

router.get('/user/logout', function(req, res){
	req.cookies.set('userInfo', null);
	responseData.message = "退出成功"
	res.json(responseData);
})

module.exports = router;