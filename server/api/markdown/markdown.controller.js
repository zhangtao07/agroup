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
  highlight: function(code) {
    return require('highlight.js').highlightAuto(code).value;
  }
});

exports.destroy = function(req, res) {
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
};


// Get list of markdowns
exports.index = function(req, res) {

  var offset = parseInt(req.query.offset) || 0;
  var limit = parseInt(req.query.limit) || 9;

  var group = req.params.group || 1;
  var user = req.session.user;

  req.models.file.find({
      group_id: group,
      mimetype: 'text/x-markdown'
    }).order('-createDate').limit(limit).offset(offset)
    .run(function(err, files) {
      getFileversion(user, files, res);
    });
}


function getFileversion(user, files, res) {
  var completeQueue = [];
  _.each(files, function(file, i) {
    file.getFileversion(function(err, versions) {
      var latestVersion = _.max(versions, function(version) {
        return version.createDate;
      });
      latestVersion.get(user, function data(err, result) {
        result.content = marked(result.content);
        completeQueue.push(result);

        if (completeQueue.length === files.length) {
          return res.status(200).json(completeQueue);
        }
      });
    });
  });
}
