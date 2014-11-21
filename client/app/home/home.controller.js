'use strict';

angular.module('agroupApp')
  .controller('HomeCtrl', ['$scope', 'userAPI',
    function($scope, userAPI) {
      $scope.message = 'Hello';

      userAPI.getMockGroups().success(function(res){
        $scope.collections = res.data;
      });
    }
  ]);
