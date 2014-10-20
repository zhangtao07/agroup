'use strict';

var request = require('request');
var config = require('../config/environment');
var Q = require('q');
var mkdirp = require('mkdirp');
var fs = require('fs');
var __path = require('path');
exports.addUser = function(req, res, username, email) {
  var User = req.models.user;
  User.one({
    email: email
  }, function(err, user) {
    if (user) {
      req.session.user.id = user.id;
      res.redirect(req.query.url||"/");
    } else {
      Q.promise(function getPath(resolve){
        var path = config.getAvatar(username);
        var dir = __path.dirname(path);
        if(fs.existsSync(path)){
          resolve(path);
        }else{
          mkdirp(dir,function(){
            resolve(path);
          });
        }
      }).then(function(avatarDir){
        Q.Promise(function fetchAvatar(resolve){
          var stream = fs.createWriteStream(avatarDir);
          request({
            url:'http://family.baidu.com:8083/images/userimages/'+username+'.jpg'
          }).pipe(stream).on('finish',function(){
            stream.close();
            resolve();
          });
        })
      }).then(function createUser(){
        var addUser = Q.nfcall(User.create,{
          username:username,
          nickname:username,
          email:email
        });

        var allGroups = Q.nfcall(req.models.group.find,{});
        Q.all([addUser,allGroups]).then(function(result){
          var savedUser = result[0],
              groups = result[1];
          savedUser.addGroups(groups,function(err,data){
            if(err){
              console.info(err);
              return;
            }
            req.session.user.id = savedUser.id;
            res.redirect(req.query.url||"/");
          });
        }).fail(function(err){
          console.info(err);
        });
      })
    }
  });
}
