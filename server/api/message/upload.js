var Busboy = require('busboy');
var path = require('path');
var temp = require("temp");
var mkdirp = require('mkdirp');
var crypto = require('crypto');
var config = require("../../config/environment/index");
var fs = require("fs");
var sizeOf = require('image-size');
var exec = require('child_process').exec;

function word2Pdf(file,cb){
  var output = file+".pdf";
  exec("java -jar convert.jar -i "+file+" -o "+output,function(){
    cb&&cb(output);
  });
}

function pdf2image(file,cb){
  var outputPath = path.dirname(file)+"/images/";
  if(!fs.existsSync(outputPath)){
    fs.mkdirSync(outputPath);
  }
  exec("gm convert -density 300 -resize 50% pdf:"+file+" +adjoin jpeg:"+outputPath+"/%01d.jpg",function(){
    cb&&cb(outputPath);
  });
}

function generateImages(mimetype,file,cb){
  if(mimetype == "application/pdf") {
    pdf2image(file, cb);
  }else if(mimetype == "application/msword"){
    word2Pdf(file,function(pdf){
      pdf2image(pdf,cb);
    })
  }else{
    cb&&cb();
  }
}


function upload(fileModel, tempFile, sha1, filename, mimetype,fileId, group, size, encoding, cb) {
  var date = new Date();
  var upload_dir = config.upload_dir;
  var filePath = upload_dir + "/" + group + "/" + sha1.substring(0, 2) + "/" + sha1.substring(2) + path.extname(filename);
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


  var file = {
    filepath: filePath,
    filename: filename,
    mimetype: mimetype,
    size: size,
    file_id: fileId,
    encoding: encoding,
    createDate: new Date,
    updateDate: new Date
  };

  if (/^image\//.test(mimetype)) {

    sizeOf(saveFile, function(err, dimensions) {
      file.width = dimensions.width;
      file.height = dimensions.height;
      checkdone();
    });

  } else {
    checkdone();
  }

  function checkdone() {
    generateImages(mimetype,saveFile,function(){
      fileModel.create(file, function(err, file) {
        if (err) {
          console.info(err);
        }
        cb && cb(file);
      });
    });

  }




}

module.exports = function(req, callback) {
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

  busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
    req.body[fieldname] = val;

  });
  var result;
  busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
    file.on('data', function(data) {
      shasum.update(data);
    });

    file.on('end', function() {
      var d = shasum.digest('hex');

      var stat = fs.statSync(tempPath);
      if(!req.body['id']){
        req.models.file.create({
          name:filename,
          group_id:req.body['groupId']
        },function(err,file){
          upload(req.models.fileversion, tempPath, d, filename, mimetype, file.id,req.body['groupId'], stat['size'], encoding, function(res) {
            result = res;
            checkDone();
          });
        });
      }else{
        upload(req.models.fileversion, tempPath, d, filename, mimetype, req.body['id'],req.body['groupId'], stat['size'], encoding, function(res) {
          result = res;
          checkDone();
        });
      }


    });
    var tempDir = config.root+config.upload_temp_dir;
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
    checkDone();

  });
  req.pipe(busboy);
}
