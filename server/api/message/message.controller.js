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
    var datas = [];
    messages.forEach(function(message) {
      datas.push(message.getMessage());
    });
    console.info(count, offset, limit);
    res.status(200).jsonp({
      err: 0,
      data: {
        list: datas,
        timestamp: date.getTime(),
        hasMore: (offset + limit) < count ? true : false
      }
    });
  }, function(err1, err2) {
    console.info(err1, err2);
  });


};


exports.upload = function(req, res) {
  var user = req.session.user;
  require('./upload')(req).then(function(obj){
    var fields = obj.fields,
        fileversion = obj.fileversion;
    Q.nfcall(req.models.message.create,{
      'fileversion_id': fileversion.id,
      'type': fileversion.mimetype,
      'user_id': user.id,
      'group_id': fields.groupId,
      'date': new Date
    }).then(function(msg){
      var data = msg.getMessage({
        fileversion: fileversion,
        user: user
      });
      observe.groupBroadcast(fields.groupId, data);
      //res.writeHead(200, {
        //'Connection': 'close'
      //});
      res.json(200,{
        status: "ok",
        file: data
      });
    });
  });

}


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

  return Q.Promise(function(resolve) {

    request({
      url: url,
      encoding: null,
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
      return Q.Promise(function(resolve, reject) {

        if (!url) {
          resolve(null);
          return;
        }

        Q.Promise(function(resolve) {
          req.models.link.one({
            url: url
          }, function(err, link) {
            if (err) {
              console.info(err);
              throw new Error(err);
            } else {
              resolve(link);
            }
          });
        }).then(function(link) {
          if (link) {
            resolve(link);
          } else {
            getMetaFromUrl(url).then(function(meta) {
              req.models.link.create({
                url: url,
                title: meta.title,
                icon: meta.image,
                description: meta.desc,
                group_id: groupId,
                user_id: user.id
              }, function(err, link) {
                if (err) {
                  console.info(err);
                  throw new Error(err);
                } else {
                  resolve(link);
                }
              })
            })
          }
        });
      });
    }).then(function(link) {
      return Q.Promise(function(resolve, reject) {
        var obj = {
          'content': message,
          'type': req.body['type'],
          'user_id': user.id,
          'group_id': groupId,
          'date': new Date
        }
        if (link) {
          obj.link_id = link.id;
        }
        req.models.message.create(obj, function(err, message) {
          if (err) {
            console.info(err);
            throw new Error(err);
          } else {
            resolve({
              message:message,
              link:link
            });
          }
        });
      });
    }).then(function(result,link) {
      var data = result.message.getMessage({
        user: user,
        link:result.link
      });
      observe.groupBroadcast(groupId, data);
      return res.jsonp({
        err: 0
      });
    }).fin(function() {
      console.info(JSON.parse(arguments));
    });
}

