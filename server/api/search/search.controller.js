'use strict';
var fs = require('fs');
var Q = require('q');
var Segment = require('segment').Segment;
var segment = new Segment();
// 使用默认的识别模块及字典，载入字典文件需要1秒，仅初始化时执行一次即可
segment.useDefault();
var config = require('../../config/environment');
var searchFileSql = fs.readFileSync(__dirname+'/searchFile.sql').toString();
var searchFileCountSql = fs.readFileSync(__dirname+'/searchFileCount.sql').toString()
// Get list of searchs
exports.searchFile = function(req, res) {
  var keyword = req.query.keyword;
  var page = req.query.page ||1;
  var size = req.query.size||10;
  var textLength = req.query.textLength||50;
  var utf8words = [];
  segment.doSegment(keyword).forEach(function(word){
    utf8words.push(encodeURI(word.w).replace(/%/g,''));
  });
  var encodeWord = utf8words.join(' ');
  console.info(keyword);

  var sql = searchFileSql
    .replace(/\{keyword\}/g,encodeWord)
    .replace(/\{offset\}/g,(page - 1) * size)
    .replace(/\{limit\}/g,size)
    .replace(/\{textLength\}/g,textLength)
    .replace(/\{text\}/g,keyword);


  var countSql = searchFileCountSql.replace(/\{keyword\}/g,encodeWord);

  Q.all([Q.promise(function(resolve){
    req.db.driver.execQuery(countSql,function(err,data){
      resolve(data[0]['total']);
    });
  }),Q.promise(function(resolve){
    req.db.driver.execQuery(sql,function(err,data){
      resolve(data);
    });
  })]).then(function(result){
    var total = result[0];
    var pagesize = 0;
    var datas = [];
    if(total > 0){
      pagesize = parseInt((total + size - 1) / size);
      datas = result[1];
      datas.forEach(function(item){
        item.filepath = config.upload_dir+'/'+item.filepath;
      });
    }

    res.json({
      err:0,
      data:{
        total:total,
        pagesize:pagesize,
        list:datas
      }
    });









  });


};


function handleError(res, err) {
  return res.send(500, err);
}