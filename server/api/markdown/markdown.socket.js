/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Markdown = require('./markdown.model');

exports.register = function(socket) {
  Markdown.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Markdown.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('markdown:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('markdown:remove', doc);
}
