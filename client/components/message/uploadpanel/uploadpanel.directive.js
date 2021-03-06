'use strict';




angular.module('agroupApp').directive('uploadpanel', ['$q', function($q) {

  function formatSize(bytes){
    var si = false;
    var thresh = si ? 1000 : 1024;
    if(bytes < thresh) return bytes + ' B';
    var units = si ? ['kB','MB','GB','TB','PB','EB','ZB','YB'] : ['K','M','G','T','P','E','Z','Y'];
    var u = -1;
    do {
      bytes /= thresh;
      ++u;
    } while(bytes >= thresh);
    return bytes.toFixed(1)+''+units[u];
  }

  return {
    templateUrl: 'components/message/uploadpanel/uploadpanel.html',
    restrict: 'EA',
    scope: {
      control: "=",
      test: "="
    },
    link: function(scope, element, attrs) {



      scope.fold = false;
      scope.uploadItems = [];
      scope.filterComplete = function(item){
        return item.status=="complete" || item.status=="cancel";
      }
//      scope.uploadItems = [];
      scope.methods = scope.control || {};
      scope.methods.addFile = function(file,onprepare,onfinish) {
        element.show();
        scope.close = false;
        scope.fold = false;
        var item = {
          filename: file.name,
          file: file,
          size:formatSize(file.size),
          percent: 0,
          complete: false,
          onprepare:onprepare
        };
        scope.uploadItems.push(item);
        sendFile(item,onfinish);
        scope.$apply();

      };


      function sendFile(item,onfinish) {
        var xhr = new XMLHttpRequest();
        item.status = "uploading";
        item.percent = 0;
        item.speed="0K/s";
        var _speed = {
          time:new Date(),
          size:0
        }
        xhr.onreadystatechange = function() {
          if (xhr.readyState == 4 && xhr.status == 200) {
            var res = JSON.parse(xhr.responseText);
            if (res.status == 200) {
              item.percent = 100;
              item.status = "complete";
              scope.$apply();
              var data = res.data;
              delete data.folder;
              delete data.fileversion;
              return onfinish && onfinish(data.id,data);
            }
          }
        };
        xhr.upload.addEventListener("progress", function(e) {
          if (e.lengthComputable) {
            var percentage = Math.round((e.loaded * 100) / e.total);
            var currentTime = new Date();
            var deltaTime = (currentTime.getTime()-_speed.time.getTime())/1000;
            var deltaSize = e.loaded-_speed.size;
            _speed.time = currentTime;
            _speed.size = e.loaded;
            var speed = deltaSize/deltaTime;
            item.speed = formatSize(speed)+"/s";
            item.percent = percentage;
            scope.$apply();
          }

        }, false);
        item.onprepare(item.file,function(uri,formData){
          xhr.open("POST", uri, true);
          xhr.send(formData);
          item.cancel = function(){
            xhr.abort();
            item.status="cancel";
            onfinish && onfinish(null)
          }
        });
      }

    }
  };
}]);
