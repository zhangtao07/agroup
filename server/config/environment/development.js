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
  }
};
