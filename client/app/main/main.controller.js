'use strict';

angular.module('agroupApp')
  .controller('MainCtrl', function($scope,$location) {


    var path = $location.path();
    var groupName = path.replace(/\/(\w+)\/.*/,'$1');
    var data = [];
    _.each($scope.collections,function(d){
      data = data.concat(d.groups);
    })

    var module = {};
    $scope.module = module;
    $scope.$on('$stateChangeSuccess',function(event, toState, toParams, fromState, fromParams){
      module.group = _.find(data,{ name: toParams.name});
      module.path = toState.url.split('/').slice(2).join('/')
    });

    $scope.navgate = function(group){
      $location.path('/' + group.name + '/' + module.path)
    }
  });
