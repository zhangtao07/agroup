'use strict';

angular.module('agroupApp').controller('GroupCtrl',['groupAPI','$stateParams','$scope',function(groupAPI,$stateParams, $scope) {
  var groupName = $stateParams['name'];

  groupAPI.getGroupByName(groupName).success(function(res){

    $scope.group = res.data;
  });

}]);
