'use strict';

angular.module('agroupApp')
  .directive('commonHeader', function () {
    return {
      templateUrl: 'app/block/commonHeader/commonHeader.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });