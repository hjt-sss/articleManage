/* 用来管理文章的一些操作 */
var express = require('express');
var router = express.Router();
var model = require('../model')

var multiparty = require('multiparty')
var fs = require('fs')

//发布文章、编辑文章
router.post('/add',function(req, res, next){
  var date = parseInt(req.body.date)
  if(date){
    var page = req.body.page
    var title = req.body.title
    var content = req.body.content
    model.connect(function(db){
      db.collection('articles').updateOne({date: date}, {$set:{ //修改第一个参数是修改那一条   第二个是要修改的
        title: title,
        content: content
      }}, function(err, ret) {
        if(err){
          console.log('修改失败')
        } else {
          console.log('修改成功')
          res.redirect('/?page'+page)
        }
      })
    })
  } else{
    var data = {
      title: req.body.title,
      content: req.body.content,
      date: Date.now(),
      username: req.session.username
    }
    model.connect(function(db){
      db.collection('articles').insertOne(data, function(err, ret){
        if(err) {
          console.log('文章发布失败', err)
          res.redirect('/write')
        } else {
          res.redirect('/')
        }
      })
    })
  }
})

//删除文章
router.get('/delete',function(req,res,next){
  var date = parseInt(req.query.date)
  var page = req.query.page
  model.connect(function(db){
    db.collection('articles').deleteOne({date: date}, function(err, ret) {
      if(err){
        console.log("删除失败")
      } else {
        console.log('删除成功')
      }
      res.redirect('/?page='+page)
    })
  })
})

//上传
router.post('/upload', function(req, res, next){
  var form = new multiparty.Form()
  form.parse(req, function(err, fields, files){
    if(err){
      console.log('上传失败', err)
    } else {
      // console.log('文件列表', files)
      var file = files.filedata[0]

      var rs = fs.createReadStream(file.path)
      var newPath = '/uploads/' + file.originalFilename
      var ws = fs.createWriteStream('./public'+newPath)
      rs.pipe(ws)
      ws.on('close', function(){
        console.log('文件上传成功')
        res.send({err:'',msg: newPath})
      })
    }
  })
})

module.exports = router;
