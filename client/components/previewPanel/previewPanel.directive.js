'use strict';

angular.module('agroupApp')
  .directive('previewPanel', function ($http) {
    return {
      templateUrl: 'components/previewPanel/previewPanel.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
        scope.preview = function(file){
          $http.get('/api/files/preview/'+file.file_id).success(function(res,status){
            element.find('.preview-stage').html('<img class="canvas" src="'+res.data+'"/>');
          });
        };

        scope.nopreview = function(){
          element.find('.canvas').hide();
        };
      }
    };
  });
