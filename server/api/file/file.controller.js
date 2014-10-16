'use strict';

var _ = require('lodash');
var fs = require('fs');
//var File = require('./file.model');
var marked = require('marked');
var dc = require('../../editor/dataCenter.js');


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

exports.preview = function(req, res) {
  var type = req.body.type;
  console.log(type);
  req.models.fileversion.find({
    file_id: req.params.id
  }, ['updateDate', 'Z'], function(err, files) {
    if (err) {
      return handleError(err);
    }
    var result = '';
    switch (type) {
      case 'markdown':
        result = files[0].getRealpath();
        fs.readFile(files[0].getRealpath(),'utf8',function(err,content){
          res.json(200,{
            err: err,
            data: marked(content),
            width:files[0].width,
            height:files[0].height
          });
        });
        break;
      default:
        result = files[0].getOnlinePath();
        res.json(200,{
          err: err,
          data: result,
          width:files[0].width,
          height:files[0].height
        });
        break;
    }
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
    group_id: req.params.id,
    status: 'vision'
  }, function(err, file) {
    if (err) {
      return handleError(res, err);
    }

    _.each(file,function(d){
      var cached = dc.getCache(d.file_id);
      if(d.type !=='folder' && cached){
        d.name = cached.name;
        //d.content = cached.content;
        d.writers = cached.writers;
      }
    });

    if (!file) {
      return res.send(404);
    }
    return res.status(200).json(file);
  });
};

// Creates a new folder in the DB.
exports.create = function(req, res) {
  var Folder = req.models.folder;
  var user = req.session.user;
  req.body.user_id = user.id;
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
  var File = req.models.file;
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

    File.get(file.file_id,function(err,file){
      updateFile(file,updated.name);
      var cached = dc.getCache(file.id);
      if(cached){
        cached.name = updated.name;
      }
    });

    //console.log(file);
    updated.save(function(err) {
      if (err) {
        return handleError(res, err);
      }
      return res.json(200, file);
    });
  });
};

function updateFile(file,name){
  file.name = name;
  file.save();
}

// Deletes a file from the DB.
exports.destroy = function(req, res) {
  var Folder = req.models.folder;
  Folder.get(req.params.id, function(err, file) {
    if (err) {
      return handleError(res, err);
    }
    if (!file) {
      return res.send(404);
    }
    file.status = 'delete';
    file.save(function(err){
      if (err) {
        return handleError(res, err);
      }
      return res.send(204);
    });
    //file.remove(function(err) {
      //if (err) {
        //return handleError(res, err);
      //}
      //return res.send(204);
    //});
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
