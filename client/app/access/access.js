'use strict';

angular.module('agroupApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('access', {
        url: '/access',
        template: '<div ui-view class="fade-in-right-big smooth"></div>'
      });
  });