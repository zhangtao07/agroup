'use strict';

angular.module('agroupApp')
  .controller('InviteCtrl', [
    '$rootScope',
    '$scope',
    '$state',
    '$stateParams',
    'apiRoot',
    '$http',
    function ($rootScope, $scope, $state, $stateParams, apiRoot, $http) {
      $http.post(apiRoot + 'api/invitecode/' + $stateParams.code).success(function(e) {
        if(e.status == 200) {
          $scope.inviteTipShow = false;
          setTimeout(function() {
            $state.go('app.message',{ name : $stateParams.name });
          }, 3000);
        }else {
          $scope.inviteTipShow = true;
        };
      });
    }
  ]);
