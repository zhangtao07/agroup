'use strict';

var _ = require('lodash');
var fs = require('fs');

var observe = require('../../components/group.observe');
var upload = require('./upload');
exports.list = function (req, res) {

  var groupId = req.query.groupId;

  req.models.message.find({
    group_id: groupId

  }, function (err, messages) {
    var datas = [];
    messages.forEach(function (message) {
      datas.push(message.getMessage());
    });
    return res.status(200).jsonp({
      err: 0,
      data: datas
    });
  });


};


exports.upload = function (req, res) {
  var user = req.session.user;


  upload(req, function (file) {
    req.models.message.create({
      'file_id': file.id,
      'type': file.mimetype,
      'user_id': user.id,
      'group_id': file.group_id,
      'date':new Date
    },function (err,msg) {

        if (err) {
          return console.error(err);
        }
        var data = msg.getMessage({
          file:file,
          user:user
        });
        observe.groupBroadcast(file.group_id, data);
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

  req.models.message.create({
    'content': req.body['message'],
    'type': req.body['type'],
    'user_id': user.id,
    'group_id': groupId,
    'date': new Date
  }, function (err, message) {
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

