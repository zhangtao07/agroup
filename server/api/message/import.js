var path = require('path');
var mkdirp = require('mkdirp');
var config = require("../../config/environment/index");
var fs = require("fs");
var sizeOf = require('image-size');
var Q = require('q');
var tool = require('../../tools/tool');
var Segment = require('segment').Segment;
// 创建实例
var segment = new Segment();
// 使用默认的识别模块及字典，载入字典文件需要1秒，仅初始化时执行一次即可
segment.useDefault();


/*function word2Pdf(file) {
  return Q.Promise(function(resolve) {
    var output = file + ".pdf";
    exec("java -jar " + __dirname + "/convert.jar -i " + file + " -o " + output, function(error, stdout, stderr) {
      resolve(output);
    });
  });

}*/

function pdf2image(pdf) {

  return Q.all([Q.nfcall(tool.getPDFText,pdf), Q.nfcall(tool.pdfToConver,pdf,300,25,pdf+'.cover.jpg')]).then(function(result){
    return Q.promise(function(resolve){

      resolve(result[0]);

      //generate images from pdf in background
      var imagesPath = pdf+'.images';
      if (!fs.existsSync(imagesPath)) {
        fs.mkdirSync(imagesPath);
      }

      pdfToImages(pdf,300,50,imagesPath);
//      exec("gm convert -density 300 -resize 50% pdf:" + pdf + " +adjoin jpeg:" + imagesPath + "/%01d.jpg");
    });
  });
}

function generatePreview(mimetype, file) {

  if (mimetype == "application/pdf") {
    return Q.promise(function(resolve){
      pdf2image(file).then(function(text){
        resolve({
          text:text
        })
      });
    });
  } else if (/ms[-]*word|officedocument|ms[-]*excel|spreadsheetml|ms[-]*powerpoint|presentationml/.test(mimetype)) {
    return Q.promise(function(resolve){
      Q.nfcall(tool.office2pdf,file,file+'.pdf').then(function() {
        return pdf2image(file+'.pdf');
      }).then(function(text){
        resolve({
          text:text
        })
      });
    });
  } else {
    return Q.fcall(function() {
      return {
        text:null
      }
    });
  }
}
function chineseSegment(text){

  var utf8segments = [];
  segment.doSegment(text).forEach(function(word){
    utf8segments.push(encodeURI(word.w).replace(/\%/g,''));
  });
  return utf8segments.join(' ');
}

var Iconv = require('iconv').Iconv;
var jschardet = require("jschardet");
var istextorbinary = require('istextorbinary');

function extractPlainFileText(file){
  return Q.promise(function(resolve){
    istextorbinary.isText(file,null,function(err, result){
      if(result){
        Q.nfcall(fs.readFile,file).then(function(buffer){
          resolve(bufferToString(buffer));
        });
      }else{
        resolve(null);
      }
    });

    function bufferToString(buffer) {
      var charset = jschardet.detect(buffer).encoding;
      try {
        return buffer.toString(charset);
      } catch (x) {
        var charsetConverter = new Iconv(charset, "utf8");
        return charsetConverter.convert(buffer).toString();
      }
    }
  });
}
/**
 *
 * @param models
 * @param args
 * @returns {*}
 */

module.exports=function(models,args){
  var fileId = args.fileId,//not required
    userId = args.userId,//required
    groupId = args.groupId,//required
    sha1 = args.sha1,//required
    filepath = args.filepath,//required
    mimetype = args.mimetype,//required
    filename = args.filename,//required
    fileSize = args.size,//required
    encoding = args.encoding,//required
    folderId = args.folderId;//not required

  return Q.Promise(function getFileId(resolve) {
    if (fileId) {
      resolve(fileId);
    } else {
      Q.nfcall(models.file.create,{
        name: filename,
        group_id: groupId,
        user_id: userId
      }).then(function(file){
        Q.nfcall(models.folder.create,{
          name:filename,
          file_id:file.id,
          parent_id:folderId,
          type:'file',
          group_id:groupId
        }).then(function(){
          resolve(file.id);
        });

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
        fs.renameSync(filepath, saveFile);
      } else {
        fs.unlinkSync(filepath);
      }


      var fileVersion = {
        user_id: userId,
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
        Q.all([extractPlainFileText(saveFile),generatePreview(mimetype, saveFile)]).then(function(result){
          Q.nfcall(models.fileversion.create,fileVersion).then(function(fileversion){
            var filetext = result[1].text || result[0];
            if(filetext){
              Q.nfcall(models.filefulltext.create,{
                utf8segments:chineseSegment(filetext),
                text:filetext,
                fileversion_id:fileversion.id
              }).then(function(){
                resolve(fileversion);
              }).fail(function(err){
                console.info(err);
              });
            }else{
              resolve(fileversion);
            }

          })
        });

      });
    });
  });
}