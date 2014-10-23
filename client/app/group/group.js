'use strict';

angular.module('agroupApp')
  .config(['$stateProvider',function ($stateProvider) {
    $stateProvider
      .state('app.group', {
        url: '/group/{name}',
        templateUrl: 'app/group/group.html',
        controller: 'GroupCtrl'
      });
  }]);