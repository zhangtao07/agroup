/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');
var config = require('./config/environment');
var path = require('path');

module.exports = function(app) {

  // Insert routes below
  app.use('/api/search', require('./api/search'));
  app.use('/api/files', require('./api/file'));
  app.use('/api/markdowns', require('./api/markdown'));
  app.use('/api/*', function(req, res, next) {
    if (!req.session.user) {
      errors[401](req, res);
    } else {
      next();
    }

  });

  app.use('/editor/*', function(req, res, next) {
    if (!req.session.user) {
      res.redirect('/auth/login?url=' + req.originalUrl);
    } else {
      next();
    }
  });

  app.use('/static/image', require('./api/image'));
  app.use('/api/group', require('./api/group'));
  app.use('/api/message', require('./api/message'));
  app.use('/api/user', require('./api/user'));

  app.use('/auth', require('./auth'));


  app.use(new RegExp("(^" + config.upload_dir + "\/.*)"), function(req, res) {
    var filename = req.query.filename;
    if (filename) {
      res.download(config.root + req.params[0], filename);
    } else {
      res.sendFile(config.root + req.params[0]);
    }
  });
  app.use('/editor', require('./editor'));
  app.route('/pdf').get(function(req, res) {
    res.render('pdf.html');
  });

  app.route('/signin').get(function(req, res) {
    res.render('login.html');
  });

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
    .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });
};
