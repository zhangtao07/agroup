'use strict';

angular.module('agroupApp')
  .directive('dropzone', function () {
    return {
      templateUrl: 'components/message/dropzone/dropzone.html',
      restrict: 'EA',
      scope:{
        onDrop:"&onDrop"
      },
      link: function (scope, element, attrs) {
        var dropZone = element.parent().get(0);
        dropZone.ondragover = function() {

          scope.dragTip = true;
          scope.$apply();
          return false;
        };
        dropZone.ondragend = function() {

          scope.dragTip = false;
          scope.$apply();
          return false;
        };
        dropZone.ondragleave = function(ev) {

          if ($(ev.target).attr("msglist-drag") == "1") {
            scope.dragTip = false;
            scope.$apply();
          }
          return false;
        };

        dropZone.ondrop = function(event) {
          event.stopPropagation();
          event.preventDefault();
          scope.dragTip = false;
          scope.$apply();
          var files = [];
          var filesArray = event.dataTransfer.files;
          for (var i = 0; i < filesArray.length; i++) {
            files.push(filesArray[i]);
          }
          scope.onDrop({
            files:files
          });
        };
      }
    };
  });