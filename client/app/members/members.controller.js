'use strict';

angular.module('agroupApp')
  .controller('MembersCtrl', [
    '$scope',
    '$http',
    'membersAPI',
    'Modal',
    function ($scope, $http, membersAPI, Modal) {

      /*获取members列表*/
      function memCb(membersData) {
        $scope.members = membersData;
      };
      membersAPI.getMembers(memCb);

      /*邀请新成员*/
      var data = {
        inviteUrl: '' //邀请链接
      };
      $scope.addMember = function() {
        /*弹出框*/
        var dialog = Modal.addMember.create;

       /*获取邀请链接*/

        function inviteCb(inviteUrl) {
          data.inviteUrl = inviteUrl;
        };
        membersAPI.getInvitecode(inviteCb);

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

      /*重新生成邀请链接*/
      data.getNewInCode = function() {
        function newinviteCb(inviteUrl) {
          data.inviteUrl = inviteUrl;
        };
        membersAPI.getNewInvitecode(newinviteCb);
      };

      /*复制链接*/
      data.copyUrlDone = function() {
        //此处有个通知 复制成功
      };

    }
  ]);
