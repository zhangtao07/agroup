'use strict';

var express = require('express');
var router = express.Router();
var dataCenter = require('./dataCenter');

router.post('/pdfExport', require('./pdf').export);
//router.post('/pdfToImage', require('./pdf').toImage);

router.get('/viewer', function(req, res) {
  res.render('viewer.html');
});

router.get('/merge', function(req, res) {
  res.render('merge.html');
});

router.get('/:group', function(req, res) {
  var group = req.params.group;
  var fileid = req.query.file;
  var view = req.query.view;
  var cache = true;
  if(typeof req.query.debug !== 'undefined'){
    cache = false;
  }

  if(!fileid){
    res.redirect('/');
  }else{
    dataCenter.checkFile(fileid,function(err,exists){
      if(exists){
        return view ? res.render('viewer.html', { cache: cache }) : res.render('editor.html', { cache: cache });
      }else{
        res.render('no-file.html');
      }
    })
  }
});

router.get('/:group/create',function(req,res){
  var group = req.params.group;

  dataCenter.createFile(group, req.session.user,function(err,fileid){
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
  var user = req.session.user;

  dataCenter.readFile(fileid , function(file) {
    res.status(200).json({
      fileid: fileid,
      group: group,
      title: file.name,
      content: file.content || '',
      user: {
        id: user.id,
        username: user.username,
        nickname: user.nickname,
        avatar: '/api/user/avatar/' + user.username
      }
    });
  });
});


module.exports = router;
