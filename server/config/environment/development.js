'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/agroup-dev'
  },
  mysql: {
    protocol: "mysql",
    query: { pool: true },
    host: "127.0.0.1",
    database: "agroup",
    user: "root",
    password: "",
    port: 3306
  }
};
