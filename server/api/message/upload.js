var Busboy = require('busboy');
var path = require('path');
var temp = require("temp");
var mkdirp = require('mkdirp');
var crypto = require('crypto');
var config = require("../../config/environment/index");
var fs = require("fs");
var sizeOf = require('image-size');



function upload(fileModel,tempFile, sha1, filename, mimetype, group, size, encoding, cb) {
  var date = new Date();
  var upload_dir = config.upload__dir;
  var saveFile = upload_dir + "/" + group + "/" + sha1.substring(0, 2) + "/" + sha1.substring(2) + path.extname(filename);
  var saveDir = path.dirname(saveFile);
  if (!fs.existsSync(saveDir)) {
    mkdirp.sync(saveDir);
  }
  if (!fs.existsSync(saveFile)) {
    fs.renameSync(tempFile, saveFile);
  } else {
    fs.unlinkSync(tempFile);
  }



  var file = {
    filepath: saveFile,
    filename: filename,
    mimetype: mimetype,
    size: size,
    group_id: group,
    encoding: encoding,
    createDate:new Date,
    updateDate:new Date
  };

  if(/^image\//.test(mimetype)){

    sizeOf(saveFile,function(err,dimensions){
      file.width = dimensions.width;
      file.height = dimensions.height;
      checkdone();
    });

  }else{
    checkdone();
  }

  function checkdone(){
    fileModel.create(file, function (err, file) {
      if(err){
        console.err(err);
      }
      cb && cb(file);
    });
  }



}

module.exports = function (req, callback) {
  var checkI = 0;

  function checkDone() {
    checkI++;
    if (checkI == 2) {
      callback && callback(result);
    }

  }

  var shasum = crypto.createHash('sha1');
  var busboy = new Busboy({
    headers: req.headers
  });
  var fields = {};
  busboy.on('field', function (fieldname, val, fieldnameTruncated, valTruncated) {
    fields[fieldname] = val;
  });
  var result;
  busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
    file.on('data', function (data) {
      shasum.update(data);
    });

    file.on('end', function () {
      var d = shasum.digest('hex');

      var stat = fs.statSync(tempPath);

      upload(req.models.file,tempPath, d, filename, mimetype, fields['groupId'], stat['size'], encoding, function (res) {
        result = res;
        checkDone();
      });

    });
    var tempDir = config.upload_temp_dir;
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

  busboy.on('finish', function () {
    checkDone();
    /*
     res.writeHead(200, {
     'Connection' : 'close'
     });
     res.end("ok");*/

  });
  req.pipe(busboy);
}
