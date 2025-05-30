/*var configCustom = {
    scoLaunchType: 1,
    showCourseCertificate: false,
    storageMediaType: "server",
    saveDataOnSetValue: true,
    saveDataOnCommit:true,
    courseBaseHtmlPath: "courses/",
    //getDataURL: "http://localhost/~andresfsantamarian/SSLA/ssla/server/get.php",
    //setDataURL: "http://localhost/~andresfsantamarian/SSLA/ssla/server/set.php",
    checkObjectiveId:true,
    checkInteractionId:true,
    //convertStudentName:true,
    autoLaunchFirstSCO:true,
    
    //debuggerStatus:"on",
    //debuggerLaunchType:"console"
};*/

var configCustom = {
    /*scoLaunchType: 1,
    showCourseCertificate: false,
    storageMediaType: "server",
    //saveDataOnSetValue: false,
    //saveDataOnCommit:true,
    courseBaseHtmlPath: "courses/",
    getDataURL: "http://localhost/~andresfsantamarian/SSLA/ssla/server/get.php",
    setDataURL: "http://localhost/~andresfsantamarian/SSLA/ssla/server/set.php",
    checkObjectiveId:true,
    checkInteractionId:true,*/
    //convertStudentName:true,
    autoLaunchFirstSCO:false,

    //debuggerStatus:"on",
    //debuggerLaunchType:"console"
};

/*
configCustom.getStudentIdOverrideFn = function() {
    return objVars["Student_Number"];
};

configCustom.getStudentNameOverrideFn = function() {
    return objVars["First_Name"] + " " + objVars["Last_Name"];
};

var ssla = (function (ssla) {
    if (!ssla) {
        ssla = {};
    }
    if (!ssla.storageLayers) {
        ssla.storageLayers = {};
    }

    ssla.storageLayers.cardioPartners = {
        load: function (callback, name, scormVersion) {
            if (name == "toc_data" || name == "initialize" || name == "finish") return;

            reqwest({
                url: config.getDataURL,
                method: config.ajaxType,
                type: "json",
                async: true,
                data: {
                    "Student_Number": getStudentId()
                },
                success: function (value) {
                    // If you return an empty response, reqwest gives you the XMLHttpRequest object as the first param.
                    debugWriter.writeToDebugWindow("in storage.load server returned value = " + value);
                    if (typeof(value) == "undefined" || !value ||
                        "responseText" in value ||
                        "responseXML" in value) {
                        value = {};
                    }
                    returnFromAjaxScorm12Course(value);
                },
                error: function (request, status, error) {
                    console.log(request, status, error);
                    debugWriter.writeToDebugWindow("in storage.load error retrieving data from server.");
                    alert("error in get ajax" + request + "," + status + "," + error);
                    returnFromAjaxScorm12Course(null);
                }
            });
        },
        save: function (callback, name, value) {
            if (name == "toc_data" || name == "initialize" || name == "finish") return;
            //calculate status
            var status = "", scorm_data = "";
            if (value.indexOf("cmi.core.lesson_status") != -1) {
                scorm_data = JSON.parse(value);
                status = scorm_data["cmi.core.lesson_status"];
            }
            else {
                status = "unknown";
            }

            reqwest({
                url: config.setDataURL,
                method: config.ajaxType,
                async: config.ajaxAsync,
                timeout: 5000,
                data: {
                    "SCORM_DATA": value + "",
                    "Student_Number": getStudentId(),
                    "Status": status + ""
                },
                success: function (msg) {
                    // alert( "Data Saved: " + msg );
                },
                error: function (msg) {
                    // alert( "Oops - something happened: " + msg);
                    // alert( "Data Saved: " + msg );
                },
                complete: function () {
                }
            });
        },
        saveDiff: function (callback, name, value) {
            alert("ssla.storage.server.saveDiff not supported.");
        }
    };

    return ssla;
})(ssla);
*/