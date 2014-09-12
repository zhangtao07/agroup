var socketIO = require('socket.io');
var cache = require('./cache');
var diff_match_patch=require('googlediff');
var diff = new diff_match_patch();

function SyncService(content, group, filename) {
  this.content = content;
  this.users = [];
  this.clientNum = 0;
  this.group = group;
  this.filename = filename;
}

SyncService.prototype.addClient = function(username, socket) {
  socket.join(this.group+'/'+this.filename);
  this.users.push(username);
  var self = this;
  this.clientNum += 1;
  socket.on('disconnect', function() {
    self.clientNum -= 1;
    if (self.clientNum === 0) {
      //console.log('client leave');
      cache.saveToDisk(self.group,self.filename);
    }
  });
  socket.on('patch', function(message) {
    var patch = message.patch;
    var patches = diff.patch_fromText(patch);
    var results = diff.patch_apply(patches, self.content);
    var content = results[0];
    self.content = content;
    self.onPatch(socket, message);
    //console.log(self.content === cache.get(self.group,self.filename),self.content);
  });
};

SyncService.prototype.onPatch = function(socket, message) {
  this.sendMessage(socket, 'server:patch', message);
};

SyncService.prototype.sendMessage = function(socket, messageName, message) {
  socket.broadcast['in'](this.group+'/'+this.filename).emit(messageName, message);
};

function startSync(message, socket) {
  var syncService;
  var group = message.group;
  var filename = message.filename;
  var username = message.username;
  var file = cache.get(group,filename);
  syncService = new SyncService(file, group,filename);
  cache.set(group,filename,syncService);
  syncService.addClient(username, socket);
}


module.exports = function(server) {
  var io = socketIO.listen(server);
  var serverIO = io.of('/file-sync');
  serverIO.on('connection', function(socket) {
    socket.on('login', function(message) {
      startSync(message, socket);
    });
  });
};
