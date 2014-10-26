'use strict';

angular.module('agroupApp')
  .controller('MarkdownCtrl', ['$rootScope','$scope', '$http', '$stateParams', 'Modal','$location','groupAPI',function($rootScope,$scope, $http, $stateParams, Modal,$location,groupAPI) {

    $scope.markdowns = [];
    function success(data, status) {
      //$scope.markdowns = data.sort(function(a, b) {
        //return a.updateDate < b.updateDate;
      //});
      $scope.hasMore= data.hasMore;
      data.list.forEach(function(md){
        $scope.markdowns.push(md);
      });
    }

    //$scope.group = $stateParams.group;

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
      $scope.markdowns = [];
      init();
    };

    var pagenation={
      offset:0,
      limit:6
    }

    $scope.pageno = 1;

    $scope.loadList = function(pageno){
      $scope.hasMore = true;
      var group = $scope.group.id;
      pagenation.offset = pageno * pagenation.limit;
      $scope.pageno++;
      $http.get('/api/markdowns/'+group,{ params:pagenation}).success(success);
    }

    $scope.hasMore = true;
    $scope.me = $rootScope.__user;

    var groupName = $stateParams.name;
    groupAPI.getGroupByName(groupName).success(function(res){
      $rootScope.__currentGroupName = res.data.name;
      $scope.group = res.data;
      init();
    });


    function init() {
      var group = $scope.group.id;
      $http.get('/api/markdowns/'+group).success(success);
    }

  }]);
