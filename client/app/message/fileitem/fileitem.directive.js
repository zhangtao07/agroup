'use strict';

angular.module('agroupApp')
  .directive('fileitem', function() {
    return {
      templateUrl: 'app/message/fileitem/fileitem.html',
      restrict: 'EA',
      scope: {
        'data': '=data'
      },
      link: function(scope, element, attrs) {
        console.info(scope.data.thumbnail)
      }
    };
  });