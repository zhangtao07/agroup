/**
 * Error responses
 */

'use strict';

var messages = {
  401:"请先登录"
}

module.exports[404] = function pageNotFound(req, res) {
  var viewFilePath = '404';
  var statusCode = 404;
  var result = {
    status: statusCode
  };

  res.status(result.status);
  res.render(viewFilePath, function(err) {
    if (err) {
      return res.json(result, result.status);
    }

    res.render(viewFilePath);
  });
};

module.exports[401] = function noAuth(req,res){
  res.status(401);
  res.jsonp({
    err:401,
    message:messages[401]
  });
}