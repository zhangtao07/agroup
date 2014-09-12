'use strict';
/*
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


 module.exports = mongoose.model('File', FileSchema);*/


module.exports = function (orm, db) {
  var File = db.define('file', {
    id : { type: 'serial', key: true },
    filepath:String,
    filename: String,
    mimetype: String,
    size: {type: 'number'},
    encoding:String,
    width: {type: 'number'},
    height: {type: 'number'},
    createDate: {type: 'date', required: true, time: true},
    updateDate: {type: 'date', required: true, time: true}
  },{
    hooks:{
      beforeCreate: function() {
        if(this.createDate === null){
          this.createDate = new Date();
        }
        if(this.updateDate === null){
          this.updateDate = new Date();
        }
      }
    }
  });

  File.hasOne('group', db.models.group, { required: true,  autoFetch: true });


}