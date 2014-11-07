'use strict';

var express = require('express');
var controller = require('./message.controller');

var router = express.Router();
router.post("/post", controller.post);
router.post("/file", controller.uploadEnd);
router.post("/delete", controller.delete);

module.exports = router;
