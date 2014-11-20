'use strict';

angular.module('agroupApp')
  .directive('commonNav', ['$rootScope', 'userAPI',
    function($rootScope, userAPI) {
      return {
        templateUrl: 'app/block/commonNav/commonNav.html',
        restrict: 'EA',
        link: function(scope, element, attrs) {
        }
      };
    }
  ]);
