'use strict';





module.exports = function(orm, db) {
  var Link = db.define('link', {
    id: { type: 'serial', key: true },
    url:String,
    title:String,
    icon:String,
    description:String
  });
  Link.hasOne('group', db.models.group, { required: true});
  Link.hasOne('user', db.models.user, { required: true});
}

