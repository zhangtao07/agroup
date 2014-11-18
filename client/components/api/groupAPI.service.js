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
