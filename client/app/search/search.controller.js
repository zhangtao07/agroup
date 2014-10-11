'use strict';

angular.module('agroupApp').controller('SearchCtrl', function($scope, $stateParams,$state,$rootScope) {

  $scope.keyword = $scope._keyword = $stateParams['keyword'];
  $scope.$emit('searchKeyword', $scope.keyword);
  $scope.onSearch = function(){
    $state.go('app.search',{
      keyword:$scope.keyword
    })
  }

});

