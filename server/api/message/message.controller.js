'use strict';

var observe = require('../../components/group.observe');

var proxy = require('../../proxy');

exports.post = function(req, res) {
  proxy(req,res).on('data',function(chunk){
    observe.messageBroadcast(req.group.id, chunk.toString());
  })
}

exports.uploadEnd = function(req, res) {
  proxy(req,res).on('data',function(chunk){
    observe.messageBroadcast(req.group.id, chunk.toString());
  })
};

exports.delete = function(req, res) {
  proxy(req,res).on('data',function(chunk){
    observe.messageBroadcast(req.group.id, chunk.toString());
  })
}
