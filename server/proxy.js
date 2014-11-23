var config = require('./config/environment');
var httpProxy = require('http-proxy');
var options = {
  target: {
    host: config.service.host,
    port: config.service.port
  }
};

var request = require('request');


//exports = module.exports =  function(req,res,next){
  //var rootURL = 'http://' + config.service.host + ':' + config.service.port;
  //console.log("value");
    //request.get({
      //url: rootURL + req.originalUrl.replace('/api',''),
      //headers: req.headers
    //}).pipe(res);
    //[>
    //, function(err, response, body) {
      //res.writeHead(response.statusCode,response.headers);
      //res.end(body);
    //});
    //*/
//};

exports = module.exports = function(req, res, next) {
  var proxy = new httpProxy.createProxyServer(options);

  var events = {
    data: [],
    error: []
  };
  var exports = {
    on: function(id, fn) {
      events[id] = events[id] || [];
      events[id].push(fn);
    }
  };

  proxy.on('error', function(e) {
    var args = [].slice.call(arguments);
    if (events.error.length) {
      events.data.forEach(function(d) {
        d.apply(null, args);
      });
    }
  });

  proxy.on('proxyRes', function(proxyRes, req, res) {
    //console.log('RAW Response from the target', JSON.stringify(proxyRes.headers, true, 2));
    var _chunk='';
    proxyRes.on('data', function(chunk) {
      _chunk += chunk;

    })
    proxyRes.on('end',function(){
      if (events.data.length) {
        events.data.forEach(function(d) {
          d.call(null, _chunk);
        });
      }
    })
  });
  req.url = req.originalUrl.replace('api/', '');
  proxy.web(req, res);
  //proxy.close();
  return exports;
}
