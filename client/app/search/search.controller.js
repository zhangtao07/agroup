'use strict';

angular.module('agroupApp').controller('SearchCtrl', ['$scope', '$stateParams','$state','$rootScope',function($scope, $stateParams,$state,$rootScope) {

  $scope.keyword = $scope._keyword = $stateParams['keyword'];
  $scope.$emit('searchKeyword', $scope.keyword);
  $scope.searchFileTotal=0;
  $scope.$on('searchFileTotal',function(s,total){
    $scope.searchFileTotal=total;
  });
  $scope.onSearch = function(){
    $state.go('app.search',{
      keyword:$scope.keyword
    })
  }

}]);

