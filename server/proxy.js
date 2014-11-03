var config = require('./config/environment');
var httpProxy = require('http-proxy');
var proxy = new httpProxy.createProxyServer({});

exports = module.exports = function(req, res, cb) {
  var apiUrl = 'http://' + config.service.host + ':' + config.service.port;
  cb(function(url) {
    url = url || req.originalUrl;
    console.log('proxing : ',apiUrl + url);
    proxy.web(req,res, {target: apiUrl + url});
  });
}
