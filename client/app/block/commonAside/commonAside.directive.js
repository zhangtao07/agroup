'use strict';

angular.module('agroupApp')
  .directive('commonAside', function () {
    return {
      templateUrl: 'app/block/commonAside/commonAside.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });