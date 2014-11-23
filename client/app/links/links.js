'use strict';

angular.module('agroupApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('app.links', {
        url: '/{name}/links',
        templateUrl: 'app/links/links.html',
        controller: 'LinksCtrl'
      });
  });
