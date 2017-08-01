var mongoose = require('mongoose');

module.exports = new mongoose.Schema({
	//关联字段 分类的id
	category: {
		type: mongoose.Schema.Types.ObjectId,
		//饮用
		ref: 'Category'
	},
	title: String,
	user: {
		type: mongoose.Schema.Types.ObjectId,
		//饮用
		ref: 'User'
	},
	addTime: {
		type: Date,
		default: new Date()
	},

	//阅读量
	views: {
		type: Number,
		default: 0
	},

	description: {
		type: String,
		default: ''
	},
	content: {
		type: String,
		default: ''
	}
})