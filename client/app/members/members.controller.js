'use strict';

angular.module('agroupApp')
  .controller('MembersCtrl', [
    '$scope',
    '$http',
    'membersAPI',
    'Modal',
    function ($scope, $http, membersAPI, Modal) {

      $scope.members = membersAPI.getMembers();

      $scope.addMember = function() {
        var dialog = Modal.addMember.create;

        var data = {
          inviteUrl: 'http://agroup.baidu.com/invite?asdasdasdasdas'
        };

        dialog(function ok() {
          //success

        })({
          data: data,
          title: '邀请新成员',
          //size: 'lg',
          templateUrl: 'app/members/addmember.html',
          style: 'modal-primary'
        });
      };

    }
  ]);
