'use strict';

angular.module('agroupApp')
  .config(['$stateProvider',function ($stateProvider) {
    $stateProvider
      .state('access.signin', {
        url: '/signin',
        templateUrl: 'app/access/signin/signin.html',
        controller: 'SigninCtrl'
      });
  }]);