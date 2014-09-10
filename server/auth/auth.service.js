'use strict';
var User = require('../api/user/user.model');

exports.addUser = function(req, res, name, email) {
  User.findOne({
    email: email
  }, function(err, user) {
    if (user) {
      req.session.user._id = user._id;
      res.redirect('/');
    } else {
      var newUser = new User({name: name, email: email});
      newUser.save(function(error, savedUser) {
        req.session.user._id = savedUser._id;
        res.redirect('/');
      });
    }
  });
}
