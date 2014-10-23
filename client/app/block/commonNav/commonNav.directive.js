'use strict';

angular.module('agroupApp')
  .directive('commonNav', ['userAPI',function (userAPI) {
    return {
      templateUrl: 'app/block/commonNav/commonNav.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
        scope.groups = [];
        userAPI.getGroups().success(function(res){
          if(res.err == 0){
            res.data.forEach(function(group){
              scope.groups.push(group);
            });
          }

        });
      }
    };
  }]);