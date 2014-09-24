'use strict';

angular.module('agroupApp')
  .controller('MarkdownCtrl', function ($scope,$http,$stateParams,$location) {

    function success(data,status){
      $scope.markdowns = data;
    }
    $http.get('/api/markdowns').success(success);

    $scope.group = $stateParams.group;

    $scope.remove = function(md){
      $http.delete('/api/markdowns/'+md.id);
      var i = $scope.markdowns.indexOf(md);
      $scope.markdowns.splice(i,1);
    };

  });
