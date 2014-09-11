// 测试用的帐号，每次登录随机选一个用户名

var auth = require('../auth.service');

var contributors = require('../../../package.json').contributors;

module.exports = function(req, res, next) {
  var randomIndex = Math.floor(Math.random() * contributors.length);
  req.session.user = contributors[randomIndex];
  var name = contributors[randomIndex].name;
  var email = contributors[randomIndex].email;

  auth.addUser(req, res, name, email);
}
