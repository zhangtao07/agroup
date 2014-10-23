'use strict';

angular.module('agroupApp')
  .config(['$stateProvider',function($stateProvider) {
    $stateProvider
      .state('app', {
        url: '',
        abstract: true,
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      });
  }]);