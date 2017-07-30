var express = require('express');
var router = express.Router();

var User = require('../models/User');

//身份驗證
router.use(function(req, res, next){
	if(!req.userInfo.isAdmin){
		res.send('對不起 衹有管理員才能');
		return;
	}
	next();
})

router.get('/', function(req, res, next){
	res.render('admin/index', {
		userInfo: req.userInfo
	});
});

router.get('/user', function(req, res, next){
	User.find().then(function(users){
		console.log(users);
		res.render('admin/user_index', {
			userInfo: req.userInfo,
			users: users
		});
	})


});

module.exports = router;