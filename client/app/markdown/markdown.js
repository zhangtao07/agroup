'use strict';

angular.module('agroupApp')
  .config(['$stateProvider',function ($stateProvider) {
    $stateProvider
      .state('app.markdown', {
        url: '/markdown/{name}',
        templateUrl: 'app/markdown/markdown.html',
        controller: 'MarkdownCtrl'
      });
  }]);
