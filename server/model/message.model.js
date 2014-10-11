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


        getFileContent: function() {
          if (this.type != "file") {
            return false;
          }
          var list = [];
          this.fileversions.forEach(function(fileversion) {
            var content = {
              "cover": fileversion.getCover(),
              "filepath": fileversion.getOnlinePath(),
              "filename": fileversion.filename,
              "mimetype": fileversion.mimetype
            }
            if (/pdf/.test(content.mimetype)) {
              content.pdf = content.filepath;
            }
            if (/ms[-]*word|officedocument/.test(content.mimetype)) {
              content.pdf = content.filepath + ".pdf";
            }
            list.push({
              type: "file",
              content: content
            });
          });
          return list;

        },
        getPlainContent: function() {
          if (this.type != "plain") {
            return false;
          }
          var content = {
            text: this.content
          }
          if (this.link != null) {
            content.link = {
              url: this.link.url,
              title: this.link.title,
              icon: this.link.icon,
              description: this.link.description
            }
          }
          return {
            type: "plain",
            content: content
          }
        },
        getMessage: function(callback) {
          var self = this;
          Q.all([Q.nfcall(this.getUser), Q.nfcall(this.getLink)]).then(function(result) {
            console.info(result);
            var contentObj = self.getPlainContent() || self.getFileContent();
            callback(null,{
              id: this.id,
              avartar: 'api/user/avatar/' + this.user.username,
              nickname: this.user.nickname,
              time: ago(this.date),
              content: contentObj.content,
              'type': contentObj.type
            });

          });
        }
      }

    });

  Message.hasOne('user', db.models.user, { required: true, autoFetch: true });

  Message.hasOne('group', db.models.group, { required: true, autoFetch: true });

  Message.hasOne('link', db.models.link, { autoFetch: true });

}