'use strict';

angular.module('agroupApp').factory('folderAPI', ['apiRoot', '$http',
  function(apiRoot, $http) {
    var op;
    $http.post(apiRoot + 'api/files/config').success(function(data){
      op = data;
    });
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
      },
      officePreview: function(filepath,width,height){
        width = width || '100%';
        height = height || '100%';
        var uri= op.server + op.embed + location.origin + filepath;
        return '<iframe src="' + uri + '" width="'+ width +'" height="'+ height +'" frameborder="0" class=area /></iframe>';
      }
    };
  }
]);
