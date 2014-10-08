'use strict';

// Production specific configuration
// =================================
module.exports = {
  port: 8999,

  auth: 'uuap',

  mysql: {
    protocol: "mysql",
    query: { pool: true,debug:true },
    host: "127.0.0.1",
    database: "agroup",
    user: "root",
    password: "end",
    port: 3306

  },
  upload_temp_dir: "../upload/.tmp",

  upload_dir: "../upload",

  avatar_dir: "../images/avatar",

  resize_dist_cache : '../.resize_cache'
};
