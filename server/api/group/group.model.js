'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var GroupSchema = new Schema({
  name: String
});

module.exports = mongoose.model('Group', GroupSchema);