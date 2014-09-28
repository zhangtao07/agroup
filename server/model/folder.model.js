'use strict';


module.exports = function(orm, db) {
  var Folder = db.define('folder', {
    id: { type: 'serial', key: true },
    name:String,
    parent_id: {type: 'integer', defaultValue:0},
    file_id: {type: 'integer', defaultValue:0},
    type:{type: 'text', defaultValue:'folder'}

  });
  Folder.hasOne('group', db.models.group, { required: true});
}
