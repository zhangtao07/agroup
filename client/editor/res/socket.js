define([
    "jquery",
    "underscore",
    "eventMgr",
    'editor',
    "socketio",
    'diff_match_patch_uncompressed'
    ], function($, _, eventMgr, editor, io, diff_match_patch) {
      var socket = io('/file-sync', {
        path: '/socket.io-client'
      });
      var diff = new diff_match_patch();
      var fileid = window.location.href.replace(/.*\?file=([\w]+).*/,'$1');


      socket.on('server:clientJoin', function(user) {
        editor.addUser(user);
      });

      socket.on('server:clientLeave', function(user) {
        editor.removeUser(user);
      });

      socket.on('server:patch', function(message) {
        var patch = message.patch;
        var patches = diff.patch_fromText(patch);
        var results = diff.patch_apply(patches, editor.getValue());
        var content = results[0];
        editor.syncValueNoWatch(content, message.user);
        //editor.setValueNoWatch(content);
      });

      eventMgr.addListener('onContentChanged', function(fileDesc, newContent, oldContent) {
        var patchList = diff.patch_make(oldContent, newContent);
        var patchText = diff.patch_toText(patchList);
        socket.emit('patch', {
          patch: patchText
        });
      });


      eventMgr.addListener('onEditorPopover', function() {
        console.log(arguments);
      });

      eventMgr.addListener('onReady', function(data) {
        if(!data || !data.fileid){
          window.location.href = '/';
        }
        socket.emit('editor-join', data);
      });

      return socket;
    });
