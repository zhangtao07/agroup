var User = require('../api/user/user.model');

exports.addUser = function(req, name, email) {
  User.findOne({
    email: email
  }, function(err, user) {
    if (user) {
      req.session.user._id = user._id;
      res.redirect('/');
    } else {
      var user = new User({name: name, email: email});
      user.save(function(error, savedUser) {
        req.session.user._id = savedUser._id;
        res.redirect('/');
      });
    }
  });
}
