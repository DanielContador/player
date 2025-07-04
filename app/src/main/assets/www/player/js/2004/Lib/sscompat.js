// Script# Browser Compat Layer
// More information at http://projects.nikhilk.net/ScriptSharp
function __loadCompatLayer(w) {
    w.Debug = function () {};
    w.Debug._fail = function (message) {
        throw new Error(message);
    };
    w.Debug.writeln = function (text) {
        if (window.console) {
            if (window.console.debug) {
                window.console.debug(text);
                return;
            } else if (window.console.log) {
                window.console.log(text);
                return;
            }
        } else if (window.opera && window.opera.postError) {
            window.opera.postError(text);
            return;
        }
    };
    w.__getNonTextNode = function (node) {
        try {
            while (node && (node.nodeType != 1)) {
                node = node.parentNode;
            }
        } catch (ex) {
            node = null;
        }
        return node;
    };
    w.__getLocation = function (e) {
        var loc = {
            x: 0,
            y: 0
        };
        while (e) {
            loc.x += e.offsetLeft;
            loc.y += e.offsetTop;
            e = e.offsetParent;
        }
        return loc;
    };
    w.navigate = function (url) {
        window.setTimeout('window.location = "' + url + '";', 0);
    };
    var attachEventProxy = function (eventName, eventHandler) {
        eventHandler._mozillaEventHandler = function (e) {
            window.event = e;
            eventHandler();
            if (!e.avoidReturn) {
                return e.returnValue;
            }
        };
        this.addEventListener(eventName.slice(2), eventHandler._mozillaEventHandler, false);
    };
    var detachEventProxy = function (eventName, eventHandler) {
        if (eventHandler._mozillaEventHandler) {
            var mozillaEventHandler = eventHandler._mozillaEventHandler;
            delete eventHandler._mozillaEventHandler;
            this.removeEventListener(eventName.slice(2), mozillaEventHandler, false);
        }
    };
    w.attachEvent = attachEventProxy;
    w.detachEvent = detachEventProxy;
    w.HTMLDocument.prototype.attachEvent = attachEventProxy;
    w.HTMLDocument.prototype.detachEvent = detachEventProxy;
    w.HTMLElement.prototype.attachEvent = attachEventProxy;
    w.HTMLElement.prototype.detachEvent = detachEventProxy;
    w.Event.prototype.__defineGetter__('srcElement', function () {
        return __getNonTextNode(this.target) || this.currentTarget;
    });
    w.Event.prototype.__defineGetter__('cancelBubble', function () {
        return this._bubblingCanceled || false;
    });
    w.Event.prototype.__defineSetter__('cancelBubble', function (v) {
        if (v) {
            this._bubblingCanceled = true;
            this.stopPropagation();
        }
    });
    w.Event.prototype.__defineGetter__('returnValue', function () {
        return !this._cancelDefault;
    });
    w.Event.prototype.__defineSetter__('returnValue', function (v) {
        if (!v) {
            this._cancelDefault = true;
            this.preventDefault();
        }
    });
    w.Event.prototype.__defineGetter__('fromElement', function () {
        var n;
        if (this.type == 'mouseover') {
            n = this.relatedTarget;
        } else if (this.type == 'mouseout') {
            n = this.target;
        }
        return __getNonTextNode(n);
    });
    w.Event.prototype.__defineGetter__('toElement', function () {
        var n;
        if (this.type == 'mouseout') {
            n = this.relatedTarget;
        } else if (this.type == 'mouseover') {
            n = this.target;
        }
        return __getNonTextNode(n);
    });
    w.Event.prototype.__defineGetter__('button', function () {
        return (this.which == 1) ? 1 : (this.which == 3) ? 2 : 0
    });
    w.Event.prototype.__defineGetter__('offsetX', function () {
        return window.pageXOffset + this.clientX - __getLocation(this.srcElement).x;
    });
    w.Event.prototype.__defineGetter__('offsetY', function () {
        return window.pageYOffset + this.clientY - __getLocation(this.srcElement).y;
    });
    w.HTMLElement.prototype.__defineGetter__('parentElement', function () {
        return this.parentNode;
    });
    w.HTMLElement.prototype.__defineGetter__('children', function () {
        var children = [];
        var childCount = this.childNodes.length;
        for (var i = 0; i < childCount; i++) {
            var childNode = this.childNodes[i];
            if (childNode.nodeType == 1) {
                children.push(childNode);
            }
        }
        return children;
    });
    w.HTMLElement.prototype.__defineGetter__('innerText', function () {
        try {
            return this.textContent
        } catch (ex) {
            var text = '';
            for (var i = 0; i < this.childNodes.length; i++) {
                if (this.childNodes[i].nodeType == 3) {
                    text += this.childNodes[i].textContent;
                }
            }
            return str;
        }
    });
    w.HTMLElement.prototype.__defineSetter__('innerText', function (v) {
        var textNode = document.createTextNode(v);
        this.innerHTML = '';
        this.appendChild(textNode);
    });
    w.HTMLElement.prototype.__defineGetter__('currentStyle', function () {
        return window.getComputedStyle(this, null);
    });
    w.HTMLElement.prototype.__defineGetter__('runtimeStyle', function () {
        return window.getOverrideStyle(this, null);
    });
    w.HTMLElement.prototype.removeNode = function (b) {
        return this.parentNode.removeChild(this)
    };
    w.HTMLElement.prototype.contains = function (el) {
        while (el != null && el != this) {
            el = el.parentNode;
        }
        return (el != null)
    };
    w.HTMLStyleElement.prototype.__defineGetter__('styleSheet', function () {
        return this.sheet;
    });
    w.CSSStyleSheet.prototype.__defineGetter__('rules', function () {
        return this.cssRules;
    });
    w.CSSStyleSheet.prototype.addRule = function (selector, style, index) {
        this.insertRule(selector + '{' + style + '}', index);
    };
    w.CSSStyleSheet.prototype.removeRule = function (index) {
        this.deleteRule(index);
    };
    w.CSSStyleDeclaration.prototype.__defineGetter__('styleFloat', function () {
        return this.cssFloat;
    });
    w.CSSStyleDeclaration.prototype.__defineSetter__('styleFloat', function (v) {
        this.cssFloat = v;
    });
    DocumentFragment.prototype.getElementById = function (id) {
        var nodeQueue = [];
        var childNodes = this.childNodes;
        var node;
        var c;
        for (c = 0; c < childNodes.length; c++) {
            node = childNodes[c];
            if (node.nodeType == 1) {
                nodeQueue.push(node);
            }
        }
        while (nodeQueue.length) {
            node = nodeQueue.dequeue();
            if (node.id == id) {
                return node;
            }
            childNodes = node.childNodes;
            if (childNodes.length != 0) {
                for (c = 0; c < childNodes.length; c++) {
                    node = childNodes[c];
                    if (node.nodeType == 1) {
                        nodeQueue.push(node);
                    }
                }
            }
        }
        return null;
    };
    DocumentFragment.prototype.getElementsByTagName = function (tagName) {
        var elements = [];
        var nodeQueue = [];
        var childNodes = this.childNodes;
        var node;
        var c;
        for (c = 0; c < childNodes.length; c++) {
            node = childNodes[c];
            if (node.nodeType == 1) {
                nodeQueue.push(node);
            }
        }
        while (nodeQueue.length) {
            node = nodeQueue.dequeue();
            if (tagName == '*' || node.tagName == tagName) {
                elements.add(node);
            }
            childNodes = node.childNodes;
            if (childNodes.length != 0) {
                for (c = 0; c < childNodes.length; c++) {
                    node = childNodes[c];
                    if (node.nodeType == 1) {
                        nodeQueue.push(node);
                    }
                }
            }
        }
        return elements;
    };
    DocumentFragment.prototype.createElement = function (tagName) {
        return document.createElement(tagName);
    };
    var selectNodes = function (doc, path, contextNode) {
        if (!doc.documentElement) {
            return [];
        }
        contextNode = contextNode ? contextNode : doc;
        var xpath = new XPathEvaluator();
        var result = xpath.evaluate(path, contextNode, doc.createNSResolver(doc.documentElement), XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        var nodeList = new Array(result.snapshotLength);
        for (var i = 0; i < result.snapshotLength; i++) {
            nodeList[i] = result.snapshotItem(i);
        }
        return nodeList;
    };
    var selectSingleNode = function (doc, path, contextNode) {
        path += '[1]';
        var nodes = selectNodes(doc, path, contextNode);
        if (nodes.length != 0) {
            for (var i = 0; i < nodes.length; i++) {
                if (nodes[i]) {
                    return nodes[i];
                }
            }
        }
        return null;
    };
    w.XMLDocument.prototype.selectNodes = function (path, contextNode) {
        return selectNodes(this, path, contextNode);
    };
    w.XMLDocument.prototype.selectSingleNode = function (path, contextNode) {
        return selectSingleNode(this, path, contextNode);
    };
    w.XMLDocument.prototype.transformNode = function (xsl) {
        var xslProcessor = new XSLTProcessor();
        xslProcessor.importStylesheet(xsl);
        var ownerDocument = document.implementation.createDocument("", "", null);
        var transformedDoc = xslProcessor.transformToDocument(this);
        return transformedDoc.xml;
    };
    Node.prototype.selectNodes = function (path) {
        var doc = this.ownerDocument;
        return doc.selectNodes(path, this);
    };
    Node.prototype.selectSingleNode = function (path) {
        var doc = this.ownerDocument;
        return doc.selectSingleNode(path, this);
    };
    Node.prototype.__defineGetter__('baseName', function () {
        return this.localName;
    });
    Node.prototype.__defineGetter__('text', function () {
        return this.textContent;
    });
    Node.prototype.__defineSetter__('text', function (value) {
        this.textContent = value;
    });
    Node.prototype.__defineGetter__('xml', function () {
        return (new XMLSerializer()).serializeToString(this);
    });
}

function __supportsCompatLayer(ua) {
    return (ua.indexOf('Gecko') >= 0) || (ua.indexOf('AppleWebKit') >= 0) || (ua.indexOf('Opera') >= 0);
}
if (__supportsCompatLayer(window.navigator.userAgent)) {
    try {
        __loadCompatLayer(window);
    } catch (e) {}
}