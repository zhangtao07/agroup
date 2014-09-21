'use strict';

angular.module('agroupApp').directive('msglist', ['$http', 'socket', 'groupAPI', 'messageAPI', '$compile',
  function($http, socket, groupAPI, messageAPI, $compile) {

    return {
      templateUrl: 'components/message/msglist/msglist.html',
      restrict: 'EA',
      link: function(scope, element, attrs) {
//        var template = angular.element(document.createElement('uploadpanel'));
//        template.attr("test","asdas");
//        var el = $compile( template )( scope , function(cloned, scope){
//          debugger;
//        });
//        angular.element(document.body).append(el);
//        debugger;
        scope.uploadpanel = {}
        attrs.$observe('group', function(group) {
          group = JSON.parse(group);


          var groupId = group.id;

          scope.onDrop = function(files) {
            files.forEach(function(file) {
              scope.uploadpanel.addFile(file, function(file,send) {
                var formData = new FormData();
                formData.append('groupId', groupId);
                formData.append('file', file);
                send('api/message/upload',formData);
              });
            });
          }


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
