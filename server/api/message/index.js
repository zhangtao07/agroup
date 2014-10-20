'use strict';

var express = require('express');
var controller = require('./message.controller');

var router = express.Router();
router.get("/list", controller.list);
router.get('/', controller.list);
router.post("/post", controller.post);
router.post("/upload", controller.upload);
router.post("/uploadStart", controller.uploadStart);
router.post("/uploadEnd", controller.uploadEnd);
router.post("/delete", controller.delete);

module.exports = router;