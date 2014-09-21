'use strict';

var express = require('express');
var controller = require('./group.controller');

var router = express.Router();

router.get('/getGroupByName', controller.getGroupByName);

router.post("/create",controller.create);

module.exports = router;