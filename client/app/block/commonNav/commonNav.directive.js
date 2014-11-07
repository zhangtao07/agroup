'use strict';

angular.module('agroupApp')
  .directive('commonNav', ['$rootScope', 'userAPI',
    function($rootScope, userAPI) {
      return {
        templateUrl: 'app/block/commonNav/commonNav.html',
        restrict: 'EA',
        link: function(scope, element, attrs) {
          scope.groups = [];
          userAPI.getGroups().success(function(res) {
            var groups = res.data;
            $rootScope.__groups = groups;
            //for deep link navgation
            $rootScope.$broadcast('groupReady', groups);
            groups.forEach(function(group) {
              scope.groups.push(group);
            });
          });
        }
      };
    }
  ]);
