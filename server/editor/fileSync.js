var cache = require('./cache');
var diff_match_patch = require('googlediff');
var diff = new diff_match_patch();
var clientid = 0;

function SyncService(content, msg) {
  this.content = content;
  this.fileid = msg.fileid;
  this.clientid = clientid++;
  this.usr = msg.usr;
}

SyncService.prototype.addClient = function(socket) {

  var self = this;
  socket.join(this.fileid);

  self.sendMessage(socket, 'server:clientJoin', {
    clientid: self.clientid,
    username: self.usr.name,
    avatar: self.usr.avatar
  });

  socket.on('disconnect', function() {
    cache.save(self.fileid);
    self.sendMessage(socket, 'server:clientLeave', {
      clientid: self.clientid,
      username: self.usr.name,
      avatar: self.usr.avatar
    });
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
