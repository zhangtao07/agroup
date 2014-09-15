var _callback;

module.exports = {
  onGroupBroadcast: function(callback) {

    _callback = callback;
  },
  groupBroadcast: function(id, data) {
    _callback && _callback(id, data);
  }
}
