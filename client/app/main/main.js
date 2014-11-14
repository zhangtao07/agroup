'use strict';

angular.module('agroupApp')
  .config(['$stateProvider',
    function($stateProvider) {
      $stateProvider
        .state('app', {
          url: '',
          abstract: true,
          templateUrl: 'app/main/main.html',
          controller: 'MainCtrl'
        })
    }
  ])
  .directive("fileread", [
    function() {
      return {
        scope: {
          fileread: "="
        },
        link: function(scope, element, attributes) {
          element.bind("change", function(changeEvent) {
            var reader = new FileReader();
            reader.onload = function(loadEvent) {
              scope.$apply(function() {
                scope.fileread = loadEvent.target.result;
              });
            }
            reader.readAsDataURL(changeEvent.target.files[0]);
          });
        }
      }
    }
  ]);
