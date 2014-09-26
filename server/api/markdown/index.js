'use strict';

var express = require('express');
var controller = require('./markdown.controller');

var router = express.Router();

router.get('/:group', controller.index);
//router.get('/:id', controller.show);
//router.post('/', controller.create);
//router.put('/:id', controller.update);
//router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;
