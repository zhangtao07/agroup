var fs = require('fs');
var path = require('path');
var models = require('../model');
var md5 = require('MD5');
var mime = require('mime');

var basepath = path.join(__dirname, '../../import/');
var dest = path.join(__dirname, '../../upload/');



var database;
var db = {};
var noop = function(){};

var user = {
  id: 2
};
var group = {
  id: 1
};

function getDB(cb) {
  if (database) {
    return cb && cb(null, database);
  }
  models(function(err, db) {
    if (err) return err;
    database = db.models;
    return cb && cb(null, database);
  });
}

function readPath(p, parentID) {
  parentID = parentID || 0;
  fs.stat(p, function(err, stats) {
    if (stats.isFile()) {
      readFile(p, stats, parentID);
    } else if (stats.isDirectory()) {
      //console.log(path.basename(p), path.basename(upfolder));
      database.folder.create([{
        name: path.basename(p),
        parent_id: parentID,
        type: 'folder',
        group_id: group.id
      }], function(err, item) {
        //console.log(item[0].id);
        readDirectory(p, item[0].id);
      });
    }
  });
}

function readFile(p, stats, parentID) {
  fs.readFile(p, function(err, buf) {
    var filename = md5(buf) + path.extname(p);
    var realname = path.basename(p);
    writeFile(filename,realname, buf, stats, parentID);
  });
}

function writeFile(filename,realname, buf, stats, parentID) {
  var filepath = path.join('import/',filename);
  var destpath = path.join(dest, filepath);

  fs.writeFile(destpath, buf, function(err) {
    if (err) throw err;
    var mimetype = mime.lookup(filename);
    db.writeFile({
        name: realname,
        createDate: new Date(),
        mimetype: mimetype,
        user_id: user.id,
        group_id: group.id
      }, {
        filepath: filepath,
        size: stats.blksize,
        userid: user.id,
        groupid: group.id
      },
      parentID
    );
  });
}

db.writeFile = function(file, data, parentID) {
  database.file.create([file], function(err, item) {
    if (err) throw err;
    var fileid = item[0].id;

    var version = {
      filepath: data.filepath,
      filename: file.name,
      mimetype: file.mimetype,
      encoding: 'utf8',
      size: data.size,
      createDate: file.createDate,
      updateDate: file.createDate,
      file_id: fileid,
      user_id: data.userid
    };

    var folder = {
      name: file.name,
      parent_id: parentID,
      file_id: fileid,
      type: file.mimetype,
      group_id: data.groupid
    };

    db.writeVersion(version);
    db.writeFolder(folder);

  });
};

db.writeVersion = function(fileversion) {
  database.fileversion.create([fileversion], noop);
};

db.writeFolder = function(folder) {
  database.folder.create(folder, noop);
}



function readDirectory(p, parentID) {
  fs.readdir(p, function(err, value) {
    if (err) throw err;
    for (var i = 0, len = value.length; i < len; i++) {
      var childpath = path.join(p, value[i]);
      readPath(childpath, parentID);
    }
  });
}

getDB(function(err, db) {
  readPath(basepath);
});
