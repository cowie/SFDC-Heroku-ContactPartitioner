var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  fs.readFile(path.join(process.cwd(), 'Part-Account.json'), function(err, data) {
    if(err)console.error(err);
    else console.log(data);
  }
  res.render('index', { title: 'Express'});
});

module.exports = router;
