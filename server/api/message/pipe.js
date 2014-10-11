var Busboy = require('busboy');
var path = require('path');
var temp = require("temp");
var mkdirp = require('mkdirp');
var crypto = require('crypto');
var config = require("../../config/environment/index");
var fs = require("fs");
var exec = require('child_process').exec;
var Q = require('q');
var importFile = require('./import');


/**
 *
 * @param req
 * @returns {Object} res
 * @returns {Array} res.files
 * @returns {String} res.file.filename
 * @returns {String} res.file.mimetype
 * @returns {Number} res.file.size
 * @returns {String} res.file.encoding
 * @returns {String} res.file.filepath
 * @returns {String} res.file.sha1
 * @returns {Object} res.fileds 上传请求参数
 */
function pipe(req) {
  return Q.Promise(function(resolve, reject) {
    var shasum = crypto.createHash('sha1');
    var fields = {};
    var busboy = new Busboy({
      headers: req.headers
    });

    busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
      result.fields[fieldname] = val;

    });
    var result = {
      fileds:{},
      files:[]
    };
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
      file.on('data', function(data) {
        shasum.update(data);
      });

      file.on('end', function() {
        var d = shasum.digest('hex');

        var stat = fs.statSync(tempPath);
        result.files.push({
          filename: filename,
          mimetype: mimetype,
          size: stat['size'],
          encoding: encoding,
          filepath: tempPath,
          sha1: d
        });
      });
      var tempDir = config.root + config.upload_temp_dir;
      if (!fs.existsSync(tempDir)) {
        mkdirp.sync(tempDir);
      }
      var dir = temp.openSync({
        dir: tempDir,
        suffix: ".tmp"
      });

      var tempPath = dir.path;
      file.pipe(fs.createWriteStream(tempPath));

    });

    busboy.on('finish', function() {

      resolve(result);

    });
    req.pipe(busboy);
  })
}
module.exports = pipe;

/*
module.exports = function(req, callback) {
  var user_id = req.session.user.id;

  return pipe(req).then(function(result) {
    var file = result.file,
      fields = result.fields;
    return importFile(req.models,{
      userId:user_id,
      groupId:fields.groupId,
      fileId:fields.fileId,
      filename:file.filename,
      mimetype:file.mimetype,
      size:file.size,
      encoding:file.encoding,
      filepath:file.filepath,
      sha1:file.sha1
    }).then(function(fileversion){
      return Q.promise(function(resovle){
        resovle({
          fileversion:fileversion,
          fields:fields
        })
      });
    })

  });


}
*/
