'use strict';

angular.module('agroupApp').factory('authHttpResponseInterceptor',['$q','$location',function($q,$location){
  return {
    response: function(response){


      return response || $q.when(response);
    },
    responseError: function(rejection) {
      if (rejection.status === 401) {
        debugger;
        console.log("Response Error 401",rejection);
        location.href ='/auth/login?url='+location.href;
      }
      return $q.reject(rejection);
    }
  }
}])
