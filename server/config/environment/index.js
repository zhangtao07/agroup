'use strict';

var path = require('path');
var fs = require('fs');
var _ = require('lodash');

function requiredProcessEnv(name) {
  if (!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable');
  }
  return process.env[name];
}

function getNodeENV(){
  return process.env.NODE_ENV || 'development';
}


// All configurations will extend these options
// ============================================

var rootPath = path.normalize(__dirname + '/../../..');

var envConfig = require('./' + getNodeENV() + '.js') || {};

var localConfig;

try {
  localConfig = require('./local.js');
} catch(e) {
  localConfig = {};
}

var mysql = envConfig.mysql;

var all = {
  env: process.env.NODE_ENV,

  // Root path of server
  root: rootPath,

  hostname: 'localhost',

  // Server port
  port: process.env.PORT || 9000,

  // Secret for session, you will want to change this and make it an environment variable
  secrets: {
    session: 'agroup-secret'
  },

  // List of user roles
  userRoles: ['guest', 'user', 'admin'],

  // Default auth is fake
  auth: 'fake',

  upload_temp_dir: '/upload/.tmp',

  upload_dir: '/upload',

  resize_dist_cache : '/.resize_cache',

  getAvatar:function(name){
    return all.root + all.upload_dir + '/' + name + '.jpg';
  }
};

var config = _.merge(_.merge(all, envConfig), localConfig);

config['sessionStorage'] = {
  host: config['mysql'].host,
  port: config['mysql'].port || 3306,
  user: config['mysql'].user,
  password: config['mysql'].password,
  database: config['mysql'].database
}

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = config;
