// feelin fine

const { Client } = require('pg');

const client = new Client();

client.connect();

const acctCreateString = 'CREATE TABLE "public"."account" ( '
+ '"accountNumber" serial, "customerSegment" text, "username" text, '
+ '"customerType" text, "onlineRegistered" boolean, "trialCustomer" boolean, '
+ '"status" text, "email" text, "phone" text, "amountDue" real, '
+ '"lastPaymentAmount" real, "lastPaymentDate" date, "billingStreet" text, "billingCity" text, '
+ '"billingState" text, "billingPostalCode" text, "serviceStreet" text, "serviceCity" text, '
+ '"serviceState" text, "servicePostalCode" text, "primaryContact" text, '
+ 'PRIMARY KEY ("accountNumber") ); COMMENT ON TABLE "public"."account" IS \'product side account table\';';
const contCreateString = 'CREATE TABLE "public"."contact" ( '
+ '"contactId" serial, "username" text, "street" text, "city" text, "state" text, "postalCode" text, '
+ '"email" text, "phone" text, "accountId" integer, "firstname" text, "lastname" text, '
+ 'PRIMARY KEY ("contactId"), FOREIGN KEY ("accountId") REFERENCES "public"."account"("accountNumber") '
+ '); COMMENT ON TABLE "public"."contact" IS \'demographic info on teh person behind the account. can expand to householding later\';';
const acctPopulateString = 'INSERT INTO "public"."account"("accountNumber", "customerSegment", "username", "customerType","onlineRegiestered",'
+ '"trialCustomer","status","email","phone","amountDue","lastPaymentAmount","lastPaymentDate","billingStreet","billingCity","billingState",'
+ '"billingPostalCode","serviceStreet","serviceCity","serviceState","servicePostalCode","primaryContact") VALUES ';
const contPopulateString = 'INSERT INTO "public"."contact"("contactId", "username", "street", "city", "state", "postalCode", "email",'
+ '"phone", "accountId", "firstname", "lastname") VALUES ';

function dataInserts() {

}

client.query(acctCreateString, (err, res) => {
  if (err) {
    console.error(err);
  } else {
    console.log('account creation done, ');
    client.query(contCreateString, (cerr, cres) => {
      if (cerr) {
        console.error(cerr);
      } else {
        console.log('contact creation done, ');
        dataInserts();
      }
    });
  }
});



// buildStatement('insert into x(a, b, c) values', rows)
// 'insert into x(a,b,c) values ($1,$2), ($3,$4)' params:[1,2,3,4]
function buildStatement(insert, rows) {
  const params = [];
  const chunks = [];

  rows.forEach((row) => { // for each row of data provided
    const valueClause = [];
    Object.keys(row).forEach((p) => {
      params.push(row[p]);
      valueClause.push(`$${params.length}`);
    });
    chunks.push(`(${valueClause.join(', ')})`);
  });
  return {
    text: insert + chunks.join(', '),
    values: params,
  };
}


// upload contents of Acct csv
// upload contents of Contact csv
