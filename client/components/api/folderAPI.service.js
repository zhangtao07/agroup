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
      },
      officePreview: function(filepath,width,height){
        width = width || '100%';
        height = height || '100%';
        var fakeDomain = 'http://zn.com';
        var server = 'http://172.22.65.38/op/embed.aspx?src=';
        //var uri= location.origin + filepath;
        var uri= fakeDomain + ':' + location.port + filepath;
        return '<iframe src=' + server + uri + ' width="'+ width +'" height="'+ height +'" frameborder="0" class=area /></iframe>';
      }
    };
  }
]);
