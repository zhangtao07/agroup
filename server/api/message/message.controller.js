'use strict';

var _ = require('lodash');
var fs = require('fs');
var crypto = require('crypto');

var Message = require('./message.model');
var observe = require('../../components/group.observe');
var User = require('../user/user.model');
var upload = require('./upload');
exports.list = function (req, res) {

  var groupId = req.query.groupId;
  Message.find({group: groupId}).populate('user').populate('file').exec(function (err, messages) {
    if (err)
      return console.error(err);
    var datas = [];
    messages.forEach(function (message) {
      datas.push(message.getMessage());
    });
    return res.jsonp({
      err: 0,
      data: datas
    });
  });

};


exports.upload = function (req, res) {
  var user = req.session.user;


  upload(req, function (file) {


    var message = new Message({
      'file':file._id,
      'type': file.mimetype,
      'user': user._id,
      'group':file.group
    });

    Message.create(message,function(){
      res.writeHead(200, {
        'Connection': 'close'
      });
      res.end("ok");
    });


  });

}


exports.post = function (req, res) {
  //todo:save mongodb

  //get mime info

  var user = req.session.user;

  var groupId = req.body.groupId;


  var message = new Message({
    'content': req.body['message'],
    'type': req.body['type'],
    'user': user._id,
    'group': groupId
  });

  message.save(function (err, message) {
    if (err)
      return console.error(err);
    var data = message.getMessage(user);
    observe.groupBroadcast(groupId, data);
    return res.jsonp({
      err: 0
    });
  })
}

