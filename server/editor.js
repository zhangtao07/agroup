'use strict';

var express = require('express');

var router = express.Router();

router.get('/', function(req, res) {
  res.render('editor.html');
});


module.exports = router;
