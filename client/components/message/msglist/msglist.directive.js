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

          if (refresh) {
            loadParams = {
              limit:20,
              offset: 0,
              timestamp: null
            }
          }
          if(!groupId){
            groupId = loadParams.groupId;
          }else{
            loadParams.groupId = groupId;
          }
          messageAPI.getList(groupId,loadParams.timestamp,loadParams.offset,loadParams.limit).success(function(res) {

            var data = res.data;
            data.list.forEach(function(row){
              scope.msglist.push(row);
            });
            scope.hasMore = data.hasMore;
            loadParams.timestamp = data.timestamp;
            loadParams.offset+=loadParams.limit;

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

          function sendFile(file){
            scope.uploadpanel.addFile(file, function(file, send) {
              var formData = new FormData();
              formData.append('groupId', groupId);
              formData.append('file', file);
              send('api/message/upload', formData);

            });
          }
          scope.onpaste = function(){
            var items = (event.clipboardData || event.originalEvent.clipboardData).items;
            if(items){
              for(var i = 0;i<items.length;i++){
                var item = items[i];
                var file = item.getAsFile();
                if(!file.name){
                  file.name="未命名文件";
                }
                sendFile(file);
              }

            }
          }
          scope.onDrop = function(files) {
            files.forEach(function(file) {
              sendFile(file);
            });
          };
          scope.onSelectFile = function(element) {

            scope.$apply(function() {
              var files = element.files;
              for(var i = 0;i<files.length;i++){
                sendFile(files[i]);
              }
            });
          }



          socket.joinGroup(groupId, function(data) {

            scope.msglist.unshift(JSON.parse(data));
          });


          scope.postText = '';
          scope.onPostMessage = function() {
            $http.post('api/message/post', {
              'groupId': groupId,
              'message': scope.postText,
              'type': 'plain'
            }).success(function(data) {
              scope.postText = "";


            });
          }
        });
      }
    };
  }]);