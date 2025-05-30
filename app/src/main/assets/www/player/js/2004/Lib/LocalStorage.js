Type.createNamespace('LocalStorage');
LocalStorage.Storage = function () {
	//this is hard coded for nos to work only with servers. Cookie support will be added back in later.
	this.hasSupport = true;
	this.blnHasKey = g_blnHasKey;
}
LocalStorage.Storage.prototype = {
    localStoreHandle: null,
    hasSupport: false,
    isSupported: function () {
        return this.hasSupport;
    },
    get_length: function () {
		
    },
    setItem: function (key, value) {
		
    },
    setObjectItem: function (key, value, strCurrentActivityId) {
        /*
			key: scormData
			value: JSON SCORM data
		*/
		
		if(g_initSCORMData != "")g_initSCORMData = value;
		//create a new string of just the SCO related bits
		var val = ScriptFX.JSON.serialize(value)
		
		//returns all activities in the course
		/*
		objCMI = findSomething(value,"cmi");
		for(i in objCMI)
		{
			console.log(objCMI);
			
		}
		*/
		//FYI:the SCO specific data is sent to the web service from Player.js line 567
		//utilsInstance.SetCookie(key,ScriptFX.JSON.serialize(objCMI),"","","","");
		
		//console.log(key +":"+val)
		utilsInstance.SetCookie(key,val,"","","","");

    },
    getItem: function (key) {

    },
    getObjectItem: function (key) {
	/*
		returns the object form of the requested key
	*/
		return g_initSCORMData;
    },
    removeItem: function (key) {
        
    },
    clear: function () {
        utilsInstance.SetCookie('scormData',"","","","","");
    },	
    key: function (n) {
        
    },
    hasKey: function (key) {
		/*
			this value is set after the ajax returns from the first POST request to check the data on the server.
		*/
		return this.blnHasKey;
    }
}
LocalStorage.Storage.createClass('LocalStorage.Storage');

function findSomething(object, name) {
  try{if (name in object) return object[name]}catch(e){};
  try{
  for (key in object) {
    if ((typeof (object[key])) == 'object') {
      var t = findSomething(object[key], name);
      if (t) return t;
    }
  }
  }catch(e){
  return null;
  }
  return null;
}