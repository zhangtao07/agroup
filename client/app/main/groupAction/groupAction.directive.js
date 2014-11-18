'use strict';

angular.module('agroupApp')
  .directive('groupAction', ['groupAPI',function (groupAPI) {
    return {
      templateUrl: 'app/main/groupAction/groupAction.html',
      restrict: 'EA',
      scope: {
        group: '=group',
        relaction: '=?relaction'
      },
      link: function (scope, element, attrs) {
        var rel = scope.relaction = scope.relaction || {
          joined: false,
          collected: false
        };
        scope.join = function(){
          groupAPI.join(scope.group.id).success(function(){
            scope.relaction.joined = true;
          });
        }
        scope.quite = function(){
          groupAPI.quite(scope.group.id).success(function(){
            scope.relaction.joined = false;
          });
        }
        scope.collect = function(){
          groupAPI.collect(scope.group.id).success(function(){
            scope.relaction.collected = true;
          });
        }
        scope.uncollect = function(){
          groupAPI.uncollect(scope.group.id).success(function(){
            scope.relaction.collected = false;
          });
        }
      }
    };
  }]);
