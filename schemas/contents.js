var mongoose = require('mongoose');

module.exports = new mongoose.Schema({
	//关联字段 分类的id
	category: {
		type: mongoose.Schema.Types.ObjectId,
		//饮用
		ref: 'Content'
	},
	title: String,
	description: {
		type: String,
		default: ''
	},
	content: {
		type: String,
		default: ''
	}
})