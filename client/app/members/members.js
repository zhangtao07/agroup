'use strict';

angular.module('agroupApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('app.member', {
        url: '/{name}/members',
        templateUrl: 'app/members/members.html',
        controller: 'MembersCtrl'
      });
  });
