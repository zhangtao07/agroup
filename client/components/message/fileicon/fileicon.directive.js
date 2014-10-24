'use strict';

angular.module('agroupApp')
  .directive('fileicon', ['fileIcon',function (fileIcon) {
    return {
      restrict: 'E',
      replace:true,
      template:"<i></i>",
      link: function (scope, element, attrs) {
        var mimetype = attrs.mimetype;
        var filename = attrs.filename;
        var className = fileIcon.getClassByMimetype(mimetype) || fileIcon.getClassByFilename(filename) || 'fa fa-file';
        element.addClass(className);
      }
    };
  }]);
