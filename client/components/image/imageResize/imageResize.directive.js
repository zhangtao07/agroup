'use strict';

angular.module('agroupApp').directive('imageResize', function() {
  console.info("imageresize");
  return {
    restrict: 'AE',
    scope: {
      'url':'@imageResize',
      "imageResizeWidth": "@",
      "imageResizeHeight": "@",
      "imageResizeType": "@",
      "imageResizeGravity": "@"
    },
    link: function(scope, element, attrs) {
      var imageResizeWidth,
        imageResizeHeight,
        imageResizeType,
        imageResizeGravity,
        url;
      scope.$watchCollection('[url,imageResizeWidth, imageResizeHeight,imageResizeType,imageResizeGravity]', function(newValues) {

        url = newValues[0];
        if(!/^http(s)?:\/\//.test(url)){
          url = url.replace(/^\//,function(s0,s1){
            return ''
          });
          url = location.protocol+'//'+location.hostname+':'+location.port+'/'+url;
        }
        imageResizeWidth = newValues[1];
        imageResizeHeight = newValues[2];
        imageResizeType = newValues[3] || "resize";
        imageResizeGravity = newValues[4] || "center";
        if(element.is('img')){
          element.attr('src',getUrl(url));
        }else{
          element.css('background-image','url('+getUrl(url)+')');
        }

      });


      function getUrl(url){
        url = encodeURIComponent(url);
        var params = ["url="+url];
        if(!imageResizeWidth){
          imageResizeWidth = element.width();
        }
        if(!imageResizeHeight){
          imageResizeHeight = element.height();
        }
        params.push("width="+imageResizeWidth);
        params.push("height="+imageResizeHeight);
        if(imageResizeGravity){
          params.push("gravity="+imageResizeGravity);
        }
        params.push("type="+imageResizeType);

        return 'static/image/resize?'+params.join('&');
      }

    }
  };
});