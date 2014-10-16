'use strict';
var config = require("../config/environment");
var fs = require("fs");
module.exports = function(orm, db) {
   var Filefulltext = db.define('filefulltext', {
    id: { type: 'serial', key: true },
    utf8segments:{type:'text'},
    text:{type:'text'}
  });

  Filefulltext.hasOne('fileversion', db.models.fileversion, { required: true});





}
