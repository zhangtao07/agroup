'use strict';

module.exports = function (orm, db) {
   db.define("group", {
    id : { type: 'integer', key: true },
    name:String
  });
}
