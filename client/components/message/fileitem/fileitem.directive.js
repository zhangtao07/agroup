'use strict';

angular.module('agroupApp')
  .directive('fileitem', function(pdf) {
    return {
      templateUrl: 'components/message/fileitem/fileitem.html',
      restrict: 'EA',
      scope: {
        'data': '=data'
      },
      link: function(scope, element, attrs) {
        scope.onimgclick = function(){
          debugger;
          var data = this.data;
          if(data.pdf){
            if(!/pdf/.test(data.mimetype)){
              debugger;
              pdf(data.pdf,data.filepath+"?filename="+data.filename);
            }else{
              pdf(data.pdf);
            }

          }
        };
      }
    };
  });