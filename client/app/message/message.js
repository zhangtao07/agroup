'use strict';

angular.module('agroupApp')
  .config(['$stateProvider',function ($stateProvider) {
    $stateProvider
      .state('app.message', {
        url: '/{name}/comments',
        templateUrl: 'app/message/message.html',
        controller: 'MessageCtrl'
      });
  }]);
