public class part_partitionController {

    @AuraEnabled
    public static List<Account> localFindAccountByPhone (string phoneNumber){
        List<Account> aList = [select id, name, part_email__c, phone, part_status__c, shippingStreet, shippingCity, shippingState, shippingPostalcode from Account where phone = :phoneNumber];
        return aList;
    }
    
    @AuraEnabled
    public static string masterFindAccountByPhone(string phoneNumber){
		string jsonPayload = part_partitionHelper.callGetAccountByPhone(phoneNumber);
		return jsonPayload;
    }
    
    @AuraEnabled
    public static Account masterGetAccountByAcctNumber(string accountNumber){
	
        return part_partitionHelper.callGetAccount(String.valueOf(accountNumber));
    } 
    
    @AuraEnabled
    public static Contact masterGetContactByAcctNumber(string accountNumber){
        return part_partitionHelper.callGetContact(string.valueOf(accountNumber));
    }
    
    @AuraEnabled
    public static string createCustomerRecords(Account accountRecord, Contact contactRecord){
        system.debug(accountRecord);
        Account a = accountRecord;
        system.debug('new account');
        system.debug(a);
        insert a;
        Contact c = contactRecord;
        c.AccountId = a.id;
        system.debug('new contact');
        system.debug(c);
        insert c;
        Case x = new Case(Subject='New Case', AccountId=a.id, ContactId=c.id);
        insert x;
		return x.id;
    }
    
    @AuraEnabled
    public static string createCase(string AccountId){
        system.debug(accountId);
		Account AccountRecord = [select id, part_accountNumber__c, (select id from Contacts where accountID = :accountId) from Account where id = :accountId];
        Case x = new Case(Subject='New Case', AccountId=accountRecord.id, ContactId=accountRecord.contacts[0].id);
        insert x;
        return x.id;
    }
}