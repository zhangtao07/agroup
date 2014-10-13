/**
 * Socket.io configuration
 */'use strict';

var config = require('./environment');

var observe = require('../components/group.observe');

// When the user disconnects.. perform this
function onDisconnect(socket) {
}

// When the user connects.. perform this
function onConnect(socket) {
  // When the client emits 'info', this listens and executes
  socket.on('info', function(data) {
    console.info('[%s] %s', socket.address, JSON.stringify(data, null, 2));
  });

  // Insert sockets below
  require('../api/search/search.socket').register(socket);
  require('../api/file/file.socket').register(socket);
  require('../api/markdown/markdown.socket').register(socket);

}

module.exports = function(socketio) {
  // socket.io (v1.x.x) is powered by debug.
  // In order to see all the debug output, set DEBUG (in server/config/local.env.js) to including the desired scope.
  //
  // ex: DEBUG: "http*,socket.io:socket"

  // We can authenticate socket.io users and access their token through socket.handshake.decoded_token
  //
  // 1. You will need to send the token in `client/components/socket/socket.service.js`
  //
  // 2. Require authentication here:
  // socketio.use(require('socketio-jwt').authorize({
  //   secret: config.secrets.session,
  //   handshake: true
  // }));

  observe.onGroupBroadcast(function(groupId, data) {
    if (typeof data == "object") {
      data = JSON.stringify(data);
    }
    console.info("group " + groupId + " send:" + data);
    socketio.sockets.to(groupId).emit('message', data);
  });

  socketio.on('connection', function(socket) {

    socket.on('subscribe', function(groupId) {
      console.log('joining room:' + groupId);
      socket.join(groupId);

    });


    socket.on('unsubscribe', function(groupId) {
      console.log('leaving room', groupId);
      socket.leave(groupId);
    });

    socket.address = socket.handshake.address !== null ? socket.handshake.address.address + ':' + socket.handshake.address.port : process.env.DOMAIN;

    socket.connectedAt = new Date();

    // Call onDisconnect.
    socket.on('disconnect', function() {
      onDisconnect(socket);
      console.info('[%s] DISCONNECTED', socket.address);
    });

    // Call onConnect.
    onConnect(socket);
    console.info('[%s] CONNECTED', socket.address);
  });
};
