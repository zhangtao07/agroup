'use strict';

var _ = require('lodash');
var Group = require('./group.model');

// Get list of groups
exports.index = function(req, res) {
  Group.findOne(function (err, group) {
    if(err) { return handleError(res, err); }
    return res.json(200, {
        err:0,
        data:group
    });
  });
};
