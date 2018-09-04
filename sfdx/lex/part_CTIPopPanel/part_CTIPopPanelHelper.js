({
    getParameterByName : function(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
	},
    searchLocalByPhone : function(cmp, phoneNumber) {
        var action = cmp.get("c.localFindAccountByPhone");
        action.setParams({phoneNumber: phoneNumber});
        
        action.setCallback(this, function(response) {
            var state = response.getState();
            if(state === "SUCCESS"){
				var retRows = response.getReturnValue();
                console.log(retRows);
                if(retRows == null || retRows.length === 0){
                    //no returns, kick off remote request
                    this.searchMasterByPhone(cmp, phoneNumber);
                }else {
                    //1+ return, return selection pane
                    cmp.set('v.accountList', retRows);
                    cmp.set('v.selectionPane', true);
                }
            }
            else if(state === "INCOMPLETE"){
                return null;
            }
            else if (state === "ERROR"){
            	var errors = response.getError();
                if(errors){
                    console.log("Error: " + errors);
                }else{
                    console.log("??");
                }
                return null;
            }
        });
        $A.enqueueAction(action);
    },
    searchMasterByPhone : function(cmp, phoneNumber) {
        console.log('we in da master now, searching ' + phoneNumber);
        var action = cmp.get("c.masterFindAccountByPhone");
        action.setParams({phoneNumber: phoneNumber});
        
        action.setCallback(this, function(response) {
            var state = response.getState();
            if(state === "SUCCESS"){
				var retRows = response.getReturnValue();
                console.log(JSON.parse(retRows));
                if(retRows == null || retRows.length === 0){
                    //no response back, query time
                    cmp.set('v.queryPane', true);
                    
                }else {
                    //1+ return, return selection pane
                    cmp.set('v.accountList', JSON.parse(retRows));
                    cmp.set('v.selectionPane', true);
                    cmp.set('v.masterReferenced', true);
                }
            }
            else if(state === "INCOMPLETE"){
                console.log('incomplete what now');
            }
            else if (state === "ERROR"){
            	var errors = response.getError();
                if(errors){
                    console.log("Error: " + errors);
                }else{
                    console.log("??");
                }
            }
        });
        $A.enqueueAction(action);
    },
    getMasterAccountDetail : function(cmp, accountNumber){
        //once we've identified the right account, lets go get all the infos for adding to sf
        console.log("getting master acct detail from " + accountNumber);
		var action = cmp.get("c.masterGetAccountByAcctNumber");
        action.setParams({accountNumber: accountNumber});
        
        action.setCallback(this, function(response){
            var state = response.getState();
			console.log("got detail resp back");
            if(state === "SUCCESS"){
                var retRows = response.getReturnValue();
                console.log(retRows);
                
                cmp.set('v.selectedAccount', retRows);
				console.log('we did it')
                console.table(retRows);
                //call apex to create new account and contact and case
                this.getContactFromMaster(cmp, retRows);
                
                
            }else if(state === "INCOMPLETE"){
                console.log("this isn't good");
            }else if(state === "ERROR"){
                var errors = response.getError();
                if(errors){
                    console.log("Error: " + errors);
                }else{
                    console.log("??");
                }
                return null;
            }
        });
        $A.enqueueAction(action);
    },
    getContactFromMaster : function(cmp, accountRecord){
        //once we've identified the right account, lets go get all the infos for adding to sf
        console.log("getting master contact detail from " + accountRecord.cdgPartition__part_accountNumber__c);
		var action = cmp.get("c.masterGetContactByAcctNumber");
        action.setParams({accountNumber: accountRecord.cdgPartition__part_accountNumber__c});
        
        action.setCallback(this, function(response){
            var state = response.getState();
			console.log("got detail resp back");
            if(state === "SUCCESS"){
                var retRows = response.getReturnValue();
                console.table(retRows);
                var contactRecord = retRows;
                this.createRecordsFromMaster(cmp, accountRecord, contactRecord);
                //call apex to create new account and contact and case                    
                //move PageReference to the new case.
                //
                
                
            }else if(state === "INCOMPLETE"){
                console.log("this isn't good");
            }else if(state === "ERROR"){
                var errors = response.getError();
                if(errors){
                    console.log("Error: " + errors);
                }else{
                    console.log("??");
                }
                return null;
            }
        });
        $A.enqueueAction(action);
    },
    createRecordsFromMaster : function(cmp, accountRecord, contactRecord){
        //add it all to sf whee
        console.log("creating customer data " + accountRecord.cdgPartition__part_accountNumber__c);
        console.log("account");
        console.table(accountRecord);
        console.table(contactRecord);
		var action = cmp.get("c.createCustomerRecords");
        action.setParams({accountRecord: accountRecord, contactRecord:contactRecord});
        
        action.setCallback(this, function(response){
            var state = response.getState();
			console.log("got detail resp back");
            if(state === "SUCCESS"){
                var retRows = response.getReturnValue();
                console.log('OMG WE DID IT ' + retRows);
                                console.log(retRows);
            }else if(state === "INCOMPLETE"){
                console.log("this isn't good");
            }else if(state === "ERROR"){
                var errors = response.getError();
                if(errors){
                    console.log("Error: " + errors);
                }else{
                    console.log("??");
                }
                return null;
            }
        });
        $A.enqueueAction(action);
    },
    createCaseFromLocal : function(cmp, accountId){
        //string createCase(string accountID);
        console.log('creating a new case from local info');
        var action = cmp.get("c.createCase");
        action.setParams({AccountId: accountId});
        
        action.setCallback(this, function(response){
            var state = response.getState();
            if(state === "SUCCESS"){
                console.log('heading to somewhere');
                var retRows = response.getReturnValue();
                console.log(retRows);
                //window.location.replace(retRows);
            }
            else if(state === "INCOMPLETE"){
                console.log('incomplete what now');
            }
                else if (state === "ERROR"){
                    var errors = response.getError();
                    if(errors){
                        console.log("Error: " + errors);
                    }else{
                        console.log("??");
                    }
                }
        });
        $A.enqueueAction(action);
    }
})