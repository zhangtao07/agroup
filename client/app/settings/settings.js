'use strict';

angular.module('agroupApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('app.setting', {
        url: '/{name}/settings',
        templateUrl: 'app/settings/settings.html',
        controller: 'SettingsCtrl'
      });
  });
