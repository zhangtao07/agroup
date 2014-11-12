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

//variables
var apiRoot = 'http://' + config.service.host + ':' + config.service.port;
var cache = {};

exports.userJoin = function(client) {
  var writers = cache[client.fileid].writers = cache[client.fileid].writers || [];
  return writers.push(client.user);
};

exports.userLeave = function(headers, client) {
  var file = cache[client.fileid];
  if (!file) return;
  var writers = file.writers;
  _.remove(writers, function(writer) {
    return writer.id === client.user.id;
  });

  if (!writers.length) {
    save(headers, client.group, file, client.fileid)
      .then(function(body) {
        var data = JSON.parse(body).data;
        return sendMessage(headers, client.group, data.id, 'Update', 'MD');
      })
      .then(function(message) {
        observe.messageBroadcast(client.group.id, message);
      });
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

exports.cache = function(fileId) {
  cache[fileId] = cache[fileId] || {};
}

exports.getCache = function(fileId) {
  return cache[fileId];
}

function sendMessage(headers, group, fileids, action, type) {
  return Q.Promise(function(resolve) {
    var api = url.parse(apiRoot + '/group/' + group.id + '/message/file');
    request.post({
      url: url.format(api),
      headers: headers
    }, function(err, response, body) {
      resolve(body);
    }).form({
      ids: fileids,
      action: action,
      type: type
    })
  })
}


exports.save = save;

function save(headers, group, file, fileId) {
  file = file || {
    name: '',
    content: ''
  };
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
