var express = require('express');
var router = express.Router();
var model = require('../model')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//注册接口
router.post('/regist',function(req,res,next){
  var data = {
    username: req.body.username,
    password: req.body.password,
    password2: req.body.password2,
  }
  //向数据库中插入数据
  model.connect(function(db){
    db.collection('users').insertOne(data, function(err, ret){
      if(err){
        console.log('注册失败')
        res.redirect('/regist')
      } else {
        console.log('注册成功')
        res.redirect('/login')
      }
    })
  })
})

// 登录接口
router.post('/login',function(req, res, next){
  var data = {
    username: req.body.username,
    password: req.body.password
  }
  //在数据库中查询该数据
  model.connect(function(db){
    db.collection('users').find(data).toArray(function(err, docs){
      if(err){
        res.redirect('/login')
      } else {
        if(docs.length > 0){ //&&docs[0].password == data.password
          //登陆成功，进行session存储
          req.session.username = data.username //登录成功后，session中就会有用户名，每次登录请求，去session中取username，如果有值，登录系统，否则进入登录页重新登录
          res.redirect('/')
        } else {
          res.redirect('/login')
        }
      }
    })
  })
})

//退出登录
router.get('/logout', function(req, res, next){
  req.session.username = null
  res.redirect('/login')
})

module.exports = router;
