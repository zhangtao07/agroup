var express = require('express');
var app = express();
var compression = require('compression');
var serveStatic = require('serve-static');
var cache = require('./cache');

// Configure ejs engine
app.set('views', __dirname + '/../views');
app.engine('html', require('ejs').renderFile);

// Force HTTPS on stackedit.io
app.all('*', function(req, res, next) {
  /*
     if (req.headers.host == 'stackedit.io' && req.headers['x-forwarded-proto'] != 'https') {
     return res.redirect('https://stackedit.io' + req.url);
     }
     */
  /\.(eot|ttf|woff)$/.test(req.url) && res.header('Access-Control-Allow-Origin', '*');
  next();
});

// Use gzip compression
app.use(compression());

// Serve static resources
app.use(serveStatic(__dirname + '/../public'));

app.post('/pdfExport', require('./pdf').export);
app.post('/sshPublish', require('./ssh').publish);
app.post('/picasaImportImg', require('./picasa').importImg);
app.get('/downloadImport', require('./download').importPublic);

app.use(function(req, res, next) {
  res.renderDebug = function(page) {
    return res.render(page, {
      cache: false //!req.query.hasOwnProperty('debug')
    });
  };
  next();
});

// Serve landing.html in /
app.get('/', function(req, res) {
  //res.renderDebug('landing.html');
  res.renderDebug('editor.html');
});

// Serve editor.html in /viewer
app.get('/editor', function(req, res) {
  res.renderDebug('editor.html');
});

// Serve viewer.html in /viewer
app.get('/viewer', function(req, res) {
  res.renderDebug('viewer.html');
});

app.get('/file/:group/:filename',function(req,res){
    res.redirect('/editor');
});

app.post('/file/:group/:filename', function(req, res) {
  var group = req.params.group;
  var filename = req.params.filename;
  filename = filename.replace(/[?|&].*/, '');
  var file = cache.get(group, filename);
  console.log(file);

  if (!file) {
    res.status(200).send('file not found');
  } else {
    res.status(200).send(file);
  }
});

// Error 404
app.use(function(req, res) {
  res.status(404);
  res.render('error_404.html');
});

module.exports = app;
