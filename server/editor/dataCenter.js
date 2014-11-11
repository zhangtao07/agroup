//native api
var fs = require('fs');
var url = require('url');

//third-party
var _ = require('lodash');
var Q = require('q');
var request = require('request');

//configs
var config = require("../config/environment");
var observe = require('../components/group.observe');
var mdtool = require('./tool');
var covtool = require('../tools/tool.js');

//variables
var apiRoot = 'http://' + config.service.host + ':' + config.service.port;
var cache = {};

exports.userJoin = function(client) {
  var writers = cache[client.fileid].writers = cache[client.fileid].writers || [];
  return writers.push(client.user);
};

exports.userLeave = function(headers,client) {
  var file = cache[client.fileid];
  if(!file) return;
  var writers = file.writers;
  _.remove(writers, function(writer){
    return writer.id === client.user.id;
  });

  if (!writers.length) {
    save(headers,client.group,file,client.fileid);
    delete cache[file.id];
  }
}

exports.setTitle = function(fileid, filename) {
  cache[fileid].name = filename;
}

exports.setContent = function(fileid, content) {
  cache[fileid].content = content;
}

exports.getContent = function(fileid) {
  return cache[fileid].content || '';
}

exports.readFile = function(fileid, cb) {
  var cachedfile = cache[fileid];
  if (cachedfile) return cb && cb(cachedfile);
};

exports.cache = function(fileId){
  cache[fileId] = cache[fileId] || {};
}

exports.getCache = function(fileId){
  return cache[fileId];
}

function pubMessage(err,message){
  observe.messageBroadcast(message.group_id,message);
}


exports.save = save;
function save(headers,group,file,fileId) {
  file = file || {name:'',content:''};
  return Q.Promise(function(resolve) {
    var api = url.parse(apiRoot + '/group/' + group.id + '/markdown/save');
    request.post({
      url: url.format(api),
      headers: headers
    }, function(err, response, body) {
      resolve(body);
    }).form({
      filename: file.name,
      content: file.content,
      fileId: fileId || null
    })
  })
}
