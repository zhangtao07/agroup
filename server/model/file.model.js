'use strict';


module.exports = function(orm, db) {
  var File = db.define('file', {
    id: { type: 'serial', key: true },
    name:String


  });
  File.hasOne('group', db.models.group, { required: true});
}

