'use strict';

// Production specific configuration
// =================================

module.exports = {
  port: 8999,

  auth: 'uuap',

  op: {
    server :'http://172.22.65.38',
    view: '/op/view.aspx?src=',
    embed: '/op/embed.aspx?src='
  },
  hostname:'agroup.baidu.com',
  service:{
    host : 'cp01-ra-045.cp01.baidu.com',
    port : '8087'
    //host : 'localhost',
    //port: 8080
  }
};
