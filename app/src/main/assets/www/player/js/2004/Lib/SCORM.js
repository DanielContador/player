Type.createNamespace('SCORM');
SCORM.BaseActivityTreeNodeEventType = function () {};
SCORM.BaseActivityTreeNodeEventType.prototype = {
    FINAL_STORE: 0,
    COMMIT: 1,
    DELIVERY_REQUEST: 2,
    EXIT: 3,
    UNLOAD: 4,
    END_SESSION: 5
};
SCORM.BaseActivityTreeNodeEventType.createEnum('SCORM.BaseActivityTreeNodeEventType', false);
SCORM.IActivityTreeNode = function () {};
SCORM.IActivityTreeNode.createInterface('SCORM.IActivityTreeNode');
SCORM.IActivityTree = function () {};
SCORM.IActivityTree.createInterface('SCORM.IActivityTree');
SCORM.IAPI = function () {};
SCORM.IAPI.createInterface('SCORM.IAPI');
SCORM.BaseActivityTreeNodeEventArgs = function (treeNode, eventType) {
    SCORM.BaseActivityTreeNodeEventArgs.constructBase(this);
    this.objTreeNode = treeNode;
    this.intEventType = eventType;
};
SCORM.BaseActivityTreeNodeEventArgs.prototype = {
    objTreeNode: null,
    intEventType: 0,
    get_treeNode: function () {
        return this.objTreeNode;
    },
    get_eventType: function () {
        return this.intEventType;
    }
};
SCORM.BaseUtils = function () {};
SCORM.BaseUtils.utf8Decode = function (utftext) {
    var strDecodedString = '';
    var intCnt = 0;
    var intPos2, intPos3, intPos4 = 0;
    while (intCnt < utftext.length) {
        intPos2 = utftext.charCodeAt(intCnt);
        if (intPos2 < 128) {
            strDecodedString += String.fromCharCode(intPos2);
            intCnt++;
        } else if ((intPos2 > 191) && (intPos2 < 224)) {
            intPos3 = utftext.charCodeAt(intCnt + 1);
            strDecodedString += String.fromCharCode(((intPos2 & 31) << 6) | (intPos3 & 63));
            intCnt += 2;
        } else {
            intPos3 = utftext.charCodeAt(intCnt + 1);
            intPos4 = utftext.charCodeAt(intCnt + 2);
            strDecodedString += String.fromCharCode(((intPos2 & 15) << 12) | ((intPos3 & 63) << 6) | (intPos4 & 63));
            intCnt += 3;
        }
    }
    return strDecodedString;
};
SCORM.BaseUtils.getXMLNodeAttribut = function (node, attribut) {
    if (isNullOrUndefined(node) || isNullOrUndefined(attribut)) {
        return null;
    }
    for (var i = 0; i < node.attributes.length; i++) {
        var strItem = node.attributes.item(i);
        if (SCORM.BaseUtils.getBaseName(strItem).toLowerCase() === attribut.toLowerCase()) {
            return SCORM.BaseUtils.getText(strItem).trim();
        }
    }
    return null;
};
SCORM.BaseUtils.getBaseName = function (attrNode) {
    if (isNullOrUndefined(attrNode)) {
        return null;
    }
    if (!isNullOrUndefined(attrNode.baseName)) {
        return attrNode.baseName;
    }
    return attrNode.localName;
};
SCORM.BaseUtils.getText = function (attrNode) {
    if (isNullOrUndefined(attrNode)) {
        return null;
    }
    if (!isNullOrUndefined(attrNode.text)) {
        return attrNode.text;
    }
    return attrNode.textContent;
};
SCORM.BaseUtils.getBaseOfUrl = function (url) {
    var arrayMatches = url.match(new RegExp('^(?:f|ht)tp(?:s)?\\://([^/]+)', 'im'));
    return (arrayMatches != null && arrayMatches.length >= 1) ? arrayMatches[0] : '';
};
SCORM.BaseUtils.addParameters = function (iURL, iParameters) {
    if ((iURL.length === 0) || (iParameters.length === 0)) {
        return iURL;
    }
    while (iParameters.startsWith('?') || iParameters.startsWith('&')) {
        iParameters = iParameters.substr(1);
    }
    if (iParameters.startsWith('#')) {
        if (iURL.indexOf('#') !== -1 || iURL.indexOf('?') !== -1) {
            return iURL;
        }
    }
    if (iURL.indexOf('?') !== -1) {
        iURL = iURL + '&';
    } else {
        iURL = iURL + '?';
    }
    iURL = iURL + iParameters;
    return iURL;
};
SCORM.BaseUtils.getChildNodeByName = function (node, nodeName) {
    for (var i = 0; i < node.childNodes.length; i++) {
        if (node.childNodes[i].nodeType !== 1) {
            continue;
        }
        if (SCORM.BaseUtils.getBaseName(node.childNodes[i]).toLowerCase() === nodeName.toLowerCase()) {
            return node.childNodes[i];
        }
    }
    return null;
};
SCORM.BaseUtils.getChildSiblingsByName = function (node, nodeName) {
    var arraySiblings = [];
    for (var i = 0; i < node.childNodes.length; i++) {
        if (node.childNodes[i].nodeType !== 1) {
            continue;
        }
        if (SCORM.BaseUtils.getBaseName(node.childNodes[i]).toLowerCase() === nodeName.toLowerCase()) {
            arraySiblings.add(node.childNodes[i]);
        }
    }
    return arraySiblings;
};
SCORM.LogEventArgs = function () {
    SCORM.LogEventArgs.constructBase(this);
};
SCORM.LogEventArgs.prototype = {
    message: null,
    errorCode: null,
    errorDescription: null
};
SCORM.LOG = function () {};
SCORM.LOG.add_logEvent = function (value) {
    SCORM.LOG.event = Delegate.combine(SCORM.LOG.event, value);
};
SCORM.LOG.remove_logEvent = function (value) {
    SCORM.LOG.event = Delegate.remove(SCORM.LOG.event, value);
};
SCORM.LOG.displayMessage = function (message, errorCode, errorDescription) {
    if (!SCORM.LOG.silent && SCORM.LOG.event != null) {
        SCORM.LOG.event_args.message = message;
        SCORM.LOG.event_args.errorCode = errorCode;
        SCORM.LOG.event_args.errorDescription = errorDescription;
        SCORM.LOG.event.invoke(SCORM.LOG.event_args);
    }
};
SCORM.BaseActivityTreeNodeEventArgs.createClass('SCORM.BaseActivityTreeNodeEventArgs', EventArgs);
SCORM.BaseUtils.createClass('SCORM.BaseUtils');
SCORM.LogEventArgs.createClass('SCORM.LogEventArgs', EventArgs);
SCORM.LOG.createClass('SCORM.LOG');
SCORM.BaseUtils.ncName = '[A-Za-z_][\\w\\\\.\\\\-]*';
SCORM.LOG.silent = false;
SCORM.LOG.event_args = new SCORM.LogEventArgs();
SCORM.LOG.event = null;