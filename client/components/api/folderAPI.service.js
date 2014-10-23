'use strict';

angular.module('agroupApp').factory('folderAPI', ['apiRoot', '$http',
  function(apiRoot, $http) {
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
        embed: function(fv_id, width, height) {
          width = width || '100%';
          height = height || '100%';
          return '<iframe src="api/files/previewUrl?id=' + fv_id + '" width="' + width + '" height="' + height + '" frameborder="0" class=area /></iframe>';
        },
        view: function(fv_id) {
          return 'api/files/previewUrl?id=' + fv_id;
        }
      }

    };
  }
]);
