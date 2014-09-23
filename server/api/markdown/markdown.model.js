'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var MarkdownSchema = new Schema({
  name: String,
  info: String,
  active: Boolean
});

module.exports = mongoose.model('Markdown', MarkdownSchema);