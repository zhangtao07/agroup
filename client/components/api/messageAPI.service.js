'use strict';

angular.module('agroupApp').factory('messageAPI', ['apiRoot','$http',function(apiRoot,$http) {
  return {
    getList:function(groupId){
      return $http.get(apiRoot+"api/message/list?groupId="+groupId);
    }
  };
}]);
