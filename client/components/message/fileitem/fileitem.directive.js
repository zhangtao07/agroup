'use strict';

angular.module('agroupApp')
  .directive('fileitem', ['pdf',function(pdf) {
    return {
      templateUrl: 'components/message/fileitem/fileitem.html',
      restrict: 'EA',
      scope: {
        'data': '=data'
      },
      link: function(scope, element, attrs) {

        scope.onGallery = function(el, event) {
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

        scope.data.list.forEach(function(file) {
          file.isImg = /^(image|video\/(mp4|webm|ogg))/.test(file.mimetype);
          file.isVideo = /^(video\/(mp4|webm|ogg))/.test(file.mimetype);
        });

        scope.onCoverLoad = function(item) {

          item.coverLoad = true;
        }

        scope.onCoverError = function(item) {
          if (!item._cover) {
            item._cover = item.cover;
          }
          item.coverLoad = false;
          setTimeout(function() {
            item.cover = item._cover + '?d=' + new Date().getTime();
            scope.$apply();
          }, 3000);


        }
        scope.onimgclick = function(data) {
          if (data.pdf) {
            window.open('/api/files/previewUrl?id=' + data.fv_id, '_blank');
          }
        };
      }
    };
  }]);