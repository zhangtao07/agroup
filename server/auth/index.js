'use strict';

var express = require('express');
var config = require('../config/environment');
var fake = require('./fake');
var uuap = require('./uuap');

var router = express.Router();

router.use('/login/fake', fake);
router.use('/login/uuap', uuap.login);

router.use('/uuap/callback', uuap.callback);

//默认登录
if (config.auth === 'fake') {
  router.use('/login', fake);
}

if (config.auth === 'uuap') {
  router.use('/login', uuap.login);
}

router.use('/logout', function(req, res, next) {
  delete req.session.user;
  res.redirect('/');
});

module.exports = router;
