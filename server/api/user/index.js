'use strict';

var express = require('express');

var router = express.Router();

var extend = require('util')._extend;

router.get('/me', function(req, res) {
  if ('session' in req && 'user' in req.session) {
    var user = req.session.user;
    res.jsonp({
      err:0,
      data:extend(user,{
        avatar:"/api/user/avatar/"+user.username
      })
    });
  } else {
    res.json({});
  }
});

router.post('/me/email', function(req, res) {
  // User.findById(userId, function (err, user) {
  //     user.email = newEmail;
  //     user.save(function(err) {
  //       if (err) return validationError(res, err);
  //       res.send(200);
  //     });
  // });
});
var config = require('../../config/environment');
router.get('/avatar/:name', function(req, res) {
  var path = config.getAvatar(req.params.name);
  res.sendFile(path, {maxAge: 30 * 60, headers: {
    'Content-Type': 'image/jpeg'
  }}, function(err) {
    if (err) {
      console.log(err);
      res.status(err.status).end();
    }
  });
});

module.exports = router;
