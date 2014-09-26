'use strict';
var config = require("../config/environment");
var fs = require("fs");
module.exports = function(orm, db) {
   var Fileversion = db.define('fileversion', {
    id: { type: 'serial', key: true },
    filepath: String,
    filename: String,
    mimetype: String,
    size: {type: 'number'},
    encoding: String,
    width: {type: 'number'},
    height: {type: 'number'},
    createDate: {type: 'date', time: true},
    updateDate: {type: 'date', time: true}
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
    methods:{
      getOnlinePath:function(){
        return config.upload_dir+'/'+this.filepath;
      },
      getRealpath:function(){
        return config.root+config.upload_dir+'/'+this.filepath;
      },
      getImages: function() {
        if (/^image\//.test(this.mimetype)) {
          return [this.getOnlinePath()];
        }else if(/msword|doc|pdf/.test(this.mimetype)){
          var dir = this.getRealpath()+".images/";
          var path = this.getOnlinePath()+'.images/';
          return fs.readdirSync(dir).map(function(filename){
            return path+filename;
          });
        }
      }
    }
  });

  Fileversion.hasOne('file', db.models.file, { required: true});
  Fileversion.hasOne('user', db.models.user, { required: true});


  Fileversion.latestFile = function(cb){
    //this.aggregate(['file_id']).groupBy('file_id').order('updateDate')
      //.limit(3)
      //.get(cb)
    db.driver.execQuery("SELECT file_id FROM fileversion group by file_id order by updateDate DESC", function (err, data) {
      cb(err,data);
    })
  };


}
