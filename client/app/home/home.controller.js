'use strict';

angular.module('agroupApp')
  .controller('HomeCtrl', ['$scope', 'userAPI',
    function($scope, userAPI) {
      $scope.message = 'Hello';

      $scope.lastMsg = function(msg){
        console.log(msg);
        return msg.content.data.text
      }
    }
  ]);
