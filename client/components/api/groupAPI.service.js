'use strict';

angular.module('agroupApp').factory('groupAPI', ['apiRoot','$http',
  function(apiRoot,$http) {
    return {
      find: function(name,collections) {
        var flatArray = [];
        _.each(collections,function(d){
          flatArray = flatArray.concat(d.groups);
        });
        return _.find(flatArray,{name:name});
      },

      createGroup: function(group) {
        return $http.post(apiRoot + 'api/group/create',{
          name: group.name,
          type: group.type,
          icon: group.icon,
          display: group.display
        });
      },

      checkName: function(name) {
        return $http.post(apiRoot + 'api/group/check/display',{
          display: name
        });
      },

      joinGroup: function(groupId){
        return $http.post(apiRoot + 'api/group/' + groupId + '/join');
      },

      quiteGroup: function(groupId){
        return $http.post(apiRoot + 'api/group/' + groupId + '/unjoin');
      },

      collectGroup: function(groupId){
        return $http.post(apiRoot + 'api/group/' + groupId + '/collect');
      },

      cancleCollect: function(groupId){
        return $http.post(apiRoot + 'api/group/' + groupId + '/uncollect');
      }
    };
  }
]);
