module.exports = function(mimetype){
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

