'use strict';

module.exports = function(orm, db) {
  var Group =  db.define('group', {
    id: { type: 'serial', key: true },
    name: String
  });
}
