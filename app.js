var express = require('express');
var swig = require('swig');
var mongoose = require('mongoose');

//加载body-parser,用来处理post提交过来的数据
var bodyParser=require('body-parser');


var Cookies = require('cookies');

var app = express();

var User = require('./models/User');
//
app.use('/public',express.static(__dirname+'/public'));
app.use('/ckeditor',express.static(__dirname+'/ckeditor'));

//配置 末班引擎
//			模板名称后缀	模板解析方法
app.engine('html', swig.renderFile);
//		固定值		模板存放目录
app.set('views', './views');
//注册所使用的模板引擎
//		固定值
app.set('view engine', 'html')


//取消缓存 可以实时更改模板内容
swig.setDefaults({cache: false});


app.use(bodyParser.urlencoded({extended:true}))

app.use(function(req, res, next){
	req.cookies = new Cookies(req, res);

	req.userInfo = {}

	//解析登入用户的信息
	if (req.cookies.get('userInfo')){
		try{
			req.userInfo = JSON.parse(req.cookies.get('userInfo'));

			//获取当前登录用户的类型
			User.findById(req.userInfo.id).then(function(userInfo){
				req.userInfo.isAdmin = Boolean(userInfo.isAdmin);
				next();
			})
		}
		catch(e){
			next();
		}
	}else{
		next();
	}
});

app.use('/admin', require('./routers/admin'));
app.use('/api', require('./routers/api'));
app.use('/', require('./routers/main'));

// app.listen(8081);


// app.get('/', function(req, res, next){
// 	//读取views目录下指定文件 并返回
// 	//param1	views/index.html	
// 	//param2	
// 	res.render('index')
// 	//res.send('<h1>welcome</h1>')
// })

mongoose.connect('mongodb://localhost:27017/blog', function(err){
	if(err){
		console.log('database connect err');
	}
	else{
		console.log('database connect success');
		app.listen(8081);
	}
});