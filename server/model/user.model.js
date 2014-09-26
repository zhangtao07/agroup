'use strict';

var config = require('../config/environment')

module.exports = function(orm, db) {
  db.define("user", {
    id: { type: 'serial', key: true },
    username:String,
    nickname: String,
    email: String,
    role: { type: 'text', 'size': 20, defaultValue: 'user'}
  });
}
