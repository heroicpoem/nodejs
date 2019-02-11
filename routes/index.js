var express = require('express');
var router = express.Router();
var util =require('util');
var db=require("../config/db");
const stringRandom = require('string-random');
var UUID = require('uuid');

router.all('*', function(req, res, next) {
  console.log("=========%s %s %s",req.method, req.url, req.path);
  console.log(req.session);
  console.log(req.body);
  if(!req.session.uname){
  	 console.log()
  }
  // req.cookie('time','1111',{maxAge:900000});
  next();
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


/* GET login page. */
router.route("/login").get(function(req,res){    // 到达此路径则渲染login文件，并传出title值供 login.html使用
	//res.render:模板login.html,title参数转换成'User Login'
	res.render("login",{title:'User Login'});
}).post(function(req,res){ 					   // 从此路径检测到post方式则进行post数据的处理操作
	//获取参数
	var uname = req.body.uname;				//获取post上来的 data数据中 uname的值
	var retFail={status:"fail"};
	var retSuccess={status:"success"};
	console.log("!!!!!!!!!!uname:"+uname);
	if(uname=="test"){
		res.json(retFail);
		return;
	};
	console.log("!!!!!!!!!!!!!!!!!!4"+"成功");
	req.session.user = {uname:"han",upwd:"pwd"};
	//res.redirect("/main");
	//res.render("main",{title:'main',uname:'hello world'}); 
	res.json(retSuccess);
	console.log("!!!!!!!!!!!!!!!!!!5"+"成功");
	
});

router.all("/main",function(req,res){
	res.render("main",{title:'main',uname:'hello world'}); 
});

/* GET home page. */
router.get("/home",function(req,res){ 
	console.log("!!!!!!!!!!get /home is received");
	console.log("!!!!!!!!!!req.session.user:"+req.session.user);
	if(!req.session.user){ 					//到达/home路径首先判断是否已经登录
		req.session.error = "请先登录"
		console.log("!!!!!!!!!!请先登录")
		res.redirect("/login");				//未登录则重定向到 /login 路径
	}else{
	var user=req.session.user;
	//console.log("!!!!!!!!inspect(session.user):"+util.inspect(usre));
	res.render("home",{title:'Home',uname:'hello world'});         //已登录则渲染home页面

	};
});


/* GET logout page. */
router.get("/logout",function(req,res){    // 到达 /logout 路径则登出， session中user,error对象置空，并重定向到根路径
	req.session.user = null;
	req.session.error = null;
	res.redirect("/");
});

/*/users 表格+连接数据库+参数+增删改*/
// var resUsers=function (err,rows){
var  callFun =function(err,rows,req,res){
	if(err){		
		//res.send("数据库操作错误");
		res.json({total:0,rows:[],dbret:err});
	}else {
		res.json({total:10,rows:rows,dbret:"success"});
	}
}


router.route("/users").get(function(req,res){    // 到达此路径则渲染login文件，并传出title值供 login.html使用
	
	// db.query("select * from users",function(err,rows){
	// 	if(err){
	// 		res.render("users",{
	// 							title:'用户列表',
	// 							datas:[]});
	// 	}else {
	// 		res.render("users",{
	// 							title:'用户列表',
	// 							datas:rows});
	// 	};
	// });	
	res.render("users",{title:'用户列表',
						datas:[]});
}).post(function(req,res){ 					   // 从此路径检测到post方式则进行post数据的处理操作
	 var users={user1:{id:1,age:11,name:'user1'},
			   user2:{id:2,age:12,name:'user2'},
			   user3:{id:3,age:13,name:'user3'}};
    //console.log(req.body); //req.body 就是完整的入参
    db.query(db.orm("getUsers",req.body),callFun,req,res);
});

router.route("/usersb").post(function(req,res){ 					   // 从此路径检测到post方式则进行post数据的处理操作
	 // var users={user1:{id:1,age:11,name:'user1'},
		// 	   user2:{id:2,age:12,name:'user2'},
		// 	   user3:{id:3,age:13,name:'user3'}};
	var users=[{id:1,age:11,name:'user1'},{id:1,age:11,name:'user1'},{id:1,age:11,name:'user1'}];
    res.json({total:3,rows:users});
});

router.route("/delUsers").post(function(req,res){ 					   // 从此路径检测到post方式则进行post数据的处理操作
    db.query(db.orm("delUsers",req.body),callFun,req,res);
});

router.route("/users_Adduser").post(function(req,res){ 					   // 从此路径检测到post方式则进行post数据的处理操作
    db.query(db.orm("users_Adduser",req.body),callFun,req,res);
});


/* cookie */
var cookieConfig={maxAge: 1000*60*60*24*30,httpOnly: true,path:'/cookie'};
router.all("/cookie",function(req,res){    
	var a= req.cookies.uname;
	console.log(a);
	if(req.cookies.uname){
		console.log(req.cookies.uname);
	};
	
	res.cookie("uname",UUID.v1(),cookieConfig);
    res.end();
	  
});

module.exports = router;
