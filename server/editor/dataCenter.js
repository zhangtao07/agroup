var fs = require('fs');
var path = require('path');
var moment = require('moment');
//var models = require('../model');
var md5 = require('MD5');
var config = require("../config/environment");
var _ = require('lodash');
var observe = require('../components/group.observe');
var mdtool = require('./tool');
var covtool = require('../tools/tool.js');
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
    var broadFilecreate = file.status === 'init';
    createFileversion(file,false,broadFilecreate,client.user);
    updateFile(file,client.user);
    delete cache[file.id];
  }
}

exports.setTitle = function(fileid, filename) {
  //console.log(fileDesc);
  cache[fileid].name = filename;
}

exports.setContent = function(fileid, content) {
  cache[fileid].content = content;
}

exports.getContent = function(fileid, content) {
  return cache[fileid].content || '';
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

function updateFile(file,user){
  getDB(function(err, db) {
    var filename = defaultFileName(user || {nickname:'agroup'});
    db.models.file.get(file.id, function(err, f) {
      //TBD
      if(f.status === 'init'){
        f.status = 'vision';
      }
      f.name = file.name || filename;
      f.user_id = user.id;
      f.save();
    });
    db.models.folder.find({file_id:file.id}, function(err, fds) {
      _.each(fds,function(fd){
        fd.name = file.name || filename;
        fd.user_id = user.id;
        fd.save();
      });
    });
  });
}

/* 创建markdown */
exports.createFile = function(group, user, cb) {
  getDB(function(err, db) {
    var file = db.models.file;
    file.create([{
      name: '',//defaultFileName(user),
      mimetype: 'text/x-markdown',
      createDate: new Date(),
      status: 'init',
      user_id: user.id,
      group_id: group
    }], function(err, files) {
      _.each(files, function(file) {
        cache[file.id] = file;
        createFileversion(file,true);
        createFolder(file,user);
        return cb && cb(err,file.id);
      });
    });
  });
};

function markdownMessage(err,message){
  observe.messageBroadcast(message.group_id,message);
}

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

function createFileversion(file,isinit,broadFilecreate,user) {
  getDB(function(err, db) {
    var filepath = path.join('markdown/', md5(file.content || file.name)) + '.md';
    var fv = {
      filepath: filepath,
      filename: file.name,
      mimetype: 'text/x-markdown',
      size: 0,
      encoding: 'utf8',
      file_id: file.id,
      user_id: file.user_id
    };
    if (file.filepath !== fv.filepath) {
      db.models.fileversion.create(fv, function(err, sfv) {
        if(!isinit){
          if(broadFilecreate && file.name && file.content){
              mdtool.markdown2pdf(file.name,file.content,getFileRealpath(fv.filepath) + '.pdf' ,function(err,pdf){
                covtool.pdfToConver(pdf,300,25, pdf+'.cover.jpg',function(jpg){
                  db.models.message.createMkMessage(user.id,file.group_id,'create',[sfv.file_id],markdownMessage);
                });
              });
          }else{
            //db.models.message.createMkMessage(user.id,file.group_id,'update',[sfv.id],markdownMessage);
          }
        }
        if (err) throw err;
      });
      fs.writeFile(getFileRealpath(fv.filepath), file.content || '', 'utf8',function(){
      });
    }
  });
}

function createFolder(file,user){
  getDB(function(err, db) {
    var defaultFolder = {
      name: '笔记',
      parent_id: 0,
      type: 'folder',
      user_id: user.id,
      group_id: file.group_id
    };
    db.models.folder.find({ name : '笔记' , group_id: file.group_id },function(err,data){
      var defaultFolderCreated = data && data.length;
      if(defaultFolderCreated){
        createSubfile(db,user,file,data[0].id);
      }else{
        db.models.folder.create(defaultFolder,function(err,result){
          createSubfile(db,user,file,result.id);
        });
      }
    });
  });
}

function createSubfile(db,user,file,parent_id){
    var f = {
      name: file.name,
      parent_id: parent_id,
      file_id: file.id,
      type: file.mimetype,
      user_id: user.id,
      group_id:file.group_id
    };
    db.models.folder.create(f, function(err, result) {
      if (err) throw err;
    });
}
