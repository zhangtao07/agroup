'use strict';

angular.module('agroupApp').factory('folderAPI', ['apiRoot', '$http','$q',
  function(apiRoot, $http, $q) {
    return {
      deleteFile: function(group,fileId){
        return $http.post(apiRoot + "api/group/" + group.id + "/file/delete",{ id: fileId });
      },
      deleteFolder: function(group,folderId){
        return $http.post(apiRoot + "api/group/" + group.id + "/folder/delete",{ id: folderId });
      },
      fileRename: function(group,fileId,name){
        return $http.post(apiRoot + "api/group/" + group.id + "/file/rename",{ id: fileId , name : name });
      },
      folderRename: function(group,folderId,name){
        return $http.post(apiRoot + "api/group/" + group.id + "/folder/rename",{ id: folderId , name : name });
      },
      createFolder: function(group,pid,name){
        console.log(pid);
        console.log(name);
        debugger;
        return $http.post(apiRoot + "api/group/" + group.id + "/folder/create",{ pid: pid , name: name });
      },
      getFiles: function(groupId, folderId) {
        return $http.get(apiRoot + "api/group/" + groupId + "/folder/get" ,{ params : { pid: folderId || 0}});
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
      getPreview: function(groupId,file, type) {
        return $http.post(apiRoot + 'api/group/' + groupId +'/file/preview/' + file.id, {
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
