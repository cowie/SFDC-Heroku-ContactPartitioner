const express = require('express');

const router = express.Router();

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

router.get('/getAccountsByPhone', (req, res, next) => {
  const phoneNumber = String.valueOf(req.query.phoneNumber);
  pool.connect((err, client, done) => {
    if (err) throw err;
    client.query('SELECT account."accountNumber", account."username", account."phone", account."serviceStreet" AS "ShippingStreet", account."serviceCity" AS "ShippingCity", account."serviceState" AS "ShippingState", account."servicePostalCode" AS "ShippingPostalcode", CONCAT (contact."firstname", \' \', contact."lastname") AS "Name" FROM Account INNER JOIN Contact ON account."primaryContact" = contact."contactId" WHERE account."phone" = $1',
      [phoneNumber], (qerr, qres) => {
        done();
        if (qerr) {
          console.log(qerr.stack);
          res.send({ error: qerr.stack });
        } else {
          console.log(qres.rows);
          res.send(qres.rows);
        }
      });
  });
});


router.get('/getAccountByAcctNumber', (req, res, next) => {
  // validate we got an accountID, or error out missing accountID
  const accountNumber = req.query.accountNumber;
  // query against pg, get account details
  pool.connect((err, client, done) => {
    if (err) throw err;
    client.query('SELECT account."accountNumber" AS cdgPartition__part_accountNumber__c, account."customerSegment" AS cdgPartition__part_Customer_Segment__c, account."username" AS cdgPartition__part_Username__c, account."customerType" AS part_Customer_Type__c, account."onlineRegistered" AS cdgPartition__part_Online_Registered__c, account."trialCustomer" AS cdgPartition__part_Trial_Customer__c, account."status" AS cdgPartition__part_status__c, account."email" AS cdgPartition__part_email__c, account."phone", account."amountDue" AS cdgPartition__part_amount_due__c, account."lastPaymentAmount" AS cdgPartition__part_Last_Payment_Amount__c, account."lastPaymentDate" AS cdgPartition__part_Last_Payment_Date__c, account."billingStreet", account."billingCity", account."billingState", account."billingPostalCode", account."serviceStreet" AS "ShippingStreet", ' +
                 'account."serviceCity" AS "ShippingCity", account."serviceState" AS "ShippingState", account."servicePostalCode" AS "ShippingPostalCode", CONCAT (contact."firstname", \' \', contact."lastname") AS "Name" FROM Account INNER JOIN Contact ON account."primaryContact" = contact."contactId" WHERE "accountNumber"  = $1',
    [accountNumber], (qerr, qres) => {
      done();
      if (qerr) {
        console.log(qerr.stack);
        res.send({ error: qerr.stack });
      } else {
        console.log(qres.rows[0]);
        res.send(qres.rows[0]);
      }
    }); 
  });
});

router.get('/getContact', (req, res, next) => {
  // validate we got an accountID/contactID, or error out missing
  const accountID = req.query.accountNumber;
  // query against pg, get account details
  console.log('here is where contact things go');
  pool.connect((err, client, done) => {
    if (err) throw err;
    client.query('SELECT "username" AS cdgPartition__username__c, "email" AS email, "phone" AS phone, "street" AS mailingStreet, "city" AS mailingCity, "state" AS mailingState, "postalCode" AS mailingPostalcode, "firstname", "lastname" FROM "contact" where "accountId" = $1',
      [accountID], (qerr, qres) => {
        done();
        if (qerr) {
          console.log(qerr.stack);
          res.send({ error: qerr.stack });
        } else {
          console.log(qres.rows[0]);
          // create json payload, send back
          res.send(qres.rows[0]);
        }
      });
  });

  // close
});


/*
router.get('/getAccountByPhone', (req, res, next) => {
  const phoneNumber = req.query.phoneNumber;
  pool.connect((err, client, done) => {
    if (err) throw err;
    client.query('SELECT "accountNumber" AS part_accountNumber__c, "customerSegment" AS part_Customer_Segment__c, "username" AS part_Username__c, "customerType" AS part_Customer_Type__c, "onlineRegistered" AS part_Online_Registered__c, "trialCustomer" AS part_Trial_Customer__c, "status" AS part_status__c, "email" AS part_email__c, "phone", "amountDue" AS part_amount_due__c, "lastPaymentAmount" AS part_Last_Payment_Amount__c, "lastPaymentDate" AS part_Last_Payment_Date__c, "billingStreet", "billingCity", "billingState", "billingPostalCode", "serviceStreet" AS mailingStreet, "serviceCity" AS mailingCity, "serviceState" AS mailingState, "servicePostalCode" AS mailingPostalCode, "primaryContact"  FROM account WHERE "phone"  = $1',
      [phoneNumber], (qerr, qres) => {
        done();
        if (qerr) {
          console.log(qerr.stack);
          res.send({ error: qerr.stack });
        } else {
          console.log(qres.rows);
          res.send(qres.rows);
        }
      });
  });
});
*/


module.exports = router;
