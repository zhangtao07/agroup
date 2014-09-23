'use strict';

var express = require('express');
var router = express.Router();
var cache = require('./cache');


router.get('/viewer', function(req, res) {
  res.render('viewer.html');
});

router.get('/merge', function(req, res) {
  res.render('merge.html');
});

router.get('/:group', function(req, res) {
  var group = req.params.group;
  var fileid = req.query.file;
  if(!fileid){
    res.redirect('/');
  }else{
    cache.checkFile(fileid,function(err,exists){
      if(exists){
        res.render('editor.html');
      }else{
        res.render('no-file.html');
      }
    })
  }
});

router.get('/:group/create',function(req,res){
  var group = req.params.group;

  cache.createFile(group,function(err,fileid){
    if(err){
      res.send(err);
    }else{
      res.redirect('/editor/' + group + '?file=' + fileid);
    }
  });
});

router.post('/:group', function(req, res) {
  var group = req.params.group;
  var fileid = req.query.file;

  cache.get(fileid, function(file) {
    res.status(200).json({
      fileid: fileid,
      group: group,
      title: file.title || new Date().toLocaleDateString(),
      content: file || 'file not found',
      user: req.session.user || {}
    });
  });
});


module.exports = router;
