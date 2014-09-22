'use strict';

angular.module('agroupApp').directive('msglist', ['$http', 'socket', 'messageAPI',

  function($http, socket, messageAPI) {


    return {
      templateUrl: 'components/message/msglist/msglist.html',
      restrict: 'EA',
      link: function(scope, element, attrs) {
        scope.msglist = [];
        scope.hasMore = false;
        var loadParams;
        scope.loadList = function(groupId,refresh) {
          debugger;

          if (refresh) {
            loadParams = {
              offset: 0,
              datastamp: null
            }
          }
          if(!groupId){
            groupId = loadParams.groupId;
          }else{
            loadParams.groupId = groupId;
          }
          messageAPI.getList(groupId,loadParams.offset, loadParams.datastamp).success(function(res) {
            var data = res.data;
            scope.msglist = scope.msglist.concat(scope.msglist, data.list);
            scope.hasMore = data.hasMore;
            loadParams.datastamp = data.datastamp;
            loadParams.offset++;
          });

        }

        scope.uploadpanel = {}
        attrs.$observe('group', function(group) {
          try {
            group = JSON.parse(group);
          } catch (e) {
            return;
          }




          var groupId = group.id;
          scope.loadList(groupId,true);
          scope.onDrop = function(files) {
            files.forEach(function(file) {
              scope.uploadpanel.addFile(file, function(file, send) {
                var formData = new FormData();
                formData.append('groupId', groupId);
                formData.append('file', file);
                send('api/message/upload', formData);
              });
            });
          }


          socket.joinGroup(groupId, function(data) {

            scope.msglist.unshift(JSON.parse(data));
          });

          messageAPI.getList(groupId, null, 0, 20).

            $http.get('api/message/list?groupId=' + groupId).success(function(data, status) {


//            scope.$apply();
            });
          scope.postText = '';
          scope.onPostMessage = function() {
            $http.post('api/message/post', {
              'groupId': groupId,
              'message': scope.postText,
              'type': 'plain'
            }).success(function(data) {
              /*
               if(data.err == 0){
               scope.msglist.push(data.data);
               }*/

            });
          }
        });
      }
    };
  }]);
