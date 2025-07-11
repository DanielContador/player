// Script# Framework
// More information at http://projects.nikhilk.net/ScriptSharp
Type.createNamespace('ScriptFX.UI');
ScriptFX.UI.$create_AutoCompleteOptions = function (service) {
    var $o = {};
    $o.service = service;
    $o.id = null;
    $o.itemCount = 10;
    $o.itemLookupDelay = 500;
    $o.minimumPrefixLength = 3;
    $o.cssClass = 'autoComplete';
    $o.itemCSSClass = 'autoCompleteItem';
    $o.selectedItemCSSClass = 'autoCompleteSelectedItem';
    $o.xOffset = 0;
    $o.yOffset = 0;
    return $o;
}
ScriptFX.UI.$create_EnterKeyOptions = function (clickTarget) {
    var $o = {};
    $o.clickTarget = clickTarget;
    return $o;
}
ScriptFX.UI.$create_WatermarkOptions = function (watermarkText, watermarkCssClass) {
    var $o = {};
    $o.watermarkText = watermarkText;
    $o.watermarkCssClass = watermarkCssClass;
    return $o;
}
ScriptFX.UI.AutoCompleteBehavior = function (domElement, options) {
    ScriptFX.UI.AutoCompleteBehavior.constructBase(this, [domElement, options.id]);
    this.$1_0 = options;
    this.$1_6 = -1;
    domElement.autocomplete = 'off';
    var $0 = this.get_domEvents();
    $0.attach('onfocus', Delegate.create(this, this.$1_15));
    $0.attach('onblur', Delegate.create(this, this.$1_14));
    $0.attach('onkeydown', Delegate.create(this, this.$1_16));
}
ScriptFX.UI.AutoCompleteBehavior.prototype = {
    $1_0: null,
    $1_1: null,
    $1_2: null,
    $1_3: null,
    $1_4: null,
    $1_5: false,
    $1_6: 0,
    $1_7: null,
    $1_8: 0,
    $1_9: null,
    $1_A: null,
    get_arguments: function () {
        if (this.$1_1 == null) {
            this.$1_1 = {};
        }
        return this.$1_1;
    },
    add_itemDisplay: function (value) {
        this.get_events().addHandler('itemDisplay', value);
    },
    remove_itemDisplay: function (value) {
        this.get_events().removeHandler('itemDisplay', value);
    },
    add_itemSelected: function (value) {
        this.get_events().addHandler('itemSelected', value);
    },
    remove_itemSelected: function (value) {
        this.get_events().removeHandler('itemSelected', value);
    },
    add_requestingItems: function (value) {
        this.get_events().addHandler('requestingItems', value);
    },
    remove_requestingItems: function (value) {
        this.get_events().removeHandler('requestingItems', value);
    },
    $1_B: function () {
        if (this.$1_A != null) {
            this.$1_A.abort();
            this.$1_A = null;
        }
    },
    clearCache: function () {
        this.$1_7 = null;
    },
    $1_C: function () {
        this.$1_2 = document.createElement('DIV');
        if (this.$1_0.cssClass != null) {
            this.$1_2.className = this.$1_0.cssClass;
        }
        this.$1_2.unselectable = 'unselectable';
        document.body.appendChild(this.$1_2);
        this.$1_4 = new ScriptFX.UI.DOMEventList(this.$1_2);
        this.$1_4.attach('onmousedown', Delegate.create(this, this.$1_10));
        this.$1_4.attach('onmouseup', Delegate.create(this, this.$1_11));
        this.$1_4.attach('onmouseover', Delegate.create(this, this.$1_12));
        var $0 = ScriptFX.UI.$create_PopupOptions(this.get_domElement(), 4);
        $0.xOffset = this.$1_0.xOffset;
        $0.yOffset = -1 + this.$1_0.yOffset;
        this.$1_3 = new ScriptFX.UI.PopupBehavior(this.$1_2, $0);
    },
    dispose: function () {
        this.$1_1A();
        this.$1_B();
        if (this.$1_2 != null) {
            this.$1_4.dispose();
            this.$1_4 = null;
            this.$1_3.dispose();
            this.$1_3 = null;
            document.body.removeChild(this.$1_2);
            this.$1_2 = null;
            this.$1_5 = false;
        }
        ScriptFX.UI.AutoCompleteBehavior.callBase(this, 'dispose');
    },
    $1_D: function ($p0) {
        while (($p0 != null) && ($p0 !== this.$1_2)) {
            if (!isUndefined($p0.__item)) {
                return $p0;
            }
            $p0 = $p0.parentNode;
        }
        return null;
    },
    $1_E: function () {
        if (this.$1_5) {
            this.$1_5 = false;
            this.$1_3.hide();
            this.$1_6 = -1;
        }
    },
    $1_F: function ($p0) {
        if (this.$1_0.selectedItemCSSClass != null) {
            ScriptFX.UI.Element.addCSSClass($p0, this.$1_0.selectedItemCSSClass);
        }
    },
    $1_10: function () {
        var $0 = this.$1_D(window.event.srcElement);
        if ($0 != null) {
            var $1 = $0.__item;
            var $2 = $0.__index;
            this.$1_1D($1, $2);
        }
    },
    $1_11: function () {
        this.get_domElement().focus();
    },
    $1_12: function () {
        var $0 = this.$1_D(window.event.srcElement);
        if (this.$1_6 !== -1) {
            this.$1_1B(this.$1_2.childNodes[this.$1_6]);
            this.$1_6 = -1;
        }
        if ($0 != null) {
            var $1 = $0.__index;
            if (!isUndefined(this.$1_6)) {
                this.$1_6 = $1;
                this.$1_F($0);
                return;
            }
        }
    },
    $1_13: function ($p0, $p1) {
        if (($p0 !== this.$1_A) || ($p0.get_state() !== 2) || ($p0.get_response().get_statusCode() !== 200)) {
            return;
        }
        var $0 = $p1;
        var $1 = $0['prefix'];
        var $2 = $1;
        if (this.get_events().getHandler('requestingItems') != null) {
            delete $0.prefix;
            delete $0.count;
            $2 += ScriptFX.JSON.serialize($0);
        }
        var $3 = $p0.get_response().getObject();
        this.$1_1C($1, $3, $2);
    },
    $1_14: function () {
        this.$1_1A();
        this.$1_B();
        this.$1_E();
    },
    $1_15: function () {
        this.$1_19();
    },
    $1_16: function () {
        this.$1_1A();
        var $0 = window.event;
        if (this.$1_5) {
            switch ($0.keyCode) {
            case 27:
                this.$1_E();
                $0.returnValue = false;
                break;
            case 38:
                if (this.$1_6 > 0) {
                    this.$1_1B(this.$1_2.childNodes[this.$1_6]);
                    this.$1_6--;
                    this.$1_F(this.$1_2.childNodes[this.$1_6]);
                } else if (this.$1_6 === -1) {
                    this.$1_6 = this.$1_2.childNodes.length - 1;
                    this.$1_F(this.$1_2.childNodes[this.$1_6]);
                }
                $0.returnValue = false;
                break;
            case 40:
                if (this.$1_6 < (this.$1_2.childNodes.length - 1)) {
                    if (this.$1_6 === -1) {
                        this.$1_6 = 0;
                    } else {
                        this.$1_1B(this.$1_2.childNodes[this.$1_6]);
                        this.$1_6++;
                    }
                    this.$1_F(this.$1_2.childNodes[this.$1_6]);
                }
                $0.returnValue = false;
                break;
            case 13:
                if (this.$1_6 !== -1) {
                    var $1 = this.$1_2.childNodes[this.$1_6].__item;
                    var $2 = this.$1_2.childNodes[this.$1_6].__index;
                    this.$1_1D($1, $2);
                }
                $0.returnValue = false;
                break;
            }
        }
        if ($0.keyCode !== 9) {
            this.$1_19();
        }
    },
    $1_17: function () {
        this.$1_8 = 0;
        this.$1_B();
        var $0 = (this.get_domElement()).value;
        if ($0 === this.$1_9) {
            return;
        }
        if ($0.trim().length < this.$1_0.minimumPrefixLength) {
            this.$1_1C(null, null, null);
            return;
        }
        this.$1_9 = $0;
        var $1 = this.get_events().getHandler('requestingItems');
        if ($1 != null) {
            var $3 = new ScriptFX.UI.AutoCompleteRequestEventArgs($0);
            $1.invoke(this, $3);
            var $4 = $3.get_$1_2();
            if ($4 != null) {
                this.$1_1C($0, $4, null);
                return;
            }
        }
        if (this.$1_7 != null) {
            var $5 = $0;
            if (this.$1_1 != null) {
                delete this.$1_1.prefix;
                delete this.$1_1.count;
                $5 += ScriptFX.JSON.serialize(this.$1_1);
            }
            var $6 = this.$1_7[$5];
            if ($6 != null) {
                this.$1_1C($0, $6, null);
                return;
            }
        }
        var $2;
        if (this.$1_1 != null) {
            $2 = this.$1_1;
        } else {
            $2 = {};
        }
        $2['prefix'] = $0;
        $2['count'] = this.$1_0.itemCount;
        this.$1_A = ScriptFX.Net.HTTPRequest.createRequest(ScriptFX.Net.HTTPRequest.createURI(this.$1_0.service, $2), 0);
        this.$1_A.invoke(Delegate.create(this, this.$1_13), $2);
    },
    $1_18: function () {
        if (!this.$1_5) {
            this.$1_5 = true;
            this.$1_2.style.width = (this.get_domElement().offsetWidth - 2) + 'px';
            this.$1_3.show();
        }
    },
    $1_19: function () {
        if (this.$1_8 === 0) {
            this.$1_8 = window.setTimeout(Delegate.create(this, this.$1_17), this.$1_0.itemLookupDelay);
        }
    },
    $1_1A: function () {
        if (this.$1_8 !== 0) {
            window.clearTimeout(this.$1_8);
            this.$1_8 = 0;
        }
    },
    $1_1B: function ($p0) {
        if (this.$1_0.selectedItemCSSClass != null) {
            ScriptFX.UI.Element.removeCSSClass($p0, this.$1_0.selectedItemCSSClass);
        }
    },
    $1_1C: function ($p0, $p1, $p2) {
        var $0 = 0;
        if ($p1 != null) {
            $0 = $p1.length;
        }
        if (($p2 != null) && ($0 !== 0)) {
            if (this.$1_7 == null) {
                this.$1_7 = {};
            }
            this.$1_7[$p2] = $p1;
        }
        if (this.$1_2 == null) {
            this.$1_C();
        }
        this.$1_2.innerHTML = '';
        this.$1_6 = -1;
        if ($0 !== 0) {
            for (var $1 = 0; $1 < $0; $1++) {
                var $2 = document.createElement('DIV');
                if (this.$1_0.itemCSSClass != null) {
                    $2.className = this.$1_0.itemCSSClass;
                }
                var $3 = $p1[$1];
                var $4 = $3;
                var $5 = this.get_events().getHandler('itemDisplay');
                if ($5 != null) {
                    var $6 = new ScriptFX.UI.AutoCompleteItemEventArgs($3, $1);
                    $5.invoke(this, $6);
                    $4 = $6.get_text();
                    if ($4 == null) {
                        $4 = $3;
                    }
                }
                $2.innerHTML = $4;
                $2.__index = $1;
                $2.__item = $p1[$1];
                this.$1_2.appendChild($2);
            }
            this.$1_18();
        } else {
            this.$1_E();
        }
    },
    $1_1D: function ($p0, $p1) {
        this.$1_1A();
        this.$1_E();
        var $0 = null;
        var $1 = this.get_events().getHandler('itemSelected');
        if ($1 != null) {
            var $2 = new ScriptFX.UI.AutoCompleteItemEventArgs($p0, $p1);
            $1.invoke(this, $2);
            $0 = $2.get_text();
        }
        if ($0 == null) {
            $0 = $p0;
        }
        this.$1_9 = $0;
        (this.get_domElement()).value = $0;
    }
}
ScriptFX.UI.AutoCompleteItemEventArgs = function (item, index) {
    ScriptFX.UI.AutoCompleteItemEventArgs.constructBase(this);
    this.$1_0 = item;
    this.$1_1 = index;
}
ScriptFX.UI.AutoCompleteItemEventArgs.prototype = {
    $1_0: null,
    $1_1: 0,
    $1_2: null,
    get_index: function () {
        return this.$1_1;
    },
    get_item: function () {
        return this.$1_0;
    },
    get_text: function () {
        return this.$1_2;
    },
    set_text: function (value) {
        this.$1_2 = value;
        return value;
    }
}
ScriptFX.UI.AutoCompleteRequestEventArgs = function (prefixText) {
    ScriptFX.UI.AutoCompleteRequestEventArgs.constructBase(this);
    this.$1_0 = prefixText;
}
ScriptFX.UI.AutoCompleteRequestEventArgs.prototype = {
    $1_0: null,
    $1_1: null,
    get_$1_2: function () {
        return this.$1_1;
    },
    get_prefixText: function () {
        return this.$1_0;
    },
    setItems: function (items) {
        this.$1_1 = items;
    }
}
ScriptFX.UI.Button = function (domElement) {
    ScriptFX.UI.Button.constructBase(this, [domElement]);
    this.get_domEvents().attach('onclick', Delegate.create(this, this.$2_3));
}
ScriptFX.UI.Button.prototype = {
    $2_1: null,
    $2_2: null,
    get_actionArgument: function () {
        return this.$2_1;
    },
    set_actionArgument: function (value) {
        this.$2_1 = value;
        return value;
    },
    get_actionName: function () {
        return this.$2_2;
    },
    set_actionName: function (value) {
        this.$2_2 = value;
        return value;
    },
    add_action: function (value) {
        this.get_events().addHandler(ScriptFX.UI.Button.$2_0, value);
    },
    remove_action: function (value) {
        this.get_events().removeHandler(ScriptFX.UI.Button.$2_0, value);
    },
    add_click: function (value) {
        this.get_events().addHandler(ScriptFX.UI.Button.$2_0, value);
    },
    remove_click: function (value) {
        this.get_events().removeHandler(ScriptFX.UI.Button.$2_0, value);
    },
    $2_3: function () {
        var $0 = this.get_events().getHandler(ScriptFX.UI.Button.$2_0);
        if ($0 != null) {
            $0.invoke(this, EventArgs.Empty);
        }
    },
    performClick: function () {
        this.$2_3();
    }
}
ScriptFX.UI.CheckBox = function (domElement) {
    ScriptFX.UI.CheckBox.constructBase(this, [domElement]);
    this.get_domEvents().attach('onclick', Delegate.create(this, this.$2_1));
}
ScriptFX.UI.CheckBox.prototype = {
    get_checked: function () {
        return (this.get_domElement()).checked;
    },
    set_checked: function (value) {
        (this.get_domElement()).checked = value;
        return value;
    },
    add_checkedChanged: function (value) {
        this.get_events().addHandler(ScriptFX.UI.CheckBox.$2_0, value);
    },
    remove_checkedChanged: function (value) {
        this.get_events().removeHandler(ScriptFX.UI.CheckBox.$2_0, value);
    },
    $2_1: function () {
        var $0 = this.get_events().getHandler(ScriptFX.UI.CheckBox.$2_0);
        if ($0 != null) {
            $0.invoke(this, EventArgs.Empty);
        }
        this.raisePropertyChanged('Checked');
    }
}
ScriptFX.UI.EnterKeyBehavior = function (element, options) {
    ScriptFX.UI.EnterKeyBehavior.constructBase(this, [element, null]);
    this.$1_0 = options.clickTarget;
    this.get_domEvents().attach('onkeypress', Delegate.create(this, this.$1_1));
}
ScriptFX.UI.EnterKeyBehavior.prototype = {
    $1_0: null,
    $1_1: function () {
        if ((window.event.keyCode === 13) && (!this.$1_0.disabled)) {
            window.event.cancelBubble = true;
            window.event.returnValue = false;
            this.$1_0.click();
        }
    }
}
ScriptFX.UI.Label = function (domElement) {
    ScriptFX.UI.Label.constructBase(this, [domElement]);
}
ScriptFX.UI.Label.prototype = {
    get_text: function () {
        return this.get_domElement().innerText;
    },
    set_text: function (value) {
        this.get_domElement().innerText = value;
        return value;
    }
}
ScriptFX.UI.TextBox = function (domElement) {
    ScriptFX.UI.TextBox.constructBase(this, [domElement]);
    this.get_domEvents().attach('onchange', Delegate.create(this, this.$2_1));
}
ScriptFX.UI.TextBox.prototype = {
    get_text: function () {
        var $0 = ScriptFX.UI.Behavior.getBehavior(this.get_domElement(), ScriptFX.UI.WatermarkBehavior);
        if (($0 != null) && $0.get_isWatermarked()) {
            return String.Empty;
        }
        return (this.get_domElement()).value;
    },
    set_text: function (value) {
        (this.get_domElement()).value = value;
        this.$2_1();
        return value;
    },
    add_textChanged: function (value) {
        this.get_events().addHandler(ScriptFX.UI.TextBox.$2_0, value);
    },
    remove_textChanged: function (value) {
        this.get_events().removeHandler(ScriptFX.UI.TextBox.$2_0, value);
    },
    $2_1: function () {
        var $0 = this.get_events().getHandler(ScriptFX.UI.TextBox.$2_0);
        if ($0 != null) {
            $0.invoke(this, EventArgs.Empty);
        }
    }
}
ScriptFX.UI.WatermarkBehavior = function (element, options) {
    ScriptFX.UI.WatermarkBehavior.constructBase(this, [element, null]);
    this.$1_0 = options;
    this.get_domEvents().attach('onfocus', Delegate.create(this, this.$1_4));
    this.get_domEvents().attach('onblur', Delegate.create(this, this.$1_5));
    this.update();
}
ScriptFX.UI.WatermarkBehavior.prototype = {
    $1_0: null,
    $1_1: 0,
    get_isWatermarked: function () {
        return ScriptFX.UI.Element.containsCSSClass(this.get_domElement(), this.$1_0.watermarkCssClass);
    },
    $1_2: function () {
        var $0 = this.get_domElement();
        if ($0.value.length === 0) {
            this.$1_1 = $0.maxLength;
            $0.maxLength = this.$1_0.watermarkText.length;
            ScriptFX.UI.Element.addCSSClass($0, this.$1_0.watermarkCssClass);
            $0.value = this.$1_0.watermarkText;
        }
    },
    $1_3: function ($p0) {
        var $0 = this.get_domElement();
        if (ScriptFX.UI.Element.containsCSSClass($0, this.$1_0.watermarkCssClass)) {
            $0.maxLength = this.$1_1;
            ScriptFX.UI.Element.removeCSSClass($0, this.$1_0.watermarkCssClass);
            if ($p0) {
                $0.value = '';
            }
        }
    },
    dispose: function () {
        if (!this.get_isDisposed()) {
            this.$1_3(false);
        }
        ScriptFX.UI.WatermarkBehavior.callBase(this, 'dispose');
    },
    $1_4: function () {
        this.$1_3(true);
    },
    $1_5: function () {
        this.$1_2();
    },
    update: function () {
        var $0 = this.get_domElement();
        if ($0.value.length === 0) {
            this.$1_2();
        } else {
            this.$1_3(false);
        }
    }
}
ScriptFX.UI.AutoCompleteBehavior.createClass('ScriptFX.UI.AutoCompleteBehavior', ScriptFX.UI.Behavior);
ScriptFX.UI.AutoCompleteItemEventArgs.createClass('ScriptFX.UI.AutoCompleteItemEventArgs', EventArgs);
ScriptFX.UI.AutoCompleteRequestEventArgs.createClass('ScriptFX.UI.AutoCompleteRequestEventArgs', EventArgs);
ScriptFX.UI.Button.createClass('ScriptFX.UI.Button', ScriptFX.UI.Control, ScriptFX.UI.IAction);
ScriptFX.UI.CheckBox.createClass('ScriptFX.UI.CheckBox', ScriptFX.UI.Control, ScriptFX.UI.IToggle);
ScriptFX.UI.EnterKeyBehavior.createClass('ScriptFX.UI.EnterKeyBehavior', ScriptFX.UI.Behavior);
ScriptFX.UI.Label.createClass('ScriptFX.UI.Label', ScriptFX.UI.Control, ScriptFX.UI.IStaticText);
ScriptFX.UI.TextBox.createClass('ScriptFX.UI.TextBox', ScriptFX.UI.Control, ScriptFX.UI.IEditableText);
ScriptFX.UI.WatermarkBehavior.createClass('ScriptFX.UI.WatermarkBehavior', ScriptFX.UI.Behavior);
ScriptFX.UI.Button.$2_0 = 'click';
ScriptFX.UI.CheckBox.$2_0 = 'checkChanged';
ScriptFX.UI.TextBox.$2_0 = 'textChanged';