'use strict';

angular.module('agroupApp')
  .controller('MembersCtrl', [
    '$rootScope',
    '$scope',
    '$http',
    '$stateParams',
    'Modal',
    '$sce',
    'membersAPI',
    'groupAPI',
    function ($rootScope, $scope, $http, $stateParams, Modal, $sce, membersAPI, groupAPI) {
      /*获取group信息*/
      var group = $scope.module.group;
      //这里如果封装成directive,就不会有空指针的这个分支
      if(!group){
        group = groupAPI.find($stateParams.name,$scope.collections);
      }

      /*获取members列表*/
      function memCb(membersData) {
        $scope.members = membersData;
      };
      membersAPI.getMembers(memCb, group);

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
          alert('重新生成成功！');
        };
        membersAPI.getNewInvitecode(newinviteCb, group);
      };

      /*复制链接*/
      data.copyUrlDone = function() {
        //此处有个通知 复制成功
        alert('复制成功');
      };

    }
  ]);
