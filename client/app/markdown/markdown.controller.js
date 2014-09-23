'use strict';

angular.module('agroupApp')
  .controller('MarkdownCtrl', function ($scope,$http) {

    function success(data,status){
      $scope.markdowns = data;
    }

    $http.get('/api/markdowns').success(success);

  });
