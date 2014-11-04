'use strict';

angular.module('agroupApp').controller('GroupCtrl',['groupAPI','$stateParams','$scope','$rootScope',function(groupAPI,$stateParams, $scope,$rootScope) {

  var groupName = $stateParams['name'];

  groupAPI.getGroupByName(groupName).success(function(res){

    $scope.group = res.data;
    $rootScope.__currentGroupId = res.data.id;
    $rootScope.__currentGroupName = res.data.name;
  });

}]);
