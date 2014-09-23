'use strict';

var _ = require('lodash');
var fs = require('fs');
var orm = require('orm');
var observe = require('../../components/group.observe');
var upload = require('./upload');
var Q = require("q");
exports.list = function(req, res) {

  var groupId = req.query.groupId;

  var date = req.query.timestamp ? new Date(parseInt(req.query.timestamp)):new Date();

  var offset = parseInt(req.query.offset)|| 0;

  var limit = parseInt(req.query.limit) || 10;

  function getCount(){
    var result = Q.defer();
    req.models.message.count({
      group_id: groupId,
      date:orm.lte(date)
    },function(err,count){
      if(err){
        result.reject(err);
      }else{
        result.resolve(count);
      }
    })
    return result.promise;
  }

  function getData(){
    var result = Q.defer();
    req.models.message.find({
      group_id: groupId,
      date: orm.lte(date)
    },{ offset: offset },limit,['date','Z'], function(err, messages) {
      if(err){
        result.reject(err);
      }else{
        result.resolve(messages);
      }
    });
    return result.promise;
  }

  Q.all([getCount(),getData()]).spread(function (count,messages) {
    var datas = [];
    messages.forEach(function(message) {
      datas.push(message.getMessage());
    });
    console.info(count,offset,limit);
    res.status(200).jsonp({
      err: 0,
      data: {
        list:datas,
        timestamp:date.getTime(),
        hasMore:(offset+limit)<count?true:false
      }
    });
  },function(err1,err2){
    console.info(err1,err2);
  });


};


exports.upload = function(req, res) {
  var user = req.session.user;


  upload(req, function(file) {
    req.models.message.create({
      'fileversion_id': file.id,
      'type': file.mimetype,
      'user_id': user.id,
      'group_id': req.body['groupId'],
      'date': new Date
    }, function(err, msg) {

      if (err) {
        return console.error(err);
      }
      var data = msg.getMessage({
        fileversion: file,
        user: user
      });
      observe.groupBroadcast(req.body.groupId, data);
      res.writeHead(200, {
        'Connection': 'close'
      });
      res.end("ok");
    });


  });

}


function getURL(text){
  var urlGroup;
  if((urlGroup = /(http[s]*:\/\/)*[\w_.]+\.(com|cn|io|cc|gov|org|net|int|edu|mil|jp|kr|us|uk)[\w\/#\%_\?=\.]+/.exec(text))){
    return urlGroup[0];
  }
  return null;
}

exports.post = function(req, res) {

  var user = req.session.user;

  var groupId = req.body.groupId;

  var message = req.body['message'];

  var url = getLink()

  

  req.models.message.create({
    'content':message,
    'type': req.body['type'],
    'user_id': user.id,
    'group_id': groupId,
    'date': new Date
  }, function(err, message) {
    if (err)
      return console.error(err);
    var data = message.getMessage({
      user: user
    });
    observe.groupBroadcast(groupId, data);
    return res.jsonp({
      err: 0
    });
  })
}

