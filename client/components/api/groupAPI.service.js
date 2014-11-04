'use strict';

angular.module('agroupApp').factory('groupAPI', ['$http', 'apiRoot', '$q', '$rootScope',
  function($http, apiRoot, $q, $rootScope) {
    return {
      getGroupByName: function(groupName) {
        var deferred = $q.defer();
        deferred.promise.success = function(fn) {
          deferred.promise.then(fn);
          return deferred.promise;
        };
        if ($rootScope.__groups) {
          deferred.resolve({
            data: _($rootScope.__groups).find({
              name: groupName
            })
          });
        } else {
          $rootScope.$on('groupReady', function() {
            deferred.resolve({
              data: _($rootScope.__groups).find({
                name: groupName
              })
            });
          });
        }
        return deferred.promise;
      }
    };
  }
]);
