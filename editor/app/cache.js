var fs = require('fs');
var path = require('path');
var cache = {};

function getPath(group,filename){
  return path.join(__dirname, '../public/doc', group, filename);
}

exports.set = function(group, filename, syncService) {
  cache[group + '/' + filename] = syncService;
  return this;
};
exports.saveToDisk = function(group, filename) {
  var file = cache[group + '/' + filename];
  if (file && file.content) {
    fs.writeFile(getPath(group,filename), file.content,'utf8');
    //delete cache[group + '/' + filename];
  }
};

exports.get = function(group, filename) {
  var addr = getPath(group,filename);
  var file = cache[group + '/' + filename];
  if (file) {
    return file.content;
  } else {
    var f = fs.readFileSync(addr, 'utf8');
    return f;
  }
};
