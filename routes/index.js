const express = require('express');

const router = express.Router();

const fs = require('fs');
const path = require('path');
/* GET home page. */
router.get('/', (req, res, next) => {
  
  res.render('index', { title: 'Express' });
});

module.exports = router;
