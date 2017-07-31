// 操作模型对数据进行增删查改

var mongoose = require('mongoose');
var contentSchema = require('../schemas/contents');

module.exports = mongoose.model('Content', contentSchema);