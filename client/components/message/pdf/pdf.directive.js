'use strict';

angular.module('agroupApp')
  .directive('pdf', function () {
    return {
      templateUrl: 'components/message/pdf/pdf.html',
      restrict: 'EA',
      scope:{
        'file':'@',
        'download':'@'
      },
      link: function (scope, element, attrs) {
        scope.$watchCollection('[file,download]', function(newValues) {
          var file = newValues[0],
              download = newValues[1];
          var url = 'pdf?file='+file;
          if(download){
            url+='&download='+download;
          }
          scope.url = url;
        });


        scope.close = function(){
          element.remove();
        }
      }
    };
  });