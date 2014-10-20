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

        scope.onCoverLoad = function(item){

          item.coverLoad = true;
        }

        scope.onCoverError = function(item){
          if(!item._cover){
            item._cover = item.cover;
          }
          item.coverLoad = false;
          setTimeout(function(){
            item.cover = item._cover+'?d='+new Date().getTime();
            scope.$apply();
          },3000);


        }
        scope.onimgclick = function(data){
          if(data.pdf){
            window.open('/api/files/previewUrl?id='+data.fv_id,'_blank');
          }
        };
      }
    };
  });