'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  name: String,
  email: { type: String, lowercase: true },
  role: {
    type: String,
    'default': 'user'
  }
});

module.exports = mongoose.model('users', UserSchema);
