'use strict';

angular.module('agroupApp').factory('membersAPI', ['apiRoot', '$http', 'Modal',
  function(apiRoot, $http, Modal) {
    return {
      /*获取用户列表*/
      getMembers: function(cb, group) {
        $http.post(apiRoot + 'api/group/' + group.id + '/users').success(function(e) {
          if(e.status == 200) {
            cb(e.data.list);
          };
        });
      },
      /*获取邀请链接*/
      getInvitecode: function(cb, group) {
        $http.post(apiRoot + 'api/group/' + group.id + '/invitecode/get').success(function(e) {
          if(e.status == 200) {
            cb(location.host + '/' + group.name + '/invite/' + e.data);
          };
        });
      },
      /*重新生成邀请链接*/
      getNewInvitecode: function(cb, group) {
        $http.post(apiRoot + 'api/group/' + group.id + '/invitecode/generate').success(function(e) {
          if(e.status == 200) {
            cb(location.host + '/' + group.name + '/invite/' + e.data);

          };
        });
      },

      /*通过邮件发送链接*/
      sendInviteUrlToEmail: function(emailNumbers, group, url) {
        var formData = [];
        for(var i = 0; i < emailNumbers.length; i++) {
          formData[i] = "to=" + emailNumbers[i].email + "@baidu.com";
        }
        var eN = emailNumbers.length;
        formData[eN] = "url=http://" + url;
        formData = formData.join('&');

        $http.post(apiRoot + 'api/group/' + group.id + '/inviteMail', formData).success(function(e) {
          if(e.status == 200) {
            Modal.notification.success('邮件发送成功！');
          }else {
            Modal.notification.fail('发送失败，请重试！');
          };
        });

      }
    };
  }
]);
