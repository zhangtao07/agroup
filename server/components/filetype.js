module.exports = function(mimetype,filename){
  return getTypeFromMimetype(mimetype) || getTypeFromExt(filename);
}

function getTypeFromMimetype(mimetype){
  var type;
  if(/image/.test(mimetype)){
    type = 'image';
  }else if(/ms[-]*word|officedocument/.test(mimetype)){
    type = 'word';
  }else if(/ms[-]*excel|spreadsheetml/.test(mimetype)){
    type = 'excel';
  }else if(/ms[-]*powerpoint|presentationml/.test(mimetype)){
    type = 'ppt';
  }else if(/pdf/.test(mimetype)){
    type = 'pdf';
  }else if(/^video\/(mp4|webm|ogg)$/.test(mimetype)){
    type = "html5video";
  }
  return type;
}


function getTypeFromExt(filename){
  var type;
  var extIndex = filename.lastIndexOf(".");
  if(extIndex !== -1){
    var ext = filename.substring(extIndex+1);
    if(/jpg|jpeg|gif|png/.test(ext)){
      type = 'image';
    }else if(/doc|dot|docx|dotx|docm|dotm/.test(ext)){
      type = 'word';
    }else if(/xls|xlt|xla|xlsx|xltx|xlsm|xltm|xlam|xlsb/.test(ext)){
      type = 'excel';
    }else if(/ppt|pot|pps|ppa|pptx|potx|ppsx|ppam|pptm|potm|ppsm/.test(ext)){
      type = 'ppt';
    }else if(/zip|tar|rar|7z|jar/.test(ext)){
      type = 'archive';
    }else if(/webm|mkv|flv|ogv|ogg|avi|mov|wmv|rmvb|rm|mp4|m4p|m4v|mpg|mpeg|m4v/.test(ext)){
      type = 'video';
    }else if(/3gp|act|aiff|aac|amr|mp3|oga|wav|wma/.test(ext)){
      type = 'sound';
    }else if(/js|java|py|html|css|htm|c|cpp|php/.test(ext)){
      type = 'text';
    }
  }
}
