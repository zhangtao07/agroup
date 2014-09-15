'use strict';

var express = require('express');

var router = express.Router();

router.get('/', function(req, res) {
  res.render('editor/editor.html');
});


module.exports = router;
