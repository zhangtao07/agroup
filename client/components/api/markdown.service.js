'use strict';

angular.module('agroupApp').factory('markdownAPI', ['apiRoot', '$http',
  function(apiRoot, $http) {
    return {
      getList: function(groupId, pageno, limit) {
        var params = {
          page: pageno,
          size: limit,
          csize: 300
        }
        return $http.get(apiRoot + "api/group/" + groupId + "/markdown/list", {
          params: params
        });
      },
      deleteFile: function(groupId, fileId) {
        return $http.post(apiRoot + 'api/group/' + groupId + '/file/delete', {
          id: fileId
        })
      }
    };
  }
]);
