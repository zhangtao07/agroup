'use strict';

// Production specific configuration
// =================================
module.exports = {
  port: 8999,
  mysql: {
    protocol: "mysql",
    query: { pool: true },
    host: "127.0.0.1",
    database: "agroup",
    user: "root",
    password: "end",
    port: 3306
  }
};
