// Script# Framework
// More information at http://projects.nikhilk.net/ScriptSharp
Type.createNamespace('ScriptFX');
ScriptFX.CollectionChangedAction = function () {};
ScriptFX.CollectionChangedAction.prototype = {
    add: 0,
    remove: 1,
    reset: 2
}
ScriptFX.CollectionChangedAction.createEnum('ScriptFX.CollectionChangedAction', false);
ScriptFX.$create__Core$1 = function (eventType, sender, eventArgs, eventCookie) {
    var $o = {};
    $o.$1 = eventType;
    $o.$0 = sender;
    $o.$2 = eventArgs;
    $o.$3 = eventCookie;
    return $o;
}
ScriptFX.IEventManager = function () {};
ScriptFX.IEventManager.createInterface('ScriptFX.IEventManager');
ScriptFX.ISupportInitialize = function () {};
ScriptFX.ISupportInitialize.createInterface('ScriptFX.ISupportInitialize');
ScriptFX.INotifyDisposing = function () {};
ScriptFX.INotifyDisposing.createInterface('ScriptFX.INotifyDisposing');
ScriptFX.HostName = function () {};
ScriptFX.HostName.prototype = {
    other: 0,
    IE: 1,
    mozilla: 2,
    safari: 3,
    opera: 4
}
ScriptFX.HostName.createEnum('ScriptFX.HostName', false);
ScriptFX.INotifyCollectionChanged = function () {};
ScriptFX.INotifyCollectionChanged.createInterface('ScriptFX.INotifyCollectionChanged');
ScriptFX.INotifyPropertyChanged = function () {};
ScriptFX.INotifyPropertyChanged.createInterface('ScriptFX.INotifyPropertyChanged');
ScriptFX.ITask = function () {};
ScriptFX.ITask.createInterface('ScriptFX.ITask');
ScriptFX.IObjectWithOwner = function () {};
ScriptFX.IObjectWithOwner.createInterface('ScriptFX.IObjectWithOwner');
ScriptFX.Application = function () {
    this.$8 = [];
    this.$9 = 100;
    ScriptHost.add_loading(Delegate.create(this, this.$18));
    ScriptHost.add_loaded(Delegate.create(this, this.$17));
    ScriptHost.add_unload(Delegate.create(this, this.$19));
    this.$11 = Delegate.create(this, this.$1C);
    window.attachEvent('onbeforeunload', this.$11);
    this.$12 = Delegate.create(this, this.$1B);
    window.attachEvent('onerror', this.$12);
    var $0 = document.documentElement;
    var $1 = $0.className;
    if ($1.startsWith('$')) {
        var $2 = this.get_host();
        $1 = $1.replace('$browser', Enum.toString(ScriptFX.HostName, $2.get_name()));
        $1 = $1.replace('$majorver', $2.get_majorVersion().toString());
        $1 = $1.replace('$minorver', $2.get_minorVersion().toString());
        $0.className = $1;
    }
}
ScriptFX.Application.prototype = {
    $0: null,
    $1: 0,
    $2: false,
    $3: false,
    $4: false,
    $5: null,
    $6: null,
    $7: null,
    $8: null,
    $9: 0,
    $A: 0,
    $B: null,
    $C: 0,
    $D: null,
    $E: null,
    $F: null,
    $10: null,
    $11: null,
    $12: null,
    $13: null,
    $14: null,
    get_domain: function () {
        return window.document.domain;
    },
    set_domain: function (value) {
        window.document.domain = value;
        return value;
    },
    get_$15: function () {
        if (this.$7 == null) {
            this.$7 = new ScriptFX.EventList();
        }
        return this.$7;
    },
    get_history: function () {
        return this.$6;
    },
    get_host: function () {
        if (this.$0 == null) {
            this.$0 = new ScriptFX.HostInfo();
        }
        return this.$0;
    },
    get_idleFrequency: function () {
        return this.$9;
    },
    set_idleFrequency: function (value) {
        this.$9 = value;
        return value;
    },
    get_isFirstLoad: function () {
        return this.$4;
    },
    get_isIE: function () {
        if (this.$1 === 0) {
            this.$1 = (this.get_host().get_name() === 1) ? 1 : -1;
        }
        return (this.$1 === 1) ? true : false;
    },
    get_sessionState: function () {
        return this.$5;
    },
    add_error: function (value) {
        this.get_$15().addHandler('error', value);
    },
    remove_error: function (value) {
        this.get_$15().removeHandler('error', value);
    },
    add_idle: function (value) {
        this.get_$15().addHandler('idle', value);
        if (this.$A === 0) {
            if (this.$13 == null) {
                this.$13 = Delegate.create(this, this.$16);
            }
            this.$A = window.setTimeout(this.$13, this.$9);
        }
    },
    remove_idle: function (value) {
        var $0 = this.get_$15().removeHandler('idle', value);
        if ((!$0) && (this.$A !== 0)) {
            window.clearTimeout(this.$A);
            this.$A = 0;
        }
    },
    add_load: function (value) {
        if (this.$2) {
            value.invoke(this, EventArgs.Empty);
        } else {
            this.get_$15().addHandler('load', value);
        }
    },
    remove_load: function (value) {
        this.get_$15().removeHandler('load', value);
    },
    add_unload: function (value) {
        this.get_$15().addHandler('unload', value);
    },
    remove_unload: function (value) {
        this.get_$15().removeHandler('unload', value);
    },
    add_unloading: function (value) {
        this.get_$15().addHandler('unloading', value);
    },
    remove_unloading: function (value) {
        this.get_$15().removeHandler('unloading', value);
    },
    addTask: function (task) {
        if (this.$B == null) {
            this.$B = [];
        }
        this.$B.enqueue(task);
        if (this.$C === 0) {
            if (this.$14 == null) {
                this.$14 = Delegate.create(this, this.$1A);
            }
            this.$C = window.setTimeout(this.$14, 0);
        }
    },
    enableHistory: function () {
        if (this.$6 != null) {
            return;
        }
        this.$6 = ScriptFX.HistoryManager.$8();
    },
    getService: function (serviceType) {
        if ((serviceType === IServiceContainer) || (serviceType === ScriptFX.IEventManager)) {
            return this;
        }
        if (this.$10 != null) {
            var $0 = serviceType.get_fullName().replace('.', '$');
            return this.$10[$0];
        }
        return null;
    },
    $16: function () {
        this.$A = 0;
        var $0 = this.get_$15().getHandler('idle');
        if ($0 != null) {
            $0.invoke(this, EventArgs.Empty);
            this.$A = window.setTimeout(this.$13, this.$9);
        }
    },
    $17: function ($p0, $p1) {
        this.$2 = true;
        var $0 = this.get_$15().getHandler('load');
        if ($0 != null) {
            $0.invoke(this, EventArgs.Empty);
        }
        if (this.$6 != null) {
            this.$6.$A();
        }
    },
    $18: function ($p0, $p1) {
        var $0 = document.getElementById('__session');
        if ($0 != null) {
            var $1 = $0.value;
            if (String.isNullOrEmpty($1)) {
                this.$4 = true;
                this.$5 = {};
            } else {
                this.$5 = ScriptFX.JSON.deserialize($1);
                if (isUndefined(this.$5['__appLoaded'])) {
                    this.$4 = true;
                }
            }
            this.$5['__appLoaded'] = true;
        } else {
            this.$4 = true;
        }
    },
    $19: function ($p0, $p1) {
        if (!this.$3) {
            this.$3 = true;
            if (this.$C !== 0) {
                window.clearTimeout(this.$C);
            }
            if (this.$A !== 0) {
                window.clearTimeout(this.$A);
            }
            var $0 = this.get_$15().getHandler('unload');
            if ($0 != null) {
                $0.invoke(this, EventArgs.Empty);
            }
            if (this.$B != null) {
                while (this.$B.length !== 0) {
                    var $1 = this.$B.dequeue();
                    if (Type.canCast($1, IDisposable)) {
                        ($1).dispose();
                    }
                }
            }
            if (this.$8.length !== 0) {
                var $enum1 = this.$8.getEnumerator();
                while ($enum1.moveNext()) {
                    var $2 = $enum1.get_current();
                    $2.dispose();
                }
                this.$8.clear();
            }
            if (this.$6 != null) {
                this.$6.dispose();
                this.$6 = null;
            }
            window.detachEvent('onbeforeunload', this.$11);
            window.detachEvent('onerror', this.$12);
            this.$11 = null;
            this.$12 = null;
            this.$14 = null;
            this.$13 = null;
        }
    },
    $1A: function () {
        this.$C = 0;
        if (this.$B.length !== 0) {
            var $0 = this.$B.dequeue();
            if (!$0.execute()) {
                this.$B.enqueue($0);
            } else {
                if (Type.canCast($0, IDisposable)) {
                    ($0).dispose();
                }
            } if (this.$B.length !== 0) {
                this.$C = window.setTimeout(this.$14, 0);
            }
        }
    },
    $1B: function () {
        var $0 = this.get_$15().getHandler('error');
        if ($0 != null) {
            var $1 = new ScriptFX.CancelEventArgs();
            $1.set_canceled(true);
            $0.invoke(this, $1);
            if ($1.get_canceled()) {
                window.event.returnValue = false;
            }
        }
    },
    $1C: function () {
        window.event.avoidReturn = true;
        var $0 = this.get_$15().getHandler('unloading');
        if ($0 != null) {
            var $1 = new ScriptFX.ApplicationUnloadingEventArgs();
            $0.invoke(this, $1);
        }
        if (this.$5 != null) {
            var $2 = document.getElementById('__session');
            $2.value = ScriptFX.JSON.serialize(this.$5);
        }
    },
    raiseEvent: function (eventType, sender, e) {
        if (this.$D != null) {
            var $0 = this.$D[eventType];
            if ($0 != null) {
                $0.invoke(sender, e);
            }
        }
    },
    registerDisposableObject: function (disposableObject) {
        if (!this.$3) {
            this.$8.add(disposableObject);
        }
    },
    registerEvent: function (eventType, sender, e) {
        if (this.$D != null) {
            var $1 = this.$D[eventType];
            if ($1 != null) {
                $1.invoke(sender, e);
            }
        }
        if (this.$F == null) {
            this.$F = [];
        }
        if (this.$E == null) {
            this.$E = {};
            this.$E[eventType] = 1;
        } else {
            var $2 = this.$E[eventType];
            if (isUndefined($2)) {
                this.$E[eventType] = 1;
            } else {
                this.$E[eventType] = 1 + $2;
            }
        }
        var $0 = ScriptFX.$create__Core$1(eventType, sender, e, this.$F.length);
        this.$F.add($0);
        return $0.$3;
    },
    registerEventHandler: function (eventType, handler) {
        var $0 = null;
        if (this.$D == null) {
            this.$D = {};
        } else {
            $0 = this.$D[eventType];
        }
        this.$D[eventType] = Delegate.combine($0, handler);
        if (!isNullOrUndefined(this.$E[eventType])) {
            var $enum1 = this.$F.getEnumerator();
            while ($enum1.moveNext()) {
                var $1 = $enum1.get_current();
                if ($1 == null) {
                    continue;
                }
                if ($1.$1 === eventType) {
                    handler.invoke($1.$0, $1.$2);
                }
            }
        }
    },
    registerService: function (serviceType, service) {
        if (this.$10 == null) {
            this.$10 = {};
        }
        var $0 = serviceType.get_fullName().replace('.', '$');
        this.$10[$0] = service;
    },
    unregisterDisposableObject: function (disposableObject) {
        if (!this.$3) {
            this.$8.remove(disposableObject);
        }
    },
    unregisterEvent: function (eventCookie) {
        var $0 = this.$F[eventCookie];
        var $1 = this.$E[$0.$1];
        if ($1 === 1) {
            delete this.$E[$0.$1];
        } else {
            this.$E[$0.$1] = $1 - 1;
        }
        this.$F[eventCookie] = null;
    },
    unregisterEventHandler: function (eventType, handler) {
        if (this.$D != null) {
            var $0 = this.$D[eventType];
            if ($0 != null) {
                $0 = Delegate.remove($0, handler);
                if ($0 == null) {
                    delete this.$D[eventType];
                } else {
                    this.$D[eventType] = $0;
                }
            }
        }
    },
    unregisterService: function (serviceType) {
        if (this.$10 != null) {
            var $0 = serviceType.get_fullName().replace('.', '$');
            delete this.$10[$0];
        }
    }
}
ScriptFX.CancelEventArgs = function () {
    ScriptFX.CancelEventArgs.constructBase(this);
}
ScriptFX.CancelEventArgs.prototype = {
    $1_0: false,
    get_canceled: function () {
        return this.$1_0;
    },
    set_canceled: function (value) {
        this.$1_0 = value;
        return value;
    }
}
ScriptFX.CollectionChangedEventArgs = function (action, item) {
    ScriptFX.CollectionChangedEventArgs.constructBase(this);
    this.$1_0 = action;
    this.$1_1 = item;
}
ScriptFX.CollectionChangedEventArgs.prototype = {
    $1_0: 0,
    $1_1: null,
    get_action: function () {
        return this.$1_0;
    },
    get_item: function () {
        return this.$1_1;
    }
}
ScriptFX.ApplicationUnloadingEventArgs = function () {
    ScriptFX.ApplicationUnloadingEventArgs.constructBase(this);
}
ScriptFX.ApplicationUnloadingEventArgs.prototype = {
    setUnloadPrompt: function (prompt) {
        window.event.returnValue = prompt;
        window.event.avoidReturn = false;
    }
}
ScriptFX.HistoryManager = function (enabled, iframe) {
    this.$0 = enabled;
    this.$1 = iframe;
}
ScriptFX.HistoryManager.$8 = function () {
    var $0 = ScriptFX.Application.current.get_host().get_name();
    if (($0 !== 1) && ($0 !== 2)) {
        return new ScriptFX.HistoryManager(false, null);
    }
    var $1 = null;
    if ($0 === 1) {
        $1 = document.getElementById('_historyFrame');
    }
    return new ScriptFX.HistoryManager(true, $1);
}
ScriptFX.HistoryManager.prototype = {
    $0: false,
    $1: null,
    $2: null,
    $3: null,
    $4: false,
    $5: false,
    $6: null,
    get_isEnabled: function () {
        return this.$0;
    },
    add_navigated: function (value) {
        this.$7 = Delegate.combine(this.$7, value);
    },
    remove_navigated: function (value) {
        this.$7 = Delegate.remove(this.$7, value);
    },
    $7: null,
    addEntry: function (entryName) {
        if (!this.$0) {
            return;
        }
        this.$4 = true;
        if (this.$1 != null) {
            this.$5 = true;
            this.$1.src = this.$2 + entryName;
        } else {
            this.$E(entryName);
        }
    },
    dispose: function () {
        if (this.$1 != null) {
            this.$1.detachEvent('onload', this.$3);
            this.$1 = null;
        }
    },
    $9: function () {
        var $0 = window.location.hash;
        if (($0.length !== 0) && ($0.charAt(0) === '#')) {
            $0 = $0.substr(1);
        }
        return $0;
    },
    goBack: function () {
        window.history.back();
    },
    goForward: function () {
        window.history.forward();
    },
    $A: function () {
        if (!this.$0) {
            return;
        }
        ScriptFX.Application.current.add_idle(Delegate.create(this, this.$B));
        if (this.$1 != null) {
            this.$2 = this.$1.src + '?';
            this.$3 = Delegate.create(this, this.$C);
            this.$1.attachEvent('onload', this.$3);
        }
        this.$6 = this.$9();
        this.$D(this.$6);
    },
    $B: function ($p0, $p1) {
        var $0 = this.$9();
        if ($0 !== this.$6) {
            if (this.$4) {
                return;
            }
            this.$6 = $0;
            this.$D($0);
        } else {
            this.$4 = false;
        }
    },
    $C: function () {
        var $0 = this.$1.contentWindow.location.search;
        if (($0.length !== 0) && ($0.charAt(0) === '?')) {
            $0 = $0.substr(1);
        }
        this.$E($0);
        if (this.$5) {
            this.$5 = false;
            return;
        }
        this.$D($0);
    },
    $D: function ($p0) {
        if (this.$7 != null) {
            this.$7.invoke(this, new ScriptFX.HistoryEventArgs($p0));
        }
    },
    $E: function ($p0) {
        this.$6 = $p0;
        window.location.hash = $p0;
    }
}
ScriptFX.HistoryEventArgs = function (entryName) {
    ScriptFX.HistoryEventArgs.constructBase(this);
    this.$1_0 = entryName;
}
ScriptFX.HistoryEventArgs.prototype = {
    $1_0: null,
    get_entryName: function () {
        return this.$1_0;
    }
}
ScriptFX.HostInfo = function () {
    var $0 = window.navigator.userAgent.toLowerCase();
    var $1 = null;
    var $2;
    if (($2 = $0.indexOf('opera')) >= 0) {
        this.$0 = 4;
        $1 = $0.substr($2 + 6);
    } else if (($2 = $0.indexOf('msie')) >= 0) {
        this.$0 = 1;
        $1 = $0.substr($2 + 5);
    } else if (($2 = $0.indexOf('safari')) >= 0) {
        this.$0 = 3;
        $1 = $0.substr($2 + 7);
    } else if (($2 = $0.indexOf('firefox')) >= 0) {
        this.$0 = 2;
        $1 = $0.substr($2 + 8);
    } else if ($0.indexOf('gecko') >= 0) {
        this.$0 = 2;
        $1 = window.navigator.appVersion;
    }
    if ($1 != null) {
        this.$1 = parseFloat($1);
        this.$2 = parseInt(this.$1);
        if (($2 = $1.indexOf('.')) >= 0) {
            this.$3 = parseInt($1.substr($2 + 1));
        }
    }
}
ScriptFX.HostInfo.prototype = {
    $0: 0,
    $1: 0,
    $2: 0,
    $3: 0,
    get_majorVersion: function () {
        return this.$2;
    },
    get_minorVersion: function () {
        return this.$3;
    },
    get_name: function () {
        return this.$0;
    },
    get_version: function () {
        return this.$1;
    }
}
ScriptFX.EventList = function () {}
ScriptFX.EventList.prototype = {
    $0: null,
    addHandler: function (key, handler) {
        if (this.$0 == null) {
            this.$0 = {};
        }
        this.$0[key] = Delegate.combine(this.$0[key], handler);
    },
    getHandler: function (key) {
        if (this.$0 != null) {
            return this.$0[key];
        }
        return null;
    },
    removeHandler: function (key, handler) {
        if (this.$0 != null) {
            var $0 = this.$0[key];
            if ($0 != null) {
                var $1 = Delegate.remove($0, handler);
                this.$0[key] = $1;
                return ($1 != null);
            }
        }
        return false;
    }
}
ScriptFX.JSON = function () {}
ScriptFX.JSON.deserialize = function (s) {
    if (String.isNullOrEmpty(s)) {
        return null;
    }
    if (ScriptFX.JSON.$0 == null) {
        ScriptFX.JSON.$0 = new RegExp('(\'|\")\\\\@(-?[0-9]+)@(\'|\")', 'gm');
    }
    s = s.replace(ScriptFX.JSON.$0, 'new Date($2)');
    return eval('(' + s + ')');
}
ScriptFX.JSON.serialize = function (o) {
    if (isNullOrUndefined(o)) {
        return String.Empty;
    }
    var $0 = new StringBuilder();
    ScriptFX.JSON.$1($0, o);
    return $0.toString();
}
ScriptFX.JSON.$1 = function ($p0, $p1) {
    if (isNullOrUndefined($p1)) {
        $p0.append('null');
        return;
    }
    var $0 = typeof ($p1);
    switch ($0) {
    case 'boolean':
        $p0.append($p1.toString());
        return;
    case 'number':
        $p0.append((isFinite($p1)) ? $p1.toString() : 'null');
        return;
    case 'string':
        $p0.append(($p1).quote());
        return;
    case 'object':
        if (Array.isInstance($p1)) {
            $p0.append('[');
            var $1 = $p1;
            var $2 = $1.length;
            var $3 = true;
            for (var $4 = 0; $4 < $2; $4++) {
                if ($3) {
                    $3 = false;
                } else {
                    $p0.append(',');
                }
                ScriptFX.JSON.$1($p0, $1[$4]);
            }
            $p0.append(']');
        } else if (Date.isInstance($p1)) {
            var $5 = $p1;
            var $6 = Date.UTC($5.getUTCFullYear(), $5.getUTCMonth(), $5.getUTCDate(), $5.getUTCHours(), $5.getUTCMinutes(), $5.getUTCSeconds(), $5.getUTCMilliseconds());
            $p0.append('\"\\@');
            $p0.append($6.toString());
            $p0.append('@\"');
        } else if (RegExp.isInstance($p1)) {
            $p0.append($p1.toString());
        } else {
            $p0.append('{');
            var $7 = true;
            var $dict1 = $p1;
            for (var $key2 in $dict1) {
                var $8 = {
                    key: $key2,
                    value: $dict1[$key2]
                };
                if (($8.key).startsWith('$') || Function.isInstance($8.value)) {
                    continue;
                }
                if ($7) {
                    $7 = false;
                } else {
                    $p0.append(',');
                }
                $p0.append('"' + $8.key + '"');
                $p0.append(':');
                ScriptFX.JSON.$1($p0, $8.value);
            }
            $p0.append('}');
        }
        return;
    default:
        $p0.append('null');
        return;
    }
}
ScriptFX.PropertyChangedEventArgs = function (propertyName) {
    ScriptFX.PropertyChangedEventArgs.constructBase(this);
    this.$1_0 = propertyName;
}
ScriptFX.PropertyChangedEventArgs.prototype = {
    $1_0: null,
    get_propertyName: function () {
        return this.$1_0;
    }
}
ScriptFX.ObservableCollection = function (owner, disposableItems) {
    this.$0 = owner;
    this.$1 = [];
    this.$2 = disposableItems;
}
ScriptFX.ObservableCollection.prototype = {
    $0: null,
    $1: null,
    $2: false,
    $3: null,
    add_collectionChanged: function (value) {
        this.$3 = Delegate.combine(this.$3, value);
    },
    remove_collectionChanged: function (value) {
        this.$3 = Delegate.remove(this.$3, value);
    },
    add: function (item) {
        (item).setOwner(this.$0);
        this.$1.add(item);
        if (this.$3 != null) {
            this.$3.invoke(this, new ScriptFX.CollectionChangedEventArgs(0, item));
        }
    },
    clear: function () {
        if (this.$1.length !== 0) {
            var $enum1 = this.$1.getEnumerator();
            while ($enum1.moveNext()) {
                var $0 = $enum1.get_current();
                $0.setOwner(null);
            }
            this.$1.clear();
            if (this.$3 != null) {
                this.$3.invoke(this, new ScriptFX.CollectionChangedEventArgs(2, null));
            }
        }
    },
    contains: function (item) {
        return this.$1.contains(item);
    },
    dispose: function () {
        if (this.$2) {
            var $enum1 = this.$1.getEnumerator();
            while ($enum1.moveNext()) {
                var $0 = $enum1.get_current();
                $0.dispose();
            }
        }
        this.$1 = null;
        this.$0 = null;
        this.$3 = null;
    },
    getEnumerator: function () {
        return this.$1.getEnumerator();
    },
    getItem: function (index) {
        return this.$1[index];
    },
    getItems: function () {
        return this.$1;
    },
    getLength: function () {
        return this.$1.length;
    },
    remove: function (item) {
        if (this.$1.contains(item)) {
            (item).setOwner(null);
            this.$1.remove(item);
            if (this.$3 != null) {
                this.$3.invoke(this, new ScriptFX.CollectionChangedEventArgs(1, item));
            }
        }
    }
}
Type.createNamespace('ScriptFX.Net');
ScriptFX.Net.HTTPStatusCode = function () {};
ScriptFX.Net.HTTPStatusCode.prototype = {
    canContinue: 100,
    switchingProtocols: 101,
    OK: 200,
    created: 201,
    partialContent: 206,
    accepted: 202,
    nonAuthoritativeInformation: 203,
    noContent: 204,
    resetContent: 205,
    ambiguous: 300,
    moved: 301,
    redirect: 302,
    redirectMethod: 303,
    notModified: 304,
    useProxy: 305,
    temporaryRedirect: 307,
    badRequest: 400,
    methodNotAllowed: 400,
    unauthorized: 401,
    paymentRequired: 402,
    forbidden: 403,
    notFound: 404,
    notAcceptable: 406,
    proxyAuthenticationRequired: 407,
    requestTimeout: 408,
    conflict: 409,
    gone: 410,
    lengthRequired: 411,
    preconditionFailed: 412,
    requestEntityTooLarge: 413,
    requestUriTooLong: 414,
    unsupportedMediaType: 415,
    requestedRangeNotSatisfiable: 416,
    expectationFailed: 417,
    internalServerError: 500,
    notImplemented: 501,
    badGateway: 502,
    serviceUnavailable: 503,
    gatewayTimeout: 504,
    httpVersionNotSupported: 505
}
ScriptFX.Net.HTTPStatusCode.createEnum('ScriptFX.Net.HTTPStatusCode', false);
ScriptFX.Net.HTTPRequestState = function () {};
ScriptFX.Net.HTTPRequestState.prototype = {
    inactive: 0,
    inProgress: 1,
    completed: 2,
    aborted: 3,
    timedOut: 4
}
ScriptFX.Net.HTTPRequestState.createEnum('ScriptFX.Net.HTTPRequestState', false);
ScriptFX.Net.HTTPVerb = function () {};
ScriptFX.Net.HTTPVerb.prototype = {
    GET: 0,
    POST: 1,
    PUT: 2,
    DELETE: 3
}
ScriptFX.Net.HTTPVerb.createEnum('ScriptFX.Net.HTTPVerb', false);
ScriptFX.Net.IHTTPResponse = function () {};
ScriptFX.Net.IHTTPResponse.createInterface('ScriptFX.Net.IHTTPResponse');
ScriptFX.Net.HTTPRequest = function () {}
ScriptFX.Net.HTTPRequest.createRequest = function (uri, verb) {
    var $0 = new ScriptFX.Net.HTTPRequest();
    if (!uri.startsWith('{')) {
        $0.$0 = uri;
    } else {
        var $1 = ScriptFX.JSON.deserialize(uri);
        $0.$0 = $1['__uri'];
        if ($1['__nullParams']) {
            $0.$6 = $1['__transportType'];
        } else {
            $0.$6 = Type.getType($1['__transportType']);
            delete $1.__uri;
            delete $1.__transportType;
            $0.$7 = $1;
        }
    }
    $0.$1 = verb;
    return $0;
}
ScriptFX.Net.HTTPRequest.createURI = function (uri, parameters) {
    var $0 = new StringBuilder(uri);
    if (uri.indexOf('?') < 0) {
        $0.append('?');
    }
    var $1 = 0;
    var $dict1 = parameters;
    for (var $key2 in $dict1) {
        var $2 = {
            key: $key2,
            value: $dict1[$key2]
        };
        if ($1 !== 0) {
            $0.append('&');
        }
        $0.append($2.key);
        $0.append('=');
        $0.append(encodeURIComponent($2.value.toString()));
        $1++;
    }
    return $0.toString();
}
ScriptFX.Net.HTTPRequest.prototype = {
    $0: null,
    $1: 0,
    $2: null,
    $3: null,
    $4: null,
    $5: null,
    $6: null,
    $7: null,
    $8: 0,
    $9: null,
    $A: null,
    $B: 0,
    $C: null,
    $D: null,
    $E: null,
    get_content: function () {
        return this.$2;
    },
    set_content: function (value) {
        this.$2 = value;
        return value;
    },
    get_hasCredentials: function () {
        return (!String.isNullOrEmpty(this.$4));
    },
    get_hasHeaders: function () {
        return (this.$3 != null);
    },
    get_headers: function () {
        if (this.$3 == null) {
            this.$3 = {};
        }
        return this.$3;
    },
    get_password: function () {
        return this.$5;
    },
    get_response: function () {
        return this.$D;
    },
    get_state: function () {
        return this.$B;
    },
    get_timeout: function () {
        return this.$8;
    },
    set_timeout: function (value) {
        this.$8 = value;
        return value;
    },
    get_timeStamp: function () {
        return this.$E;
    },
    get_$F: function () {
        return this.$C;
    },
    get_$10: function () {
        return this.$7;
    },
    get_transportType: function () {
        return this.$6;
    },
    get_URI: function () {
        return this.$0;
    },
    get_userName: function () {
        return this.$4;
    },
    get_verb: function () {
        return this.$1;
    },
    abort: function () {
        if (this.$B === 1) {
            ScriptFX.Net.HTTPRequestManager.$5(this, false);
        }
    },
    dispose: function () {
        if (this.$C != null) {
            this.abort();
        }
    },
    invoke: function (callback, context) {
        this.$9 = callback;
        this.$A = context;
        ScriptFX.Application.current.registerDisposableObject(this);
        ScriptFX.Net.HTTPRequestManager.$6(this);
    },
    $11: function () {
        ScriptFX.Application.current.unregisterDisposableObject(this);
        if (this.$C != null) {
            this.$C.dispose();
            this.$C = null;
        }
        if (this.$9 != null) {
            this.$9.invoke(this, this.$A);
            this.$9 = null;
            this.$A = null;
        }
    },
    $12: function () {
        this.$B = 3;
        this.$11();
    },
    $13: function ($p0) {
        this.$C = $p0;
        this.$B = 1;
        this.$E = new Date();
    },
    $14: function ($p0) {
        this.$D = $p0;
        this.$B = 2;
        this.$11();
    },
    $15: function () {
        this.$B = 4;
        this.$11();
    },
    setContentAsForm: function (data) {
        this.get_headers()['Content-Type'] = 'application/x-www-form-urlencoded';
        var $0 = new StringBuilder();
        var $1 = true;
        var $dict1 = data;
        for (var $key2 in $dict1) {
            var $2 = {
                key: $key2,
                value: $dict1[$key2]
            };
            if (!$1) {
                $0.append('&');
            }
            $0.append($2.key);
            $0.append('=');
            $0.append(encodeURIComponent($2.value.toString()));
            $1 = false;
        }
        this.set_content($0.toString());
    },
    setContentAsJSON: function (data) {
        this.get_headers()['Content-Type'] = 'text/json';
        this.set_content(ScriptFX.JSON.serialize(data));
    },
    setCredentials: function (userName, password) {
        this.$4 = userName;
        this.$5 = password;
    }
}
ScriptFX.Net.HTTPRequestManager = function () {}
ScriptFX.Net.HTTPRequestManager.add_requestInvoking = function (value) {
    ScriptFX.Net.HTTPRequestManager.$0 = Delegate.combine(ScriptFX.Net.HTTPRequestManager.$0, value);
}
ScriptFX.Net.HTTPRequestManager.remove_requestInvoking = function (value) {
    ScriptFX.Net.HTTPRequestManager.$0 = Delegate.remove(ScriptFX.Net.HTTPRequestManager.$0, value);
}
ScriptFX.Net.HTTPRequestManager.add_requestInvoked = function (value) {
    ScriptFX.Net.HTTPRequestManager.$1 = Delegate.combine(ScriptFX.Net.HTTPRequestManager.$1, value);
}
ScriptFX.Net.HTTPRequestManager.remove_requestInvoked = function (value) {
    ScriptFX.Net.HTTPRequestManager.$1 = Delegate.remove(ScriptFX.Net.HTTPRequestManager.$1, value);
}
ScriptFX.Net.HTTPRequestManager.get_online = function () {
    return window.navigator.onLine;
}
ScriptFX.Net.HTTPRequestManager.get_timeoutInterval = function () {
    return ScriptFX.Net.HTTPRequestManager.$2;
}
ScriptFX.Net.HTTPRequestManager.set_timeoutInterval = function (value) {
    ScriptFX.Net.HTTPRequestManager.$2 = value;
    return value;
}
ScriptFX.Net.HTTPRequestManager.$5 = function ($p0, $p1) {
    var $0 = $p0.get_$F();
    if ($0 != null) {
        $0.abort();
        ScriptFX.Net.HTTPRequestManager.$7($p0, null, $p1);
    }
}
ScriptFX.Net.HTTPRequestManager.abortAll = function () {
    var $0 = ScriptFX.Net.HTTPRequestManager.$3;
    ScriptFX.Net.HTTPRequestManager.$3 = [];
    var $enum1 = $0.getEnumerator();
    while ($enum1.moveNext()) {
        var $1 = $enum1.get_current();
        ScriptFX.Net.HTTPRequestManager.$5($1, false);
    }
}
ScriptFX.Net.HTTPRequestManager.$6 = function ($p0) {
    if (ScriptFX.Net.HTTPRequestManager.$0 != null) {
        var $2 = new ScriptFX.Net.PreHTTPRequestEventArgs($p0);
        ScriptFX.Net.HTTPRequestManager.$0.invoke(null, $2);
        if ($2.get_isSuppressed()) {
            $p0.$14($2.get_response());
            return;
        }
    }
    var $0 = $p0.get_transportType();
    if ($0 == null) {
        $0 = ScriptFX.Net._Core$3;
    }
    var $1 = new $0($p0);
    $p0.$13($1);
    ScriptFX.Net.HTTPRequestManager.$3.add($p0);
    $1.invoke();
    if (((ScriptFX.Net.HTTPRequestManager.$2 !== 0) || ($p0.get_timeout() !== 0)) && (ScriptFX.Net.HTTPRequestManager.$4 == null)) {
        ScriptFX.Net.HTTPRequestManager.$4 = Delegate.create(null, ScriptFX.Net.HTTPRequestManager.$8);
        ScriptFX.Application.current.add_idle(ScriptFX.Net.HTTPRequestManager.$4);
    }
}
ScriptFX.Net.HTTPRequestManager.$7 = function ($p0, $p1, $p2) {
    ScriptFX.Net.HTTPRequestManager.$3.remove($p0);
    if ($p1 != null) {
        $p0.$14($p1);
    } else if ($p2) {
        $p0.$15();
    } else {
        $p0.$12();
    } if (ScriptFX.Net.HTTPRequestManager.$1 != null) {
        var $0 = new ScriptFX.Net.PostHTTPRequestEventArgs($p0, $p1);
        ScriptFX.Net.HTTPRequestManager.$1.invoke(null, $0);
    }
    if ((ScriptFX.Net.HTTPRequestManager.$3.length === 0) && (ScriptFX.Net.HTTPRequestManager.$4 != null)) {
        ScriptFX.Application.current.remove_idle(ScriptFX.Net.HTTPRequestManager.$4);
        ScriptFX.Net.HTTPRequestManager.$4 = null;
    }
}
ScriptFX.Net.HTTPRequestManager.$8 = function ($p0, $p1) {
    if (ScriptFX.Net.HTTPRequestManager.$3.length === 0) {
        return;
    }
    var $0 = null;
    var $1 = new Date().getTime();
    var $enum1 = ScriptFX.Net.HTTPRequestManager.$3.getEnumerator();
    while ($enum1.moveNext()) {
        var $2 = $enum1.get_current();
        var $3 = $2.get_timeStamp().getTime();
        var $4 = $2.get_timeout();
        if ($4 === 0) {
            $4 = ScriptFX.Net.HTTPRequestManager.$2;
            if ($4 === 0) {
                continue;
            }
        }
        if (($1 - $3) > $4) {
            if ($0 == null) {
                $0 = [];
            }
            $0.add($2);
        }
    }
    if ($0 != null) {
        var $enum2 = $0.getEnumerator();
        while ($enum2.moveNext()) {
            var $5 = $enum2.get_current();
            ScriptFX.Net.HTTPRequestManager.$5($5, true);
        }
    }
}
ScriptFX.Net.HTTPRequestManager.$9 = function ($p0, $p1) {
    ScriptFX.Net.HTTPRequestManager.$7($p0, $p1, false);
}
ScriptFX.Net.HTTPTransport = function (request) {
    this.$0 = request;
}
ScriptFX.Net.HTTPTransport.createURI = function (uri, transportType, parameters) {
    if (parameters == null) {
        return '{__nullParams: true, __uri:\'' + uri + '\', __transportType: ' + transportType.get_fullName() + '}';
    } else {
        parameters['__uri'] = uri;
        parameters['__transportType'] = transportType.get_fullName();
        return ScriptFX.JSON.serialize(parameters);
    }
}
ScriptFX.Net.HTTPTransport.prototype = {
    $0: null,
    get_parameters: function () {
        return this.$0.get_$10();
    },
    get_request: function () {
        return this.$0;
    },
    getMethod: function () {
        return Enum.toString(ScriptFX.Net.HTTPVerb, this.$0.get_verb());
    },
    onCompleted: function (response) {
        ScriptFX.Net.HTTPRequestManager.$9(this.$0, response);
    }
}
ScriptFX.Net.PostHTTPRequestEventArgs = function (request, response) {
    ScriptFX.Net.PostHTTPRequestEventArgs.constructBase(this);
    this.$1_0 = request;
    this.$1_1 = response;
}
ScriptFX.Net.PostHTTPRequestEventArgs.prototype = {
    $1_0: null,
    $1_1: null,
    get_request: function () {
        return this.$1_0;
    },
    get_response: function () {
        return this.$1_1;
    }
}
ScriptFX.Net.PreHTTPRequestEventArgs = function (request) {
    ScriptFX.Net.PreHTTPRequestEventArgs.constructBase(this);
    this.$1_0 = request;
}
ScriptFX.Net.PreHTTPRequestEventArgs.prototype = {
    $1_0: null,
    $1_1: null,
    $1_2: false,
    get_isSuppressed: function () {
        return this.$1_2;
    },
    get_request: function () {
        return this.$1_0;
    },
    get_response: function () {
        return this.$1_1;
    },
    suppressRequest: function (response) {
        this.$1_2 = true;
        this.$1_1 = response;
    }
}
ScriptFX.Net._Core$2 = function (request, xmlHTTP) {
    this.$3 = new Date();
    this.$0 = request;
    this.$1 = xmlHTTP;
}
ScriptFX.Net._Core$2.prototype = {
    $0: null,
    $1: null,
    $2: null,
    $3: null,
    $4: null,
    $5: null,
    $6: null,
    get_contentLength: function () {
        return this.getText().length;
    },
    get_contentType: function () {
        return this.$1.getResponseHeader('Content-Type');
    },
    get_headers: function () {
        if (this.$2 == null) {
            var $0 = this.$1.getAllResponseHeaders();
            var $1 = $0.split('\n');
            this.$2 = {};
            var $enum1 = $1.getEnumerator();
            while ($enum1.moveNext()) {
                var $2 = $enum1.get_current();
                var $3 = $2.indexOf(':');
                this.$2[$2.substr(0, $3)] = $2.substr($3 + 1).trim();
            }
        }
        return this.$2;
    },
    get_request: function () {
        return this.$0;
    },
    get_statusCode: function () {
        return this.$1.status;
    },
    get_statusText: function () {
        return this.$1.statusText;
    },
    get_timeStamp: function () {
        return this.$3;
    },
    getHeader: function ($p0) {
        return this.$1.getResponseHeader($p0);
    },
    getObject: function () {
        if (this.$5 == null) {
            this.$5 = ScriptFX.JSON.deserialize(this.getText());
        }
        return this.$5;
    },
    getText: function () {
        if (this.$4 == null) {
            this.$4 = this.$1.responseText;
        }
        return this.$4;
    },
    getXML: function () {
        if (this.$6 == null) {
            var $0 = this.$1.responseXML;
            if (($0 == null) || ($0.documentElement == null)) {
                try {
                    $0 = XMLDocumentParser.parse(this.$1.responseText);
                    if (($0 != null) && ($0.documentElement != null)) {
                        this.$6 = $0;
                    }
                } catch ($1) {}
            } else {
                this.$6 = $0;
                if (ScriptFX.Application.current.get_isIE()) {
                    $0.setProperty('SelectionLanguage', 'XPath');
                }
            }
        }
        return this.$6;
    }
}
ScriptFX.Net._Core$3 = function (request) {
    ScriptFX.Net._Core$3.constructBase(this, [request]);
}
ScriptFX.Net._Core$3.prototype = {
    $1: null,
    abort: function () {
        if (this.$1 != null) {
            this.$1.onreadystatechange = Delegate.Null;
            this.$1.abort();
            this.$1 = null;
        }
    },
    dispose: function () {
        this.abort();
    },
    invoke: function () {
        var $0 = this.get_request();
        this.$1 = new XMLHttpRequest();
        this.$1.onreadystatechange = Delegate.create(this, this.$2);
        if (!this.get_request().get_hasCredentials()) {
            this.$1.open(this.getMethod(), $0.get_URI(), true);
        } else {
            this.$1.open(this.getMethod(), $0.get_URI(), true, $0.get_userName(), $0.get_password());
        }
        var $1 = ($0.get_hasHeaders()) ? $0.get_headers() : null;
        if ($1 != null) {
            var $dict1 = $1;
            for (var $key2 in $dict1) {
                var $3 = {
                    key: $key2,
                    value: $dict1[$key2]
                };
                this.$1.setRequestHeader($3.key, $3.value);
            }
        }
        var $2 = $0.get_content();
        if (($2 != null) && (($1 == null) || ($1['Content-Type'] == null))) {
            this.$1.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        }
        this.$1.send($2);
    },
    $2: function () {
        if (this.$1.readyState === 4) {
            var $0 = new ScriptFX.Net._Core$2(this.get_request(), this.$1);
            this.$1.onreadystatechange = Delegate.Null;
            this.$1 = null;
            this.onCompleted($0);
        }
    }
}
Type.createNamespace('ScriptFX.UI');
ScriptFX.UI.AnimationStopState = function () {};
ScriptFX.UI.AnimationStopState.prototype = {
    complete: 0,
    abort: 1,
    revert: 2
}
ScriptFX.UI.AnimationStopState.createEnum('ScriptFX.UI.AnimationStopState', false);
ScriptFX.UI.$create_Bounds = function (left, top, width, height) {
    var $o = {};
    $o.left = left;
    $o.top = top;
    $o.width = width;
    $o.height = height;
    return $o;
}
ScriptFX.UI.$create_DragDropData = function (mode, dataType, data) {
    var $o = {};
    $o.mode = mode;
    $o.dataType = dataType;
    $o.data = data;
    return $o;
}
ScriptFX.UI.DragMode = function () {};
ScriptFX.UI.DragMode.prototype = {
    move: 0,
    copy: 1
}
ScriptFX.UI.DragMode.createEnum('ScriptFX.UI.DragMode', false);
ScriptFX.UI.IAction = function () {};
ScriptFX.UI.IAction.createInterface('ScriptFX.UI.IAction');
ScriptFX.UI.IDragDrop = function () {};
ScriptFX.UI.IDragDrop.createInterface('ScriptFX.UI.IDragDrop');
ScriptFX.UI.IDragSource = function () {};
ScriptFX.UI.IDragSource.createInterface('ScriptFX.UI.IDragSource');
ScriptFX.UI.IDropTarget = function () {};
ScriptFX.UI.IDropTarget.createInterface('ScriptFX.UI.IDropTarget');
ScriptFX.UI.IEditableText = function () {};
ScriptFX.UI.IEditableText.createInterface('ScriptFX.UI.IEditableText');
ScriptFX.UI.IStaticText = function () {};
ScriptFX.UI.IStaticText.createInterface('ScriptFX.UI.IStaticText');
ScriptFX.UI.IToggle = function () {};
ScriptFX.UI.IToggle.createInterface('ScriptFX.UI.IToggle');
ScriptFX.UI.IValidator = function () {};
ScriptFX.UI.IValidator.createInterface('ScriptFX.UI.IValidator');
ScriptFX.UI.Key = function () {};
ScriptFX.UI.Key.prototype = {
    backspace: 8,
    tab: 9,
    enter: 13,
    escape: 27,
    space: 32,
    pageUp: 33,
    pageDown: 34,
    end: 35,
    home: 36,
    left: 37,
    up: 38,
    right: 39,
    down: 40,
    del: 127
}
ScriptFX.UI.Key.createEnum('ScriptFX.UI.Key', false);
ScriptFX.UI.$create_Location = function (left, top) {
    var $o = {};
    $o.left = left;
    $o.top = top;
    return $o;
}
ScriptFX.UI.$create_OverlayOptions = function (cssClass) {
    var $o = {};
    $o.cssClass = cssClass;
    $o.fadeInOutInterval = 250;
    $o.opacity = 0.75;
    return $o;
}
ScriptFX.UI.PopupMode = function () {};
ScriptFX.UI.PopupMode.prototype = {
    center: 0,
    anchorTopLeft: 1,
    anchorTopRight: 2,
    anchorBottomRight: 3,
    anchorBottomLeft: 4,
    alignTopLeft: 5,
    alignTopRight: 6,
    alignBottomRight: 7,
    alignBottomLeft: 8
}
ScriptFX.UI.PopupMode.createEnum('ScriptFX.UI.PopupMode', false);
ScriptFX.UI.$create_PopupOptions = function (referenceElement, mode) {
    var $o = {};
    $o.referenceElement = referenceElement;
    $o.mode = mode;
    $o.id = null;
    $o.xOffset = 0;
    $o.yOffset = 0;
    return $o;
}
ScriptFX.UI.$create_Size = function (width, height) {
    var $o = {};
    $o.width = width;
    $o.height = height;
    return $o;
}
ScriptFX.UI.Animation = function (domElement) {
    if (domElement == null) {
        domElement = document.documentElement;
    }
    this.$0 = domElement;
    this.$1 = 1;
    ScriptFX.Application.current.registerDisposableObject(this);
}
ScriptFX.UI.Animation.prototype = {
    $0: null,
    $1: 0,
    $2: false,
    $3: 0,
    $4: false,
    $5: false,
    $6: false,
    $7: 0,
    $8: 0,
    $9: false,
    add_repeating: function (value) {
        this.$A = Delegate.combine(this.$A, value);
    },
    remove_repeating: function (value) {
        this.$A = Delegate.remove(this.$A, value);
    },
    $A: null,
    add_starting: function (value) {
        this.$B = Delegate.combine(this.$B, value);
    },
    remove_starting: function (value) {
        this.$B = Delegate.remove(this.$B, value);
    },
    $B: null,
    add_stopped: function (value) {
        this.$C = Delegate.combine(this.$C, value);
    },
    remove_stopped: function (value) {
        this.$C = Delegate.remove(this.$C, value);
    },
    $C: null,
    get_autoReverse: function () {
        return this.$2;
    },
    set_autoReverse: function (value) {
        this.$2 = value;
        return value;
    },
    get_completed: function () {
        return this.$4;
    },
    get_domElement: function () {
        return this.$0;
    },
    get_isPlaying: function () {
        return this.$5;
    },
    get_isReversed: function () {
        return this.$9;
    },
    get_repeatCount: function () {
        return this.$1;
    },
    set_repeatCount: function (value) {
        this.$1 = value;
        return value;
    },
    get_repeatDelay: function () {
        return this.$3;
    },
    set_repeatDelay: function (value) {
        this.$3 = value;
        return value;
    },
    get_repetitions: function () {
        return this.$7;
    },
    dispose: function () {
        if (this.$5) {
            this.stop(1);
        }
        if (this.$0 != null) {
            this.$0 = null;
            ScriptFX.Application.current.unregisterDisposableObject(this);
        }
    },
    $D: function ($p0) {
        if (this.$B != null) {
            this.$B.invoke(this, EventArgs.Empty);
        }
        this.performSetup();
        this.$5 = true;
        this.$7 = 1;
        this.$9 = $p0;
        this.playCore();
    },
    $E: function ($p0, $p1) {
        this.stopCore($p0, $p1);
        this.$4 = $p0;
        this.$5 = false;
        this.performCleanup();
        if (this.$C != null) {
            this.$C.invoke(this, EventArgs.Empty);
        }
    },
    $F: function ($p0) {
        if (this.$6) {
            if ((this.$3 !== 0) && ((this.$8 + this.$3) > $p0)) {
                return false;
            }
        }
        var $0 = this.progressCore(this.$6, $p0);
        this.$6 = false;
        if ($0 && ((this.$1 === 0) || (this.$1 > this.$7))) {
            $0 = false;
            this.$7++;
            if (this.$A != null) {
                var $1 = new ScriptFX.CancelEventArgs();
                this.$A.invoke(this, $1);
                $0 = $1.get_canceled();
            }
            if (!$0) {
                this.$6 = true;
                if (this.$2) {
                    this.$9 = !this.$9;
                }
                this.$8 = $p0;
                this.performRepetition(this.$9);
            }
        }
        return $0;
    },
    performCleanup: function () {},
    performRepetition: function (reversed) {},
    performSetup: function () {},
    play: function () {
        this.$4 = false;
        ScriptFX.UI.AnimationManager.$4(this);
    },
    stop: function (stopState) {
        ScriptFX.UI.AnimationManager.$5(this, stopState);
    }
}
ScriptFX.UI.AnimationManager = function () {}
ScriptFX.UI.AnimationManager.get_FPS = function () {
    return ScriptFX.UI.AnimationManager.$0;
}
ScriptFX.UI.AnimationManager.set_FPS = function (value) {
    ScriptFX.UI.AnimationManager.$0 = value;
    return value;
}
ScriptFX.UI.AnimationManager.$3 = function () {
    ScriptFX.UI.AnimationManager.$2 = 0;
    if (ScriptFX.UI.AnimationManager.$1.length === 0) {
        return;
    }
    var $0 = new Date().getTime();
    var $1 = ScriptFX.UI.AnimationManager.$1;
    var $2 = [];
    ScriptFX.UI.AnimationManager.$1 = null;
    var $enum1 = $1.getEnumerator();
    while ($enum1.moveNext()) {
        var $3 = $enum1.get_current();
        var $4 = $3.$F($0);
        if ($4) {
            $3.$E(true, 0);
        } else {
            $2.add($3);
        }
    }
    if ($2.length !== 0) {
        ScriptFX.UI.AnimationManager.$1 = $2;
        if (ScriptFX.UI.AnimationManager.$2 === 0) {
            ScriptFX.UI.AnimationManager.$2 = window.setTimeout(Delegate.create(null, ScriptFX.UI.AnimationManager.$3), 1000 / ScriptFX.UI.AnimationManager.$0);
        }
    }
}
ScriptFX.UI.AnimationManager.$4 = function ($p0) {
    if (ScriptFX.UI.AnimationManager.$1 == null) {
        ScriptFX.UI.AnimationManager.$1 = [];
    }
    ScriptFX.UI.AnimationManager.$1.add($p0);
    $p0.$D(false);
    if (ScriptFX.UI.AnimationManager.$2 === 0) {
        ScriptFX.UI.AnimationManager.$2 = window.setTimeout(Delegate.create(null, ScriptFX.UI.AnimationManager.$3), 1000 / ScriptFX.UI.AnimationManager.$0);
    }
}
ScriptFX.UI.AnimationManager.$5 = function ($p0, $p1) {
    $p0.$E(false, $p1);
    ScriptFX.UI.AnimationManager.$1.remove($p0);
}
ScriptFX.UI.AnimationSequence = function (animations) {
    ScriptFX.UI.AnimationSequence.constructBase(this, [null]);
    this.$10 = animations;
    this.$12 = -1;
}
ScriptFX.UI.AnimationSequence.prototype = {
    $10: null,
    $11: 0,
    $12: 0,
    $13: false,
    $14: 0,
    get_successionDelay: function () {
        return this.$11;
    },
    set_successionDelay: function (value) {
        this.$11 = value;
        return value;
    },
    playCore: function () {
        if (!this.get_isReversed()) {
            this.$12 = 0;
        } else {
            this.$12 = this.$10.length - 1;
        }
        this.$10[this.$12].$D(this.get_isReversed());
    },
    progressCore: function (startRepetition, timeStamp) {
        if (startRepetition) {
            if (!this.get_isReversed()) {
                this.$12 = 0;
            } else {
                this.$12 = this.$10.length - 1;
            }
            this.$13 = true;
        }
        var $0 = this.$10[this.$12];
        if (this.$13) {
            if ((this.$11 !== 0) && ((this.$14 + this.$11) > timeStamp)) {
                return false;
            }
            this.$13 = false;
            $0.$D(this.get_isReversed());
        }
        var $1 = $0.$F(timeStamp);
        if ($1) {
            $0.$E(true, 0);
            if (!this.get_isReversed()) {
                this.$12++;
            } else {
                this.$12--;
            }
            this.$13 = true;
            this.$14 = timeStamp;
        }
        return $1 && ((this.$12 === this.$10.length) || (this.$12 === -1));
    },
    stopCore: function (completed, stopState) {
        if (!completed) {
            var $0 = this.$10[this.$12];
            $0.$E(false, stopState);
        }
    }
}
ScriptFX.UI.Behavior = function (domElement, id) {
    ScriptFX.Application.current.registerDisposableObject(this);
    this.$0 = domElement;
    this.$1 = id;
    if (!String.isNullOrEmpty(id)) {
        if (id === 'control') {
            var $1 = domElement[id];
            if (($1 != null) && (Type.getInstanceType($1) === ScriptFX.UI._Core$4)) {
                delete domElement.control;
                ScriptFX.Application.current.unregisterDisposableObject($1);
                this.$3 = $1.get_$5();
            }
        }
        domElement[id] = this;
    }
    if (id !== 'control') {
        var $2 = domElement.control;
        if ($2 == null) {
            $2 = new ScriptFX.UI._Core$4(domElement);
        }
    }
    var $0 = domElement._behaviors;
    if ($0 == null) {
        $0 = [];
        domElement._behaviors = $0;
    }
    $0.add(this);
}
ScriptFX.UI.Behavior.getBehavior = function (domElement, type) {
    var $0 = domElement._behaviors;
    if ($0 != null) {
        var $enum1 = $0.getEnumerator();
        while ($enum1.moveNext()) {
            var $1 = $enum1.get_current();
            if (type.isAssignableFrom(Type.getInstanceType($1))) {
                return $1;
            }
        }
    }
    return null;
}
ScriptFX.UI.Behavior.getBehaviors = function (domElement, type) {
    var $0 = domElement._behaviors;
    if (isNullOrUndefined($0) || ($0.length === 0)) {
        return null;
    }
    if (type == null) {
        return $0.clone();
    }
    return $0.filter(Delegate.create(null, function ($p1_0) {
        return type.isAssignableFrom(Type.getInstanceType($p1_0));
    }));
}
ScriptFX.UI.Behavior.getNamedBehavior = function (domElement, id) {
    return domElement[id];
}
ScriptFX.UI.Behavior.prototype = {
    $0: null,
    $1: null,
    $2: null,
    $3: null,
    $4: false,
    get_domElement: function () {
        return this.$0;
    },
    get_domEvents: function () {
        if (this.$2 == null) {
            this.$2 = new ScriptFX.UI.DOMEventList(this.$0);
        }
        return this.$2;
    },
    get_events: function () {
        if (this.$3 == null) {
            this.$3 = new ScriptFX.EventList();
        }
        return this.$3;
    },
    get_$5: function () {
        return this.$3;
    },
    get_isDisposed: function () {
        return (this.$0 == null);
    },
    get_isInitializing: function () {
        return this.$4;
    },
    add_propertyChanged: function (value) {
        this.get_events().addHandler('PropertyChanged', value);
    },
    remove_propertyChanged: function (value) {
        this.get_events().removeHandler('PropertyChanged', value);
    },
    beginInitialize: function () {
        this.$4 = true;
    },
    dispose: function () {
        if (this.$2 != null) {
            this.$2.dispose();
        }
        if (this.$0 != null) {
            if (this.$1 != null) {
                if (ScriptFX.Application.current.get_isIE()) {
                    this.$0.removeAttribute(this.$1);
                } else {
                    delete this.$0[this.$1];
                }
            }
            var $0 = this.$0._behaviors;
            $0.remove(this);
            this.$0 = null;
            ScriptFX.Application.current.unregisterDisposableObject(this);
        }
    },
    endInitialize: function () {
        this.$4 = false;
    },
    raisePropertyChanged: function (propertyName) {
        var $0 = this.get_events().getHandler('PropertyChanged');
        if ($0 != null) {
            $0.invoke(this, new ScriptFX.PropertyChangedEventArgs(propertyName));
        }
    }
}
ScriptFX.UI.Color = function (red, green, blue) {
    this.$0 = red;
    this.$1 = green;
    this.$2 = blue;
}
ScriptFX.UI.Color.format = function (red, green, blue) {
    return String.format('#{0:X2}{1:X2}{2:X2}', red, green, blue);
}
ScriptFX.UI.Color.parse = function (s) {
    if (String.isNullOrEmpty(s)) {
        return null;
    }
    if ((s.length === 7) && s.startsWith('#')) {
        var $0 = parseInt(s.substr(1, 2), 16);
        var $1 = parseInt(s.substr(3, 2), 16);
        var $2 = parseInt(s.substr(5, 2), 16);
        return new ScriptFX.UI.Color($0, $1, $2);
    } else if (s.startsWith('rgb(') && s.endsWith(')')) {
        var $3 = s.substring(4, s.length - 1).split(',');
        if ($3.length === 3) {
            return new ScriptFX.UI.Color(parseInt($3[0].trim()), parseInt($3[1].trim()), parseInt($3[2].trim()));
        }
    }
    return null;
}
ScriptFX.UI.Color.prototype = {
    $0: 0,
    $1: 0,
    $2: 0,
    get_blue: function () {
        return this.$2;
    },
    get_green: function () {
        return this.$1;
    },
    get_red: function () {
        return this.$0;
    },
    toString: function () {
        return ScriptFX.UI.Color.format(this.$0, this.$1, this.$2);
    }
}
ScriptFX.UI.Control = function (domElement) {
    ScriptFX.UI.Control.constructBase(this, [domElement, 'control']);
}
ScriptFX.UI.Control.getControl = function (domElement) {
    return ScriptFX.UI.Behavior.getNamedBehavior(domElement, 'control');
}
ScriptFX.UI.Control.prototype = {
    add_disposing: function (value) {
        this.get_events().addHandler('disposing', value);
    },
    remove_disposing: function (value) {
        this.get_events().removeHandler('disposing', value);
    },
    dispose: function () {
        var $0 = this.get_domElement();
        if ($0 != null) {
            var $1 = this.get_events().getHandler('disposing');
            if ($1 != null) {
                $1.invoke(this, EventArgs.Empty);
            }
            var $2 = ScriptFX.UI.Behavior.getBehaviors($0, null);
            if ($2.length > 1) {
                var $enum1 = $2.getEnumerator();
                while ($enum1.moveNext()) {
                    var $3 = $enum1.get_current();
                    if ($3 !== this) {
                        $3.dispose();
                    }
                }
            }
        }
        ScriptFX.UI.Control.callBase(this, 'dispose');
    }
}
ScriptFX.UI.DOMEventList = function (element) {
    this.$0 = element;
    this.$1 = {};
}
ScriptFX.UI.DOMEventList.prototype = {
    $0: null,
    $1: null,
    attach: function (eventName, handler) {
        this.$0.attachEvent(eventName, handler);
        this.$1[eventName] = handler;
    },
    detach: function (eventName) {
        var $0 = this.$1[eventName];
        if ($0 != null) {
            this.$0.detachEvent(eventName, $0);
            delete this.$1[eventName];
            return true;
        }
        return false;
    },
    dispose: function () {
        if (this.$0 != null) {
            var $dict1 = this.$1;
            for (var $key2 in $dict1) {
                var $0 = {
                    key: $key2,
                    value: $dict1[$key2]
                };
                this.$0.detachEvent($0.key, $0.value);
            }
            this.$0 = null;
            this.$1 = null;
        }
    },
    isAttached: function (eventName) {
        return (this.$1[eventName] != null) ? true : false;
    }
}
ScriptFX.UI.DragDropEventArgs = function (dataObject) {
    ScriptFX.UI.DragDropEventArgs.constructBase(this);
    this.$1_0 = dataObject;
}
ScriptFX.UI.DragDropEventArgs.prototype = {
    $1_0: null,
    get_dataObject: function () {
        return this.$1_0;
    }
}
ScriptFX.UI.DragDropManager = function () {}
ScriptFX.UI.DragDropManager.get_canDragDrop = function () {
    return (ScriptFX.UI.DragDropManager.$0 != null);
}
ScriptFX.UI.DragDropManager.get_supportsDataTransfer = function () {
    return ScriptFX.UI.DragDropManager.$0.get_supportsDataTransfer();
}
ScriptFX.UI.DragDropManager.add_dragDropEnding = function (value) {
    ScriptFX.UI.DragDropManager.$3 = Delegate.combine(ScriptFX.UI.DragDropManager.$3, value);
}
ScriptFX.UI.DragDropManager.remove_dragDropEnding = function (value) {
    ScriptFX.UI.DragDropManager.$3 = Delegate.remove(ScriptFX.UI.DragDropManager.$3, value);
}
ScriptFX.UI.DragDropManager.add_dragDropStarting = function (value) {
    ScriptFX.UI.DragDropManager.$2 = Delegate.combine(ScriptFX.UI.DragDropManager.$2, value);
}
ScriptFX.UI.DragDropManager.remove_dragDropStarting = function (value) {
    ScriptFX.UI.DragDropManager.$2 = Delegate.remove(ScriptFX.UI.DragDropManager.$2, value);
}
ScriptFX.UI.DragDropManager.$5 = function () {
    if (ScriptFX.UI.DragDropManager.$3 != null) {
        ScriptFX.UI.DragDropManager.$3.invoke(null, new ScriptFX.UI.DragDropEventArgs(ScriptFX.UI.DragDropManager.$4));
    }
    ScriptFX.UI.DragDropManager.$4 = null;
}
ScriptFX.UI.DragDropManager.registerDragDropImplementation = function (dragDrop) {
    ScriptFX.UI.DragDropManager.$0 = dragDrop;
}
ScriptFX.UI.DragDropManager.registerDropTarget = function (target) {
    ScriptFX.UI.DragDropManager.$1.add(target);
}
ScriptFX.UI.DragDropManager.startDragDrop = function (data, dragVisual, dragOffset, source, context) {
    if (ScriptFX.UI.DragDropManager.$4 != null) {
        return false;
    }
    var $0 = [];
    var $enum1 = ScriptFX.UI.DragDropManager.$1.getEnumerator();
    while ($enum1.moveNext()) {
        var $1 = $enum1.get_current();
        if ($1.supportsDataObject(data)) {
            $0.add($1);
        }
    }
    if ($0.length === 0) {
        return false;
    }
    ScriptFX.UI.DragDropManager.$4 = data;
    if (ScriptFX.UI.DragDropManager.$2 != null) {
        ScriptFX.UI.DragDropManager.$2.invoke(null, new ScriptFX.UI.DragDropEventArgs(data));
    }
    ScriptFX.UI.DragDropManager.$0.dragDrop(new ScriptFX.UI._Core$0(source), context, $0, dragVisual, dragOffset, ScriptFX.UI.DragDropManager.$4);
    return true;
}
ScriptFX.UI.DragDropManager.unregisterDropTarget = function (target) {
    ScriptFX.UI.DragDropManager.$1.remove(target);
}
ScriptFX.UI._Core$0 = function (actualSource) {
    this.$0 = actualSource;
}
ScriptFX.UI._Core$0.prototype = {
    $0: null,
    get_domElement: function () {
        return this.$0.get_domElement();
    },
    onDragStart: function ($p0) {
        if (this.$0 != null) {
            this.$0.onDragStart($p0);
        }
    },
    onDrag: function ($p0) {
        if (this.$0 != null) {
            this.$0.onDrag($p0);
        }
    },
    onDragEnd: function ($p0, $p1) {
        if (this.$0 != null) {
            this.$0.onDragEnd($p0, $p1);
        }
        ScriptFX.UI.DragDropManager.$5();
    }
}
ScriptFX.UI.Element = function () {}
ScriptFX.UI.Element.addCSSClass = function (element, className) {
    var $0 = element.className;
    if ($0.indexOf(className) < 0) {
        element.className = $0 + ' ' + className;
    }
}
ScriptFX.UI.Element.containsCSSClass = function (element, className) {
    return element.className.split(' ').contains(className);
}
ScriptFX.UI.Element.getBounds = function (element) {
    var $0 = ScriptFX.UI.Element.getLocation(element);
    return ScriptFX.UI.$create_Bounds($0.left, $0.top, element.offsetWidth, element.offsetHeight);
}
ScriptFX.UI.Element.getLocation = function (element) {
    var $0 = 0;
    var $1 = 0;
    for (var $2 = element; $2 != null; $2 = $2.offsetParent) {
        $0 += $2.offsetLeft;
        $1 += $2.offsetTop;
    }
    return ScriptFX.UI.$create_Location($0, $1);
}
ScriptFX.UI.Element.getSize = function (element) {
    return ScriptFX.UI.$create_Size(element.offsetWidth, element.offsetHeight);
}
ScriptFX.UI.Element.removeCSSClass = function (element, className) {
    var $0 = ' ' + element.className + ' ';
    var $1 = $0.indexOf(' ' + className + ' ');
    if ($1 >= 0) {
        var $2 = $0.substr(0, $1) + ' ' + $0.substr($1 + className.length + 1);
        element.className = $2;
    }
}
ScriptFX.UI.Element.setLocation = function (element, location) {
    element.style.left = location.left + 'px';
    element.style.top = location.top + 'px';
}
ScriptFX.UI.Element.setSize = function (element, size) {
    element.style.width = size.width + 'px';
    element.style.height = size.height + 'px';
}
ScriptFX.UI.FadeEffect = function (domElement, duration, opacity) {
    ScriptFX.UI.FadeEffect.constructBase(this, [domElement, duration]);
    this.$14 = opacity;
}
ScriptFX.UI.FadeEffect.prototype = {
    $13: false,
    $14: 0,
    get_isFadingIn: function () {
        return this.$13;
    },
    fadeIn: function () {
        if (this.get_isPlaying()) {
            this.stop(0);
        }
        this.$13 = true;
        this.play();
    },
    fadeOut: function () {
        if (this.get_isPlaying()) {
            this.stop(0);
        }
        this.$13 = false;
        this.play();
    },
    performCleanup: function () {
        ScriptFX.UI.FadeEffect.callBase(this, 'performCleanup');
        if (!this.$13) {
            this.$15(0);
            this.get_domElement().style.display = 'none';
        }
    },
    performSetup: function () {
        ScriptFX.UI.FadeEffect.callBase(this, 'performSetup');
        if (this.$13) {
            this.$15(0);
            this.get_domElement().style.display = '';
        }
    },
    performTweening: function (frame) {
        if (this.$13) {
            this.$15(this.$14 * frame);
        } else {
            this.$15(this.$14 * (1 - frame));
        }
    },
    $15: function ($p0) {
        if (ScriptFX.Application.current.get_isIE()) {
            this.get_domElement().style.filter = 'alpha(opacity=' + ($p0 * 100) + ')';
        } else {
            this.get_domElement().style.opacity = $p0.toString();
        }
    }
}
ScriptFX.UI._Core$4 = function (domElement) {
    ScriptFX.UI._Core$4.constructBase(this, [domElement]);
}
ScriptFX.UI.OverlayBehavior = function (domElement, options) {
    ScriptFX.UI.OverlayBehavior.constructBase(this, [domElement, options.id]);
    this.$7 = document.createElement('div');
    this.$7.className = options.cssClass;
    var $0 = this.$7.style;
    $0.display = 'none';
    $0.top = '0px';
    $0.left = '0px';
    $0.width = '100%';
    if (ScriptFX.Application.current.get_isIE() && (ScriptFX.Application.current.get_host().get_majorVersion() < 7)) {
        $0.position = 'absolute';
    } else {
        this.$8 = true;
        $0.position = 'fixed';
        $0.height = '100%';
    }
    document.body.appendChild(this.$7);
    if (options.fadeInOutInterval !== 0) {
        this.$9 = new ScriptFX.UI.FadeEffect(this.$7, options.fadeInOutInterval, options.opacity);
        this.$9.set_easingFunction(Delegate.create(null, ScriptFX.UI.TimedAnimation.easeInOut));
        this.$9.add_stopped(Delegate.create(this, this.$C));
    }
}
ScriptFX.UI.OverlayBehavior.prototype = {
    $7: null,
    $8: false,
    $9: null,
    $A: null,
    $B: false,
    get_isVisible: function () {
        return this.$B;
    },
    add_visibilityChanged: function (value) {
        this.get_events().addHandler(ScriptFX.UI.OverlayBehavior.$6, value);
    },
    remove_visibilityChanged: function (value) {
        this.get_events().removeHandler(ScriptFX.UI.OverlayBehavior.$6, value);
    },
    dispose: function () {
        if (this.$9 != null) {
            this.$9.dispose();
            this.$9 = null;
        }
        if (this.$A != null) {
            window.detachEvent('onresize', this.$A);
            this.$A = null;
        }
        ScriptFX.UI.OverlayBehavior.callBase(this, 'dispose');
    },
    hide: function () {
        if ((!this.$B) || this.$9.get_isPlaying()) {
            return;
        }
        if (this.$A != null) {
            window.detachEvent('onresize', this.$A);
            this.$A = null;
        }
        if (this.$9 != null) {
            this.$9.fadeOut();
        } else {
            this.$7.style.display = 'none';
            this.$B = false;
            var $0 = this.get_events().getHandler(ScriptFX.UI.OverlayBehavior.$6);
            if ($0 != null) {
                $0.invoke(this, EventArgs.Empty);
            }
        }
    },
    $C: function ($p0, $p1) {
        this.$B = this.$9.get_isFadingIn();
        var $0 = this.get_events().getHandler(ScriptFX.UI.OverlayBehavior.$6);
        if ($0 != null) {
            $0.invoke(this, EventArgs.Empty);
        }
    },
    $D: function () {
        this.$7.style.height = document.documentElement.offsetHeight + 'px';
    },
    show: function () {
        if (this.$B || this.$9.get_isPlaying()) {
            return;
        }
        if (!this.$8) {
            this.$7.style.height = document.documentElement.offsetHeight + 'px';
            this.$A = Delegate.create(this, this.$D);
            window.attachEvent('onresize', this.$A);
        }
        if (this.$9 != null) {
            this.$9.fadeIn();
        } else {
            this.$7.style.display = '';
            this.$B = true;
            var $0 = this.get_events().getHandler(ScriptFX.UI.OverlayBehavior.$6);
            if ($0 != null) {
                $0.invoke(this, EventArgs.Empty);
            }
        }
    }
}
ScriptFX.UI.PopupBehavior = function (domElement, options) {
    ScriptFX.UI.PopupBehavior.constructBase(this, [domElement, options.id]);
    this.$6 = options;
    domElement.style.position = 'absolute';
    domElement.style.display = 'none';
}
ScriptFX.UI.PopupBehavior.prototype = {
    $6: null,
    $7: null,
    dispose: function () {
        if (this.get_domElement() != null) {
            this.hide();
        }
        ScriptFX.UI.PopupBehavior.callBase(this, 'dispose');
    },
    hide: function () {
        this.get_domElement().style.display = 'none';
        if (this.$7 != null) {
            this.$7.parentNode.removeChild(this.$7);
            this.$7 = null;
        }
    },
    show: function () {
        var $0 = this.get_domElement().offsetParent;
        if ($0 == null) {
            $0 = document.documentElement;
        }
        this.get_domElement().style.display = 'block';
        var $1 = 0;
        var $2 = 0;
        var $3 = 1;
        var $4 = 1;
        var $5 = false;
        var $6 = ScriptFX.UI.Element.getBounds($0);
        var $7 = ScriptFX.UI.Element.getBounds(this.get_domElement());
        var $8 = ScriptFX.UI.Element.getBounds(this.$6.referenceElement);
        var $9 = $8.left - $6.left;
        var $A = $8.top - $6.top;
        switch (this.$6.mode) {
        case 0:
            $1 = Math.round($8.width / 2 - $7.width / 2);
            $2 = Math.round($8.height / 2 - $7.height / 2);
            break;
        case 1:
            $1 = 0;
            $2 = -$7.height;
            break;
        case 2:
            $1 = $8.width - $7.width;
            $2 = -$7.height;
            break;
        case 3:
            $1 = $8.width - $7.width;
            $2 = $8.height;
            break;
        case 4:
            $1 = 0;
            $2 = $8.height;
            break;
        case 5:
            $1 = $8.left;
            $2 = $8.top;
            $5 = true;
            break;
        case 6:
            $1 = $8.left + $8.width - $7.width;
            $2 = $8.top;
            $3 = -1;
            $5 = true;
            break;
        case 7:
            $1 = $8.left + $8.width - $7.width;
            $2 = $8.top + $8.height - $7.height;
            $3 = -1;
            $4 = -1;
            $5 = true;
            break;
        case 8:
            $1 = $8.left;
            $2 = $8.top + $8.height - $7.height;
            $4 = -1;
            $5 = true;
            break;
        }
        if (!$5) {
            $1 += $9 + this.$6.xOffset;
            $2 += $A + this.$6.yOffset;
        } else {
            $1 += $9 + this.$6.xOffset * $3;
            $2 += $A + this.$6.yOffset * $4;
        }
        var $B = document.body.clientWidth;
        if ($1 + $7.width > $B - 2) {
            $1 -= ($1 + $7.width - $B + 2);
        }
        if ($1 < 0) {
            $1 = 2;
        }
        if ($2 < 0) {
            $2 = 2;
        }
        ScriptFX.UI.Element.setLocation(this.get_domElement(), ScriptFX.UI.$create_Location($1, $2));
        var $C = ScriptFX.Application.current.get_host();
        if (($C.get_name() === 1) && ($C.get_majorVersion() < 7)) {
            this.$7 = document.createElement('IFRAME');
            this.$7.src = 'javascript:false;';
            this.$7.scrolling = 'no';
            this.$7.style.position = 'absolute';
            this.$7.style.display = 'block';
            this.$7.style.border = 'none';
            this.$7.style.filter = 'progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0)';
            this.$7.style.left = $1 + 'px';
            this.$7.style.top = $2 + 'px';
            this.$7.style.width = $7.width + 'px';
            this.$7.style.height = $7.height + 'px';
            this.$7.style.zIndex = 1;
            this.get_domElement().parentNode.insertBefore(this.$7, this.get_domElement());
        }
    }
}
ScriptFX.UI.TimedAnimation = function (domElement, duration) {
    ScriptFX.UI.TimedAnimation.constructBase(this, [domElement]);
    this.$10 = duration;
}
ScriptFX.UI.TimedAnimation.easeIn = function (t) {
    return t * t;
}
ScriptFX.UI.TimedAnimation.easeInOut = function (t) {
    t = t * 2;
    if (t < 1) {
        return t * t / 2;
    }
    return -((--t) * (t - 2) - 1) / 2;
}
ScriptFX.UI.TimedAnimation.easeOut = function (t) {
    return -t * (t - 2);
}
ScriptFX.UI.TimedAnimation.prototype = {
    $10: 0,
    $11: null,
    $12: 0,
    get_duration: function () {
        return this.$10;
    },
    set_duration: function (value) {
        this.$10 = value;
        return value;
    },
    get_easingFunction: function () {
        return this.$11;
    },
    set_easingFunction: function (value) {
        this.$11 = value;
        return value;
    },
    playCore: function () {
        this.$12 = new Date().getTime();
        this.progressCore(false, this.$12);
    },
    progressCore: function (startRepetition, timeStamp) {
        var $0 = 0;
        var $1 = false;
        if (!startRepetition) {
            $0 = (timeStamp - this.$12) / this.$10;
            if (!this.get_isReversed()) {
                $1 = ($0 >= 1);
                $0 = Math.min(1, $0);
            } else {
                $0 = 1 - $0;
                $1 = ($0 <= 0);
                $0 = Math.max(0, $0);
            } if ((!$1) && (this.$11 != null)) {
                $0 = this.$11.invoke($0);
            }
        } else {
            this.$12 = timeStamp;
            if (this.get_isReversed()) {
                $0 = 1;
            }
        }
        this.performTweening($0);
        return $1;
    },
    stopCore: function (completed, stopState) {
        if (!completed) {
            if (stopState === 0) {
                this.performTweening(1);
            } else if (stopState === 2) {
                this.performTweening(0);
            }
        }
    }
}
ScriptFX.Application.createClass('ScriptFX.Application', null, IServiceProvider, IServiceContainer, ScriptFX.IEventManager);
ScriptFX.CancelEventArgs.createClass('ScriptFX.CancelEventArgs', EventArgs);
ScriptFX.CollectionChangedEventArgs.createClass('ScriptFX.CollectionChangedEventArgs', EventArgs);
ScriptFX.ApplicationUnloadingEventArgs.createClass('ScriptFX.ApplicationUnloadingEventArgs', EventArgs);
ScriptFX.HistoryManager.createClass('ScriptFX.HistoryManager', null, IDisposable);
ScriptFX.HistoryEventArgs.createClass('ScriptFX.HistoryEventArgs', EventArgs);
ScriptFX.HostInfo.createClass('ScriptFX.HostInfo');
ScriptFX.EventList.createClass('ScriptFX.EventList');
ScriptFX.JSON.createClass('ScriptFX.JSON');
ScriptFX.PropertyChangedEventArgs.createClass('ScriptFX.PropertyChangedEventArgs', EventArgs);
ScriptFX.ObservableCollection.createClass('ScriptFX.ObservableCollection', null, IDisposable, IArray, IEnumerable, ScriptFX.INotifyCollectionChanged);
ScriptFX.Net.HTTPRequest.createClass('ScriptFX.Net.HTTPRequest', null, IDisposable);
ScriptFX.Net.HTTPRequestManager.createClass('ScriptFX.Net.HTTPRequestManager');
ScriptFX.Net.HTTPTransport.createClass('ScriptFX.Net.HTTPTransport', null, IDisposable);
ScriptFX.Net.PostHTTPRequestEventArgs.createClass('ScriptFX.Net.PostHTTPRequestEventArgs', EventArgs);
ScriptFX.Net.PreHTTPRequestEventArgs.createClass('ScriptFX.Net.PreHTTPRequestEventArgs', EventArgs);
ScriptFX.Net._Core$2.createClass('ScriptFX.Net._Core$2', null, ScriptFX.Net.IHTTPResponse);
ScriptFX.Net._Core$3.createClass('ScriptFX.Net._Core$3', ScriptFX.Net.HTTPTransport);
ScriptFX.UI.Animation.createClass('ScriptFX.UI.Animation', null, IDisposable);
ScriptFX.UI.AnimationManager.createClass('ScriptFX.UI.AnimationManager');
ScriptFX.UI.AnimationSequence.createClass('ScriptFX.UI.AnimationSequence', ScriptFX.UI.Animation);
ScriptFX.UI.Behavior.createClass('ScriptFX.UI.Behavior', null, IDisposable, ScriptFX.ISupportInitialize, ScriptFX.INotifyPropertyChanged);
ScriptFX.UI.Color.createClass('ScriptFX.UI.Color');
ScriptFX.UI.Control.createClass('ScriptFX.UI.Control', ScriptFX.UI.Behavior, ScriptFX.INotifyDisposing);
ScriptFX.UI.DOMEventList.createClass('ScriptFX.UI.DOMEventList', null, IDisposable);
ScriptFX.UI.DragDropEventArgs.createClass('ScriptFX.UI.DragDropEventArgs', EventArgs);
ScriptFX.UI.DragDropManager.createClass('ScriptFX.UI.DragDropManager');
ScriptFX.UI._Core$0.createClass('ScriptFX.UI._Core$0', null, ScriptFX.UI.IDragSource);
ScriptFX.UI.Element.createClass('ScriptFX.UI.Element');
ScriptFX.UI.TimedAnimation.createClass('ScriptFX.UI.TimedAnimation', ScriptFX.UI.Animation);
ScriptFX.UI.FadeEffect.createClass('ScriptFX.UI.FadeEffect', ScriptFX.UI.TimedAnimation);
ScriptFX.UI._Core$4.createClass('ScriptFX.UI._Core$4', ScriptFX.UI.Control);
ScriptFX.UI.OverlayBehavior.createClass('ScriptFX.UI.OverlayBehavior', ScriptFX.UI.Behavior);
ScriptFX.UI.PopupBehavior.createClass('ScriptFX.UI.PopupBehavior', ScriptFX.UI.Behavior);
ScriptFX.Application.current = new ScriptFX.Application();
ScriptFX.JSON.$0 = null;
ScriptFX.Net.HTTPRequestManager.$0 = null;
ScriptFX.Net.HTTPRequestManager.$1 = null;
ScriptFX.Net.HTTPRequestManager.$2 = 0;
ScriptFX.Net.HTTPRequestManager.$3 = [];
ScriptFX.Net.HTTPRequestManager.$4 = null;
ScriptFX.UI.AnimationManager.$0 = 100;
ScriptFX.UI.AnimationManager.$1 = null;
ScriptFX.UI.AnimationManager.$2 = 0;
ScriptFX.UI.DragDropManager.$0 = null;
ScriptFX.UI.DragDropManager.$1 = [];
ScriptFX.UI.DragDropManager.$2 = null;
ScriptFX.UI.DragDropManager.$3 = null;
ScriptFX.UI.DragDropManager.$4 = null;
ScriptFX.UI.OverlayBehavior.$6 = 'visibilityChanged';