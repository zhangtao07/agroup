'use strict';

angular.module('agroupApp')
  .directive('commonHeader', ['$rootScope','$state',function ($rootScope,$state) {
    return {
      templateUrl: 'app/block/commonHeader/commonHeader.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
        scope.keyword = '';
        scope.$on('searchKeyword', function (event, data) {
//          alert('123');
          scope.keyword=data;
        });
        scope.onSearch = function(){
          $state.go('app.search',{
            keyword:scope.keyword
          })
        }
      }
    };
  }]);