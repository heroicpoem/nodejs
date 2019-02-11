var mysql=require("mysql");
var pool=mysql.createPool({
	host:'localhost',
	user:'root',
	password:'root',
	database:'dbtest'
});


function query(sql,callback,req,res){
	console.log("111111111111111query1");
	pool.getConnection(function(err,connection){
		console.log(sql);
		connection.query(sql,function(err,rows){
			if(err){
				console.log(err);
			}
			callback(err,rows,req,res);

			connection.release();
		});
	});
}

function orm(ormid,pars){
	var sql="";
	if (ormid=="getUsers") {
    	sql="select * from users where 1=1 ";
    	if (pars.s_name){
    		sql+="and name='"+pars.s_name+"'";
    	}
    	if (pars.s_age){
    		sql+="and aget="+pars.s_age+"";
    	}
	}else if(ormid=="delUsers") {
		sql="delete from users where id in ("+pars.ids+")";
	}else if(ormid=="users_Adduser") {
		sql="insert into users values ("+pars.s_id+",'"+pars.s_name+"',"+pars.s_age+")";
	}
	return sql;
}

exports.query=query;
exports.orm=orm;
