'use strict';

angular.module('agroupApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('app.search', {
        url: '/search/{keyword}',
        templateUrl: 'app/search/search.html',
        controller: 'SearchCtrl'
      });
  });