'use strict';

// Production specific configuration
// =================================
module.exports = {
  // Server port
  port: process.env.OPENSHIFT_NODEJS_PORT ||
    process.env.PORT ||
    8999,

  // MongoDB connection options
  mongo: {
    uri: process.env.MONGOLAB_URI ||
      process.env.MONGOHQ_URL ||
      process.env.OPENSHIFT_MONGODB_DB_URL + process.env.OPENSHIFT_APP_NAME ||
      'mongodb://localhost/agroup'
  },
  my sql
:
{
  protocol: "mysql",
    query
:
  {
    pool: true
  }
,
  host: "127.0.0.1",
    database
:
  "agroup",
    user
:
  "root",
    password
:
  "end"
}
,

auth: 'uuap',

  upload_temp_dir
:
"/home/agroup/files/upload/.tmp",
  upload_dir
:
"/home/agroup/files/upload/"
}
;
