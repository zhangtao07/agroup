'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var Dimension = new Schema({
  width:Number,
  height:Number
});

var FileSchema = new Schema({
	filepath : String,
	filename : String,
	mimetype : String,
	size : Number,
  encoding : String,
  dimension:[Dimension],
  group:{type: mongoose.Schema.Types.ObjectId, ref: 'Group'},
  createDate: {type: Date, default: Date.now },
  updateDate: {type: Date, default: Date.now }
});


module.exports = mongoose.model('File', FileSchema);
