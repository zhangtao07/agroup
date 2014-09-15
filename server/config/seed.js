'use strict';

module.exports = function(db, cb) {

  db.sync(function() {
    db.models.group.find({}, function(err, groups) {
      if (groups.length == 0) {
        db.models.group.create({
          name: "Fex讨论组"
        }, function() {
          cb && cb();
        });
      }
    });

  })


}

