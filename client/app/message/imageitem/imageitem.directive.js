'use strict';

angular.module('agroupApp')
  .directive('imageitem', function () {
    return {
      templateUrl: 'app/message/imageitem/imageitem.html',
      restrict: 'EA',
      scope:{
        'data':'=data'
      },
      link: function (scope, element, attrs) {
        console.info(scope.data.thumbnail)
      }
    };
  });