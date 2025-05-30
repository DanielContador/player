
function Utils()
{   

}
Utils.prototype.readFileContents = function(file)
{
	$.get(file, function(data) {
		return data;
    });
}
Utils.prototype.fileExists = function(file)
{
	$.ajax({
		url:file,
		error: function()
		{
			return false;
		},
		success: function()
		{
			return true;
		}
	});

}

Utils.prototype.StringtoXML =  function(text)
{
	if (window.ActiveXObject){
	  var doc=new ActiveXObject('Microsoft.XMLDOM');
	  doc.async='false';
	  doc.loadXML(text);
	} else {
	  var parser=new DOMParser();
	  var doc=parser.parseFromString(text,'text/xml');
	}
	return doc;
}
Utils.prototype.openPage = function(strPageLocation, strWhere, windowName, settings)
{
	/*get a handle to the window*/
	/*strWhere = popup or self*/
	switch(strWhere)
	{
		case "self":
			document.location.href = strPageLocation;
			break;
		case "popup":
			if(settings)
			{
				var popUp = window.open(
				strPageLocation, 
				windowName, settings);
			}else{
				var popUp = window.open(strPageLocation,windowName);
			}
			if (popUp == null || typeof(popUp)=='undefined') {  
			  alert('Please disable your pop-up blocker and click the link again.'); 
			} 
			else {  
			  popUp.focus();
			}
			break;
	}
}
Utils.prototype.positionDivLayer = function(layer,direction,position)
{
	if( typeof(layer) == "undefined" )
	{
		alert("Parameter \'layer\' is not defined. Must be a string");
		return;
	}
	if( typeof(direction) == "undefined" )
	{
		alert("Parameter \'direction\' is not defined. Must be a string");
		return;
	}
	if( typeof(position) == "undefined" )
	{
		alert("Parameter \'position\' is not defined. Must be a string");
		return;
	}
	
	try{
		eval("document.getElementById(\""+layer+"\").style." + direction + " = " + "'" + position + "'");
	}catch(e){
		alert("An error occured while trying to move " + layer + ".\nEither the layer does not exist or the content of the page has not completely loaded."); 
	}
	return;
}
Utils.prototype.openDivLayer = function(layer,text,openType)
{
	if( typeof(layer) == "undefined" )
	{
		alert("Parameter \'layer\' is not defined. Must be a string");
		return;
	}
	if( typeof(text) == "undefined" )
	{
		alert("Parameter \'text\' is not defined. Must be a string");
		return;
	}
	if( typeof(openType) == "undefined" )
	{
		alert("Parameter \'openType\' is not defined. Must be a string");
		return;
	}
	var operator = "=";
	/*write text to a div layer writeType(read,write,append,hide,show)*/
	switch(openType)
	{
		case "read":
			//text property is ignored in reading data
			try{
			return document.getElementById(layer).innerHTML;
			}catch(e){
				alert("An error occured while trying to read from " + layer + ".\nEither the layer does not exist or the content of the page has not completely loaded."); 
				return "";
			}
		break;
		case "write":
			operator = "=";
		break;
		case "append":
			operator = "+=";
		break;
		case "hide":
			try{
				document.getElementById(layer).style.visibility="hidden";
			}catch(e){
				alert("An error occured while trying to hide " + layer + ".\nEither the layer does not exist or the content of the page has not completely loaded."); 
			}
			return;
		break;
		case "show":
			try{
				document.getElementById(layer).style.visibility="visible";
			}catch(e){
				alert("An error occured while trying to show " + layer + ".\nEither the layer does not exist or the content of the page has not completely loaded."); 
			}
			return;
		break;
		default:
			alert("The requested operation " + openType + " can not be performed");
		break;
	}
	try{
		eval("document.getElementById(\""+layer+"\").innerHTML" + operator + "'" + text + "'");
	}catch(e){
		alert("An error occured while trying to " + openType + " to " + layer + ".\nEither the layer does not exist or the content of the page has not completely loaded.\n The following action failed \n" + "document.getElementById(\""+layer+"\").innerHTML" + operator + "'" + text + "'"); 
		return "";
	}

	
}

Utils.prototype.parseQueryString = function(queryString)
{	
	// define an object to contain the parsed query data
	var result = {};
	var origQueryString = queryString; 
	//if the query string still has the ?, check to see if it still has the URL attached to it. if so then strip off the URL
	if(queryString.indexOf("?") != -1)
	{
		if(queryString.split("?")[0])
		{
			queryString = queryString.split("?")[1];
		}
	}
	// remove the leading question mark from the query string if it is present
	if (queryString.charAt(0) == '?') queryString = queryString.substring(1);
	
	// replace plus signs in the query string with spaces
	queryString = queryString.replace('+', ' ');


	
	// split the query string around ampersands and semicolons
	var queryComponents = queryString.split(/[&;]/g);
	
	// loop over the query string components
	
	for (var i = 0; i < queryComponents.length; i++)
	{
		// extract this component's key-value pair
		if(queryComponents[i].indexOf('=') != -1)
		{
			var keyValuePair = queryComponents[i].split('=');
			var key = this.decode(keyValuePair[0]);
			var value = this.decode(keyValuePair[1]);
			// update the parsed query data with this component's key-value pair
			if (!result[key]) result[key] = [];
			result[key].push((keyValuePair.length == 1) ? '' : value);
		}else{
			//if we are are here the either there is no querystring or there is just a "?" and nothing else
			if(origQueryString.indexOf("?") != -1)
			{
				result["NULL"] = []
				result["NULL"].push(origQueryString.split("?")[1]);
			}else{
				alert("no querystring contained in \n " + queryComponents + " loaded from " + document.location.href)
				return "";
			}
		}
	}
	
	// return the parsed query data
	return result;	
}

Utils.prototype.jcaDecodePath = function(p)
{
	p = p.replace(/\[0\]/g,'&nbsp;');
	p = p.replace(/\[1\]/g,'&');
	p = p.replace(/\[2\]/g,'?');
	p = p.replace(/\[3\]/g,'=');
	return p;
}
Utils.prototype.jcaEncodePath = function(p)
{
	p = p.replace(/&nbsp;/g,'[0]');
	p = p.replace(/\&/g,'[1]');
	p = p.replace(/\?/g,'[2]');
	p = p.replace(/\=/g,'[3]');
	return p;
}

Utils.prototype.decode = function(str) 
{
	return unescape(str.replace(/\+/g,  " "));
}

Utils.prototype.jcaEncrypt = function(inp) 
{
	num_out = "";
	str_in = escape(inp);
	for(i = 0; i < str_in.length; i++) {
	num_out += str_in.charCodeAt(i) - 23;
	}
	return num_out;
}


Utils.prototype.jcaDecrypt = function(inp) 
{
	str_out = "";
	num_out = inp;  
	for(i = 0; i < num_out.length; i += 2) {
	num_in = parseInt(num_out.substr(i,[2])) + 23;
	num_in = unescape('%' + num_in.toString(16));
	str_out += num_in;
	}
	return unescape(str_out);

}

Utils.prototype.parseDelimitedText = function(strDelimiter,strText)
{	
	if(strDelimiter == "")return;
	if(strText == "")return;
	var aryReturn = new Array();
	
	if(strText.indexOf(strDelimiter) != -1)
	{
		aryReturn = strText.split(strDelimiter);
	}else{
		aryReturn[0] = "";
	}
	return aryReturn;	
}

/* dump
====================================================================================================
single method dump() takes in an object generated by the XMLparser and the number of levels to traverse it as paremeters
	This method returns a formatted string.
====================================================================================================
*/
 Utils.prototype.dump = function(obj, name, indent, depth) {
              if (typeof obj == "object") {

                     var child = null;

                     var output = indent + name + "[n]";

                     indent += "[t]";

                     for (var item in obj)
                     {
                           try {
                                  child = obj[item];
                           } catch (e) {
                                  child = "<Unable to Evaluate>";
                           }
                           if (typeof child == "object") {
                                  output += this.dump(child, item, indent, depth + 1);
                           } else {
                                  output += indent + item + ": " + child + "[o]";
                           }
                     }
                     return output;
              } else {
                     return obj;
              }
			
			 
       }
//
//  Cookie Functions -- "Night of the Living Cookie" Version (25-Jul-96)
//
//  Adapted From:  Bill Dortch, hIdaho Design <bdortch@hidaho.com>

Utils.prototype.getCookieVal = function(offset) {
  var endstr = document.cookie.indexOf (";", offset);
  if (endstr == -1)
    endstr = document.cookie.length;
  return unescape(document.cookie.substring(offset, endstr));
}
//
//  Function to correct for 2.x Mac date bug.  Call this function to
//  fix a date object prior to passing it to SetCookie.
//  IMPORTANT:  This function should only be called *once* for
//  any given date object!  See example at the end of this document.
//

Utils.prototype.FixCookieDate = function(date) {
  var base = new Date(0);
  var skew = base.getTime(); // dawn of (Unix) time - should be 0
  if (skew > 0)  // Except on the Mac - ahead of its time
    date.setTime (date.getTime() - skew);
}

//
//  Function to return the value of the cookie specified by "name".
//    name - String object containing the cookie name.
//    returns - String object containing the cookie value, or null if
//      the cookie does not exist.
//

Utils.prototype.GetCookie = function(name,n) {
debugWriterInstance.writeToDebugWindow("in GetCookie() getting cookie " + name);

switch(configInstance.storageMediaType)
{
	case "cookie":
		debugWriterInstance.writeToDebugWindow("in GetCookie() getting data from cookie.");
		var arg = name + "=";
		var alen = arg.length;
		var clen = document.cookie.length;
		var i = 0;
		while (i < clen) 
		{
			var j = i + alen;
			if (document.cookie.substring(i, j) == arg)
			returnFromAjax(this.getCookieVal(j))
			return 
			i = document.cookie.indexOf(" ", i) + 1;
			if (i == 0) break; 
		}
		return returnFromAjax(null);
	break;
	case "server":
		debugWriterInstance.writeToDebugWindow("in GetCookie() getting data from server.");
		$.ajax({
			url		: configInstance.getDataURL,
			type: configInstance.ajaxType,
			dataType: "json",
			async: true,
			data		: {
			"data_name": name,
			"ee_trans_id": configInstance.ee_trans_id,
			"timestamp": new Date().getTime()
			},
		success: function(value){
			debugWriterInstance.writeToDebugWindow("in GetCookie() server returned value = " + value);
			if(typeof(value) == "undefined" || value == "undefined" || !value){value="";}
			if(n == "2004")
			{
				returnSCORMData(value);
			}
		   },
		error: function(request, status, error) {
			debugWriterInstance.writeToDebugWindow("in GetCookie() error retrieving data from server.");
			alert("error in get ajax" + request + "," +  status +"," + error);
			//returnFromAjax(null);
			}
		});

	break;
	case "fso":
		//not used at thsi time
		debugWriterInstance.writeToDebugWindow("in GetCookie() getting data from fso.");
	break;
	default:
		debugWriterInstance.writeToDebugWindow("in GetCookie() improper configInstance.storageMediaType defined.");
	break;
}

}

Utils.prototype.SetCookie = function(name,value,expires,path,domain,secure) {
switch(configInstance.storageMediaType)
{
	case "cookie":
		document.cookie = name + "=" + escape (value) +
		((expires) ? "; expires=" + expires.toGMTString() : "") +
		((path) ? "; path=" + path : "") +
		((domain) ? "; domain=" + domain : "") +
		((secure) ? "; secure" : "");	
	break;
	case "server":
	$.ajax({
		url		: configInstance.setDataURL,
		type: configInstance.ajaxType,
		dataType: "json",
		async: true,
		data		: {
		"data_name": name,
		"data_value": value,
		"ee_trans_id": configInstance.ee_trans_id,
		"timestamp": new Date().getTime()
		},
	success: function(msg){
		// alert( "Data Saved: " + msg );
	   },
	error: function(msg){
		 // alert( "Oops - something happened: " + msg);
		 // alert( "Data Saved: " + msg );
	   }
	});
	break;
	case "fso":
		//not used at thsi time
	break;
}
}

Utils.prototype.DeleteCookie = function(name,path,domain) {
  if (this.GetCookie(name)) {
    document.cookie = name + "=" +
      ((path) ? "; path=" + path : "") +
      ((domain) ? "; domain=" + domain : "") +
      "; expires=Thu, 01-Jan-70 00:00:01 GMT";
  }
}

//
//  Examples - Unremark if you want to see how this code works
/*
var expdate = new Date ();
FixCookieDate (expdate); // Correct for Mac date bug - call only once for given Date object!
expdate.setTime (expdate.getTime() + (24 * 60 * 60 * 1000)); // 24 hrs from now 
SetCookie ("ccpath", "http://www.hidaho.com/colorcenter/", expdate);
SetCookie ("ccname", "hIdaho Design ColorCenter", expdate);
SetCookie ("tempvar", "This is a temporary cookie.");
SetCookie ("ubiquitous", "This cookie will work anywhere in this domain",null,"/");
SetCookie ("paranoid", "This cookie requires secure communications",expdate,"/",null,true);
SetCookie ("goner", "This cookie must die!");
document.write (document.cookie + "<br>");
DeleteCookie ("goner");
document.write (document.cookie + "<br>");
document.write ("ccpath = " + GetCookie("ccpath") + "<br>");
document.write ("ccname = " + GetCookie("ccname") + "<br>");
document.write ("tempvar = " + GetCookie("tempvar") + "<br>");
*/
// -->