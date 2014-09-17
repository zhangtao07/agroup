'use strict';

var File = require("../../model/file.model.js");
var config =require("../../config/environment");
// Get list of images
exports.upload = function(req, res) {
  var id = req.params.id;
  req.models.fileversion.get(id, function(err, file) {
    res.sendFile(config.root+ file.filepath, {maxAge: 10 * 365 * 24 * 60 * 60, headers: {
      'Content-Type': file.type
    }}, function(err) {
      if (err) {
        console.log(err);
        res.status(err.status).end();
      }
    });
  });
};



function handleError(res, err) {
  return res.send(500, err);
}