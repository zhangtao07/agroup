'use strict';

var _ = require('lodash');
var fs = require('fs');
var dc = require('../../editor/dataCenter.js');
var Q = require('q');
var config = require('../../config/environment')

exports.getConfig = function(req, res) {
  if (req.session.user) {
    return res.json(200, config.op);
  } else {
    return handleError(res, 'login first');
  }
}

exports.preview = function(req, res) {
  var type = req.body.type;
  req.models.fileversion.one({
    file_id: req.params.id
  }, ['updateDate', 'Z'], function(err, file) {
    if (err) {
      return handleError(err);
    }
    var data = {
      err: err,
      id:file.id,
      cover: file && file.getCover(),
      filepath: file && file.getOnlinePath(),
      width: file && file.width,
      height: file && file.height
    };
    if(type === 'text' && file){
        fs.readFile(file.getRealpath(), 'utf8', function(err, content) {
          data.data = content;
          res.json(200,data);
        });
    }else{
      res.json(200,data);
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

    _.each(file, function(d) {
      var cached = dc.getCache(d.file_id);
      if (d.type !== 'folder' && cached) {
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

exports.getFiles = function(req, res) {
  var Folder = req.models.folder;
  Folder.find({
    group_id: req.params.groupid,
    parent_id: req.params.folderid,
    status: 'vision'
  }, function(err, file) {
    if (err) {
      return handleError(res, err);
    }
    _.each(file, function(d) {
      var cached = dc.getCache(d.file_id);
      if (d.type !== 'folder' && cached) {
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
}

exports.getMDimage = function(req, res) {
  //TBD
  var filename = req.body.filename;
  req.models.fileversion.one({
    filename: filename
  }, ['updateDate', 'Z'], function(err, file) {
    if (err) {
      return handleError(err);
    }
    res.json(200, {
      filepath: file ? file.getOnlinePath() : filename,
      width: file ? file.width : 0,
      height: file ? file.height : 0
    });
  });
}

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

    if (file.type !== 'folder') {
      //目录不是真的文件,所以在file表中不存在
      File.get(file.file_id, function(err, file) {
        updateFile(file, updated.name);
        var cached = dc.getCache(file.id);
        if (cached) {
          cached.name = updated.name;
        }
      });
    }

    //console.log(file);
    updated.save(function(err) {
      if (err) {
        return handleError(res, err);
      }
      return res.json(200, file);
    });
  });
};

function updateFile(file, name) {
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
    file.save(function(err) {
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

var filetype = require('../../components/filetype');

exports.previewUrl = function(req, res) {
  var fileversionID = req.query.id;
  var repreviewUrltype = req.query.type || 'view';
  req.models.fileversion.get(fileversionID, function(err, fileversion) {
    var type = filetype(fileversion.mimetype);
    var filepath = fileversion.getOnlinePath();
    var filename = fileversion.filename;
    var redirUrl = "about:blank";
    if (/word|excel|ppt/.test(type)) {
      if(config.op){
        var url = 'http://'+config.hostname+":"+config.port+filepath;
        redirUrl = config.op.server+config.op[repreviewUrltype]+encodeURIComponent(url);
      }else{
        redirUrl = '/pdf?file=' + filepath + '.pdf&download=' + filepath + '?filename=' + filename;
      }

    } else if (type == "pdf") {
      redirUrl = '/pdf?file=' + filepath + '&download=' + filepath + '?filename=' + filename;
    }
    res.redirect(redirUrl);
  });
}

function handleError(res, err) {
  return res.send(500, err);
}
