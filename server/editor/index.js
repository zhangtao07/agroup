'use strict';

var express = require('express');
var router = express.Router();
var request = require('request');
var moment = require('moment');
var config = require('../config/environment');
var url = require('url');
var _ = require('lodash');
var Q = require('q');
var dataCenter = require('./dataCenter');

router.post('/pdfExport', require('./pdf').export);
//router.post('/pdfToImage', require('./pdf').toImage);

router.get('/view/*', function(req, res) {
  res.render('viewer.html', {
    cache: typeof req.query.debug !== 'undefined' ? false : true
  });
});
router.get('/edit/*', function(req, res) {
  res.render('editor.html', {
    cache: typeof req.query.debug !== 'undefined' ? false : true
  });
});

router.post('/data/:fileId', function(req, res, next) {
  var fileId = req.params.fileId;
  var headers = req.headers;
  var group = req.group;
  Q.spread(
    [getMe(headers), getMD(headers, fileId, group)], function(me, md) {
      res.status(200).json({
        fileid: fileId,
        group: group,
        title: '', //file.name,
        //content: file.content || '',
        //user: {
        //id: user.id,
        //username: user.username,
        //nickname: user.nickname,
        //avatar: '/api/user/avatar/' + user.username
        //}
        user: JSON.parse(me).data,
        content: md
      })
    });
});

function getMD(headers, fileId, group) {
  return Q.Promise(function(resolve) {
    var file = url.parse(
      'http://' + config.service.host + ':' + config.service.port +
      '/group/' + group.id + '/file/download/' + fileId);
    request.get({
      url: url.format(file),
      headers: headers
    }, function(err, response, body) {
      resolve(body);
    })
  })
}


function createMD(headers, group, user) {
  return Q.Promise(function(resolve) {
    var api = url.parse(
      'http://' + config.service.host + ':' + config.service.port +
      '/group/' + group.id + '/markdown/save');

    request.post({
      url: url.format(api),
      headers: headers
    }, function(err, response, body) {
      resolve(body);
    }).form({
      filename: user.nickname + '_' + moment().format('YYYYMMDD_HHmmss') + '.md',
    })
  })
}

function getMe(headers) {
  return Q.Promise(function(resolve) {
    var me = url.parse(
      'http://' + config.service.host + ':' + config.service.port +
      '/user/me');

    request.get({
      url: url.format(me),
      headers: headers
    }, function(err, response, body) {
      resolve(body);
    })
  })
}



router.get('/create', function(req, res) {
  var headers = req.headers;
  var group = req.group;
  getMe(headers).then(function(body){
    var user = JSON.parse(body).data;
    return createMD(headers,group,user)
  }).then(function(body){
    var md = JSON.parse(body).data;
    res.redirect('/' + group.name + '/md/edit/' + md.id);
  });
});

module.exports = router;
