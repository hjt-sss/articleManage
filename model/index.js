var MongoClient = require('mongodb').MongoClient;
 
// Connection URL
var url = 'mongodb://admin:admin8888@localhost:27017';
 
// 要连接的数据库名字
var dbName = 'project';
 
// 封装数据库连接方法
function connect(callback){
  MongoClient.connect(url, {useNewUrlParser: true,useUnifiedTopology: true}, function(err,client){
    if(err){
      console.log("数据库连接失败", err)
    } else {
      var db = client.db(dbName)
      callback && callback(db)
    }
    client.close()
  });
}
 
module.exports ={
  connect
}