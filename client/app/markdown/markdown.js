'use strict';

angular.module('agroupApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('app.markdown', {
        url: '/markdown',
        templateUrl: 'app/markdown/markdown.html',
        controller: 'MarkdownCtrl'
      });
  });
