'use strict';

angular.module('agroupApp').factory('membersAPI', ['apiRoot', '$q', '$http',
  function(apiRoot, $q,$http) {
    return {
      getMembers: function() {
        //retrun $http.post(apiRoot + '/api/' + '/');
        //api members
        var members = [{
          nickname: 'jalon',
          realname: '王知良',
          avatar: 'http://fe.baidu.com/~nwind/angulr/img/a2.jpg',
          email: '8888@baidu.com',
          online: true
        }, {
          nickname: 'kkk',
          realname: '王大力',
          avatar: 'http://fe.baidu.com/~nwind/angulr/img/a2.jpg',
          email: '6869865@baidu.com',
          online: false
        }];
        return members;
      }
    };
  }
]);
