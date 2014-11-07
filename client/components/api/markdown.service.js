'use strict';

angular.module('agroupApp').factory('markdownAPI', ['apiRoot', '$http',
  function(apiRoot, $http) {
    return {
      getList: function(groupId, offset, limit) {
        var params = {
          page: Math.floor(offset / limit),
          size: limit,
          csize: 300
        }
        return $http.get(apiRoot + "api/group/" + groupId + "/markdown/list", {
          params:params
        });
      }
    };
  }
]);
