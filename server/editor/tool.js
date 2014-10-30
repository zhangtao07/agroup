var spawn = require('child_process').spawn;
var config = require('./settings');
var settings = config.settings;
var getParams = config.getParams;
var _ = require('lodash');
var marked = require('marked');
var fs = require('fs');
var os = require('os');
var path = require('path');
var Stream = require('stream');

marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false,
  highlight: function(code) {
    return require('highlight.js').highlightAuto(code).value;
  }
});


// Apply template to the current document
function md2html(filename, content) {
  try {
    var template = settings.pdfTemplate;
    return _.template(template, {
      documentTitle: filename,
      documentHTML: marked(content)
    });
  } catch (e) {
    return e.message;
  }
}

function str2readstream(str) {
  var s = new Stream.Readable();
  s._read = function noop() {}; // redundant? see update below
  s.push(str);
  s.push(null);
  return s;
}

function str2writstream(str){
  var stream = new Stream();
  stream.pipe = function(dest){
    dest.write(str);
  }
  return stream;
}

exports.markdown2pdf = function(filename,content,pdfpath,callback) {
    //var pdfpath = filepath + '.pdf';
    var binPath = process.env.WKHTMLTOPDF_PATH || 'wkhtmltopdf';
    var params = getParams(settings.pdfOptions);
    var wkhtmltopdf = spawn(binPath, params.concat('-', pdfpath), {
      stdio: [
        'pipe',
        'ignore',
        'ignore'
      ]
    });
    var html = md2html(filename, content);
    var timeoutId = setTimeout(function() {
      timeoutId = undefined;
      wkhtmltopdf.kill();
    }, 30000);
    wkhtmltopdf.on('error', function(err) {
      console.log(err);
    });
    wkhtmltopdf.stdin.on('error', function(err) {
      console.log(err);
    });
    wkhtmltopdf.on('close', function(code) {
      console.log(pdfpath);
      if (!timeoutId) {
        console.log('time out');
        return
      }
      clearTimeout(timeoutId);
      if (code) {
        console.log(code);
        return;
      }
      return callback && callback(null,pdfpath);
    });
    str2readstream(html).pipe(wkhtmltopdf.stdin);
    //str2readstream(html).pipe(process.stdout);
}
