Type.createNamespace('SCORM_1_3');
SCORM_1_3.TerminationRequestProcessResult = function () {};
SCORM_1_3.TerminationRequestProcessResult.prototype = {
    NOT_VALID: 0,
    SEQUENCE_REQUEST: 1
};
SCORM_1_3.TerminationRequestProcessResult.createEnum('SCORM_1_3.TerminationRequestProcessResult', false);
SCORM_1_3.TerminationRequest = function () {};
SCORM_1_3.TerminationRequest.prototype = {
    NOT_AVAILABLE: 0,
    NOT_VALID: 1,
    VALID: 2,
    EXIT: 3,
    EXIT_ALL: 4,
    ABANDON: 5,
    ABANDON_ALL: 6,
    SUSPEND_ALL: 7,
    EXIT_PARENT: 8
};
SCORM_1_3.TerminationRequest.createEnum('SCORM_1_3.TerminationRequest', false);
SCORM_1_3.SequencingRequest = function () {};
SCORM_1_3.SequencingRequest.prototype = {
    NOT_AVAILABLE: 0,
    NOT_VALID: 1,
    VALID: 2,
    START: 3,
    RESUME_ALL: 4,
    CONTINUE: 5,
    PREVIOUS: 6,
    CHOICE: 7,
    EXIT: 8,
    JUMP: 9,
    RETRY: 10
};
SCORM_1_3.SequencingRequest.createEnum('SCORM_1_3.SequencingRequest', false);
SCORM_1_3.TraversalDirection = function () {};
SCORM_1_3.TraversalDirection.prototype = {
    NOT_AVAILABLE: 0,
    FORWARD: 1,
    BACKWARD: 2
};
SCORM_1_3.TraversalDirection.createEnum('SCORM_1_3.TraversalDirection', false);
SCORM_1_3.NavigationRequest = function () {};
SCORM_1_3.NavigationRequest.prototype = {
    NOT_VALID: 0,
    VALID: 1,
    START: 2,
    RESUME_ALL: 3,
    CONTINUE: 4,
    PREVIOUS: 5,
    FORWARD: 6,
    BACKWARD: 7,
    CHOICE: 8,
    EXIT: 9,
    EXIT_ALL: 10,
    ABANDON: 11,
    ABANDON_ALL: 12,
    SUSPEND_ALL: 13,
    JUMP: 14
};
SCORM_1_3.NavigationRequest.createEnum('SCORM_1_3.NavigationRequest', false);
SCORM_1_3.EndSequencingSession = function () {};
SCORM_1_3.EndSequencingSession.prototype = {
    NOT_AVAILABLE: 0,
    TRUE: 1,
    FALSE: 2
};
SCORM_1_3.EndSequencingSession.createEnum('SCORM_1_3.EndSequencingSession', false);
SCORM_1_3.ActivityTreeNode = function () {
    this.activityTreeCollection = [];
    this.dataTree = {};
    this.hideLMSUI = [];
};
SCORM_1_3.ActivityTreeNode.prototype = {
    _level: 0,
    _orderIndex: 0,
    parent: null,
    _title: null,
    _identifier: null,
    _url: null,
    _scormType: null,
    _isVisible: false,
    _timeLimitAction: null,
    _dataFromLMS: null,
    _completedByMeasure: false,
    _minProgressMeasure: 1,
    _progressWeight: 1,
    _adlCPData: null,
    _isActive: false,
    _isSuspended: false,
    _isAbandoned: false,
    _sequencing: null,
    _setData: null,
    addNode: function (title, identifier, url, scormType, isvisible) {
        var activityTree = new SCORM_1_3.ActivityTreeNode();
        activityTree.parent = this;
        activityTree._title = title;
        activityTree._identifier = identifier;
        activityTree._url = url;
        activityTree._scormType = scormType;
        activityTree._isVisible = isvisible;
        activityTree._level = this._level + 1;
        activityTree._sequencing = new SCORM_1_3.ActivityTreeNodeSequencing(activityTree);
        this.activityTreeCollection.add(activityTree);
        return activityTree;
    },
    get_isActive: function () {
        return this._isActive;
    },
    set_isActive: function (value) {
        this._isActive = value;
        return value;
    },
    get_isSuspended: function () {
        return this._isSuspended;
    },
    set_isSuspended: function (value) {
        this._isSuspended = value;
        if (this._isSuspended && this !== this.getRoot()) {
            this.getRoot().set_isSuspended(true);
        }
        return value;
    },
    get_isAbandoned: function () {
        return this._isAbandoned;
    },
    set_isAbandoned: function (value) {
        this._isAbandoned = value;
        return value;
    },
    hasSuspendedChildren: function () {
        var _enum1 = this.activityTreeCollection.getEnumerator();
        while (_enum1.moveNext()) {
            var currEnum = _enum1.get_current();
            if (currEnum.get_isSuspended()) {
                return true;
            }
        }
        return false;
    },
    getChildrens: function () {
        return this.activityTreeCollection;
    },
    isAvailableChildren: function () {
        return (this.getParent()).getChildrens().contains(this);
    },
    getChildrenIndex: function () {
        if (this.getParent() == null) {
            return -1;
        }
        var cnt = 0;
        var _enum1 = this.getParent().getChildrens().getEnumerator();
        while (_enum1.moveNext()) {
            var currEnum = _enum1.get_current();
            if (currEnum === this) {
                return cnt;
            }
            cnt++;
        }
        return -1;
    },
    getLastChildren: function () {
        var lastChildren = null;
        if (this.getChildrensCount() > 0) {
            lastChildren = this.getChildrens()[this.getChildrensCount() - 1];
        }
        return lastChildren;
    },
    getFirstChildren: function () {
        var firstChild = null;
        if (this.getChildrensCount() > 0) {
            firstChild = this.getChildrens()[0];
        }
        return firstChild;
    },
    isLastChildrenForParent: function () {
        return (this.getParent()).getLastChildren() === this;
    },
    isFirstChildrenForParent: function () {
        return (this.getParent()).getFirstChildren() === this;
    },
    getNextSibling: function () {
        var nextSibling = null;
        var index = this.getChildrenIndex();
        if (index < this.getParent().getChildrensCount() - 1) {
            nextSibling = this.getParent().getChildrens()[index + 1];
        }
        return nextSibling;
    },
    getPreviousSibling: function () {
        var prevSibling = null;
        var _enum1 = this.getParent().getChildrens().getEnumerator();
        while (_enum1.moveNext()) {
            var currEnum = _enum1.get_current();
            if (currEnum === this) {
                return prevSibling;
            } else {
                prevSibling = currEnum;
            }
        }
        return prevSibling;
    },
    getParent: function () {
        return this.parent;
    },
    getParentSequencing: function () {
        return (this.getParent()).getSequencing();
    },
    getRoot: function () {
        if (this.parent == null) {
            return (Type.canCast(this, SCORM_1_3.ActivityTree)) ? this : null;
        } else {
            return this.parent.getRoot();
        }
    },
    getChildrensCount: function () {
        return this.activityTreeCollection.length;
    },
    getPath: function (toNode, inclusiveThis, inclusiveTo, reverse) {
        var objPaths = [];
        var path = this;
        if (!inclusiveThis) {
            path = path.getParent();
        }
        while (path.getParent() != null) {
            if (!inclusiveTo && path === toNode) {
                break;
            }
            objPaths.add(path);
            if (toNode === path) {
                break;
            }
            path = path.getParent();
        }
        if (reverse) {
            objPaths.reverse();
        }
        return objPaths;
    },
    getList: function (toNode, inclusiveThis, inclusiveTo) {
        var objList = [];
        if (this.getParent() !== toNode.getParent()) {
            return objList;
        }
        var cIndex = this.getChildrenIndex();
        var ncIndex = toNode.getChildrenIndex();
        var children = this.getParent().getChildrens();
        if (ncIndex > cIndex) {
            for (var i = cIndex; i <= ncIndex; i++) {
                if (!inclusiveThis && i === cIndex) {
                    continue;
                }
                if (!inclusiveTo && i === ncIndex) {
                    continue;
                }
                objList.add(children[i]);
            }
        } else {
            for (var j = cIndex; j >= ncIndex; j--) {
                if (!inclusiveThis && j === cIndex) {
                    continue;
                }
                if (!inclusiveTo && j === ncIndex) {
                    continue;
                }
                objList.add(children[j]);
            }
        }
        return objList;
    },
    isLeaf: function () {
        return this.getChildrensCount() === 0;
    },
    isSibling: function (node) {
        return (this.getParent() === node.getParent());
    },
    isLastActivityInTree: function () {
        return this.getRoot().getLastActivityInTree() === this;
    },
    isOrganization: function () {
        return this.getParent().getParent() == null;
    },
    isVisible: function () {
        return this._isVisible;
    },
    getTitle: function () {
        return this._title;
    },
    setTitle: function (title) {
        this._title = title;
    },
    setTimelimitaction: function (timelimitaction) {
        this._timeLimitAction = timelimitaction;
    },
    getTimelimitaction: function () {
        return this._timeLimitAction;
    },
    setDatafromlms: function (datafromlms) {
        this._dataFromLMS = datafromlms;
    },
    getDatafromlms: function () {
        return this._dataFromLMS;
    },
    isCompletedbymeasure: function () {
        return this._completedByMeasure;
    },
    setCompletedbymeasure: function (completedbymeasure) {
        this._completedByMeasure = completedbymeasure;
    },
    setMinprogressmeasure: function (minprogressmeasure) {
        this._minProgressMeasure = minprogressmeasure;
    },
    getMinprogressmeasure: function () {
        return this._minProgressMeasure;
    },
    setProgressweight: function (progressweight) {
        this._progressWeight = progressweight;
    },
    getProgressweight: function () {
        return this._progressWeight;
    },
    getADLCPData: function () {
        return this._adlCPData;
    },
    setADLCPData: function (adlcpData) {
        this._adlCPData = adlcpData;
    },
    getUrl: function () {
        return this._url;
    },
    getScormType: function () {
        return this._scormType;
    },
    getIdentifier: function () {
        return this._identifier;
    },
    getHideLMSUI: function () {
        return this.hideLMSUI;
    },
    getSequencing: function () {
        return this._sequencing;
    },
    getLevel: function () {
        return this._level;
    },
    getOrderIndex: function () {
        return this._orderIndex;
    },
    setOrderIndex: function (orderIndex) {
        this._orderIndex = orderIndex;
    },
    setData: function (data) {
        this._setData = data;
    },
    getData: function () {
        return this._setData;
    },
    updateSequencingState: function () {
        if (!this._sequencing.tracked) {
            return;
        }
        var completionStatus = 'cmi.completion_status';//0
        var progressMeasure = 'cmi.progress_measure';//1
        var successStatus = 'cmi.success_status';//2
        var scoreScaled = 'cmi.score.scaled';//3
        var scoreRaw = 'cmi.score.raw';//4
        var scoreMin = 'cmi.score.min';//5
        var scoreMax = 'cmi.score.max';//6
        var cnt = 0;//7
        if (this._sequencing.getObjectivesCount() > 0 && this._sequencing.getPrimaryObjective() === this._sequencing.getObjectiveByIndex(0)) {
            if (!this.isSetBySCO(completionStatus)) {
                completionStatus = 'cmi.objectives.0.completion_status';
            }
            if (!this.isSetBySCO(progressMeasure)) {
                progressMeasure = 'cmi.objectives.0.progress_measure';
            }
            if (!this.isSetBySCO(successStatus)) {
                successStatus = 'cmi.objectives.0.success_status';
            }
            if (!this.isSetBySCO(scoreScaled)) {
                scoreScaled = 'cmi.objectives.0.score.scaled';
            }
            if (!this.isSetBySCO(scoreRaw)) {
                scoreRaw = 'cmi.objectives.0.score.raw';
            }
            if (!this.isSetBySCO(scoreMin)) {
                scoreMin = 'cmi.objectives.0.score.min';
            }
            if (!this.isSetBySCO(scoreMax)) {
                scoreMax = 'cmi.objectives.0.score.max';
            }
            cnt = 1;
        }
        var objStatus = this._sequencing.status;
        var seqObj = null;
        var hasObjective = true;
        while (hasObjective) {
            if ((this._sequencing.completionSetByContent || this.isSetBySCO(completionStatus))) {
                objStatus.set_attemptCompletionStatus(this.getDataTreeValue(completionStatus) === 'completed');
                objStatus.set_attemptProgressStatus(this.getDataTreeValue(completionStatus) !== 'unknown');
                if (this._sequencing.status === objStatus) {
                    this._sequencing.completionSetByContent = true;
                }
            }
            if (this.isSetBySCO(progressMeasure)) {
                objStatus.attemptCompletionAmountStatus = true;
                objStatus.set_attemptCompletionAmount(parseFloat(this.getDataTreeValue(progressMeasure)));
            }
            if ((this._sequencing.objectiveSetByContent || this.isSetBySCO(successStatus))) {
                objStatus.set_objectiveSatisfiedStatus(this.getDataTreeValue(successStatus) === 'passed');
                objStatus.set_objectiveProgressStatus(this.getDataTreeValue(successStatus) !== 'unknown');
                if (this._sequencing.status === objStatus) {
                    this._sequencing.objectiveSetByContent = true;
                }
            }
            if (this.isSetBySCO(scoreScaled)) {
                objStatus.set_objectiveMeasureStatus(true);
                objStatus.set_objectiveNormalizedMeasure(parseFloat(this.getDataTreeValue(scoreScaled)));
            } else if (!objStatus.objectiveMeasureStatusFromGlobal) {
                objStatus.set_objectiveMeasureStatus(false);
                objStatus.set_objectiveNormalizedMeasure(0);
            }
            objStatus.set_scoreRaw(this.getDataTreeValue(scoreRaw));
            objStatus.set_scoreMin(this.getDataTreeValue(scoreMin));
            objStatus.set_scoreMax(this.getDataTreeValue(scoreMax));
            if (seqObj != null && !seqObj.contributeToRollup) {
                if (seqObj.satisfiedByMeasure) {
                    if (objStatus.get_objectiveNormalizedMeasure() >= seqObj.minNormalizedMeasure) {
                        objStatus.set_objectiveProgressStatus(true);
                        objStatus.set_objectiveSatisfiedStatus(true);
                    } else {
                        objStatus.set_objectiveProgressStatus(true);
                        objStatus.set_objectiveSatisfiedStatus(false);
                    }
                }
            }
            if (this._sequencing.getObjectivesCount() >= cnt + 1) {
                completionStatus = 'cmi.objectives.' + cnt + '.completion_status';
                progressMeasure = 'cmi.objectives.' + cnt + '.progress_measure';
                successStatus = 'cmi.objectives.' + cnt + '.success_status';
                scoreScaled = 'cmi.objectives.' + cnt + '.score.scaled';
                scoreRaw = 'cmi.objectives.' + cnt + '.score.raw';
                scoreMin = 'cmi.objectives.' + cnt + '.score.min';
                scoreMax = 'cmi.objectives.' + cnt + '.score.max';
                seqObj = this._sequencing.getObjectiveByIndex(cnt);
                objStatus = seqObj.status;
                cnt++;
            } else {
                hasObjective = false;
            }
        }
    },
    getDataTree: function () {
        return this.dataTree;
    },
    setDataTree: function (dataTree) {
        this.dataTree = dataTree;
    },
    setDataTreeValue: function (dataElement, value, isSetBySCO) {
        var data = this.dataTree[dataElement];
        if (!isUndefined(data)) {
            data['value'] = value;
            if (isSetBySCO) {
                data['setbysco'] = true;
            }
        } else {
            this.dataTree[dataElement] = {
                value: value,
                setbysco: isSetBySCO
            };
        }
    },
    getDataTreeValue: function (dataElement) {
        if (dataElement === 'cmi.completion_status' || dataElement === 'cmi.success_status') {
            if (this.getDataTreeValue('cmi.mode') === 'normal') {
                if (this.getDataTreeValue('cmi.credit') === 'credit') {
                    if (this.getDataTreeValue('cmi.completion_threshold') != null) {
                        if (this.getDataTreeValue('cmi.progress_measure') != null) {
                            if (parseFloat(this.getDataTreeValue('cmi.progress_measure')) >= parseFloat(this.getDataTreeValue('cmi.completion_threshold'))) {
                                return 'completed';
                            } else {
                                return 'incomplete';
                            }
                        } else {
                            return 'unknown';
                        }
                    }
                    if (this.getDataTreeValue('cmi.scaled_passing_score') != null) {
                        if (this.getDataTreeValue('cmi.score.scaled') != null) {
                            if (parseFloat(this.getDataTreeValue('cmi.score.scaled')) >= parseFloat(this.getDataTreeValue('cmi.scaled_passing_score'))) {
                                return 'passed';
                            } else {
                                return 'failed';
                            }
                        } else {
                            return 'unknown';
                        }
                    }
                }
            }
        }
        var data = this.dataTree[dataElement];
        if (isUndefined(data)) {
            return undefined;
        }
        return data['value'];
    },
    isSetBySCO: function (dataModelElement) {
        if (dataModelElement === 'cmi.completion_status' || dataModelElement === 'cmi.success_status') {
            if (this.getDataTreeValue('cmi.mode') === 'normal' && this.getDataTreeValue('cmi.credit') === 'credit') {
                if (dataModelElement === 'cmi.completion_status' && this.getDataTreeValue('cmi.completion_threshold') != null) {
                    return false;
                } else if (dataModelElement=== 'cmi.success_status' && this.getDataTreeValue('cmi.scaled_passing_score') != null) {
                    return false;
                }
            }
        }
        var data = this.dataTree[dataModelElement];
        if (!isUndefined(data)) {
            return data['setbysco'];
        }
        return false;
    },
    cleanDataTree: function () {
        Object.clearKeys(this.dataTree);
    }
};
SCORM_1_3.ActivityTree = function (selectedOrganizationIdentifier, resumeAllIdentifier, storedStatuses, globalObjectives) {
    this._globalObjectives = {};//$20
    this._rollupSet = [];//$26
    this.$32 = 0;//$32
    this.$3E = 0;
    SCORM_1_3.ActivityTree.constructBase(this);
    this._selectedOrgId = selectedOrganizationIdentifier;
    this.$1D = resumeAllIdentifier;
    this.$25 = false;
    if (storedStatuses != null) {
        this.$21 = storedStatuses;
    } else {
        this.$21 = {};
    } if (!isNullOrUndefined(globalObjectives) && Object.getKeyCount(globalObjectives) > 0) {
        this.$25 = true;
        var globalObjDictionary = globalObjectives;
        for (var key in globalObjDictionary) {
            var obj = {
                key: key,
                value: globalObjDictionary[key]
            };
            if (!isNullOrUndefined((obj.value).objectives)) {
                (obj.value).objectives.clear();
            }
        }
        this._globalObjectives = globalObjectives;
    }
};
SCORM_1_3.ActivityTree.prototype = {
    $17: null,
    $18: null,
    $19: null,
    $1A: false,
    $1B: 0,
    $1C: null,
    $1D: null,
    $1E: false,
    $1F: false,
    $21: null,
    $22: null,
    $23: null,
    $24: false,
    $25: false,
    $27: null,
    add_eventSCO: function (value) {
        this.$27 = Delegate.combine(this.$27, value);
    },
    remove_eventSCO: function (value) {
        this.$27 = Delegate.remove(this.$27, value);
    },
    onEventSCO: function (e) {
        if (this.$27 != null && !this.$24) {
            this.$27.invoke(this, e);
        }
    },
    isGlobalObjectivesUpdateAvailable: true,
    $28: 0,
    get_$29: function () {
        console.log("get_$29=" + this.$28)
        return this.$28;
    },
    set_$29: function ($p0) {
        this.$28 = $p0;
        return $p0;
    },
    $2A: null,
    get_$2B: function () {
        return this.$2A;
    },
    set_$2B: function ($p0) {
        this.$2A = $p0;
        return $p0;
    },
    $2C: null,
    get_$2D: function () {
        return this.$2C;
    },
    set_$2D: function ($p0) {
        this.$2C = $p0;
        return $p0;
    },
    $2E: 0,
    get_$2F: function () {
        return this.$2E;
    },
    set_$2F: function ($p0) {
        this.$2E = $p0;
        return $p0;
    },
    $30: 0,
    get_$31: function () {
        return this.$30;
    },
    set_$31: function ($p0) {
        this.$30 = $p0;
        return $p0;
    },
    get_$33: function () {
        return this.$32;
    },
    set_$33: function ($p0) {
        this.$32 = $p0;
        return $p0;
    },
    $34: null,
    get_$35: function () {
        return this.$34;
    },
    set_$35: function ($p0) {
        this.$34 = $p0;
        return $p0;
    },
    $36: null,
    get_$37: function () {
        return this.$36;
    },
    set_$37: function ($p0) {
        this.$36 = $p0;
        return $p0;
    },
    $38: null,
    get_$39: function () {
        return this.$38;
    },
    set_$39: function ($p0) {
        this.$38 = $p0;
        return $p0;
    },
    $3A: null,
    get_$3B: function () {
        return this.$3A;
    },
    set_$3B: function ($p0) {
        this.$3A = $p0;
        return $p0;
    },
    $3C: null,
    get_$3D: function () {
        return this.$3C;
    },
    set_$3D: function ($p0) {
        this.$3C = $p0;
        if (this.$3C != null) {
            this.savedSuspendedActivity = this.$3C;
        }
        return $p0;
    },
    savedSuspendedActivity: null,
    get_$3F: function () {
        return this.$3E;
    },
    set_$3F: function ($p0) {
        this.$3E = $p0;
        return $p0;
    },
    $40: false,
    get_$41: function () {
        return this.$40;
    },
    set_$41: function ($p0) {
        this.$40 = $p0;
        return $p0;
    },
    $42: false,
    get_$43: function () {
        return this.$42;
    },
    set_$43: function ($p0) {
        this.$42 = $p0;
        return $p0;
    },
    $44: null,
    get_$45: function () {
        return this.$44;
    },
    set_$45: function ($p0) {
        this.$44 = $p0;
        return $p0;
    },
    isTentativeMode: function () {
        return this.$24;
    },
    evaluateDeliveryRequest: function (validationNavigationRequest) {
        this.$24 = true;
        var $0 = this.get_$2B();
        SCORM.LOG.silent = true;
        try {
            var strNavRequest = validationNavigationRequest;
            if (validationNavigationRequest.startsWith('jump.')) {
                strNavRequest = strNavRequest.substr(5) + 'jump';
            } else if (validationNavigationRequest.startsWith('choice.')) {
                strNavRequest = strNavRequest.substr(7) + 'choice';
            }
            if (this.getActiveAPI() != null) {
                this.getActiveAPI().getActivityTreeNode().updateSequencingState();
            }
            this.requestNavigation(strNavRequest);
        } finally {
            this.$24 = false;
            SCORM.LOG.silent = false;
            this.set_$2B($0);
            this.$78();
        }
        return this.get_$2D();
    },
    isValidNavigationRequest: function (validationNavigationRequest, isExpectTheSameChoice) {
        var isValid = false;
        if (validationNavigationRequest.startsWith('jump.') || validationNavigationRequest.startsWith('choice.')) {
            isValid = isExpectTheSameChoice;
        }
        var request = this.evaluateDeliveryRequest(validationNavigationRequest);
        return request != null && ((isValid) ? request.getIdentifier() === this.get_$39() : true);
    },
    requestNavigation: function (navigationRequest) {
        if (!this.$24 && this.getActiveAPI() != null && this.getActiveAPI().isInitAttempted() && !this.getActiveAPI().isFinishAttempted()) {
            this.getActiveAPI().getActivityTreeNode().setDataTreeValue('adl.nav.request', navigationRequest, false);
            this.onEventSCO(new SCORM.BaseActivityTreeNodeEventArgs(null, 3));
        } else {
            SCORM.LOG.displayMessage('Process Navigation: ' + navigationRequest, '0', null);
            this.set_$45(null);
            this.set_$2D(null);
            this.set_$3B(null);
            this.set_$35(null);
            this.set_$39(null);
            this.set_$37(null);
            this.set_$33(0);
            this.set_$3F(0);
            this.set_$31(0);
            this.set_$2F(0);
            if (navigationRequest === '_none_') {
                return;
            }
            if (navigationRequest === 'start') {
                this.set_$29(2);
            } else if (navigationRequest === 'continue') {
                this.set_$29(4);
            } else if (navigationRequest === 'previous') {
                this.set_$29(5);
            } else if (navigationRequest.endsWith('}jump')) {
                var request = navigationRequest.match(new RegExp('^{target=(' + SCORM.BaseUtils.ncName + ')}jump$'));
                if (request != null && request.length >= 2 && !isNullOrUndefined(request[1]) && request[1].length > 0) {
                    this.set_$29(14);
                    this.set_$39(request[1]);
                }
            } else if (navigationRequest.endsWith('}choice')) {
                var request = navigationRequest.match(new RegExp('^{target=(' + SCORM.BaseUtils.ncName + ')}choice$'));
                if (request != null && request.length >= 2 && !isNullOrUndefined(request[1]) && request[1].length > 0) {
                    this.set_$29(8);
                    this.set_$39(request[1]);
                }
            } else if (navigationRequest === 'exit') {
                this.set_$29(9);
            } else if (navigationRequest === 'exitAll') {
                this.set_$29(10);
            } else if (navigationRequest === 'abandonAll') {
                this.set_$29(12);
            } else if (navigationRequest === 'abandon') {
                this.set_$29(11);
            } else if (navigationRequest === 'suspendAll') {
                this.set_$29(13);
            } else if (navigationRequest === 'resumeAll') {
                this.set_$29(3);
            } else {
                this.set_$29(0);
            }
            this.$47();
        }
    },
    $46: function (name_index) {
        /*
        * todo: add the remaining items from teh Pseudo code index on pg SN-C-7
        */
        var seqErrorDefinitions = {};//pg SN-c-7 in SCORM SeqNav.pdf
        seqErrorDefinitions['NB.2.1-1'] = 'Current Activity is already defined / Sequencing session has already begun';
        seqErrorDefinitions['NB.2.1-2'] = 'Current Activity is not defined / Sequencing session has not begun';
        seqErrorDefinitions['NB.2.1-3'] = 'Suspended Activity is not defined';
        seqErrorDefinitions['NB.2.1-4'] = 'Flow Sequencing Control Mode violation';
        seqErrorDefinitions['NB.2.1-5'] = 'Flow or Forward Only Sequencing Control Mode violation';
        seqErrorDefinitions['NB.2.1-6'] = 'No activity is \'previous\' to the root';
        seqErrorDefinitions['NB.2.1-7'] = 'Unsupported navigation request';
        seqErrorDefinitions['NB.2.1-8'] = 'Choice Exit Sequencing Control Mode violation';
        seqErrorDefinitions['NB.2.1-9'] = 'No activities to consider';
        seqErrorDefinitions['NB.2.1-10'] = 'Choice Sequencing Control Mode violation';
        seqErrorDefinitions['NB.2.1-11'] = 'Target activity does not exist';
        seqErrorDefinitions['NB.2.1-12'] = 'Current Activity already terminated';
        seqErrorDefinitions['NB.2.1-13'] = 'Undefined navigation request';
        seqErrorDefinitions['TB.2.3-1'] = 'Current Activity is not defined / Sequencing session has not begun';
        seqErrorDefinitions['TB.2.3-2'] = 'Current Activity already terminated';
        seqErrorDefinitions['TB.2.3-3'] = 'Cannot suspend an inactive root';
        seqErrorDefinitions['TB.2.3-4'] = 'Activity tree root has no parent';
        seqErrorDefinitions['TB.2.3-5'] = 'Nothing to suspend; No active activities';
        seqErrorDefinitions['TB.2.3-6'] = 'Nothing to abandon; No active activities';
        seqErrorDefinitions['TB.2.3-7'] = 'Undefined termination request';
        seqErrorDefinitions['SB.2.1-1'] = 'Last activity in the tree';
        seqErrorDefinitions['SB.2.1-2'] = 'Cluster has no available children';
        seqErrorDefinitions['SB.2.1-3'] = 'No activity is \'previous\' to the root';
        seqErrorDefinitions['SB.2.1-4'] = 'Forward Only Sequencing Control Mode violation';
        seqErrorDefinitions['SB.2.2-1'] = 'Flow Sequencing Control Mode violation';
        seqErrorDefinitions['SB.2.2-2'] = 'Activity unavailable';
        seqErrorDefinitions['SB.2.4-1'] = 'Forward Traversal Blocked';
        seqErrorDefinitions['SB.2.4-2'] = 'Forward Only Sequencing Control Mode violation';
        seqErrorDefinitions['SB.2.4-3'] = 'No activity is \'previous\' to the root';
        seqErrorDefinitions['SB.2.5-1'] = 'Current Activity is defined / Sequencing session already begun';
        seqErrorDefinitions['SB.2.6-1'] = 'Current Activity is defined / Sequencing session already begun';
        seqErrorDefinitions['SB.2.6-2'] = 'No Suspended Activity defined';
        seqErrorDefinitions['SB.2.7-1'] = 'Current Activity is not defined / Sequencing session has not begun';
        seqErrorDefinitions['SB.2.7-2'] = 'Flow Sequencing Control Mode violation';
        seqErrorDefinitions['SB.2.8-1'] = 'Current Activity is not defined / Sequencing session has not begun';
        seqErrorDefinitions['SB.2.8-2'] = 'Flow Sequencing Control Mode violation';
        seqErrorDefinitions['SB.2.9-1'] = 'No target for Choice';
        seqErrorDefinitions['SB.2.9-2'] = 'Target activity does not exist or is unavailable';
        seqErrorDefinitions['SB.2.9.3'] = 'Target activity hidden from choice';
        seqErrorDefinitions['SB.2.9-4'] = 'Choice Sequencing Control Mode violation';
        seqErrorDefinitions['SB.2.9-5'] = 'No activities to consider';
        seqErrorDefinitions['SB.2.9-6'] = 'Unable to activate target; target is not a child of the Current Activity';
        seqErrorDefinitions['SB.2.9-7'] = 'Choice Exit Sequencing Control Mode violation';
        seqErrorDefinitions['SB.2.9-8'] = 'Unable to choose target activity \ufffd constrained choice';
        seqErrorDefinitions['SB.2.9-9'] = 'Choice request prevented by Flow-only activity';
        seqErrorDefinitions['SB.2.10-1'] = 'Current Activity is not defined / Sequencing session has not begun';
        seqErrorDefinitions['SB.2.10-2'] = 'Current Activity is active or suspended';
        seqErrorDefinitions['SB.2.10-3'] = 'Flow Sequencing Control Mode violation';
        seqErrorDefinitions['SB.2.11-1'] = 'Current Activity is not defined / Sequencing session has not begun';
        seqErrorDefinitions['SB.2.11-2'] = 'Current Activity has not been terminated';
        seqErrorDefinitions['SB.2.12-1'] = 'Undefined sequencing request';
        seqErrorDefinitions['SB.2.13-1'] = 'Current Activity is not defined / Sequencing session has not begun';
        seqErrorDefinitions['DB.1.1-1'] = 'Cannot deliver a non-leaf activity';
        seqErrorDefinitions['DB.1.1-2'] = 'Nothing to deliver';
        seqErrorDefinitions['DB.1.1-3'] = 'Activity unavailable';
        seqErrorDefinitions['DB.2-1'] = 'Identified activity is already active';
        if (!isUndefined(seqErrorDefinitions[name_index])) {
            return seqErrorDefinitions[name_index];
        } else {
            return null;
        }
    },
    $47: function () {
        this.$48();
        if (this.get_$29() === 0) {
            return;
        }
        if (this.get_$2F() !== 0) {
            this.$49();
            if (this.get_$2F() === 1) {
                return;
            }
            if (this.get_$31() !== 0) {}
        }
        if (this.get_$31() !== 0) {
            this.$4A();
            if (this.get_$31() === 1) {
                this.onEventSCO(new SCORM.BaseActivityTreeNodeEventArgs(null, 4));
                return;
            }
            if (this.get_$3F() === 1) {
                this.set_$2B(null);
                this.onEventSCO(new SCORM.BaseActivityTreeNodeEventArgs(null, 5));
                return;
            }
            if (this.get_$2D() == null) {
                this.onEventSCO(new SCORM.BaseActivityTreeNodeEventArgs(null, 4));
                return;
            }
        }
        if (this.get_$2D() != null) {
            var $0 = this.$67();
            if (!$0) {
                this.set_$2D(null);
                return;
            } else {
                this.$68();
            }
        }
    },
    $48: function () {
        switch (this.get_$29()) {
            case 2:
                if (this.get_$2B() == null) {
                    this.set_$29(1);
                    this.set_$2F(0);
                    this.set_$31(3);
                    this.set_$37(null);
                    this.set_$45(null);
                    return;
                } else {
                    this.set_$29(0);
                    this.set_$2F(0);
                    this.set_$31(0);
                    this.set_$37(null);
                    this.set_$45('NB.2.1-1');
                    SCORM.LOG.displayMessage('[NB.2.1] Navigation Request Process', this.get_$45(), this.$46(this.get_$45()));
                    return;
                }
            case 3:
                if (this.get_$2B() == null) {
                    if (this.get_$3D() != null) {
                        this.set_$29(1);
                        this.set_$2F(0);
                        this.set_$31(4);
                        this.set_$37(null);
                        this.set_$45(null);
                        return;
                    } else {
                        this.set_$29(0);
                        this.set_$2F(0);
                        this.set_$31(0);
                        this.set_$37(null);
                        this.set_$45('NB.2.1-3');
                        SCORM.LOG.displayMessage('[NB.2.1] Navigation Request Process', this.get_$45(), this.$46(this.get_$45()));
                        return;
                    }
                } else {
                    this.set_$29(0);
                    this.set_$2F(0);
                    this.set_$31(0);
                    this.set_$37(null);
                    this.set_$45('NB.2.1-1');
                    SCORM.LOG.displayMessage('[NB.2.1] Navigation Request Process', this.get_$45(), this.$46(this.get_$45()));
                    return;
                }
            case 4:
                if (this.get_$2B() == null) {
                    this.set_$29(0);
                    this.set_$2F(0);
                    this.set_$31(0);
                    this.set_$37(null);
                    this.set_$45('NB.2.1-2');
                    SCORM.LOG.displayMessage('[NB.2.1] Navigation Request Process', this.get_$45(), this.$46(this.get_$45()));
                    return;
                }
                if (this.get_$2B() !== this.getOrganization() && this.get_$2B().getParentSequencing().flow) {
                    if (this.get_$2B().get_isActive()) {
                        this.set_$29(1);
                        this.set_$2F(3);
                        this.set_$31(5);
                        this.set_$37(null);
                        this.set_$45(null);
                        return;
                    } else {
                        this.set_$29(1);
                        this.set_$2F(0);
                        this.set_$31(5);
                        this.set_$37(null);
                        this.set_$45(null);
                        return;
                    }
                } else {
                    this.set_$29(0);
                    this.set_$2F(0);
                    this.set_$31(0);
                    this.set_$37(null);
                    this.set_$45('NB.2.1-4');
                    SCORM.LOG.displayMessage('[NB.2.1] Navigation Request Process', this.get_$45(), this.$46(this.get_$45()));
                    return;
                }
            case 5:
                if (this.get_$2B() == null) {
                    this.set_$29(0);
                    this.set_$2F(0);
                    this.set_$31(0);
                    this.set_$37(null);
                    this.set_$45('NB.2.1-2');
                    SCORM.LOG.displayMessage('[NB.2.1] Navigation Request Process', this.get_$45(), this.$46(this.get_$45()));
                    return;
                }
                if (this.get_$2B() !== this.getOrganization()) {
                    if (this.get_$2B().getParentSequencing().flow && !this.get_$2B().getParentSequencing().forwardOnly) {
                        if (this.get_$2B().get_isActive()) {
                            this.set_$29(1);
                            this.set_$2F(3);
                            this.set_$31(6);
                            this.set_$37(null);
                            this.set_$45(null);
                            return;
                        } else {
                            this.set_$29(1);
                            this.set_$2F(0);
                            this.set_$31(6);
                            this.set_$37(null);
                            this.set_$45(null);
                            return;
                        }
                    } else {
                        this.set_$29(0);
                        this.set_$2F(0);
                        this.set_$31(0);
                        this.set_$37(null);
                        this.set_$45('NB.2.1-5');
                        SCORM.LOG.displayMessage('[NB.2.1] Navigation Request Process', this.get_$45(), this.$46(this.get_$45()));
                        return;
                    }
                } else {
                    this.set_$29(0);
                    this.set_$2F(0);
                    this.set_$31(0);
                    this.set_$37(null);
                    this.set_$45('NB.2.1-6');
                    SCORM.LOG.displayMessage('[NB.2.1] Navigation Request Process', this.get_$45(), this.$46(this.get_$45()));
                    return;
                }
            case 6:
                this.set_$29(0);
                this.set_$2F(0);
                this.set_$31(0);
                this.set_$37(null);
                this.set_$45('NB.2.1-7');
                SCORM.LOG.displayMessage('[NB.2.1] Navigation Request Process', this.get_$45(), this.$46(this.get_$45()));
                return;
            case 7:
                this.set_$29(0);
                this.set_$2F(0);
                this.set_$31(0);
                this.set_$37(null);
                this.set_$45('NB.2.1-7');
                SCORM.LOG.displayMessage('[NB.2.1] Navigation Request Process', this.get_$45(), this.$46(this.get_$45()));
                return;
            case 8:
                var orgNode = this.findNode(this.get_$39());
                if (orgNode != null) {
                    if (orgNode === this.getOrganization() || orgNode.getParentSequencing().choice) {
                        if (this.get_$2B() == null) {
                            this.set_$29(1);
                            this.set_$2F(0);
                            this.set_$31(7);
                            this.set_$37(orgNode);
                            this.set_$45(null);
                            return;
                        }
                        if (!orgNode.isSibling(this.get_$2B())) {
                            var parentNode = this.findCommonParent(this.get_$2B(), orgNode);
                            var $3 = this.get_$2B().getPath(parentNode, true, false, false);
                            if ($3.length > 0) {
                                var _enum1 = $3.getEnumerator();
                                while (_enum1.moveNext()) {
                                    var currEnum = _enum1.get_current();
                                    if (currEnum.get_isActive() && !currEnum.getSequencing().choiceExit) {
                                        this.set_$29(0);
                                        this.set_$2F(0);
                                        this.set_$31(0);
                                        this.set_$37(null);
                                        this.set_$45('NB.2.1-8');
                                        SCORM.LOG.displayMessage('[NB.2.1] Navigation Request Process', this.get_$45(), this.$46(this.get_$45()));
                                        return;
                                    }
                                }
                            } else {
                                this.set_$29(0);
                                this.set_$2F(0);
                                this.set_$31(0);
                                this.set_$37(null);
                                this.set_$45('NB.2.1-9');
                                SCORM.LOG.displayMessage('[NB.2.1] Navigation Request Process', this.get_$45(), this.$46(this.get_$45()));
                                return;
                            }
                        }
                        if (this.get_$2B().get_isActive() && !this.get_$2B().getSequencing().choiceExit) {
                            this.set_$29(0);
                            this.set_$2F(0);
                            this.set_$31(0);
                            this.set_$37(null);
                            this.set_$45('NB.2.1-8');
                            SCORM.LOG.displayMessage('[NB.2.1] Navigation Request Process', this.get_$45(), this.$46(this.get_$45()));
                            return;
                        }
                        if (this.get_$2B().get_isActive()) {
                            this.set_$29(1);
                            this.set_$2F(3);
                            this.set_$31(7);
                            this.set_$37(orgNode);
                            this.set_$45(null);
                            return;
                        } else {
                            this.set_$29(1);
                            this.set_$2F(0);
                            this.set_$31(7);
                            this.set_$37(orgNode);
                            this.set_$45(null);
                            return;
                        }
                    } else {
                        this.set_$29(0);
                        this.set_$2F(0);
                        this.set_$31(0);
                        this.set_$37(null);
                        this.set_$45('NB.2.1-10');
                        SCORM.LOG.displayMessage('[NB.2.1] Navigation Request Process', this.get_$45(), this.$46(this.get_$45()));
                        return;
                    }
                } else {
                    this.set_$29(0);
                    this.set_$2F(0);
                    this.set_$31(0);
                    this.set_$37(null);
                    this.set_$45('NB.2.1-11');
                    SCORM.LOG.displayMessage('[NB.2.1] Navigation Request Process', this.get_$45(), this.$46(this.get_$45()));
                    return;
                }
            case 9:
                if (this.get_$2B() != null) {
                    if (this.get_$2B().get_isActive()) {
                        this.set_$29(1);
                        this.set_$2F(3);
                        this.set_$31(8);
                        this.set_$37(null);
                        this.set_$45(null);
                        return;
                    } else {
                        this.set_$29(0);
                        this.set_$2F(0);
                        this.set_$31(0);
                        this.set_$37(null);
                        this.set_$45('NB.2.1-12');
                        SCORM.LOG.displayMessage('[NB.2.1] Navigation Request Process', this.get_$45(), this.$46(this.get_$45()));
                        return;
                    }
                } else {
                    this.set_$29(0);
                    this.set_$2F(0);
                    this.set_$31(0);
                    this.set_$37(null);
                    this.set_$45('NB.2.1-2');
                    SCORM.LOG.displayMessage('[NB.2.1] Navigation Request Process', this.get_$45(), this.$46(this.get_$45()));
                    return;
                }
            case 10:
                if (this.get_$2B() != null) {
                    this.set_$29(1);
                    this.set_$2F(4);
                    this.set_$31(8);
                    this.set_$37(null);
                    this.set_$45(null);
                    return;
                } else {
                    this.set_$29(0);
                    this.set_$2F(0);
                    this.set_$31(0);
                    this.set_$37(null);
                    this.set_$45('NB.2.1-2');
                    SCORM.LOG.displayMessage('[NB.2.1] Navigation Request Process', this.get_$45(), this.$46(this.get_$45()));
                    return;
                }
            case 11:
                if (this.get_$2B() != null) {
                    if (this.get_$2B().get_isActive()) {
                        this.set_$29(1);
                        this.set_$2F(5);
                        this.set_$31(8);
                        this.set_$37(null);
                        this.set_$45(null);
                        this.get_$2B().set_isAbandoned(true);
                        return;
                    } else {
                        this.set_$29(0);
                        this.set_$2F(0);
                        this.set_$31(0);
                        this.set_$37(null);
                        this.set_$45('NB.2.1-12');
                        SCORM.LOG.displayMessage('[NB.2.1] Navigation Request Process', this.get_$45(), this.$46(this.get_$45()));
                        return;
                    }
                } else {
                    this.set_$29(0);
                    this.set_$2F(0);
                    this.set_$31(0);
                    this.set_$37(null);
                    this.set_$45('NB.2.1-2');
                    SCORM.LOG.displayMessage('[NB.2.1] Navigation Request Process', this.get_$45(), this.$46(this.get_$45()));
                    return;
                }
            case 12:
                if (this.get_$2B() != null) {
                    this.set_$29(1);
                    this.set_$2F(6);
                    this.set_$31(8);
                    this.set_$37(null);
                    this.set_$45(null);
                    this.set_isAbandoned(true);
                    return;
                } else {
                    this.set_$29(0);
                    this.set_$2F(0);
                    this.set_$31(0);
                    this.set_$37(null);
                    this.set_$45('NB.2.1-2');
                    SCORM.LOG.displayMessage('[NB.2.1] Navigation Request Process', this.get_$45(), this.$46(this.get_$45()));
                    return;
                }
            case 13:
                if (this.get_$2B() != null) {
                    this.set_$29(1);
                    this.set_$2F(7);
                    this.set_$31(8);
                    this.set_$37(null);
                    this.set_$45(null);
                    return;
                } else {
                    this.set_$29(0);
                    this.set_$2F(0);
                    this.set_$31(0);
                    this.set_$37(null);
                    this.set_$45('NB.2.1-2');
                    SCORM.LOG.displayMessage('[NB.2.1] Navigation Request Process', this.get_$45(), this.$46(this.get_$45()));
                    return;
                }
            case 14:
                var node = this.findNode(this.get_$39());
                if (node != null && node.isAvailableChildren()) {
                    this.set_$29(1);
                    this.set_$2F(3);
                    this.set_$31(9);
                    this.set_$37(node);
                    this.set_$45(null);
                    return;
                } else {
                    this.set_$29(0);
                    this.set_$2F(0);
                    this.set_$31(0);
                    this.set_$37(null);
                    this.set_$45('NB.2.1-11');
                    SCORM.LOG.displayMessage('[NB.2.1] Navigation Request Process', this.get_$45(), this.$46(this.get_$45()));
                    return;
                }
        }
        this.set_$29(0);
        this.set_$2F(0);
        this.set_$31(0);
        this.set_$37(null);
        this.set_$45('NB.2.1-13');
        SCORM.LOG.displayMessage('[NB.2.1] Navigation Request Process', this.get_$45(), this.$46(this.get_$45()));
    },
    $49: function () {
        if (this.get_$2B() == null) {
            this.set_$2F(1);
            this.set_$31(0);
            this.set_$45('TB.2.3-1');
            SCORM.LOG.displayMessage('[TB.2.3] Termination Request Process', this.get_$45(), this.$46(this.get_$45()));
            return;
        }
        if ((this.get_$2F() === 3 || this.get_$2F() === 5) && !this.get_$2B().get_isActive()) {
            this.set_$2F(1);
            this.set_$31(0);
            this.set_$45('TB.2.3-2');
            SCORM.LOG.displayMessage('[TB.2.3] Termination Request Process', this.get_$45(), this.$46(this.get_$45()));
            return;
        }
        switch (this.get_$2F()) {
            case 3:
                this.$55(this.get_$2B());
                this.$56();
                var $0 = true;
                while ($0) {
                    $0 = false;
                    this.$59(this.get_$2B());
                    if (this.get_$2F() === 4) {
                        this.$49();
                        return;
                    }
                    if (this.get_$2F() === 8) {
                        if (this.get_$2B() !== this.getOrganization()) {
                            this.set_$2B(this.get_$2B().getParent());
                            this.$55(this.get_$2B());
                            $0 = true;
                        } else {
                            this.set_$2F(1);
                            this.set_$31(0);
                            this.set_$45('TB.2.3-4');
                            SCORM.LOG.displayMessage('[TB.2.3] Termination Request Process', this.get_$45(), this.$46(this.get_$45()));
                            return;
                        }
                    } else {
                        if (this.get_$2B() === this.getOrganization() && this.get_$31() !== 10) {
                            this.set_$2F(2);
                            this.set_$31(8);
                            this.set_$45(null);
                            return;
                        }
                    }
                }
                this.set_$2F(2);
                this.set_$45(null);
                return;
            case 4:
                if (this.get_$2B().get_isActive()) {
                    this.$55(this.get_$2B());
                }
                this.$5A(this.getOrganization());
                this.$55(this.getOrganization());
                this.set_$2B(this.getOrganization());
                this.set_$2F(2);
                if (this.get_$31() === 0) {
                    this.set_$31(8);
                }
                this.set_$45(null);
                return;
            case 7:
                if (this.get_$2B().get_isActive() || this.get_$2B().get_isSuspended()) {
                    this.$5B(this.get_$2B());
                    this.set_$3D(this.get_$2B());
                } else {
                    if (this.get_$2B() !== this.getOrganization()) {
                        this.set_$3D(this.get_$2B().getParent());
                    } else {
                        this.set_$2F(1);
                        this.set_$31(0);
                        this.set_$45('TB.2.3-3');
                        SCORM.LOG.displayMessage('[TB.2.3] Termination Request Process', this.get_$45(), this.$46(this.get_$45()));
                        return;
                    }
                }
                var $1 = this.get_$3D().getPath(this.getOrganization(), true, true, false);
                if ($1.length === 0) {
                    this.set_$2F(1);
                    this.set_$31(0);
                    this.set_$45('TB.2.3-5');
                    SCORM.LOG.displayMessage('[TB.2.3] Termination Request Process', this.get_$45(), this.$46(this.get_$45()));
                    return;
                }
                var _enum1 = $1.getEnumerator();
                while (_enum1.moveNext()) {
                    var currEnum = _enum1.get_current();
                    currEnum.set_isActive(false);
                    currEnum.set_isSuspended(true);
                }
                this.set_$2B(this.getOrganization());
                this.set_$2F(2);
                this.set_$31(8);
                this.set_$45(null);
                return;
            case 5:
                this.get_$2B().set_isActive(false);
                this.set_$2F(2);
                this.set_$31(0);
                this.set_$45(null);
                return;
            case 6:
                var $2 = this.get_$2B().getPath(this.getOrganization(), true, true, false);
                if ($2.length === 0) {
                    this.set_$2F(1);
                    this.set_$31(0);
                    this.set_$45('TB.2.3-6');
                    SCORM.LOG.displayMessage('[TB.2.3] Termination Request Process', this.get_$45(), this.$46(this.get_$45()));
                    return;
                }
                var _enum2 = $2.getEnumerator();
                while (_enum2.moveNext()) {
                    var currEnum2 = _enum2.get_current();
                    currEnum2.set_isActive(false);
                }
                this.set_$2B(this.getOrganization());
                this.set_$2F(2);
                this.set_$31(8);
                this.set_$45(null);
                return;
        }
        this.set_$2F(1);
        this.set_$31(0);
        this.set_$45('TB.2.3-7');
        SCORM.LOG.displayMessage('[TB.2.3] Termination Request Process', this.get_$45(), this.$46(this.get_$45()));
    },
    $4A: function () {
        switch (this.get_$31()) {
            case 3:
                this.$6A();
                if (this.get_$45() != null) {
                    this.set_$31(1);
                    this.set_$2D(null);
                    this.set_$3F(0);
                    return;
                } else {
                    this.set_$31(2);
                    this.set_$45(null);
                    return;
                }
            case 4:
                this.$4B();
                if (this.get_$45() != null) {
                    this.set_$31(1);
                    this.set_$2D(null);
                    this.set_$3F(0);
                    return;
                } else {
                    this.set_$31(2);
                    this.set_$3F(0);
                    this.set_$45(null);
                    return;
                }
            case 8:
                this.$4C();
                if (this.get_$45() != null) {
                    this.set_$31(1);
                    this.set_$2D(null);
                    this.set_$3F(0);
                    return;
                } else {
                    this.set_$31(2);
                    this.set_$2D(null);
                    this.set_$45(null);
                    return;
                }
            case 10:
                this.$4D();
                if (this.get_$45() != null) {
                    this.set_$31(1);
                    this.set_$2D(null);
                    this.set_$3F(0);
                    return;
                } else {
                    this.set_$31(2);
                    this.set_$3F(0);
                    this.set_$45(null);
                    return;
                }
            case 5:
                this.$4E();
                if (this.get_$45() != null) {
                    this.set_$31(1);
                    this.set_$2D(null);
                    this.set_$3F(0);
                    return;
                } else {
                    this.set_$31(2);
                    this.set_$45(null);
                    return;
                }
            case 6:
                this.$4F();
                if (this.get_$45() != null) {
                    this.set_$31(1);
                    this.set_$2D(null);
                    this.set_$3F(0);
                    return;
                } else {
                    this.set_$31(2);
                    this.set_$3F(0);
                    this.set_$45(null);
                    return;
                }
            case 7:
                this.$50();
                if (this.get_$45() != null) {
                    this.set_$31(1);
                    this.set_$2D(null);
                    this.set_$3F(0);
                    return;
                } else {
                    this.set_$31(2);
                    this.set_$3F(0);
                    this.set_$45(null);
                    return;
                }
            case 9:
                this.$54();
                if (this.get_$45() != null) {
                    this.set_$31(1);
                    this.set_$2D(null);
                    this.set_$3F(0);
                    return;
                } else {
                    this.set_$31(2);
                    this.set_$3F(0);
                    this.set_$45(null);
                    return;
                }
        }
        this.set_$31(1);
        this.set_$2D(null);
        this.set_$3F(0);
        this.set_$45('SB.2.12-1');
        SCORM.LOG.displayMessage('[SB.2.12] Sequencing Request Process', this.get_$45(), this.$46(this.get_$45()));
    },
    $4B: function () {
        if (this.get_$2B() != null) {
            this.set_$2D(null);
            this.set_$45('SB.2.6-1');
            SCORM.LOG.displayMessage('[SB.2.6] Resume All Sequencing Request Process', this.get_$45(), this.$46(this.get_$45()));
            return;
        }
        if (this.get_$3D() == null) {
            this.set_$2D(null);
            this.set_$45('SB.2.6-2');
            SCORM.LOG.displayMessage('[SB.2.6] Resume All Sequencing Request Process', this.get_$45(), this.$46(this.get_$45()));
            return;
        }
        this.set_$2D(this.get_$3D());
        this.set_$45(null);
        return;
    },
    $4C: function () {
        if (this.get_$2B() == null) {
            this.set_$3F(2);
            this.set_$45('SB.2.11-1');
            SCORM.LOG.displayMessage('[SB.2.11] Exit Sequencing Request Process', this.get_$45(), this.$46(this.get_$45()));
            return;
        }
        if (this.get_$2B().get_isActive()) {
            this.set_$3F(2);
            this.set_$45('SB.2.11-2');
            SCORM.LOG.displayMessage('[SB.2.11] Exit Sequencing Request Process', this.get_$45(), this.$46(this.get_$45()));
            return;
        }
        if (this.get_$2B() === this.getOrganization()) {
            this.set_$3F(1);
            this.set_$45(null);
            return;
        }
        this.set_$3F(2);
        this.set_$45(null);
        return;
    },
    $4D: function () {
        if (this.get_$2B() == null) {
            this.set_$2D(null);
            this.set_$45('SB.2.10-1');
            SCORM.LOG.displayMessage('[SB.2.10] Retry Sequencing Request Process', this.get_$45(), this.$46(this.get_$45()));
            return;
        }
        if (this.get_$2B().get_isActive() || this.get_$2B().get_isSuspended()) {
            this.set_$2D(null);
            this.set_$45('SB.2.10-2');
            SCORM.LOG.displayMessage('[SB.2.10] Retry Sequencing Request Process', this.get_$45(), this.$46(this.get_$45()));
            return;
        }
        if (!this.get_$2B().isLeaf()) {
            var $0 = this.$6B(this.get_$2B(), 1, true);
            if (!$0) {
                this.set_$2D(null);
                this.set_$45('SB.2.10-3');
                SCORM.LOG.displayMessage('[SB.2.10] Retry Sequencing Request Process', this.get_$45(), this.$46(this.get_$45()));
                return;
            } else {
                this.set_$2D(this.get_$35());
                this.set_$45(null);
                return;
            }
        } else {
            this.set_$2D(this.get_$2B());
            this.set_$45(null);
            return;
        }
    },
    $4E: function () {
        if (this.get_$2B() == null) {
            this.set_$2D(null);
            this.set_$45('SB.2.7-1');
            SCORM.LOG.displayMessage('[SB.2.7] Continue Sequencing Request Process', this.get_$45(), this.$46(this.get_$45()));
            return;
        }
        if (this.get_$2B() !== this.getOrganization()) {
            if (!this.get_$2B().getParentSequencing().flow) {
                this.set_$2D(null);
                this.set_$45('SB.2.7-2');
                SCORM.LOG.displayMessage('[SB.2.7] Continue Sequencing Request Process', this.get_$45(), this.$46(this.get_$45()));
                return;
            }
        }
        var $0 = this.$6B(this.get_$2B(), 1, false);
        if (!$0) {
            this.set_$2D(null);
            return;
        } else {
            this.set_$2D(this.get_$35());
            this.set_$45(null);
            return;
        }
    },
    $4F: function () {
        if (this.get_$2B() == null) {
            this.set_$2D(null);
            this.set_$45('SB.2.8-1');
            SCORM.LOG.displayMessage('[SB.2.8] Previous Sequencing Request Process', this.get_$45(), this.$46(this.get_$45()));
            return;
        }
        if (this.get_$2B() !== this.getOrganization()) {
            if (!this.get_$2B().getParentSequencing().flow) {
                this.set_$2D(null);
                this.set_$45('SB.2.8-2');
                SCORM.LOG.displayMessage('[SB.2.8] Previous Sequencing Request Process', this.get_$45(), this.$46(this.get_$45()));
                return;
            }
        }
        var $0 = this.$6B(this.get_$2B(), 2, false);
        if (!$0) {
            this.set_$2D(null);
            return;
        } else {
            this.set_$2D(this.get_$35());
            this.set_$45(null);
            return;
        }
    },
    $50: function () {
        if (this.get_$37() == null) {
            this.set_$2D(null);
            this.set_$45('SB.2.9-1');
            SCORM.LOG.displayMessage('[SB.2.9] Choice Sequencing Request Process', this.get_$45(), this.$46(this.get_$45()));
            return;
        }
        var $0 = this.get_$37().getPath(this.getOrganization(), true, true, true);
        var _enum1 = $0.getEnumerator();
        while (_enum1.moveNext()) {
            var currEnum = _enum1.get_current();
            if (currEnum !== this.getOrganization()) {
                if (!currEnum.isAvailableChildren()) {
                    this.set_$2D(null);
                    this.set_$45('SB.2.9-2');
                    SCORM.LOG.displayMessage('[SB.2.9] Choice Sequencing Request Process', this.get_$45(), this.$46(this.get_$45()));
                    return;
                }
            }
            var $4 = this.$57(currEnum.getSequencing().getConditionRulesForAction('hiddenFromChoice'), currEnum);
            if ($4 != null) {
                this.set_$2D(null);
                this.set_$45('SB.2.9-3');
                SCORM.LOG.displayMessage('[SB.2.9] Choice Sequencing Request Process', this.get_$45(), this.$46(this.get_$45()));
                return;
            }
        }
        if (this.get_$37() !== this.getOrganization()) {
            if (!this.get_$37().getParentSequencing().choice) {
                this.set_$2D(null);
                this.set_$45('SB.2.9-4');
                SCORM.LOG.displayMessage('[SB.2.9] Choice Sequencing Request Process', this.get_$45(), this.$46(this.get_$45()));
                return;
            }
        }
        var $1 = null;
        if (this.get_$2B() != null) {
            $1 = this.findCommonParent(this.get_$2B(), this.get_$37());
        } else {
            $1 = this.getOrganization();
        } if (this.get_$2B() === this.get_$37()) {} else if (this.get_$2B() != null && this.get_$2B().isSibling(this.get_$37())) {
            var $5 = this.get_$2B().getList(this.get_$37(), true, false);
            if ($5.length === 0) {
                this.set_$2D(null);
                this.set_$45('SB.2.9-5');
                SCORM.LOG.displayMessage('[SB.2.9] Choice Sequencing Request Process', this.get_$45(), this.$46(this.get_$45()));
                return;
            }
            var $6 = (this.get_$37().getOrderIndex() > this.get_$2B().getOrderIndex());
            var $enum2 = $5.getEnumerator();
            while ($enum2.moveNext()) {
                var $7 = $enum2.get_current();
                var $8 = this.$51($7, $6);
                if (!$8) {
                    this.set_$2D(null);
                    return;
                }
            }
        } else if (this.get_$2B() === $1 || this.get_$2B() == null) {
            var $9 = this.get_$37().getPath($1, false, true, true);
            if ($9.length === 0) {
                this.set_$2D(null);
                this.set_$45('SB.2.9-5');
                SCORM.LOG.displayMessage('[SB.2.9] Choice Sequencing Request Process', this.get_$45(), this.$46(this.get_$45()));
                return;
            }
            var $enum3 = $9.getEnumerator();
            while ($enum3.moveNext()) {
                var $A = $enum3.get_current();
                var $B = this.$51($A, true);
                if (!$B) {
                    this.set_$2D(null);
                    return;
                }
                if (!$A.get_isActive() && ($A !== $1 && $A.getSequencing().constrainedChoiceConsiderations_preventActivation)) {
                    this.set_$2D(null);
                    this.set_$45('SB.2.9-6');
                    SCORM.LOG.displayMessage('[SB.2.9] Choice Sequencing Request Process', this.get_$45(), this.$46(this.get_$45()));
                    return;
                }
            }
        } else if (this.get_$37() === $1) {
            var $C = this.get_$2B().getPath(this.get_$37(), true, true, false);
            if ($C.length === 0) {
                this.set_$2D(null);
                this.set_$45('SB.2.9-5');
                SCORM.LOG.displayMessage('[SB.2.9] Choice Sequencing Request Process', this.get_$45(), this.$46(this.get_$45()));
                return;
            }
            var $enum4 = $C.getEnumerator();
            while ($enum4.moveNext()) {
                var $D = $enum4.get_current();
                if ($C.indexOf($D) !== $C.length) {
                    if (!$D.getSequencing().choiceExit) {
                        this.set_$2D(null);
                        this.set_$45('SB.2.9-7');
                        SCORM.LOG.displayMessage('[SB.2.9] Choice Sequencing Request Process', this.get_$45(), this.$46(this.get_$45()));
                        return;
                    }
                }
            }
        } else if ($1.getLevel() < this.get_$37().getLevel()) {
            var $E = this.get_$2B().getPath($1, true, false, false);
            if ($E.length === 0) {
                this.set_$2D(null);
                this.set_$45('SB.2.9-5');
                SCORM.LOG.displayMessage('[SB.2.9] Choice Sequencing Request Process', this.get_$45(), this.$46(this.get_$45()));
                return;
            }
            var $F = null;
            var $enum5 = $E.getEnumerator();
            while ($enum5.moveNext()) {
                var currEnum3 = $enum5.get_current();
                if (!currEnum3.getSequencing().choiceExit) {
                    this.set_$2D(null);
                    this.set_$45('SB.2.9-7');
                    SCORM.LOG.displayMessage('[SB.2.9] Choice Sequencing Request Process', this.get_$45(), this.$46(this.get_$45()));
                    return;
                }
                if ($F == null) {
                    if (currEnum3.getSequencing().constrainedChoiceConsiderations_constrainChoice) {
                        $F = currEnum3;
                    }
                }
            }
            if ($F != null) {
                var $13 = (this.get_$37().getOrderIndex() > $F.getOrderIndex());
                this.$52($F, $13);
                var $14 = this.get_$3B();
                if ((!$14.getParentSequencing().flow || !this.get_$37().getParentSequencing().flow) && this.get_$37() !== $14 && this.get_$37() !== $F) {
                    this.set_$2D(null);
                    this.set_$45('SB.2.9-8');
                    SCORM.LOG.displayMessage('[SB.2.9] Choice Sequencing Request Process', this.get_$45(), this.$46(this.get_$45()));
                    return;
                }
            }
            var $10 = this.get_$37().getPath($1, false, true, true);
            if ($10.length === 0) {
                this.set_$2D(null);
                this.set_$45('SB.2.9-5');
                SCORM.LOG.displayMessage('[SB.2.9] Choice Sequencing Request Process', this.get_$45(), this.$46(this.get_$45()));
                return;
            }
            var $11 = this.findCommonParent(this.get_$2B(), this.get_$37());
            if (($11 !== this.get_$37() && $11 !== this.get_$37().getParent()) || ($11 === this.get_$37().getParent() && $11 !== this.get_$2B())) {
                var $enum6 = $10.getEnumerator();
                while ($enum6.moveNext()) {
                    var $15 = $enum6.get_current();
                    var $16 = this.$51($15, true);
                    if (!$16) {
                        this.set_$2D(null);
                        return;
                    }
                    if (!$15.get_isActive() && ($15 !== $1 && $15.getSequencing().constrainedChoiceConsiderations_preventActivation)) {
                        this.set_$2D(null);
                        this.set_$45('SB.2.9-6');
                        SCORM.LOG.displayMessage('[SB.2.9] Choice Sequencing Request Process', this.get_$45(), this.$46(this.get_$45()));
                        return;
                    }
                }
            } else {
                $10.add(this.get_$37());
                var $enum7 = $10.getEnumerator();
                while ($enum7.moveNext()) {
                    var $17 = $enum7.get_current();
                    if (!$17.get_isActive() && ($17 !== $1 && $17.getSequencing().constrainedChoiceConsiderations_preventActivation)) {
                        this.set_$2D(null);
                        this.set_$45('SB.2.9-6');
                        SCORM.LOG.displayMessage('[SB.2.9] Choice Sequencing Request Process', this.get_$45(), this.$46(this.get_$45()));
                        return;
                    }
                }
            }
        }
        if (this.get_$37().isLeaf()) {
            this.set_$2D(this.get_$37());
            this.set_$45(null);
            return;
        }
        var $2 = this.$6B(this.get_$37(), 1, true);
        if (!$2) {
            this.$5A($1);
            this.$55($1);
            this.set_$2B(this.get_$37());
            this.set_$2D(null);
            this.set_$45('SB.2.9-9');
            SCORM.LOG.displayMessage('[SB.2.9] Choice Sequencing Request Process', this.get_$45(), this.$46(this.get_$45()));
            return;
        } else {
            this.set_$2D(this.get_$35());
            this.set_$45(null);
            return;
        }
    },
    $51: function ($p0, $p1) {
        if ($p1) {
            var $0 = this.$57($p0.getSequencing().getConditionRulesForAction('stopForwardTraversal'), $p0);
            if ($0 != null) {
                this.set_$43(false);
                this.set_$45('SB.2.4-1');
                SCORM.LOG.displayMessage('[SB.2.4] Choice Activity Traversal Subprocess', this.get_$45(), this.$46(this.get_$45()));
                return this.get_$43();
            }
            this.set_$43(true);
            this.set_$45(null);
            return this.get_$43();
        }
        if (!$p1) {
            if ($p0 !== this.getOrganization()) {
                if ($p0.getParentSequencing().forwardOnly) {
                    this.set_$43(false);
                    this.set_$45('SB.2.4-2');
                    SCORM.LOG.displayMessage('[SB.2.4] Choice Activity Traversal Subprocess', this.get_$45(), this.$46(this.get_$45()));
                    return this.get_$43();
                }
            } else {
                this.set_$43(false);
                this.set_$45('SB.2.4-3');
                SCORM.LOG.displayMessage('[SB.2.4] Choice Activity Traversal Subprocess', this.get_$45(), this.$46(this.get_$45()));
                return this.get_$43();
            }
            this.set_$43(true);
            this.set_$45(null);
            return this.get_$43();
        }
        return false;
    },
    $52: function ($p0, $p1) {
        var $0 = this.$53($p0, $p1);
        if ($0 == null) {
            this.set_$3B($p0);
        } else {
            this.set_$3B($0);
        }
    },
    $53: function ($p0, $p1) {
        if ($p1) {
            if ($p0.isLastActivityInTree() || $p0 === this.getOrganization()) {
                this.set_$35(null);
                return this.get_$35();
            }
            if ($p0.isLastChildrenForParent()) {
                var $0 = this.$53($p0.getParent(), true);
                this.set_$35($0);
                return this.get_$35();
            } else {
                var $1 = $p0.getNextSibling();
                this.set_$35($1);
                return this.get_$35();
            }
        }
        if (!$p1) {
            if ($p0 === this.getOrganization()) {
                this.set_$35(null);
                return this.get_$35();
            }
            if ($p0.isFirstChildrenForParent()) {
                var $2 = this.$53($p0.getParent(), false);
                this.set_$35($2);
                return this.get_$35();
            } else {
                var $3 = $p0.getPreviousSibling();
                this.set_$35($3);
                return this.get_$35();
            }
        }
        return null;
    },
    $54: function () {
        if (this.get_$2B() == null) {
            this.set_$2D(null);
            this.set_$45('SB.2.13-1');
            SCORM.LOG.displayMessage('[SB.2.13] Jump Sequencing Request Process', this.get_$45(), this.$46(this.get_$45()));
            return;
        }
        this.set_$2D(this.get_$37());
        this.set_$45(null);
    },
    $55: function ($p0) {
        if ($p0.isLeaf()) {
            if ($p0.getSequencing().tracked) {
                if (!$p0.get_isSuspended()) {
                    if (!$p0.getSequencing().completionSetByContent) {
                        $p0.getSequencing().status.set_attemptProgressStatus(true);
                        $p0.getSequencing().status.set_attemptCompletionStatus(true);
                    }
                    if (!$p0.getSequencing().objectiveSetByContent) {
                        var $0 = $p0.getSequencing().getObjectives();
                        var $enum1 = $0.getEnumerator();
                        while ($enum1.moveNext()) {
                            var $1 = $enum1.get_current();
                            if ($1.contributeToRollup) {
                                $1.status.set_objectiveProgressStatus(true);
                                $1.status.set_objectiveSatisfiedStatus(true);
                            }
                        }
                    }
                }
            }
        } else {
            if ($p0.hasSuspendedChildren()) {
                $p0.set_isSuspended(true);
            } else {
                $p0.set_isSuspended(false);
            }
        }
        $p0.set_isActive(false);
        this.$5B($p0);
        this.$71();
    },
    $56: function () {
        var $0 = this.get_$2B().getParent().getPath(this.getOrganization(), true, true, true);
        var $1 = null;
        var $enum1 = $0.getEnumerator();
        while ($enum1.moveNext()) {
            var $2 = $enum1.get_current();
            var $3 = this.$57($2.getSequencing().getConditionRulesForAction('exit'), $2);
            if ($3 != null) {
                $1 = $2;
                break;
            }
        }
        if ($1 != null) {
            this.$5A($1);
            this.$55($1);
            this.set_$2B($1);
        }
    },
    $57: function ($p0, $p1) {
        if ($p0 != null && $p0.length > 0) {
            var $enum1 = $p0.getEnumerator();
            while ($enum1.moveNext()) {
                var $0 = $enum1.get_current();
                var $1 = this.$58($0, $p1);
                if ($1 === 'true') {
                    return $0['action'];
                }
            }
        }
        return null;
    },
    $58: function ($p0, $p1) {
        if (!$p1.getSequencing().tracked) {
            return 'unknown';
        }
        var $0 = [];
        var $1 = $p0['conditionCombination'];
        var $dict1 = $p0;
        for (var $key2 in $dict1) {
            var $3 = {
                key: $key2,
                value: $dict1[$key2]
            };
            if (!$3.key.startsWith('rule_')) {
                continue;
            }
            var $4 = 'false';
            var $5 = ($3.value)['referencedObjective'];
            var $6 = ($3.value)['condition'];
            var $7 = ($3.value)['operator'] === 'not';
            var $8 = ($3.value)['measureThreshold'];
            var $9 = $p1.getSequencing().status;
            if ($5 != null && $5.length > 0) {
                var $A = $p1.getSequencing().findObjective($5);
                if ($A != null) {
                    $9 = $A.status;
                }
            }
            if ($6 === 'satisfied') {
                $4 = ($9.get_objectiveProgressStatus() && $9.get_objectiveSatisfiedStatus()) ? 'true' : 'false';
                if (!$9.get_objectiveProgressStatus()) {
                    $4 = 'unknown';
                }
            }
            if ($6 === 'objectiveStatusKnown') {
                $4 = ($9.get_objectiveProgressStatus()) ? 'true' : 'false';
            }
            if ($6 === 'objectiveMeasureKnown') {
                $4 = ($9.get_objectiveMeasureStatus()) ? 'true' : 'false';
            }
            if ($6 === 'objectiveMeasureGreaterThan') {
                $4 = ($9.get_objectiveMeasureStatus() && $9.get_objectiveNormalizedMeasure() > parseFloat($8)) ? 'true' : 'false';
                if (!$9.get_objectiveMeasureStatus()) {
                    $4 = 'unknown';
                }
            }
            if ($6 === 'objectiveMeasureLessThan') {
                $4 = ($9.get_objectiveMeasureStatus() && $9.get_objectiveNormalizedMeasure() < parseFloat($8)) ? 'true' : 'false';
                if (!$9.get_objectiveMeasureStatus()) {
                    $4 = 'unknown';
                }
            }
            if ($6 === 'completed') {
                $4 = ($9.get_attemptProgressStatus() && $9.get_attemptCompletionStatus()) ? 'true' : 'false';
                if ($p1.isCompletedbymeasure() && !$9.attemptCompletionAmountStatus) {
                    $4 = 'unknown';
                }
                if (!$9.get_attemptProgressStatus()) {
                    $4 = 'unknown';
                }
            }
            if ($6 === 'activityProgressKnown') {
                $4 = ($9.activityProgressStatus && $9.get_attemptProgressStatus()) ? 'true' : 'false';
            }
            if ($6 === 'attempted') {
                $4 = ($9.activityProgressStatus && $9.attemptCount > 0) ? 'true' : 'false';
                if (!$9.activityProgressStatus) {
                    $4 = 'unknown';
                }
            }
            if ($6 === 'attemptLimitExceeded') {
                $4 = ($9.activityProgressStatus && $p1.getSequencing().limitConditions_attemptControl && $9.attemptCount >= parseInt($p1.getSequencing().limitConditions_attemptLimit)) ? 'true' : 'false';
                if (!$9.activityProgressStatus) {
                    $4 = 'unknown';
                }
            }
            if ($6 === 'timeLimitExceeded') {
                $4 = 'false';
            }
            if ($6 === 'outsideAvailableTimeRange') {
                $4 = 'false';
            }
            if ($6 === 'always') {
                $4 = 'true';
            }
            if ($7) {
                if ($4 !== 'unknown') {
                    $4 = (!($4 === 'true')) ? 'true' : 'false';
                }
            }
            $0.add($4);
        }
        if ($0.length === 0) {
            return 'unknown';
        }
        var $2 = true;
        if ($1 === 'all') {
            var $enum3 = $0.getEnumerator();
            while ($enum3.moveNext()) {
                var $B = $enum3.get_current();
                if ($B === 'unknown') {
                    return 'unknown';
                } else if ($B === 'false') {
                    $2 = false;
                }
            }
        } else {
            $2 = false;
            var $C = 0;
            var $enum4 = $0.getEnumerator();
            while ($enum4.moveNext()) {
                var $D = $enum4.get_current();
                if ($D === 'true') {
                    $2 = true;
                    break;
                } else if ($D === 'unknown') {
                    $C++;
                }
            }
            if ($C === $0.length) {
                return 'unknown';
            }
        }
        return ($2) ? 'true' : 'false';
    },
    $59: function ($p0) {
        if (this.get_$2B().get_isSuspended()) {
            return;
        }
        var $0 = this.$57(this.get_$2B().getSequencing().postConditionRules, this.get_$2B());
        if ($0 != null) {
            if ($0 === 'retry' || $0 === 'continue' || $0 === 'previous') {
                this.set_$2F(0);
                if ($0 === 'retry') {
                    this.set_$31(10);
                } else if ($0 === 'continue') {
                    this.set_$31(5);
                } else if ($0 === 'previous') {
                    this.set_$31(6);
                }
                return;
            }
            if ($0 === 'exitParent' || $0 === 'exitAll') {
                if ($0 === 'exitParent') {
                    this.set_$2F(8);
                } else if ($0 === 'exitAll') {
                    this.set_$2F(4);
                    this.set_$31(0);
                }
                return;
            }
            if ($0 === 'retryAll') {
                this.set_$2F(4);
                this.set_$31(10);
                return;
            }
        }
        this.set_$2F(0);
    },
    $5A: function ($p0) {
        var $0 = this.findCommonParent(this.get_$2B(), this.get_$3B());
        var $1 = $p0.getPath($0, false, false, false);
        if ($1.length > 0) {
            var $enum1 = $1.getEnumerator();
            while ($enum1.moveNext()) {
                var $2 = $enum1.get_current();
                this.$55($2);
            }
        }
    },
    $5B: function ($p0) {
        var $0 = $p0.getPath(this.getOrganization(), true, true, false);
        if ($0.length === 0) {
            return;
        }
        var $enum1 = $0.getEnumerator();
        while ($enum1.moveNext()) {
            var $1 = $enum1.get_current();
            if ($1.getChildrensCount() > 0) {
                if (!$1.getSequencing().status.objectiveMeasureStatusFromGlobal) {
                    this.$5C($1);
                }
                if (!$1.getSequencing().status.attemptCompletionAmountFromGlobal) {
                    this.$5D($1);
                }
            }
            this.$5E($1);
            this.$64($1);
        }
    },
    $5C: function ($p0) {
        var $0 = 0;
        var $1 = false;
        var $2 = 0;
        var $3 = null;
        var $4 = $p0.getSequencing().getObjectives();
        var $enum1 = $4.getEnumerator();
        while ($enum1.moveNext()) {
            var $5 = $enum1.get_current();
            if ($5.contributeToRollup) {
                $3 = $5;
                break;
            }
        }
        if ($3 != null) {
            var $enum2 = $p0.getChildrens().getEnumerator();
            while ($enum2.moveNext()) {
                var $6 = $enum2.get_current();
                if ($6.getSequencing().tracked) {
                    var $7 = null;
                    var $8 = $6.getSequencing().getObjectives();
                    var $enum3 = $8.getEnumerator();
                    while ($enum3.moveNext()) {
                        var $9 = $enum3.get_current();
                        if ($9.contributeToRollup) {
                            $7 = $9;
                            break;
                        }
                    }
                    if ($7 != null) {
                        $2 += $6.getSequencing().rollupObjectiveMeasureWeight;
                        if ($7.status.get_objectiveMeasureStatus()) {
                            $0 += $7.status.get_objectiveNormalizedMeasure() * $6.getSequencing().rollupObjectiveMeasureWeight;
                            $1 = true;
                        }
                    } else {
                        return;
                    }
                }
            }
            if (!$1) {
                $3.status.set_objectiveMeasureStatus(false);
            } else {
                if ($2 > 0) {
                    $3.status.set_objectiveMeasureStatus(true);
                    $3.status.set_objectiveNormalizedMeasure($0 / $2);
                } else {
                    $3.status.set_objectiveMeasureStatus(false);
                }
            }
        }
    },
    $5D: function ($p0) {
        var $0 = 0;
        var $1 = false;
        var $2 = 0;
        var $enum1 = $p0.getChildrens().getEnumerator();
        while ($enum1.moveNext()) {
            var $3 = $enum1.get_current();
            if ($3.getSequencing().tracked) {
                $2 += $3.getProgressweight();
                if ($3.getSequencing().status.attemptCompletionAmountStatus) {
                    $0 += $3.getSequencing().status.get_attemptCompletionAmount() * $3.getProgressweight();
                    $1 = true;
                }
            }
        }
        if (!$1) {
            $p0.getSequencing().status.attemptCompletionAmountStatus = false;
        } else {
            if ($2 > 0) {
                $p0.getSequencing().status.attemptCompletionAmountStatus = true;
                $p0.getSequencing().status.set_attemptCompletionAmount($0 / $2);
            } else {
                $p0.getSequencing().status.attemptCompletionAmountStatus = false;
            }
        }
    },
    $5E: function ($p0) {
        this.$5F($p0);
        if (!$p0.getSequencing().getPrimaryObjective().satisfiedByMeasure && !$p0.getSequencing().status.objectiveSatisfiedStatusFromGlobal && !$p0.getSequencing().objectiveSetByContent) {
            this.$60($p0);
        }
    },
    $5F: function ($p0) {
        var $0 = null;
        var $1 = $p0.getSequencing().getObjectives();
        var $enum1 = $1.getEnumerator();
        while ($enum1.moveNext()) {
            var $2 = $enum1.get_current();
            if ($2.contributeToRollup) {
                $0 = $2;
                break;
            }
        }
        if ($0 != null) {
            if ($0.satisfiedByMeasure) {
                if (!$0.status.get_objectiveMeasureStatus()) {
                    $0.status.set_objectiveProgressStatus(false);
                } else {
                    if (!$p0.get_isActive() || ($p0.get_isActive() && $p0.getSequencing().rollupConsiderations_measureSatisfactionIfActive)) {
                        if ($0.status.get_objectiveNormalizedMeasure() >= $0.minNormalizedMeasure) {
                            $0.status.set_objectiveProgressStatus(true);
                            $0.status.set_objectiveSatisfiedStatus(true);
                        } else {
                            $0.status.set_objectiveProgressStatus(true);
                            $0.status.set_objectiveSatisfiedStatus(false);
                        }
                    } else {
                        $0.status.set_objectiveProgressStatus(false);
                    }
                }
            }
        }
    },
    $60: function ($p0) {
        if ($p0.getSequencing().getConditionRollupRulesForAction('notSatisfied').length === 0 && $p0.getSequencing().getConditionRollupRulesForAction('satisfied').length === 0) {
            var $2 = {};
            $2['childActivitySet'] = 'all';
            $2['minimumCount'] = '0';
            $2['minimumPercent'] = '0.0000';
            $2['action'] = 'satisfied';
            $2['conditionCombination'] = 'any';
            $2['rule_0'] = {
                condition: 'satisfied',
                operator: 'noOp'
            };
            if ($p0.getSequencing().rollupRules == null) {
                $p0.getSequencing().rollupRules = [];
            }
            $p0.getSequencing().rollupRules.add($2);
            $2 = {};
            $2['childActivitySet'] = 'all';
            $2['minimumCount'] = '0';
            $2['minimumPercent'] = '0.0000';
            $2['action'] = 'notSatisfied';
            $2['conditionCombination'] = 'any';
            $2['rule_0'] = {
                condition: 'objectiveStatusKnown',
                operator: 'noOp'
            };
            $p0.getSequencing().rollupRules.add($2);
        }
        var $0 = null;
        var $1 = $p0.getSequencing().getObjectives();
        var $enum1 = $1.getEnumerator();
        while ($enum1.moveNext()) {
            var $3 = $enum1.get_current();
            if ($3.contributeToRollup) {
                $0 = $3;
                break;
            }
        }
        if ($0 != null) {
            var $4 = this.$61($p0, 'notSatisfied');
            if ($4) {
                $0.status.set_objectiveProgressStatus(true);
                $0.status.set_objectiveSatisfiedStatus(false);
            }
            $4 = this.$61($p0, 'satisfied');
            if ($4) {
                $0.status.set_objectiveProgressStatus(true);
                $0.status.set_objectiveSatisfiedStatus(true);
            }
        }
    },
    $61: function ($p0, $p1) {
        var $0 = $p0.getSequencing().getConditionRollupRulesForAction($p1);
        if ($0.length > 0) {
            var $enum1 = $0.getEnumerator();
            while ($enum1.moveNext()) {
                var $1 = $enum1.get_current();
                var $2 = [];
                var $enum2 = $p0.getChildrens().getEnumerator();
                while ($enum2.moveNext()) {
                    var $4 = $enum2.get_current();
                    if ($4.getSequencing().tracked) {
                        if (this.$62($4, $p1)) {
                            var $5 = this.$63($4, $1);
                            if ($5 === 'unknown') {
                                $2.add('unknown');
                            } else {
                                if ($5 === 'true') {
                                    $2.add('true');
                                } else {
                                    $2.add('false');
                                }
                            }
                        }
                    }
                }
                var $3 = false;
                if ($2.length === 0) {
                    break;
                } else if ($1['childActivitySet'] === 'all') {
                    var $6 = false;
                    var $7 = false;
                    var $enum3 = $2.getEnumerator();
                    while ($enum3.moveNext()) {
                        var $8 = $enum3.get_current();
                        if ($8 === 'unknown') {
                            $6 = true;
                        }
                        if ($8 === 'false') {
                            $7 = true;
                        }
                    }
                    if (!$6 && !$7) {
                        $3 = true;
                    }
                } else if ($1['childActivitySet'] === 'any') {
                    var $9 = false;
                    var $enum4 = $2.getEnumerator();
                    while ($enum4.moveNext()) {
                        var $A = $enum4.get_current();
                        if ($A === 'true') {
                            $9 = true;
                            break;
                        }
                    }
                    if ($9) {
                        $3 = true;
                    }
                } else if ($1['childActivitySet'] === 'none') {
                    var $B = false;
                    var $C = false;
                    var $enum5 = $2.getEnumerator();
                    while ($enum5.moveNext()) {
                        var $D = $enum5.get_current();
                        if ($D === 'unknown') {
                            $B = true;
                        }
                        if ($D === 'true') {
                            $C = true;
                        }
                    }
                    if (!$B && !$C) {
                        $3 = true;
                    }
                } else if ($1['childActivitySet'] === 'atLeastCount') {
                    var $E = 0;
                    var $enum6 = $2.getEnumerator();
                    while ($enum6.moveNext()) {
                        var $F = $enum6.get_current();
                        if ($F === 'true') {
                            $E++;
                        }
                    }
                    if ($E >= parseInt($1['minimumCount'])) {
                        $3 = true;
                    }
                } else if ($1['childActivitySet'] === 'atLeastPercent') {
                    var $10 = 0;
                    var $enum7 = $2.getEnumerator();
                    while ($enum7.moveNext()) {
                        var $11 = $enum7.get_current();
                        if ($11 === 'true') {
                            $10++;
                        }
                    }
                    if ($10 / $2.length > parseFloat($1['minimumPercent'])) {
                        $3 = true;
                    }
                }
                if ($3) {
                    return true;
                }
            }
        }
        return false;
    },
    $62: function ($p0, $p1) {
        var $0 = $p0.getSequencing().status;
        var $1 = false;
        if ($p1 === 'satisfied' || $p1 === 'notSatisfied') {
            if ($p0.getSequencing().rollupObjectiveSatisfied) {
                $1 = true;
                if (($p1 === 'satisfied' && $p0.getSequencing().rollupConsiderations_requiredForSatisfied === 'ifNotSuspended') || ($p1 === 'notSatisfied' && $p0.getSequencing().rollupConsiderations_requiredForNotSatisfied === 'ifNotSuspended')) {
                    if (!$0.activityProgressStatus || ($0.attemptCount > 0 && $p0.get_isSuspended())) {
                        $1 = false;
                    }
                } else {
                    if (($p1 === 'satisfied' && $p0.getSequencing().rollupConsiderations_requiredForSatisfied === 'ifAttempted') || ($p1 === 'notSatisfied' && $p0.getSequencing().rollupConsiderations_requiredForNotSatisfied === 'ifAttempted')) {
                        if (!$0.activityProgressStatus || $0.attemptCount === 0) {
                            $1 = false;
                        }
                    } else {
                        if (($p1 === 'satisfied' && $p0.getSequencing().rollupConsiderations_requiredForSatisfied === 'ifNotSkipped') || ($p1 === 'notSatisfied' && $p0.getSequencing().rollupConsiderations_requiredForNotSatisfied === 'ifNotSkipped')) {
                            if (this.$57($p0.getSequencing().getConditionRulesForAction('skip'), $p0) != null) {
                                $1 = false;
                            }
                        }
                    }
                }
            }
        }
        if ($p1 === 'completed' || $p1 === 'incomplete') {
            if ($p0.getSequencing().rollupProgressCompletion) {
                $1 = true;
                if (($p1 === 'completed' && $p0.getSequencing().rollupConsiderations_requiredForCompleted === 'ifNotSuspended') || ($p1 === 'incomplete' && $p0.getSequencing().rollupConsiderations_requiredForIncomplete === 'ifNotSuspended')) {
                    if (!$0.activityProgressStatus || ($0.attemptCount > 0 && $p0.get_isSuspended())) {
                        $1 = false;
                    }
                } else {
                    if (($p1 === 'completed' && $p0.getSequencing().rollupConsiderations_requiredForCompleted === 'ifAttempted') || ($p1 === 'incomplete' && $p0.getSequencing().rollupConsiderations_requiredForIncomplete === 'ifAttempted')) {
                        if (!$0.activityProgressStatus || $0.attemptCount === 0) {
                            $1 = false;
                        }
                    } else {
                        if (($p1 === 'completed' && $p0.getSequencing().rollupConsiderations_requiredForCompleted === 'ifNotSkipped') || ($p1 === 'incomplete' && $p0.getSequencing().rollupConsiderations_requiredForIncomplete === 'ifNotSkipped')) {
                            if (this.$57($p0.getSequencing().getConditionRulesForAction('skip'), $p0) != null) {
                                $1 = false;
                            }
                        }
                    }
                }
            }
        }
        return $1;
    },
    $63: function ($p0, $p1) {
        if (!$p0.getSequencing().tracked) {
            return 'unknown';
        }
        var $0 = [];
        var $1 = $p1['conditionCombination'];
        var $dict1 = $p1;
        for (var $key2 in $dict1) {
            var $3 = {
                key: $key2,
                value: $dict1[$key2]
            };
            if (!$3.key.startsWith('rule_')) {
                continue;
            }
            var $4 = 'false';
            var $5 = $p0.getSequencing().status;
            var $6 = ($3.value)['condition'];
            var $7 = ($3.value)['operator'] === 'not';
            if ($6 === 'satisfied') {
                $4 = ($5.get_objectiveProgressStatus() && $5.get_objectiveSatisfiedStatus()) ? 'true' : 'false';
                if (!$5.get_objectiveProgressStatus()) {
                    $4 = 'unknown';
                }
            }
            if ($6 === 'objectiveStatusKnown') {
                $4 = ($5.get_objectiveProgressStatus()) ? 'true' : 'false';
            }
            if ($6 === 'objectiveMeasureKnown') {
                $4 = ($5.get_objectiveMeasureStatus()) ? 'true' : 'false';
            }
            if ($6 === 'completed') {
                $4 = ($5.get_attemptProgressStatus() && $5.get_attemptCompletionStatus()) ? 'true' : 'false';
                if (!$5.get_attemptProgressStatus()) {
                    $4 = 'unknown';
                }
            }
            if ($6 === 'activityProgressKnown') {
                $4 = ($5.activityProgressStatus && $5.get_attemptProgressStatus()) ? 'true' : 'false';
                if (!$5.activityProgressStatus) {
                    $4 = 'unknown';
                }
            }
            if ($6 === 'attempted') {
                $4 = ($5.activityProgressStatus && $5.attemptCount > 0) ? 'true' : 'false';
                if (!$5.activityProgressStatus) {
                    $4 = 'unknown';
                }
            }
            if ($6 === 'attemptLimitExceeded') {
                $4 = ($5.activityProgressStatus && $p0.getSequencing().limitConditions_attemptControl && $5.attemptCount >= parseInt($p0.getSequencing().limitConditions_attemptLimit)) ? 'true' : 'false';
                if (!$5.activityProgressStatus) {
                    $4 = 'unknown';
                }
            }
            if ($6 === 'timeLimitExceeded') {
                $4 = 'false';
            }
            if ($6 === 'outsideAvailableTimeRange') {
                $4 = 'false';
            }
            if ($6 === 'never') {
                $4 = 'false';
            }
            if ($7) {
                if ($4 !== 'unknown') {
                    $4 = (!($4 === 'true')) ? 'true' : 'false';
                }
            }
            $0.add($4);
        }
        if ($0.length === 0) {
            return 'unknown';
        }
        var $2 = true;
        if ($1 === 'all') {
            var $enum3 = $0.getEnumerator();
            while ($enum3.moveNext()) {
                var $8 = $enum3.get_current();
                if ($8 === 'unknown') {
                    return 'unknown';
                } else if ($8 === 'false') {
                    $2 = false;
                }
            }
        } else {
            $2 = false;
            var $9 = 0;
            var $enum4 = $0.getEnumerator();
            while ($enum4.moveNext()) {
                var $A = $enum4.get_current();
                if ($A === 'true') {
                    $2 = true;
                    break;
                } else if ($A === 'unknown') {
                    $9++;
                }
            }
            if ($9 === $0.length) {
                return 'unknown';
            }
        }
        return ($2) ? 'true' : 'false';
    },
    $64: function ($p0) {
        if ($p0.isCompletedbymeasure()) {
            this.$65($p0);
        } else if (!$p0.getSequencing().completionSetByContent && !$p0.getSequencing().status.attemptCompletionStatusFromGlobal) {
            this.$66($p0);
        }
    },
    $65: function ($p0) {
        $p0.getSequencing().status.set_attemptProgressStatus(false);
        $p0.getSequencing().status.set_attemptCompletionStatus(false);
        if ($p0.isCompletedbymeasure()) {
            if (!$p0.getSequencing().status.attemptCompletionAmountStatus) {
                $p0.getSequencing().status.set_attemptCompletionStatus(false);
            } else {
                if ($p0.getSequencing().status.get_attemptCompletionAmount() >= $p0.getMinprogressmeasure()) {
                    $p0.getSequencing().status.set_attemptProgressStatus(true);
                    $p0.getSequencing().status.set_attemptCompletionStatus(true);
                } else {
                    $p0.getSequencing().status.set_attemptProgressStatus(true);
                    $p0.getSequencing().status.set_attemptCompletionStatus(false);
                }
            }
        } else {
            $p0.getSequencing().status.set_attemptProgressStatus(false);
        }
    },
    $66: function ($p0) {
        if ($p0.getSequencing().getConditionRollupRulesForAction('incomplete').length === 0 && $p0.getSequencing().getConditionRollupRulesForAction('completed').length === 0) {
            var $1 = {};
            $1['childActivitySet'] = 'all';
            $1['minimumCount'] = '0';
            $1['minimumPercent'] = '0.0000';
            $1['action'] = 'completed';
            $1['conditionCombination'] = 'any';
            $1['rule_0'] = {
                condition: 'completed',
                operator: 'noOp'
            };
            if ($p0.getSequencing().rollupRules == null) {
                $p0.getSequencing().rollupRules = [];
            }
            $p0.getSequencing().rollupRules.add($1);
            $1 = {};
            $1['childActivitySet'] = 'all';
            $1['minimumCount'] = '0';
            $1['minimumPercent'] = '0.0000';
            $1['action'] = 'incomplete';
            $1['conditionCombination'] = 'any';
            $1['rule_0'] = {
                condition: 'activityProgressKnown',
                operator: 'noOp'
            };
            $p0.getSequencing().rollupRules.add($1);
        }
        var $0 = this.$61($p0, 'incomplete');
        if ($0) {
            $p0.getSequencing().status.set_attemptProgressStatus(true);
            $p0.getSequencing().status.set_attemptCompletionStatus(false);
        }
        $0 = this.$61($p0, 'completed');
        if ($0) {
            $p0.getSequencing().status.set_attemptProgressStatus(true);
            $p0.getSequencing().status.set_attemptCompletionStatus(true);
        };
    },
    $67: function () {
        if (!this.get_$2D().isLeaf()) {
            this.set_$45('DB.1.1-1');
            SCORM.LOG.displayMessage('[DB.1.1] Delivery Request Process', this.get_$45(), this.$46(this.get_$45()));
            return false;
        }
        var $0 = this.get_$2D().getPath(this.getOrganization(), true, true, true);
        if ($0.length === 0) {
            this.set_$45('DB.1.1-2');
            SCORM.LOG.displayMessage('[DB.1.1] Delivery Request Process', this.get_$45(), this.$46(this.get_$45()));
            return false;
        }
        var $enum1 = $0.getEnumerator();
        while ($enum1.moveNext()) {
            var $1 = $enum1.get_current();
            var $2 = this.$6E($1);
            if ($2) {
                this.set_$45('DB.1.1-3');
                SCORM.LOG.displayMessage('[DB.1.1] Delivery Request Process', this.get_$45(), this.$46(this.get_$45()));
                return false;
            }
        }
        this.set_$45(null);
        return true;
    },
    $68: function () {
        if (this.get_$2B() != null && this.get_$2B().get_isActive()) {
            this.set_$45('DB.2-1');
            SCORM.LOG.displayMessage('[DB.2] Content Delivery Environment Process', this.get_$45(), this.$46(this.get_$45()));
            return;
        }
        if (this.get_$2B() != null) {
            this.$5A(this.get_$2B());
        }
        if (this.get_$2D() !== this.get_$3D()) {
            this.$69(this.get_$2D());
        }
        this.$5A(this.get_$2D());
        var $0 = this.get_$2D().getPath(this.getOrganization(), true, true, true);
        var $enum1 = $0.getEnumerator();
        while ($enum1.moveNext()) {
            var $1 = $enum1.get_current();
            if (!$1.get_isActive()) {
                if ($1.getSequencing().tracked) {
                    if ($1.get_isSuspended()) {
                        $1.set_isSuspended(false);
                    } else {
                        $1.getSequencing().status.attemptCount++;
                        if ($1.getSequencing().status.attemptCount === 1) {
                            $1.getSequencing().status.activityProgressStatus = true;
                        }
                    }
                }
                $1.set_isActive(true);
            }
        }
        this.set_$2B(this.get_$2D());
        this.set_$3D(null);
        if (!this.get_$2D().getSequencing().tracked) {
            this.get_$2D().getSequencing().status.set_attemptProgressStatus(false);
            this.get_$2D().getSequencing().status.set_objectiveProgressStatus(false);
        }
        this.set_$45(null);
        if (!this.$24) {
            this.$22 = this.getClonedGlobalObjectives();
            this.$23 = this.$77();
            this.onEventSCO(new SCORM.BaseActivityTreeNodeEventArgs(this.get_$2D(), 2));
        }
    },
    $69: function ($p0) {
        if (this.get_$3D() != null) {
            var $0 = this.findCommonParent(this.get_$3B(), this.get_$3D());
            var $1 = this.get_$3D().getPath($0, true, true, false);
            if ($1.length !== 0) {
                var $enum1 = $1.getEnumerator();
                while ($enum1.moveNext()) {
                    var $2 = $enum1.get_current();
                    if ($2.isLeaf()) {
                        $2.set_isSuspended(false);
                    } else {
                        if (!$2.hasSuspendedChildren()) {
                            $2.set_isSuspended(false);
                        }
                    }
                }
            }
            this.set_$3D(null);
        }
    },
    $6A: function () {
        if (this.get_$2B() != null) {
            this.set_$2D(null);
            this.set_$45('SB.2.5-1');
            SCORM.LOG.displayMessage('[SB.2.5] Start Sequencing Request Process', this.get_$45(), this.$46(this.get_$45()));
        }
        if (this.getOrganization().isLeaf()) {
            this.set_$2D(this.getOrganization());
            this.set_$45(null);
        } else if (this.isSingleItem()) {
            this.set_$2D(this.getOrganization().getChildrens()[0]);
            this.set_$45(null);
        } else {
            var $0 = this.$6B(this.getOrganization(), 1, true);
            if (!$0) {
                this.set_$2D(null);
            } else {
                this.set_$2D(this.get_$35());
                this.set_$45(null);
            }
        }
    },
    $6B: function ($p0, $p1, $p2) {
        var $0 = $p0;
        this.$6C($p0, $p1, 0, $p2);
        if (this.get_$35() == null) {
            this.set_$3B($0);
            this.set_$41(false);
        } else {
            $0 = this.get_$35();
            this.$6D($0, $p1, 0);
        }
        return this.get_$35() != null;
    },
    $6C: function ($p0, $p1, $p2, $p3) {
        var $0 = false;
        if ($p2 === 2 && $p0.isLastChildrenForParent()) {
            $p1 = 2;
            $p0 = $p0.getParent().getChildrens()[0];
            $0 = true;
        }
        if ($p1 === 1) {
            if ($p0.isLastActivityInTree() || ($p0.isOrganization() && !$p3)) {
                this.$5A(this.getOrganization());
                this.set_$35(null);
                this.set_$3F(1);
                this.set_$45(null);
                return;
            }
            if ($p0.isLeaf() || !$p3) {
                if ($p0.isLastChildrenForParent()) {
                    this.$6C($p0.getParent(), 1, 0, false);
                    return;
                } else {
                    var $1 = $p0.getNextSibling();
                    this.set_$35($1);
                    this.set_$33($p1);
                    this.set_$45(null);
                    return;
                }
            } else {
                if ($p0.getChildrensCount() > 0) {
                    this.set_$35($p0.getChildrens()[0]);
                    this.set_$33($p1);
                    this.set_$45(null);
                    return;
                } else {
                    this.set_$35(null);
                    this.set_$33(0);
                    this.set_$45('SB.2.1-2');
                    SCORM.LOG.displayMessage('[SB.2.1] Flow Tree Traversal Subprocess', this.get_$45(), this.$46(this.get_$45()));
                    return;
                }
            }
        }
        if ($p1 === 2) {
            if ($p0.isOrganization()) {
                this.set_$35(null);
                this.set_$33(0);
                this.set_$45('SB.2.1-3');
                SCORM.LOG.displayMessage('[SB.2.1] Flow Tree Traversal Subprocess', this.get_$45(), this.$46(this.get_$45()));
                return;
            }
            if ($p0.isLeaf() || !$p3) {
                if (!$0) {
                    if ($p0.getParentSequencing().forwardOnly) {
                        this.set_$35(null);
                        this.set_$33(0);
                        this.set_$45('SB.2.1-4');
                        SCORM.LOG.displayMessage('[SB.2.1] Flow Tree Traversal Subprocess', this.get_$45(), this.$46(this.get_$45()));
                        return;
                    }
                }
                if ($p0.isFirstChildrenForParent()) {
                    this.$6C($p0.getParent(), 2, 0, false);
                    return;
                } else {
                    var $2 = $p0.getPreviousSibling();
                    this.set_$35($2);
                    this.set_$33($p1);
                    this.set_$45(null);
                    return;
                }
            } else {
                if ($p0.getChildrensCount() > 0) {
                    if ($p0.getSequencing().forwardOnly) {
                        this.set_$35($p0.getFirstChildren());
                        this.set_$33(1);
                        this.set_$45(null);
                        return;
                    } else {
                        this.set_$35($p0.getLastChildren());
                        this.set_$33(2);
                        this.set_$45(null);
                        return;
                    }
                } else {
                    this.set_$35(null);
                    this.set_$33(0);
                    this.set_$45('SB.2.1-2');
                    SCORM.LOG.displayMessage('[SB.2.1] Flow Tree Traversal Subprocess', this.get_$45(), this.$46(this.get_$45()));
                    return;
                }
            }
        }
    },
    $6D: function ($p0, $p1, $p2) {
        if (!$p0.getParentSequencing().flow) {
            this.set_$41(false);
            this.set_$35(null);
            this.set_$45('SB.2.2-1');
            SCORM.LOG.displayMessage('[SB.2.2] Flow Activity Traversal Subprocess', this.get_$45(), this.$46(this.get_$45()));
            return;
        }
        var $0 = this.$57($p0.getSequencing().getConditionRulesForAction('skip'), $p0);
        if ($0 != null) {
            this.$6C($p0, $p1, $p2, false);
            if (this.get_$35() == null) {
                this.set_$41(false);
                this.set_$35($p0);
                return;
            } else {
                if ($p2 === 2 && this.get_$33() === 2) {
                    this.$6D(this.get_$35(), this.get_$33(), 0);
                } else {
                    this.$6D(this.get_$35(), $p1, $p2);
                }
                return;
            }
        }
        var $1 = this.$6E($p0);
        if ($1) {
            this.set_$41(false);
            this.set_$35(null);
            this.set_$45('SB.2.2-2');
            SCORM.LOG.displayMessage('[SB.2.2] Flow Activity Traversal Subprocess', this.get_$45(), this.$46(this.get_$45()));
            return;
        }
        if (!$p0.isLeaf()) {
            this.$6C($p0, $p1, 0, true);
            if (this.get_$35() == null) {
                this.set_$41(false);
                this.set_$35($p0);
                return;
            } else {
                if ($p1 === 2 && this.get_$33() === 1) {
                    this.$6D(this.get_$35(), 1, 2);
                } else {
                    this.$6D(this.get_$35(), $p1, 0);
                }
                return;
            }
        }
    },
    $6E: function ($p0) {
        var $0 = this.$57($p0.getSequencing().getConditionRulesForAction('disabled'), $p0);
        if ($0 != null) {
            return true;
        }
        return this.$6F($p0);
    },
    $6F: function ($p0) {
        var $0 = false;
        if (!$p0.getSequencing().tracked) {
            $0 = false;
            return $0;
        }
        if ($p0.get_isActive() || $p0.get_isSuspended()) {
            $0 = false;
            return $0;
        }
        if ($p0.getSequencing().limitConditions_attemptControl) {
            if ($p0.getSequencing().status.activityProgressStatus && $p0.getSequencing().status.attemptCount >= parseInt($p0.getSequencing().limitConditions_attemptLimit)) {
                $0 = true;
                return $0;
            }
        }
        if ($p0.getSequencing().limitConditions_activityAbsoluteDurationControl) {
            if ($p0.getSequencing().status.get_attemptProgressStatus() && false) {
                $0 = true;
                return $0;
            }
        }
        if ($p0.getSequencing().limitCondition_activityExperiencedDurationControl) {
            if ($p0.getSequencing().status.get_attemptProgressStatus() && false) {
                $0 = true;
                return $0;
            }
        }
        return $0;
    },
    findCommonParent: function (currentNode, targetNode) {
        if (currentNode == null || currentNode === this.getOrganization() || targetNode == null || targetNode === this.getOrganization()) {
            return this.getOrganization();
        }
        var $0 = currentNode;
        while ($0 !== this.getOrganization()) {
            var $1 = targetNode;
            while ($1 !== this.getOrganization()) {
                if ($0 === $1) {
                    return $0;
                }
                $1 = $1.getParent();
            }
            $0 = $0.getParent();
        }
        return this.getOrganization();
    },
    getOrganization: function () {
        var $0 = this.getChildrens();
        if ($0.length <= 0) {
            return null;
        }
        var $1 = $0[0];
        if (this._selectedOrgId != null) {
            var $enum1 = $0.getEnumerator();
            while ($enum1.moveNext()) {
                var $2 = $enum1.get_current();
                if ($2.getIdentifier() === this._selectedOrgId) {
                    $1 = $2;
                    break;
                }
            }
        }
        return $1;
    },
    scan: function (node, scanCallback, scanSkipCallback) {
        if (scanSkipCallback != null && scanSkipCallback.invoke(node)) {
            return true;
        }
        if (!scanCallback.invoke(node)) {
            return false;
        }
        var $enum1 = node.getChildrens().getEnumerator();
        while ($enum1.moveNext()) {
            var $0 = $enum1.get_current();
            if (!this.scan($0, scanCallback, scanSkipCallback)) {
                return false;
            }
        }
        return true;
    },
    findNode: function (identifier) {
        var $0 = null;
        this.scan(this, Delegate.create(this, function ($p1_0) {
            if ($p1_0.getIdentifier() === identifier) {
                $0 = $p1_0;
                return false;
            }
            return true;
        }), null);
        return $0;
    },
    getActivityTreeNodes: function () {
        var $0 = {};
        this.scan(this, Delegate.create(this, function ($p1_0) {
            if ($p1_0 !== this) {
                $0[$p1_0.getIdentifier()] = $p1_0;
            }
            return true;
        }), null);
        return $0;
    },
    isSingleItem: function () {
        return this.$1A;
    },
    getLastActivityInTree: function () {
        return this.$1C;
    },
    getActiveNode: function () {
        return this.$19;
    },
    setActiveNode: function (activeNode) {
        this.$19 = activeNode;
    },
    getActiveAPI: function () {
        return this.$18;
    },
    setActiveAPI: function (activeAPI) {
        this.$18 = activeAPI;
        API_1484_11.setAPI_1484_11_LIB(this.$18);
        if (activeAPI != null) {
            this.$19 = this.$18.getActivityTreeNode();
        } else {
            this.$19 = null;
        }
    },
    isSharedDataGlobalToSystem: function () {
        return this.$1E;
    },
    isObjectivesGlobalToSystem: function () {
        return this.$1F;
    },
    getGlobalObjectives: function () {
        return this._globalObjectives;
    },
    getStoredStatuses: function () {
        return this.$21;
    },
    getRollupSet: function () {
        return this._rollupSet;
    },
    $70: function () {
        var $0 = this.getRollupSet();
        $0.sort(Delegate.create(this, function ($p1_0, $p1_1) {
            var $1_0 = $p1_0;
            var $1_1 = $p1_1;
            if ($1_0.getLevel() > $1_1.getLevel()) {
                return -1;
            } else if ($1_0.getLevel() < $1_1.getLevel()) {
                return 1;
            } else {
                return 0;
            }
        }));
    },
    $71: function () {
        var $0 = this.getRollupSet();
        if ($0.length === 0) {
            return;
        }
        this.$70();
        var $1 = this.isGlobalObjectivesUpdateAvailable;
        this.isGlobalObjectivesUpdateAvailable = false;
        try {
            while ($0.length > 0) {
                var $2 = ($0[0]);
                this.$5B($2);
                $0.removeAt(0);
            }
        } finally {
            this.isGlobalObjectivesUpdateAvailable = $1;
        }
    },
    initByManifest: function (manifestPath, imsmanifest) {
        if (isNullOrUndefined(imsmanifest)) {
            return;
        }
        var $0 = SCORM.BaseUtils.getChildNodeByName(imsmanifest, 'manifest');
        if ($0 == null) {
            return;
        }
        var $1 = SCORM.BaseUtils.getChildNodeByName($0, 'organizations');
        if ($1 == null) {
            return;
        }
        var $2 = SCORM.BaseUtils.getXMLNodeAttribut($0, 'base');
        if ($2 != null && !$2.endsWith('/')) {
            $2 += '/';
        }
        if (!isNullOrUndefined(manifestPath) && manifestPath.length > 0) {
            if (!manifestPath.endsWith('/')) {
                manifestPath += '/';
            }
            $2 = manifestPath + ((!isNullOrUndefined($2)) ? $2 : '');
        }
        var $3 = SCORM.BaseUtils.getChildSiblingsByName($1, 'organization');
        if ($3 == null || $3.length <= 0) {
            return;
        }
        var $4 = SCORM.BaseUtils.getChildNodeByName($0, 'resources');
        var $5 = null;
        var $6 = '';
        if ($4 != null) {
            var $A = SCORM.BaseUtils.getXMLNodeAttribut($4, 'base');
            if ($A != null && !$A.endsWith('/')) {
                $A += '/';
            }
            if (!isNullOrUndefined($2)) {
                $6 = $2;
            }
            if (!isNullOrUndefined($A)) {
                if (!$A.startsWith('/')) {
                    $6 += $A;
                } else {
                    $6 = SCORM.BaseUtils.getBaseOfUrl($6) + $A;
                }
            }
            $5 = SCORM.BaseUtils.getChildSiblingsByName($4, 'resource');
        }
        var $7 = SCORM.BaseUtils.getChildNodeByName($0, 'sequencingCollection');
        var $8 = false;
        if (!isNullOrUndefined(this._selectedOrgId) && this._selectedOrgId.length > 0) {
            var $enum1 = $3.getEnumerator();
            while ($enum1.moveNext()) {
                var $B = $enum1.get_current();
                var $C = SCORM.BaseUtils.getXMLNodeAttribut($B, 'identifier');
                if ($C === this._selectedOrgId) {
                    $8 = true;
                    this.$73(this, $B, $5, $7, $6, true);
                    break;
                }
            }
        }
        if (!$8) {
            this.$73(this, $3[0], $5, $7, $6, true);
        }
        var $dict2 = this.getActivityTreeNodes();
        for (var $key3 in $dict2) {
            var $D = {
                key: $key3,
                value: $dict2[$key3]
            };
            var $E = $D.value;
            if ($E.isLeaf()) {
                continue;
            }
            if ($E.getSequencing().randomizationTiming !== 'never' || $E.getSequencing().selectionTiming !== 'never') {
                this.$72($E);
            }
        }
        if (this.$25 && (this.isObjectivesGlobalToSystem() || this.$1D != null)) {
            var $F = this.getRollupSet();
            var $dict4 = this.getGlobalObjectives();
            for (var $key5 in $dict4) {
                var $10 = {
                    key: $key5,
                    value: $dict4[$key5]
                };
                var $11 = $10.value;
                if (isNullOrUndefined($11)) {
                    continue;
                }
                var $12 = $10.key;
                var $13 = $11.objectives;
                if ($13 == null) {
                    continue;
                }
                var $enum6 = $13.getEnumerator();
                while ($enum6.moveNext()) {
                    var $14 = $enum6.get_current();
                    var $15 = $14.mapInfos[$12];
                    if (isNullOrUndefined($15) || !$14.getSequencing().tracked) {
                        continue;
                    }
                    var $16 = this.isGlobalObjectivesUpdateAvailable;
                    this.isGlobalObjectivesUpdateAvailable = false;
                    try {
                        if ($15['readSatisfiedStatus']) {
                            if ($11.objectiveProgressStatus) {
                                $14.status.objectiveSatisfiedStatusFromGlobal = true;
                                $14.status.set_objectiveProgressStatus($11.objectiveProgressStatus);
                                $14.status.set_objectiveSatisfiedStatus($11.satisfiedStatus);
                            } else {
                                $14.status.set_objectiveProgressStatus(false);
                                $14.status.set_objectiveSatisfiedStatus(false);
                            }
                        }
                        if ($15['readNormalizedMeasure']) {
                            $14.status.activityProgressStatus = true;
                            if ($11.measureStatus) {
                                $14.status.objectiveMeasureStatusFromGlobal = true;
                                $14.status.set_objectiveMeasureStatus($11.measureStatus);
                                $14.status.set_objectiveNormalizedMeasure($11.normalizedMeasure);
                            } else {
                                $14.status.set_objectiveMeasureStatus(false);
                                $14.status.set_objectiveNormalizedMeasure(0);
                            }
                        }
                        if ($15['readRawScore']) {
                            $14.status.set_scoreRaw($11.scoreRaw);
                        }
                        if ($15['readMinScore']) {
                            $14.status.set_scoreMin($11.scoreMin);
                        }
                        if ($15['readMaxScore']) {
                            $14.status.set_scoreMax($11.scoreMax);
                        }
                        if ($15['readProgressMeasure']) {
                            $14.status.attemptCompletionAmountFromGlobal = true;
                            $14.status.attemptCompletionAmountStatus = $11.progressMeasureStatus;
                            $14.status.set_attemptCompletionAmount($11.progressMeasure);
                        }
                        if ($15['readCompletionStatus']) {
                            $14.status.attemptCompletionStatusFromGlobal = true;
                            $14.status.activityProgressStatus = true;
                            $14.status.set_attemptCompletionStatus($11.completionStatus);
                            $14.status.set_attemptProgressStatus($11.completionProgressStatus);
                        }
                        if (!$F.contains($14.getSequencing().getActivityTreeNode())) {
                            $F.add($14.getSequencing().getActivityTreeNode());
                        }
                    } finally {
                        this.isGlobalObjectivesUpdateAvailable = $16;
                    }
                }
            }
            this.$71();
        }
    },
    $72: function ($p0) {
        var $0 = $p0.getSequencing();
        var $1 = $p0.getChildrens();
        if ($0.reorderChildren && $0.randomizationTiming !== 'never') {
            $1.sort(Delegate.create(this, function ($p1_0, $p1_1) {
                var $1_0 = $p1_0;
                var $1_1 = $p1_1;
                var $1_2 = $1_0.getOrderIndex();
                var $1_3 = $1_1.getOrderIndex();
                var $1_4 = (Math.random() > 0.5) ? 1 : -1;
                if ($1_4 === 1) {
                    if ($1_0.getOrderIndex() > $1_1.getOrderIndex()) {
                        $1_0.setOrderIndex($1_3);
                        $1_1.setOrderIndex($1_2);
                    }
                } else {
                    if ($1_1.getOrderIndex() > $1_0.getOrderIndex()) {
                        $1_0.setOrderIndex($1_3);
                        $1_1.setOrderIndex($1_2);
                    }
                }
                return $1_4;
            }));
        }
        if ($0.selectCount >= 0 && $0.selectionTiming !== 'never') {
            while ($1.length > $0.selectCount && $1.length > 0) {
                $1.removeAt($1.length - 1);
            }
        }
    },
    $73: function ($p0, $p1, $p2, $p3, $p4, $p5) {
        var $0 = SCORM.BaseUtils.getXMLNodeAttribut($p1, 'identifier');
        var $1 = null;
        var $2 = null;
        var $3 = true;
        var $4 = null;
        if (!$p5) {
            $1 = SCORM.BaseUtils.getXMLNodeAttribut($p1, 'identifierref');
            if ($1 != null && $1.length > 0 && !isNullOrUndefined($p2) && $p2.length >= 1) {
                var $enum1 = $p2.getEnumerator();
                while ($enum1.moveNext()) {
                    var $6 = $enum1.get_current();
                    var $7 = SCORM.BaseUtils.getXMLNodeAttribut($6, 'identifier');
                    if ($7 != null && $7 === $1) {
                        $4 = SCORM.BaseUtils.getXMLNodeAttribut($6, 'scormType');
                        if (!isNullOrUndefined($4)) {
                            $4 = $4.toLowerCase();
                        }
                        $2 = SCORM.BaseUtils.getXMLNodeAttribut($6, 'href');
                        if ($2 == null) {
                            $2 = '';
                        }
                        while ($2.startsWith('/')) {
                            $2 = $2.substr(1);
                        }
                        var $8 = SCORM.BaseUtils.getXMLNodeAttribut($6, 'base');
                        if ($8 != null && $8.length > 0 && !$2.startsWith('http://') && !$2.startsWith('https://')) {
                            if (!$8.endsWith('/')) {
                                $8 += '/';
                            }
                            if (!$8.startsWith('/')) {
                                $p4 += $8;
                            } else {
                                $p4 = SCORM.BaseUtils.getBaseOfUrl($p4) + $8;
                            }
                        }
                        $2 = $p4 + $2;
                        while ($2.startsWith('/')) {
                            $2 = $2.substr(1);
                        }
                        $2 = SCORM.BaseUtils.utf8Decode($2);
                        var $9 = SCORM.BaseUtils.getXMLNodeAttribut($p1, 'parameters');
                        if ($9 == null || $9.length <= 0) {
                            break;
                        }
                        $2 = SCORM.BaseUtils.addParameters($2, $9);
                        break;
                    }
                }
            }
            $3 = SCORM.BaseUtils.getXMLNodeAttribut($p1, 'isvisible') == null || SCORM.BaseUtils.getXMLNodeAttribut($p1, 'isvisible') === 'true';
        } else {
            this.$1E = SCORM.BaseUtils.getXMLNodeAttribut($p1, 'sharedDataGlobalToSystem') == null || SCORM.BaseUtils.getXMLNodeAttribut($p1, 'sharedDataGlobalToSystem') === 'true';
            this.$1F = SCORM.BaseUtils.getXMLNodeAttribut($p1, 'objectivesGlobalToSystem') == null || SCORM.BaseUtils.getXMLNodeAttribut($p1, 'objectivesGlobalToSystem') === 'true';
            if (!this.$1F) {
                if (this.$1D == null) {
                    this._globalObjectives = {};
                }
            }
        }
        var $5;
        if ($p5) {
            $5 = $p0.addNode('', $0, null, $4, $3);
        } else {
            $5 = $p0.addNode('', $0, $2, $4, $3);
            this.$1A = this.$1B === 1;
            if ($0 === this.$1D) {
                this.$3C = $5;
            }
        }
        $5.setOrderIndex(this.$1B);
        this.$1B++;
        this.$1C = $5;
        for (var $A = 0; $A < $p1.childNodes.length; $A++) {
            if ($p1.childNodes[$A].nodeType !== 1) {
                continue;
            }
            var $B = SCORM.BaseUtils.getBaseName($p1.childNodes[$A]).toLowerCase();
            var $C = SCORM.BaseUtils.getText($p1.childNodes[$A]);
            if ($B === 'title') {
                $5.setTitle($C);
            } else if ($B === 'item') {
                this.$73($5, $p1.childNodes[$A], $p2, $p3, $p4, false);
            } else if ($B === 'timelimitaction') {
                $5.setTimelimitaction($C);
            } else if ($B === 'datafromlms') {
                $5.setDatafromlms($C);
            } else if ($B === 'completionthreshold') {
                $5.setCompletedbymeasure(SCORM.BaseUtils.getXMLNodeAttribut($p1.childNodes[$A], 'completedByMeasure') != null && SCORM.BaseUtils.getXMLNodeAttribut($p1.childNodes[$A], 'completedByMeasure') === 'true');
                if (SCORM.BaseUtils.getXMLNodeAttribut($p1.childNodes[$A], 'minProgressMeasure') != null) {
                    $5.setMinprogressmeasure(parseFloat(SCORM.BaseUtils.getXMLNodeAttribut($p1.childNodes[$A], 'minProgressMeasure')));
                }
                if (SCORM.BaseUtils.getXMLNodeAttribut($p1.childNodes[$A], 'progressWeight') != null) {
                    $5.setProgressweight(parseFloat(SCORM.BaseUtils.getXMLNodeAttribut($p1.childNodes[$A], 'progressWeight')));
                }
            } else if ($B === 'data') {
                var $D;
                if (this.isSharedDataGlobalToSystem()) {
                    if (isNullOrUndefined(this.getADLCPData())) {
                        this.setADLCPData({});
                    }
                    $D = this.getADLCPData();
                } else {
                    $5.setADLCPData({});
                    $D = $5.getADLCPData();
                }
                for (var $E = 0; $E < $p1.childNodes[$A].childNodes.length; $E++) {
                    var $F = $p1.childNodes[$A].childNodes[$E];
                    if ($F.nodeType !== 1) {
                        continue;
                    }
                    var $10 = SCORM.BaseUtils.getBaseName($F).toLowerCase();
                    if ($10 !== 'map') {
                        continue;
                    }
                    if (SCORM.BaseUtils.getXMLNodeAttribut($F, 'targetID') == null) {
                        continue;
                    }
                    var $11 = SCORM.BaseUtils.getXMLNodeAttribut($F, 'targetID');
                    if ($11.length <= 0) {
                        continue;
                    }
                    if (Object.keyExists($D, $11)) {
                        continue;
                    }
                    var $12 = true;
                    if (SCORM.BaseUtils.getXMLNodeAttribut($F, 'readSharedData') != null) {
                        $12 = SCORM.BaseUtils.getXMLNodeAttribut($F, 'readSharedData') === 'true';
                    }
                    var $13 = true;
                    if (SCORM.BaseUtils.getXMLNodeAttribut($F, 'writeSharedData') != null) {
                        $13 = SCORM.BaseUtils.getXMLNodeAttribut($F, 'writeSharedData') === 'true';
                    }
                    $D[$11] = {
                        readSharedData: $12,
                        writeSharedData: $13,
                        sco: $5.getIdentifier(),
                        n: Object.getKeyCount($D).toString(),
                        store: null
                    };
                }
            } else if ($B === 'sequencing') {
                this.$74($5, $p1.childNodes[$A], $p3);
            } else if ($B === 'presentation') {
                var $14 = SCORM.BaseUtils.getChildNodeByName($p1.childNodes[$A], 'navigationInterface');
                if (!isNullOrUndefined($14)) {
                    var $15 = $5.getHideLMSUI();
                    for (var $16 = 0; $16 < $14.childNodes.length; $16++) {
                        var $17 = $14.childNodes[$16];
                        if ($17.nodeType !== 1) {
                            continue;
                        }
                        var $18 = SCORM.BaseUtils.getBaseName($17).toLowerCase();
                        if ($18 !== 'hidelmsui' || isNullOrUndefined(SCORM.BaseUtils.getText($17))) {
                            continue;
                        }
                        var $19 = SCORM.BaseUtils.getText($17).trim().toLowerCase();
                        if (!$15.contains($19)) {
                            $15.add($19);
                        }
                    }
                }
            }
        }
        if ($5.getSequencing().getPrimaryObjective() == null) {
            $5.getSequencing().createObjectives(null);
        }
        if ($5.getSequencing().getPrimaryObjective().mapInfos == null) {
            if (!isNullOrUndefined(this.$21[$5.getIdentifier()])) {
                $5.getSequencing().status.setStatusStateFromDictionary(this.$21[$5.getIdentifier()]);
            }
        }
    },
    $74: function ($p0, $p1, $p2) {
        var $0 = SCORM.BaseUtils.getXMLNodeAttribut($p1, 'IDRef');
        if ($0 != null && $p2 != null) {
            for (var $2 = 0; $2 < $p2.childNodes.length; $2++) {
                if ($p2.childNodes[$2].nodeType !== 1) {
                    continue;
                }
                var $3 = SCORM.BaseUtils.getXMLNodeAttribut($p2.childNodes[$2], 'ID');
                if ($0 === $3) {
                    this.$74($p0, $p2.childNodes[$2], null);
                    break;
                }
            }
        }
        var $1 = SCORM.BaseUtils.getChildSiblingsByName($p1, 'objectives');
        var $enum1 = $1.getEnumerator();
        while ($enum1.moveNext()) {
            var $4 = $enum1.get_current();
            var $5 = SCORM.BaseUtils.getChildNodeByName($4, 'primaryObjective');
            if ($5 != null) {
                $p0.getSequencing().createObjectives(SCORM.BaseUtils.getXMLNodeAttribut($5, 'objectiveID'));
                var $6 = SCORM.BaseUtils.getXMLNodeAttribut($5, 'satisfiedByMeasure');
                if ($6 === 'true') {
                    $p0.getSequencing().getPrimaryObjective().satisfiedByMeasure = true;
                    var $7 = SCORM.BaseUtils.getChildNodeByName($5, 'minNormalizedMeasure');
                    var $8 = '1.0';
                    if ($7 != null && SCORM.BaseUtils.getText($7).trim().length > 0) {
                        $8 = SCORM.BaseUtils.getText($7).trim();
                    }
                    $p0.getSequencing().getPrimaryObjective().minNormalizedMeasure = parseFloat($8);
                }
                this.$75(SCORM.BaseUtils.getChildSiblingsByName($5, 'mapInfo'), $p0.getSequencing().getPrimaryObjective());
                break;
            }
        }
        for (var $9 = 0; $9 < $p1.childNodes.length; $9++) {
            if ($p1.childNodes[$9].nodeType !== 1) {
                continue;
            }
            var $A = SCORM.BaseUtils.getBaseName($p1.childNodes[$9]).toLowerCase();
            if ($A === 'controlmode') {
                var $B = SCORM.BaseUtils.getXMLNodeAttribut($p1.childNodes[$9], 'choice');
                $p0.getSequencing().choice = $B === 'true' || $B == null;
                var $C = SCORM.BaseUtils.getXMLNodeAttribut($p1.childNodes[$9], 'choiceExit');
                $p0.getSequencing().choiceExit = $C === 'true' || $C == null;
                var $D = SCORM.BaseUtils.getXMLNodeAttribut($p1.childNodes[$9], 'flow');
                $p0.getSequencing().flow = $D === 'true';
                var $E = SCORM.BaseUtils.getXMLNodeAttribut($p1.childNodes[$9], 'forwardOnly');
                $p0.getSequencing().forwardOnly = $E === 'true';
                var $F = SCORM.BaseUtils.getXMLNodeAttribut($p1.childNodes[$9], 'useCurrentAttemptObjectiveInfo');
                $p0.getSequencing().useCurrentAttemptObjectiveInfo = $F === 'true' || $F == null;
                var $10 = SCORM.BaseUtils.getXMLNodeAttribut($p1.childNodes[$9], 'useCurrentAttemptProgressInfo');
                $p0.getSequencing().useCurrentAttemptProgressInfo = $10 === 'true' || $10 == null;
            } else if ($A === 'objectives' && $p0.getSequencing().getPrimaryObjective() != null) {
                var $11 = SCORM.BaseUtils.getChildSiblingsByName($p1.childNodes[$9], 'objective');
                var $enum2 = $11.getEnumerator();
                while ($enum2.moveNext()) {
                    var $12 = $enum2.get_current();
                    var $13 = SCORM.BaseUtils.getXMLNodeAttribut($12, 'objectiveID');
                    if ($13 != null) {
                        $13 = SCORM_1_3.Utils.removeWhiteSpaces(decodeURI($13.trim()));
                    }
                    var $14 = $p0.getSequencing().findObjective($13);
                    var $15;
                    if ($13 != null && $14 != null) {
                        $15 = $14;
                    } else {
                        $15 = $p0.getSequencing().addObjective($p0.getSequencing().getObjectivesCount(), $13);
                    }
                    var $16 = SCORM.BaseUtils.getXMLNodeAttribut($12, 'satisfiedByMeasure');
                    if ($16 === 'true') {
                        $15.satisfiedByMeasure = true;
                        var $17 = SCORM.BaseUtils.getChildNodeByName($12, 'minNormalizedMeasure');
                        var $18 = '1.0';
                        if ($17 != null && SCORM.BaseUtils.getText($17).trim().length > 0) {
                            $18 = SCORM.BaseUtils.getText($17).trim();
                        }
                        $15.minNormalizedMeasure = parseFloat($18);
                    }
                    this.$75(SCORM.BaseUtils.getChildSiblingsByName($12, 'mapInfo'), $15);
                }
            } else if ($A === 'randomizationcontrols') {
                var $19 = SCORM.BaseUtils.getXMLNodeAttribut($p1.childNodes[$9], 'randomizationTiming');
                if (!isNullOrUndefined($19)) {
                    $p0.getSequencing().randomizationTiming = $19;
                }
                var $1A = SCORM.BaseUtils.getXMLNodeAttribut($p1.childNodes[$9], 'selectCount');
                if (!isNullOrUndefined($1A) && $1A.length > 0) {
                    $p0.getSequencing().selectCount = parseInt($1A);
                }
                var $1B = SCORM.BaseUtils.getXMLNodeAttribut($p1.childNodes[$9], 'reorderChildren');
                if (!isNullOrUndefined($1B)) {
                    $p0.getSequencing().reorderChildren = $1B === 'true';
                }
                var $1C = SCORM.BaseUtils.getXMLNodeAttribut($p1.childNodes[$9], 'selectionTiming');
                if (!isNullOrUndefined($1C)) {
                    $p0.getSequencing().selectionTiming = $1C;
                }
            } else if ($A === 'deliverycontrols') {
                var $1D = SCORM.BaseUtils.getXMLNodeAttribut($p1.childNodes[$9], 'tracked');
                $p0.getSequencing().tracked = $1D == null || $1D === 'true';
                $p0.getSequencing().manifestCompletionSetByContent = SCORM.BaseUtils.getXMLNodeAttribut($p1.childNodes[$9], 'completionSetByContent') === 'true';
                $p0.getSequencing().manifestObjectiveSetByContent = SCORM.BaseUtils.getXMLNodeAttribut($p1.childNodes[$9], 'objectiveSetByContent') === 'true';
                $p0.getSequencing().completionSetByContent = $p0.getSequencing().manifestCompletionSetByContent;
                $p0.getSequencing().objectiveSetByContent = $p0.getSequencing().manifestObjectiveSetByContent;
            } else if ($A === 'sequencingrules') {
                $p0.getSequencing().preConditionRules = this.$76($p1.childNodes[$9], 'preConditionRule');
                $p0.getSequencing().postConditionRules = this.$76($p1.childNodes[$9], 'postConditionRule');
                $p0.getSequencing().exitConditionRules = this.$76($p1.childNodes[$9], 'exitConditionRule');
            } else if ($A === 'rolluprules') {
                if (!isNullOrUndefined($p0.getSequencing().rollupRules)) {
                    $p0.getSequencing().rollupRules.clear();
                }
                var $1E = SCORM.BaseUtils.getXMLNodeAttribut($p1.childNodes[$9], 'rollupObjectiveSatisfied');
                var $1F = SCORM.BaseUtils.getXMLNodeAttribut($p1.childNodes[$9], 'rollupProgressCompletion');
                var $20 = SCORM.BaseUtils.getXMLNodeAttribut($p1.childNodes[$9], 'objectiveMeasureWeight');
                $p0.getSequencing().rollupObjectiveSatisfied = ($1E !== 'false');
                $p0.getSequencing().rollupProgressCompletion = ($1F !== 'false');
                $p0.getSequencing().rollupObjectiveMeasureWeight = parseFloat(($20 == null || $20.length === 0) ? '1.0000' : $20);
                var $21 = SCORM.BaseUtils.getChildSiblingsByName($p1.childNodes[$9], 'rollupRule');
                var $enum3 = $21.getEnumerator();
                while ($enum3.moveNext()) {
                    var $22 = $enum3.get_current();
                    var $23 = SCORM.BaseUtils.getChildNodeByName($22, 'rollupAction');
                    var $24 = SCORM.BaseUtils.getChildNodeByName($22, 'rollupConditions');
                    if ($24 == null || $23 == null) {
                        continue;
                    }
                    var $25 = {};
                    var $26 = SCORM.BaseUtils.getXMLNodeAttribut($22, 'childActivitySet');
                    $25['childActivitySet'] = ($26 == null || $26.length === 0) ? 'all' : $26;
                    var $27 = SCORM.BaseUtils.getXMLNodeAttribut($22, 'minimumCount');
                    $25['minimumCount'] = ($27 == null || $27.length === 0) ? '0' : $27;
                    var $28 = SCORM.BaseUtils.getXMLNodeAttribut($22, 'minimumPercent');
                    $25['minimumPercent'] = ($28 == null || $28.length === 0) ? '0.0000' : $28;
                    var $29 = SCORM.BaseUtils.getXMLNodeAttribut($24, 'conditionCombination');
                    $25['action'] = SCORM.BaseUtils.getXMLNodeAttribut($23, 'action');
                    $25['conditionCombination'] = ($29 == null) ? 'any' : $29;
                    var $2A = SCORM.BaseUtils.getChildSiblingsByName($24, 'rollupCondition');
                    var $2B = 0;
                    var $enum4 = $2A.getEnumerator();
                    while ($enum4.moveNext()) {
                        var $2C = $enum4.get_current();
                        var $2D = SCORM.BaseUtils.getXMLNodeAttribut($2C, 'operator');
                        $25['rule_' + $2B] = {
                            condition: SCORM.BaseUtils.getXMLNodeAttribut($2C, 'condition'),
                            operator: ($2D != null) ? $2D : 'noOp'
                        };
                        $2B++;
                    }
                    if ($p0.getSequencing().rollupRules == null) {
                        $p0.getSequencing().rollupRules = [];
                    }
                    $p0.getSequencing().rollupRules.add($25);
                }
            } else if ($A === 'limitconditions') {
                $p0.getSequencing().limitConditions_attemptLimit = SCORM.BaseUtils.getXMLNodeAttribut($p1.childNodes[$9], 'attemptLimit');
                if ($p0.getSequencing().limitConditions_attemptLimit != null && parseInt($p0.getSequencing().limitConditions_attemptLimit) >= 0) {
                    $p0.getSequencing().limitConditions_attemptControl = true;
                }
                $p0.getSequencing().limitConditions_attemptAbsoluteDurationLimit = SCORM.BaseUtils.getXMLNodeAttribut($p1.childNodes[$9], 'attemptAbsoluteDurationLimit');
                if ($p0.getSequencing().limitConditions_attemptAbsoluteDurationLimit != null) {
                    $p0.getSequencing().limitConditions_activityAbsoluteDurationControl = true;
                }
            } else if ($A === 'constrainedchoiceconsiderations') {
                $p0.getSequencing().constrainedChoiceConsiderations_preventActivation = SCORM.BaseUtils.getXMLNodeAttribut($p1.childNodes[$9], 'preventActivation') === 'true';
                $p0.getSequencing().constrainedChoiceConsiderations_constrainChoice = SCORM.BaseUtils.getXMLNodeAttribut($p1.childNodes[$9], 'constrainChoice') === 'true';
            } else if ($A === 'rollupconsiderations') {
                var $2E = SCORM.BaseUtils.getXMLNodeAttribut($p1.childNodes[$9], 'requiredForSatisfied');
                $p0.getSequencing().rollupConsiderations_requiredForSatisfied = ($2E == null) ? 'always' : $2E;
                var $2F = SCORM.BaseUtils.getXMLNodeAttribut($p1.childNodes[$9], 'requiredForNotSatisfied');
                $p0.getSequencing().rollupConsiderations_requiredForNotSatisfied = ($2F == null) ? 'always' : $2F;
                var $30 = SCORM.BaseUtils.getXMLNodeAttribut($p1.childNodes[$9], 'requiredForCompleted');
                $p0.getSequencing().rollupConsiderations_requiredForCompleted = ($30 == null) ? 'always' : $30;
                var $31 = SCORM.BaseUtils.getXMLNodeAttribut($p1.childNodes[$9], 'requiredForIncomplete');
                $p0.getSequencing().rollupConsiderations_requiredForIncomplete = ($31 == null) ? 'always' : $31;
                var $32 = SCORM.BaseUtils.getXMLNodeAttribut($p1.childNodes[$9], 'measureSatisfactionIfActive');
                $p0.getSequencing().rollupConsiderations_measureSatisfactionIfActive = $32 !== 'false';
            }
        }
    },
    $75: function ($p0, $p1) {
        if ($p0 == null || $p0.length === 0) {
            return;
        }
        var $0;
        if ($p1.mapInfos == null) {
            $0 = {};
        } else {
            $0 = $p1.mapInfos;
        }
        var $enum1 = $p0.getEnumerator();
        while ($enum1.moveNext()) {
            var $1 = $enum1.get_current();
            var $2 = SCORM.BaseUtils.getXMLNodeAttribut($1, 'targetObjectiveID');
            if ($2 == null) {
                continue;
            }
            $2 = SCORM_1_3.Utils.removeWhiteSpaces(decodeURI($2.trim()));
            var $3 = SCORM.BaseUtils.getXMLNodeAttribut($1, 'readSatisfiedStatus');
            var $4 = SCORM.BaseUtils.getXMLNodeAttribut($1, 'readNormalizedMeasure');
            var $5 = SCORM.BaseUtils.getXMLNodeAttribut($1, 'writeSatisfiedStatus');
            var $6 = SCORM.BaseUtils.getXMLNodeAttribut($1, 'writeNormalizedMeasure');
            var $7 = SCORM.BaseUtils.getXMLNodeAttribut($1, 'readRawScore');
            var $8 = SCORM.BaseUtils.getXMLNodeAttribut($1, 'readMinScore');
            var $9 = SCORM.BaseUtils.getXMLNodeAttribut($1, 'readMaxScore');
            var $A = SCORM.BaseUtils.getXMLNodeAttribut($1, 'readCompletionStatus');
            var $B = SCORM.BaseUtils.getXMLNodeAttribut($1, 'readProgressMeasure');
            var $C = SCORM.BaseUtils.getXMLNodeAttribut($1, 'writeRawScore');
            var $D = SCORM.BaseUtils.getXMLNodeAttribut($1, 'writeMinScore');
            var $E = SCORM.BaseUtils.getXMLNodeAttribut($1, 'writeMaxScore');
            var $F = SCORM.BaseUtils.getXMLNodeAttribut($1, 'writeCompletionStatus');
            var $10 = SCORM.BaseUtils.getXMLNodeAttribut($1, 'writeProgressMeasure');
            if ($0[$2] == null) {
                $0[$2] = {};
            }($0[$2])['readSatisfiedStatus'] = ($3 !== 'false');
            ($0[$2])['readNormalizedMeasure'] = ($4 !== 'false');
            ($0[$2])['writeSatisfiedStatus'] = ($5 === 'true');
            ($0[$2])['writeNormalizedMeasure'] = ($6 === 'true');
            ($0[$2])['readRawScore'] = ($7 !== 'false');
            ($0[$2])['readMinScore'] = ($8 !== 'false');
            ($0[$2])['readMaxScore'] = ($9 !== 'false');
            ($0[$2])['readCompletionStatus'] = ($A !== 'false');
            ($0[$2])['readProgressMeasure'] = ($B !== 'false');
            ($0[$2])['writeRawScore'] = ($C === 'true');
            ($0[$2])['writeMinScore'] = ($D === 'true');
            ($0[$2])['writeMaxScore'] = ($E === 'true');
            ($0[$2])['writeCompletionStatus'] = ($F === 'true');
            ($0[$2])['writeProgressMeasure'] = ($10 === 'true');
            if (!Object.keyExists(this._globalObjectives, $2)) {
                var $11 = new SCORM_1_3.GlobalObjective();
                $11.satisfiedStatus = false;
                $11.objectiveProgressStatus = false;
                $11.measureStatus = false;
                $11.normalizedMeasure = 0;
                $11.scoreRaw = null;
                $11.scoreMin = null;
                $11.scoreMax = null;
                $11.completionStatus = false;
                $11.completionProgressStatus = false;
                $11.progressMeasureStatus = false;
                $11.progressMeasure = null;
                this._globalObjectives[$2] = $11;
            }
            if ($p1.objectiveID != null && $p1.objectiveID.length > 0) {
                var $12 = (this._globalObjectives[$2]).objectives;
                if (!$12.contains($p1)) {
                    $12.add($p1);
                }
            }
        }
        $p1.mapInfos = $0;
    },
    $76: function ($p0, $p1) {
        var $0 = [];
        var $1 = SCORM.BaseUtils.getChildSiblingsByName($p0, $p1);
        var $enum1 = $1.getEnumerator();
        while ($enum1.moveNext()) {
            var $2 = $enum1.get_current();
            var $3 = SCORM.BaseUtils.getChildNodeByName($2, 'ruleAction');
            var $4 = SCORM.BaseUtils.getChildNodeByName($2, 'ruleConditions');
            if ($4 == null || $3 == null) {
                continue;
            }
            var $5 = SCORM.BaseUtils.getXMLNodeAttribut($4, 'conditionCombination');
            var $6 = {};
            $6['action'] = SCORM.BaseUtils.getXMLNodeAttribut($3, 'action');
            $6['conditionCombination'] = ($5 == null) ? 'all' : $5;
            var $7 = SCORM.BaseUtils.getChildSiblingsByName($4, 'ruleCondition');
            var $8 = 0;
            var $enum2 = $7.getEnumerator();
            while ($enum2.moveNext()) {
                var $9 = $enum2.get_current();
                var $A = SCORM.BaseUtils.getXMLNodeAttribut($9, 'operator');
                var $B = SCORM.BaseUtils.getXMLNodeAttribut($9, 'referencedObjective');
                if ($B != null) {
                    $B = SCORM_1_3.Utils.removeWhiteSpaces(decodeURI($B.trim()));
                }
                $6['rule_' + $8] = {
                    referencedObjective: $B,
                    measureThreshold: SCORM.BaseUtils.getXMLNodeAttribut($9, 'measureThreshold'),
                    condition: SCORM.BaseUtils.getXMLNodeAttribut($9, 'condition'),
                    operator: ($A != null) ? $A : 'noOp'
                };
                $8++;
            }
            $0.add($6);
        }
        return $0;
    },
    getClonedGlobalObjectives: function () {
        var $0 = {};
        var $dict1 = this._globalObjectives;
        for (var $key2 in $dict1) {
            var $1 = {
                key: $key2,
                value: $dict1[$key2]
            };
            var $2 = $1.value;
            var $3 = new SCORM_1_3.GlobalObjective();
            $3.satisfiedStatus = $2.satisfiedStatus;
            $3.objectiveProgressStatus = $2.objectiveProgressStatus;
            $3.measureStatus = $2.measureStatus;
            $3.normalizedMeasure = $2.normalizedMeasure;
            $3.scoreRaw = $2.scoreRaw;
            $3.scoreMin = $2.scoreMin;
            $3.scoreMax = $2.scoreMax;
            $3.completionStatus = $2.completionStatus;
            $3.completionProgressStatus = $2.completionProgressStatus;
            $3.progressMeasureStatus = $2.progressMeasureStatus;
            $3.progressMeasure = $2.progressMeasure;
            $0[$1.key] = $3;
        }
        return $0;
    },
    $77: function () {
        var $0 = {};
        var $1 = this.getActivityTreeNodes();
        var $dict1 = $1;
        for (var $key2 in $dict1) {
            var $2 = {
                key: $key2,
                value: $dict1[$key2]
            };
            var $3 = $2.value;
            var $4 = $3.getSequencing().status.setStatusStateToDictionary();
            $4['isActive'] = $3.get_isActive();
            $4['isSuspended'] = $3.get_isSuspended();
            $4['isAbandoned'] = $3.get_isAbandoned();
            $0[$2.key] = $4;
        }
        return $0;
    },
    $78: function () {
        if (!isNullOrUndefined(this.$22)) {
            var $dict1 = this._globalObjectives;
            for (var $key2 in $dict1) {
                var $0 = {
                    key: $key2,
                    value: $dict1[$key2]
                };
                var $1 = $0.value;
                var $2 = this.$22[$0.key];
                $1.satisfiedStatus = $2.satisfiedStatus;
                $1.objectiveProgressStatus = $2.objectiveProgressStatus;
                $1.measureStatus = $2.measureStatus;
                $1.normalizedMeasure = $2.normalizedMeasure;
                $1.scoreRaw = $2.scoreRaw;
                $1.scoreMin = $2.scoreMin;
                $1.scoreMax = $2.scoreMax;
                $1.completionStatus = $2.completionStatus;
                $1.completionProgressStatus = $2.completionProgressStatus;
                $1.progressMeasureStatus = $2.progressMeasureStatus;
                $1.progressMeasure = $2.progressMeasure;
            }
        }
        if (!isNullOrUndefined(this.$23)) {
            var $3 = this.getActivityTreeNodes();
            var $dict3 = $3;
            for (var $key4 in $dict3) {
                var $4 = {
                    key: $key4,
                    value: $dict3[$key4]
                };
                if (!Object.keyExists(this.$23, $4.key)) {
                    continue;
                }
                var $5 = $4.value;
                var $6 = this.$23[$4.key];
                $5.getSequencing().status.setStatusStateFromDictionary($6);
                $5.set_isActive($6['isActive']);
                $5.set_isSuspended($6['isSuspended']);
                $5.set_isAbandoned($6['isAbandoned']);
            }
        }
    }
};
SCORM_1_3.ActivityTreeNodeSequencing = function (nodeSCO) {
    this.$0 = nodeSCO;
    this.status = new SCORM_1_3.SequencingObjectiveStatus(null);
};
SCORM_1_3.ActivityTreeNodeSequencing.prototype = {
    $0: null,
    $1: null,
    $2: 0,
    choice: true,
    choiceExit: true,
    flow: false,
    forwardOnly: false,
    useCurrentAttemptObjectiveInfo: true,
    useCurrentAttemptProgressInfo: true,
    randomizationTiming: 'never',
    selectCount: 0,
    reorderChildren: false,
    selectionTiming: 'never',
    tracked: true,
    manifestCompletionSetByContent: false,
    manifestObjectiveSetByContent: false,
    completionSetByContent: false,
    objectiveSetByContent: false,
    preConditionRules: null,
    postConditionRules: null,
    exitConditionRules: null,
    rollupObjectiveSatisfied: true,
    rollupProgressCompletion: true,
    rollupObjectiveMeasureWeight: 1,
    rollupRules: null,
    limitConditions_attemptControl: false,
    limitConditions_attemptLimit: null,
    limitConditions_activityAbsoluteDurationControl: false,
    limitConditions_attemptAbsoluteDurationLimit: null,
    limitCondition_activityExperiencedDurationControl: false,
    constrainedChoiceConsiderations_preventActivation: false,
    constrainedChoiceConsiderations_constrainChoice: false,
    rollupConsiderations_requiredForSatisfied: 'always',
    rollupConsiderations_requiredForNotSatisfied: 'always',
    rollupConsiderations_requiredForCompleted: 'always',
    rollupConsiderations_requiredForIncomplete: 'always',
    rollupConsiderations_measureSatisfactionIfActive: true,
    status: null,
    getActivityTreeNode: function () {
        return this.$0;
    },
    getConditionRulesForAction: function (action) {
        var $0 = [];
        if (this.preConditionRules != null) {
            var $enum1 = this.preConditionRules.getEnumerator();
            while ($enum1.moveNext()) {
                var $1 = $enum1.get_current();
                if ($1['action'] === action) {
                    $0.add($1);
                }
            }
        }
        if (this.postConditionRules != null) {
            var $enum2 = this.postConditionRules.getEnumerator();
            while ($enum2.moveNext()) {
                var $2 = $enum2.get_current();
                if ($2['action'] === action) {
                    $0.add($2);
                }
            }
        }
        if (this.exitConditionRules != null) {
            var $enum3 = this.exitConditionRules.getEnumerator();
            while ($enum3.moveNext()) {
                var $3 = $enum3.get_current();
                if ($3['action'] === action) {
                    $0.add($3);
                }
            }
        }
        return $0;
    },
    getConditionRollupRulesForAction: function (action) {
        var $0 = [];
        if (this.rollupRules != null) {
            var $enum1 = this.rollupRules.getEnumerator();
            while ($enum1.moveNext()) {
                var $1 = $enum1.get_current();
                if ($1['action'] === action) {
                    $0.add($1);
                }
            }
        }
        return $0;
    },
    getPrimaryObjective: function () {
        if (this.$1 != null) {
            if (Object.keyExists(this.$1, 'primaryObjective')) {
                return this.$1['primaryObjective'];
            }
        }
        return null;
    },
    addObjective: function (index, objectiveID) {
        if (this.$1 != null) {
            if (!Object.keyExists(this.$1, 'objective_' + index)) {
                var $0 = new SCORM_1_3.SequencingObjective(this);
                $0.objectiveID = objectiveID;
                this.$1['objective_' + index] = $0;
                this.$2++;
                return $0;
            }
        }
        return null;
    },
    findObjective: function (objectiveID) {
        if (this.$1 != null && objectiveID != null) {
            var $dict1 = this.$1;
            for (var $key2 in $dict1) {
                var $0 = {
                    key: $key2,
                    value: $dict1[$key2]
                };
                if (($0.value).objectiveID === objectiveID) {
                    return $0.value;
                }
            }
        }
        return null;
    },
    getObjectiveByIndex: function (index) {
        if (this.$1 != null && Object.keyExists(this.$1, 'objective_' + index)) {
            return this.$1['objective_' + index];
        }
        return null;
    },
    getObjectives: function () {
        var $0 = [];
        if (this.$1 != null) {
            var $dict1 = this.$1;
            for (var $key2 in $dict1) {
                var $1 = {
                    key: $key2,
                    value: $dict1[$key2]
                };
                $0.add($1.value);
            }
        }
        return $0;
    },
    getObjectivesCount: function () {
        return this.$2;
    },
    createObjectives: function (primaryObjectiveID) {
        this.$1 = {};
        this.$2 = 0;
        if (primaryObjectiveID != null && primaryObjectiveID.length > 0) {
            this.$1['primaryObjective'] = this.addObjective(this.getObjectivesCount(), primaryObjectiveID);
        } else {
            this.$1['primaryObjective'] = new SCORM_1_3.SequencingObjective(this);
        }(this.$1['primaryObjective']).contributeToRollup = true;
        this.status = (this.$1['primaryObjective']).status;
    }
};
SCORM_1_3.SequencingObjectiveStatus = function (sequencingObjective) {
    this.$0 = sequencingObjective;
    if (this.$0 != null) {
        this.$1 = this.$0.getSequencing().getActivityTreeNode().getRoot().getGlobalObjectives();
    }
};
SCORM_1_3.SequencingObjectiveStatus.prototype = {
    $0: null,
    $1: null,
    activityProgressStatus: false,
    $2: false,
    get_attemptProgressStatus: function () {
        return this.$2;
    },
    set_attemptProgressStatus: function (value) {
        this.$2 = value;
        this.updateGlobalObjective();
        return value;
    },
    attemptCompletionStatusFromGlobal: false,
    $3: false,
    get_attemptCompletionStatus: function () {
        return this.$3;
    },
    set_attemptCompletionStatus: function (value) {
        this.$3 = value;
        this.updateGlobalObjective();
        return value;
    },
    attemptCompletionAmountFromGlobal: false,
    attemptCompletionAmountStatus: false,
    $4: null,
    get_attemptCompletionAmount: function () {
        return this.$4;
    },
    set_attemptCompletionAmount: function (value) {
        this.$4 = value;
        this.updateGlobalObjective();
        return value;
    },
    attemptCount: 0,
    $5: false,
    get_objectiveProgressStatus: function () {
        return this.$5;
    },
    set_objectiveProgressStatus: function (value) {
        this.$5 = value;
        this.updateGlobalObjective();
        return value;
    },
    objectiveSatisfiedStatusFromGlobal: false,
    $6: false,
    get_objectiveSatisfiedStatus: function () {
        return this.$6;
    },
    set_objectiveSatisfiedStatus: function (value) {
        this.$6 = value;
        this.updateGlobalObjective();
        return value;
    },
    objectiveMeasureStatusFromGlobal: false,
    $7: false,
    get_objectiveMeasureStatus: function () {
        return this.$7;
    },
    set_objectiveMeasureStatus: function (value) {
        this.$7 = value;
        this.updateGlobalObjective();
        return value;
    },
    $8: 0,
    get_objectiveNormalizedMeasure: function () {
        return this.$8;
    },
    set_objectiveNormalizedMeasure: function (value) {
        this.$8 = value;
        this.updateGlobalObjective();
        return value;
    },
    $9: null,
    get_scoreRaw: function () {
        return this.$9;
    },
    set_scoreRaw: function (value) {
        this.$9 = value;
        this.updateGlobalObjective();
        return value;
    },
    $A: null,
    get_scoreMin: function () {
        return this.$A;
    },
    set_scoreMin: function (value) {
        this.$A = value;
        this.updateGlobalObjective();
        return value;
    },
    $B: null,
    get_scoreMax: function () {
        return this.$B;
    },
    set_scoreMax: function (value) {
        this.$B = value;
        this.updateGlobalObjective();
        return value;
    },
    setStatusStateToDictionary: function () {
        var $0 = {};
        $0['activityProgressStatus'] = this.activityProgressStatus;
        $0['attemptProgressStatus'] = this.get_attemptProgressStatus();
        $0['attemptCompletionStatus'] = this.get_attemptCompletionStatus();
        $0['attemptCompletionAmountStatus'] = this.attemptCompletionAmountStatus;
        $0['attemptCompletionAmount'] = this.get_attemptCompletionAmount();
        $0['attemptCount'] = this.attemptCount;
        $0['objectiveProgressStatus'] = this.get_objectiveProgressStatus();
        $0['objectiveSatisfiedStatus'] = this.get_objectiveSatisfiedStatus();
        $0['objectiveMeasureStatus'] = this.get_objectiveMeasureStatus();
        $0['objectiveNormalizedMeasure'] = this.get_objectiveNormalizedMeasure();
        $0['scoreRaw'] = this.get_scoreRaw();
        $0['scoreMin'] = this.get_scoreMin();
        $0['scoreMax'] = this.get_scoreMax();
        return $0;
    },
    setStatusStateFromDictionary: function (statusStateDictionary) {
        this.activityProgressStatus = statusStateDictionary['activityProgressStatus'];
        this.$2 = statusStateDictionary['attemptProgressStatus'];
        this.$3 = statusStateDictionary['attemptCompletionStatus'];
        this.attemptCompletionAmountStatus = statusStateDictionary['attemptCompletionAmountStatus'];
        this.$4 = statusStateDictionary['attemptCompletionAmount'];
        this.attemptCount = statusStateDictionary['attemptCount'];
        this.$5 = statusStateDictionary['objectiveProgressStatus'];
        this.$6 = statusStateDictionary['objectiveSatisfiedStatus'];
        this.$7 = statusStateDictionary['objectiveMeasureStatus'];
        this.$8 = statusStateDictionary['objectiveNormalizedMeasure'];
        this.$9 = statusStateDictionary['scoreRaw'];
        this.$A = statusStateDictionary['scoreMin'];
        this.$B = statusStateDictionary['scoreMax'];
    },
    updateGlobalObjective: function () {
        if (this.$0 == null || this.$1 == null || !this.$0.getSequencing().tracked || this.$0.mapInfos == null || !this.$0.getSequencing().getActivityTreeNode().getRoot().isGlobalObjectivesUpdateAvailable) {
            return;
        }
        var $0 = this.$0.getSequencing().getActivityTreeNode().getRoot().getRollupSet();
        var $1 = this.$0;
        var $dict1 = $1.mapInfos;
        for (var $key2 in $dict1) {
            var $2 = {
                key: $key2,
                value: $dict1[$key2]
            };
            var $3 = $2.key;
            var $4 = this.$1[$3];
            if (isNullOrUndefined($4)) {
                continue;
            }
            var $5 = ($2.value)['writeSatisfiedStatus'];
            if ($5) {
                $4.objectiveProgressStatus = $1.status.get_objectiveProgressStatus();
                $4.satisfiedStatus = $1.status.get_objectiveSatisfiedStatus();
            }
            var $6 = ($2.value)['writeNormalizedMeasure'];
            if ($6) {
                $4.measureStatus = $1.status.get_objectiveMeasureStatus();
                $4.normalizedMeasure = $1.status.get_objectiveNormalizedMeasure();
            }
            var $7 = ($2.value)['writeRawScore'];
            if ($7) {
                $4.scoreRaw = $1.status.get_scoreRaw();
            }
            var $8 = ($2.value)['writeMinScore'];
            if ($8) {
                $4.scoreMin = $1.status.get_scoreMin();
            }
            var $9 = ($2.value)['writeMaxScore'];
            if ($9) {
                $4.scoreMax = $1.status.get_scoreMax();
            }
            var $A = ($2.value)['writeProgressMeasure'];
            if ($A) {
                $4.progressMeasureStatus = $1.status.attemptCompletionAmountStatus;
                $4.progressMeasure = $1.status.get_attemptCompletionAmount();
            }
            var $B = ($2.value)['writeCompletionStatus'];
            if ($B) {
                $4.completionProgressStatus = $1.status.get_attemptProgressStatus();
                $4.completionStatus = $1.status.get_attemptCompletionStatus();
            }
            var $C = $4.objectives;
            if ($C == null) {
                continue;
            }
            var $enum3 = $C.getEnumerator();
            while ($enum3.moveNext()) {
                var $D = $enum3.get_current();
                if ($1 === $D) {
                    continue;
                }
                var $E = $D.mapInfos[$3];
                if ($1.mapInfos == null || isNullOrUndefined($E) || !$D.getSequencing().tracked) {
                    continue;
                }
                var $F = this.$0.getSequencing().getActivityTreeNode().getRoot().isGlobalObjectivesUpdateAvailable;
                this.$0.getSequencing().getActivityTreeNode().getRoot().isGlobalObjectivesUpdateAvailable = false;
                try {
                    var $10 = false;
                    if ($5 && $E['readSatisfiedStatus']) {
                        $10 = true;
                        $D.status.activityProgressStatus = true;
                        if ($4.objectiveProgressStatus) {
                            $D.status.objectiveSatisfiedStatusFromGlobal = true;
                            $D.status.set_objectiveProgressStatus($4.objectiveProgressStatus);
                            $D.status.set_objectiveSatisfiedStatus($4.satisfiedStatus);
                        } else {
                            $D.status.set_objectiveProgressStatus(false);
                            $D.status.set_objectiveSatisfiedStatus(false);
                        }
                    }
                    if ($6 && $E['readNormalizedMeasure']) {
                        $10 = true;
                        $D.status.activityProgressStatus = true;
                        if ($4.measureStatus) {
                            $D.status.objectiveMeasureStatusFromGlobal = true;
                            $D.status.set_objectiveMeasureStatus($4.measureStatus);
                            $D.status.set_objectiveNormalizedMeasure($4.normalizedMeasure);
                        } else {
                            $D.status.set_objectiveMeasureStatus(false);
                            $D.status.set_objectiveNormalizedMeasure(0);
                        }
                    }
                    if ($7 && $E['readRawScore']) {
                        $10 = true;
                        $D.status.set_scoreRaw($4.scoreRaw);
                    }
                    if ($8 && $E['readMinScore']) {
                        $10 = true;
                        $D.status.set_scoreMin($4.scoreMin);
                    }
                    if ($9 && $E['readMaxScore']) {
                        $10 = true;
                        $D.status.set_scoreMax($4.scoreMax);
                    }
                    if ($A && $E['readProgressMeasure']) {
                        $10 = true;
                        $D.status.attemptCompletionAmountFromGlobal = true;
                        $D.status.attemptCompletionAmountStatus = $4.progressMeasureStatus;
                        $D.status.set_attemptCompletionAmount($4.progressMeasure);
                    }
                    if ($B && $E['readCompletionStatus']) {
                        $10 = true;
                        $D.status.activityProgressStatus = true;
                        $D.status.attemptCompletionStatusFromGlobal = true;
                        $D.status.set_attemptCompletionStatus($4.completionStatus);
                        $D.status.set_attemptProgressStatus($4.completionProgressStatus);
                    }
                    if ($10 && !$0.contains($D.getSequencing().getActivityTreeNode())) {
                        $0.add($D.getSequencing().getActivityTreeNode());
                    }
                } finally {
                    this.$0.getSequencing().getActivityTreeNode().getRoot().isGlobalObjectivesUpdateAvailable = $F;
                }
            }
        }
    }
};
SCORM_1_3.SequencingObjective = function (sequencing) {
    this.$0 = sequencing;
    this.status = new SCORM_1_3.SequencingObjectiveStatus(this);
};
SCORM_1_3.SequencingObjective.prototype = {
    $0: null,
    objectiveID: null,
    satisfiedByMeasure: false,
    minNormalizedMeasure: 1,
    contributeToRollup: false,
    mapInfos: null,
    status: null,
    getSequencing: function () {
        return this.$0;
    }
};
SCORM_1_3.GlobalObjective = function () {
    this.objectives = [];
};
SCORM_1_3.GlobalObjective.prototype = {
    satisfiedStatus: false,
    objectiveProgressStatus: false,
    measureStatus: false,
    normalizedMeasure: 0,
    scoreRaw: null,
    scoreMin: null,
    scoreMax: null,
    completionStatus: false,
    completionProgressStatus: false,
    progressMeasureStatus: false,
    progressMeasure: null
};
SCORM_1_3.API_1484_11_LIB = function (activityTreeNode) {
    this.$2C = activityTreeNode;
    this.$2F = '';
    this.$30 = '0';
    this.$0 = {};
    this.$28 = {};
    this.$29 = {};
    this.$2A = {};
    this.$0 = {};
    this.$1 = '^[\\u0000-\\uFFFF]{0,250}$';
    this.$2 = '^[\\u0000-\\uFFFF]{0,1000}$';
    this.$3 = '^[\\u0000-\\uFFFF]{0,4000}$';
    this.$4 = '^[\\u0000-\\uFFFF]{0,64000}$';
    this.$5 = '^([a-zA-Z]{2,3}|i|x)(\-[a-zA-Z0-9\-]{2,8})?$|^$';
    this.$6 = '^(\{lang=([a-zA-Z]{2,3}|i|x)(\-[a-zA-Z0-9\-]{2,8})?\})?((?!\{lang=).{0,250}$)?';
    this.$7 = '^(\{lang=([a-zA-Z]{2,3}|i|x)(\-[a-zA-Z0-9\-]{2,8})?\})?((?!\{lang=).{0,4000}$)?';
    this.$8 = '^(19[7-9]{1}[0-9]{1}|20[0-2]{1}[0-9]{1}|203[0-8]{1})((-(0[1-9]{1}|1[0-2]{1}))((-(0[1-9]{1}|[1-2]{1}[0-9]{1}|3[0-1]{1}))(T([0-1]{1}[0-9]{1}|2[0-3]{1})((:[0-5]{1}[0-9]{1})((:[0-5]{1}[0-9]{1})((\\.[0-9]{1,2})((Z|([+|-]([0-1]{1}[0-9]{1}|2[0-3]{1})))(:[0-5]{1}[0-9]{1})?)?)?)?)?)?)?)?$';
    this.$9 = '^P(\\d+Y)?(\\d+M)?(\\d+D)?(T(((\\d+H)(\\d+M)?(\\d+(\.\\d{1,2})?S)?)|((\\d+M)(\\d+(\.\\d{1,2})?S)?)|((\\d+(\.\\d{1,2})?S))))?$';
    this.$A = '^\\d+$';
    this.$B = '^-?([0-9]+)$';
    this.$C = '^-?([0-9]{1,5})(\\.[0-9]{1,18})?$';
    this.$D = '^[\\w\.]{1,250}$';
    this.$E = '^\\S{0,4000}[a-zA-Z0-9]$';
    this.$F = '^.*$';
    this.$10 = '[._](\\d+).';
    this.$11 = '.N(\\d+).';
    this.$12 = '^completed$|^incomplete$|^not attempted$|^unknown$';
    this.$13 = '^passed$|^failed$|^unknown$';
    this.$14 = '^time-out$|^suspend$|^logout$|^normal$|^$';
    this.$15 = '^true-false$|^choice$|^(long-)?fill-in$|^matching$|^performance$|^sequencing$|^likert$|^numeric$|^other$';
    this.$16 = '^correct$|^incorrect$|^unanticipated$|^neutral$|^-?([0-9]{1,4})(\\.[0-9]{1,18})?$';
    this.$17 = '^previous$|^continue$|^exit$|^exitAll$|^abandon$|^abandonAll$|^suspendAll$|^{target=' + SCORM.BaseUtils.ncName + '}choice$|^{target=' + SCORM.BaseUtils.ncName + '}jump$|^_none_$';
    this.$18 = '^unknown$|^true$|^false$';
    this.$19 = '^previous$|^continue$|^choice.{target=' + SCORM.BaseUtils.ncName + '}$|^jump.{target=' + SCORM.BaseUtils.ncName + '}$';
    this.$1A = '_version, comments_from_learner, comments_from_lms, completion_status, credit, entry, exit, interactions, launch_data, learner_id, learner_name, learner_preference, location, max_time_allowed, mode, objectives, progress_measure, scaled_passing_score, score, session_time, success_status, suspend_data, time_limit_action, total_time';
    this.$1B = 'comment, timestamp, location';
    this.$1C = 'max, raw, scaled, min';
    this.$1D = 'progress_measure, completion_status, success_status, description, score, id';
    this.$1E = 'pattern';
    this.$1F = 'mastery_score, max_time_allowed, time_limit_action';
    this.$20 = 'audio_level, audio_captioning, delivery_speed, language';
    this.$21 = 'id, type, objectives, timestamp, correct_responses, weighting, learner_response, result, latency, description';
    this.$22 = 'id, store';
    this.$23 = '-1#1';
    this.$24 = '0#*';
    this.$25 = '0#*';
    this.$26 = '-1#1';
    this.$27 = '0#1';
    this.$28['true-false'] = {
        pre: '',
        format: '^true$|^false$',
        max: 1,
        delimiter: '',
        unique: false,
        empty: false
    };
    this.$28['choice'] = {
        pre: '',
        format: this.$D,
        max: 36,
        delimiter: '[,]',
        unique: true,
        empty: true
    };
    this.$28['fill-in'] = {
        pre: '^(\{(lang)=([^\}]+)\})',
        format: this.$6,
        max: 10,
        delimiter: '[,]',
        unique: false,
        empty: true
    };
    this.$28['long-fill-in'] = {
        pre: '^(\{(lang)=([^\}]+)\})',
        format: this.$7,
        max: 1,
        delimiter: '',
        unique: false,
        empty: true
    };
    this.$28['matching'] = {
        pre: '',
        format: this.$D,
        format2: this.$D,
        max: 36,
        delimiter: '[,]',
        delimiter2: '[.]',
        unique: false,
        empty: true
    };
    this.$28['performance'] = {
        pre: '',
        format: '^$|' + this.$D,
        format2: this.$C + '|^$|' + this.$1,
        max: 250,
        delimiter: '[,]',
        delimiter2: '[.]',
        unique: false,
        empty: false
    };
    this.$28['sequencing'] = {
        pre: '',
        format: this.$D,
        max: 36,
        delimiter: '[,]',
        unique: false,
        empty: true
    };
    this.$28['likert'] = {
        pre: '',
        format: this.$D,
        max: 1,
        delimiter: '',
        unique: false,
        empty: false
    };
    this.$28['numeric'] = {
        pre: '',
        format: this.$C,
        max: 1,
        delimiter: '',
        unique: false,
        empty: false
    };
    this.$28['other'] = {
        pre: '',
        format: this.$3,
        max: 1,
        delimiter: '',
        unique: false,
        empty: false
    };
    this.$29['true-false'] = {
        pre: '',
        max: 1,
        delimiter: '',
        unique: false,
        duplicate: false,
        format: '^true$|^false$',
        limit: 1,
        empty: false
    };
    this.$29['choice'] = {
        pre: '',
        max: 36,
        delimiter: '[,]',
        unique: true,
        duplicate: true,
        format: this.$D,
        empty: true
    };
    this.$29['fill-in'] = {
        pre: '^(\{(lang|case_matters|order_matters)=([^\}]+)\})',
        max: 10,
        delimiter: '[,]',
        unique: false,
        duplicate: false,
        format: this.$6,
        empty: true
    };
    this.$29['long-fill-in'] = {
        pre: '^(\{(lang|case_matters)=([^\}]+)\})',
        max: 1,
        delimiter: '',
        unique: false,
        duplicate: false,
        format: this.$7,
        empty: true
    };
    this.$29['matching'] = {
        pre: '',
        max: 36,
        delimiter: '[,]',
        delimiter2: '[.]',
        unique: false,
        duplicate: false,
        format: this.$D,
        format2: this.$D,
        empty: false
    };
    this.$29['performance'] = {
        pre: '^(\{(order_matters)=([^\}]+)\})',
        max: 250,
        delimiter: '[,]',
        delimiter2: '[.]',
        unique: false,
        duplicate: false,
        format: '^$|' + this.$D,
        format2: this.$C + '|^$|' + this.$1,
        empty: false
    };
    this.$29['sequencing'] = {
        pre: '',
        max: 36,
        delimiter: '[,]',
        unique: false,
        duplicate: true,
        format: this.$D,
        empty: true
    };
    this.$29['likert'] = {
        pre: '',
        max: 1,
        delimiter: '',
        unique: false,
        duplicate: false,
        format: this.$D,
        limit: 1,
        empty: false
    };
    this.$29['numeric'] = {
        pre: '',
        max: 2,
        delimiter: '[:]',
        unique: false,
        duplicate: false,
        format: this.$C,
        limit: 1,
        empty: false
    };
    this.$29['other'] = {
        pre: '',
        max: 1,
        delimiter: '',
        unique: false,
        duplicate: false,
        format: this.$3,
        limit: 1,
        empty: false
    };
    this.$2A['cmi._children'] = {
        defaultvalue: this.$1A,
        mod: 'r'
    };
    this.$2A['cmi._version'] = {
        defaultvalue: '1.0',
        mod: 'r'
    };
    this.$2A['cmi.comments_from_learner._children'] = {
        defaultvalue: this.$1B,
        mod: 'r'
    };
    this.$2A['cmi.comments_from_learner._count'] = {
        mod: 'r',
        defaultvalue: '0'
    };
    this.$2A['cmi.comments_from_learner.n.comment'] = {
        format: this.$7,
        mod: 'rw'
    };
    this.$2A['cmi.comments_from_learner.n.location'] = {
        format: this.$1,
        mod: 'rw'
    };
    this.$2A['cmi.comments_from_learner.n.timestamp'] = {
        format: this.$8,
        mod: 'rw'
    };
    this.$2A['cmi.comments_from_lms._children'] = {
        defaultvalue: this.$1B,
        mod: 'r'
    };
    this.$2A['cmi.comments_from_lms._count'] = {
        mod: 'r',
        defaultvalue: '0'
    };
    this.$2A['cmi.comments_from_lms.n.comment'] = {
        format: this.$7,
        mod: 'r'
    };
    this.$2A['cmi.comments_from_lms.n.location'] = {
        format: this.$1,
        mod: 'r'
    };
    this.$2A['cmi.comments_from_lms.n.timestamp'] = {
        format: this.$8,
        mod: 'r'
    };
    this.$2A['cmi.completion_status'] = {
        defaultvalue: 'unknown',
        format: this.$12,
        mod: 'rw'
    };
    this.$2A['cmi.completion_threshold'] = {
        defaultvalue: (activityTreeNode.isCompletedbymeasure()) ? activityTreeNode.getMinprogressmeasure() : null,
        mod: 'r'
    };
    this.$2A['cmi.credit'] = {
        defaultvalue: 'credit',
        mod: 'r'
    };
    this.$2A['cmi.entry'] = {
        defaultvalue: 'ab-initio',
        mod: 'r'
    };
    this.$2A['cmi.exit'] = {
        defaultvalue: '',
        format: this.$14,
        mod: 'w'
    };
    this.$2A['cmi.interactions._children'] = {
        defaultvalue: this.$21,
        mod: 'r'
    };
    this.$2A['cmi.interactions._count'] = {
        mod: 'r',
        defaultvalue: '0'
    };
    this.$2A['cmi.interactions.n.id'] = {
        pattern: this.$10,
        format: this.$E,
        mod: 'rw'
    };
    this.$2A['cmi.interactions.n.type'] = {
        pattern: this.$10,
        format: this.$15,
        mod: 'rw'
    };
    this.$2A['cmi.interactions.n.objectives._count'] = {
        pattern: this.$10,
        mod: 'r',
        defaultvalue: '0'
    };
    this.$2A['cmi.interactions.n.objectives.n.id'] = {
        pattern: this.$10,
        format: this.$E,
        mod: 'rw'
    };
    this.$2A['cmi.interactions.n.timestamp'] = {
        pattern: this.$10,
        format: this.$8,
        mod: 'rw'
    };
    this.$2A['cmi.interactions.n.correct_responses._count'] = {
        defaultvalue: '0',
        pattern: this.$10,
        mod: 'r'
    };
    this.$2A['cmi.interactions.n.correct_responses.n.pattern'] = {
        pattern: this.$10,
        format: 'CMIFeedback',
        mod: 'rw'
    };
    this.$2A['cmi.interactions.n.weighting'] = {
        pattern: this.$10,
        format: this.$C,
        mod: 'rw'
    };
    this.$2A['cmi.interactions.n.learner_response'] = {
        pattern: this.$10,
        format: 'CMIFeedback',
        mod: 'rw'
    };
    this.$2A['cmi.interactions.n.result'] = {
        pattern: this.$10,
        format: this.$16,
        mod: 'rw'
    };
    this.$2A['cmi.interactions.n.latency'] = {
        pattern: this.$10,
        format: this.$9,
        mod: 'rw'
    };
    this.$2A['cmi.interactions.n.description'] = {
        pattern: this.$10,
        format: this.$6,
        mod: 'rw'
    };
    this.$2A['cmi.launch_data'] = {
        defaultvalue: (activityTreeNode.getDatafromlms() == null) ? null : activityTreeNode.getDatafromlms(),
        mod: 'r'
    };
    this.$2A['cmi.learner_id'] = {
        defaultvalue: '',
        mod: 'r'
    };
    this.$2A['cmi.learner_name'] = {
        defaultvalue: '',
        mod: 'r'
    };
    this.$2A['cmi.learner_preference._children'] = {
        defaultvalue: this.$20,
        mod: 'r'
    };
    this.$2A['cmi.learner_preference.audio_level'] = {
        defaultvalue: '1',
        format: this.$C,
        range: this.$24,
        mod: 'rw'
    };
    this.$2A['cmi.learner_preference.language'] = {
        defaultvalue: '',
        format: this.$5,
        mod: 'rw'
    };
    this.$2A['cmi.learner_preference.delivery_speed'] = {
        defaultvalue: '1',
        format: this.$C,
        range: this.$25,
        mod: 'rw'
    };
    this.$2A['cmi.learner_preference.audio_captioning'] = {
        defaultvalue: '0',
        format: this.$B,
        range: this.$26,
        mod: 'rw'
    };
    this.$2A['cmi.location'] = {
        defaultvalue: null,
        format: this.$2,
        mod: 'rw'
    };
    this.$2A['cmi.max_time_allowed'] = {
        defaultvalue: (activityTreeNode.getSequencing() != null) ? activityTreeNode.getSequencing().limitConditions_attemptAbsoluteDurationLimit : null,
        mod: 'r'
    };
    this.$2A['cmi.mode'] = {
        defaultvalue: 'normal',
        mod: 'r'
    };
    this.$2A['cmi.objectives._children'] = {
        defaultvalue: this.$1D,
        mod: 'r'
    };
    this.$2A['cmi.objectives._count'] = {
        mod: 'r',
        defaultvalue: '0'
    };
    this.$2A['cmi.objectives.n.id'] = {
        pattern: this.$10,
        format: this.$E,
        mod: 'rw'
    };
    this.$2A['cmi.objectives.n.score._children'] = {
        defaultvalue: this.$1C,
        pattern: this.$10,
        mod: 'r'
    };
    this.$2A['cmi.objectives.n.score.scaled'] = {
        defaultvalue: null,
        pattern: this.$10,
        format: this.$C,
        range: this.$23,
        mod: 'rw'
    };
    this.$2A['cmi.objectives.n.score.raw'] = {
        defaultvalue: null,
        pattern: this.$10,
        format: this.$C,
        mod: 'rw'
    };
    this.$2A['cmi.objectives.n.score.min'] = {
        defaultvalue: null,
        pattern: this.$10,
        format: this.$C,
        mod: 'rw'
    };
    this.$2A['cmi.objectives.n.score.max'] = {
        defaultvalue: null,
        pattern: this.$10,
        format: this.$C,
        mod: 'rw'
    };
    this.$2A['cmi.objectives.n.success_status'] = {
        defaultvalue: 'unknown',
        pattern: this.$10,
        format: this.$13,
        mod: 'rw'
    };
    this.$2A['cmi.objectives.n.completion_status'] = {
        defaultvalue: 'unknown',
        pattern: this.$10,
        format: this.$12,
        mod: 'rw'
    };
    this.$2A['cmi.objectives.n.progress_measure'] = {
        defaultvalue: null,
        format: this.$C,
        range: this.$27,
        mod: 'rw'
    };
    this.$2A['cmi.objectives.n.description'] = {
        pattern: this.$10,
        format: this.$6,
        mod: 'rw'
    };
    this.$2A['cmi.progress_measure'] = {
        defaultvalue: null,
        format: this.$C,
        range: this.$27,
        mod: 'rw'
    };
    this.$2A['cmi.scaled_passing_score'] = {
        defaultvalue: (activityTreeNode.getSequencing() != null && activityTreeNode.getSequencing().getPrimaryObjective() != null && activityTreeNode.getSequencing().getPrimaryObjective().satisfiedByMeasure) ? activityTreeNode.getSequencing().getPrimaryObjective().minNormalizedMeasure : null,
        format: this.$C,
        range: this.$23,
        mod: 'r'
    };
    this.$2A['cmi.score._children'] = {
        defaultvalue: this.$1C,
        mod: 'r'
    };
    this.$2A['cmi.score.scaled'] = {
        defaultvalue: null,
        format: this.$C,
        range: this.$23,
        mod: 'rw'
    };
    this.$2A['cmi.score.raw'] = {
        defaultvalue: null,
        format: this.$C,
        mod: 'rw'
    };
    this.$2A['cmi.score.min'] = {
        defaultvalue: null,
        format: this.$C,
        mod: 'rw'
    };
    this.$2A['cmi.score.max'] = {
        defaultvalue: null,
        format: this.$C,
        mod: 'rw'
    };
    this.$2A['cmi.session_time'] = {
        defaultvalue: null,
        format: this.$9,
        mod: 'w',
        defaultvalue: 'PT0H0M0S'
    };
    this.$2A['cmi.success_status'] = {
        defaultvalue: 'unknown',
        format: this.$13,
        mod: 'rw'
    };
    this.$2A['cmi.suspend_data'] = {
        defaultvalue: null,
        format: this.$4,
        mod: 'rw'
    };
    this.$2A['cmi.time_limit_action'] = {
        defaultvalue: (activityTreeNode.getTimelimitaction() == null) ? 'continue,no message' : activityTreeNode.getTimelimitaction(),
        mod: 'r'
    };
    this.$2A['cmi.total_time'] = {
        defaultvalue: 'PT0H',
        mod: 'r'
    };
    this.$2A['adl.data._children'] = {
        defaultvalue: this.$22,
        mod: 'r'
    };
    this.$2A['adl.data._count'] = {
        mod: 'r',
        defaultvalue: '0'
    };
    this.$2A['adl.data.n.id'] = {
        pattern: this.$10,
        format: this.$E,
        mod: 'r'
    };
    this.$2A['adl.data.n.store'] = {
        format: this.$4,
        mod: 'rw',
        mod2: 'shared'
    };
    this.$2A['adl.nav.request'] = {
        defaultvalue: '_none_',
        format: this.$17,
        mod: 'rw'
    };
    var $0 = this.$2C.getDataTree();
    if (this.$2C.getDataTreeValue('cmi.exit') === 'suspend') {
        this.$2C.setDataTreeValue('cmi.exit', '', false);
    } else if (!isNullOrUndefined($0) && Object.getKeyCount($0) > 0) {
        var $1 = $0['cmi.suspend_data'];
        if (!isNullOrUndefined($1) && ($1['setbysco'])) {
            $1['setbysco'] = false;
        }
        var $dict1 = $0;
        for (var $key2 in $dict1) {
            var $2 = {
                key: $key2,
                value: $dict1[$key2]
            };
            var $3 = $2.value;
            if ($3['setbysco']) {
                delete $0[$2.key];
            }
        }
    }
    var $dict3 = this.$2A;
    for (var $key4 in $dict3) {
        var $4 = {
            key: $key4,
            value: $dict3[$key4]
        };
        if ($4.key.match(new RegExp(/\.n\./)) == null) {
            if (isUndefined(this.$2C.getDataTreeValue($4.key))) {
                if (!isUndefined((Type.safeCast($4.value, Object))['defaultvalue'])) {
                    this.$2C.setDataTreeValue($4.key, (Type.safeCast($4.value, Object))['defaultvalue'], false);
                } else {
                    this.$2C.setDataTreeValue($4.key, '', false);
                }
            }
        }
    }
    if (this.$2C.getRoot() != null && this.$2C.getRoot().isSharedDataGlobalToSystem()) {
        this.$2B = this.$2C.getRoot().getADLCPData();
    } else {
        this.$2B = this.$2C.getADLCPData();
    } if (this.$2B != null) {
        this.$2C.setDataTreeValue('adl.data._count', Object.getKeyCount(this.$2B).toString(), false);
        var $dict5 = this.$2B;
        for (var $key6 in $dict5) {
            var $5 = {
                key: $key6,
                value: $dict5[$key6]
            };
            var $6 = ($5.value)['n'];
            if (isUndefined(this.$2C.getDataTreeValue('adl.data.' + $6 + '.id'))) {
                this.$2C.setDataTreeValue('adl.data.' + $6 + '.id', $5.key, false);
                this.$2C.setDataTreeValue('adl.data.' + $6 + '.store', ($5.value)['store'], false);
            }
        }
    }
    if (activityTreeNode.getSequencing() != null) {
        if (this.$2C.getSequencing().getPrimaryObjective() != null && this.$2C.getDataTreeValue('cmi.objectives._count') === '0') {
            for (var $7 = 0; $7 < this.$2C.getSequencing().getObjectivesCount(); $7++) {
                var $8 = this.$2C.getSequencing().getObjectiveByIndex($7);
                this.$33('cmi.objectives', $7.toString());
                this.$2C.setDataTreeValue('cmi.objectives.' + $7 + '.id', $8.objectiveID, false);
                var $9 = $8.status;
                if ($9.get_objectiveProgressStatus()) {
                    this.$2C.setDataTreeValue('cmi.objectives.' + $7 + '.success_status', ($9.get_objectiveSatisfiedStatus()) ? 'passed' : 'failed', false);
                }
                if ($9.get_objectiveMeasureStatus()) {
                    this.$2C.setDataTreeValue('cmi.objectives.' + $7 + '.score.scaled', $9.get_objectiveNormalizedMeasure().toString(), false);
                }
                if ($9.get_attemptProgressStatus()) {
                    this.$2C.setDataTreeValue('cmi.objectives.' + $7 + '.completion_status', ($9.get_attemptCompletionStatus()) ? 'completed' : 'incomplete', false);
                }
                if ($9.attemptCompletionAmountStatus) {
                    this.$2C.setDataTreeValue('cmi.objectives.' + $7 + '.progress_measure', $9.get_attemptCompletionAmount().toString(), false);
                }
            }
            this.$2C.setDataTreeValue('cmi.objectives._count', this.$2C.getSequencing().getObjectivesCount().toString(), false);
        }
    }
    this.$2C.setDataTreeValue('adl.nav.request', '_none_', false);
    this.$2D = false;
    this.$2E = false;
};
SCORM_1_3.API_1484_11_LIB.prototype = {
    $0: null,
    $1: null,
    $2: null,
    $3: null,
    $4: null,
    $5: null,
    $6: null,
    $7: null,
    $8: null,
    $9: null,
    $A: null,
    $B: null,
    $C: null,
    $D: null,
    $E: null,
    $F: null,
    $10: null,
    $11: null,
    $12: null,
    $13: null,
    $14: null,
    $15: null,
    $16: null,
    $17: null,
    $18: null,
    $19: null,
    $1A: null,
    $1B: null,
    $1C: null,
    $1D: null,
    $1E: null,
    $1F: null,
    $20: null,
    $21: null,
    $22: null,
    $23: null,
    $24: null,
    $25: null,
    $26: null,
    $27: null,
    $28: null,
    $29: null,
    $2A: null,
    $2B: null,
    $2C: null,
    $2D: false,
    $2E: false,
    $2F: null,
    $30: null,
    $31: 0,
    getActivityTreeNode: function () {
        return this.$2C;
    },
    Initialize: function (param) {
        this.$30 = '0';
        this.$2F = '';
        if (isNullOrUndefined(param)) {
            param = '';
        }
        if (param === '') {
            if ((!this.$2D) && (!this.$2E)) {
                this.$2D = true;
                this.$30 = '0';
                if (this.$2C.getSequencing() != null) {
                    this.$2C.getSequencing().status.activityProgressStatus = true;
                }
                this.$2C.setDataTreeValue('cmi.session_time', (this.$2A['cmi.session_time'])['defaultvalue'], false);
                this.$31 = new Date().getTime();
                SCORM.LOG.displayMessage('Initialize with param: \'' + param + '\'', this.$30, this.$32(this.$30));
                if(configInstance.setFinishToLMS)utilsInstance.SetCookie('initialize','{"scormData":"true"}');
                return 'true';
            } else {
                if (this.$2D) {
                    this.$30 = '103';
                } else {
                    this.$30 = '104';
                }
            }
        } else {
            this.$30 = '201';
            this.$2F = 'The parameter passed into the Initialize() API method shall be an empty characterstring (\'\').';
        }
        SCORM.LOG.displayMessage('Initialize with param: \'' + param + '\'', this.$30, this.$32(this.$30));
        if(configInstance.setFinishToLMS)utilsInstance.SetCookie('initialize','{"scormData":"false"}');
        return 'false';
    },
    Terminate: function (param) {
        this.$30 = '0';
        this.$2F = '';
        if (isNullOrUndefined(param)) {
            param = '';
        }
        if (param === '') {
            if (this.$2D && (!this.$2E)) {
                SCORM.LOG.displayMessage('Terminate with param: \'' + param + '\'', this.$30, this.$32(this.$30));
                this.$2D = false;
                this.$2E = true;
                var $0 = this.$2C.getDataTreeValue('adl.nav.request');
                var $1 = false;
                if (this.$2C.getDataTreeValue('cmi.exit') === 'suspend' || $0 === 'suspendAll') {
                    this.$2C.setDataTreeValue('cmi.entry', 'resume', false);
                    $1 = true;
                } else if (this.$2C.getDataTreeValue('cmi.exit') === 'logout') {
                    this.$2C.setDataTreeValue('cmi.entry', 'ab-initio', false);
                } else {
                    this.$2C.setDataTreeValue('cmi.entry', '', false);
                } if (this.$2C.getDataTreeValue('cmi.session_time') === (this.$2A['cmi.session_time'])['defaultvalue']) {
                    this.$2C.setDataTreeValue('cmi.session_time', SCORM_1_3.Utils.getTimeInterval(new Date().getTime() - this.$31), false);
                }
                this.$2C.setDataTreeValue('cmi.total_time', SCORM_1_3.Utils.addTime(this.$2C.getDataTreeValue('cmi.total_time'), this.$2C.getDataTreeValue('cmi.session_time')), false);
                if (this.$2C.getRoot() != null) {
                    if (this.$2C.getRoot().isSharedDataGlobalToSystem() && this.$2B != null) {
                        var $dict1 = this.$2B;
                        for (var $key2 in $dict1) {
                            var $2 = {
                                key: $key2,
                                value: $dict1[$key2]
                            };
                            var $3 = this.$2C.getDataTreeValue('adl.data.' + ($2.value)['n'] + '.store');
                            if (!isNullOrUndefined($3)) {
                                ($2.value)['store'] = $3;
                            }
                        }
                    }
                    if ($0 !== 'abandonAll' && $0 !== 'abandon') {
                        this.$2C.updateSequencingState();
                    }
                    if ($1) {
                        this.$2C.getRoot().savedSuspendedActivity = this.$2C;
                        this.$2C.set_isSuspended(true);
                    }
                    this.$2C.getRoot().onEventSCO(new SCORM.BaseActivityTreeNodeEventArgs(this.$2C, 1));
                }
                if (!$1) {
                    this.$2C.cleanDataTree();
                }
                if (this.$2C.getRoot() != null) {
                    this.$2C.getRoot().requestNavigation($0);
                    var $4 = this.$2C.getRoot().getStoredStatuses();
                    var $dict3 = this.$2C.getRoot().getActivityTreeNodes();
                    for (var $key4 in $dict3) {
                        var $6 = {
                            key: $key4,
                            value: $dict3[$key4]
                        };
                        var $7 = $6.value;
                        $4[$6.key] = $7.getSequencing().status.setStatusStateToDictionary();
                    }
                    this.$2C.getRoot().onEventSCO(new SCORM.BaseActivityTreeNodeEventArgs(this.$2C, 0));
                    if (this.$2C.getRoot().get_isAbandoned()) {
                        this.$2C.getRoot().set_isAbandoned(false);
                    }
                    if (this.$2C.get_isAbandoned()) {
                        this.$2C.set_isAbandoned(false);
                    }
                }
                if(configInstance.setFinishToLMS)utilsInstance.SetCookie('finish','{"scormData":"true"}');
                return 'true';
            } else {
                if (this.$2E) {
                    this.$30 = '113';
                } else {
                    this.$30 = '112';
                }
            }
        } else {
            this.$30 = '201';
        }
        SCORM.LOG.displayMessage('Terminate with param: \'' + param + '\'', this.$30, this.$32(this.$30));
        if(configInstance.setFinishToLMS)utilsInstance.SetCookie('finish','{"scormData":"false"}');
        return 'false';
    },
    GetValue: function (element) {
        this.$30 = '0';
        this.$2F = '';
        if (this.$2D && (!this.$2E)) {
            if (isNullOrUndefined(element)) {
                element = '';
            }
            if (element !== '') {
                var $0 = new RegExp(this.$10, 'g');
                var $1 = element.replace($0, '.n.');
                if (!isUndefined(this.$2A[$1])) {
                    if ((Type.safeCast(this.$2A[$1], Object))['mod'] !== 'w') {
                        element = element.replace($0, '.$1.');
                        if ((Type.safeCast(this.$2A[$1], Object))['mod2'] === 'shared') {
                            var $2 = element.split('.');
                            if (this.$2B != null && !isNullOrUndefined($2) && $2.length > 3) {
                                var $dict1 = this.$2B;
                                for (var $key2 in $dict1) {
                                    var $3 = {
                                        key: $key2,
                                        value: $dict1[$key2]
                                    };
                                    var $4 = ($3.value)['n'];
                                    if ($4 === $2[2]) {
                                        if (($3.value)['sco'] !== this.$2C.getIdentifier()) {
                                            if (!($3.value)['readSharedData']) {
                                                this.$30 = '405';
                                            }
                                        }
                                        break;
                                    }
                                }
                            }
                        }
                        if (this.$30 === '0') {
                            var $5 = this.$2C.getDataTreeValue(element);
                            if (!isNullOrUndefined($5)) {
                                this.$30 = '0';
                                SCORM.LOG.displayMessage('GetValue ' + element + ', \'' + $5 + '\'', this.$30, this.$32(this.$30));
                                return $5;
                            } else if (isNull($5)) {
                                this.$30 = '403';
                            } else {
                                this.$30 = '301';
                            }
                        }
                    } else {
                        this.$30 = '405';
                    }
                } else {
                    var $6 = '._children';
                    var $7 = '._count';
                    var $8 = '';
                    if ($1.substr($1.length - $6.length, $1.length) === $6) {
                        $8 = $1.substr(0, $1.length - $6.length);
                        if (!isUndefined(this.$2A[$8])) {
                            this.$30 = '301';
                            this.$2F = 'Data Model Element Does Not Have Children';
                        } else {
                            this.$30 = '401';
                        }
                    } else if ($1.substr($1.length - $7.length, $1.length) === $7) {
                        $8 = $1.substr(0, $1.length - $7.length);
                        if (!isUndefined(this.$2A[$8])) {
                            this.$30 = '301';
                            this.$2F = 'Data Model Element Cannot Have Count';
                        } else {
                            this.$30 = '401';
                        }
                    } else {
                        $8 = 'adl.nav.request_valid.';
                        if (element.substr(0, $8.length) === $8) {
                            if (element.substr($8.length).match(new RegExp(this.$19)) == null) {
                                this.$30 = '301';
                            } else {
                                this.$30 = '0';
                                var $9 = 'unknown';
                                if (this.$2C.getRoot() != null) {
                                    $9 = (this.$2C.getRoot().isValidNavigationRequest(element.substr($8.length), true)) ? 'true' : 'false';
                                }
                                SCORM.LOG.displayMessage('GetValue ' + element + ', \'' + $9 + '\'', '0', null);
                                return $9;
                            }
                        } else {
                            this.$30 = '401';
                        }
                    }
                }
            } else {
                this.$30 = '301';
            }
        } else {
            if (this.$2E) {
                this.$30 = '123';
            } else {
                this.$30 = '122';
            }
        }
        SCORM.LOG.displayMessage('GetValue ' + element + ', \'\'', this.$30, this.$32(this.$30));
        return '';
    },
    SetValue: function (element, value) {
        this.$30 = '0';
        this.$2F = '';
        if (this.$2D && (!this.$2E)) {
            if (isNullOrUndefined(element)) {
                element = '';
            }
            if (element !== '') {
                if (isNullOrUndefined(value)) {
                    value = '';
                }
                var $0 = new RegExp(this.$10, 'g');
                var $1 = element.replace($0, '.n.');
                if (!isUndefined(this.$2A[$1])) {
                    if ((Type.safeCast(this.$2A[$1], Object))['mod'] !== 'r') {
                        var $2 = (Type.safeCast(this.$2A[$1], Object))['format'];
                        if ($2 !== 'CMIFeedback') {
                            $0 = new RegExp($2);
                        } else {
                            $0 = new RegExp(this.$F);
                        }
                        value = value + '';
                        if ((Type.safeCast(this.$2A[$1], Object))['mod2'] === 'shared') {
                            var $3 = element.split('.');
                            if (this.$2B != null && !isNullOrUndefined($3) && $3.length > 3) {
                                var $dict1 = this.$2B;
                                for (var $key2 in $dict1) {
                                    var $4 = {
                                        key: $key2,
                                        value: $dict1[$key2]
                                    };
                                    var $5 = ($4.value)['n'];
                                    if ($5 === $3[2]) {
                                        if (($4.value)['sco'] !== this.$2C.getIdentifier()) {
                                            if (!($4.value)['writeSharedData']) {
                                                this.$30 = '404';
                                            }
                                        }
                                        break;
                                    }
                                }
                            }
                        }
                        if (this.$30 === '0') {
                            var $6 = value.match($0);
                            if (($6 != null) && (($6.join('').length > 0) || (value.length === 0))) {
                                if ($2 === this.$7 || $2 === this.$6) {
                                    if ($6.length >= 3 && !isNullOrUndefined($6[2]) && $6[2].length > 0 && $6[2] !== 'x' && $6[2] !== 'i' && isUndefined(this.$0[$6[2].toLowerCase()])) {
                                        this.$30 = '406';
                                    }
                                } else if ($2 === this.$5) {
                                    if ($6.length >= 2 && !isNullOrUndefined($6[1]) && $6[1].length > 0 && $6[1] !== 'x' && $6[1] !== 'i' && isUndefined(this.$0[$6[1].toLowerCase()])) {
                                        this.$30 = '406';
                                    }
                                } else if ($2 === this.$8) {
                                    if ($6.length >= 8 && parseInt($6[7]) > SCORM_1_3.Utils.daysInMonth(parseInt($6[4]), parseInt($6[1]))) {
                                        this.$30 = '406';
                                    }
                                }
                                if (this.$30 === '0' && element !== $1) {
                                    var $7 = element.split('.');
                                    var $8 = $7[0];
                                    var $9 = $7[0];
                                    var $A = false;
                                    for (var $B = 1;
                                         ($B < $7.length - 1) && (this.$30 === '0'); $B++) {
                                        var $C = $7[$B];
                                        var $D = $7[$B + 1].match(new RegExp(/^\d+$/));
                                        if ($D != null && $D.length > 0) {
                                            if ((parseInt($7[$B + 1]) > 0) && ($7[$B + 1].charAt(0) === '0')) {
                                                this.$30 = '351';
                                            }
                                            $9 = $8 + '.' + $C;
                                            if (isUndefined(this.$2C.getDataTreeValue($9 + '._count'))) {
                                                this.$30 = '408';
                                            } else {
                                                if (isUndefined(this.$2C.getDataTreeValue($8 + '.' + $C + '._count'))) {
                                                    this.$2C.setDataTreeValue($8 + '.' + $C + '._count', '0', false);
                                                    $A = true;
                                                } else if (parseInt($7[$B + 1]) === parseInt(this.$2C.getDataTreeValue($8 + '.' + $C + '._count'))) {
                                                    $A = true;
                                                } else if (parseInt($7[$B + 1]) > parseInt(this.$2C.getDataTreeValue($9 + '._count'))) {
                                                    this.$30 = '351';
                                                    this.$2F = 'Data Model Element Collection Set Out Of Order';
                                                }
                                                $8 = $8 + '.' + $C + '.' + $7[$B + 1];
                                                $B++;
                                            }
                                        } else {
                                            $8 = $8 + '.' + $C;
                                        }
                                    }
                                    if (this.$30 === '0') {
                                        element = $8 + '.' + $7[$7.length - 1];
                                        if ($A) {
                                            switch ($1) {
                                                case 'cmi.objectives.n.id':
                                                    if (!this.$34(element, $9, value)) {
                                                        if ($7[$7.length - 2] === this.$2C.getDataTreeValue($9 + '._count')) {
                                                            this.$33($9, $7[$7.length - 2]);
                                                        }
                                                    } else {
                                                        this.$30 = '351';
                                                        this.$2F = 'Data Model Element ID Already Exists';
                                                    }
                                                    break;
                                                case 'cmi.interactions.n.id':
                                                    this.$33($9, $7[$7.length - 2]);
                                                    break;
                                                case 'cmi.interactions.n.objectives.n.id':
                                                    if (!isUndefined(this.$2C.getDataTreeValue($9 + '._count'))) {
                                                        if (!this.$34(element, $9, value)) {
                                                            if ($7[$7.length - 2] === this.$2C.getDataTreeValue($9 + '._count')) {
                                                                this.$2C.setDataTreeValue($9 + '._count', (parseInt(this.$2C.getDataTreeValue($9 + '._count')) + 1).toString(), false);
                                                            }
                                                        } else {
                                                            this.$30 = '351';
                                                            this.$2F = 'Data Model Element ID Already Exists';
                                                        }
                                                    } else {
                                                        this.$30 = '408';
                                                    }
                                                    break;
                                                case 'cmi.interactions.n.correct_responses.n.pattern':
                                                    if (!isUndefined(this.$2C.getDataTreeValue($9 + '._count'))) {
                                                        if ($7[$7.length - 2] === this.$2C.getDataTreeValue($9 + '._count')) {
                                                            var $E = this.$2C.getDataTreeValue($9.replace('correct_responses', 'type'));
                                                            if (isNullOrUndefined($E)) {
                                                                this.$30 = '408';
                                                                break;
                                                            }
                                                            if (isUndefined((this.$29[$E])['limit']) || parseInt(this.$2C.getDataTreeValue($9 + '._count')) < parseInt((this.$29[$E])['limit'])) {
                                                                this.$30 = this.$36(element, $E, value, this.$29[$E]);
                                                                if (this.$30 === '0' && (!((this.$29[$E])['duplicate']) || (!this.$35(element, $9, value))) || (this.$30 === '0' && value === '')) {
                                                                    this.$2C.setDataTreeValue($9 + '._count', (parseInt(this.$2C.getDataTreeValue($9 + '._count')) + 1).toString(), false);
                                                                } else {
                                                                    if (this.$30 === '0') {
                                                                        this.$30 = '351';
                                                                        this.$2F = 'Data Model Element Pattern Already Exists';
                                                                    }
                                                                }
                                                            } else {
                                                                this.$30 = '351';
                                                                this.$2F = 'Data Model Element Collection Limit Reached';
                                                            }
                                                        } else {
                                                            this.$30 = '351';
                                                            this.$2F = 'Data Model Element Collection Set Out Of Order';
                                                        }
                                                    } else {
                                                        this.$30 = '408';
                                                    }
                                                    break;
                                                default:
                                                    if (($9 !== 'cmi.objectives') && ($9 !== 'cmi.interactions') && ($9 !== 'adl.data')) {
                                                        this.$33($9, $7[$7.length - 2]);
                                                    } else {
                                                        this.$30 = '408';
                                                    }
                                                    break;
                                            }
                                        } else {
                                            switch ($1) {
                                                case 'cmi.objectives.n.id':
                                                    if (this.$2C.getDataTreeValue(element) !== value) {
                                                        this.$30 = '351';
                                                        this.$2F = 'Write Once Violation';
                                                    }
                                                    break;
                                                case 'cmi.interactions.n.objectives.n.id':
                                                    if (this.$34(element, $9, value)) {
                                                        this.$30 = '351';
                                                        this.$2F = 'Data Model Element ID Already Exists';
                                                    }
                                                    break;
                                                case 'cmi.interactions.n.learner_response':
                                                    var $F = this.$2C.getDataTreeValue($8 + '.type');
                                                    if (isNullOrUndefined($F)) {
                                                        this.$30 = '408';
                                                    } else {
                                                        this.$30 = this.$36(element, $F, value, this.$28[$F]);
                                                    }
                                                    break;
                                                case 'cmi.interactions.n.correct_responses.n.pattern':
                                                    var $10 = $8.split('.');
                                                    var $11 = 'cmi.interactions.' + $10[2];
                                                    var $12 = this.$2C.getDataTreeValue($11 + '.type');
                                                    if (isNullOrUndefined(this.$2C.getDataTreeValue($11 + '.type'))) {
                                                        this.$30 = '408';
                                                    } else {
                                                        if (isUndefined((this.$29[$12])['limit']) || parseInt(this.$2C.getDataTreeValue($9 + '._count')) <= parseInt((this.$29[$12])['limit'])) {
                                                            this.$30 = this.$36(element, $12, value, this.$29[$12]);
                                                            if (this.$30 === '0' && (this.$29[$12])['duplicate'] && this.$35(element, $9, value)) {
                                                                this.$30 = '351';
                                                                this.$2F = 'Data Model Element Pattern Already Exists';
                                                            }
                                                        } else {
                                                            this.$30 = '351';
                                                            this.$2F = 'Data Model Element Collection Limit Reached';
                                                        }
                                                    }
                                                    break;
                                            }
                                        }
                                    }
                                }
                                if (this.$30 === '0') {
                                    if (!isUndefined((this.$2A[$1])['range'])) {
                                        var $13 = (this.$2A[$1])['range'];
                                        var $14 = $13.split('#');
                                        var $15 = parseFloat(value) * 1;
                                        if ($15 >= parseFloat($14[0])) {
                                            if (($14[1] === '*') || ($15 <= parseFloat($14[1]))) {
                                                this.$2C.setDataTreeValue(element, $15.toString(), true);
                                                this.$30 = '0';
                                                SCORM.LOG.displayMessage('SetValue ' + element + ', \'' + value + '\'', this.$30, this.$32(this.$30));
                                                return 'true';
                                            } else {
                                                this.$30 = '407';
                                            }
                                        } else {
                                            this.$30 = '407';
                                        }
                                    } else {
                                        this.$2C.setDataTreeValue(element, value, true);
                                        this.$30 = '0';
                                        SCORM.LOG.displayMessage('SetValue ' + element + ', \'' + value + '\'', this.$30, this.$32(this.$30));
                                        return 'true';
                                    }
                                }
                            } else {
                                this.$30 = '406';
                            }
                        }
                    } else {
                        this.$30 = '404';
                    }
                } else {
                    var $16 = 'adl.nav.request_valid.';
                    if (element.substr(0, $16.length) === $16) {
                        this.$30 = '404';
                    } else {
                        this.$30 = '401';
                    }
                }
            } else {
                this.$30 = '351';
            }
        } else {
            if (this.$2E) {
                this.$30 = '133';
            } else {
                this.$30 = '132';
            }
        }
        SCORM.LOG.displayMessage('SetValue ' + element + ', \'' + value + '\'', this.$30, this.$32(this.$30));
        return 'false';
    },
    Commit: function (param) {
        this.$30 = '0';
        this.$2F = '';
        if (isNullOrUndefined(param)) {
            param = '';
        }
        if (param === '') {
            if (this.$2D && (!this.$2E)) {
                if (this.getActivityTreeNode().getRoot() != null) {
                    this.$2C.getRoot().onEventSCO(new SCORM.BaseActivityTreeNodeEventArgs(this.$2C, 1));
                }
                SCORM.LOG.displayMessage('Commit with param: \'' + param + '\'', this.$30, this.$32(this.$30));
                return 'true';
            } else {
                if (this.$2E) {
                    this.$30 = '143';
                } else {
                    this.$30 = '142';
                }
            }
        } else {
            this.$30 = '201';
        }
        SCORM.LOG.displayMessage('Commit with param: \'' + param + '\'', this.$30, this.$32(this.$30));
        return 'false';
    },
    GetLastError: function () {
        SCORM.LOG.displayMessage('GetLastError, Error Code: ' + this.$30, '0', null);
        return this.$30;
    },
    GetErrorString: function (param) {
        if (param !== '') {
            var $0 = this.$32(param);
            if (!isNullOrUndefined($0)) {
                SCORM.LOG.displayMessage('GetErrorString with param: \'' + param + '\', Error String: ' + $0, '0', null);
                return $0;
            }
        }
        SCORM.LOG.displayMessage('GetErrorString with param: \'' + param + '\', No error string found!', '0', null);
        return '';
    },
    $32: function ($p0) {
        var objAPIErrorCodes = {};
        objAPIErrorCodes['0'] = 'No Error';
        objAPIErrorCodes['101'] = 'General Exception';
        objAPIErrorCodes['102'] = 'General Inizialization Failure';
        objAPIErrorCodes['103'] = 'Already Initialized';
        objAPIErrorCodes['104'] = 'Content Instance Terminated';
        objAPIErrorCodes['111'] = 'General Termination Failure';
        objAPIErrorCodes['112'] = 'Termination Before Inizialization';
        objAPIErrorCodes['113'] = 'Termination After Termination';
        objAPIErrorCodes['122'] = 'Retrieve Data Before Initialization';
        objAPIErrorCodes['123'] = 'Retrieve Data After Termination';
        objAPIErrorCodes['132'] = 'Store Data Before Inizialization';
        objAPIErrorCodes['133'] = 'Store Data After Termination';
        objAPIErrorCodes['142'] = 'Commit Before Inizialization';
        objAPIErrorCodes['143'] = 'Commit After Termination';
        objAPIErrorCodes['201'] = 'General Argument Error';
        objAPIErrorCodes['301'] = 'General Get Failure';
        objAPIErrorCodes['351'] = 'General Set Failure';
        objAPIErrorCodes['391'] = 'General Commit Failure';
        objAPIErrorCodes['401'] = 'Undefinited Data Model Element';
        objAPIErrorCodes['402'] = 'Unimplemented Data Model Element';
        objAPIErrorCodes['403'] = 'Data Model Element Value Not Initialized';
        objAPIErrorCodes['404'] = 'Data Model Element Is Read Only';
        objAPIErrorCodes['405'] = 'Data Model Element Is Write Only';
        objAPIErrorCodes['406'] = 'Data Model Element Type Mismatch';
        objAPIErrorCodes['407'] = 'Data Model Element Value Out Of Range';
        objAPIErrorCodes['408'] = 'Data Model Dependency Not Established';
        if (!isUndefined(objAPIErrorCodes[$p0])) {
            return objAPIErrorCodes[$p0];
        } else {
            return null;
        }
    },
    GetDiagnostic: function (param) {
        if (isNullOrUndefined(param)) {
            param = '';
        }
        if (param === '') {
            param = this.$30;
            if (this.$2F !== '') {
                SCORM.LOG.displayMessage('GetDiagnostic with param: \'' + param + '\' Diagnostic: ' + this.$2F, '0', null);
                return this.$2F;
            }
        }
        SCORM.LOG.displayMessage('GetDiagnostic with param: \'' + param + '\'', '0', null);
        return this.GetErrorString(param);
    },
    $33: function ($p0, $p1) {
        if ($p1 === this.$2C.getDataTreeValue($p0 + '._count')) {
            this.$2C.setDataTreeValue($p0 + '._count', (parseInt(this.$2C.getDataTreeValue($p0 + '._count')) + 1).toString(), false);
            var $dict1 = this.$2A;
            for (var $key2 in $dict1) {
                var $0 = {
                    key: $key2,
                    value: $dict1[$key2]
                };
                if ($0.key.startsWith($p0 + '.n.')) {
                    if (!isUndefined((Type.safeCast($0.value, Object))['defaultvalue'])) {
                        this.$2C.setDataTreeValue($p0 + '.' + $p1 + $0.key.substr(($p0 + '.n.').length - 1), (Type.safeCast($0.value, Object))['defaultvalue'], false);
                    } else {
                        this.$2C.setDataTreeValue($p0 + '.' + $p1 + $0.key.substr(($p0 + '.n.').length - 1), null, false);
                    }
                }
            }
        } else {
            this.$30 = '351';
            this.$2F = 'Data Model Element Collection Set Out Of Order';
        }
    },
    $34: function ($p0, $p1, $p2) {
        var $0 = false;
        var $1 = this.$2C.getDataTreeValue($p1 + '._count');
        for (var $2 = 0;
             ($2 < parseInt($1)) && (!$0); $2++) {
            if (($p1 + '.' + $2 + '.id' !== $p0) && (this.$2C.getDataTreeValue($p1 + '.' + $2 + '.id') === $p2)) {
                $0 = true;
            }
        }
        return $0;
    },
    $35: function ($p0, $p1, $p2) {
        var $0 = false;
        var $1 = this.$2C.getDataTreeValue($p1 + '._count');
        for (var $2 = 0;
             ($2 < parseInt($1)) && (!$0); $2++) {
            if (($p1 + '.' + $2 + '.pattern' !== $p0) && (this.$2C.getDataTreeValue($p1 + '.' + $2 + '.pattern') === $p2)) {
                $0 = true;
            }
        }
        return $0;
    },
    $36: function ($p0, $p1, $p2, $p3) {
        if ($p2 === '' && !$p3['empty']) {
            return '406';
        }
        var $0 = new Array(1);
        if ($p3['delimiter'] !== '') {
            $0 = $p2.split($p3['delimiter']);
        } else {
            $0[0] = $p2;
        } if (($0.length > 0) && ($0.length <= parseInt($p3['max']))) {
            var $1 = new RegExp($p3['format']);
            for (var $2 = 0;
                 ($2 < $0.length) && (this.$30 === '0'); $2++) {
                if (($p3['pre']).length > 0) {
                    var $3 = this.$38($0[$2], $2, $1, $p3['pre']);
                    $0[$2] = $3['node'];
                    if ($3['errorCode'] !== '0') {
                        return $3['errorCode'];
                    }
                }
                if (!isNullOrUndefined($p3['delimiter2'])) {
                    var $4 = $0[$2].split($p3['delimiter2']);
                    if ($4.length === 2) {
                        if ($4[0].length === 0 && $4[1].length === 0) {
                            return '406';
                        }
                        var $5 = $4[0].match($1);
                        if ($5 == null || $5.length <= 0) {
                            return '406';
                        }
                        var $6 = new RegExp($p3['format2']);
                        $5 = $4[1].match($6);
                        if ($5 == null) {
                            return '406';
                        }
                    } else if (($p2 === '' && !$p3['empty']) || $p2.length > 0) {
                        return '406';
                    }
                } else {
                    if ($p1 === 'numeric' && ($p3['delimiter']).length > 0) {
                        if ($0.length <= 1) {
                            return '406';
                        }
                        if ($0[0].length > 0 && isNaN(this.$37($0[0]))) {
                            return '406';
                        }
                        if ($0[1].length > 0 && isNaN(this.$37($0[1]))) {
                            return '406';
                        }
                        if ($0[0].length > 0 && $0[1].length > 0) {
                            if (parseFloat($0[0]) > parseFloat($0[1])) {
                                return '406';
                            }
                        }
                        break;
                    } else {
                        var $7 = $0[$2].match($1);
                        if (($7 == null && $p2 !== '') || ($7 == null && ($p1 === 'true-false' || $p1 === 'likert'))) {
                            return '406';
                        }
                        if ($0[$2] !== '' && $p3['unique']) {
                            for (var $8 = 0; $8 < $2; $8++) {
                                if ($0[$2] === $0[$8]) {
                                    return '406';
                                }
                            }
                        }
                    }
                }
            }
        } else if ($0.length > parseInt($p3['max'])) {
            this.$2F = 'Data Model Element Pattern Too Long';
            return '351';
        }
        return '0';
    },
    $37: function ($p0) {
        return $p0;
    },
    $38: function ($p0, $p1, $p2, $p3) {
        var $0 = false;
        var $1 = false;
        var $2 = false;
        var $3 = '0';
        var $4;
        if ($p1 === 0 && !isNullOrUndefined($p3)) {
            $4 = new RegExp($p3);
        } else {
            $4 = new RegExp('^(\{(lang)=([^\}]+)\})');
        }
        var $5 = $p0.match($4);
        while ($3 === '0' && $5 != null && $5.length > 2) {
            switch ($5[2]) {
                case 'lang':
                    var $6 = $p0.match($p2);
                    if ($6 != null && $6.join('').length > 0) {
                        if ($6.length >= 3 && !isNullOrUndefined($6[2]) && $6[2] !== 'x' && $6[2] !== 'i' && isUndefined(this.$0[$6[2].toLowerCase()])) {
                            $3 = '406';
                        }
                    } else {
                        $3 = '406';
                    }
                    $2 = true;
                    break;
                case 'case_matters':
                    if (!$2 && !$1) {
                        if ($5[3] !== 'true' && $5[3] !== 'false') {
                            $3 = '406';
                        }
                    }
                    $1 = true;
                    break;
                case 'order_matters':
                    if (!$2 && !$0) {
                        if ($5[3] !== 'true' && $5[3] !== 'false') {
                            $3 = '406';
                        }
                    }
                    $0 = true;
                    break;
                default:
                    break;
            }
            $p0 = $p0.substr($5[1].length);
            $5 = $p0.match($4);
        }
        return {
            errorCode: $3,
            node: $p0
        };
    },
    isFinishAttempted: function () {
        return this.$2E;
    },
    isInitAttempted: function () {
        return this.$2D;
    }
};
SCORM_1_3.Utils = function () {};
SCORM_1_3.Utils.addTime = function (first, second) {
    var $0 = 'P';
    var $1 = new RegExp(/^P((\d+)Y)?((\d+)M)?((\d+)D)?(T((\d+)H)?((\d+)M)?((\d+(\.\d{1,2})?)S)?)?$/);
    var $2 = first.match($1);
    var $3 = second.match($1);
    if (($2 != null) && ($3 != null)) {
        var $4 = 0;
        if (parseFloat($2[13]) > 0) {
            $4 = parseFloat($2[13]);
        }
        var $5 = 0;
        if (parseFloat($3[13]) > 0) {
            $5 = parseFloat($3[13]);
        }
        var $6 = $4 + $5;
        var $7 = Math.floor($6 / 60);
        $6 = Math.round(($6 - ($7 * 60)) * 100) / 100;
        var $8 = 0;
        if (parseFloat($2[11]) > 0) {
            $8 = parseFloat($2[11]);
        }
        var $9 = 0;
        if (parseFloat($3[11]) > 0) {
            $9 = parseFloat($3[11]);
        }
        var $A = $8 + $9 + $7;
        $7 = Math.floor($A / 60);
        $A = Math.round($A - ($7 * 60));
        var $B = 0;
        if (parseInt($2[9], 10) > 0) {
            $B = parseInt($2[9], 10);
        }
        var $C = 0;
        if (parseInt($3[9], 10) > 0) {
            $C = parseInt($3[9], 10);
        }
        var $D = $B + $C + $7;
        $7 = Math.floor($D / 24);
        $D = Math.round($D - ($7 * 24));
        var $E = 0;
        if (parseInt($2[6], 10) > 0) {
            $E = parseInt($2[6], 10);
        }
        var $F = 0;
        if (parseInt($3[6], 10) > 0) {
            $F = parseInt($3[6], 10);
        }
        var $10 = Math.round($E + $F + $7);
        var $11 = 0;
        if (parseInt($2[4], 10) > 0) {
            $11 = parseInt($2[4], 10);
        }
        var $12 = 0;
        if (parseInt($3[4], 10) > 0) {
            $12 = parseInt($3[4], 10);
        }
        var $13 = Math.round($11 + $12);
        var $14 = 0;
        if (parseInt($2[2], 10) > 0) {
            $14 = parseInt($2[2], 10);
        }
        var $15 = 0;
        if (parseInt($3[2], 10) > 0) {
            $15 = parseInt($3[2], 10);
        }
        var $16 = Math.round($14 + $15);
        if ($16 > 0) {
            $0 += $16 + 'Y';
        }
        if ($13 > 0) {
            $0 += $13 + 'M';
        }
        if ($10 > 0) {
            $0 += $10 + 'D';
        }
        if (($D > 0) || ($A > 0) || ($6 > 0)) {
            $0 += 'T';
            if ($D > 0) {
                $0 += $D + 'H';
            }
            if ($A > 0) {
                $0 += $A + 'M';
            }
            if ($6 > 0) {
                $0 += $6 + 'S';
            }
        } else if ($0 === 'P') {
            $0 = 'PT0H';
        }
    }
    return $0;
};
SCORM_1_3.Utils.getTimeInterval = function (calculatedTime) {
    var strTime = 'PT';
    var $1 = Math.floor(calculatedTime / 1000 / 60 / 60);
    calculatedTime = calculatedTime - $1 * 1000 * 60 * 60;
    if ($1 !== 0) {
        strTime += $1.toString() + 'H';
    }
    var $2 = Math.floor(calculatedTime / 1000 / 60);
    calculatedTime = calculatedTime - $2 * 1000 * 60;
    if ($2 !== 0) {
        strTime += $2.toString() + 'M';
    }
    var $3 = Math.floor(calculatedTime / 10) / 100;
    if ($3 !== 0) {
        strTime += $3.toString() + 'S';
    }
    if (strTime === 'PT') {
        strTime = 'PT0H';
    }
    return strTime;
};
SCORM_1_3.Utils.getTimeComparableValue = function (time) {
    var timeCount = 0;
    var regexTimeStamp = new RegExp(/^P((\d+)Y)?((\d+)M)?((\d+)D)?(T((\d+)H)?((\d+)M)?((\d+(\.\d{1,2})?)S)?)?$/);
    var regexResult = time.match(regexTimeStamp);
    if (regexResult == null) {
        return timeCount;
    }
    var $3 = 0;
    if (parseFloat(regexResult[13]) > 0) {
        $3 = parseFloat(regexResult[13]);
    }
    timeCount += Math.round($3 * 1000);
    var $4 = 0;
    if (parseFloat(regexResult[11]) > 0) {
        $4 = parseFloat(regexResult[11]);
    }
    timeCount += Math.round($4 * 60 * 1000);
    var $5 = 0;
    if (parseInt(regexResult[9], 10) > 0) {
        $5 = parseInt(regexResult[9], 10);
    }
    timeCount += $5 * 60 * 60 * 1000;
    var $6 = 0;
    if (parseInt(regexResult[6], 10) > 0) {
        $6 = parseInt(regexResult[6], 10);
    }
    timeCount += $6 * 24 * 60 * 60 * 1000;
    var $7 = 0;
    if (parseInt(regexResult[4], 10) > 0) {
        $7 = parseInt(regexResult[4], 10);
    }
    timeCount += $7 * 30 * 24 * 60 * 60 * 1000;
    var $8 = 0;
    if (parseInt(regexResult[2], 10) > 0) {
        $8 = parseInt(regexResult[2], 10);
    }
    timeCount += $8 * 365 * 30 * 24 * 60 * 60 * 1000;
    return timeCount;
};
SCORM_1_3.Utils.daysInMonth = function (iMonth, iYear) {
    return new Date(iYear, iMonth, 0).getDate();
};
SCORM_1_3.Utils.removeWhiteSpaces = function (value) {
    return value.replace(new RegExp('\\s', 'g'), '');
};
API_1484_11 = function () {};
API_1484_11.setAPI_1484_11_LIB = function (api_1484_11_lib) {
    API_1484_11.lib = api_1484_11_lib;
};
API_1484_11.Initialize = function (param) {
    return API_1484_11.lib.Initialize(param);
};
API_1484_11.Terminate = function (param) {
    return API_1484_11.lib.Terminate(param);
};
API_1484_11.GetValue = function (element) {
    return API_1484_11.lib.GetValue(element);
};
API_1484_11.SetValue = function (element, value) {
    return API_1484_11.lib.SetValue(element, value);
};
API_1484_11.Commit = function (param) {
    return API_1484_11.lib.Commit(param);
};
API_1484_11.GetLastError = function () {
    return API_1484_11.lib.GetLastError();
};
API_1484_11.GetErrorString = function (param) {
    return API_1484_11.lib.GetErrorString(param);
};
API_1484_11.GetDiagnostic = function (param) {
    return API_1484_11.lib.GetDiagnostic(param);
};
SCORM_1_3.ActivityTreeNode.createClass('SCORM_1_3.ActivityTreeNode', null, SCORM.IActivityTreeNode);
SCORM_1_3.ActivityTree.createClass('SCORM_1_3.ActivityTree', SCORM_1_3.ActivityTreeNode, SCORM.IActivityTree);
SCORM_1_3.ActivityTreeNodeSequencing.createClass('SCORM_1_3.ActivityTreeNodeSequencing');
SCORM_1_3.SequencingObjectiveStatus.createClass('SCORM_1_3.SequencingObjectiveStatus');
SCORM_1_3.SequencingObjective.createClass('SCORM_1_3.SequencingObjective');
SCORM_1_3.GlobalObjective.createClass('SCORM_1_3.GlobalObjective');
SCORM_1_3.API_1484_11_LIB.createClass('SCORM_1_3.API_1484_11_LIB', null, SCORM.IAPI);
SCORM_1_3.Utils.createClass('SCORM_1_3.Utils');
API_1484_11.createClass('API_1484_11');
API_1484_11.lib = null;
// ---- Do not remove this footer ----
// This script was generated using Script# v0.5.5.0 (http://projects.nikhilk.net/ScriptSharp)
// -----------------------------------