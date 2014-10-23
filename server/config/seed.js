'use strict';

module.exports = function(db, cb) {

  db&&db.sync(function() {
    db.models.group.find({}, function(err, groups) {
      if (groups.length == 0) {
        db.models.group.create({
          name: "playground"
        }, function() {
          cb && cb();
        });
        db.models.group.create({
          name: "fex"
        }, function() {
          cb && cb();
        });
      }
    });

  })


}

