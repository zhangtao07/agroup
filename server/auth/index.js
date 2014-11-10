'use strict';

var express = require('express');
var router = express.Router();
var proxy = require('../proxy');

router.use('/', function login(req,res,next){
  proxy(req,res).on('data',function(chunk){
    console.log(111,chunk.toString());
  })
});

module.exports = router;
