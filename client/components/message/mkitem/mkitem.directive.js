'use strict';

angular.module('agroupApp')
  .directive('mkitem', function () {
    return {
      templateUrl: 'components/message/mkitem/mkitem.html',
      restrict: 'EA',
      scope: {
        data: '=data'
      },
      link: function (scope, element, attrs) {

      }
    };
  });