'use strict';

angular.module('agroupApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('app', {
        url: '',
        abstract: true,
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      });
  });