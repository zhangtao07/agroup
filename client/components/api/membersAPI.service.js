'use strict';

angular.module('agroupApp').factory('membersAPI', ['apiRoot', '$http',
  function(apiRoot, $http) {
    return {
      getMembers: function(cb, group) {
        $http.post(apiRoot + 'api/group/' + group.id + '/users').success(function(e) {
          if(e.status == 200) {
            cb(e.data.list);
          };
        });
      },
      getInvitecode: function(cb, group) {
        $http.post(apiRoot + 'api/group/' + group.id + '/invitecode/get').success(function(e) {
          if(e.status == 200) {
            cb('http://agroup.baidu.com/' + group.name + '/invite/' + e.data);
          };
        });
      },

      getNewInvitecode: function(cb, group) {
        $http.post(apiRoot + 'api/group/' + group.id + '/invitecode/generate').success(function(e) {
          if(e.status == 200) {
            cb('http://agroup.baidu.com/' + group.name + '/invite/' + e.data);

          };
        });
      }
    };
  }
]);
