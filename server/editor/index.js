'use strict';

var express = require('express');
var router = express.Router();
var cache = require('./cache');

router.get('/', function(req, res) {
  res.render('editor.html');
});

router.get('/:fileid', function(req, res) {
  res.render('editor.html');
});

router.post('/:fileid', function(req, res) {
  var fileid = req.params.fileid;
  var file = cache.get(fileid);

  if (!file) {
    res.status(200).send('file not found');
  } else {
    res.status(200).send(file);
  }
});


module.exports = router;
