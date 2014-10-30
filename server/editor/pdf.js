var spawn = require('child_process').spawn;
var fs = require('fs');
var path = require('path');
var os = require('os');
var settings = require('./settings');

function onError(err, next) {
  next(err);
}

function onUnknownError(res) {
  res.statusCode = 400;
  res.end('Unknown error');
}

function onUnauthorizedError(res) {
  res.statusCode = 401;
  res.end('Unauthorized');
}

function onTimeout(res) {
  res.statusCode = 408;
  res.end('Request timeout');
}

exports.export = function(req, res, next) {

  var options;
  try {
    options = JSON.parse(req.query.options);
  } catch (e) {
    options = {};
  }

  var params = settings.getParams(options);
  // Use a temp file as wkhtmltopdf can't access /dev/stdout on Amazon EC2 for some reason
  var filePath = path.join(os.tmpDir(), Date.now() + '.pdf');
  var binPath = process.env.WKHTMLTOPDF_PATH || 'wkhtmltopdf';

  var wkhtmltopdf = spawn(binPath, params.concat('-', filePath), {
    stdio: [
      'pipe',
      'ignore',
      'ignore'
    ]
  });
  var timeoutId = setTimeout(function() {
    timeoutId = undefined;
    wkhtmltopdf.kill();
  }, 30000);
  wkhtmltopdf.on('error', function(err) {
    onError(err, next)
  });
  wkhtmltopdf.stdin.on('error', function(err) {
    onError(err, next)
  });
  wkhtmltopdf.on('close', function(code) {
    console.log('code' ,code);
    if (!timeoutId) {
      return onTimeout(res);
    }
    clearTimeout(timeoutId);
    if (code) {
      return onUnknownError(res);
    }
    var readStream = fs.createReadStream(filePath);
    readStream.on('open', function() {
      readStream.pipe(res);
    });
    readStream.on('close', function() {
      fs.unlink(filePath, function() {});
    });
    readStream.on('error', function() {
      onUnknownError(res)
    });
  });
  req.pipe(wkhtmltopdf.stdin);
};
