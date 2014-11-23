'use strict';

angular.module('agroupApp').controller('MessageCtrl', ['messageAPI', '$scope', 'socket',
  function(messageAPI, $scope, socket) {

    var loadParams = {};
    $scope.msglist = [];

    $scope.loadList = loadList;
    function loadList(group, refresh) {
      if(!group) return;
      $scope.hasMore = false;
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
        $scope.hasMore = data.total > data.page + 1;
        loadParams.timestamp = data.datestamp;
        loadParams.offset += loadParams.limit;
      });

      socket.joinGroup(groupId, function(res) {
        var obj = JSON.parse(res).data;
        var exist = false;
        $scope.msglist.forEach(function(item,i){
          if(item.id == obj.id){
            scope.msglist[i] = obj;
            exist = true;
            return false;
          }
        });
        if(!exist){
          $scope.msglist.unshift(obj);
        }
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
