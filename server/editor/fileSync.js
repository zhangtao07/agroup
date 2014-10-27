var dc = require('./dataCenter');
var diff_match_patch = require('googlediff');
var diff = new diff_match_patch();
var hash = require('./utils').hash;
var _ = require('lodash');

function Client(msg) {
  this.fileid = msg.fileid;
  this.user = msg.user;
  this.patchingInProcess = false;
  this.patchQueue = [];
}

Client.prototype.add = function(socket) {
  var self = this;
  socket.join(this.fileid);
  dc.userJoin(self);
  self.sendToOthers(socket, 'server:clientJoin', self.user);

  socket.on('disconnect', function() {
    dc.userLeave(self);
    self.sendToOthers(socket, 'server:clientLeave', self.user);
  });

  socket.on('patch', function(message) {
    self.patch(socket, message);
  });

  socket.on('changeFilename', function(filename) {
    dc.setTitle(self.fileid, filename)
    self.changeFilename(socket, filename);
  });
};

Client.prototype.patch = function(socket, message) {

  if (this.patchingInProcess) {
    this.patchQueue.push({
      patch: message.patch,
      pre: message.preHash,
      post: message.postHash
    });
    return;
  }
  this.patchingInProcess = true;


  var patch = diff.patch_fromText(message.patch);
  var oldBuffer = dc.getContent(this.fileid);
  var currentHash = hash(oldBuffer);

  var results = diff.patch_apply(patch, oldBuffer);

  // Patch applied with success?
  if (results.length < 2 ||
    _.compact(results[1]).length !== results[1].length) {
    console.log("Invalid application of ", patch, results);

    // clear queue
    this.patchQueue = [];
    this.patchingInProcess = false;

    // resync everybody
    return null;
  }
  var afterHash = hash(results[0]);
  if (message.preHash && currentHash !== message.preHash) {
    console.log("!! content was different before");
  }
  if (message.postHash && afterHash !== message.postHash) {
    console.log("!! content is different from expected");
  }


  dc.setContent(this.fileid, results[0]);
  message.user = this.user;
  message.pre = hash(oldBuffer);
  message.post = hash(results[0]);
  this.sendToOthers(socket, 'server:patch', message);


  this.patchingInProcess = false;
  if (this.patchQueue.length > 0) {
    var nextPatch = this.patchQueue.shift();
    return this.patch(socket, {
      patch: nextPatch.patch,
      preHash: nextPatch.pre,
      postHash: nextPatch.post
    });
  }

  return oldBuffer !== results[0];
};

Client.prototype.changeFilename = function(socket, message) {
  this.sendToOthers(socket, 'server:changeFilename', message);
};

Client.prototype.sendToOthers = function(socket, messageName, message) {
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
