'use strict';

angular.module('agroupApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('app.file', {
        url: '/file/{group}',
        templateUrl: 'app/file/file.html',
        controller: 'FileCtrl'
      });
  })
  .directive('stopEvent', function() {
    return {
      restrict: 'A',
      link: function(scope, element, attr) {
        element.bind('click', function(e) {
          e.stopPropagation();
        });
      }
    };
  })
  .filter('fileicon',function(){
    return function(input){
      return input.replace(/\/.*/,'');
    }
  });
