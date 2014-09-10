'use strict';

var express = require('express');

var router = express.Router();

router.get('/me', function(req, res) {
  if ('session' in req && 'user' in req.session) {
    res.json(req.session.user);
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

router.get('/:id/avatar', function(req, res) {
  //TODO
});

module.exports = router;
