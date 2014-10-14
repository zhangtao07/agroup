'use strict';

angular.module('agroupApp')
  .directive('previewPanel', function($http) {
    return {
      templateUrl: 'components/previewPanel/previewPanel.html',
      restrict: 'EA',
      link: function(scope, element, attrs) {

        function getFile(file, type) {
          var defer = {
            parale: [],
            success: function(cb) {
              this.parale.push(cb);
              return this;
            }
          };

          $http.post('/api/files/preview/' + file.file_id, {
            type: type
          }).success(function(res, status) {
            defer.parale.forEach(function(d, i) {
              d.call(null, res);
            });
          });

          return defer;
        }

        var prview = {
          image: function(file) {
            if (file.previewsrc) {
              return element.find('.preview-stage').html('<img class="area canvas" src="' + file.previewsrc + '"/>');
            } else {
              getFile(file, 'image').success(function(res) {
                file.previewsrc = res.data;
                element.find('.preview-stage').html('<img class="area canvas" src="' + res.data + '"/>');
              });
            }
          },
          'text/x-markdown': function(file) {
            getFile(file, 'markdown').success(function(res) {
              //element.find('.preview-stage').html('<iframe src=' + res.data + ' class=area /></iframe>');
              element.find('.preview-stage').html(res.data);
            });
          }
        };

        scope.preview = function(file) {
          var type = file.type.replace(/\/\w+$/, '')
          if (!prview[type]) {
            element.find('.preview-stage').html('<h1>Coming soon...</h1>');
          } else {
            prview[type].call(prview, file);
          }
        };

        scope.nopreview = function(files) {
          var readme = _.find(files,function(file){
            return file.type === 'text/x-markdown' && file.name.toLocaleLowerCase() === 'readme.md'
          });
          if(readme){
            prview[readme.type].call(prview, readme);
          }else{
            element.find('.preview-stage').html('');
          }
        };
      }
    };
  });
