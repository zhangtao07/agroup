'use strict';

angular.module('agroupApp').factory('membersAPI', ['apiRoot', '$q', '$http',
  function(apiRoot, $q,$http) {
    return {
      getMembers: function(cb) {
        $http.post(apiRoot + 'api/group/1/users').success(function(e) {
          if(e.status == 200) {
            cb(e.data.list);
          };
        });
      },
      getInvitecode: function(cb) {
        $http.post(apiRoot + 'api/group/1/invitecode/get').success(function(e) {
          if(e.status == 200) {
            cb('http://agroup.baidu.com/gotoinvite/' + e.data);
          };
        });
      },

      getNewInvitecode: function(cb) {
        $http.post(apiRoot + 'api/group/1/invitecode/generate').success(function(e) {
          if(e.status == 200) {
            cb('http://agroup.baidu.com/gotoinvite/' + e.data);

          };
        });
      }
    };
  }
]);
