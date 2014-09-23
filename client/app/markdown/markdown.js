'use strict';

angular.module('agroupApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('app.markdown', {
        url: '/markdown/{group}',
        templateUrl: 'app/markdown/markdown.html',
        controller: 'MarkdownCtrl'
      });
  });
