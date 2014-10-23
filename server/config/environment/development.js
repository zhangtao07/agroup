'use strict';

// Development specific configuration
// ==================================
module.exports = {
//  port: 8999,
//  auth: 'uuap',
  mysql: {
    protocol: "mysql",
    query: {
      pool: true,
      debug: true
    },
    host: "127.0.0.1",
    database: "agroup",
    user: "root",
    password: "root",
    port: 3306
  },
  op: {
    server :'http://172.22.65.38',
    view: '/op/view.aspx?src=',
    embed: '/op/embed.aspx?src='
  },
  hostname:'zzm.com'
};
