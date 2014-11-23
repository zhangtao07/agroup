'use strict';

angular.module('agroupApp').factory('groupAPI', ['apiRoot','$http',
  function(apiRoot,$http) {


    function dataURItoBlob(dataURI) {
      if(!dataURI) return null;

      // convert base64/URLEncoded data component to raw binary data held in a string
      var byteString;
      if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
      else
        byteString = unescape(dataURI.split(',')[1]);

      // separate out the mime component
      var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

      // write the bytes of the string to a typed array
      var ia = new Uint8Array(byteString.length);
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }

      return new Blob([ia], {type:mimeString});
    }

    function dataTransform(data){
      var d = data.group;
      return {
        id: d.id,
        displayName: d.name,
        type: d.type,
        name: d.display,
        desc: d.description,
        logo: d.icon,
        createdAt: d.createdAt,
        updatedAt: d.updatedAt,
        lastMsg: data.lastMsg
      }
    }


    return {

      format: dataTransform,

      find: function(name) {
        return $http.post(apiRoot + 'api/group/getByDisplay',{display:name});
      },

      createGroup: function(group) {
        var formdata = new FormData();
        formdata.append('name',group.display);
        formdata.append('type',group.type);
        if(group.icon){
          formdata.append('icon',dataURItoBlob(group.icon));
        }
        formdata.append('display',group.name);
        formdata.append('description',group.desc);
        return $http.post(apiRoot + 'api/group/create',formdata,{
          transformRequest: angular.identity,
          headers:{ 'Content-type': undefined }
        });
      },

      modifyGroup: function(group) {
        var formdata = new FormData();
        formdata.append('name',group.display);
        formdata.append('type',group.type);
        if(group.icon){
          formdata.append('icon',dataURItoBlob(group.icon));
        }
        formdata.append('description',group.desc);
        return $http.post(apiRoot + 'api/group/'+group.id+'/modify',formdata,{
          transformRequest: angular.identity,
          headers:{ 'Content-type': undefined }
        });
      },

      checkName: function(name) {
        return $http.post(apiRoot + 'api/group/check/display',{
          display: name
        });
      },

      join: function(groupId){
        return $http.post(apiRoot + 'api/group/' + groupId + '/join');
      },

      quite: function(groupId){
        return $http.post(apiRoot + 'api/group/' + groupId + '/unjoin');
      },

      collect: function(groupId){
        return $http.post(apiRoot + 'api/group/' + groupId + '/collect');
      },

      uncollect: function(groupId){
        return $http.post(apiRoot + 'api/group/' + groupId + '/uncollect');
      }
    };
  }
]);
