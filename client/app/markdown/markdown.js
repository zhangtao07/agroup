'use strict';


function correctImgpath($jq,groupid) {
  $jq.find('img').each(function(i, d) {
    $.post("/api/files/images/" + groupid, {
      filename: getImgname(d.src)
    }).done(function(data) {
      d.src = data.filepath;
    });
  });
}

function getImgname(filepath) {
  var path = [];
  filepath.replace(/[^\/]+\/?/g, function(target, position, source) {
    path.push(target);
  });
  var filename = path[path.length - 1].replace(/\?.*/, '');
  return filename;
}

angular.module('agroupApp')
  .config(['$stateProvider',
    function($stateProvider) {
      $stateProvider
        .state('app.markdown', {
          url: '/{name}/notes',
          templateUrl: 'app/markdown/markdown.html',
          controller: 'MarkdownCtrl'
        });
    }
  ])
  .directive('correctImgUrl', [ '$rootScope',function($rootScope) {
    return {
      scope: {
        content: '=correctImgUrl'
      },
      link: function(scope, element, attrs) {
        console.log($rootScope);
        element.html(scope.content);
        correctImgpath(element,$rootScope.__currentGroupId);
      }
    };
  }]);
