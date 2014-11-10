var fs = require('fs');
var config = require("../config/environment");
var _ = require('lodash');
var observe = require('../components/group.observe');
var mdtool = require('./tool');
var covtool = require('../tools/tool.js');
var cache = {};
var database;

exports.userJoin = function(client) {
  var writers = cache[client.fileid].writers = cache[client.fileid].writers || [];
  return writers.push(client.user);
};

exports.userLeave = function(client) {
  var file = cache[client.fileid];
  if(!file) return;
  var writers = file.writers;
  _.remove(writers, function(writer){
    return writer.id === client.user.id;
  });

  if (!writers.length) {
    var broadFilecreate = file.status === 'init';
    save(file,broadFilecreate,client.user);
    delete cache[file.id];
  }
}

exports.setTitle = function(fileid, filename) {
  cache[fileid].name = filename;
}

exports.setContent = function(fileid, content) {
  cache[fileid].content = content;
}

exports.getContent = function(fileid, content) {
  return cache[fileid].content || '';
}

exports.getCache = function(fileid) {
  return cache[fileid];
}


exports.readFile = function(fileid, cb) {
  var cachedfile = cache[fileid];
  if (cachedfile) return cb && cb(cachedfile);
};

function updateFile(file,user){
}

/* 创建markdown */
exports.createFile = function(group, user, cb) {
};

function markdownMessage(err,message){
  observe.messageBroadcast(message.group_id,message);
}

function readFromDisk(file, fv, cb) {
}

function save(file,broadFilecreate,user) {
  console.log(file);
}
