define([
  "jquery",
  "underscore",
  "utils",
  "storage",
  "classes/Provider",
  "eventMgr"
], function($, _, utils, storage, Provider, eventMgr) {
  var agroupProvider = new Provider('agroup', "Agroup");
  var uploadUrl = '/api/message/upload';
  var groupId = 1;

  agroupProvider.uploadFile = function(files, callback) {
    _.each(files, function(file) {
      var formData = new FormData();
      formData.append('groupId', groupId || 1); //TBD
      formData.append('file', file);
      $.ajax({
        type: 'POST',
        url: uploadUrl,
        data: formData,
        processData: false,
        contentType: false
      }).done(function(data){
        callback(data.folder);
        //getFilepath(data.folder).done(callback);
      });
    });
  }

  function getFilepath (file){
    return $.post('/api/files/preview/' + file.file_id, {
      type: file.type
    });
  }

  return agroupProvider;
});
