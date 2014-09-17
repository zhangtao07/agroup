'use strict';

var express = require('express');
var router = express.Router();
var cache = require('./cache');


router.get('/viewer', function(req, res) {
  res.render('viewer.html');
});
router.get('/*', function(req, res) {
  res.render('editor.html');
});

router.post('/:fileid', function(req, res) {
  var fileid = req.params.fileid;
  cache.get(fileid, function(file) {

    if (!file) {
      res.status(200).send('file not found');
    } else {
      res.status(200).json({
        fileid: fileid,
        title: 'AGroup 测试文档',
        content: file,
        usr: req.session.user || {}
      });
    }

  });

});


module.exports = router;
