'use strict';
var config = require("../config/environment");
var fs = require("fs");
var ago = require('../components/dateformate/ago');
var filetype = require('../components/filetype');
module.exports = function(orm, db) {
  var Fileversion = db.define('fileversion', {
    id: {
      type: 'serial',
      key: true
    },
    filepath: String,
    filename: String,
    mimetype: String,
    size: {
      type: 'number'
    },
    encoding: String,
    width: {
      type: 'number'
    },
    height: {
      type: 'number'
    },
    createDate: {
      type: 'date',
      time: true
    },
    updateDate: {
      type: 'date',
      time: true
    }
  }, {
    hooks: {
      beforeCreate: function() {
        if (this.createDate === null) {
          this.createDate = new Date();
        }
        if (this.updateDate === null) {
          this.updateDate = new Date();
        }
      }
    },
    methods: {
      getOnlinePath: function() {
        return config.upload_dir + '/' + this.filepath;
      },
      getRealpath: function() {
        return config.root + config.upload_dir + '/' + this.filepath;
      },
      getCover:function(){
        var type = filetype(this.mimetype,this.filename);

        if (type == 'image') {
          return this.getOnlinePath();
        }else if(/pdf|html5video/.test(type)){
          return this.getOnlinePath()+".cover.jpg";
        }else if(/word|excel|ppt/.test(type)){
          return this.getOnlinePath()+".pdf.cover.jpg";
        }

      },
      getImages: function() {
        if (/^image\//.test(this.mimetype)) {
          return [this.getOnlinePath()];
        } else if (/msword|doc|pdf/.test(this.mimetype)) {
          var dir = this.getRealpath() + ".images/";
          var path = this.getOnlinePath() + '.images/';
          return fs.readdirSync(dir).map(function(filename) {
            return path + filename;
          });
        }
      },
      get: function(user,cb) {
        var self = this;
        var result = {
          id: self.file_id,
          filename: self.filename,
          user: {
            avatar: '/api/user/avatar/' + user.username,
            nickname: user.nickname,
          },
          time: ago(self.updateDate),
          content: ''
        }

        self.getFile(function(err,file){
          result.filename = file.name;
        });

        fs.readFile(this.getRealpath(), 'utf8', function(err, content) {
          result.content = content;
          cb(err,result);
        });
      }
    }
  });

  Fileversion.hasOne('file', db.models.file, {
    required: true,
    autoFetch: true,
    reverse: 'fileversion'
  });
  Fileversion.hasOne('user', db.models.user, {
    required: true,
    autoFetch: true,
    reverse: 'fileversion'
  });


  Fileversion.latestFile = function(gid, cb) {
    //this.aggregate(['file_id']).groupBy('file_id').order('updateDate')
    //.limit(3)
    //.get(cb)
    var sql = 'SELECT fileversion.file_id FROM fileversion,file WHERE fileversion.file_id = file.id AND fileversion.mimetype = "text/x-markdown" AND file.group_id =' + gid + '  GROUP BY fileversion.file_id ORDER BY updateDate DESC';

    db.driver.execQuery(sql, function(err, data) {
      cb(err, data);
    })
  };


}
