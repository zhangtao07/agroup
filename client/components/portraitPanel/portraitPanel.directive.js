'use strict';

angular.module('agroupApp')
  .directive('portraitpanel', function () {
    return {
      templateUrl: 'components/portraitPanel/portraitPanel.html',
      restrict: 'EA',
      scope:{
        "onpick":"&",
        "show":"="
      },
      link: function (scope, element, attrs) {

        scope.$watch('show',function(val){
          if(val){
            element.show();
          }else{
            element.hide();
          }
        })

      //  hide the panel
        scope.hidePP = function() {
          scope.show = false;
        };

      //  save avatar
        scope.saveMyCroppedImage = function() {
          if(scope.myImage != '') {
            scope.onpick({
              fileData:scope.myCroppedImage
            });
          };

          scope.show = false;
        };

        scope.myImage='';
        scope.myCroppedImage='';

        var handleFileSelect=function(evt) {
          element.find('.avatar-preview-panel').removeClass('hide');
          var file = evt.currentTarget.files[0];
          var reader = new FileReader();
          reader.onload = function (evt) {
            scope.$apply(function(scope){
              scope.myImage = evt.target.result;
              debugger;
            });
          };
          reader.readAsDataURL(file);

        };

        element.find('#fileInput').on('change',handleFileSelect);

      }
    };
  });

