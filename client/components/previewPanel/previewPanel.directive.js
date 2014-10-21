'use strict';

angular.module('agroupApp')
  .directive('previewPanel', function($http, $state,pdf,$localStorage,folderAPI) {
    return {
      templateUrl: 'components/previewPanel/previewPanel.html',
      restrict: 'EA',
      link: function(scope, element, attrs) {

        var lp = $localStorage['file.lastpreview'] = $localStorage['file.lastpreview'] || {};

        var downloadBtn = element.find('#p-download-btn');

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

        var show = {
          image: function(file) {
            if (file.previewsrc) {
              return element.find('.preview-stage').html('<img class="area canvas" src="' + file.previewsrc + '"/>');
            } else {
              getFile(file, 'image').success(function(res) {
                file.previewsrc = res.data;
                element.find('.preview-stage').html('<img class="area canvas" src="' + res.filepath + '"/>');
              });
            }
          },
          'text/x-markdown': function(file) {
            getFile(file, 'markdown').success(function(res) {
              element.find('.preview-stage').html('<iframe src="/editor/' + file.group.id + '?file='+file.file_id+'&view=true&notitle=true" class=area /></iframe>');
              //var md = element.find('.preview-stage').html(res.data);
              downloadBtn.attr('href',res.filepath + '?filename='+ file.name);
              var img = md.find('img');
              if(img.length){
                img.each(function(i,d){
                  folderAPI.getMDimage($state.params.group,file,d.src).success(function(data){
                    img[i].src = data.filepath;
                  });
                });
              }
            });
          },
          pdf : function(file){
            getFile(file, 'pdf').success(function(res) {
              file.previewsrc = res.data;
              file.pdf = res.filepath;
              element.find('.preview-stage').html('<img class="area canvas" src="' + res.cover + '"/>');
            });
          },
          office: function(file){
            getFile(file, 'office').success(function(res) {
              element.find('.preview-stage').html(folderAPI.officePreview(res.filepath));
            });
          }
        };

        scope.preview = function(file) {
          showFile(file);
          lp.file = file;
        };

        showFile(lp.file);

        function showFile(file) {
          if(!file) return;
          var type = file.type.replace(/\/\w+$/, '')
          var isPdf = /pdf/.test(file.type);
          var isOffice = /word|excel|presentation/.test(file.type) || /doc|xls|ppt/.test(file.name);
          type = isPdf ? 'pdf' : type;
          type = isOffice ? 'office' : type;

          if (show[type]) {
            show[type].call(show, file);
            scope.previewitem = file;
          } else {
            element.find('.preview-stage').html('<h1>Coming soon...</h1>');
          }
        }

        scope.previewFolder = function(files,folder) {
          var readme = _.find(files, function(file) {
            return file.type === 'text/x-markdown' && file.name.toLocaleLowerCase() === 'readme.md'
          });
          if (readme) {
            scope.preview(readme);
            scope.selectItem(folder,readme);
          } else {
            element.find('.preview-stage').html('');
            scope.previewitem = null;
          }
        };

        scope.previewFile = function(item) {
          switch (item.type) {
            case 'text/x-markdown':
              window.open('/editor/' + $state.params.group + '?file=' + item.file_id + '&view=true', '_blank');
              break;
            case 'application/pdf':
              pdf(item.pdf);
              break;
            default:
          }
        };

        scope.editFile = function(item) {
          switch (item.type) {
            case 'text/x-markdown':
              window.open('/editor/' + $state.params.group + '?file=' + item.file_id, '_blank');
              break;
            default:
          }
        };

        scope.isPreviewType = function(type){
          if(!type) return false;
          var reg = new RegExp(type.replace('application/',''));
          return reg.test('pdf|text/x-markdown');
        };
      }
    };
  });
