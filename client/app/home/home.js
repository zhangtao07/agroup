'use strict';

angular.module('agroupApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('app.groups', {
        url: '/groups',
        templateUrl: 'app/home/home.html',
        controller: 'HomeCtrl'
      });
  });
