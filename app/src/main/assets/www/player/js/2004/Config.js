var Config = function()
{
	var utilsInstance = {};
	var objVars = {};
	try{
		utilsInstance = new Utils();
		objVars = utilsInstance.parseQueryString(document.location.href);
	}catch(e){}
	//NOTE: variables with a *** directly after them in the comment have not been implemented yet
	/**
	 * Global variable API object instance of class scorm12API
	 * @required The identifier for the current course. Should be nuique for each course.
	 * @type String
	 */
	this.ee_trans_id = objVars['courseId'] + "";
	this.studentName = objVars['studentName'] + "";
	this.studentId = objVars['studentId'] + "";
	/**********************************************************************************************************************
	Navigation Controls
	**********************************************************************************************************************/
	/**
	 * The identifier for the current course. Should be nuique for each course.
	 * @type String
	 */
	this.showSCOtoSCONavigation = true; //only works with this.scoLaunchType = 1;
	this.previousActivityText = "Previous Activity";
	this.nextActivityText = "Next Activity";
	
	/**********************************************************************************************************************
	Launch Controls
	**********************************************************************************************************************/
	this.scoLaunchType = 1;
	/*
	1- frameset
	2- new window
	*/
	
	this.hideTOC = false;//set to true if you want to hide the table of contents when you are launching using scoLaunchType=1. If you are setting this to true it make sense to also set this.autoLaunchFirstSCO = true;
	this.autoLaunchFirstSCO = true;
	/*
	Set to true if you want to automatically launch the first SCO in the manifest when the course loads.
	*/
	
	this.newWindowSettings = Array("width=1024","height=768");
	/*
	If you set scoLaunchType to 2 then this variable will be taken into account.
	List the property and the value for that property in the array
	Example:
	newWindowSettings = Array("toolbar=yes","scrollbar=yes","width=1024",height=768");
	*/

	/**********************************************************************************************************************
	Debug Options
	**********************************************************************************************************************/
	this.debuggerStatus = "on"; //set to either on or off. Must be set to on for other variables in this section to work
	this.debuggerLaunchType = "console"; //this is the only option at the moment, do not change.

	/**********************************************************************************************************************
	Course Completion
	**********************************************************************************************************************/
	this.showCourseCompletionStatus = true;//***
	this.showCourseSuccessStatus = true;//***
	this.showCourseGrade = true;//***

	/**********************************************************************************************************************
	Course Information
	**********************************************************************************************************************/
	this.courseRootDirectory = objVars['courseDirectory'];
	this.scormManifestFileName = "imsmanifest.xml";
	this.courseBaseHtmlPath = (location.origin).concat("/")
	/**********************************************************************************************************************
	Data Storage
	**********************************************************************************************************************/
	this.storageMediaType = "server";//cookie, fso, server : this is the only option at the moment, we will be adding FLASH FSO Soon
	//if server is selected fil in the other items below
	this.ajaxType = "POST";//POST, GET
    this.setDataURL = "/track/set";
    this.getDataURL = "/track/get";
	this.tocDataObjectName = "toc_data";//this is the name that will be used for the object that stores the information about the state of the table of contents
	
	/**********************************************************************************************************************
	Course Table of Contents display
	**********************************************************************************************************************/
	this.tocDisplayType = "ullistview";//set to "debugview" to visually show the indenting usign the ">" character
										//set to "ullistview" to see the unordered list (UL) view
										//NOT IMPLEMENTED YET set to "treeview" to see the tree complete with expandable menus
	this.tocStatusImages = new Object()
	this.tocStatusImages["completed"] = "images/status/completed.gif";
	this.tocStatusImages["incomplete"] = "images/status/incomplete.gif";	
	this.tocStatusImages["unknown"] = "images/status/unknown.gif";
	this.tocStatusImages["not_attempted"] = "images/status/unknown.gif";
	this.tocStatusImages["passed"] = "images/status/passed.gif";	
	this.tocStatusImages["failed"] = "images/status/failed.gif";	

	this.activeItemHighlightColor = "#83f84f";
	/**********************************************************************************************************************
	Course Certificate
	**********************************************************************************************************************/
	this.showCourseCertificate = false;
	/*
		true - show
		false - dont show
	*/
	this.courseCertThresholdScore = 0;
	/*
	Useful only if showCourseCertificate is set to 4
	*/
	
	/******************************************
	SCORM Variables
	*******************************************/
	this.completeContentOnExit = false;//set this to true if you want the content o be automatically set to completed when it is exited.
	this.setInitializeToLMS = true; // set this to true if you want your server to receive an AJAX POST when the course inintializes the SCORM session
	this.setFinishToLMS = true; // set this to true if you want your server to receive an AJAX POST when the course finishes the SCORM session
}