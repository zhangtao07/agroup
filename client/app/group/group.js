'use strict';

angular.module('agroupApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('app.group', {
        url: '/group/{contactId}',
        templateUrl: 'app/group/group.html',
        controller: 'GroupCtrl'
      });
  });