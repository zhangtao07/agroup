'use strict';

angular.module('agroupApp').factory('pdf', function($document, $compile,$rootScope) {

  return function(file, download) {
    var template = angular.element('<pdf></pdf>');

    template.attr('file',file);

    if(download){
      template.attr('download',download);
    }

    var compiled = $compile(template)($rootScope.$new());

    $document.find('body').append(compiled);
  }

});