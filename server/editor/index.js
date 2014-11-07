'use strict';

var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('../config/environment');
var url = require('url');
var _ = require('lodash');
var Q = require('q');
//var dataCenter = require('./dataCenter');

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



//router.get('/merge', function(req, res) {
//res.render('merge.html');
//});

//router.get('/:group', function(req, res) {
//var group = req.params.group;
//var fileid = req.query.file;
//var view = req.query.view;
//var cache = true;
//if (typeof req.query.debug !== 'undefined') {
//cache = false;
//}

//if (!fileid) {
//res.redirect('/');
//} else {
//dataCenter.checkFile(fileid, function(err, exists) {
//if (exists) {
//return view ? res.render('viewer.html', {
//cache: cache
//}) : res.render('editor.html', {
//cache: cache
//});
//} else {
//res.render('no-file.html');
//}
//})
//}
//});

router.get('/:group/create', function(req, res) {
  var group = req.params.group;

  dataCenter.createFile(group, req.session.user, function(err, fileid) {
    if (err) {
      res.send(err);
    } else {
      res.redirect('/editor/' + group + '?file=' + fileid);
    }
  });
});

//router.post('/:group', function(req, res) {
//var group = req.params.group;
//var fileid = req.query.file;
//var user = req.session.user;

//dataCenter.readFile(fileid, function(file) {
//res.status(200).json({
//fileid: fileid,
//group: group,
//title: file.name,
//content: file.content || '',
//user: {
//id: user.id,
//username: user.username,
//nickname: user.nickname,
//avatar: '/api/user/avatar/' + user.username
//}
//});
//});
//});


module.exports = router;
