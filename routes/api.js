const express = require('express');

const router = express.Router();

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

/* GET users listing. */
router.get('/getAccount', (req, res, next) => {
  // validate we got an accountID, or error out missing accountID
  const accountID = 3;
  // query against pg, get account details
  pool.connect((err, client, done) => {
    if (err) throw err;
    client.query('SELECT "customerSegment", "username", "customerType", "onlineRegistered", "trialCustomer", "status", "email", "phone", "amountDue", "lastPaymentAmount", "lastPaymentDate", "billingStreet", "billingCity", "billingState", "billingPostalCode", "serviceStreet", "serviceCity", "serviceState", "servicePostalCode",  "primaryContact" FROM account WHERE "accountNumber"  = $1', 
      [accountID], (qerr, qres) => {
        done();
        if (qerr) {
          console.log(qerr.stack);
          res.send(qerr.stack);
        } else {
          console.log(qres.rows[0]);
          res.send(qres.rows[0]);
        }
      });
  });
  // create json payload, send back
  // close
});

router.get('/getContact', (req, res, next) => {
  // validate we got an accountID/contactID, or error out missing
  // query against pg, get account details
  // create json payload, send back
  // close
});

module.exports = router;
