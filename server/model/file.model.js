'use strict';

var ago = require('../components/dateformate/ago');

module.exports = function(orm, db) {
  var File = db.define('file', {
    id: { type: 'serial', key: true },
    name:String,
    mimetype: String,
    status: [ 'init', 'vision' ,'hidden', 'removed' ],
    createDate: {type: 'date', time: true}
  },{
    hooks: {
      beforeCreate: function() {
        if (this.status === null) {
          this.status = 'vision';
        }
        if (this.createDate === null) {
          this.createDate = new Date();
        }
      }
    },
    methods:{
      getFile : function(){
        return {
          id: this.id,
          user:{
            avartar: 'api/user/avatar/' + this.user.username,
            nickname: this.user.nickname,
          },
          time: ago(this.date),
        }
      }
    }
  });
  File.hasOne('user', db.models.user, { required: true , autoFetch: true });
  File.hasOne('group', db.models.group, { required: true, autoFetch: true });
}

