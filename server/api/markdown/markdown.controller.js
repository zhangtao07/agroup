'use strict';

var _ = require('lodash');
var fs = require('fs');
var async = require('async');
var markdown = require("markdown").markdown;
var marked = require('marked');

marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false,
  highlight: function (code) {
    return require('highlight.js').highlightAuto(code).value;
  }
});

exports.destroy = function(req, res){
  var id = req.params.id;
  req.models.fileversion.find({file_id:id},function(err,fvs){

    if(err){
      res.status(500).send(err);
      return;
    }

    _.forEach(fvs,function(d,i){
      fs.unlink(d.filepath);
      d.remove();
      d.getFile(function(err,file){
        if(file){
          file.remove();
        }
      });
    });
    res.status(200).send('success');
  });
};


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
  var group = this.params.group || 1;
  this.models.fileversion.latestFile(group,function(err,ids){
    console.log(ids);
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
          id: d.file_id,
          user_id: d.user_id,
          content: marked(fs.readFileSync(d.filepath, 'utf8')),
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
