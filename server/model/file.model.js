'use strict';


module.exports = function(orm, db) {
  var File = db.define('file', {
    id: { type: 'serial', key: true },
    name:String,
    createDate: {type: 'date', time: true}
  });
  File.hasOne('user', db.models.user, { required: true});
  File.hasOne('group', db.models.group, { required: true});
}

