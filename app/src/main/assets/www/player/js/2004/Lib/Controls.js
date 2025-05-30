Type.createNamespace('ControlsCollection');
ControlsCollection.TreeNodeEventArgs = function (node) {
    ControlsCollection.TreeNodeEventArgs.constructBase(this);
    this._node = node;
};
ControlsCollection.TreeNodeEventArgs.prototype = {
    _node: null,
    get_node: function () {
        return this._node;
    }
};
ControlsCollection.TreeNode = function (domElement) {
    this._children = [];
    ControlsCollection.TreeNode.constructBase(this, [domElement]);
};
ControlsCollection.TreeNode.prototype = {
    _userdata: null,
    _divNode: null,
    _parent: null,
    _url: null,
    getText: function () {
        if (Type.canCast(this, ControlsCollection.TreeView)) {
            return null;
        }
        return this.get_domElement().firstChild.lastChild.lastChild.children[1].innerText.trim();
    },
    getUrl: function () {
        return this._url;
    },
    setUrl: function (url) {
        this._url = url;
    },
    getIcon: function () {
        if (Type.canCast(this, ControlsCollection.TreeView)) {
            return null;
        }
        return this.get_domElement().firstChild.lastChild.lastChild.firstChild;
    },
    getAnchor: function () {
        if (Type.canCast(this, ControlsCollection.TreeView)) {
            return null;
        }
        return this.get_domElement().firstChild.lastChild.lastChild.getElementsByTagName('a')[0];
    },
    setParent: function (parent) {
        this._parent = parent;
    },
    getParent: function () {
        return this._parent;
    },
    getRoot: function () {
        if (this._parent == null) {
            return (Type.canCast(this, ControlsCollection.TreeView)) ? this : null;
        } else {
            return this._parent.getRoot();
        }
    },
    getChildrens: function () {
        return this._children;
    },
    addNode: function (text, href, iconSrc) {
        if (this._divNode == null) {
            this._divNode = document.createElement('div');
            if (!isNullOrUndefined(this.get_domElement().firstChild) && this.get_domElement().firstChild.tagName.toLowerCase() === 'tbody') {
                this.get_domElement().firstChild.lastChild.lastChild.appendChild(this._divNode);
            } else {
                this.get_domElement().appendChild(this._divNode);
            }
        }
        var elementTable = document.createElement('table');
        elementTable.setAttribute('border', '0');
        elementTable.setAttribute('cellpadding', '2');
        elementTable.setAttribute('cellspacing', '2');
        var elementTD = document.createElement('td');
        if (!(Type.canCast(this, ControlsCollection.TreeView))) {
            elementTD.setAttribute('style', 'width:10px;');
            elementTD.setAttribute('width', '10');
        }
        var elementTD2 = document.createElement('td');
        var elementTR = document.createElement('tr');
        elementTR.appendChild(elementTD);
        elementTR.appendChild(elementTD2);
        var elementTBody = document.createElement('tbody');
        elementTBody.appendChild(elementTR);
        elementTable.appendChild(elementTBody);
        var elementImage = document.createElement('img');
        elementImage.setAttribute('border', '0');
        if (!isNullOrUndefined(iconSrc)) {
            elementImage.src = iconSrc;
        } else if (!isNullOrUndefined(this.getRoot().getMinusIcon())) {
            elementImage.src = this.getRoot().getMinusIcon();
        }
        elementTD2.appendChild(elementImage);
        var elementText = document.createTextNode(' ');
        elementTD2.appendChild(elementText);
        var elementA = document.createElement('a');
        if (!isNullOrUndefined(href)) {
            elementA.href = href;
        }
        elementA.innerHTML = text;
        elementTD2.appendChild(elementA);
        this._divNode.appendChild(elementTable);
        var colTreeNode = new ControlsCollection.TreeNode(elementTable);
        colTreeNode.setParent(this);
        colTreeNode.setUrl(href);
        this._children.add(colTreeNode);
        return colTreeNode;
    },
    get_userData: function () {
        return this._userdata;
    },
    set_userData: function (value) {
        this._userdata = value;
        return value;
    }
};
ControlsCollection.TreeView = function (domElement, minusIcon, plusIcon) {
    ControlsCollection.TreeView.constructBase(this, [domElement]);
    this._minusIcon = minusIcon;
    this._plusIcon = plusIcon;
    this.$2_6 = Delegate.create(this, this.$2_9);
    this.get_domElement().attachEvent('onclick', this.$2_6);
};
ControlsCollection.TreeView.prototype = {
    add_nodeClick: function (value) {
        this._nodeClick = Delegate.combine(this._nodeClick, value);
    },
    remove_nodeClick: function (value) {
        this._nodeClick = Delegate.remove(this._nodeClick, value);
    },
    _nodeClick: null,
    $2_6: null,
    _minusIcon: null,
    _plusIcon: null,
    dispose: function () {
        this.get_domElement().detachEvent('onclick', this.$2_6);
        ControlsCollection.TreeView.callBase(this, 'dispose');
    },
    getMinusIcon: function () {
        return this._minusIcon;
    },
    getPlusIcon: function () {
        return this._plusIcon;
    },
    $2_9: function () {
        var element = window.event.srcElement;
        var tagName = null;
        if (!isNullOrUndefined(element)) {
            tagName = element.tagName.toLowerCase();
        }
        if (tagName === 'a' || tagName === 'img') {
            var controlElement = null;
            while (!isNullOrUndefined(element)) {
                controlElement = ScriptFX.UI.Control.getControl(element);
                if (!isNullOrUndefined(controlElement)) {
                    break;
                }
                element = element.parentNode;
            }
            if (controlElement != null) {
                if (tagName === 'img') {
                    var childNode = controlElement.get_domElement().firstChild.lastChild.lastChild.lastChild;
                    if (childNode.tagName.toLowerCase() === 'div') {
                        if (childNode.style.display === 'none') {
                            if (!isNullOrUndefined(this.getMinusIcon())) {
                                controlElement.getIcon().src = this.getRoot().getMinusIcon();
                            }
                            childNode.style.display = '';
                        } else {
                            if (!isNullOrUndefined(this.getPlusIcon())) {
                                controlElement.getIcon().src = this.getRoot().getPlusIcon();
                            }
                            childNode.style.display = 'none';
                        }
                    }
                } else {
                    if (this._nodeClick != null) {
                        window.event.cancelBubble = true;
                        var controlCollection = new ControlsCollection.TreeNodeEventArgs(controlElement);
                        this._nodeClick.invoke(this, controlCollection);
                    }
                }
            }
        }
    }
};
ControlsCollection.TreeNodeEventArgs.createClass('ControlsCollection.TreeNodeEventArgs', EventArgs);
ControlsCollection.TreeNode.createClass('ControlsCollection.TreeNode', ScriptFX.UI.Control);
ControlsCollection.TreeView.createClass('ControlsCollection.TreeView', ControlsCollection.TreeNode);