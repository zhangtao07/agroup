'use strict';

var _ = require('lodash');
var fs = require('fs');
var orm = require('orm');
var observe = require('../../components/group.observe');
var Q = require("q");
exports.list = function(req, res) {
  var groupId = req.query.groupId;

  var date = req.query.timestamp ? new Date(parseInt(req.query.timestamp)) : new Date();

  var offset = parseInt(req.query.offset) || 0;

  var limit = parseInt(req.query.limit) || 10;

  function getCount() {
    var result = Q.defer();
    req.models.message.count({
      group_id: groupId,
      date: orm.lte(date)
    }, function(err, count) {
      if (err) {
        result.reject(err);
      } else {
        result.resolve(count);
      }
    })
    return result.promise;
  }

  function getData() {
    var result = Q.defer();
    req.models.message.find({
      group_id: groupId,
      date: orm.lte(date)
    }, { offset: offset }, limit, ['date', 'Z'], function(err, messages) {
      if (err) {
        result.reject(err);
      } else {
        result.resolve(messages);
      }
    });
    return result.promise;
  }

  Q.all([getCount(), getData()]).spread(function(count, messages) {
    var promises = [];
    messages.forEach(function(message) {
      promises.push(Q.nfcall(message.getMessage));
    });
    Q.all(promises).then(function(datas) {
      res.status(200).jsonp({
        err: 0,
        data: {
          list: datas,
          timestamp: date.getTime(),
          hasMore: (offset + limit) < count ? true : false
        }
      });
    }).fail(function(err) {
      console.info(err);
    });


  }, function(err1, err2) {
    console.info(err1, err2);
  });


};

exports.uploadStart = function(req, res) {
  var groupId = req.body.groupId;
  var user = req.session.user;
  Q.nfcall(req.models.message.create, {
    'type': 'file',
    'user_id': user.id,
    'group_id': groupId,
    'date': new Date
  }).then(function(message) {
    res.json({
      err: 0,
      data: message.id
    })
  });
}


var pipe = require('./pipe');
var importFile = require('./import');
exports.upload = function(req, res) {
  var user = req.session.user;


  pipe(req).then(function(result) {

    var fields = result.fields;
    var files = result.files;


    Q.promise(function getFolerId(resolve) {

      if (fields['folderId']) {
        resolve(fields['folderId']);
      } else {
        Q.nfcall(req.models.folder.find, {
          name: '聊天',
          parent_id: 0,
          type: 'folder',
          group_id: fields['groupId']
        }).then(function(folder) {
          if (folder.length > 0) {
            resolve(folder[0].id);
          } else {
            Q.nfcall(req.models.folder.create, {
              name: '聊天',
              parent_id: 0,
              type: 'folder',
              group_id: fields['groupId']
            }).then(function(folder) {
              resolve(folder.id);
            }).fail(function(err) {
              console.info(err);
            });
          }
        });
      }
    }).then(function(folderId) {
      var promies = [];
      files.forEach(function(file) {
        promies.push(importFile(req.models, {
          userId: user.id,
          groupId: fields['groupId'],
          sha1: file.sha1,
          filepath: file.filepath,
          mimetype: file.mimetype,
          filename: file.filename,
          fileSize: file.fileSize,
          encoding: file.encoding,
          messageId: fields['messageId'],
          folderId: folderId
        }));
      });
      Q.all(promies).then(function(result) {
        var fileId = result[0].fv.id;
        var folder = result[0].folder;
        res.json(200, {
          fileId: fileId,
          folder: folder,
          status: "ok"
        });
      });
    });
  });
}

exports.uploadEnd = function(req, res) {

  var groupId = req.body.groupId;
  var user = req.session.user;
  var fileIds = req.body.fileids;

  Q.nfcall(req.models.message.createFileMessage, user.id, groupId, 'create', fileIds.split(',')).then(function(message) {
    observe.messageBroadcast(groupId, message);
    res.jsonp({
      err: 0
    });
  });
};


function getURL(text) {
  return Q.fcall(function() {
    var urlGroup = /(http[s]*:\/\/)*[\w_.]+\.(com|cn|io|cc|gov|org|net|int|edu|mil|jp|kr|us|uk)[\w#!:.?+=&%@!\-\/]*/.exec(text);
    if (urlGroup) {
      var url = urlGroup[0];
      if (!/^http[s]*:\/\//.test(url)) {
        url = "http://" + url;
      }
      return url;
    }
    return null;
  });
}

var Q = require("q");

var request = require('request');
var jsdom = require("jsdom").jsdom;
var Iconv = require('iconv').Iconv;

function getMetaFromUrl(url) {

  return Q.Promise(function(resolve,reject) {

    request({
      url: url,
      encoding: null,
      timeout:5*1000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1985.143 Safari/537.36'
      }
    }, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        try {
          var charset = /charset\s*=\s*(\S+)/.exec(response.headers['content-type'])[1];
          if (charset != "utf-8") {
            var iconv = new Iconv(charset, 'utf-8');
            body = iconv.convert(body).toString("UTF-8")
          }
        } catch (e) {
          body = body.toString();
        }
        var document = jsdom(body);

        var result = {};
        result.title = document.title;
        try {
          result.image = document.querySelector("meta[property='og:image']").getAttribute("content");
        } catch (e) {

        }
        try {
          result.desc = document.querySelector("meta[name='description']").getAttribute("content")
        } catch (e) {

        }
        try {
          result.desc = document.querySelector("meta[name='description']").getAttribute("content")
        } catch (e) {

        }
//        console.info(result);
        resolve(result);

      }else{
        reject();
      }
    })
  });
}

exports.post = function(req, res) {

  var user = req.session.user;

  var groupId = req.body.groupId;

  var message = req.body['message'];

  getURL(message).
    then(function(url) {
      var promise;
      if (url) {
        promise = Q.nfcall(req.models.message.createLinkMessage, user.id, groupId, message, null);
      } else {
        promise = Q.nfcall(req.models.message.createPlainMessage, user.id, groupId, message);
      }
      promise.then(function(msg) {
        if (msg.type == 'link') {

          Q.promise(function getMeta(resolve){
            getMetaFromUrl(url).then(function(meta){
              resolve(meta);
            }).fail(function(){
              resolve(null)
            });
          }).then(function(meta){
            req.models.link.one({
              url:url
            },function(err,link){
              var promise = null;
              if(meta == null){
                meta = {
                  title:url
                }
              }
              if (link) {
                link.url = url;
                link.title = meta.title;
                link.icon = meta.image;
                link.description = meta.description;
                link.group_id = groupId;
                link.user_id = user.id;
                promise = Q.nfcall(link.save);
              } else {
                promise = Q.nfcall(req.models.link.create, {
                  url: url,
                  title: meta.title,
                  icon: meta.image,
                  description: meta.desc,
                  group_id: groupId,
                  user_id: user.id
                });
              }
              promise.then(function(link) {
                Q.nfcall(msg.updateLink, link.id).then(function(msg) {
                  observe.messageBroadcast(groupId, msg);
                });
              });
            });
          });

        }

        observe.messageBroadcast(groupId, msg);
        res.jsonp({
          err: 0
        });
      });
    });
}

