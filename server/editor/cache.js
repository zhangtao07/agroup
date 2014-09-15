var fs = require('fs');
var path = require('path');
var cache = {};

function getPath(fileid){
  //TBD 等待跟文件系统接入
  var filepath = path.join(__dirname,'../../.tmp/test.md');
  var exists = fs.existsSync(filepath);
  if(!exists){
    fs.writeFileSync(filepath,'#测试文档');
  }
  return filepath;
}

exports.set = function(fileid, syncService) {
  cache[fileid] = syncService;
  return this;
};
exports.saveToDisk = function(fileid) {
  var file = cache[fileid];
  if (file && file.content) {
    fs.writeFile(getPath(fileid), file.content,'utf8');
    //delete cache[group + '/' + filename];
  }
};

exports.get = function(fileid) {
  var file = cache[fileid];
  if (file) {
    return file.content;
  } else {
    var filepath = getPath(fileid);
    var f = fs.readFileSync(filepath, 'utf8');
    return f;
  }
};
