'use strict';

var _ = require('lodash');
//var File = require('./file.model');
//

exports.preview = function(req, res) {
  req.models.fileversion.find({
    file_id: req.params.id
  }, ['updateDate', 'Z'], function(err, files) {
    if (err) {
      return handleError(err);
    }
    res.json(200,{
      err: err,
      data:files[0].getOnlinePath(),
      width:files[0].width,
      height:files[0].height
    });
  });
};

// Get list of files
exports.index = function(req, res) {
  var Folder = req.models.folder;
  Folder.find(function(err, files) {
    if (err) {
      return handleError(res, err);
    }
    return res.json(200, files);
  });
};

// Get a single Folder
exports.show = function(req, res) {
  var Folder = req.models.folder;
  Folder.find({
    group_id: req.params.id
  }, function(err, file) {
    if (err) {
      return handleError(res, err);
    }
    if (!file) {
      return res.send(404);
    }
    return res.status(200).json(file);
  });
};

// Creates a new folder in the DB.
exports.create = function(req, res) {
  var Folder = req.models.folder;
  Folder.create(req.body, function(err, folder) {
    if (err) {
      return handleError(res, err);
    }
    return res.json(201, folder);
  });
};

// Updates an existing file in the DB.
exports.update = function(req, res) {
  var Folder = req.models.folder;
  if (req.body.id) {
    delete req.body.id;
  }
  Folder.get(req.params.id, function(err, file) {
    if (err) {
      return handleError(res, err);
    }
    if (!file) {
      return res.send(404);
    }
    var updated = _.merge(file, req.body);
    //console.log(file);
    updated.save(function(err) {
      if (err) {
        return handleError(res, err);
      }
      return res.json(200, file);
    });
  });
};

// Deletes a file from the DB.
exports.destroy = function(req, res) {
  Folder.findById(req.params.id, function(err, file) {
    if (err) {
      return handleError(res, err);
    }
    if (!file) {
      return res.send(404);
    }
    file.remove(function(err) {
      if (err) {
        return handleError(res, err);
      }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
