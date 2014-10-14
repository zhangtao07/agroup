var _callback;
var Q = require('q');
module.exports = {
  onGroupBroadcast: function(callback) {
    _callback = callback;
  },
  groupBroadcast: function(groupId, data) {
    _callback && _callback(groupId, data);
  },
  messageBroadcast: function(groupId,message){
    var self = this;
    Q.nfcall(message.getMessage).then(function(data) {
      self.groupBroadcast(groupId, data);
    });
  }


}
