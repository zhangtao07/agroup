'use strict';

angular.module('agroupApp')
  .controller('MarkdownCtrl', function ($scope,$http,$stateParams,$location) {

    function success(data,status){
      $scope.markdowns = data;
    }
    $http.get('/api/markdowns').success(success);

    var group = $stateParams.group;

    function create(){
      //$location.absUrl();
      window.location.href = '/editor/' + group +'/create';
    }
    $scope.create = create;


  });
