'use strict';


module.exports = function(orm, db) {
  var File = db.define('link', {
    id: { type: 'serial', key: true },
    url:String,
    meta:{type:'object'}
  });
  File.hasOne('group', db.models.group, { required: true});
  File.hasOne('user', db.models.user, { required: true});
}

