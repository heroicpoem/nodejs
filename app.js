var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
app.use(session({ 
	secret: 'secret',
	cookie:{ 
		maxAge: 1000*60*30
	},
	resave: false, //添加 resave 选项
    saveUninitialized: true, //添加 saveUninitialized 选项
}));	
// view engine setup
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'ejs');
app.engine("html",require("ejs").__express); // or   app.engine("html",require("ejs").renderFile);
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use(function(req,res,next){ 
// 	console.log('%s %s %s', req.method, req.url, req.path);
// 	res.locals.user = req.session.user;
// 	var err = req.session.error;
// 	delete req.session.error;
// 	res.locals.message = "";
// 	if(err){ 
// 		res.locals.message = '<div class="alert alert-danger" style="margin-bottom:20px;color:red;">'+err+'</div>';
// 	}
// 	next();
// });



//route
app.use('/', indexRouter);
// app.use('/users', usersRouter);
// app.use('/login',indexRouter); // 即为为路径 /login 设置路由
// app.use('/register',indexRouter); // 即为为路径 /register 设置路由
// app.use('/home',indexRouter); // 即为为路径 /home 设置路由
// app.use("/logout",indexRouter); // 即为为路径 /logout 设置路由

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   // console.log("!!!!!!!!!!"+Date.now().toString());
//   // next(createError(404));
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });


// development error handler
// will print stacktrace
// if (app.get('env') === 'development') {
//   app.use(function(err, req, res, next) {
//     // res.status(err.status || 500);
//     res.render('error', {
//       message: err.message,
//       error: err
//     });
//   });
// }


// production error handler
// no stacktraces leaked to user
// app.use(function(err, req, res, next) {
//   res.status(err.status || 500);
//   res.render('error', {
//     message: err.message,
//     error: {}
//   });
// });

module.exports = app;
