'use strict';


module.exports = function(orm, db) {
  db.define("user", {
    id: { type: 'serial', key: true },
    name: String,
    email: String,
    role: { type: 'text', 'size': 20, defaultValue: 'user'}

  });
}