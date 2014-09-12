'use strict';

angular.module('agroupApp')
  .controller('MainCtrl', function ($scope, $http, socket) {
    $scope.watchGroups = [
      'FEX',
      'FIS',
      'END',
      'fcube',
      'agroup'
    ];

    $scope.$on('$destroy', function () {

    });
  });
