'use strict';

angular.module('agroupApp')
  .directive('commonNav', function () {
    return {
      templateUrl: 'app/block/commonNav/commonNav.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });