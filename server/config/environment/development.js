'use strict';

// Development specific configuration
// ==================================
module.exports = {
  mysql: {
    protocol: "mysql",
    query: {
      pool: true,
      debug: true
    },
    host: "127.0.0.1",
    database: "agroup",
    user: "root",
    password: "",
    port: 3306
  }
};
