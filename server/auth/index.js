'use strict';

var express = require('express');
var config = require('../config/environment');
var router = express.Router();

router.use('/login', function login(req,res,next){
  var url = req.query.url;
  req.proxy('/user/login');
});
router.use('/logout', function(req, res, next) {
  delete req.session.user;
  res.redirect(req.query.url||"/")
});

module.exports = router;
