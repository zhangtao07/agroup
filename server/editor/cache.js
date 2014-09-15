var fs = require('fs');
var path = require('path');
var cache = {};

function getPath(fileid){
  return path.join(__dirname, '../../doc/agroup.md', group, filename);
}

exports.set = function(fileid, syncService) {
  cache[group + '/' + filename] = syncService;
  return this;
};
exports.saveToDisk = function(fileid) {
  var file = cache[group + '/' + filename];
  if (file && file.content) {
    fs.writeFile(getPath(group,filename), file.content,'utf8');
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
