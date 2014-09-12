'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ago = require('../../components/dateformate/ago'),
    User = require('../user/user.model'),
    Group = require("../group/group.model");
    


var MessageSchema = new Schema({
	  content: String,
	  file: {type: mongoose.Schema.Types.ObjectId, ref: 'File'},
	  type:String,
	  date: {type: Date, default: Date.now },
	  user: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
	  group : {type: mongoose.Schema.Types.ObjectId, ref: 'Group'}
});

MessageSchema.methods.getImageContent = function(){

  if(!/^image\//.test(this.type)){
    return false;
  }
  return {
    type:"image",
    content:{
      "thumbnail":"api/image/upload/"+this.file._id+"?updateDate="+this.file.updateDate.getTime(),
      "filename":this.file.filename
    }

  }
}

MessageSchema.methods.getPlainContent = function(){
  if(this.type!="plain"){
    return false;
  }
  return {
    type:"plain",
    content:this.content
  }
}

MessageSchema.methods.getMessage = function(user){
  if(!user){
    user = this.user;
  }

  var contentObj = this.getPlainContent()||this.getImageContent();

  return {
      id:this._id,
      avartar:'api/image/avartar/'+user._id,
      nickname:user.name,
      time:ago(this.date),
      content:contentObj.content,
      'type':contentObj.type
  }
}


module.exports = mongoose.model('Message', MessageSchema);