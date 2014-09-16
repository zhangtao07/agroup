'use strict';

angular.module('agroupApp')
  .directive('commonSettings', function () {
    return {
      templateUrl: 'app/block/commonSettings/commonSettings.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });