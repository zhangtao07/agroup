var emitter = require('events').EventEmitter;
var namespace = 'agroup.message.';

module.exports = exports = {
  sub: function(id, fn) {
    emitter.on(namespace + id, fn);
  },
  pub: function(id) {
    emitter.emite.apply(emitter, namespace + id, [].slice.call(arguments, 1));
  }
}
