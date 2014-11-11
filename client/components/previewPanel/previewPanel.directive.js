'use strict';

angular.module('agroupApp')
  .directive('previewPanel', ['$http', '$state', 'pdf', '$localStorage', 'folderAPI',
    function($http, $state, pdf, $localStorage, folderAPI) {
      return {
        templateUrl: 'components/previewPanel/previewPanel.html',
        restrict: 'EA',
        link: function(scope, element, attrs) {

          var gallary = [];

          scope.preview = function(file, fd) {
            //if (fd) {
              //gallary = _.filter(fd.files, function(d) {
                //return /image|video/.test(d.type) && file !== d;
              //});
            //}
            var type = getType(file);
            scope.previewfile = file;
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
              scope.previewpath = '/'+ scope.group.name + '/md/view/'  + file.id + '?notitle=true';
              //scope.lookuppath = '/editor/' + file.group.id + '?file=' + file.file_id + '&view=true';
              //scope.editpath = '/editor/' + file.group.id + '?file=' + file.file_id;
            } else {
              scope.previewimg = file.coverUrl;
            }
          };

          function getType(file) {
            var isImage = /image/.test(file.mimetype) && 'image';
            var isPdf = /pdf/.test(file.mimetype) && 'pdf';
            var isOffice = isOfficeFile(file) && 'office';
            var isText = /text|json/.test(file.mimetype) && 'text';
            var isVideo = /video/.test(file.mimetype) && 'video';
            var isMarkdown = /markdown/.test(file.mimetype) && 'markdown';
            return isImage || isPdf || isOffice || isMarkdown || isText || isVideo || 'file';
          }

          function isOfficeFile(file) {
            return /word|excel|presentation/.test(file.mimetype) || /doc|xls|ppt/.test(file.name);
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

          scope.lookup = function(previewfile) {
            var type = previewfile.mimetype;
            var isImage = /video|image/.test(type);
            if (type === 'pdf') {
              pdf(previewfile.coverUrl);
            } else if (isImage) {
              var assets = [{
                href: previewfile.coverUrl,
                title: previewfile.name,
                type: previewfile.type,
                thumbnail: previewfile.coverUrl ,
                poster: previewfile.cover
              }];
              folderAPI.imageGallary(gallary).then(function success(result) {
                _.each(result,function(d){
                  var file = d.config.data.file;
                  var fv = d.data;
                  assets.push({
                    href: fv.filepath,
                    title: file.name,
                    type: file.type,
                    thumbnail: fv.cover || fv.filepath,
                    poster: fv.cover
                  });
                });
                blueimp.Gallery(assets,{
                  carousel:true ,
                  closeOnEscape: true,
                  toggleSlideshowOnSpace: true,
                  enableKeyboardNavigation: true
                });
              });
            } else {
              window.open('/' + scope.group.name + '/md/view/' + previewfile.id , '_blank');
            }
          }
        }
      };
    }
  ]);
