'use strict';

angular.module('agroupApp').controller('MessageCtrl', ['messageAPI', '$scope', '$rootScope',
  function(messageAPI, $scope, $rootScope) {
    $scope.loadList = function(group, refresh) {

      var loadParams;
      var groupId = group.id;

      if (refresh) {
        loadParams = {
          limit: 20,
          offset: 0,
          timestamp: null
        }
      }
      messageAPI.getList(groupId, loadParams.timestamp, loadParams.offset, loadParams.limit).success(function(res) {

        var data = res.data;
        data.list.forEach(function(row) {
          $scope.msglist.push(row);
        });
        $scope.hasMore = data.hasMore;
        loadParams.timestamp = data.timestamp;
        loadParams.offset += loadParams.limit;

      });
    }


    $scope.$on('groupChanged',function(event,group) {
      if(!group) return;

      var groupId = group.id;
      $scope.loadList(group, true);
    })
  }
]);
