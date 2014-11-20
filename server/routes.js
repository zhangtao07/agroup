/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');
var config = require('./config/environment');
var _  = require('lodash');
var path = require('path');
var request = require('request');
var url = require('url');

module.exports = function(app) {

  app.param('groupId', function(req, res, next, groupId) {
    req.group = {
      id: groupId
    };
    next();
  });
  app.param('groupName', function(req, res, next, groupName) {
    var target = url.parse('http://' + config.service.host +':' +config.service.port + '/group/getByDisplay/');
    request.post({
      url: url.format(target),
      headers:{
        cookie : req.headers.cookie
      }
    }, function(err, response, body) {
      if(response.statusCode === 200){
        var data = JSON.parse(body);
        if(data.status === 401){
          res.redirect('/signin?url=' + req.headers.referer);
        }else{
          req.group = JSON.parse(body).data.group;
        }
      }
      next();
    }).form().append('display',groupName)
  });

  app.use('/api/group/:groupId/message/', require('./api/message'));
  app.use('/api/group/:groupId/markdown/', require('./api/markdown'));
  // 其余API请求，走代理
  app.use('/api/*', require('./proxy'));
  app.use('/:groupName/md/', require('./editor'));

  app.route('/pdf').get(function(req, res) {
    res.render('pdf.html');
  });
  app.route('/signin').get(function(req, res) {
    res.render('login.html');
  });
  app.use('/static/image', require('./api/image'));

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
    .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });
};
