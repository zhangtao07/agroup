'use strict';

angular.module('agroupApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('home', {
        url: '/groups',
        templateUrl: 'app/home/home.html',
        controller: 'HomeCtrl'
      });
  });
