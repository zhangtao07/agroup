// 测试用的帐号，每次登录随机选一个用户名

var User = require('../../api/user/user.model');
var contributors = require('../../../package.json').contributors;

module.exports = function(req, res, next) {
  var randomIndex = Math.floor(Math.random() * contributors.length);
  req.session.user = contributors[randomIndex];
  var name = contributors[randomIndex].name;
  var email = contributors[randomIndex].email;

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
