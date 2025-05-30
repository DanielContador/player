g_persistSCORMData = "";
g_currentActivity = "";
Type.createNamespace('Player');
Player.ScormVersion = function () {};
Player.ScormVersion.prototype = {
    v00: 0,
    v12: 1,
    v13: 2
};
Player.ScormVersion.createEnum('Player.ScormVersion', false);
Player.PersistentStateStorage = function (organizationIdentifier) {
    this.objLocalStorage = new LocalStorage.Storage();//this.$0
    if (!this.objLocalStorage.isSupported()) {
        this.blnLocalStorageSupported = false;//this.$2
        alert('Error! Local Storage is not supported on this browser!');
        return;
    }
    if (!isNullOrUndefined(organizationIdentifier)) {
        this.strOrgId = organizationIdentifier;//this.$1
    } else {
        this.strOrgId = 'unknown';
    }
    var objItem = {};//$0
    if (!this.objLocalStorage.hasKey('scormData')) {
        objItem['organizations'] = {};
        objItem['globalobjectives'] = {};
    } else {
        objItem = this.objLocalStorage.getObjectItem('scormData');
    }
    var _organizations = objItem['organizations'];//$1
    var objKey;//$2
    if (!Object.keyExists(_organizations, this.strOrgId)) {
        objKey = {};
        _organizations[this.strOrgId] = objKey;
    } else {
        objKey = _organizations[this.strOrgId];
    } if (!Object.keyExists(objKey, 'resumeallidentifier')) {
        objKey['resumeallidentifier'] = null;
    }
    if (!Object.keyExists(objKey, 'suspendedglobalobjectives')) {
        objKey['suspendedglobalobjectives'] = null;
    }
    if (!Object.keyExists(objKey, 'statuses')) {
        objKey['statuses'] = {};
    }
    if (!Object.keyExists(objKey, 'cmi')) {
        objKey['cmi'] = {};
    }
    if (!Object.keyExists(objKey, 'adldata')) {
        objKey['adldata'] = {};
    }
    this.saveData(objItem);
    this.blnLocalStorageSupported = true;
};
Player.PersistentStateStorage.prototype = {
    $0: null,
    $1: null,
    $2: false,
	//$3:saveData
    saveData: function (data) {
        //try {
            this.objLocalStorage.setObjectItem('scormData', data);
			g_persistSCORMData = data;
			
			//data to LMS
			//returns only the activity that the student is currently viewing
			if(g_currentActivity != ""){
			objCMI = findSomething(g_persistSCORMData,g_currentActivity);
			//objCMI = g_persistSCORMData;
			console.log(objCMI);
			}
            this.blnLocalStorageSupported = true;
       // } catch (e) {
       //     alert('Error! Can\'t save data to Local Storage. Problem can be related to storage size limit.');
        //    this.blnLocalStorageSupported = false;
        //}
    },
    isSupported: function () {
        return this.blnLocalStorageSupported;
    },
    getAllStatus: function () {
        var objLS = this.objLocalStorage.getObjectItem('scormData');//$0
        var arrayOrgs = objLS['organizations'];//$1
        var objOrg = arrayOrgs[this.strOrgId];//$2
        return objOrg['statuses'];
    },
    getResumeAllIdentifier: function () {
        var objLS = this.objLocalStorage.getObjectItem('scormData');
        var arrayOrgs = objLS['organizations'];
        var objOrg = arrayOrgs[this.strOrgId];
        return objOrg['resumeallidentifier'];
    },
    getSuspendedGlobalObjectives: function () {
        var objLS = this.objLocalStorage.getObjectItem('scormData');
        var arrayOrgs = objLS['organizations'];
        var objOrg = arrayOrgs[this.strOrgId];
        return objOrg['suspendedglobalobjectives'];
    },
    getADLData: function () {
        var objLS = this.objLocalStorage.getObjectItem('scormData');
        var arrayOrgs = objLS['organizations'];
        var objOrg = arrayOrgs[this.strOrgId];
        return objOrg['adldata'];
    },
    saveState: function (adlData, stasuses, globalObjectives, resumeAllIdentifier, suspendedGlobalObjectives) {
        var objLS = this.objLocalStorage.getObjectItem('scormData');
        var arrayOrgs = objLS['organizations'];
        var objOrg = arrayOrgs[this.strOrgId];
        if (!isNullOrUndefined(globalObjectives)) {
            objLS['globalobjectives'] = globalObjectives;
        }
        objOrg['resumeallidentifier'] = resumeAllIdentifier;
        objOrg['suspendedglobalobjectives'] = suspendedGlobalObjectives;
        objOrg['adldata'] = adlData;
        objOrg['statuses'] = stasuses;
        this.saveData(objLS);
    },
    saveItemCMI: function (itemIdentifier, dataTree) {
        var objLS = this.objLocalStorage.getObjectItem('scormData');
        var arrayOrgs = objLS['organizations'];
        var objOrg = arrayOrgs[this.strOrgId];
        (objOrg['cmi'])[itemIdentifier] = dataTree;
        this.saveData(objLS);
    },
    getItemCMI: function (itemIdentifier) {
        var objLS = this.objLocalStorage.getObjectItem('scormData');
        var arrayOrgs = objLS['organizations'];
        var objOrg = arrayOrgs[this.strOrgId];
        var _cmi = (objOrg['cmi'])[itemIdentifier];
        return (_cmi == null) ? {} : _cmi;
    },
    getAllObjectivesGlobaltoSystem: function () {
        var objLS = this.objLocalStorage.getObjectItem('scormData');
        return objLS['globalobjectives'];
    }
};
Player.ContentPlayer = function (manifestPath, imsmanifest, isStorage, isScormAuto, isDebug) {
    this.intVersion = 0;//this.$2
	/*    
	none: 0,
    1.2: 1,
    2004: 2
	*/
	this._tocTree = [];//this.$18 
	/*
		array of items to show in the table of contents tree
	*/
    if (isNullOrUndefined(imsmanifest)) {
        return;
    }
    this.xmldocManifest = imsmanifest;//this.$0
    this.strManifestPath = manifestPath;//this.$A
    this.blnIsDebug = isDebug;//this.$1
    this.intVersion = 0;
    var objRoot = this.xmldocManifest.getElementsByTagName('manifest');//$0
    if (isNullOrUndefined(objRoot) || objRoot.length !== 1) {
        return;
    }
    var childAttr = objRoot[0];//$1
    objRoot = this.xmldocManifest.getElementsByTagName('schemaversion');
    if (!isNullOrUndefined(objRoot) && objRoot.length === 1) {
        if (SCORM.BaseUtils.getText(objRoot[0]) === '1.2') {
            this.intVersion = 1;
        } else if (SCORM.BaseUtils.getText(objRoot[0]).toLowerCase().indexOf('1.3') >= 0 || SCORM.BaseUtils.getText(objRoot[0]).toLowerCase().indexOf('2004') >= 0) {
            this.intVersion = 2;
        }
    } else {
        if ((childAttr.attributes.getNamedItem('xmlns') != null && SCORM.BaseUtils.getText(childAttr.attributes.getNamedItem('xmlns')) === 'http://www.imsproject.org/xsd/imscp_rootv1p1p2') || (childAttr.attributes.getNamedItem('version') != null && SCORM.BaseUtils.getText(childAttr.attributes.getNamedItem('version')) === '1.1')) {
            this.intVersion = 1;
        }
    } if (this.intVersion === 0) {
        return;
    }
    objRoot = this.xmldocManifest.getElementsByTagName('organizations');
    if (isNullOrUndefined(objRoot) || objRoot.length !== 1) {
        return;
    }
    var objChild = objRoot[0];//$2
    if (!objChild.hasChildNodes()) {
        return;
    }
    var strNodeText = null;//$3
    if (objChild.attributes.getNamedItem('default') != null) {
        strNodeText = SCORM.BaseUtils.getText(objChild.attributes.getNamedItem('default'));
    }
    this.delegateOnUnload = Delegate.create(this, this.doOnunload);//this.$4 = Delegate.create(this, this.$27)
	//onunload event handler
	/*
A delegate is like a function pointer, which stores reference of a method. It specifies a method to call and optionally an object to call the method on. They are used, among other things, to implement callbacks and event listeners.	
	*/
    if (isStorage) {
        if (strNodeText == null) {
            var arrayNames = SCORM.BaseUtils.getChildSiblingsByName(objChild, 'organization');//$4
            if (arrayNames == null || arrayNames.length <= 0) {
                return;
            }
            var $enum1 = arrayNames.getEnumerator();
            while ($enum1.moveNext()) {
                var currEnum = $enum1.get_current();
                strNodeText = SCORM.BaseUtils.getXMLNodeAttribut(currEnum, 'identifier');
                break;
            }
        }
        this.objPersistantStorage = new Player.PersistentStateStorage(strNodeText);//this.$17 = new Player.PersistentStateStorage(strNodeText);
        if (!this.objPersistantStorage.isSupported()) {
            this.objPersistantStorage = null;
        }
    }
    if (this.intVersion === 1) {
	//this.$9 = this.objActivityTree
        this.objActivityTree = new SCORM_1_2.ActivityTree(strNodeText, ((this.objPersistantStorage != null) ? this.objPersistantStorage.getAllStatus() : null), isScormAuto);
    } else {
        this.objActivityTree = new SCORM_1_3.ActivityTree(strNodeText, (this.objPersistantStorage != null) ? this.objPersistantStorage.getResumeAllIdentifier() : null, ((this.objPersistantStorage != null) ? this.objPersistantStorage.getAllStatus() : null), ((this.objPersistantStorage != null) ? (this.objPersistantStorage.getResumeAllIdentifier() != null) ? this.objPersistantStorage.getSuspendedGlobalObjectives() : this.objPersistantStorage.getAllObjectivesGlobaltoSystem() : null));
        if (this.objPersistantStorage != null) {
            (this.objActivityTree).setADLCPData(this.objPersistantStorage.getADLData());
        }
    }
    this.objActivityTree.add_eventSCO(Delegate.create(this, this.nextSCO));//create(this,this.$22)
    this.objActivityTree.initByManifest(this.strManifestPath, this.xmldocManifest);
    this.createIframe();//this.$1A();
	this.createNavContainer();//this.$1B();	
	//this.$1C = createInput
	//this.$1D = toggleNavButtons
    this.createTreeContainer();//this.$1E();
	this.createDebugContainer();//this.$1F();
    this.objActivityTree.requestNavigation('start');
};
Player.ContentPlayer.prototype = {
    $0: null,//not used, unknown
    $1: false,
    objDomElem_Iframe: null,//$3 , this.$3
    $4: null,
    divTreeContainer: null,
    divDebug: null,
    objDomElem_navContainer: null,//$7 , this.$7
    $8: null,
    objActivityTree: null,//$9
    $A: null,
    $B: null,
    $C: null,
    $D: null,
    $E: null,
    $F: false,
    btnPrevious: null,//$10
    btnContinue: null,//$11
    btnExit: null,//$12
    btnExitAll: null,//$13
    btnAbandon: null,//$14
    btnAbandonAll: null,//$15
    btnSuspendAll: null,//$16
    objPersistantStorage: null,//$17
    intTocItems: 0,//$19
    createIframe: function () {
        this.objDomElem_Iframe = document.getElementById('contentIFrame');
        if (isNullOrUndefined(this.objDomElem_Iframe)) {
            this.objDomElem_Iframe = document.createElement('IFrame');
            this.objDomElem_Iframe.id = 'contentIFrame';
            this.objDomElem_Iframe.style.display = 'none';
			this.objDomElem_Iframe.style.height = '100%';
			this.objDomElem_Iframe.style.width = '100%';
            this.objDomElem_Iframe.frameBorder = '0';
            var objDomElem_tmp = document.getElementById('placeholder_contentIFrame');//$0
            if (!isNullOrUndefined(objDomElem_tmp)) {
                objDomElem_tmp.appendChild(this.objDomElem_Iframe);
            } else {
                document.body.appendChild(this.objDomElem_Iframe);
            }
        }
    },
    createNavContainer: function () {
        this.objDomElem_navContainer = document.getElementById('navigationContainer');
        this.$8 = Delegate.create(this, this.toggleNavButtons);
        if (isNullOrUndefined(this.objDomElem_navContainer)) {
            this.objDomElem_navContainer = document.createElement('div');
            this.objDomElem_navContainer.id = 'navigationContainer';
            this.objDomElem_navContainer.style.display = 'none';
            this.btnPrevious = this.createInput('btnPrevious', PlayerConfiguration.BtnPreviousLabel);
            this.btnContinue = this.createInput('btnContinue', PlayerConfiguration.BtnContinueLabel);
            this.btnExit = this.createInput('btnExit', PlayerConfiguration.BtnExitLabel);
            this.btnExitAll = this.createInput('btnExitAll', PlayerConfiguration.BtnExitAllLabel);
            this.btnAbandon = this.createInput('btnAbandon', PlayerConfiguration.BtnAbandonLabel);
            this.btnAbandonAll = this.createInput('btnAbandonAll', PlayerConfiguration.BtnAbandonAllLabel);
            this.btnSuspendAll = this.createInput('btnSuspendAll', PlayerConfiguration.BtnSuspendAllLabel);
            var objDomElem_tmp = document.getElementById('placeholder_navigationContainer');//$0
            if (!isNullOrUndefined(objDomElem_tmp)) {
                objDomElem_tmp.appendChild(this.objDomElem_navContainer);
            } else {
                document.body.appendChild(this.objDomElem_navContainer);
            }
        }
    },
    createInput: function ($p0, $p1) {
        var objDomElem_input = document.createElement('input');//$0
        objDomElem_input.setAttribute('id', $p0);
        objDomElem_input.setAttribute('type', 'button');
        objDomElem_input.setAttribute('value', $p1);
        objDomElem_input.style.display = 'none';
        objDomElem_input.attachEvent('onclick', this.$8);
        this.objDomElem_navContainer.appendChild(objDomElem_input);
        return objDomElem_input;
    },
    toggleNavButtons: function () {
        var objWinEvent = window.event.srcElement;//$0
        if (isNullOrUndefined(objWinEvent)) {
            return;
        }
        if (this.$F) {
            return;
        }
        if (objWinEvent.id === 'btnPrevious') {
            this.objActivityTree.requestNavigation('previous');
        } else if (objWinEvent.id === 'btnContinue') {
            this.objActivityTree.requestNavigation('continue');
        } else if (objWinEvent.id === 'btnExit') {
            this.objActivityTree.requestNavigation('exit');
            this.btnExit.disabled = true;
            this.btnAbandon.disabled = true;
        } else if (objWinEvent.id === 'btnExitAll') {
            this.objActivityTree.requestNavigation('exitAll');
        } else if (objWinEvent.id === 'btnAbandon') {
            this.objActivityTree.requestNavigation('abandon');
            this.btnExit.disabled = true;
            this.btnAbandon.disabled = true;
        } else if (objWinEvent.id === 'btnAbandonAll') {
            this.objActivityTree.requestNavigation('abandonAll');
        } else if (objWinEvent.id === 'btnSuspendAll') {
            this.objActivityTree.requestNavigation('suspendAll');
        }
    },
    createTreeContainer: function () {
        this.divTreeContainer = document.getElementById('treeContainer');
        if (isNullOrUndefined(this.divTreeContainer)) {
            this.divTreeContainer = document.createElement('div');
            this.divTreeContainer.id = 'treeContainer';
            this.divTreeContainer.style.display = 'none';
            var objDomElem_tmp = document.getElementById('placeholder_treeContainer');//$0
            if (isNullOrUndefined(objDomElem_tmp)) {
                document.body.appendChild(this.divTreeContainer);
                if (this.objActivityTree.isSingleItem()) {
                    this.divTreeContainer.style.display = 'none';
                }
            } else {
                objDomElem_tmp.appendChild(this.divTreeContainer);
                if (this.objActivityTree.isSingleItem()) {
                    objDomElem_tmp.style.display = 'none';
                }
            }
            var $1 = new ControlsCollection.TreeView(this.divTreeContainer, PlayerConfiguration.TreeMinusIcon, PlayerConfiguration.TreePlusIcon);
            this.objActivityTree.scan(this.objActivityTree.getOrganization(), Delegate.create(this, function ($p1_0) {
                var $1_0;
                if ($p1_0 !== this.objActivityTree.getOrganization()) {
                    var $1_1 = ($p1_0.isVisible()) ? '#' : null;
                    if (this.intVersion === 1) {
                        $1_1 = (isNullOrUndefined($p1_0.getUrl()) || $p1_0.getUrl().trim().length <= 0) ? null : $1_1;
                    } else if (this.intVersion === 2) {
                        var $1_2 = $p1_0;
                        if (!$1_2.getParentSequencing().choice) {
                            $1_1 = null;
                        } else if (isNullOrUndefined($1_2.getScormType()) && !$1_2.getSequencing().flow) {
                            $1_1 = null;
                        }
                    }
                    if ($p1_0.isLeaf()) {
                        $1_0 = ($p1_0.getParent().getData()).addNode($p1_0.getTitle(), $1_1, PlayerConfiguration.TreeLeafIcon);
                    } else {
                        $1_0 = ($p1_0.getParent().getData()).addNode($p1_0.getTitle(), $1_1);
                    } if ($1_1 != null) {
                        this._tocTree.add($1_0);
                    }
                } else {
                    $1_0 = $1;
                }
                $p1_0.setData($1_0);
                $1_0.set_userData($p1_0);
                return true;
            }), null);
            $1.add_nodeClick(Delegate.create(this, this.processNavRequest));
        }
    },
    createDebugContainer: function () {
        if (!this.blnIsDebug) {
            return;
        }
        this.divDebug = document.getElementById('debuggerContainer');
        if (isNullOrUndefined(this.divDebug)) {
            this.divDebug = document.createElement('div');
            this.divDebug.id = 'debuggerContainer';
            this.divDebug.style.display = 'none';
            var objDomElem_tmp = document.getElementById('placeholder_Debugger');//$0
            if (!isNullOrUndefined(objDomElem_tmp)) {
                objDomElem_tmp.style.display = 'block';
                objDomElem_tmp.appendChild(this.divDebug);
            } else {
                document.body.appendChild(this.divDebug);
            }
            SCORM.LOG.add_logEvent(Delegate.create(this, this.createLogger));
        }
    },
	//$20
	//$p0 = objMessage
    createLogger: function (objMessage) {
	var objDate = new Date();//$1
	var timeStamp = objDate.getHours() + ':' + objDate.getMinutes() + ':' + objDate.getSeconds();
	console.log(timeStamp , objMessage.message, objMessage.errorCode, objMessage.errorDescription);
        return;
		var objDomElem_div = document.createElement('div');//$0
        objDomElem_div.style.width = '100%';
        var objDomElem_span = document.createElement('span');//$2
        objDomElem_span.style.color = '#800000';
        objDomElem_span.innerHTML = timeStamp;
        var objDomElem_span2 = document.createElement('span');//$3
        objDomElem_span2.innerHTML = '&nbsp;' + objMessage.message;
        if (!isNullOrUndefined(objMessage.errorCode) && objMessage.errorCode !== '0') {
            objDomElem_span2.style.color = '#FF0000';
            objDomElem_div.style.backgroundColor = '#FFFF00';
            var objDomElem_div2 = document.createElement('div');//$4
            objDomElem_div2.innerHTML = '<b>Error Code:</b> ' + objMessage.errorCode + ((isNullOrUndefined(objMessage.errorDescription) || objMessage.errorDescription.length === 0) ? '' : '<br/><b>Error Info:</b> ' + objMessage.errorDescription);
            objDomElem_span2.appendChild(objDomElem_div2);
        }
        objDomElem_div.appendChild(objDomElem_span);
        objDomElem_div.appendChild(objDomElem_span2);
        this.divDebug.appendChild(objDomElem_div);
        this.divDebug.parentNode.scrollTop = this.divDebug.parentNode.scrollHeight;
    },
	//$21 = processNavRequest
	//$p1 objTreeNode
    processNavRequest: function ($p0, objTreeNode) {
        if (this.$F) {
            return;
        }
        if (isNullOrUndefined(objTreeNode.get_node()) || isNullOrUndefined(objTreeNode.get_node().getAnchor().getAttribute('href')) || objTreeNode.get_node().getAnchor().getAttribute('href') === '') {
            return;
        }
        var objRequest = objTreeNode.get_node().get_userData();//$0
        if (isNullOrUndefined(objRequest) || objRequest.getIdentifier() == null || objRequest.getIdentifier().length <= 0) {
            return;
        }
        if (objTreeNode.get_node().getUrl() == null) {
            return;
        }
        this.objActivityTree.requestNavigation('{target=' + objRequest.getIdentifier() + '}choice');
    },
    getSCORMVersion: function () {
        return this.intVersion;
    },
    getActivityTree_V12: function () {
        if (this.intVersion === 1) {
            return this.objActivityTree;
        } else {
            return null;
        }
    },
    getActivityTree_V13: function () {
        if (this.intVersion === 2) {
            return this.objActivityTree;
        } else {
            return null;
        }
    },
	//$22 = nextSCO
	//$p1 = objEvent
    nextSCO: function ($p0, objEvent) {
        if (objEvent.get_eventType() === 5 || objEvent.get_eventType() === 3 || objEvent.get_eventType() === 4) {
            if (this.blnIsDebug && this.$C != null) {
                SCORM.LOG.displayMessage('Unloading ' + this.$C.getScormType() + ': ' + this.$C.getIdentifier(), '0', null);
            }
            if (objEvent.get_eventType() === 5) {
                this.$C = null;
                this.$B = null;
                this.$D = null;
                this.hidePlayer(!this.blnIsDebug);
                if (this.blnIsDebug) {
                    SCORM.LOG.displayMessage('End Session!', '0', null);
                }
            } else {
                if (this.$B != null && this.$C.getScormType() === 'sco' && !this.$B.isInitAttempted()) {
                    return;
                }
            } if (objEvent.get_eventType() !== 4) {
                this.$F = true;
                this.objDomElem_Iframe.attachEvent('onload', this.delegateOnUnload);
            } else {
                if (isNullOrUndefined(this.$C)) {
                    SCORM.LOG.displayMessage('No SCO to deliver!', '0', null);
                    this.updateNavigation();
                }
                this.btnExit.disabled = true;
                this.btnAbandon.disabled = true;
            }
            this.objDomElem_Iframe.src = 'blank.htm';
        } else if (objEvent.get_eventType() === 1) {
            if (this.$B != null) {
                if (!this.$B.isFinishAttempted()) {
                    this.updateNavigation();
                }
                if (this.objPersistantStorage != null) {
                    this.objPersistantStorage.saveItemCMI(this.$C.getIdentifier(), this.$C.getDataTree());
                }
            }
        } else if (objEvent.get_eventType() === 0) {
            if (this.objPersistantStorage != null) {
                if (this.intVersion === 1) {
                    this.objPersistantStorage.saveState(null, (this.objActivityTree).getStoredStatuses(), null, null, null);
                } else if (this.intVersion === 2) {
                    var $0 = this.objActivityTree;
                    this.objPersistantStorage.saveState($0.getADLCPData(), $0.getStoredStatuses(), ($0.savedSuspendedActivity != null) ? null : ($0.isObjectivesGlobalToSystem()) ? $0.getClonedGlobalObjectives() : null, ($0.savedSuspendedActivity != null) ? $0.savedSuspendedActivity.getIdentifier() : null, ($0.savedSuspendedActivity != null) ? $0.getClonedGlobalObjectives() : null);
                }
            }
        } else if (objEvent.get_eventType() === 2) {
            this.buildTreeUI(objEvent.get_treeNode());
        }
    },
	//$23 = updateNavigation
    updateNavigation: function () {
        var $0 = !isNullOrUndefined(this.$C);
        if (this.objActivityTree.isSingleItem()) {
            return;
        }
        SCORM.LOG.displayMessage('Updating navigation ... ', '0', null);
        if (this.intVersion === 2) {
            if ($0) {
                var $1 = this.$C.getHideLMSUI();
                var objActivityTree_13 = this.getActivityTree_V13();//$2
                var $3 = this.$C;
                if (!isNullOrUndefined(this.btnPrevious) && !$1.contains('previous')) {
                    this.btnPrevious.disabled = !$3.getParentSequencing().flow || $3.getParentSequencing().forwardOnly || !objActivityTree_13.isValidNavigationRequest('previous', false);
                }
                if (!isNullOrUndefined(this.btnContinue) && !$1.contains('continue')) {
                    this.btnContinue.disabled = !$3.getParentSequencing().flow || !objActivityTree_13.isValidNavigationRequest('continue', false);
                }
            }
            this.intTocItems = 0;
            window.setTimeout(Delegate.create(this, this.createSCORM2004TocHref), 1);
        } else if (this.intVersion === 1) {
            var objActivityTree_12 = this.getActivityTree_V12();//$4
            if ($0) {
                this.btnPrevious.disabled = !objActivityTree_12.isValidNavigationRequest('previous');
                this.btnContinue.disabled = !objActivityTree_12.isValidNavigationRequest('continue');
            }
            if (objActivityTree_12.hasPrerequisites()) {
                this.intTocItems = 0;
                window.setTimeout(Delegate.create(this, this.createSCORM12TocHref), 1);
            }
        }
    },
	//$24 = createSCORM2004TocHref
    createSCORM2004TocHref: function () {
        if (this.intTocItems < this._tocTree.length) {
            var objTree = this.getActivityTree_V13();//$0
            var objTreeItems = this._tocTree[this.intTocItems];//$1
            var objTreeUserData = objTreeItems.get_userData();//$2
            var $3 = this.$C;
            if ($3 !== objTreeUserData && objTree.isValidNavigationRequest('choice.{target=' + objTreeUserData.getIdentifier() + '}', false)) {
                objTreeItems.getAnchor().href = '#';
            } else {
                objTreeItems.getAnchor().removeAttribute('href');
            }
            this.intTocItems++;
            window.setTimeout(Delegate.create(this, this.createSCORM2004TocHref), 1);
        }
    },
	//$25 = createSCORM12TocHref
    createSCORM12TocHref: function () {
        if (this.intTocItems < this._tocTree.length) {
            var objTree = this.getActivityTree_V12();//$0
            var objTreeItems = this._tocTree[this.intTocItems];//$1
            var objTreeUserData = objTreeItems.get_userData();//$2
            var $3 = this.$C;
            if ($3 !== objTreeUserData && objTree.isValidNavigationRequest('{target=' + objTreeUserData.getIdentifier() + '}choice')) {
                objTreeItems.getAnchor().href = '#';
            } else {
                objTreeItems.getAnchor().removeAttribute('href');
            }
            this.intTocItems++;
            window.setTimeout(Delegate.create(this, this.createSCORM12TocHref), 1);
        }
    },
	//$26
    loadActivity: function () {
	g_currentActivity = this.$C.getIdentifier();
				objCMI = findSomething(g_persistSCORMData,g_currentActivity);
			//objCMI = g_persistSCORMData;
			console.log(objCMI);
        if (this.blnIsDebug) {
            SCORM.LOG.displayMessage('Loading ' + this.$C.getScormType() + ': ' + this.$C.getIdentifier(), '0', null);
        }
        this.updateNavigation();
        this.objDomElem_Iframe.src = this.$C.getUrl();
		//resize the iframe to the size of the content
		parent.document.getElementById(this.objDomElem_Iframe.id).style.height = document['body'].offsetHeight + 'px';	
    },
    doOnunload: function () {
        this.objDomElem_Iframe.detachEvent('onload', this.delegateOnUnload);
        this.$F = false;
        if (!isNullOrUndefined(this.$C) && !this.$B.isFinishAttempted()) {
            this.loadActivity();
        }
    },
	//$28
    buildTreeUI: function ($p0) {
        if ($p0 != null) {
            var $0 = this.$D;
            if (this.objPersistantStorage != null) {
                $p0.setDataTree(this.objPersistantStorage.getItemCMI($p0.getIdentifier()));
            }
            if (this.intVersion === 1) {
                this.$B = new SCORM_1_2.API_LIB($p0);
            } else if (this.intVersion === 2) {
                this.$B = new SCORM_1_3.API_1484_11_LIB($p0);
            }
            this.$C = $p0;
            this.$D = this.$C.getData();
            this.objActivityTree.setActiveAPI(this.$B);
            if ($0 != null && this.$E != null) {
                $0.getIcon().src = this.$E;
            }
            if (!isNullOrUndefined(PlayerConfiguration.TreeActiveIcon) && PlayerConfiguration.TreeActiveIcon.length > 0 && !isNullOrUndefined(this.$D.getIcon())) {
                this.$E = this.$D.getIcon().src;
                this.$D.getIcon().src = PlayerConfiguration.TreeActiveIcon;
            }
            var $1 = $p0.getHideLMSUI();
            if (!isNullOrUndefined(this.btnPrevious)) {
                this.btnPrevious.style.display = (this.objActivityTree.isSingleItem() || $1.contains('previous')) ? 'none' : 'inline';
                this.btnPrevious.disabled = false;
            }
            if (!isNullOrUndefined(this.btnContinue)) {
                this.btnContinue.style.display = (this.objActivityTree.isSingleItem() || $1.contains('continue')) ? 'none' : 'inline';
                this.btnContinue.disabled = false;
            }
            if (!isNullOrUndefined(this.btnExit)) {
                this.btnExit.style.display = ($1.contains('exit')) ? 'none' : 'inline';
                this.btnExit.disabled = false;
            }
            if (!isNullOrUndefined(this.btnExitAll)) {
                this.btnExitAll.style.display = ($1.contains('exitall')) ? 'none' : 'inline';
                this.btnExitAll.disabled = false;
            }
            if (!isNullOrUndefined(this.btnAbandon)) {
                this.btnAbandon.style.display = ($1.contains('abandon')) ? 'none' : 'inline';
                this.btnAbandon.disabled = false;
            }
            if (!isNullOrUndefined(this.btnAbandonAll)) {
                this.btnAbandonAll.style.display = ($1.contains('abandonall')) ? 'none' : 'inline';
                this.btnAbandonAll.disabled = false;
            }
            if (!isNullOrUndefined(this.btnSuspendAll)) {
                this.btnSuspendAll.style.display = ($1.contains('suspendall')) ? 'none' : 'inline';
                this.btnSuspendAll.disabled = false;
            }
            if (!this.$F) {
                this.loadActivity();
            }
        }
    },
    showPlayer: function () {
        if (this.intVersion !== 0) {
            this.objDomElem_Iframe.style.display = 'block';
            this.divTreeContainer.style.display = 'block';
            if(configInstance.showSCORM2004TopNav == false)
			{
				this.objDomElem_navContainer.style.display = 'none';
            }else{
				this.objDomElem_navContainer.style.display = 'block';
			}
			if (!isNullOrUndefined(this.divDebug)) {
                this.divDebug.style.display = (this.blnIsDebug) ? 'block' : 'none';
            }
        }
    },
    hidePlayer: function (includeDebugger) {
        if (this.intVersion !== 0) {
            this.objDomElem_Iframe.style.display = 'none';
            this.divTreeContainer.style.display = 'none';
            this.objDomElem_navContainer.style.display = 'none';
            if (includeDebugger && !isNullOrUndefined(this.divDebug)) {
                this.divDebug.style.display = 'none';
            }
        }
    }
};
PlayerConfiguration = function () {};
Run = function () {};
Run.ManifestByURL = function (url, anticache) {
    if (isNullOrUndefined(url) || url.trim().length <= 0) {
        return;
    }
    url = url.trim().replace(new RegExp('\\\\', 'g'), '/');
    Run.strManifestPath = url.substr(0, url.lastIndexOf('/') + 1);//Run.$2
    if (anticache) {
        url += '?anticache=' + Math.random();
    }
    Run.objXMLHTTPReq = new XMLHttpRequest();//Run.$0
    Run.objXMLHTTPReq.onreadystatechange = Delegate.create(null, Run.playerLoader);
    Run.objXMLHTTPReq.open('GET', url, true);
    Run.objXMLHTTPReq.send(null);
};
Run.ManifestByString = function (manifest) {
    Run.parse = XMLDocumentParser.parse(manifest);//Run.$1
    if (isNullOrUndefined(Run.parse) || isNullOrUndefined(SCORM.BaseUtils.getChildNodeByName(Run.parse, 'manifest'))) {
        SCORM.LOG.displayMessage('[PLR.1] Loading course process', 'PLR.1.1', 'Incorrect imsmanifest.xml');
        return;
    }
    Run.playerLoad();
};
//Run.$3 = Run.playerLoader
Run.playerLoader = function () {
    if (Run.objXMLHTTPReq.readyState === 4) {
        Run.objXMLHTTPReq.onreadystatechange = Delegate.Null;
        if (!isNullOrUndefined(Run.objXMLHTTPReq.responseXML)) {
            Run.parse = Run.objXMLHTTPReq.responseXML;
            Run.playerLoad();
        } else if (!isNullOrUndefined(Run.objXMLHTTPReq.responseText)) {
            Run.ManifestByString(Run.objXMLHTTPReq.responseText);
        }
        Run.objXMLHTTPReq = null;
    }
};
//Run.$4 = Run.playerLoad
Run.playerLoad = function () {
    var objContentPlayer = new Player.ContentPlayer(Run.strManifestPath, Run.parse, PlayerConfiguration.StorageSupport, false, PlayerConfiguration.Debug);
    objContentPlayer.showPlayer();
};
Player.PersistentStateStorage.createClass('Player.PersistentStateStorage');
Player.ContentPlayer.createClass('Player.ContentPlayer');
PlayerConfiguration.createClass('PlayerConfiguration');
Run.createClass('Run');
PlayerConfiguration.Debug = false;
PlayerConfiguration.StorageSupport = false;
PlayerConfiguration.TreeMinusIcon = null;
PlayerConfiguration.TreePlusIcon = null;
PlayerConfiguration.TreeLeafIcon = null;
PlayerConfiguration.TreeActiveIcon = null;
PlayerConfiguration.BtnPreviousLabel = 'Previous';
PlayerConfiguration.BtnContinueLabel = 'Continue';
PlayerConfiguration.BtnExitLabel = 'Exit';
PlayerConfiguration.BtnExitAllLabel = 'Exit All';
PlayerConfiguration.BtnAbandonLabel = 'Abandon';
PlayerConfiguration.BtnAbandonAllLabel = 'Abandon All';
PlayerConfiguration.BtnSuspendAllLabel = 'Suspend All';
Run.objXMLHTTPReq = null;
Run.parse = null;
Run.strManifestPath = null;