var express = require('express');
var router = express.Router();
var model = require('../model')
var moment = require('moment')

/* GET home page. */
router.get('/', function(req, res, next) {
  var username = req.session.username
  var page = req.query.page || 1 //当前页，默认是1
  var data = {
    total: 0,  //总页数
    curPage: page, //当前页
    list:[]   //当前页的文章列表
  }
  var pageSize = 3  //默认一页展示两条数据
  // console.log(data.list)
  model.connect(function(db){
    //1、查询所有数据
    db.collection("articles").find({}).toArray(function(err,docs) {
      // console.log("文章列表", docs)
      data.total = Math.ceil(docs.length / pageSize)  //总页数 = 数据长度/每页的条数 再取整
      //2.查询当前页的文章列表
      //sort({_id: -1}) 倒序查询    limit()每次查几条  skip() 每次想前跳过多少条数据
      model.connect(function(db){
        db.collection('articles').find({}).sort({_id: -1}).limit(pageSize).skip(pageSize*(page - 1)).toArray(function(err, docs2){
          if(docs2.length == 0){
            res.redirect('/?page='+((page - 1) || 1))
          } else{
            docs2.map(function(item, index){
              item['time'] = moment(item.date).format('YYYY-MM-DD HH:mm:ss')
            })
            data.list = docs2
          }
          res.render('index', { username: username , data: data}); //第二个参数是传给页面的
        })
      })
    })
  })
});

/* 渲染注册页 */
router.get('/regist', function(req,res,next) {
  res.render('regist',{})
})

/* 渲染登录页 */
router.get('/login', function(req,res,next) {
  res.render('login',{})
})

/* 渲染发布文章页  /  编辑页面 */
router.get('/write', function(req,res,next) {
  var username = req.session.username || ''
  var date = parseInt(req.query.date)
  var page = req.query.page
  var item = {
    title:'',
    content:''
  }
  if(date){ //如果存在date  即是编辑
    model.connect(function(db){
      db.collection('articles').findOne({date: date}, function(err,docs){
        if(err){
          console.log('查询失败')
        } else {
          item = docs
          item['page'] = page
          res.render('write',{username: username, item: item})
        }
      })
    })
  } else {
    res.render('write',{username: username, item: item})
  }
})

/* 渲染详情页 */
router.get('/detail', function(req,res,next) {
  var date = parseInt(req.query.date)
  var username = req.session.username
  model.connect(function(db){
    db.collection('articles').findOne({date: date}, function(err, docs){
      if(err){
        console.log('查询失败')
      } else {
        console.log(docs)
        var item = docs
        item['time'] = moment(item.date).format('YYYY-MM-DD HH-mm-ss')
        res.render('detail',{item: item, username: username})
      }
    })
  })
})
module.exports = router;
