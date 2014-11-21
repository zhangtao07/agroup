'use strict';

angular.module('agroupApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('invite', {
        url: '/{name}/invite/{code}',
        templateUrl: 'app/invite/invite.html',
        controller: 'InviteCtrl'
      });
  });
