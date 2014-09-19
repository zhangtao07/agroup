'use strict';

angular.module('agroupApp').factory('groupAPI', ['$http','apiRoot',function($http,apiRoot) {
  return {
    getGroupByName:function(groupName){
      return $http.get(apiRoot+"api/group/getgroupbyname?name="+groupName);
    }
  };
}]);
