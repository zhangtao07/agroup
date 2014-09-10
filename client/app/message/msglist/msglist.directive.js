'use strict';

angular.module('agroupApp').directive('msglist', ['$http', 'socket',
function($http, socket) {

	return {
		templateUrl : 'app/message/msglist/msglist.html',
		restrict : 'EA',
		link : function(scope, element, attrs) {

			var dropZone = element.get(0);

			

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
			dropZone.ondragleave = function(ev){
				
				if( $(ev.target).attr("msglist-drag") == "1"){
					
					scope.dragTip = false;
					scope.$apply();
				}
				return false;
			}
			
			function sendFile(){
				console.info(arguments);
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

			

			socket.joinGroup('group1', function(data) {

				scope.msglist.push(JSON.parse(data));
			});
			$http.get('api/message/list').success(function(data, status) {

				scope.msglist = data.data;
				scope.$apply();
			});
			scope.postText = '';
			scope.onPostMessage = function() {
				$http.post('api/message/post', {
					'message' : scope.postText,
					'type' : 'plain'
				}).success(function(data) {
					/*
					 if(data.err == 0){
					 scope.msglist.push(data.data);
					 }*/

				});
			}
		}
	};
}]);
