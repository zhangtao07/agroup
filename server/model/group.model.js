'use strict';

module.exports = function(orm, db) {
  db.define('group', {
    id: { type: 'serial', key: true },
    name: String
  });
}
