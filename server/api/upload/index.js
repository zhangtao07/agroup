'use strict';

var express = require('express');
var router = express.Router();


router.get('/(.*)', function(req, res) {
  console.info(req.params[0]);

  res.end('end')
});



module.exports = router;
