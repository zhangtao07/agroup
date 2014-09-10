define([
    "jquery",
    "underscore",
    "eventMgr",
    'editor',
    "socketio",
    'diff_match_patch_uncompressed'
], function($, _, eventMgr, editor, io, diff_match_patch) {

    var socket = io('/file-sync');
    var diff = new diff_match_patch();

    window.editor = editor;

    var group = window.getParam('group');
    var file = window.getParam('file');

    if (group && file) {
        var username = new Date();
        socket.emit('login', {
            path: decodeURI("doc/"+group+'/'+file),
            username: username
        });
    }

    socket.on('server:patch', function(message) {
        var patch = message.patch;
        var patches = diff.patch_fromText(patch);
        var results = diff.patch_apply(patches, editor.getValue());
        var content = results[0];
        editor.setValueNoWatch(content,true);
    });


    eventMgr.addListener('onContentChanged', function(fileDesc, newContent, oldContent) {
        var patchList = diff.patch_make(oldContent, newContent);
        var patchText = diff.patch_toText(patchList);
        socket.emit('patch', {
            patch: patchText,
            selectionMgr: {
                selectionStart: editor.selectionMgr.selectionStart,
                selectionEnd: editor.selectionMgr.selectionEnd,
                cursorY: editor.selectionMgr.cursorY
            }
        });
    });
    return socket;
});
