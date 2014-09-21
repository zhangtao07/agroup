'use strict';


exports.addUser = function(req, res, name, email) {
  var User = req.models.user;
  User.one({
    email: email
  }, function(err, user) {
    if (user) {
      req.session.user.id = user.id;
      res.redirect(req.query.url||"/");
    } else {

      User.create({name: name, email: email}, function(error, savedUser) {
        req.session.user.id = savedUser.id;
        res.redirect(req.query.url||"/");
      });
    }
  });
}
