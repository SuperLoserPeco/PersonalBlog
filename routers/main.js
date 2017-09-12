var express = require('express');
var router = express.Router();

var Category = require('../models/Category');
var Content = require('../models/Content');

//第二个参数 分配给模板使用的数据
router.get('/', function(req, res, next){
	var data = {
		userInfo: req.userInfo,
		category: req.query.category || "",
		categories: [],

		count: 0,
		page: Number(req.query.page || 1),
		limit: 2,
		pages: 0,
	}

	var where = {};
	if(data.category) {
		where.category = data.category
	}

	Category.find().then(function(categories){
		data.categories = categories;

		return Content.where(where).count();
	}).then(function(count){
		data.count = count;
		data.pages = Math.ceil(data.count / data.limit);

		data.page = Math.min(data.pages, data.page);
		data.page = Math.max(data.page, 1);
		var skip = (data.page - 1) * data.limit;



		return Content.where(where).find().limit(data.limit).skip(skip).populate(['category', 'user']).sort({
			addTime: -1
		});
	}).then(function(contents){
		data.contents = contents;
		console.log(data)
		res.render('main/index', data);
	});
});



module.exports = router;