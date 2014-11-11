'use strict';

//native api
var url = require('url');

//third-party
var _ = require('lodash');
var Q = require('q');
var request = require('request');
var express = require('express');
var router = express.Router();
var moment = require('moment');

//customize config
var config = require('../config/environment');
var dataCenter = require('./dataCenter');


router.post('/pdfExport', require('./pdf').export);

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
  var name = req.params.name;
  var headers = req.headers;
  var group = req.group;
  Q.spread(
    [getMe(headers), getMD(headers, fileId, group)], function(me, md) {

      dataCenter.cache(fileId);
      console.log(md.filename);
      dataCenter.setTitle(fileId, md.filename);
      dataCenter.setContent(fileId, md.content);

      res.status(200).json({
        fileid: fileId,
        group: group,
        title: md.filename,
        user: JSON.parse(me).data,
        content: md.content
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
      var filename = decodeURIComponent(response.headers['content-disposition']).replace(/.*filename=(.*);.*/, '$1');

      resolve({
        filename: filename,
        content: body
      });
    })
  })
}


function createMD(headers, group, user) {
  return dataCenter.save(headers, group);
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
  getMe(headers).then(function(body) {
    var user = JSON.parse(body).data;
    return createMD(headers, group, user)
  }).then(function(body) {
    var md = JSON.parse(body).data;
    res.redirect('/' + group.name + '/md/edit/' + md.id);
  });
});

module.exports = router;
