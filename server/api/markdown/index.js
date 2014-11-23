'use strict';

var express = require('express');
var router = express.Router();

var _ = require('lodash');
var request = require('request');
var config = require('../../config/environment');
var dataCenter = require('../../editor/dataCenter');

var apiRoot = 'http://' + config.service.host + ':' + config.service.port;

router.get("/list", function(req,res,next){
  request.get({
    url: apiRoot + req.originalUrl.replace('/api',''),
    headers: req.headers
  },function(err,response,body){
    var data = JSON.parse(body);
    _.each(data.list,function(d){
      var file = dataCenter.getCache(d.id);
      if(file){
        d.writers = file.writers;
        d.content = file.content;
        d.name = file.name;
      }
    });
    res.writeHead(response.statusCode,response.headers);
    res.end(JSON.stringify(data));
  })
});

module.exports = router;
