'use strict';

//var File = require("../../model/file.model.js");
var config = require("../../config/environment");
var exec = require('child_process').exec;
// Get list of images
exports.upload = function(req, res) {
  var id = req.params.id;
  req.models.fileversion.get(id, function(err, file) {
    res.sendFile(config.root + file.filepath, {maxAge: 10 * 365 * 24 * 60 * 60, headers: {
      'Content-Type': file.type
    }}, function(err) {
      if (err) {
        console.log(err);
        res.status(err.status).end();
      }
    });
  });
};

var cf = require('npm-cache-filename');
var Q = require("q");
var S = require('string');
var request = require('request');
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
exports.resize = function(req, res) {
  var url = req.query.url,
    width = req.query.width,
    height = req.query.height,
    type = req.query.type || "resize", //resize,crop
    gravity = req.query.type || "center";

  url = decodeURIComponent (url);
  console.info(url);
  var cacheOrginFile = null;
  try{
    cacheOrginFile = cf(config.root + config.resize_dist_cache, url);
    if(fs.existsSync()){

    }
  }catch(e){
    res.send(404);
  }

  var cacheResizeFile = S(cacheOrginFile + "_{{type}}_{{gravity}}_{{width}}__{{height}}").template({
    width: width,
    height: height,
    type: type,
    gravity: gravity
  }).s;
  var cacheDir = path.dirname(cacheOrginFile);

  function resizeImage() {
    return Q.Promise(function resize(resolve, reject) {
      var argSize = width + 'x' + height,
        command = '';
      if (type == 'resize') {
        command = 'gm convert ' + cacheOrginFile + ' -resize "' + argSize + '>" +profile "*" ' + cacheResizeFile;
        console.info(command);
      } else if (type == 'crop') {
        command = 'gm convert ' + cacheOrginFile + ' -gravity ' + gravity + ' -extent ' + argSize + '  ' + cacheResizeFile;
      }
      exec(command, function(error, stdout, stderr) {
        if (error !== null) {
          console.log('exec error: ' + error);
        } else {
          resolve();
        }
      });

    });
  }

  Q.Promise(function mkdir(resolve, reject) {
    if (fs.existsSync(cacheDir)) {
      resolve();
    } else {
      Q.nfcall(mkdirp, cacheDir)
        .then(function() {
          resolve();
        });
    }
  }).then(function() {

    return Q.Promise(function getCacheFile(resolve, reject) {
      if (fs.existsSync(cacheResizeFile)) {
        resolve();
      } else {

        if (fs.existsSync(cacheOrginFile)) {
          resizeImage().then(function() {
            resolve();
          });
        } else {
          Q.Promise(function fetch(resolve, reject) {
            var headers = req.headers;
            delete headers.host;
            if (fs.existsSync(cacheOrginFile)) {
              resolve();
            } else {
              request.head({
                url:url,
                headers:req.headers
              }, function(err, result, body) {
                if(err){
                  res.send(404);
                }else{
                  var contentType = result.headers['content-type'];
                  if (!/^image\/(png|jpeg|jpg|gif)/.test(contentType)) {
                    res.set('Content-Type', 'image/jpeg');
                    res.end('', 'binary');
                  } else {
                    var stream = fs.createWriteStream(cacheOrginFile);
                    request({
                      url:url,
                      headers:req.headers
                    }).pipe(stream).on('finish',function(){
                      stream.close();
                      resolve();
                    });
                  }
                }

              });
            }

          }).then(function() {
            resizeImage().then(function() {
              resolve();
            });

          });
        }


      }
    }).then(function() {

      res.sendFile(cacheResizeFile, {maxAge: 10 * 365 * 24 * 60 * 60, headers: {
        'Content-Type': 'image/jpeg'
      }});
    })


  });


}


function handleError(res, err) {
  return res.send(500, err);
}
