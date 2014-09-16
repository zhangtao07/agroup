'use strict';


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
    }
  });

  Fileversion.hasOne('file', db.models.file, { required: true});




}
