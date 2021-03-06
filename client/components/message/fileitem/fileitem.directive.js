'use strict';

angular.module('agroupApp')
  .directive('fileitem', ['pdf',function(pdf) {
    return {
      templateUrl: 'components/message/fileitem/fileitem.html',
      restrict: 'EA',
      scope: {
        'data': '=data',
        'group': '=group'
      },
      link: function(scope, element, attrs) {

        scope.onGallery = function(event) {
          var el = event.target;
          var parent = event.target.parentNode;
          var index;
          var $links = $(el).closest('msglist').find('[blueimp-href]');
          var links = [];
          $links.each(function(i, link) {
            var $link = $(link);

            var href = $link.attr('blueimp-href');
            var title = $link.attr('blueimp-title');
            var type = $link.attr('blueimp-type');
            var src = $('img', $link).attr('src');

            var obj = {
              href: href,
              title: title,
              type: type,
              thumbnail:src
            }

            if(/video/.test(type)){
              obj['poster'] = $link.attr('blueimp-cover');
            }

            if (link == parent) {
              index = i;
            }
            links.push(obj);
          });
          blueimp.Gallery(links, {
            index: index,
            event: event
          });


        }

        scope.data.files.forEach(function(file) {
          file.isImg = /^(image|video\/(mp4|webm|ogg))/.test(file.mimetype);
          file.isVideo = /^(video\/(mp4|webm|ogg))/.test(file.mimetype);
          file.isMK = /markdown/.test(file.mimetype);
        });

        scope.onCoverLoad = function(item) {

          item.coverLoad = true;
        }

        scope.onCoverError = function(item) {
          if (!item._cover) {
            item._cover = item.coverUrl;
          }
          item.coverLoad = false;
          setTimeout(function() {
            item.coverUrl = item._cover + '?d=' + new Date().getTime();
            scope.$apply();
          }, 3000);
        }

        scope.onimgclick = function(data) {
          var isMkdown = /markdown/.test(data.mimetype);
          if(isMkdown){
            var url = '/'+scope.group.name+'/md/view/' + data.id;
            window.open(url, '_blank');
            return
          }
          window.open(data.previewUrl.view, '_blank');
        };
      }
    };
  }]);
