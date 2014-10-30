'use strict';

var _ = require('lodash');
var fs = require('fs');
var async = require('async');
var markdown = require("markdown").markdown;
var marked = require('marked');
var ed = require('../../editor/dataCenter');
var orm = require('orm');


marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false,
  highlight: function(code) {
    return require('highlight.js').highlightAuto(code).value;
  }
});

exports.destroy = function(req, res) {
  remove(req, res);
};

function remove(req, res) {
  var fileid = req.params.id;
  var user = req.session.user;
  removeFolder(req.models, fileid, user);
  req.models.file.get(fileid, function(err, file) {
    if (err) {
      res.status(500).send(err);
      return;
    }
    file.status = 'delete';
    file.user_id = user.id;
    file.save();
    res.status(200).send('success');
  });
}

function realRemove(req, res) {
  var id = req.params.id;
  req.models.fileversion.find({
    file_id: id
  }, function(err, fvs) {

    if (err) {
      res.status(500).send(err);
      return;
    }

    _.forEach(fvs, function(d, i) {
      fs.unlink(d.filepath);
      d.remove();
      d.getFile(function(err, file) {
        if (file) {
          file.remove();
        }
      });
    });
    res.status(200).send('success');
  });
}

function removeFolder(models, fileid, user) {
  models.folder.find({
    file_id: fileid,
  }, function(err, folders) {
    _.each(folders, function(folder) {
      folder.status = 'delete';
      folder.user_id = user.id;
      folder.save();
    });
  });
}


// Get list of markdowns
exports.index = function(req, res) {

  var offset = parseInt(req.query.offset) || 0;
  var limit = parseInt(req.query.limit) || 9;
  var group = req.params.group || 1;
  var user = req.session.user;

  req.models.file.find({
      group_id: group,
      mimetype: orm.like('%markdown'),
      or: [{
        status: 'vision'
      },{
        status: 'init'
      }]
    }).order('-createDate').limit(limit).offset(offset)
    .run(function(err, files) {
      if(files.length){
        getFileversion(user, files, res, req.models, group, limit, offset);
      }else{
          return res.status(200).json({
            list: [],
            hasMore: false
          });
      }
    });
}

function getFileversion(user, files, res, models, group, limit, offset) {
  var completeQueue = [],
    count;

  _.each(files, function(file, i) {
    file.getFileversion(function(err, versions) {
      if (err) return errorHandler(res, err);
      var latestVersion = _.max(versions, function(version) {
        return version.createDate;
      });
      latestVersion.get(function data(err, result) {
        if (err) return errorHandler(res, err);
        //当前正在编辑的内容
        var cached = ed.getCache(result.id);
        if (cached) {
          result.filename = cached.name;
          result.content = cached.content;
          result.writers = cached.writers;
        }
        result.content = marked(result.content);
        completeQueue.push(result);
        if (count && completeQueue.length === files.length) {
          return res.status(200).json({
            list: _.sortBy(completeQueue, function(d) {
              return -d.id
            }),
            hasMore: limit + offset < count ? true : false
          });
        }
      });
    });
  });

  models.file.count({
    group_id: group,
    mimetype: 'text/x-markdown',
    or: [{
      status: 'vision'
    },{
      status: 'init'
    }]
  }, function(err, num) {
    if (err) return errorHandler(res, err);
    count = num;
  });
}

function errorHandler(res, err) {
  res.status(500).json(err);
}
