
angular.module('agroupApp')
  .directive('disabled', function() {
    return {
      restrict: 'A',
      link: function(scope, element, attr) {
        element.css({ opacity: 0.5 });
      }
    };
  })
