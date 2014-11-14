'use strict';

angular.module('agroupApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('app.groupcreate', {
        url: '/group/create',
        controller: 'GroupCtrl',
        templateUrl: 'app/group/group.html'
      });
  });
