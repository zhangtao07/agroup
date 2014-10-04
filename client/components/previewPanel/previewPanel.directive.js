'use strict';

angular.module('agroupApp')
  .directive('previewPanel', function($http) {
    return {
      templateUrl: 'components/previewPanel/previewPanel.html',
      restrict: 'EA',
      link: function(scope, element, attrs) {

        function getFile(file) {
          var defer = {
            parale: [],
            success: function(cb) {
              this.parale.push(cb);
              return this;
            }
          };

          $http.get('/api/files/preview/' + file.file_id).success(function(res, status) {
            console.log(res);
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
              getFile(file).success(function(res) {
                file.previewsrc = res.data;
                element.find('.preview-stage').html('<img class="area canvas" src="' + res.data + '"/>');
              });
            }
          },
          text: function(file) {
            getFile(file).success(function(res) {
              element.find('.preview-stage').html('<iframe src=' + res.data + ' class=area /></iframe>');
            });
          }
        };

        scope.preview = function(file) {
          var type = file.type.replace(/\/\w+$/,'')
          if(type === 'image'){
            prview[type].call(prview,file);
          }else{
            prview.text.call(prview,file);
          }
        };

        scope.nopreview = function() {
          element.find('.preview-stage .area').hide();
        };
      }
    };
  });
