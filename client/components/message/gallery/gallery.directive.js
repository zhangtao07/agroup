'use strict';

angular.module('agroupApp')
  .directive('gallery', function () {
    return {
      templateUrl: 'components/message/gallery/gallery.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });