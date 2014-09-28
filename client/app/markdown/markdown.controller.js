'use strict';

angular.module('agroupApp')
  .controller('MarkdownCtrl', function($scope, $http, $stateParams, Modal,$location) {

    function success(data, status) {
      $scope.markdowns = data.sort(function(a, b) {
        return a.updateDate < b.updateDate;
      });
    }

    $scope.group = $stateParams.group;

    var confirm = Modal.confirm.delete;
    var dialog  = Modal.dialog;

    $scope.remove = function(md) {
      confirm(function(){
        $http.delete('/api/markdowns/' + md.id);
        var i = $scope.markdowns.indexOf(md);
        $scope.markdowns.splice(i, 1);
      })(md.content);
    };

    $scope.view = function(md){
      dialog(function(){
      })(md.content);
    }

    $scope.sync = function() {
      init();
    };

    init();

    function init() {
      var group = $stateParams.group;
      $http.get('/api/markdowns/'+group).success(success);
    }

    window.addEventListener("message", receiveMessage, false);
    function receiveMessage(event) {
      init();
    }

  });
