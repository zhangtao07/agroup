var cache = require('./cache');
var diff_match_patch = require('googlediff');
var diff = new diff_match_patch();

function SyncService(content, msg) {
  this.content = content;
  this.users = [];
  this.clientNum = 0;
  this.fileid = msg.fileid;
  this.username = msg.username;
}

SyncService.prototype.addClient = function(username, socket) {
  socket.join(this.fileid);
  this.users.push(username);
  var self = this;
  this.clientNum += 1;
  socket.on('disconnect', function() {
    self.clientNum -= 1;
    if (self.clientNum === 0) {
      cache.saveToDisk(self.fileid);
    }
  });
  socket.on('patch', function(message) {
    var patch = message.patch;
    var patches = diff.patch_fromText(patch);
    var results = diff.patch_apply(patches, self.content);
    var content = results[0];
    self.content = content;
    self.onPatch(socket, message);
  });
};

SyncService.prototype.onPatch = function(socket, message) {
  this.sendMessage(socket, 'server:patch', message);
};

SyncService.prototype.sendMessage = function(socket, messageName, message) {
  socket.broadcast['in'](this.fileid).emit(messageName, message);
};

function startSync(msg, socket) {
  var file = cache.get(msg.fileid);

  var syncService = new SyncService(file, msg);
  syncService.addClient(msg.username, socket);

  cache.set(msg.fileid, syncService);
}


module.exports = function(io) {
  var serverIO = io.of('/file-sync');
  serverIO.on('connection', function(socket) {
    socket.on('editting', function(msg) {
      startSync(msg, socket);
    });
  });
};
