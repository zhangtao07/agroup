var orm = require('orm');
var settings = require('../config/environment');

var connection = null;

function setup(db, cb) {
  require('./user.model')(orm, db);
  require('./group.model')(orm, db);
  require('./link.model')(orm, db);
  require('./file.model')(orm, db);
  require('./fileversion.model')(orm, db);
  require('./filefulltext.model')(orm, db);
  require('./message.model')(orm, db);
  require('./folder.model')(orm, db);
  return cb(null, db);
}

module.exports = function(cb) {
  if (connection) return cb(null, connection);

  orm.connect(settings.mysql, function(err, db) {
    if (err) return cb(err);

    connection = db;
    db.settings.set('instance.returnAllErrors', true);
    setup(db, cb);
  });
};
