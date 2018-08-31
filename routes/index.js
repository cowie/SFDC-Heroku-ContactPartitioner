const express = require('express');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  fs.readFile(path.join(process.cwd(), 'Part-Account.json'), (err, data) => {
    if (err)console.error(err);
    else console.log(data);
  });
  res.render('index', { title: 'Express' });
});

module.exports = router;
