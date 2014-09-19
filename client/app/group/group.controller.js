'use strict';

angular.module('agroupApp').controller('GroupCtrl',['groupAPI','$stateParams','$scope',function(groupAPI,$stateParams, $scope) {
  var groupName = $stateParams['name'];
  $scope.group = {
    id:1,
    name:2
  }
  groupAPI.getGroupByName(groupName).success(function(res){
    $scope.group = res.data;
  });

}]);
