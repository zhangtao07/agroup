'use strict';

angular.module('agroupApp').factory('userAPI', ['apiRoot','$http',function(apiRoot,$http) {
  return {
    getMe:function(){
      return $http.get(apiRoot+"api/user/me");
    }
  };
}]);
