'use strict';

angular.module('agroupApp')
  .directive('linkitem', function () {
    return {
      templateUrl: 'components/message/linkitem/linkitem.html',
      restrict: 'EA',
      scope: {
        data: '=data'
      },
      link: function (scope, element, attrs) {
        scope.data.content = scope.data.content.replace(/(http[s]*:\/\/)*[\w_.]+\.(com|cn|io|cc|gov|org|net|int|edu|mil|jp|kr|us|uk)[\w#!:.?+=&%@!\-\/]*/g,function(match){
          var url = match;
          if(!/^http(s)?:\/\//.test(match)){
            url="http://"+match;
          }
          return '<a href="'+url+'" target="_blank">'+match+'</a>';
        });
      }
    };
  });