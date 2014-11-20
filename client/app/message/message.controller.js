'use strict';

angular.module('agroupApp').controller('MessageCtrl', ['messageAPI', '$scope', '$rootScope',
  function(messageAPI, $scope, $rootScope) {
    function loadList(group, refresh) {

      if(!group) return;

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
      loadList(group, true);
    });

    $scope.$on('moduleChanged',function(event,group) {
      loadList(group, true);
    });
  }
]);
