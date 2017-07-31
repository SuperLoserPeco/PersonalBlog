var express = require('express');
var router = express.Router();

var User = require('../models/User');
var Category = require('../models/Category');

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
	//limit(number) 限制数据获取的条数

	//skip() 忽略数据的条数
	var page = Number(req.query.page || 1);
	var limit = 2;
	var pages = 0;

	console.log("zenme le");
	User.count().then(function(count){
		console.log(count);
		pages = Math.ceil(count / limit);

		page = Math.min(pages, page);
		page = Math.max(page, 1);

		var skip = (page - 1) * limit;

		User.find().limit(limit).skip(skip).then(function(users){
		
			res.render('admin/user_index', {
				userInfo: req.userInfo,
				users: users,

				count: count,
				pages: pages,
				limit: limit,

				page: page
			});
		})
	})
});

//分类首页
router.get('/category', function(req, res){
	res.render('admin/category_index', {
		userInfo: req.userInfo
	})
})

//添加分类
router.get('/category/add', function(req, res){
	res.render('admin/category_add', {
		userInfo: req.userInfo
	})
})

//保存分类
router.post('/category/add', function(req, res){
	var name = req.body.name;
	if(name == ''){
		res.render('admin/error', {
			userInfo: req.userInfo,
			message: "名称不能为空"
		});
		return;
	}

	Category.findOne({
		name: name
	}).then(function(rs){
		if(rs){
			res.render('admin/error', {
				userInfo: req.userInfo,
				message: "分类已经存在"
			})
			return Promise.reject();
		}
		else{
			return new Category({
				name: name
			}).save();
			
		}
	}).then(function(newCategory){
		res.render('admin/success', {
			userInfo: req.userInfo,
			message: "分类保存成功",
			url: '/admin/category'
		})
	});
})

module.exports = router;