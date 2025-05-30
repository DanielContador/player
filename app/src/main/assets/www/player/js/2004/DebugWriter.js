/*function: DebugWriter
	main function for the Debug Writer
*/
function DebugWriter(status,presentation)
{
	/*array: aryDebugText
	this array holds all of the messages to be displayed in the debug window queue
	*/
	/*array: aryDebugType
	this array holds all of the messages to be displayed in the debug window queue
	*/
	/*array: objWin
	object handle to teh debug window
	*/
	this.aryDebugText = new Array();
	this.aryDebugType = new Array();
	this.objWin = new Object();
	this.strDebugDivName = "_debug_window";
	this.strDebugToolbarDivName = "_debug_window_toolbar";
	var documentObject = new Object();
	this.status = status;
	this.presentation = presentation;
	this.createDebugWindow(this.presentation);
	
}
	
/*method: create Debug Window
	Opens up the debug window and the document for writing
*/
DebugWriter.prototype.createDebugWindow = function(presentation) 
{
if(this.status == "off") return;
		switch(presentation)
		{
			case "popup":
				winObj = window.open();
				this.documentObject = winObj.document;
			break;
			case "embed":
				this.documentObject = window.document;
			break;
			case "console":
				this.documentObject = console.debug;
				return;
			break;
			default:
				winObj = window.open();
				this.documentObject = winObj.document;
			break;
		}
		eleDiv = this.documentObject.createElement('div');
		objDiv = this.documentObject.body.appendChild(eleDiv);
		objDiv.id = this.strDebugDivName;		
		objDiv.style.visibility = "hidden";
		objDiv.style.position = "absolute";
		objDiv.style.top = "50px";
		objDiv.style.left = "10px";
		objDiv.style.border =	"1px solid black";
		objDiv.style.backgroundColor = "#CCCCCC";
        objDiv.style.color = "#000000";
		objDiv.style.width = "80%";
		objDiv.style.height = "80%";
		objDiv.style.overflow = "auto";
		objDiv.style.paddingLeft = "5px";
		objDiv.style.zIndex=9;
		objDiv.innerHTML ="";
		
		//create the bar that will hold the print/save... buttons
		eleDiv1 = this.documentObject.createElement('div');
		objDiv1 = this.documentObject.body.appendChild(eleDiv1);
		objDiv1.id = this.strDebugToolbarDivName;
		objDiv1.style.visibility = "hidden";
		objDiv1.style.position = "absolute";
		tmp1 = objDiv.style.top;
		tmp2 = tmp1.split("px")[0];
		objDiv1.style.top = tmp2 - 30;
		objDiv1.style.left = objDiv.style.left;	
		objDiv1.style.width = objDiv.style.width;
		objDiv1.style.height = objDiv.style.height;
		if(presentation == "embed")
		{
			b1 = "<button onClick='debugWriterInstance.saveDebugWindow();'>Save</button>";
			b2 = "<button onClick='debugWriterInstance.printDebugWindow();'>Print</button>";
			b3 = "<button onClick='debugWriterInstance.clearDebugWindow();'>Clear</button>";
			b4 = "<button onClick='debugWriterInstance.hideDebugWindow();'>Hide</button>";
			b5 = "<button onClick='debugWriterInstance.clearDebugQueue();'>Clear Queue</button>";
			objDiv1.innerHTML =	b1+b2+b3+b4+b5;				
		}else{
			b1 = "<button onClick='opener.debugWriterInstance.saveDebugWindow();'>Save</button>";
			b2 = "<button onClick='opener.debugWriterInstance.printDebugWindow();'>Print</button>";
			b3 = "<button onClick='opener.debugWriterInstance.clearDebugWindow();'>Clear</button>";
			b4 = "<button onClick='opener.debugWriterInstance.hideDebugWindow();'>Hide</button>";
			b5 = "<button onClick='opener.debugWriterInstance.clearDebugQueue();'>Clear Queue</button>";
			objDiv1.innerHTML =	b1+b2+b3+b4+b5;				
			this.showDebugWindow()
		}

		
		//***********************	
	
}

DebugWriter.prototype.showDebugWindow = function() 
{
	if(this.status == "off") return;
	if(this.presentation == "console") return;
	
	if(this.documentObject.getElementById(this.strDebugDivName))
	{
		this.documentObject.getElementById(this.strDebugDivName).style.visibility="visible";
		this.documentObject.getElementById(this.strDebugToolbarDivName).style.visibility="visible";
		this.documentObject.getElementById(this.strDebugDivName).innerHTML = this.displayTextInDebugWindow();
	}
}
/*method: clearDebugWindow
	Clears all messages in the debug window
*/
DebugWriter.prototype.clearDebugWindow = function()
{if(this.status == "off") return;
	this.documentObject.getElementById(this.strDebugDivName).innerHTML = "";
	
}

DebugWriter.prototype.clearDebugQueue = function()
{if(this.status == "off") return;
	this.aryDebugText = [];
	this.aryDebugType = [];
	//if the window is visible and is created then refresh it to show that there is no more data
	if(this.documentObject.getElementById(this.strDebugDivName))
	{
		if(this.documentObject.getElementById(this.strDebugDivName).style.visibility == "visible")
		{
			this.showDebugWindow();
		}
	}
}

/*method: displayTextInDebugWindow
	If the debug window exists, then write to it
*/
DebugWriter.prototype.displayTextInDebugWindow = function() 
{if(this.status == "off") return;
  var strText = "";
	for (i = 0; i < this.aryDebugText.length; i++)
	{
		switch(this.aryDebugType[i].toLowerCase())
		{
			case "debug":
				strText += "<FONT COLOR=00FF00>";
				break;
			case "warning":
				strText += "<FONT COLOR=FFFF00>";
				break;
			case "error":
				strText += "<FONT COLOR=FF0000>";
				break;
			default:
				strText += "<FONT COLOR="+this.aryDebugType[i]+">";//they must have passed in a color instead of a type
				break;
		}
		strText += this.aryDebugText[i]+"<br>";
		strText += "</FONT><BR>";
	}
	return strText;
 }

/*method: closeDebugWindow
	If the debug window exists, then close it
*/
DebugWriter.prototype.hideDebugWindow = function() 
{if(this.status == "off") return;
	if(this.documentObject.getElementById(this.strDebugDivName))
	{
		this.documentObject.getElementById(this.strDebugDivName).style.visibility="hidden";
		this.documentObject.getElementById(this.strDebugToolbarDivName).style.visibility="hidden";
	}
}

/*method: writeToDebugWindow
	adds a message to the debug window queue
	Parameters: message -text message to print to the debug window
	                     type - the type of message (error, debug, warning, [some color] ) not case sensitive 
	
*/
DebugWriter.prototype.writeToDebugWindow = function(message,type) 
{if(this.status == "off") return;
	if(message =="")return;
	if(this.presentation == "console")
	{
		console.debug(message);
		return;
	}
	this.documentObject.getElementById(this.strDebugDivName).scrollTop = this.documentObject.getElementById(this.strDebugDivName).scrollHeight;
	if(type == "" || typeof(type) == "undefined")
	{	
		type = "#000000";//default is black text
	}
	this.aryDebugText[this.aryDebugText.length] = message
	this.aryDebugType[this.aryDebugType.length] = type
	if(this.documentObject.getElementById(this.strDebugDivName).style.visibility == "visible")//if it is already visible
	this.showDebugWindow();
}
/*method: printDebugWindow
	prints the debug window
*/
DebugWriter.prototype.printDebugWindow = function()
{if(this.status == "off") return;
	alert("print disabled");
	//window.print();
}

/*method: saveDebugWindow
	This function uses the file system object (FSO) to save a text file to the user's PC (C:\\debugger.txt)
*/
DebugWriter.prototype.saveDebugWindow = function(sText)
{if(this.status == "off") return;
	try{
		var fso = new ActiveXObject("Scripting.FileSystemObject");
		var s = fso.CreateTextFile("C:\\debugger.htm", true);
		s.WriteLine(this.displayTextInDebugWindow());
		s.Close();
		alert("File was saved to C:\\debugger.htm");
	}catch(e){
		alert(e.name + "\n" + e.description + "\nThe file was not saved. \nSave uses the activeX File System Object (FSO) so please check your activeX control permissions and try again.") 
	}
}