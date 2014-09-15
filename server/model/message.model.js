'use strict';

var ago = require('../components/dateformate/ago');
var Q = require("q");
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
          console.info("hook");
          if (this.date === null) {
            this.date = new Date();
          }
        }
      },
      methods: {
        getImageContent: function() {
          if (!/^image\//.test(this.type)) {
            return false;
          }
          return {
            type: "image",
            content: {
              "thumbnail": "api/image/upload/" + this.file.id + "?updateDate=" + this.file.updateDate.getTime(),
              "filename": this.file.filename
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
            if (merge.file) {
              this.file = merge.file;
            }

            if (merge.user) {
              this.user = merge.user;
            }
          }


          var contentObj = this.getPlainContent() || this.getImageContent();


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

  Message.hasOne('file', db.models.file, { required: false, autoFetch: true });

  Message.hasOne('user', db.models.user, { required: true, autoFetch: true });

  Message.hasOne('group', db.models.group, { required: true, autoFetch: true });

}