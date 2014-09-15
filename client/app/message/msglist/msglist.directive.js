'use strict';

angular.module('agroupApp').directive('msglist', ['$http', 'socket',
  function($http, socket) {

    return {
      templateUrl: 'app/message/msglist/msglist.html',
      restrict: 'EA',

      link: function(scope, element, attrs) {

        var dropZone = element.get(0);


        $http.get('api/group/').success(function(obj) {
          scope.group = obj.data;
          var groupId = scope.group.id;


          dropZone.ondragover = function() {

            scope.dragTip = true;
            scope.$apply();
            return false;
          };
          dropZone.ondragend = function() {

            scope.dragTip = false;
            scope.$apply();
            return false;
          };
          dropZone.ondragleave = function(ev) {

            if ($(ev.target).attr("msglist-drag") == "1") {

              scope.dragTip = false;
              scope.$apply();
            }
            return false;
          }
          function sendFile(file) {
            var uri = "api/message/upload";
            var xhr = new XMLHttpRequest();
            var formData = new FormData();
            formData.append('groupId', groupId);
            formData.append('file', file);

            xhr.open("POST", uri, true);
            scope.upload_process = 0;
            scope.$apply();
            xhr.onreadystatechange = function() {
              if (xhr.readyState == 4 && xhr.status == 200) {
                if (xhr.responseText == "ok") {
                  scope.upload_process = -1;
                  scope.$apply();
                }

              }
            };

            xhr.upload.addEventListener("progress", function(e) {
              if (e.lengthComputable) {
                var percentage = Math.round((e.loaded * 100) / e.total);
                scope.upload_process = percentage;
                scope.$apply();
              }
            }, false);

            xhr.send(formData);
          }


          dropZone.ondrop = function(event) {
            event.stopPropagation();
            event.preventDefault();
            scope.dragTip = false;
            scope.$apply();
            var filesArray = event.dataTransfer.files;
            for (var i = 0; i < filesArray.length; i++) {
              sendFile(filesArray[i]);
            }
          };

          socket.joinGroup(groupId, function(data) {

            scope.msglist.push(JSON.parse(data));
          });
          $http.get('api/message/list?groupId=' + groupId).success(function(data, status) {

            scope.msglist = data.data;
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
