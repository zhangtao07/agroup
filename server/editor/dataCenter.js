var fs = require('fs');
var path = require('path');
var moment = require('moment');
var models = require('../model');
var md5 = require('MD5');
var config = require("../config/environment");
var _ = require('lodash');
var cache = {};
var database;
var basepath = config.root + config.upload_dir + '/markdown';

fs.exists(basepath, function(exists) {
  if (!exists) {
    fs.mkdir(basepath);
  }
});


exports.userJoin = function(client) {
  var writers = cache[client.fileid].writers = cache[client.fileid].writers || [];
  return writers.push(client.user);
};

exports.userLeave = function(client) {
  var file = cache[client.fileid];
  if(!file) return;
  var writers = file.writers;
  _.remove(writers, function(writer){
    return writer.id === client.user.id;
  });

  if (!writers.length) {
    createFileversion(file);
    updateFile(file);
    delete cache[file.id];
  }
}

exports.setTitle = function(fileid, fileDesc) {
  //console.log(fileDesc);
  cache[fileid].name = fileDesc._title;
}

exports.setContent = function(fileid, content) {
  cache[fileid].content = content;
}

exports.getContent = function(fileid, content) {
  return cache[fileid].content;
}

exports.getCache = function(fileid) {
  return cache[fileid];
}


exports.readFile = function(fileid, cb) {
  var cachedfile = cache[fileid];
  if (cachedfile) return cb && cb(cachedfile);
  getDB(function(err, db) {
    db.models.file.get(fileid, function(err, file) {
      file.getFileversion(function(err, fvs) {
        readFromDisk(file, _.max(fvs, 'id'), cb);
      });
    });
  });
};

function updateFile(file){
  getDB(function(err, db) {
    db.models.file.get(file.id, function(err, f) {
      //TBD
      f.status = file.status;
      f.name = file.name || defaultFileName({nickname:'agroup'});
      f.save();
    });
  });
}

/* 创建markdown */
exports.createFile = function(group, user, cb) {
  getDB(function(err, db) {
    var file = db.models.file;
    file.create([{
      name: defaultFileName(user),
      mimetype: 'text/x-markdown',
      status: 'init',
      createDate: new Date(),
      user_id: user.id,
      group_id: group
    }], function(err, files) {
      _.each(files, function(file) {
        createFileversion(file);
        cache[file.id] = file;
        return cb && cb(err,file.id);
      });
    });
  });
};

exports.checkFile = function(fileid, cb) {
  if (cache[fileid]) {
    cb(null,cache[fileid]);
  } else {
    getDB(function(err, db) {
      var file = db.models.file;
      file.exists({
        id: fileid
      }, function(err, exists) {
        cb(err, exists);
      });
    });
  }
};

function defaultFileName(user) {
  return user.nickname + '_' + moment().format('YYYYMMDD_HHmmss') + '.md';
}

function getFileRealpath(filepath) {
  return path.join(config.root, config.upload_dir, '/' + filepath);
}

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

function readFromDisk(file, fv, cb) {
  fs.readFile(fv.getRealpath(), 'utf8', function(err, content) {
    if (err) return err;
    var cf = cache[fv.file_id] = file;
    cf.content = content;
    cf.filpath = fv.filepath;
    return cb && cb(cf);
  });
}

function createFileversion(file) {
  getDB(function(err, db) {
    var fv = {
      filepath: path.join('markdown/', md5(file.content || file.name)) + '.md',
      filename: file.name,
      mimetype: 'text/x-markdown',
      size: 0,
      encoding: 'utf8',
      file_id: file.id,
      user_id: file.user_id
    };
    if (file.filepath !== fv.filepath) {
      db.models.fileversion.create([fv], function(err, fvs) {
        if (err) throw err;
      });
      fs.writeFile(getFileRealpath(fv.filepath), file.content || '', 'utf8');
    }
  });
}
