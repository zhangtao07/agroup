/**
 * Express configuration
 */

'use strict';

var express = require('express');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var compression = require('compression');
//var bodyParser = require('body-parser');
//var restreamer = require('connect-restreamer');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var errorHandler = require('errorhandler');
var path = require('path');
var config = require('./environment');
//var session = require('express-session');
//var SessionStore = require('express-mysql-session');
module.exports = function(app) {
  var env = app.get('env');

  app.set('views', config.root + '/server/views');
  app.engine('html', require('ejs').renderFile);
  app.set('view engine', 'html');
  app.use(compression());
  //app.use(bodyParser.urlencoded({ limit: '50mb' ,extended: false }));
  //app.use(bodyParser.json());
  //app.use(restreamer());
  app.use(methodOverride());
  app.use(cookieParser());

  //app.use(session({
    //key: 'agroup',
    //secret: 'webfe-fex-end',
    //store: new SessionStore(config.sessionStorage),
    //cookie: { maxAge: 1000 * 60 * 60 * 24 * 365 } //for one year
  //}));

  if ('production' === env) {
    app.use(favicon(path.join(config.root, 'public', 'favicon.ico')));
    app.use(express.static(path.join(config.root, 'public')));
    app.set('appPath', config.root + '/public');
    app.use(morgan('dev'));
  }

  if ('development' === env || 'test' === env) {
    app.use(require('connect-livereload')());
    app.use(express.static(path.join(config.root, '.tmp')));
    app.use(express.static(path.join(config.root, 'client')));
    app.set('appPath', 'client');
    app.use(morgan('dev'));
    app.use(errorHandler()); // Error handler - has to be last
  }
};
