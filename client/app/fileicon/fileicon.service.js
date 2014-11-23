'use strict';

angular.module('agroupApp').factory('fileIcon', function() {

  var classTypes = {
    "image": "fa fa-file-image-o",
    "word": "fa fa-file-word-o",
    "excel": "fa fa-file-excel-o",
    "ppt": "fa fa-file-powerpoint-o",
    "pdf": "fa fa-file-pdf-o",
    "archive": "fa fa-file-zip-o",
    "video": "fa fa-file-video-o",
    "sound": "fa fa-file-sound-o",
    "text": "fa fa-file-text-o",
    "file": "fa fa-file-o",
    'folder': 'fa fa-folder',
    'markdown': 'fa fa-file-text-o'
  }

  return {
    getClassByFilename: function(filename) {
      var className = null;
      var extIndex = filename.lastIndexOf(".");
      if (extIndex !== -1) {
        var ext = filename.substring(extIndex + 1);
        if (/jpg|jpeg|gif|png/.test(ext)) {
          className = classTypes.image;
        } else if (/doc|dot|docx|dotx|docm|dotm/.test(ext)) {
          className = classTypes.word;
        } else if (/xls|xlt|xla|xlsx|xltx|xlsm|xltm|xlam|xlsb/.test(ext)) {
          className = classTypes.excel;
        } else if (/ppt|pot|pps|ppa|pptx|potx|ppsx|ppam|pptm|potm|ppsm/.test(ext)) {
          className = classTypes.ppt;
        } else if (/zip|tar|rar|7z|jar/.test(ext)) {
          className = classTypes.archive;
        } else if (/webm|mkv|flv|ogv|ogg|avi|mov|wmv|rmvb|rm|mp4|m4p|m4v|mpg|mpeg|m4v/.test(ext)) {
          className = classTypes.video;
        } else if (/3gp|act|aiff|aac|amr|mp3|oga|wav|wma/.test(ext)) {
          className = classTypes.sound;
        } else if (/js|java|py|html|css|htm|c|cpp|php/.test(ext)) {
          className = classTypes.text;
        }
      }
      return className;
    },

    getClassByMimetype: function(mimetype) {
      var className = null;
      if (/image/.test(mimetype)) {
        className = classTypes.image;
      } else if (/ms[-]*word/.test(mimetype)) {
        className = classTypes.word;
      } else if (/ms[-]*excel|spreadsheetml/.test(mimetype)) {
        className = classTypes.excel;
      } else if (/ms[-]*powerpoint|presentationml/.test(mimetype)) {
        className = classTypes.ppt;
      } else if (/pdf/.test(mimetype)) {
        className = classTypes.pdf;
      } else if (/Folder/.test(mimetype)) {
        className = classTypes.folder;
      } else if (/markdown/.test(mimetype)) {
        className = classTypes.markdown;
      }
      return className;
    }
  };
});
