'use strict';

var _ = require('lodash');
var fs = require('fs');
var markdown = require( "markdown" ).markdown;

// Get list of markdowns
exports.index = function(req, res) {
  req.models.fileversion.find({
    or: [{
      file_id: 1
    }, {
      file_id: 2
    }, {
      file_id: 3
    }]
  }, function(err, markdowns) {
    if (err) {
      return handleError(res, err);
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
          user: d.user_id,
          content: markdown.toHTML(fs.readFileSync(d.filepath,'utf8')),
          updateDate: d.updateDate,
          createDate: d.createDate
        });
      });
      return res.status(200).json(content);
    } catch (e) {
      /* handle error */
      return handleError(res, err);
    }
  });
};


function handleError(res, err) {
  return res.status(500).send(err);
}
