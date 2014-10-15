var dc = require('./dataCenter');
var diff_match_patch = require('googlediff');
var diff = new diff_match_patch();
var id = 1000;

function Client(msg) {
  this.fileid = msg.fileid;
  this.user = msg.user;
}

Client.prototype.add = function(socket) {
  var self = this;
  socket.join(this.fileid);
  dc.userJoin(self);
  self.sendMessage(socket, 'server:clientJoin', self.user);

  socket.on('disconnect', function() {
    dc.userLeave(self);
    self.sendMessage(socket, 'server:clientLeave', self.user);
  });

  socket.on('patch', function(message) {
    var patch = message.patch;
    var patches = diff.patch_fromText(patch);
    var results = diff.patch_apply(patches, dc.getContent(self.fileid));
    dc.setContent(self.fileid,results[0]);
    message.user = self.user;
    self.onPatch(socket, message);
  });
};

Client.prototype.onPatch = function(socket, message) {
  this.sendMessage(socket, 'server:patch', message);
};

Client.prototype.sendMessage = function(socket, messageName, message) {
  socket.broadcast['in'](this.fileid).emit(messageName, message);
};

function startSync(msg, socket) {
  dc.readFile(msg.fileid, function() {
    new Client(msg).add(socket);
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
