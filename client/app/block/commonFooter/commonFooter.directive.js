'use strict';

angular.module('agroupApp')
  .directive('commonFooter', function () {
    return {
      templateUrl: 'app/block/commonFooter/commonFooter.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });