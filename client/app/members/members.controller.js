'use strict';

angular.module('agroupApp')
  .controller('MembersCtrl', [
    '$rootScope',
    '$scope',
    '$stateParams',
    'Modal',
    '$sce',
    'membersAPI',
    function ($rootScope, $scope, $stateParams, Modal, $sce, membersAPI) {
      /*两种路由状态*/
      function memCb(membersData) {
        $scope.members = membersData;
      };

      $scope.$on('groupChanged',function(event,group) {
        /*获取members列表*/
        membersAPI.getMembers(memCb, group);
        membersInvite(group);
      });

      $scope.$on('moduleChanged',function(event,group) {
        /*获取members列表*/
        membersAPI.getMembers(memCb, group);
        membersInvite(group);
      });

      /*邀请新成员*/
      function membersInvite(group) {
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
          membersAPI.getInvitecode(inviteCb, group);

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
            Modal.notification.success('重新生成成功！');
          };
          membersAPI.getNewInvitecode(newinviteCb, group);
        };

        /*复制链接*/
        data.copyUrlDone = function() {
          //此处有个通知 复制成功
          Modal.notification.success("复制成功!");
        };

        /*发送链接到email*/
        data.inviteEmail = function(emailNumbers) {
          membersAPI.sendInviteUrlToEmail(emailNumbers, group, data.inviteUrl);
        };
      };


    }
  ]);
