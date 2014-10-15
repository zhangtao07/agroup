'use strict';


module.exports = function(orm, db) {
  var Folder = db.define('folder', {
    id: { type: 'serial', key: true },
    name:String,
    parent_id: {type: 'integer', defaultValue:0},
    file_id: {type: 'integer', defaultValue:0},
    type:{type: 'text', defaultValue:'folder'},
    createDate:String,
    status: [ 'vision' ,'hidden', 'removed' ]
  },{
    hooks: {
      beforeCreate: function() {
        if (this.status === null) {
          this.status = 'vision';
        }
        if (this.createDate === null){
          this.createDate = new Date();
        }
      }
    }
  });
  Folder.hasOne('user', db.models.user, { required: true , autoFetch: true });
  Folder.hasOne('group', db.models.group, { required: true, autoFetch: true });
}
