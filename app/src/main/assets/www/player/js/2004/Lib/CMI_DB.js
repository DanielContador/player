function CMI_DB()
{
	this.local_data = new Object();
	
	this._setLocalData = function(name,value)
	{
		try{
			this.local_data[name] = value;
			debugWriterInstance.writeToDebugWindow("_setLocalData " + name + "=" + value , "blue");
			return "true";
		}catch(e){
			debugWriterInstance.writeToDebugWindow("ERROR: _setLocalData " + e.description, "red");
			return "false";
		}
	}
}
CMI_DB.prototype.callSetValue = function(data_model_element, element_value) 
{
	this._setLocalData(data_model_element,element_value);
}

CMI_DB.prototype.callCommit = function() 
{
	return this.toDB()
}

CMI_DB.prototype.toDB = function() {
	debugWriterInstance.writeToDebugWindow("CMI_DB.prototype.toDB() " + JSON.stringify(this.local_data),"blue");
	return JSON.stringify(this.local_data);
}