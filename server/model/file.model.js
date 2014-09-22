'use strict';


module.exports = function(orm, db) {
  var File = db.define('file', {
    id: { type: 'serial', key: true },
    name:String,
    group_id:String


  });
  File.hasOne('group', db.models.group, { required: true});
}

