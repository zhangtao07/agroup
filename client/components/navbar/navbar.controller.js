'use strict';

angular.module('agroupApp')
  .controller('NavbarCtrl', function ($scope, $location, $http) {
    $scope.menu = [{
      'title': '全部',
      'link': '/'
    }];

    $scope.isCollapsed = true;

    $scope.currentUser = {};

    $scope.isLoggedIn = false;

    $http.get('/api/user/me').success(function(result) {
      if ('name' in result) {
        $scope.user = result;
        $scope.isLoggedIn = true;
      } else {
        $scope.isLoggedIn = false;
      }
    });

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });
