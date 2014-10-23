'use strict';

function select(node) {
  var range = rangy.createRange();
  range.selectNodeContents(node);
  //range.collapse(true);
  var sel = rangy.getSelection();
  //sel.setStart(0, 0);
  //sel.setEnd(10, 10);
  sel.setSingleRange(range);
}

angular.module('agroupApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('app.file', {
        url: '/file/{name}',
        templateUrl: 'app/file/file.html',
        controller: 'FileCtrl'
      });
  })
  .directive('stopEvent', function() {
    return {
      restrict: 'A',
      link: function(scope, element, attr) {
        element.bind('click', function(e) {
          e.stopPropagation();
        });
      }
    };
  })
  /*
     This directive allows us to pass a function in on an enter key to do what we want.
     */
  .directive('ngEnter', function() {
    return function(scope, element, attrs) {
      element.bind("keydown keypress", function(event) {
        if (event.which === 13) {
          scope.$apply(function() {
            scope.$eval(attrs.ngEnter);
          });
          event.preventDefault();
        }
      });
    };
  })
  .directive('scrollTo', function() {
    return function(scope, element, attrs) {
      //window.element = element;
      scope.scrollLeft = function(){
        //element.scrollLeft(1000);
        element.animate( { scrollLeft: '+=200' }, 400)
      };
      scope.scrollRight = function(){
        //element.scrollLeft(1000);
        element.animate( { scrollLeft: '-=200' }, 400)
      };
      //element.scrollLeft(1000);
    };
  })
  .directive('fileEditing', function() {
    return {
      restrict: 'A',
      link: function(scope, element, attr) {
        element.text(scope.item.name);

        element.bind('keydown keypress', function(event) {
          if (event.which === 13) {
            element.blur();
          } else if (event.which === 27) {
            element.text(scope.item.name);
            select(element[0]);
          }
        });

        scope.$watch('item.editing', function(nv, ov) {
          if (nv) {
            element.addClass('editing');
            element.attr('contenteditable', true);
            select(element[0]);
          } else if (!nv && ov) {
            element.removeClass('editing');
            element.attr('contenteditable', false);
            var content = element.text();
            if(content){
              scope.item.name = content;
            }else{
              element.text(scope.item.name);
            }
          }
        });

        scope.$watch('item.name', function(nv, ov) {
          if (nv && ov && nv !== ov) {
            return scope.updateItem && scope.updateItem(scope.item);
          }
        });
      }
    };
  })
  .filter('fileicon', function() {
    return function(input) {
      var icon = input.replace(/\/.*/, '');
      switch (input) {
        case 'text/x-markdown':
          icon = 'file-text';
          break;
        case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
          icon = ' app-icons ppt';
          break;
        case 'application/x-rar-compressed':
          icon = 'file-zip-o';
          break;
        case 'application/msword':
          icon = ' app-icons word';
          break;
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
          icon = ' app-icons word';
          break;
        case 'application/vnd.ms-excel':
          icon = 'file-excel-o'
          break;
        case 'application/pdf':
          icon = 'file-pdf-o';
          break;
        case 'application/octet-stream':
          icon = 'file';
          break;
        default:
      }
      return icon;
    }
  });
