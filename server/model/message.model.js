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
              "filename": this.fileversion.filename
            }
          }
        },
        getPlainContent: function() {
          if (this.type != "plain") {
            return false;
          }
          return {
            type: "plain",
            content: this.content
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
          }


          var contentObj = this.getPlainContent() || this.getFileContent();


          return {
            id: this._id,
            avartar: 'api/image/avartar/' + this.user.id,
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

}