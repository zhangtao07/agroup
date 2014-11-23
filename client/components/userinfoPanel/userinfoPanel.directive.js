'use strict';

angular.module('agroupApp')
  .directive('userinfopanel', function () {
    return {
      templateUrl: 'components/userinfoPanel/userinfoPanel.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
        element.hide();
        scope.show = false;

        scope.openUserinfoPanel = function() {
          scope.userinfo = {
            username : 'Jalon',
            portrait : 'http://fe.baidu.com/~nwind/angulr/img/a2.jpg',
            email: 'jalon@baidu.com',
            phone: '18288888888',
            hi: 'jalon'
          };
          element.show();
          scope.show = true;
        };

        scope.closeUserinfoPanel = function() {
          element.hide();
          scope.show = false;
        };
      }
    };
  });
