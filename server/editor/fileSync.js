var cache = require('./cache');
var diff_match_patch = require('googlediff');
var diff = new diff_match_patch();
var id = 1000;

function SyncService(content, msg) {
  this.content = content;
  this.fileid = msg.fileid;
  this.user = msg.user;
  //this.user.id = this.user.id || (id++).toString(36);
}

SyncService.prototype.addClient = function(socket) {

  var self = this;
  socket.join(this.fileid);

  self.sendMessage(socket, 'server:clientJoin', self.user);

  socket.on('disconnect', function() {
    cache.save(self.fileid,self.user);
    self.sendMessage(socket, 'server:clientLeave', self.user);
  });

  socket.on('patch', function(message) {
    var patch = message.patch;
    var patches = diff.patch_fromText(patch);
    var results = diff.patch_apply(patches, self.content);
    var content = results[0];
    self.content = content;
    message.user = self.user;
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
  cache.get(msg.fileid, function(file) {
    var syncService = new SyncService(file, msg);
    syncService.addClient(socket);
    cache.set(msg.fileid, syncService);
  });
}


module.exports = function(io) {
  var serverIO = io.of('/file-sync');
  serverIO.on('connection', function(socket) {
    socket.on('editor-join', function(msg) {
      startSync(msg, socket);
    });
  });
};
