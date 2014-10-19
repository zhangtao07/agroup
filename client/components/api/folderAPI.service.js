'use strict';

angular.module('agroupApp').factory('folderAPI', ['apiRoot','$http',function(apiRoot,$http) {
  return {
    getFiles: function(groupId,folderId){
      return $http.get(apiRoot+"api/files/folder/" + groupId + '/' + folderId);
    }
  };
}]);
