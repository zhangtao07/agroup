'use strict';

angular.module('agroupApp').directive('msglist', ['$http','socket',
function($http,socket) {
	
	
	
	return {
		templateUrl : 'app/message/msglist/msglist.html',
		restrict : 'EA',
		link : function(scope, element, attrs) {
			
			
			
			console.info(element);
			
			var dropZone = element.get(0);
			
			dropZone.addEventListener("drop",function(ev){
				ev.preventDefault();
				debugger;
			},true);
			
			
			
			dropZone.addEventListener("dragover",function(ev){
				ev.preventDefault();
			},true);
			
			dropZone.addEventListener("dragenter",function(ev){
				
				
				if(ev.target == this){
					console.info("enter");
				}
				
				
				/*
				scope.dragTip = true;
								scope.$apply();*/
				
				
			},false);
			dropZone.addEventListener("dragleave",function(ev){
				
				if(ev.target == this){
					console.info("leave");
				}
				
				/*
				scope.dragTip = false;
								scope.$apply();*/
				
			},false);
			
			
			
			socket.joinGroup('group1',function(data){
				
				scope.msglist.push(JSON.parse(data));	
			});
			$http.get('api/message/list').success(function(data,status){
			
				scope.msglist = data.data;
				scope.$apply();
			});
			scope.postText = '';
			scope.onPostMessage = function(){
				$http.post('api/message/post',{
					'message':scope.postText,
					'type':'plain'
				}).success(function(data){
					/*
					if(data.err == 0){
											scope.msglist.push(data.data);	
										}*/
					
					
				});
			}
			
		}
	};
}]);
