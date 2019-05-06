({
    doInit: function(cmp) {
        var pageURL = window.location.href; //get the whole decoded URL of the page.
        
		if(pageURL.indexOf("?") != -1){ // Only attempt this if we got parameters. If not, this fittin to break
			var rePrefix = new RegExp('c__', "g");
			var dubUnderscore = new RegExp('DBLUND', "g");
			var params = pageURL.slice((-(pageURL.length - pageURL.indexOf("?"))+1));
			params =  params.replace(rePrefix,''); //remove fake prefix - see aura documentation for details
			params = params.replace(dubUnderscore,'__'); // even more replacing for double underscores
	        var URLVariables = params.split('&'); //Split by & so that you get the key value pairs separately in a list
	        var i;
	        var oppId;

	        var recordParams = {};
	        recordParams.defaultFieldValues = {};
	        var defFieldValues = {}; // This object holds the field key/value pairs
	        var objectType = '';
	        var userSelectRecType = false;
	        
	        for (i = 0; i < URLVariables.length; i++) {
	            var parameterPair = URLVariables[i].split('='); //to split the key from the value.

	            if(parameterPair[1] !== ''){ // If you didn't get a value don't try to add the value pair. Salesforce will get mad if you pass a blank string.

					if(parameterPair[0] === 'Object'){ 						// If the URL param is called "Object", this is the object that we are populating
		            	recordParams.entityApiName = parameterPair[1]; 		// Set the entity Api Name to whatever object we are dealing with
		            	objectType = parameterPair[1];
		            } else if(parameterPair[0] === 'ReturnRecId'){
		            	cmp.set('v.returnRecordId',parameterPair[1]);
		            } else if(parameterPair[1] != 'null'){					// Otherwise, we must be dealing with a field parameter
		            	if(parameterPair[1].toUpperCase() === 'TRUE'){		// Check to see if we are trying to default a checkbox to true
		            		defFieldValues[parameterPair[0]] = true;		// If so, we need to pass a boolean instead of a string
		            	} else {											// If we aren't dealing with boolean, we should just be putting a string in
                            defFieldValues[parameterPair[0]] = decodeURIComponent(parameterPair[1]).replace(/xxapostrophexx/g,'\'');// In that case, add the param name and value to the defFieldValues object
		            	}
		            }
		        }
		    } 
	        recordParams.defaultFieldValues = defFieldValues; // Set the "defaultFieldValues" attribute with the javascript object we built to hold the fields and values
			
			var createNewRecord = $A.get("e.force:createRecord");
			createNewRecord.setParams(recordParams);
			createNewRecord.fire();
	    }
    },

    goBack : function(component, event, helper) {
    	var recId = component.get('v.returnRecordId');

    	var navEvt = $A.get("e.force:navigateToSObject");
	    navEvt.setParams({
	      "recordId": recId,
	      "isredirect": true
	    });
	    navEvt.fire();
		
    }
})