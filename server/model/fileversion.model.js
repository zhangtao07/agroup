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
    file_id: String,
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
      getRealpath:function(){
        return config.root+this.filepath;
      },
      getImages: function() {
        if (/^image\//.test(this.mimetype)) {
          return [this.filepath];
        }else if(/msword|doc/.test(this.mimetype)){
          var dir = this.getRealpath()+".images/";
          var path = this.filepath+".images/";
          return fs.readdirSync(dir).map(function(filename){
            return path+filename;
          });
        }
      }
    }
  });

  Fileversion.hasOne('file', db.models.file, { required: true});




}
