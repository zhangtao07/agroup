'use strict';

angular.module('agroupApp').factory('authHttpResponseInterceptor', ['$q', '$window', function($q, $window) {
  return {
    response: function(response) {


      return response || $q.when(response);
    },
    responseError: function(rejection) {

      console.log("Response Error 401", rejection);
      if (!/\/signin/.test(location.href)) {
        $window.location.href = 'signin';
      }


      return $q.reject(rejection);
    }
  }
}])
