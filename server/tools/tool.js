
var exec = require('child_process').exec;

exports.video2Thumbnail = function(input,output,callback){
  exec('avconv -i '+input+' -ss 00:00:01 -f image2 -vframes 1 '+output,function(error, stdout, stderr) {
    var err = error || stderr;
    if (err) {
      console.info(err);
      callback(err,null);
    } else {
      callback(null, stdout);
    }
  });
}

exports.office2pdf = function(input, output, callback) {
  var jar = __dirname + '/office2pdf.jar';
  var licence = __dirname + '/licence.xml';
  exec('java -jar ' + jar + ' -l ' + licence + ' -f fonts ' + input + ' ' + output + '', function(error, stdout, stderr) {
    var err = error || stderr;
    if (err) {
      console.info(err);
      callback(err,null);
    } else {
      callback(null, stdout);
    }
  });
}

exports.resize = function(input,output,width,height,callback){
  var argSize = width + 'x' + height;
  exec('gm convert ' + input + ' -resize "' + argSize + '>" +profile "*" ' + output,function(error, stdout, stderr) {
    var err = error || stderr;
    if (err) {
      console.info(err);
      callback(err,null);
    } else {
      callback(null,stdout);
    }
  });
}

exports.crop = function(input,output,gravity,width,height,callback){
  var argSize = width + 'x' + height;
  exec('gm convert ' + input + ' -gravity ' + gravity + ' -extent ' + argSize + '  ' + output,function(error, stdout, stderr) {
    var err = error || stderr;
    if (err) {
      console.info(err);
      callback(err,null);
    } else {
      callback(null,stdout);
    }
  });
}


var path = require('path');
var temp = require("temp");
var mkdirp = require('mkdirp');
var config = require("../config/environment/");
var fs = require('fs');

exports.getPDFText = function(pdf,callback){
  var jar = __dirname+'/pdfbox.jar';
  var tempDir = config.root + config.upload_temp_dir;
  if (!fs.existsSync(tempDir)) {
    mkdirp.sync(tempDir);
  }
  var dir = temp.openSync({
    dir: tempDir,
    suffix: ".tmp"
  });

  var tempPath = dir.path;
  exec('java -jar '+jar+' ExtractText -encoding utf-8 '+pdf+' '+tempPath,function(error, stdout, stderr){
    fs.readFile(tempPath,function(err,data){
      callback(null,data.toString('UTF-8'));
      fs.unlink(tempPath);
    });
  });
}

exports.pdfToConver = function(pdf,density,resize,output,callback){
  exec('gm convert -density '+density+' ' + pdf + '[0] -resize '+resize+'% ' + output, function(error, stdout, stderr) {
    var err = error || stderr;
    if (err) {
      console.info(err);
      callback(err,null);
    } else {
      callback(null,stdout);
    }
  });
}

exports.pdfToImages = function(pdf,density,resize,outputDir,callback){
  //exec("gm convert -density 300 -resize 50% pdf:" + pdf + " +adjoin jpeg:" + imagesPath + "/%01d.jpg");
  exec('gm convert -density '+density+' -resize '+resize+'% pdf:' + pdf + ' +adjoin jpeg:' + outputDir + '/%01d.jpg', function(error, stdout, stderr) {
    var err = error || stderr;
    if (err) {
      console.info(err);
      callback(err,null);
    } else {
      callback(null,stdout);
    }
  });
}

