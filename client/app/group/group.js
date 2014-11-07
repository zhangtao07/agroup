'use strict';

angular.module('agroupApp')
  .config(['$stateProvider',function ($stateProvider) {
    $stateProvider
      .state('app.group', {
        url: '/{name}/comments',
        templateUrl: 'app/group/group.html',
        controller: 'GroupCtrl'
      });
  }]);
