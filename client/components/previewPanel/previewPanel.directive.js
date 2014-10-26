'use strict';

angular.module('agroupApp')
  .directive('previewPanel', ['$http', '$state', 'pdf', '$localStorage', 'folderAPI',
    function($http, $state, pdf, $localStorage, folderAPI) {
      return {
        templateUrl: 'components/previewPanel/previewPanel.html',
        restrict: 'EA',
        link: function(scope, element, attrs) {

          scope.preview = function(file) {
            var type = getType(file);
            scope.filetype = type;
            scope.filePreviewType = type;
            scope.isMarkdown = false;
            scope.editpath = null;

            if (type === 'markdown' || type === 'office') {
              scope.filePreviewType = 'outsource';
            } else if (type === 'pdf') {
              scope.filePreviewType = 'image';
            }

            if (type === 'markdown') {
              scope.isMarkdown = true;
              scope.previewpath = '/editor/' + file.group.id + '?file=' + file.file_id + '&view=true&notitle=true';
              scope.lookuppath = '/editor/' + file.group.id + '?file=' + file.file_id + '&view=true';
              scope.editpath = '/editor/' + file.group.id + '?file=' + file.file_id;
            } else {
              folderAPI.getPreview(file, type).success(function(fv) {
                scope.lookuppath = fv.filepath;
                scope.previewfile = file;
                scope.previewfile.filepath = fv.filepath;
                scope.previewfile.cover = fv.cover;
                scope.downloadpath = fv.filepath + '?filename=' + file.name;
                switch (type) {
                  case 'office':
                    scope.lookuppath = scope.previewpath = folderAPI.office.embed(fv.id);
                    break;
                  case 'image':
                    scope.previewimg = fv.filepath;
                    break;
                  case 'pdf':
                    scope.previewimg = fv.cover;
                    break;
                  case 'text':
                    scope.previewcontent = hljs.highlightAuto(fv.content).value;
                    break;
                  case 'video':
                    //scope.previewimg = fv.cover;
                    scope.previewvideo = fv.filepath;
                    break;
                  default:
                    scope.previewpath = null;
                    scope.lookuppath = null;
                }
              });
            }
          };

          function getType(file) {
            var isImage = /image/.test(file.type) && 'image';
            var isPdf = /pdf/.test(file.type) && 'pdf';
            var isOffice = isOfficeFile(file) && 'office';
            var isText = /text|json/.test(file.type) && 'text';
            var isVideo = /video/.test(file.type) && 'video';
            var isMarkdown = /markdown/.test(file.type) && 'markdown';
            return isImage || isPdf || isOffice || isMarkdown || isText || isVideo || 'file';
          }

          function isOfficeFile(file) {
            return /word|excel|presentation/.test(file.type) || /doc|xls|ppt/.test(file.name);
          }

          scope.previewFolder = function(files, folder) {
            var readme = _.find(files, function(file) {
              return /markdown/.test(file.type) && file.name.toLocaleLowerCase() === 'readme.md'
            });
            if (readme) {
              scope.preview(readme);
              scope.selectItem(folder, readme);
            } else {
              //scope.preview(folder);
              scope.filePreviewType = null;
            }
          };

          scope.lookup = function(type, filepath,previewfile) {
            var isImage = /video|image/.test(type);
            if (type === 'pdf') {
              pdf(filepath);
            } else if (isImage) {
              var obj = {
                href: filepath,
                title: previewfile.name,
                type: previewfile.type,
                thumbnail: filepath
              }
              if (type === 'video') {
                obj.poster = previewfile.cover;
              }
              blueimp.Gallery([obj]);
            } else {
              window.open(filepath, '_blank');
            }
          }
        }
      };
    }
  ]);
