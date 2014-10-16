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

        getMkContent: function(callback) {
          if (this.type != "mk") {
            callback(null, false);
          }
          var obj = JSON.parse(this.content);
          var list = [];
//          var list = obj.list;
          var promiseFileversions = [];
          obj.fileIds.forEach(function(fileversionId) {
            promiseFileversions.push(Q.nfcall(db.models.fileversion.get, fileversionId));

          });

          Q.all(promiseFileversions).then(function(fileversions) {
            fileversions.forEach(function(fileversion) {
              if (fileversion) {
                var content = {
                  "fileid": fileversion.id,
                  "filepath": fileversion.getOnlinePath(),
                  "filename": fileversion.filename
                }
                list.push(content);
              }
            });

            callback(null, {
              type: "mk",
              content: {
                action: obj.action,
                list: list
              }
            });
          });
        },

        getFileContent: function(callback) {
          if (this.type != "file") {
            callback(null, false);
          }
          var obj = JSON.parse(this.content);
          var list = [];
//          var list = obj.list;
          var promiseFileversions = [];
          obj.fileIds.forEach(function(fileversionId) {
            promiseFileversions.push(Q.nfcall(db.models.fileversion.get, fileversionId));

          });

          Q.all(promiseFileversions).then(function(fileversions) {
            fileversions.forEach(function(fileversion) {
              if (fileversion) {
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
                list.push(content);
              }
            });

            callback(null, {
              type: "file",
              content: {
                action: obj.action,
                list: list
              }
            });
          });

        },
        getLinkContent: function(callback) {
          if (this.type != "link") {
            callback(null, false);
          }

          var obj = JSON.parse(this.content);

          Q.promise(function getLink(resolve) {

            var link_id = obj.link_id;
            if (link_id) {
              Q.nfcall(db.models.link.get, link_id).then(function(link) {
                if (link) {
                  resolve(link);
                } else {
                  resolve(null);
                }
              });
            } else {
              resolve(null);
            }

          }).then(function(link) {
            var res = {
              type: 'link',
              content: {
                content: obj.content
              }
            };
            if (link) {
              res.content.link = {
                url: link.url,
                title: link.title,
                icon: link.icon,
                description: link.description
              }
            } else {
              res.content.link = null;
            }
            callback(null, res);
          });

        },
        getPlainContent: function(callback) {
          if (this.type != "plain") {
            callback(null, false);
          }

          callback(null, {
            type: "plain",
            content: this.content
          });
        },
        getMessage: function(callback) {
          var self = this;
          Q.all([Q.nfcall(this.getUser), Q.nfcall(this.getFileContent), Q.nfcall(this.getLinkContent), Q.nfcall(this.getPlainContent), Q.nfcall(this.getMkContent)]).then(function(result) {
            var user = result[0];
            var contentObj = result[1] || result[2] || result[3] || result[4];
            callback(null, {
              id: self.id,
              avartar: 'api/user/avatar/' + self.user.username,
              nickname: self.user.nickname,
              time: ago(self.date),
              content: contentObj.content,
              'type': contentObj.type
            });

          });
        },
        updateLink: function(linkId, callback) {
          var obj = JSON.parse(this.content);
          obj.link_id = linkId;
          this.content = JSON.stringify(obj);
          this.save(function(err, msg) {
            callback(err, msg);
          });

        }
      }

    });

  Message.hasOne('user', db.models.user, { required: true, autoFetch: true });

  Message.hasOne('group', db.models.group, { required: true, autoFetch: true });

  /**
   *
   * @param {String} userId
   * @param {String} groupId
   * @param {String} action
   * @param {Array} files
   */

  function createFileMessage(userId, groupId, action, type, fileIds, callback) {
    db.models.message.create({
      user_id: userId,
      group_id: groupId,
      type: type,
      date: new Date,
      content: JSON.stringify({
        action: action,
        fileIds: fileIds
      })
    }, function(err, message) {
      if (err) {
        console.info(err);
        callback(err);
      } else {
        callback(null, message);
      }
    })

  }

  Message.createFileMessage = function(userId, groupId, action, fileIds, callback) {
    createFileMessage(userId, groupId, action, 'file', fileIds, callback)
  }

  Message.createMkMessage = function(userId, groupId, action, fileIds, callback) {
    createFileMessage(userId, groupId, action, 'mk', fileIds, callback)
  }

  Message.createLinkMessage = function(userId, groupId, content, linkId, callback) {
    db.models.message.create({
      user_id: userId,
      group_id: groupId,
      type: 'link',
      date: new Date,
      content: JSON.stringify({
        link_id: linkId,
        content: content
      })
    }, function(err, message) {
      if (err) {
        console.info(err);
        callback(err);
      } else {
        callback(null, message);
      }
    })
  }


  Message.createPlainMessage = function(userId, groupId, content, callback) {
    db.models.message.create({
      user_id: userId,
      group_id: groupId,
      type: 'plain',
      date: new Date,
      content: content
    }, function(err, message) {
      if (err) {
        console.info(err);
        callback(err);
      } else {
        callback(null, message);
      }
    })
  }

}