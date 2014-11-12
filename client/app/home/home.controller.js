'use strict';

angular.module('agroupApp')
  .controller('HomeCtrl', ['$scope', 'userAPI',
    function($scope, userAPI) {
      $scope.message = 'Hello';
      window.scope = $scope;

    }
  ]);
