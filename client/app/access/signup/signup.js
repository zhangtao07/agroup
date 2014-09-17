'use strict';

angular.module('agroupApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('access.signup', {
        url: '/signup',
        templateUrl: 'app/access/signup/signup.html',
        controller: 'SignupCtrl'
      });
  });