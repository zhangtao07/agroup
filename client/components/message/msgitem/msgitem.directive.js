'use strict';

angular.module('agroupApp').directive('msgitem', function() {
  return {
    templateUrl: 'components/message/msgitem/msgitem.html',
    restrict: 'EA',
    scope: {
      data: '=data'
    },
    link: function(scope, element, attrs) {

    }
  };
});
