'use strict';

angular.module('agroupApp')
  .controller('MembersCtrl', [
    '$scope',
    '$http',
    'membersAPI',
    function ($scope, $http, membersAPI) {
      $scope.members = membersAPI.getMembers();


    }
  ]);
