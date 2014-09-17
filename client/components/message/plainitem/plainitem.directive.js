'use strict';

angular.module('agroupApp')
  .directive('plainitem', function() {
    return {
      templateUrl: 'components/message/plainitem/plainitem.html',
      restrict: 'EA',
      scope: {
        data: '=data'
      },
      link: function(scope, element, attrs) {

      }
    };
  });