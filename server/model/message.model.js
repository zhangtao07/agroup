'use strict';

var ago = require('../components/dateformate/ago');
var Q = require("q");
var fs = require("fs");
var config = require("../config/environment");
module.exports = function(orm, db) {
  var Message = db.define("message", {
      id: { type: 'serial', key: true },
      content: String,
      type: String,
      date: {type: 'date', required: true, time: true}
    },
    {
      hooks: {
        beforeCreate: function() {
          if (this.date === null) {
            this.date = new Date();
          }
        }
      },
      methods: {


        getFileContent:function(){

          return {
            type:"file",
            content:{
              "images":this.fileversion.getImages(),
              "filepath":this.fileversion.filepath,
              "filename": this.fileversion.filename,
              "mimetype":this.fileversion.mimetype
            }
          }
        },
        getPlainContent: function() {
          if (this.type != "plain") {
            return false;
          }
          var content = {
            text:this.content
          }
          if(this.link != null){
            content.link = {
              url:this.link.url,
              title:this.link.title,
              icon:this.link.icon,
              description:this.link.description
            }
          }
          return {
            type: "plain",
            content: content
          }
        },
        getMessage: function(merge) {
          if (merge) {
            if (merge.fileversion) {
              this.fileversion = merge.fileversion;
            }

            if (merge.user) {
              this.user = merge.user;
            }
            if (merge.link) {
              this.link = merge.link;
            }
          }


          var contentObj = this.getPlainContent() || this.getFileContent();


          return {
            id: this.id,
            avartar: 'api/user/avatar/' + this.user.id,
            nickname: this.user.name,
            time: ago(this.date),
            content: contentObj.content,
            'type': contentObj.type
          }
        }
      }

    });

  Message.hasOne('fileversion', db.models.fileversion, { required: false, autoFetch: true });

  Message.hasOne('user', db.models.user, { required: true, autoFetch: true });

  Message.hasOne('group', db.models.group, { required: true, autoFetch: true });

  Message.hasOne('link', db.models.link, { autoFetch: true });

}