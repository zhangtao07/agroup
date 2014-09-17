'use strict';

var express = require('express');
var controller = require('./image.controller');

var router = express.Router();

router.get('/upload/:id', controller.upload);

module.exports = router;