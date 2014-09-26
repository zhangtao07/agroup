'use strict';


module.exports = function(orm, db) {
  var Folder = db.define('folder', {
    id: { type: 'serial', key: true },
    name:String,
    parent_id: {type: 'integer', defaultValue:0}
  });
  Folder.hasOne('group', db.models.group, { required: true});
}