var express = require('express');
var swig = require('swig');
var mongoose = require('mongoose');

//加载body-parser,用来处理post提交过来的数据
var bodyParser=require('body-parser');

var app = express();

//
app.use('/public',express.static(__dirname+'/public'));

//			模板名称后缀	模板解析方法
app.engine('html', swig.renderFile);
//		固定值		模板存放目录
app.set('views', './views');
//注册所使用的模板引擎
//		固定值
app.set('view engine', 'html')
//取消缓存 可以实时更改模板内容
swig.setDefaults({cache: false});


app.use('/admin', require('./routers/admin'));
app.use('/', require('./routers/main'));

app.listen(8081);


// app.get('/', function(req, res, next){
// 	//读取views目录下指定文件 并返回
// 	//param1	views/index.html	
// 	//param2	
// 	res.render('index')
// 	//res.send('<h1>welcome</h1>')
// })

// mongoose.connect('mongodb://localhost:27017/blog', function(err){
// 	if(err){
// 		console.log('database connect err');
// 	}
// 	else{
// 		console.log('database connect success');
// 		app.listen(8081);
// 	}
// });