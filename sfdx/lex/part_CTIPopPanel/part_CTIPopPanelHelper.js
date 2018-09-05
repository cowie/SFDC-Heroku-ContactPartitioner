({
	doInit : function(cmp, event, helper) {
		//search local db, check for available, if results display for confirmation, w button to do query
		const phoneNumber = helper.getParameterByName('phoneNumber');		
        helper.searchLocalByPhone(cmp, phoneNumber);
	},
    toggleQueryInterface : function(cmp, event, helper){
        //flip open the multi-part query interface
    },
    queryMaster : function(cmp, event, helper){
        //call for a full query against the rear db, show as list.
    },
    getMasterDetails : function(cmp, event, helper){
        //with a defined customerID, get the details on a single account/contact combo
        var accountNumber = event.getSource().get("v.value");
        console.log('account number set as ' + accountNumber);
        helper.getMasterAccountDetail(cmp, accountNumber);
    },
    goWorkCase : function(cmp, event, helper){
        var accountId = event.getSource().get("v.value")
        
        helper.createCaseFromLocal(cmp, accountId);
    }
})