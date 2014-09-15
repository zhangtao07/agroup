'use strict';

var File = require("../../model/file.model.js");

// Get list of images
exports.upload = function(req, res) {
  var id = req.params.id;
  req.models.file.get(id, function(err, file) {
    res.sendFile(file.filepath, {maxAge: 10 * 365 * 24 * 60 * 60, headers: {
      'Content-Type': file.type
    }}, function(err) {
      if (err) {
        console.log(err);
        res.status(err.status).end();
      }
    });
  });
};

exports.avartar = function(req, res) {
  var uid = req.params.id;
  res.sendFile(__dirname + '/photo.jpg', {maxAge: 10 * 365 * 24 * 60 * 60, headers: {
    'Content-Type': 'image/jpeg'
  }}, function(err) {
    if (err) {
      console.log(err);
      res.status(err.status).end();
    }
  });
};


function handleError(res, err) {
  return res.send(500, err);
}