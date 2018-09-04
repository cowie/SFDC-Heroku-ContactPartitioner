# Partitioned Customer Support CTI Pop Demo

## Summary
This is a working simplified example showing how you can service an extended customer base directly from a customer master off platform, while only storing the operative/required records on Salesforce to optimize data storage + efficiency. Why store all the things on SF when you can only store the important things? 

Flow is - CTI pops to the LEX page with the phone number from the call. LEX page searches SF for the record, and provides all matches with add'l data for agent to confirm before selecting a record, and popping to a new case for that customer. If the correct customer isn't found, it searches the remote master for matching records, and goes down the same selection path. If no matches found - open a query pane to allow for more specific requests to get handled.

**It's scrub/demoware - and should only be used as illustrative, not as production unless you for some reason hate your customers**

## Description
### Heroku
- Postgres DB, Hobby-Dev
  - Two tables here, Contact and Account. These are the combo tables creating your 'customer master', and hold a lot of columns, some useful for service, some not.
- ExpressJS/Node runtime for API endpoints
    - **getAccountsByPhone**: What it says, return a list of matching accounts using a phone number as the query parameter. Simplified dataset.
    - **getAccountByAcctNumber**: With a uniqueID, return a single matching account with detailed information, all columns returned so you can create a record from it.
    - **getContact**: Once we've the uniqueID, grab the contact(could talk to a primary contact, whatevers clever) and fetch its details as well.

### Salesforce
- Apex Controllers
    - part_partitionHelper.cls : method wrappers purely to call out to the heroku APIs
    - part_partitionController.cls : method calls for the LEX page to reach out
- LEX Components
    - part_CTIPopPage : empty container for the Panel
    - part_CTIPopPanel : majority of the lex / logic to call and handle flow
- Metadata Changes
    - Account : bunch of fields including part_accountNumber__c which is a External ID from the remote system
    - Contact : bunch of fields
    - Remote Site Setting : Can't make a call if you don't tell us it's ok ya

## Setup
 1. Sign up for a Salesforce org @ developer.salesforce.com, or spin up a scratch org. Or make a new sandbox. Or go to Trailhead and get yo trail on. Whatever floats yer boat, just get an org.
 2. Hit dis button to get you the Heroku instance kicked up. It'll spin up the PG DB addon and runtime, even create that database from all the csvs I loaded into this thing. If you want custom data that's up to you bud, the code is fairly locked to the columns I've thrown in there, so you'll need to alter routes/api.js calls, as well as the metadata on the SF side, and potentially the LEX component. You could definitely make this better.  [![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)
 3. Go into your salesforce org, and add the Heroku domain you just deployed to in Remote Site Settings.
 4. Install this appEx package- https://login.salesforce.com/packaging/installPackage.apexp?p0=04t0b0000019qiF&isdtp=p1\
 5. Go into your Custom Metadata area, change the value of 'partitionDemo' record in endpointURL to your heroku domain.
 6. Copy/Paste the code components in the sfdx folder in this package into your SF org using Console. Start with Part_PartitionHelper.cls, then Part_PartitionController.cls, then part_CTIPopPanel component, then part_CTIPopPage app. I was too lazy to test coverage :D
 7. Activate MyDomain for your org. Get coffee, it takes a minute or so.
 8. When done with MyDomain (like you tested and flipped over the domain) go to the following: http://Yourdomain.lightning.force.com/c/part_CTIPopPage.app
 9. Add ?phoneNumber= and use the below examples. get ype.

 


 Sample phone numbers from the 'Master' Repo:
* 3575523800 6499308566 2029972098 4964013191
* 1824185397 3914222074 6111636704 5026348939
* 9826434201 1567820229 7135718131 3592844694
* 9227478980 6255542355 4761298623 6296200436
* 5123678538 5829519446 1137105873 4084078583

Sample phone numbers from DE standard set:
* 7852416200 5127576000 5034217800 6508673450
* 3125961000 0144274427 4159017000 2128425500