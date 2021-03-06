var express = require('express');
var router = express.Router();

var User = require('../models/User');
var Category = require('../models/Category');
var Content = require('../models/Content');

//身份验证
router.use(function(req, res, next){
	if(!req.userInfo.isAdmin){
		res.send('对不起 只有管理员才能登入');
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
	var page = Number(req.query.page || 1);
	var limit = 2;
	var pages = 0;

	console.log("zenme le");
	Category.count().then(function(count){
		console.log(count);
		pages = Math.ceil(count / limit);

		page = Math.min(pages, page);
		page = Math.max(page, 1);

		var skip = (page - 1) * limit;

		//1		生序
		//-1	降序
		Category.find().sort({_id: -1}).then(function(categories){
		
			res.render('admin/category_index', {
				userInfo: req.userInfo,
				categories: categories,

				// count: count,
				// pages: pages,
				// limit: limit,

				// page: page
			});
		})
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

//分类修改 删除
router.get('/category/edit', function(req, res){
	var id = req.query.id || '';

	Category.findOne({
		_id:id
	}).then(function(category){
		if(!category){
			res.render('admin/error', {
				userInfo: req.userInfo,
				message: "分类信息不存在"
			});
			return Promise.reject();
		}else{
			res.render('admin/category_edit', {
				userInfo: req.userInfo,
				category: category
			});
		}
	})
});

//分类的修改保存
router.post('/category/edit', function(req, res){
	var id = req.query.id || '';
	var name = req.body.name || '';

	Category.findOne({
		_id:id
	}).then(function(category){
		if(!category){
			res.render('admin/error', {
				userInfo: req.userInfo,
				message: "分类信息不存在"
			});
			return Promise.reject();
		}else{
			//未作任何修改
			if(name == category.name){
				res.render('admin/success', {
					userInfo: req.userInfo,
					message: "修改成功",
					url: '/admin/category'
				});
			}else{
				return Category.findOne({
					_id: {$ne: id},
					name: name
				})
			}
			//要修改的分类名字是否已经存在
		}
	}).then(function(sameCategory){
		if(sameCategory){
			res.render('admin/error', {
				userInfo: req.userInfo,
				message: "已存在同名分类"
			});
			return Promise.reject();
		}else{
			return Category.update({
				_id: id
			},{
				name: name
			});
		}
	}).then(function(){
		res.render('admin/success', {
			userInfo: req.userInfo,
			message: "修改成功",
			url: '/admin/category'
		})
	})

});

router.get('/category/delete', function(req, res){
	var id = req.query.id || '';
	Category.remove({
		_id: id
	}).then(function(){
		res.render('admin/success', {
			userInfo: req.userInfo,
			message: "删除成功",
			url: '/admin/category'
		})
	})
});

router.get('/content', function(req, res){
	console.log("to this")
	Content.count().then(function(count){
		Content.find().sort({_id: -1}).populate(['category', 'user']).sort({
			addTime: -1
		}).then(function(contents){
			console.log(contents)
			res.render('admin/content_index', {
				userInfo: req.userInfo,
				contents: contents
			});
		})
	})
});

//获得提交页面
router.get('/content/add', function(req, res){
	Category.find().sort({_id: -1}).then(function(categories){
		res.render('admin/content_add', {
			userInfo: req.userInfo,
			categories: categories
		})
	})
});
//进行提交操作
router.post('/content/add', function(req, res){
	if(req.body.category == ''){
		res.render('admin/error', {
			userInfo: req.userInfo,
			message: '目录不能为空'
		})
		return;
	}
	console.log(req.body.TextArea1)

	if(req.body.title == ''){
		res.render('admin/error', {
			userInfo: req.userInfo,
			message: '标题不能为空'
		})
		return;
	}

	new Content({
		category: req.body.category,
		title: req.body.title,
		user: req.userInfo.id.toString(),
		description: req.body.description,
		content: req.body.content
	}).save().then(function(rs){
		res.render('admin/success', {
			userInfo: req.userInfo,
			message: '内容保存成功'
		})
	});
});

router.get('/content/edit', function(req, res){
	var id = req.query.id || '';

	var categories = [];

	Category.find().sort({_id: 1}).then(function(rs){

		categories = rs;

		return Content.findOne({
			_id:id
		}).populate('category');
	}).then(function(content){		
		if(!content){
			res.render('admin/error', {
				userInfo: req.userInfo,
				message: "指定内容不存在"
			});
			return Promise.reject();
		}else{
			res.render('admin/content_edit', {
				userInfo: req.userInfo,
				categories: categories,
				content: content
			})
		}
	})
});
//分类的修改保存
router.post('/content/edit', function(req, res){
	var id = req.query.id || '';
	var name = req.body.name || '';

	if(req.body.category == ''){
		res.render('admin/error', {
			userInfo: req.userInfo,
			message: '目录不能为空'
		})
		return;
	}

	if(req.body.title == ''){
		res.render('admin/error', {
			userInfo: req.userInfo,
			message: '标题不能为空'
		})
		return;
	}

	Content.update({
		_id: id
	}, {
		category: req.body.category,
		title: req.body.title,
		description: req.body.description,
		content: req.body.content
	}).then(function(){
		res.render('admin/success', {
			userInfo: req.userInfo,
			message: '内容保存成功',
			url: '/admin/content/'
		})
	})
});

router.get('/content/delete', function(req, res){
	var id = req.query.id || '';

	Content.remove({
		_id: id
	}).then(function(){
		res.render('admin/success', {
			userInfo: req.userInfo,
			message: "删除成功",
			url: '/admin/content'
		})
	})
});

module.exports = router;