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
      var fileid = window.location.href.replace(/.*\?file=([\w]+).*/, '$1');


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
        firstLineAsTitle(newContent, fileDesc);
        socket.emit('patch', {
          patch: patchText
        });
      });

      function firstLineAsTitle(newContent, fileDesc) {
        var lineno = 0;
        var title = fileDesc.title;
        var noTitle = !title || !title.length;
        if (noTitle) {
          var t = ''
            newContent.replace(/.*/gm, function(result) {
              if (/\S+/.test(result)) {
                if (lineno === 0) {
                  t = result.replace(/[#|>|\s]*/g, '');
                  syncTitle(t);
                }
                if (noTitle && lineno === 1) {
                  title = t;
                  fileDesc.title = title;
                  eventMgr.onTitleChanged(fileDesc);
                }
                lineno++;
              }
            });
        }
      }

      function syncTitle(txt) {
        $('.file-title-navbar').text(txt);
      }


      eventMgr.addListener('onEditorPopover', function() {
        console.log(arguments);
      });

      eventMgr.addListener('onTitleChanged', function(fileDesc) {
        var filename = fileDesc.title || fileDesc._title;
        socket.emit('changeFilename', filename.replace(/[.md]/g, '') + '.md');
      });

      socket.on('server:changeFilename', function(filename) {
        //eventMgr.onTitleChanged(fileDesc);
        //syncTitle(filename);
        console.log(filename);
      });

      var groupid;

      eventMgr.addListener('onReady', function(data) {
        if (!data || !data.fileid) {
          window.location.href = '/';
        }
        //console.log(data);
        groupid = data.group;
        $('#my-avatar').attr('src', imgresize(data.user.avatar) || '/assets/images/avatar.jpg');
        if(!viewerMode){
          socket.emit('editor-join', data);
        }
      });

      function getImgname(filepath) {
        var path = [];
        filepath.replace(/[^\/]+\/?/g, function(target, position, source) {
          path.push(target);
        });
        var filename = path[path.length - 1].replace(/\?.*/, '');
        return filename;
      }

      function correctImgpath(){
        $('#preview-contents img').each(function(i, d) {
          $.post("/api/files/images/" + groupid, {
            filename: getImgname(d.src)
          }).done(function(data){
            d.src = data.filepath;
          });
        });
      }

      eventMgr.addListener('onPreviewFinished', function(data) {
        correctImgpath();
      });

      return socket;
    });
