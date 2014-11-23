'use strict';

angular.module('agroupApp').factory('messageAPI', ['apiRoot', '$http',
  function(apiRoot, $http) {
    return {
      getList: function(groupId, timestamp, offset, limit) {
        var params = {
          page: Math.floor(offset / limit) || 0,
          size: limit || 20
        }
        if (timestamp) {
          params.datestamp = timestamp;
        }
        return $http.get(apiRoot + "api/group/" + groupId + "/message/list", {
          params: params
        });
      },
      uploadEnd: function(groupId, fileids) {
        return $http.post(apiRoot + "api/group/"+ groupId +"/message/file", {
          ids: fileids,
          action: 'Create',
          type: 'File'
        });
      },
      delete: function(groupId,messageId) {
        return $http.post(apiRoot + "api/group/" + groupId + "/message/delete", {
          id: messageId
        });
      }
    };
  }
]);
