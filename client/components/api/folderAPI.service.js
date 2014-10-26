'use strict';

angular.module('agroupApp').factory('folderAPI', ['apiRoot', '$http','$q',
  function(apiRoot, $http, $q) {
    return {
      getFiles: function(groupId, folderId) {
        return $http.get(apiRoot + "api/files/folder/" + groupId + '/' + folderId);
      },
      getMDimage: function(groupId, folder, filepath) {
        var path = [];
        filepath.replace(/[^\/]+\/?/g, function(target, position, source) {
          path.push(target);
        });
        var filename = path[path.length - 1].replace(/\?.*/, '');
        return $http.post(apiRoot + "api/files/images/" + groupId, {
          filename: filename
        });
      },
      office: {
        embed: function(fv_id) {
          return apiRoot + 'api/files/previewUrl?id=' + fv_id;
        },
        view: function(fv_id) {
          return apiRoot + 'api/files/previewUrl?id=' + fv_id;
        }
      },
      getPreview: function(file, type) {
        return $http.post(apiRoot + 'api/files/preview/' + file.file_id, {
          type: type
        });
      },
      imageGallary: function(files){
        return $q.all(_.map(files,function(file){
          return $http.post(apiRoot + 'api/files/preview/' + file.file_id, { file : file });
        }));
      }
    };
  }
]);
