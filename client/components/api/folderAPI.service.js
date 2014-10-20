'use strict';

angular.module('agroupApp').factory('folderAPI', ['apiRoot', '$http',
  function(apiRoot, $http) {
    return {
      getFiles: function(groupId, folderId) {
        return $http.get(apiRoot + "api/files/folder/" + groupId + '/' + folderId);
      },
      getMDimage: function(groupId, folder,filepath) {
        var path = [];
        filepath.replace(/[^\/]+\/?/g,function(target,position,source){
          path.push(target);
        });
        var filename = path[path.length-1].replace(/\?.*/,'');
        return $http.post(apiRoot + "api/files/images/" + groupId,{filename:filename});
      }
    };
  }
]);
