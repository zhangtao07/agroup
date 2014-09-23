var fs = require('fs');
var path = require('path');
var models = require('../model');
var async = require('async');
var md5 = require('MD5');
var cache = {};
var pathdb = {};
var database;
var basepath = path.join(__dirname,'../../.markdowns/');

fs.exists(basepath, function (exists) {
  if(!exists){
    fs.mkdir(basepath);
  }
});


function getDB(cb) {
  if (database) {
    return cb && cb(null, database);
  }
  models(function(err, db) {
    if (err) return err;
    database = db;
    return cb && cb(null, database);
  });
}

function findPath(db, fileid, cb) {
  var fv = db.models.fileversion;
  fv.find({
    file_id: fileid
  }, 1, ['updateDate', 'Z'], function(err, file) {
    if (err) throw err;
    var filepath = file[0] ? file[0].filepath : path.join(basepath + fileid + '.md');
    var exists = fs.existsSync(filepath);
    if (!exists) {
      fs.writeFileSync(filepath, '\n\nAGroup 一个伟大项目的开始 \n====');
    }
    pathdb[fileid] = filepath;
    return cb && cb(null, filepath);
  });
}

function getPath(fileid, cb) {
  var filepath = pathdb[fileid];
  if (filepath) {
    cb(filepath);
  } else {
    async.waterfall(
      [
        getDB,
        function(db, next) {
          next(null, db, fileid)
        },
        findPath
      ],
      function(err, results) {
        if (err) return err;
        return cb && cb(results);
      });
  }
}

function saveToDB(file, cb) {
  getDB(function(err, db) {
    var fv = db.models.fileversion;
    fv.find({
      filepath: file.filepath
    }, 1, function(err, exists) {
      if (exists && exists.length) {
        exists[0].updateDate = new Date();
        exists[0].save()
      } else {
        fv.create([file], function(err, items) {
          cb(err, file);
        });
      }
    });
  });
}

function saveToDisk(file, content, cb) {
  fs.writeFile(file.filepath, content, 'utf8', function(err) {
    fs.stat(file.filepath, function(err, stat) {
      file.size = stat.blksize;
      cb(null, file);
    });
  });
}

exports.set = function(fileid, syncService) {
  cache[fileid] = syncService;
  return this;
};

exports.save = function(fileid) {
  var file = cache[fileid];
  if (file && file.content) {
    getPath(fileid, function(filepath) {
      async.waterfall([

        function(next) {
          var filename = fileid + '-' + md5(file.content) + '.md';
          var fv = {
            filepath: path.join(path.dirname(filepath), '/', filename),
            filename: filename,
            mimetype: 'text/markdown',
            size: 0,
            encoding: 'utf8',
            file_id: fileid
          };
          next(null, fv, file.content);
        },
        saveToDisk,
        saveToDB
      ], function(err, results) {
        if (err) return err;
        delete cache[fileid];
        delete pathdb[fileid];
      });
    });
  }
};

exports.get = function(fileid, cb) {
  var file = cache[fileid];
  if (file) {
    return cb && cb(file.content);
  } else {
    getPath(fileid, function(filepath) {
      fs.readFile(filepath, 'utf8', function(err, f) {
        if (err) throw err;
        cb(f);
      });
    });
  }
};


exports.createFile = function(group, cb) {
  async.waterfall(
    [
      getDB,
      function(db, next) {
        var file = db.models.file;
        file.create([{
          name: new Date().toLocaleDateString(),
          group_id: group
        }], function(err, items) {
          cb(err,items[0].id);
        });
      }
    ]);
};

exports.checkFile = function(fileid, cb) {
  async.waterfall(
    [
      getDB,
      function(db, next) {
        var file = db.models.file;
        file.exists({
          id: fileid
        }, function(err, exists) {
          cb(err,exists);
        });
      }
    ]);
};
