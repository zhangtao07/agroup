'use strict';

angular.module('agroupApp')
  .directive('groupAction', ['groupAPI','Modal',function (groupAPI,Modal) {
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
        var confirm = Modal.confirm.delete;
        scope.quite = function(){
          confirm(function() {
            groupAPI.quite(scope.group.id).success(function(){
              scope.relaction.joined = false;
            });
          })('quite','<p>确定要退出 <strong>' + scope.group.displayName + '</strong> 群组?</p>','退出');
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
