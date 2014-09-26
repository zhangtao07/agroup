var Busboy = require('busboy');
var path = require('path');
var temp = require("temp");
var mkdirp = require('mkdirp');
var crypto = require('crypto');
var config = require("../../config/environment/index");
var fs = require("fs");
var sizeOf = require('image-size');
var exec = require('child_process').exec;
var Q = require('q');

function word2Pdf(file) {
  return Q.Promise(function(resolve) {
    var output = file + ".pdf";
    exec("java -jar " + __dirname + "/convert.jar -i " + file + " -o " + output, function(error, stdout, stderr) {
      resolve(output);
    });
  });

}

function pdf2image(file, outputPath) {
  return Q.Promise(function(resolve) {
    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath);
    }
    exec("gm convert -density 300 -resize 50% pdf:" + file + " +adjoin jpeg:" + outputPath + "/%01d.jpg", function() {
      resolve(outputPath);
    });
  });


}

function generateImages(mimetype, file) {

  if (mimetype == "application/pdf") {
    return pdf2image(file, file + '.images');
  } else if (/ms[-]*word|officedocument/.test(mimetype)) {
    return word2Pdf(file).then(function(pdf) {
      return pdf2image(pdf, file + '.images');
    });
  } else {
    return Q.fcall(function() {
    });
  }
}


/**
 *
 * @param req
 * @returns {Object} res
 * @returns {Object} res.file
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
      fields[fieldname] = val;

    });
    var result = {};
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
      file.on('data', function(data) {
        shasum.update(data);
      });

      file.on('end', function() {
        var d = shasum.digest('hex');

        var stat = fs.statSync(tempPath);
        result.file = {
          filename: filename,
          mimetype: mimetype,
          size: stat['size'],
          encoding: encoding,
          filepath: tempPath,
          sha1: d
        };
        result.fields = fields;
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

module.exports = function(req, callback) {
  var user_id = req.session.user.id;

  return pipe(req).then(function(result) {

    var pipeFile = result.file,
      fields = result.fields,
      groupId = fields.groupId,
      sha1 = pipeFile.sha1,
      tempFile = pipeFile.filepath,
      mimetype = pipeFile.mimetype,
      filename = pipeFile.filename,
      fileSize = pipeFile.size,
      encoding = pipeFile.encoding;

    return Q.Promise(function getFileId(resolve) {
      if (fields.id) {
        resolve(fields.id);
      } else {
        req.models.file.create({
          name: filename,
          group_id: groupId,
          user_id: user_id
        },function(err,file){
          resolve(file.id);
        });
      }
    }).then(function(file_id) {
      return Q.Promise(function getFileversion(resolve) {
        var upload_dir = config.upload_dir;
        var databasepath = groupId + "/" + sha1.substring(0, 2) + "/" + sha1.substring(2) + path.extname(filename);
        var filePath = upload_dir + "/" + databasepath;
        var saveFile = config.root + filePath;
        var saveDir = path.dirname(saveFile);
        if (!fs.existsSync(saveDir)) {
          mkdirp.sync(saveDir);
        }
        if (!fs.existsSync(saveFile)) {
          fs.renameSync(tempFile, saveFile);
        } else {
          fs.unlinkSync(tempFile);
        }


        var fileVersion = {
          user_id: user_id,
          filepath: databasepath,
          filename: filename,
          mimetype: mimetype,
          size: fileSize,
          file_id: file_id,
          encoding: encoding,
          createDate: new Date,
          updateDate: new Date
        };
        Q.Promise(function imageSizeOf(resolve) {
          if (/^image\//.test(mimetype)) {
            sizeOf(saveFile, function(err, dimensions) {
              resolve(dimensions)
            });
          } else {
            resolve(null);
          }
        }).then(function(dimen) {

          if (dimen) {
            fileVersion.width = dimen.width;
            fileVersion.height = dimen.height;
          }
          generateImages(mimetype, saveFile).then(function() {
            req.models.fileversion.create(fileVersion, function(err, fileversion) {
              if (err) {
                console.info(err);
              }
              console.info("3333");
              resolve({
                fields:fields,
                fileversion:fileversion
              });
            });
          });

        });
      });
    });
  });


}
