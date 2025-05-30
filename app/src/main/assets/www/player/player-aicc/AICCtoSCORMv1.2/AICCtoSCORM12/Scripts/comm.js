var contentWin = null;
var ADContent = null;
var contentURL = "http://www.trafficrefreshers.com/trainee/initLmsUser.php";
var queryHREF;
var comm_content_location = "http://www.jcasolutions.com/AICCtoSCORMComm/AICCtoSCORMComm.php";
var debugging = false;
var sid;

function InitializeCommunication()
{
	window.moveTo(0,0);
	window.resizeTo(screen.width,screen.height);
	doLMSInitialize(); 
	GetContentPath();
	
	/*
	  * TODO: Get all the necessary info from the LMS needed to initialize communication with the ALertDriving content
	  */
	
	if(debugging) document.write("Gathering Required Data from LMS");
			
			// leaner's session information
			var student_id = doLMSGetValue("cmi.core.student_id");
			var student_name = doLMSGetValue("cmi.core.student_name");
			var credit = doLMSGetValue("cmi.core.credit");
			var lesson_status = doLMSGetValue("cmi.core.lesson_status");
			var time = doLMSGetValue("cmi.core.total_time"); 
			var score = doLMSGetValue("cmi.core.score.raw");
			
			if(debugging) document.write("SCORM 1.2 data model elements read: </br>" 
										 + "cmi.core.student_id = " + student_id
										 +" </br> cmi.core.student_name = " + student_name
										 + "</br> cmi.core.credit = " + credit
										 + "</br>cmi.core.lesson_status = " + lesson_status
										 + "</br> cmi.core.total_time = " + time
										 + "</br> cmi.core.score.raw = " + score + " </br>");
				
			// lesson has not been attempted beore
			if (lesson_status == "not attempted")
			{
				// setting lesson_status to incomplete
				doLMSSetValue("cmi.core.lesson_status", "incomplete");
				lesson_status = doLMSGetValue("cmi.core.lesson_status");
				
				if(debugging) document.write("cmi.core.lesson_status is not attempted, setting to incomplete </br>");
				if(debugging) document.write("cmi.core.lesson_status = " + lesson_status + "</br>");
			}
			
			var spacer = ""
			// build GetParam Query String
			returnQueryString = "student_ID = "+ student_id +"\nstudent_name = "+ student_name +"\nlesson_location = " 
								+ "\ncredit = "+ credit +"\nlesson_mode = "+ spacer +"\nlesson_status = "+ lesson_status +"\ntime = "+ time +"\nscore = "+ score;
			
			// unique session identifier
			sid = student_id + "_" + generateTimeDateStamp();
			
			contentURL += "?AccessCode=jCA50lut10ns&CoCourseID=1&LessonID=2&LanguageTypeID=1&aicc_sid=" + sid + "&aicc_url="+ comm_content_location;
			
			queryHREF = comm_content_location + "?command=init&session_id=" + sid + "&aicc_data=%3B%0D%0A%3B%20Finish%20File%0D%0A%3B%0D%0A%5BCORE%5D%0D%0A" + encode(returnQueryString) + "&content_loc=" + contentURL + "&stId=" + student_id ;
}

function Exit()
{
	// close the communication window
	if(contentWin != null)
		contentWin.close();
	
	// close the AlertDriving content window
	if(ADContent != null)
		ADContent.close();
		
	// terminate connection with LMS
	doLMSFinish();
}

function CloseCommunication()
{
	/*
	  * Dynamically create a script tag and read the infortion from the js file written by the PHP comm file
	  */
	ReadJsDataFromComm();
	
	// make sure all data is committed to the LMS
	doLMSCommit();
	
	contentWin = window.open(comm_content_location + "?terminate=" + sid, null, "menubar=no, resizable=no, width=700, height=300");
	
	alert("Data Reading has completed you may exit now.");
}

function GetContentPath()
{
	if(contentURL == "" || contentURL == null)
	{
		contentURL = prompt("Enter Content URL Path.", "Enter path here.");
		
		if(contentURL == null) 
		{
			GetContentPath();
		}
	}
}

function LaunchCommWindow()
{
	if(contentWin == null && ADContent == null)
	{
		contentWin = window.open(queryHREF, null, "menubar=no, resizable=no, width=700, height=300");
		ADContent = window.open(contentURL, "content");
	}
	
	var t = setTimeout("closeCommWin()", 5000);
}

function closeCommWin()
{
	contentWin.close();
}

function encode(str) 
{
	return escape(str);
}

function ReadJsDataFromComm()
{
	dhtmlLoadScript();
}

function dhtmlLoadScript()
{
    var e = document.createElement("script");
    e.src = "http://www.jcasolutions.com/AICCtoSCORMComm/js/" + sid + "_contentData.js";
    e.type="text/javascript";
    document.getElementsByTagName("head")[0].appendChild(e); 
}

function generateTimeDateStamp()
{
	var curDateTime = new Date();
	var curHour = curDateTime.getHours();
	var curMin = curDateTime.getMinutes();
	var curSec = curDateTime.getSeconds();
	var curTime = "";
	if (curHour >= 12)
	{
		curHour -= 12;
    }
	if (curHour == 0) curHour = 12;
	curTime = curHour + "_" + ((curMin < 10) ? "0" : "") + curMin + "_" + ((curSec < 10) ? "0" : "") + curSec; 
	
	var today = new Date();
	var year = today.getYear();
	if(year<1000) year+=1900;
	 
	var date = (today.getMonth()+1) + "_" + today.getDate() + "_" + (year+"").substring(2,4);

	return date + "_" + curTime;
}
