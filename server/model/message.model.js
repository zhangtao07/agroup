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
      date: {type: 'date', required: true, time: true},
      status: [ 'vision' ,'hidden', 'removed' ]
    },
    {
      hooks: {
        beforeCreate: function() {
          if (this.status === null) {
            this.status = 'vision';
          }
          if (this.date === null) {
            this.date = new Date();
          }
        }
      },
      methods: {
        getFilesMessage:function(fileIds,callback){
          var list = [];
          var promiseFileversions = [];
          fileIds.forEach(function(fileId) {
            promiseFileversions.push(Q.promise(function(resovle) {
              Q.nfcall(db.models.file.get, fileId).then(function(file) {
                Q.nfcall(db.models.fileversion.find, {
                  file_id: file.id
                }, 1, ['createDate', 'Z']).then(function(rs) {
                  var fileversion = null;
                  if (rs.length > 0) {
                    fileversion = rs[0];
                  }
                  resovle(fileversion);
                })
              })
            }));
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

            callback(null, list);
          });
        },
        getMkContent: function(callback) {
          if (this.type != "mk") {
            callback(null, false);
            return;
          }
          var obj = JSON.parse(this.content);
          Q.nfcall(this.getFilesMessage,obj.fileIds).then(function(list){
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
            return;
          }
          var obj = JSON.parse(this.content);
          Q.nfcall(this.getFilesMessage,obj.fileIds).then(function(list){
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
            return;
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
            return;
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
              'type': contentObj.type,
              user_id: self.user.id,
              status:self.status
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

  Message.getList = function(groupId, date, offset, limit, callback) {


    var getCount = Q.nfcall(db.models.message.count, {
      group_id: groupId,
      date: orm.lte(date),
      status:'vision'
    });
    var getData = Q.nfcall(db.models.message.find, {
      group_id: groupId,
      date: orm.lte(date),
      status:'vision'
    }, { offset: offset }, limit, ['date', 'Z'])
    Q.all([getCount, getData]).then(function(result) {
      callback(null,{
        count: result[0],
        list: result[1]
      })
    }).fail(function(err){
      console.info(err);
    });


  }

  Message.deleteMessage = function(messageId, userId, callback) {
    db.models.message.one({
      id: messageId,
      user_id: userId
    }, function(err, msg) {
      if (msg) {
        msg.status = 'removed';
        var updateFilePromise = Q.promise(function(resovle,reject){
          db.driver.execQuery('update file t1 join fileversion t2 on t1.id = t2.file_id and t1.id="' + msg.fileversion_id + '" and t1.user_id=' + userId + '  set t1.`status` = "removed"',function(err,data){
            if(err){
              console.info(err);
              reject(err);
            }else{
              resovle();
            }


          });
        });
        var updateMessageProimise = Q.nfcall(msg.save);
        Q.all([updateFilePromise,updateMessageProimise])
          .then(function(results) {
            callback(null, results[1]);
          }).fail(function(err){
            console.info(err);
          });
      }
    });
  }

}