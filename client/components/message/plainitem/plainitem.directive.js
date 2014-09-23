'use strict';

angular.module('agroupApp')
  .directive('plainitem', function() {
    return {
      templateUrl: 'components/message/plainitem/plainitem.html',
      restrict: 'EA',
      scope: {
        data: '=data'
      },
      link: function(scope, element, attrs) {

        scope.data.text = scope.data.text.replace(/(http[s]*:\/\/)*[\w_.]+\.(com|cn|io|cc|gov|org|net|int|edu|mil|jp|kr|us|uk)[\w\/#\%_\?=\.]*/g,function(match){
          return '<a href="'+match+'" target="_blank">'+match+'</a>';
        });
        console.info(scope.data.text);
      }
    };
  });