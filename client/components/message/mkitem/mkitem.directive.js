'use strict';

angular.module('agroupApp')
  .directive('mkitem', ['pdf',function (pdf) {
    return {
      templateUrl: 'components/message/mkitem/mkitem.html',
      restrict: 'EA',
      scope: {
        data: '=data',
        group: '=group'
      },
      link: function (scope, element, attrs) {
        scope.onimgclick = function(data) {
          pdf(data.pdf);
        };
      }
    };
  }]);
