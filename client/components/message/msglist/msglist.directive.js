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

        function uploadFiles(files) {
          var groupId = scope.module.group.id;//loadParams.groupId;
          var fileIds = [];
          files.forEach(function(file) {
            scope.uploadpanel.addFile(file, function(file, send) {
              var formData = new FormData();
              //formData.append('groupId', groupId);
              formData.append('file', file,file.name);
              send('api/group/'+ groupId +'/file/upload', formData);
            }, function(fileId) {
              fileIds.push(fileId);
              checkUploadDone();
            });
          });
          var i = 0;

          function checkUploadDone() {
            i++;
            if (i == files.length) {
              messageAPI.uploadEnd(groupId, fileIds.join(','));
            }
          }

        }


        scope.uploadpanel = {}
        //scope.$watch('group',
        scope.$on('mgroupChanged',function(e,group) {
          if(!group) return;

          var groupId = group.id;
          scope.loadList(group, true);

          scope.onpaste = function() {
            var items = (window.event.clipboardData || window.event.originalEvent.clipboardData).items;
            var files = [];
            if (items) {
              for (var i = 0; i < items.length; i++) {
                var item = items[i];
                var file = item.getAsFile();
                if (!file.name) {
                  file.name = "屏幕截图.jpg";
                }
                files.push(file);
              }
              uploadFiles(files);
            }
          }
          scope.onDrop = function(files) {
            uploadFiles(files);
          };
          scope.onSelectFile = function(element) {

            scope.$apply(function() {
              var list = element.files;
              var files = [];
              for (var i = 0; i < list.length; i++) {
                files.push(list[i]);
              }
              uploadFiles(files);
            });
          }


          socket.joinGroup(groupId, function(res) {
            var obj = JSON.parse(res).data;
            var exist = false;
            scope.msglist.forEach(function(item,i){
              if(item.id == obj.id){
//                debugger;
                scope.msglist[i] = obj;
                exist = true;
                return false;
              }
            });
            if(!exist){
              scope.msglist.unshift(obj);
            }else{
//              scope.$apply();
            }

          });


          scope.postText = '';
          scope.onPostMessage = function() {
            $http.post('api/group/' + groupId + '/message/post', {
              'text': scope.postText,
              'type': 'plain'
            }).success(function(data) {
              scope.postText = "";
//              debugger;
              element.find(".list-container").get(0).scrollTop = 0;
            });
          }
        }
       );
      }
    };
  }]);
