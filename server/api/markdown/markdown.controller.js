'use strict';

var _ = require('lodash');
var fs = require('fs');
var async = require('async');
var markdown = require("markdown").markdown;


// Get list of markdowns
exports.index = function(req, res) {

  async.waterfall([
    getFileid.bind(req),
    getFile.bind(req),
    getUser.bind(req)
  ], function(err, result) {
    if (err) {
      return res.status(500).send(err);
    } else {
      return res.status(200).json(result);
    }
  });
}

function getFileid(cb) {
  this.models.fileversion.latestFile(function(err,ids){
    cb(null, ids);
  });
}

function getFile(ids, cb) {

  this.models.fileversion.find({
    or: ids
  }, function(err, markdowns) {
    if (err) {
      return cb(err);
    }
    var result = {};
    _.forEach(markdowns, function(d, i) {
      var file = result[d.file_id];
      if (!file) {
        result[d.file_id] = d;
      } else if (file.updateDate < d.updateDate) {
        result[d.file_id] = d;
      }
    });
    var content = [];
    try {
      _.forEach(result, function(d, i) {
        content.push({
          user_id: d.user_id,
          content: markdown.toHTML(fs.readFileSync(d.filepath, 'utf8')),
          updateDate: d.updateDate,
          createDate: d.createDate
        });
      });
      cb(null,content);
    } catch (e) {
      cb(e);
    }
  });
}

function getUser(files, cb) {
  var ids = _.map(files,function(d,i){
    return { id: d.user_id };
  });
  this.models.user.find({or:ids},function(err,user){
    if(err){
      return cb(err)
    }
    var users = {};
    _.forEach(user,function(d,i){
      users[d.id] = d;
    });
    var result = _.map(files,function(f,i){
        f.user = users[f.user_id];
        return f;
    });
    cb(null, result);
  });
}
