public class part_partitionHelper {
    
    public static string callGetAccountByPhone(string phoneNumber){
		String url = 'https://cdg-partition-demo.herokuapp.com/api/getAccountsByPhone';
		Http h = new Http();
        
        HttpRequest req = new HttpRequest();
        req.setEndpoint(url + '?phoneNumber=' + phoneNumber);
        req.setMethod('GET');
        
        HttpResponse res = h.send(req);

		system.debug(res.getBody());
		return res.getBody();
    }
    
    public static Account callGetAccount(string accountNumber){
        String url = 'https://cdg-partition-demo.herokuapp.com/api/getAccountByAcctNumber';
		Http h = new Http();
        
        HttpRequest req = new HttpRequest();
        req.setEndpoint(url + '?accountNumber=' + accountNumber);
        req.setMethod('GET');
        
        HttpResponse res = h.send(req);

		system.debug('callgetaccount return');
        system.debug(res.getBody());
        Account returnAcc = (Account)JSON.deserialize(res.getBody(), Account.class);
        system.debug(returnAcc);
        return returnAcc;
    }
    
    public static Contact callGetContact(string accountID){
        String url = 'https://cdg-partition-demo.herokuapp.com/api/getContact';
		Http h = new Http();
        
        HttpRequest req = new HttpRequest();
        req.setEndpoint(url + '?accountId=' + accountID);
        req.setMethod('GET');
        
        HttpResponse res = h.send(req);

		system.debug(res.getBody());
        
        //system.debug(res.getBody());
        Contact returnCon = (Contact)JSON.deserialize(res.getBody(), Contact.class);
        system.debug(returnCon);
        return returnCon;
    }
    
}