'use strict';

angular.module('agroupApp')
  .directive('mkitem', ['pdf',
    function(pdf) {
      return {
        templateUrl: 'components/message/mkitem/mkitem.html',
        restrict: 'EA',
        scope: {
          data: '=data',
          group: '=group'
        },
        link: function(scope, element, attrs) {
          scope.onimgclick = function(data) {
            var url = '/' + scope.group.name + '/md/view/' + data.id;
            window.open(url, '_blank');
          };

          scope.onCoverLoad = function(item) {
            item.coverLoad = true;
          };

          scope.onCoverError = function(item) {
            if (!item._cover) {
              item._cover = item.coverUrl;
            }
            item.coverLoad = false;
            setTimeout(function() {
              item.coverUrl = item._cover + '?d=' + new Date().getTime();
              scope.$apply();
            }, 3000);
          };
        }
      };
    }
  ]);
