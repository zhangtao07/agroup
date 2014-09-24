'use strict';

angular.module('agroupApp')
  .controller('MarkdownCtrl', function ($scope,$http,$stateParams,$location) {

    function success(data,status){
      $scope.markdowns = data;
    }
    $http.get('/api/markdowns').success(success);

    $scope.group = $stateParams.group;

  });
