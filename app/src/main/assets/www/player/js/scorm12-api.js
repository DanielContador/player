/*
    http://www.JSON.org/json2.js
    2010-08-25

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    See http://www.JSON.org/js.html


    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.


    This file creates a global JSON object containing two methods: stringify
    and parse.

        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.

            This method produces a JSON text from a JavaScript value.

            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the value

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 ? '0' + n : n;
                    }

                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.

            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'


            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });
            // text is '["Date(---current time---)"]'


        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });


    This is a reference implementation. You are free to copy, modify, or
    redistribute.
*/

/*jslint evil: true, strict: false */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
    call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

if (!this.JSON) {
    this.JSON = {};
}

(function () {

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf()) ?
                   this.getUTCFullYear()   + '-' +
                 f(this.getUTCMonth() + 1) + '-' +
                 f(this.getUTCDate())      + 'T' +
                 f(this.getUTCHours())     + ':' +
                 f(this.getUTCMinutes())   + ':' +
                 f(this.getUTCSeconds())   + 'Z' : null;
        };

        String.prototype.toJSON =
        Number.prototype.toJSON =
        Boolean.prototype.toJSON = function (key) {
            return this.valueOf();
        };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ?
            '"' + string.replace(escapable, function (a) {
                var c = meta[a];
                return typeof c === 'string' ? c :
                    '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' :
            '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0 ? '[]' :
                    gap ? '[\n' + gap +
                            partial.join(',\n' + gap) + '\n' +
                                mind + ']' :
                          '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    k = rep[i];
                    if (typeof k === 'string') {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0 ? '{}' :
                gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' +
                        mind + '}' : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                     typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/
.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
.replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function' ?
                    walk({'': j}, '') : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());

/*
Copyright (c) 2005-2010 Yusuke Kawasaki. All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions
are met:

1. Redistributions of source code must retain the above copyright
   notice, this list of conditions and the following disclaimer.
2. Redistributions in binary form must reproduce the above copyright
   notice, this list of conditions and the following disclaimer in
   the documentation and/or other materials provided with the
   distribution.
3. Neither the name of the author nor the names of its contributors
   may be used to endorse or promote products derived from this 
   software without specific, prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
``AS IS'' AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS
FOR A PARTICULAR PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL THE
COPYRIGHT HOLDERS OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
INCIDENTAL, SPECIAL, EXEMPLARY OR CONSEQUENTIAL DAMAGES (INCLUDING,
BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT
OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
SUCH DAMAGE.
*/
// ================================================================
//  jkl-parsexml.js ---- JavaScript Kantan Library for Parsing XML
//  http://www.kawa.net/works/js/jkl/parsexml.html
// ================================================================
//  v0.01  2005/05/18  first release
//  v0.02  2005/05/20  Opera 8.0beta may be abailable but somtimes crashed
//  v0.03  2005/05/20  overrideMimeType( "text/xml" );
//  v0.04  2005/05/21  class variables: REQUEST_TYPE, RESPONSE_TYPE
//  v0.05  2005/05/22  use Msxml2.DOMDocument.5.0 for GET method on IE6
//  v0.06  2005/05/22  CDATA_SECTION_NODE
//  v0.07  2005/05/23  use Microsoft.XMLDOM for GET method on IE6
//  v0.10  2005/10/11  new function: ParseXMLToObject.ParseXML.HTTP.responseText()
//  v0.11  2005/10/13  new sub class: ParseXMLToObject.ParseXML.Text, JSON and DOM.
//  v0.12  2005/10/14  new sub class: ParseXMLToObject.ParseXML.CSV and CSVmap.
//  v0.13  2005/10/28  bug fixed: TEXT_NODE regexp for white spaces
//  v0.14  2005/11/06  bug fixed: TEXT_NODE regexp at Safari
//  v0.15  2005/11/08  bug fixed: ParseXMLToObject.ParseXML.CSV.async() method
//  v0.16  2005/11/15  new sub class: LoadVars, and UTF-8 text on Safari
//  v0.18  2005/11/16  improve: UTF-8 text file on Safari
//  v0.19  2006/02/03  use XMLHTTPRequest instead of ActiveX on IE7,iCab
//  v0.20  2006/03/22  (skipped)
//  v0.21  2006/11/30  use ActiveX again on IE7
//  v0.22  2007/01/04  ParseXMLToObject.ParseXML.JSON.parseResponse() updated
//  v0.22c 2010/01/07  New BSD License declaration added. no code changed
// ================================================================

//Note:
/*
This file has been modified from its original format in the folloing ways
JKL has been changed to ParseXMLToObject for compatability with existing applications
*/
if ( typeof(ParseXMLToObject) == 'undefined' ) ParseXMLToObject = function() {};

// ================================================================
//  class: ParseXMLToObject.ParseXML 

/** @constructor */
ParseXMLToObject.ParseXML = function ( url, query, method ) {
    //console.log( "new ParseXMLToObject.ParseXML( '"+url+"', '"+query+"', '"+method+"' );" );
    this.http = new ParseXMLToObject.ParseXML.HTTP( url, query, method, false );
    return this;
};

// ================================================================
//  class variables

ParseXMLToObject.ParseXML.VERSION = "0.22";
ParseXMLToObject.ParseXML.MIME_TYPE_XML  = "text/xml";
ParseXMLToObject.ParseXML.MAP_NODETYPE = [
    "",
    "ELEMENT_NODE",                 // 1
    "ATTRIBUTE_NODE",               // 2
    "TEXT_NODE",                    // 3
    "CDATA_SECTION_NODE",           // 4
    "ENTITY_REFERENCE_NODE",        // 5
    "ENTITY_NODE",                  // 6
    "PROCESSING_INSTRUCTION_NODE",  // 7
    "COMMENT_NODE",                 // 8
    "DOCUMENT_NODE",                // 9
    "DOCUMENT_TYPE_NODE",           // 10
    "DOCUMENT_FRAGMENT_NODE",       // 11
    "NOTATION_NODE"                 // 12
];

// ================================================================
//  define callback function (ajax)

ParseXMLToObject.ParseXML.prototype.async = function ( func, args ) {
    this.callback_func = func;      // callback function
    this.callback_arg  = args;      // first argument
};

ParseXMLToObject.ParseXML.prototype.onerror = function ( func, args ) {
    this.onerror_func = func;       // callback function
};

// ================================================================
//  method: parse()
//  return: parsed object
//  Download a file from remote server and parse it.

ParseXMLToObject.ParseXML.prototype.parse = function () {
    if ( ! this.http ) return;

    // set onerror call back 
    if ( this.onerror_func ) {
        this.http.onerror( this.onerror_func );
    }

    if ( this.callback_func ) {                             // async mode
        var copy = this;
        var proc = function() {
            if ( ! copy.http ) return;
            var data = copy.parseResponse();
            copy.callback_func( data, copy.callback_arg );  // call back
        };
        this.http.async( proc );
    }

    this.http.load();

    if ( ! this.callback_func ) {                           // sync mode
        var data = this.parseResponse();
        return data;
    }
};

// ================================================================
//  every child/children into array
ParseXMLToObject.ParseXML.prototype.setOutputArrayAll = function () {
    this.setOutputArray( true );
}
//  a child into scalar, children into array
ParseXMLToObject.ParseXML.prototype.setOutputArrayAuto = function () {
    this.setOutputArray( null );
}
//  every child/children into scalar (first sibiling only)
ParseXMLToObject.ParseXML.prototype.setOutputArrayNever = function () {
    this.setOutputArray( false );
}
//  specified child/children into array, other child/children into scalar
ParseXMLToObject.ParseXML.prototype.setOutputArrayElements = function ( list ) {
    this.setOutputArray( list );
}
//  specify how to treate child/children into scalar/array
ParseXMLToObject.ParseXML.prototype.setOutputArray = function ( mode ) {
    if ( typeof(mode) == "string" ) {
        mode = [ mode ];                // string into array
    }
    if ( mode && typeof(mode) == "object" ) {
        if ( mode.length < 0 ) {
            mode = false;               // false when array == [] 
        } else {
            var hash = {};
            for( var i=0; i<mode.length; i++ ) {
                hash[mode[i]] = true;
            }
            mode = hash;                // array into hashed array
            if ( mode["*"] ) {
                mode = true;            // true when includes "*"
            }
        } 
    } 
    this.usearray = mode;
}

// ================================================================
//  method: parseResponse()

ParseXMLToObject.ParseXML.prototype.parseResponse = function () {
    var root = this.http.documentElement();//he root object
    var data = this.parseDocument( root );
    return data;
}

// ================================================================
//  convert from DOM root node to JavaScript Object 
//  method: parseElement( rootElement )

ParseXMLToObject.ParseXML.prototype.parseDocument = function ( root ) {
//root: object
    //console.log( "parseDocument: "+root );
    if ( ! root ) return;

    var ret = this.parseElement( root );            // parse root node
    //console.log( "parsed: "+ret );

    if ( this.usearray == true ) {                  // always into array
        ret = [ ret ];
    } else if ( this.usearray == false ) {          // always into scalar
        //
    } else if ( this.usearray == null ) {           // automatic
        //
    } else if ( this.usearray[root.nodeName] ) {    // specified tag
        ret = [ ret ];
    }

    var json = {};
    json[root.nodeName] = ret;                      // root nodeName
    return json;
};

// ================================================================
//  convert from DOM Element to JavaScript Object 
//  method: parseElement( element )

ParseXMLToObject.ParseXML.prototype.parseElement = function ( elem ) {
    //console.log( "nodeType: "+ParseXMLToObject.ParseXML.MAP_NODETYPE[elem.nodeType]+" <"+elem.nodeName+">" );

    //  COMMENT_NODE

    if ( elem.nodeType == 7 ) {
        return;
    }

    //  TEXT_NODE CDATA_SECTION_NODE

    if ( elem.nodeType == 3 || elem.nodeType == 4 ) {
        // var bool = elem.nodeValue.match( /[^\u0000-\u0020]/ );
        var bool = elem.nodeValue.match( /[^\x00-\x20]/ ); // for Safari
        if ( bool == null ) return;     // ignore white spaces
        //console.log( "TEXT_NODE: "+elem.nodeValue.length+ " "+bool );
        return elem.nodeValue;
    }

    var retval;
    var cnt = {};

    //  parse attributes

    if ( elem.attributes && elem.attributes.length ) {
        retval = {};
        for ( var i=0; i<elem.attributes.length; i++ ) {
            var key = elem.attributes[i].nodeName;
            if ( typeof(key) != "string" ) continue;
            var val = elem.attributes[i].nodeValue;
            if ( ! val ) continue;
            if ( typeof(cnt[key]) == "undefined" ) cnt[key] = 0;
            cnt[key] ++;
            this.addNode( retval, key, cnt[key], val );
        }
    }

    //  parse child nodes (recursive)

    if ( elem.childNodes && elem.childNodes.length ) {
        var textonly = true;
        if ( retval ) textonly = false;        // some attributes exists
        for ( var i=0; i<elem.childNodes.length && textonly; i++ ) {
            var ntype = elem.childNodes[i].nodeType;
            if ( ntype == 3 || ntype == 4 ) continue;
            textonly = false;
        }
        if ( textonly ) {
            if ( ! retval ) retval = "";
            for ( var i=0; i<elem.childNodes.length; i++ ) {
                retval += elem.childNodes[i].nodeValue;
            }
        } else {
            if ( ! retval ) retval = {};
            for ( var i=0; i<elem.childNodes.length; i++ ) {
                var key = elem.childNodes[i].nodeName;
                if ( typeof(key) != "string" ) continue;
                var val = this.parseElement( elem.childNodes[i] );
                if ( ! val ) continue;
                if ( typeof(cnt[key]) == "undefined" ) cnt[key] = 0;
                cnt[key] ++;
                this.addNode( retval, key, cnt[key], val );
            }
        }
    }
    return retval;
};

// ================================================================
//  method: addNode( hash, key, count, value )

ParseXMLToObject.ParseXML.prototype.addNode = function ( hash, key, cnts, val ) {
    if ( this.usearray == true ) {              // into array
        if ( cnts == 1 ) hash[key] = [];
        hash[key][hash[key].length] = val;      // push
    } else if ( this.usearray == false ) {      // into scalar
        if ( cnts == 1 ) hash[key] = val;       // only 1st sibling
    } else if ( this.usearray == null ) {
        if ( cnts == 1 ) {                      // 1st sibling
            hash[key] = val;
        } else if ( cnts == 2 ) {               // 2nd sibling
            hash[key] = [ hash[key], val ];
        } else {                                // 3rd sibling and more
            hash[key][hash[key].length] = val;
        }
    } else if ( this.usearray[key] ) {
        if ( cnts == 1 ) hash[key] = [];
        hash[key][hash[key].length] = val;      // push
    } else {
        if ( cnts == 1 ) hash[key] = val;       // only 1st sibling
    }
};

// ================================================================
//  class: ParseXMLToObject.ParseXML.HTTP
//  constructer: new ParseXMLToObject.ParseXML.HTTP()

/** @constructor */
ParseXMLToObject.ParseXML.HTTP = function( url, query, method, textmode ) {
    //console.log( "new ParseXMLToObject.ParseXML.HTTP( '"+url+"', '"+query+"', '"+method+"', '"+textmode+"' );" );
    this.url = url;
    if ( typeof(query) == "string" ) {
        this.query = query;
    } else {
        this.query = "";
    }
    if ( method ) {
        this.method = method;
    } else if ( typeof(query) == "string" ) {
        this.method = "POST";
    } else {
        this.method = "GET";
    }
    this.textmode = textmode ? true : false;
    this.req = null;
    this.xmldom_flag = false;
    this.onerror_func  = null;
    this.callback_func = null;
    this.already_done = null;
    return this;
};

// ================================================================
//  class variables

ParseXMLToObject.ParseXML.HTTP.REQUEST_TYPE  = "application/x-www-form-urlencoded";
ParseXMLToObject.ParseXML.HTTP.ACTIVEX_XMLDOM  = "Microsoft.XMLDOM";  // Msxml2.DOMDocument.5.0
ParseXMLToObject.ParseXML.HTTP.ACTIVEX_XMLHTTP = "Microsoft.XMLHTTP"; // Msxml2.XMLHTTP.3.0
ParseXMLToObject.ParseXML.HTTP.EPOCH_TIMESTAMP = "Thu, 01 Jun 1970 00:00:00 GMT"

// ================================================================

ParseXMLToObject.ParseXML.HTTP.prototype.onerror = ParseXMLToObject.ParseXML.prototype.onerror;
ParseXMLToObject.ParseXML.HTTP.prototype.async = function( func ) {
    this.async_func = func;
}

// ================================================================
//  [IE+IXMLDOMElement]
//      XML     text/xml            OK
//      XML     application/rdf+xml OK
//      TEXT    text/plain          NG
//      TEXT    others              NG
//  [IE+IXMLHttpRequest]
//      XML     text/xml            OK
//      XML     application/rdf+xml NG
//      TEXT    text/plain          OK
//      TEXT    others              OK
//  [Firefox+XMLHttpRequest]
//      XML     text/xml            OK
//      XML     application/rdf+xml OK (overrideMimeType)
//      TEXT    text/plain          OK
//      TEXT    others              OK (overrideMimeType)
//  [Opera+XMLHttpRequest]
//      XML     text/xml            OK
//      XML     application/rdf+xml OK
//      TEXT    text/plain          OK
//      TEXT    others              OK
// ================================================================

ParseXMLToObject.ParseXML.HTTP.prototype.load = function() {
    // create XMLHttpRequest object
    if ( window.ActiveXObject ) {                           // IE5.5,6,7
        var activex = ParseXMLToObject.ParseXML.HTTP.ACTIVEX_XMLHTTP;    // IXMLHttpRequest
        if ( this.method == "GET" && ! this.textmode ) {
            // use IXMLDOMElement to accept any mime types
            // because overrideMimeType() is not available on IE6
            activex = ParseXMLToObject.ParseXML.HTTP.ACTIVEX_XMLDOM;     // IXMLDOMElement
        }
        //console.log( "new ActiveXObject( '"+activex+"' )" );
        this.req = new ActiveXObject( activex );
    } else if ( window.XMLHttpRequest ) {                   // Firefox, Opera, iCab
        //console.log( "new XMLHttpRequest()" );
        this.req = new XMLHttpRequest();
    }

    // async mode when call back function is specified
    var async_flag = this.async_func ? true : false;
    //console.log( "async: "+ async_flag );

    // open for XMLHTTPRequest (not for IXMLDOMElement)
    if ( typeof(this.req.send) != "undefined" ) {
        //console.log( "open( '"+this.method+"', '"+this.url+"', "+async_flag+" );" );
        this.req.open( this.method, this.url, async_flag );
    }

//  // If-Modified-Since: Thu, 01 Jun 1970 00:00:00 GMT
//  if ( typeof(this.req.setRequestHeader) != "undefined" ) {
//      //console.log( "If-Modified-Since"+ParseXMLToObject.ParseXML.HTTP.EPOCH_TIMESTAMP );
//      this.req.setRequestHeader( "If-Modified-Since", ParseXMLToObject.ParseXML.HTTP.EPOCH_TIMESTAMP );
//  }

    // Content-Type: application/x-www-form-urlencoded (request header)
    // Some server does not accept without request content-type.
    if ( typeof(this.req.setRequestHeader) != "undefined" ) {
        //console.log( "Content-Type: "+ParseXMLToObject.ParseXML.HTTP.REQUEST_TYPE+" (request)" );
        this.req.setRequestHeader( "Content-Type", ParseXMLToObject.ParseXML.HTTP.REQUEST_TYPE );
    }

    // Content-Type: text/xml (response header)
    // FireFox does not accept other mime types like application/rdf+xml etc.
    if ( typeof(this.req.overrideMimeType) != "undefined" && ! this.textmode ) {
        //console.log( "Content-Type: "+ParseXMLToObject.ParseXML.MIME_TYPE_XML+" (response)" );
        this.req.overrideMimeType( ParseXMLToObject.ParseXML.MIME_TYPE_XML );
    }

    // set call back handler when async mode
    if ( async_flag ) {
        var copy = this;
        copy.already_done = false;                  // not parsed yet
        var check_func = function () {
            if ( copy.req.readyState != 4 ) return;
            //console.log( "readyState(async): "+copy.req.readyState );
            var succeed = copy.checkResponse();
            //console.log( "checkResponse(async): "+succeed );
            if ( ! succeed ) return;                // failed
            if ( copy.already_done ) return;        // parse only once
            copy.already_done = true;               // already parsed
            copy.async_func();                      // call back async
        };
        this.req.onreadystatechange = check_func;
        // for document.implementation.createDocument
        // this.req.onload = check_func;
    }

    // send the request and query string
    if ( typeof(this.req.send) != "undefined" ) {
        //console.log( "XMLHTTPRequest: send( '"+this.query+"' );" );
		this.req.send( this.query );                        // XMLHTTPRequest
	} else if ( typeof(this.req.load) != "undefined" ) {
        //console.log( "IXMLDOMElement: load( '"+this.url+"' );" );
        this.req.async = async_flag;
        this.req.load( this.url );                          // IXMLDOMElement
    }

    // just return when async mode
    if ( async_flag ) return;

    var succeed = this.checkResponse();
    //console.log( "checkResponse(sync): "+succeed );
}

// ================================================================
//  method: checkResponse()

ParseXMLToObject.ParseXML.HTTP.prototype.checkResponse = function() {
    // parseError on IXMLDOMElement
    if ( this.req.parseError && this.req.parseError.errorCode != 0 ) {
        //console.log( "parseError: "+this.req.parseError.reason );
        if ( this.onerror_func ) this.onerror_func( this.req.parseError.reason );
        return false;                       // failed
    }

    // HTTP response code
    if ( this.req.status-0 > 0 &&
         this.req.status != 200 &&          // OK
         this.req.status != 206 &&          // Partial Content
         this.req.status != 304 ) {         // Not Modified
        //console.log( "status: "+this.req.status );
        if ( this.onerror_func ) this.onerror_func( this.req.status );
        return false;                       // failed
    }

    return true;                            // succeed
}

// ================================================================
//  method: documentElement()
//  return: XML DOM in response body

ParseXMLToObject.ParseXML.HTTP.prototype.documentElement = function() {
    //console.log( "documentElement: "+this.req );
    if ( ! this.req ) return;
    if ( this.req.responseXML ) {
        return this.req.responseXML.documentElement;    // XMLHTTPRequest
    } else {
        return this.req.documentElement;                // IXMLDOMDocument
    }
}

// ================================================================
//  method: responseText()
//  return: text string in response body

ParseXMLToObject.ParseXML.HTTP.prototype.responseText = function() {
    //console.log( "responseText: "+this.req );
    if ( ! this.req ) return;

    //  Safari and Konqueror cannot understand the encoding of text files.
    if ( navigator.appVersion.match( "KHTML" ) ) {
        var esc = escape( this.req.responseText );
//        debug.print( "escape: "+esc );
        if ( ! esc.match("%u") && esc.match("%") ) {
            return decodeURIComponent(esc);
        }
    }

    return this.req.responseText;
}

// ================================================================
//  http://msdn.microsoft.com/library/en-us/xmlsdk/html/d051f7c5-e882-42e8-a5b6-d1ce67af275c.asp
// ================================================================

/*!
  * Reqwest! A general purpose XHR connection manager
  * license MIT (c) Dustin Diaz 2015
  * https://github.com/ded/reqwest
  */
!function(e,t,n){typeof module!="undefined"&&module.exports?module.exports=n():typeof define=="function"&&define.amd?define(n):t[e]=n()}("reqwest",this,function(){function succeed(e){var t=protocolRe.exec(e.url);return t=t&&t[1]||context.location.protocol,httpsRe.test(t)?twoHundo.test(e.request.status):!!e.request.response}function handleReadyState(e,t,n){return function(){if(e._aborted)return n(e.request);if(e._timedOut)return n(e.request,"Request is aborted: timeout");e.request&&e.request[readyState]==4&&(e.request.onreadystatechange=noop,succeed(e)?t(e.request):n(e.request))}}function setHeaders(e,t){var n=t.headers||{},r;n.Accept=n.Accept||defaultHeaders.accept[t.type]||defaultHeaders.accept["*"];var i=typeof FormData=="function"&&t.data instanceof FormData;!t.crossOrigin&&!n[requestedWith]&&(n[requestedWith]=defaultHeaders.requestedWith),!n[contentType]&&!i&&(n[contentType]=t.contentType||defaultHeaders.contentType);for(r in n)n.hasOwnProperty(r)&&"setRequestHeader"in e&&e.setRequestHeader(r,n[r])}function setCredentials(e,t){typeof t.withCredentials!="undefined"&&typeof e.withCredentials!="undefined"&&(e.withCredentials=!!t.withCredentials)}function generalCallback(e){lastValue=e}function urlappend(e,t){return e+(/\?/.test(e)?"&":"?")+t}function handleJsonp(e,t,n,r){var i=uniqid++,s=e.jsonpCallback||"callback",o=e.jsonpCallbackName||reqwest.getcallbackPrefix(i),u=new RegExp("((^|\\?|&)"+s+")=([^&]+)"),a=r.match(u),f=doc.createElement("script"),l=0,c=navigator.userAgent.indexOf("MSIE 10.0")!==-1;return a?a[3]==="?"?r=r.replace(u,"$1="+o):o=a[3]:r=urlappend(r,s+"="+o),context[o]=generalCallback,f.type="text/javascript",f.src=r,f.async=!0,typeof f.onreadystatechange!="undefined"&&!c&&(f.htmlFor=f.id="_reqwest_"+i),f.onload=f.onreadystatechange=function(){if(f[readyState]&&f[readyState]!=="complete"&&f[readyState]!=="loaded"||l)return!1;f.onload=f.onreadystatechange=null,f.onclick&&f.onclick(),t(lastValue),lastValue=undefined,head.removeChild(f),l=1},head.appendChild(f),{abort:function(){f.onload=f.onreadystatechange=null,n({},"Request is aborted: timeout",{}),lastValue=undefined,head.removeChild(f),l=1}}}function getRequest(e,t){var n=this.o,r=(n.method||"GET").toUpperCase(),i=typeof n=="string"?n:n.url,s=n.processData!==!1&&n.data&&typeof n.data!="string"?reqwest.toQueryString(n.data):n.data||null,o,u=!1;return(n["type"]=="jsonp"||r=="GET")&&s&&(i=urlappend(i,s),s=null),n["type"]=="jsonp"?handleJsonp(n,e,t,i):(o=n.xhr&&n.xhr(n)||xhr(n),o.open(r,i,n.async===!1?!1:!0),setHeaders(o,n),setCredentials(o,n),context[xDomainRequest]&&o instanceof context[xDomainRequest]?(o.onload=e,o.onerror=t,o.onprogress=function(){},u=!0):o.onreadystatechange=handleReadyState(this,e,t),n.before&&n.before(o),u?setTimeout(function(){o.send(s)},200):o.send(s),o)}function Reqwest(e,t){this.o=e,this.fn=t,init.apply(this,arguments)}function setType(e){if(e.match("json"))return"json";if(e.match("javascript"))return"js";if(e.match("text"))return"html";if(e.match("xml"))return"xml"}function init(o,fn){function complete(e){o.timeout&&clearTimeout(self.timeout),self.timeout=null;while(self._completeHandlers.length>0)self._completeHandlers.shift()(e)}function success(resp){var type=o.type||resp&&setType(resp.getResponseHeader("Content-Type"));resp=type!=="jsonp"?self.request:resp;var filteredResponse=globalSetupOptions.dataFilter(resp.responseText,type),r=filteredResponse;try{resp.responseText=r}catch(e){}if(r)switch(type){case"json":try{resp=context.JSON?context.JSON.parse(r):eval("("+r+")")}catch(err){return error(resp,"Could not parse JSON in response",err)}break;case"js":resp=eval(r);break;case"html":resp=r;break;case"xml":resp=resp.responseXML&&resp.responseXML.parseError&&resp.responseXML.parseError.errorCode&&resp.responseXML.parseError.reason?null:resp.responseXML}self._responseArgs.resp=resp,self._fulfilled=!0,fn(resp),self._successHandler(resp);while(self._fulfillmentHandlers.length>0)resp=self._fulfillmentHandlers.shift()(resp);complete(resp)}function timedOut(){self._timedOut=!0,self.request.abort()}function error(e,t,n){e=self.request,self._responseArgs.resp=e,self._responseArgs.msg=t,self._responseArgs.t=n,self._erred=!0;while(self._errorHandlers.length>0)self._errorHandlers.shift()(e,t,n);complete(e)}this.url=typeof o=="string"?o:o.url,this.timeout=null,this._fulfilled=!1,this._successHandler=function(){},this._fulfillmentHandlers=[],this._errorHandlers=[],this._completeHandlers=[],this._erred=!1,this._responseArgs={};var self=this;fn=fn||function(){},o.timeout&&(this.timeout=setTimeout(function(){timedOut()},o.timeout)),o.success&&(this._successHandler=function(){o.success.apply(o,arguments)}),o.error&&this._errorHandlers.push(function(){o.error.apply(o,arguments)}),o.complete&&this._completeHandlers.push(function(){o.complete.apply(o,arguments)}),this.request=getRequest.call(this,success,error)}function reqwest(e,t){return new Reqwest(e,t)}function normalize(e){return e?e.replace(/\r?\n/g,"\r\n"):""}function serial(e,t){var n=e.name,r=e.tagName.toLowerCase(),i=function(e){e&&!e.disabled&&t(n,normalize(e.attributes.value&&e.attributes.value.specified?e.value:e.text))},s,o,u,a;if(e.disabled||!n)return;switch(r){case"input":/reset|button|image|file/i.test(e.type)||(s=/checkbox/i.test(e.type),o=/radio/i.test(e.type),u=e.value,(!s&&!o||e.checked)&&t(n,normalize(s&&u===""?"on":u)));break;case"textarea":t(n,normalize(e.value));break;case"select":if(e.type.toLowerCase()==="select-one")i(e.selectedIndex>=0?e.options[e.selectedIndex]:null);else for(a=0;e.length&&a<e.length;a++)e.options[a].selected&&i(e.options[a])}}function eachFormElement(){var e=this,t,n,r=function(t,n){var r,i,s;for(r=0;r<n.length;r++){s=t[byTag](n[r]);for(i=0;i<s.length;i++)serial(s[i],e)}};for(n=0;n<arguments.length;n++)t=arguments[n],/input|select|textarea/i.test(t.tagName)&&serial(t,e),r(t,["input","select","textarea"])}function serializeQueryString(){return reqwest.toQueryString(reqwest.serializeArray.apply(null,arguments))}function serializeHash(){var e={};return eachFormElement.apply(function(t,n){t in e?(e[t]&&!isArray(e[t])&&(e[t]=[e[t]]),e[t].push(n)):e[t]=n},arguments),e}function buildParams(e,t,n,r){var i,s,o,u=/\[\]$/;if(isArray(t))for(s=0;t&&s<t.length;s++)o=t[s],n||u.test(e)?r(e,o):buildParams(e+"["+(typeof o=="object"?s:"")+"]",o,n,r);else if(t&&t.toString()==="[object Object]")for(i in t)buildParams(e+"["+i+"]",t[i],n,r);else r(e,t)}var context=this;if("window"in context)var doc=document,byTag="getElementsByTagName",head=doc[byTag]("head")[0];else{var XHR2;try{XHR2=require("xhr2")}catch(ex){throw new Error("Peer dependency `xhr2` required! Please npm install xhr2")}}var httpsRe=/^http/,protocolRe=/(^\w+):\/\//,twoHundo=/^(20\d|1223)$/,readyState="readyState",contentType="Content-Type",requestedWith="X-Requested-With",uniqid=0,callbackPrefix="reqwest_"+ +(new Date),lastValue,xmlHttpRequest="XMLHttpRequest",xDomainRequest="XDomainRequest",noop=function(){},isArray=typeof Array.isArray=="function"?Array.isArray:function(e){return e instanceof Array},defaultHeaders={contentType:"application/x-www-form-urlencoded",requestedWith:xmlHttpRequest,accept:{"*":"text/javascript, text/html, application/xml, text/xml, */*",xml:"application/xml, text/xml",html:"text/html",text:"text/plain",json:"application/json, text/javascript",js:"application/javascript, text/javascript"}},xhr=function(e){if(e.crossOrigin===!0){var t=context[xmlHttpRequest]?new XMLHttpRequest:null;if(t&&"withCredentials"in t)return t;if(context[xDomainRequest])return new XDomainRequest;throw new Error("Browser does not support cross-origin requests")}return context[xmlHttpRequest]?new XMLHttpRequest:XHR2?new XHR2:new ActiveXObject("Microsoft.XMLHTTP")},globalSetupOptions={dataFilter:function(e){return e}};return Reqwest.prototype={abort:function(){this._aborted=!0,this.request.abort()},retry:function(){init.call(this,this.o,this.fn)},then:function(e,t){return e=e||function(){},t=t||function(){},this._fulfilled?this._responseArgs.resp=e(this._responseArgs.resp):this._erred?t(this._responseArgs.resp,this._responseArgs.msg,this._responseArgs.t):(this._fulfillmentHandlers.push(e),this._errorHandlers.push(t)),this},always:function(e){return this._fulfilled||this._erred?e(this._responseArgs.resp):this._completeHandlers.push(e),this},fail:function(e){return this._erred?e(this._responseArgs.resp,this._responseArgs.msg,this._responseArgs.t):this._errorHandlers.push(e),this},"catch":function(e){return this.fail(e)}},reqwest.serializeArray=function(){var e=[];return eachFormElement.apply(function(t,n){e.push({name:t,value:n})},arguments),e},reqwest.serialize=function(){if(arguments.length===0)return"";var e,t,n=Array.prototype.slice.call(arguments,0);return e=n.pop(),e&&e.nodeType&&n.push(e)&&(e=null),e&&(e=e.type),e=="map"?t=serializeHash:e=="array"?t=reqwest.serializeArray:t=serializeQueryString,t.apply(null,n)},reqwest.toQueryString=function(e,t){var n,r,i=t||!1,s=[],o=encodeURIComponent,u=function(e,t){t="function"==typeof t?t():t==null?"":t,s[s.length]=o(e)+"="+o(t)};if(isArray(e))for(r=0;e&&r<e.length;r++)u(e[r].name,e[r].value);else for(n in e)e.hasOwnProperty(n)&&buildParams(n,e[n],i,u);return s.join("&").replace(/%20/g,"+")},reqwest.getcallbackPrefix=function(){return callbackPrefix},reqwest.compat=function(e,t){return e&&(e.type&&(e.method=e.type)&&delete e.type,e.dataType&&(e.type=e.dataType),e.jsonpCallback&&(e.jsonpCallbackName=e.jsonpCallback)&&delete e.jsonpCallback,e.jsonp&&(e.jsonpCallback=e.jsonp)),new Reqwest(e,t)},reqwest.ajaxSetup=function(e){e=e||{};for(var t in e)globalSetupOptions[t]=e[t]},reqwest})
/*

 JS Signals <http://millermedeiros.github.com/js-signals/>
 Released under the MIT license
 Author: Miller Medeiros
 Version: 1.0.0 - Build: 268 (2012/11/29 05:48 PM)
*/
(function(i){function h(a,b,c,d,e){this._listener=b;this._isOnce=c;this.context=d;this._signal=a;this._priority=e||0}function g(a,b){if(typeof a!=="function")throw Error("listener is a required param of {fn}() and should be a Function.".replace("{fn}",b));}function e(){this._bindings=[];this._prevParams=null;var a=this;this.dispatch=function(){e.prototype.dispatch.apply(a,arguments)}}h.prototype={active:!0,params:null,execute:function(a){var b;this.active&&this._listener&&(a=this.params?this.params.concat(a):
a,b=this._listener.apply(this.context,a),this._isOnce&&this.detach());return b},detach:function(){return this.isBound()?this._signal.remove(this._listener,this.context):null},isBound:function(){return!!this._signal&&!!this._listener},isOnce:function(){return this._isOnce},getListener:function(){return this._listener},getSignal:function(){return this._signal},_destroy:function(){delete this._signal;delete this._listener;delete this.context},toString:function(){return"[SignalBinding isOnce:"+this._isOnce+
", isBound:"+this.isBound()+", active:"+this.active+"]"}};e.prototype={VERSION:"1.0.0",memorize:!1,_shouldPropagate:!0,active:!0,_registerListener:function(a,b,c,d){var e=this._indexOfListener(a,c);if(e!==-1){if(a=this._bindings[e],a.isOnce()!==b)throw Error("You cannot add"+(b?"":"Once")+"() then add"+(!b?"":"Once")+"() the same listener without removing the relationship first.");}else a=new h(this,a,b,c,d),this._addBinding(a);this.memorize&&this._prevParams&&a.execute(this._prevParams);return a},
_addBinding:function(a){var b=this._bindings.length;do--b;while(this._bindings[b]&&a._priority<=this._bindings[b]._priority);this._bindings.splice(b+1,0,a)},_indexOfListener:function(a,b){for(var c=this._bindings.length,d;c--;)if(d=this._bindings[c],d._listener===a&&d.context===b)return c;return-1},has:function(a,b){return this._indexOfListener(a,b)!==-1},add:function(a,b,c){g(a,"add");return this._registerListener(a,!1,b,c)},addOnce:function(a,b,c){g(a,"addOnce");return this._registerListener(a,
!0,b,c)},remove:function(a,b){g(a,"remove");var c=this._indexOfListener(a,b);c!==-1&&(this._bindings[c]._destroy(),this._bindings.splice(c,1));return a},removeAll:function(){for(var a=this._bindings.length;a--;)this._bindings[a]._destroy();this._bindings.length=0},getNumListeners:function(){return this._bindings.length},halt:function(){this._shouldPropagate=!1},dispatch:function(a){if(this.active){var b=Array.prototype.slice.call(arguments),c=this._bindings.length,d;if(this.memorize)this._prevParams=
b;if(c){d=this._bindings.slice();this._shouldPropagate=!0;do c--;while(d[c]&&this._shouldPropagate&&d[c].execute(b)!==!1)}}},forget:function(){this._prevParams=null},dispose:function(){this.removeAll();delete this._bindings;delete this._prevParams},toString:function(){return"[Signal active:"+this.active+" numListeners:"+this.getNumListeners()+"]"}};var f=e;f.Signal=e;typeof define==="function"&&define.amd?define(function(){return f}):typeof module!=="undefined"&&module.exports?module.exports=f:i.signals=
f})(this);
(function(window) {
    var re = {
        not_string: /[^sS]/,
        number: /[def]/,
        text: /^[^\x25]+/,
        modulo: /^\x25{2}/,
        placeholder: /^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosSuxX])/,
        key: /^([a-z_][a-z_\d]*)/i,
        key_access: /^\.([a-z_][a-z_\d]*)/i,
        index_access: /^\[(\d+)\]/,
        sign: /^[\+\-]/
    }

    function sprintf() {
        var key = arguments[0], cache = sprintf.cache
        if (!(cache[key] && cache.hasOwnProperty(key))) {
            cache[key] = sprintf.parse(key)
        }
        return sprintf.format.call(null, cache[key], arguments)
    }

    sprintf.format = function(parse_tree, argv) {
        var cursor = 1, tree_length = parse_tree.length, node_type = "", arg, output = [], i, k, match, pad, pad_character, pad_length, is_positive = true, sign = ""
        for (i = 0; i < tree_length; i++) {
            node_type = get_type(parse_tree[i])
            if (node_type === "string") {
                output[output.length] = parse_tree[i]
            }
            else if (node_type === "array") {
                match = parse_tree[i] // convenience purposes only
                if (match[2]) { // keyword argument
                    arg = argv[cursor]
                    for (k = 0; k < match[2].length; k++) {
                        if (!arg.hasOwnProperty(match[2][k])) {
                            throw new Error(sprintf("[sprintf] property '%s' does not exist", match[2][k]))
                        }
                        arg = arg[match[2][k]]
                    }
                }
                else if (match[1]) { // positional argument (explicit)
                    arg = argv[match[1]]
                }
                else { // positional argument (implicit)
                    arg = argv[cursor++]
                }

                if (get_type(arg) == "function") {
                    arg = arg()
                }

                if (re.not_string.test(match[8]) && (get_type(arg) != "number" && isNaN(arg))) {
                    throw new TypeError(sprintf("[sprintf] expecting number but found %s", get_type(arg)))
                }

                if (re.number.test(match[8])) {
                    is_positive = arg >= 0
                }

                switch (match[8]) {
                    case "b":
                        arg = arg.toString(2)
                        break
                    case "c":
                        arg = String.fromCharCode(arg)
                        break
                    case "d":
                        arg = parseInt(arg, 10)
                        break
                    case "e":
                        arg = match[7] ? arg.toExponential(match[7]) : arg.toExponential()
                        break
                    case "f":
                        arg = match[7] ? parseFloat(arg).toFixed(match[7]) : parseFloat(arg)
                        break
                    case "o":
                        arg = arg.toString(8)
                        break
                    case "s":
                        arg = ((arg = String(arg)) && match[7] ? arg.substring(0, match[7]) : arg)
                        break
                    case "S":
                        arg = "'" + ((arg = String(arg)) && match[7] ? arg.substring(0, match[7]) : arg) + "'"
                        break
                    case "u":
                        arg = arg >>> 0
                        break
                    case "x":
                        arg = arg.toString(16)
                        break
                    case "X":
                        arg = arg.toString(16).toUpperCase()
                        break
                }
                if (!is_positive || (re.number.test(match[8]) && match[3])) {
                    sign = is_positive ? "+" : "-"
                    arg = arg.toString().replace(re.sign, "")
                }
                pad_character = match[4] ? match[4] == "0" ? "0" : match[4].charAt(1) : " "
                pad_length = match[6] - (sign + arg).length
                pad = match[6] ? str_repeat(pad_character, pad_length) : ""
                output[output.length] = match[5] ? sign + arg + pad : (pad_character == 0 ? sign + pad + arg : pad + sign + arg)
            }
        }
        return output.join("")
    }

    sprintf.cache = {}

    sprintf.parse = function(fmt) {
        var _fmt = fmt, match = [], parse_tree = [], arg_names = 0
        while (_fmt) {
            if ((match = re.text.exec(_fmt)) !== null) {
                parse_tree[parse_tree.length] = match[0]
            }
            else if ((match = re.modulo.exec(_fmt)) !== null) {
                parse_tree[parse_tree.length] = "%"
            }
            else if ((match = re.placeholder.exec(_fmt)) !== null) {
                if (match[2]) {
                    arg_names |= 1
                    var field_list = [], replacement_field = match[2], field_match = []
                    if ((field_match = re.key.exec(replacement_field)) !== null) {
                        field_list[field_list.length] = field_match[1]
                        while ((replacement_field = replacement_field.substring(field_match[0].length)) !== "") {
                            if ((field_match = re.key_access.exec(replacement_field)) !== null) {
                                field_list[field_list.length] = field_match[1]
                            }
                            else if ((field_match = re.index_access.exec(replacement_field)) !== null) {
                                field_list[field_list.length] = field_match[1]
                            }
                            else {
                                throw new SyntaxError("[sprintf] failed to parse named argument key")
                            }
                        }
                    }
                    else {
                        throw new SyntaxError("[sprintf] failed to parse named argument key")
                    }
                    match[2] = field_list
                }
                else {
                    arg_names |= 2
                }
                if (arg_names === 3) {
                    throw new Error("[sprintf] mixing positional and named placeholders is not (yet) supported")
                }
                parse_tree[parse_tree.length] = match
            }
            else {
                throw new SyntaxError("[sprintf] unexpected placeholder")
            }
            _fmt = _fmt.substring(match[0].length)
        }
        return parse_tree
    }

    var vsprintf = function(fmt, argv, _argv) {
        _argv = (argv || []).slice(0)
        _argv.splice(0, 0, fmt)
        return sprintf.apply(null, _argv)
    }

    /**
     * helpers
     */
    function get_type(variable) {
        return Object.prototype.toString.call(variable).slice(8, -1).toLowerCase()
    }

    function str_repeat(input, multiplier) {
        return Array(multiplier + 1).join(input)
    }

    /**
     * export to either browser or node.js
     */
    if (typeof exports !== "undefined") {
        exports.sprintf = sprintf
        exports.vsprintf = vsprintf
    }
    else {
        window.sprintf = sprintf
        window.vsprintf = vsprintf

        if (typeof define === "function" && define.amd) {
            define(function() {
                return {
                    sprintf: sprintf,
                    vsprintf: vsprintf
                }
            })
        }
    }
})(typeof window === "undefined" ? this : window)
var ssla = (function(ssla) {
    if (!ssla) {
        ssla = {};
    }
    ssla.events = {
        lmsPreInitialize: new signals.Signal(),
        lmsPostInitialize: new signals.Signal(),
        lmsPreFinish: new signals.Signal(),
        lmsPostFinish: new signals.Signal(),
        lmsPreTerminate: new signals.Signal(),
        lmsPostTerminate: new signals.Signal(),
        lmsPreCommit: new signals.Signal(),
        lmsPostCommit: new signals.Signal(),
        lmsPreGetValue: new signals.Signal(),
        lmsPostGetValue: new signals.Signal(),
        lmsPreSetValue: new signals.Signal(),
        lmsPostSetValue: new signals.Signal()
    };
    return ssla;
})(ssla);
/**
 * @constructor
 * @class Config
 * @note Contains all configuration options for SSLA
 */
var Config = function (configCustom) {
    this.aicc_file = "";//this needs to be updated

    this.courseBaseHtmlPath = "../";

    //Navigation Controls

    /**
     * @property
     * @type boolean
     * @note Set to true if you would like to display the SCO to SCO navigation buttons in the interface. Only works with this.scoLaunchType = 1;
     */
    this.showSCOtoSCONavigation = true;

    this.showSCORM2004TopNav = false;

    /**
     * @property
     * @type string
     * @note Text to display on the SCO to SCO navigation "back" button.
     */
    this.previousActivityText = "Previous Activity";
    /**
     * @property
     * @type string
     * @note Text to display on the SCO to SCO navigation "next" button.
     */
    this.nextActivityText = "Next Activity";

    //Launch Controls

    /**
     * @property
     * @type string
     * @note Should the adapter launch the course in a frame or in a popup (new window)?
     <br>1- frameset;
     <br>2- new window
     */
    this.scoLaunchType = 1;

    /**
     * @property
     * @type boolean
     * @note set to true if you want to hide the table of contents when you are launching using scoLaunchType=1. If you are setting this to true it usually makes sense to also set this.autoLaunchFirstSCO = true;
     */
    this.hideTOC = false;

    /**
     * @property
     * @type boolean
     * @note set to true if you want to automatically launch the SCO when the player loads
     */
    this.autoLaunchFirstSCO = true;

    /**
     * @property
     * @type string
     * @note Set to true if you want to automatically launch the first SCO in the manifest when the course loads.
     <br>If you set this.scoLaunchType = 2 then this variable will be taken into account.
     <br>List the property and the value for that property in the array
     <br>Example:
     <br>newWindowSettings = Array("toolbar=yes","scrollbar=yes","width=1024",height=768");
     */
    this.newWindowSettings = Array("width=1024", "height=768");

    //Debug Options

    /**
     * @property
     * @type string
     * @note Set to either on or off. on will enable the debugger to log data and then this.debuggerLaunchType tells how the data will be output.
     */
    this.debuggerStatus = "off";

    /**
     * @property
     * @type string
     * @note Tells how the data will be output.
     <br>console - prints to console.log;
     <br>popup - opens a new window and prints debug data to the new window.
     */
    this.debuggerLaunchType = "console";

    //Course Completion

    /**
     * @property
     * @type string
     * @note Set this if you would like to overwride the masteryscore from the imsmanifest file.<br>
     <br>Example:this.masteryScore = "80"; now the passing score is 80%.
     */
    this.masteryScore = "";

    /**
     * @property
     * @type boolean
     * @note Not used at this time.
     */
    this.showCourseCompletionStatus = true;

    /**
     * @property
     * @type boolean
     * @note Not used at this time.
     */
    this.showCourseSuccessStatus = true;

    /**
     * @property
     * @type boolean
     * @note Not used at this time.
     */
    this.showCourseGrade = true;

    //Course Information

    /**
     * @property
     * @type string
     * @note Name of the SCORM manifest file. This should never need to be modified.
     */
    this.scormManifestFileName = "imsmanifest.xml";

    //Data Storage
    /**
     * @property
     * @type string
     * @note This tells SSLA how you would like to store the JSON SCORM data that SSLA compiles. This should be left as "server".
     */
    this.storageMediaType = "server";

    /**
     * @property
     * @type string
     * @note This tells SSLA how you would like to send the JSON SCORM data to your server.
     <br> POST
     <br> GET
     */
    this.ajaxType = "POST";

    /**
     * @property
     * @type string
     * @note This tells SSLA where to set JSON data to your server.
     */
    this.setDataURL = "/track/set";
    /**
     * @property
     * @type string
     * @note This tells SSLA where to get JSON data to your server.
     */
    this.getDataURL = "/track/get";
    /**
     * @property
     * @type string
     * @note If you would like to save the state of the SSLA table of contents, this is the name that will be used for the object that stores the information about the state of the table of contents
     <br> Example:
     <br> {"toc_data":"some data about the table of contents"}
     */
    this.tocDataObjectName = "toc_data";

    /**
     * @property
     * @type boolean
     * @note Do you want the adapter to send data to your server everytime setValue() is called by the course?
     */
    this.saveDataOnSetValue = false;
    /**
     * @property
     * @type boolean
     * @note Do you want the adapter to send data to your server everytime commit() is called by the course?
     */
    this.saveDataOnCommit = true;

    this.forceSynchronousAjaxOnEnd = true;

    //Course Table of Contents display

    /**
     * @property
     * @type string
     * @note Set to "debugview" to visually show the indenting usign the ">" character
     <br>set to "ullistview" to see the unordered list (UL) view
     <br>NOT IMPLEMENTED YET set to "treeview" to see the tree complete with expandable menus
     */
    this.tocDisplayType = "ullistview";

    /**
     * @property
     * @type object
     * @note Contains image links that realate to the status of the SCOs in the table of contents.
     */
    this.tocStatusImages = new Object();

    /**
     * @property
     * @type string
     * @note Image for the completed status.
     */
    this.tocStatusImages["completed"] = "images/status/completed.gif";

    /**
     * @property
     * @type string
     * @note Image for the incomplete status.
     */
    this.tocStatusImages["incomplete"] = "images/status/incomplete.gif";

    /**
     * @property
     * @type string
     * @note Image for the unknosn status.
     */
    this.tocStatusImages["unknown"] = "images/status/unknown.gif";

    /**
     * @property
     * @type string
     * @note Image for the not attempted status.
     */
    this.tocStatusImages["not_attempted"] = "images/status/unknown.gif";

    /**
     * @property
     * @type string
     * @note Image for the passed status.
     */
    this.tocStatusImages["passed"] = "images/status/passed.gif";

    /**
     * @property
     * @type string
     * @note Image for the failed status.
     */
    this.tocStatusImages["failed"] = "images/status/failed.gif";

    /**
     * @property
     * @type string
     * @note Background color for the currently active item in the table of contents
     */
    this.activeItemHighlightColor = "#83f84f";

    //Course Certificate

    /**
     * @property
     * @type boolean
     * @note Do you want SSLA to show a certificate when the student receives a passing grade?
     <br>true - show
     <br>false - dont show
     */
    this.showCourseCertificate = true;

    /**
     * @property
     * @type integer
     * @note The score that is needed to receive a certificate.
     */
    this.courseCertThresholdScore = 0;

    //SCORM Variables

    /**
     * @property
     * @type string
     * @note Set this to true if you want the content (SCO) to be automatically set to completed when it is exited.
     */
    this.completeContentOnExit = false;
    /**
     * @property
     * @type string
     * @note Set this to true if you want your server to receive an AJAX POST when the course inintializes the SCORM session
     <br> {"initialized":true}
     */
    this.setInitializeToLMS = true;
    /**
     * @property
     * @type string
     * @note Set this to true if you want your server to receive an AJAX POST when the course finishes the SCORM session
     <br> {"finish":true}
     */
    this.setFinishToLMS = true;

    this.saveStatementLog = false;

    this.statementLogGetUrl = "/track/statement_log/get";

    this.statementLogSetUrl = "/track/statement_log/set";

    this.showStatementLogPopupLink = false;
    //SCORM Adjustments


    this.checkObjectiveId = false;//do you want to validate whether or not the objective id is the proper SCORM length, this may have to be set to false for some courses to function
    this.checkInteractionId = false;//do you want to validate whether or not the interaction id is the proper SCORM length, this may have to be set to false for some courses to function
    this.convertStudentName = false;//do you want to turn the name from Joe Student to Student, Joe

    this.getStudentIdOverrideFn = null;

    this.getStudentNameOverrideFn = null;

    // Allow for configuration extension/override, if available.
    if (configCustom) {
        for (var attrname in configCustom) {
            this[attrname] = configCustom[attrname];
        }
    }
};
/**
 * @constructor
 * @class CreateTableOfContents
 * @note Creates the table of contents from the parsed manifest.xml file.
 */
function CreateTableOfContents()
{	
/**
 * @property
 * @type string
 * @note Variable used to define the current identifierRef, from the imsmanifest.xml file, being used in this class.  
 */
	this.strIdRef 					=	"";
/**
 * @property
 * @type string
 * @note Variable used to define the current identifierRef, from the imsmanifest.xml file, being used in this class.
 */
	this.strId						=	"";
/**
 * @property
 * @type object
 * @note Instance of the parser object that will create a JSON object from the xml contained in manifest.xml
 */
	this.parseXMLToObjectInstance 	=	{};
/**
 * @property
 * @type object
 * @note Variable containing the JSON data returned from 'this.parseXMLToObjectInstance'. 
 */
	this.objXmlData					=	{};
/**
 * @property
 * @type string
 * @note The activity that the learner is currently engaged in.
 */	
	this.strCurrentActivityId		=	"";
/**
 * @property 
 * @type object
 * @note An object containing the status of each activity in the activity tree.
 */	
	this.aryCompletionStatus  		=	{};
/**
 * @property
 * @type string
 * @note The schema version defined in the currently loaded manifest. This is used to determine which SCORM player to load. (1.2 or 2004)
 */	
	this.schemaversion				=	"";
/**
 * @property
 * @type object
 * @note Holds a cache of the manifest data associated with each activity in the manifest.
 */	
	this.data						= 	{};
	//this.obj = new Object();
/**
 * @property
 * @type string
 * @note This is set in the config file using the variable 'this.tocDisplayType'.
 <br> It is suggested not to change this variable except when debugging.
 */	
	this.blnShowIndent 				=	config.tocDisplayType; 	//this is set in config.js
/**
 * @property
 * @type int
 * @note Variable that holds the number of SCOs listed in the manifest file.
 */
	this.totalNumOfSCOs				= 0;// this should really be tied back to activities at some time.
/**
 * @property
 * @type string
 * @note Creates an instance of Menu class (Menu.js)
 */
	this.menuInstance 				= new Menu();
/**
 * @property
 * @type string
 * @note The current activity id.
 */
	this.activityId 				= "";

}

/** Traverses a data structure looking for a matching key.  Will not stop if the value to be matched is null. */
function traverse(o, findKey) {
	var res;
    for (var i in o) {
		if (o.hasOwnProperty(i)) {
			if (i == findKey) {
				return o[i];
			}
			if (typeof(o[i]) === "object") {
				res = traverse(o[i], findKey);
				if (res !== null) {
					return res;
				}
			}
		}
    }
	return null;
}         

CreateTableOfContents.prototype.getSchemaVersion = function(xml) {
	//first look for the schema version
	var _sv = traverse(xml,"schemaversion");
	if(_sv) {
		return _sv;
	}
	
	//then look for scormType / scormtype
	if(traverse(xml,"adlcp:scormtype")){
		//alert("there is a scormtype attribute, must be scorm 1.2")
		return "1.2";
	}
	if(traverse(xml,"adlcp:scormType")){
		//alert("there is a scormType attribute, must be scorm 2004")
		return "2004 3rd Edition";//we will assume 2004 3rd edition
	}	
	
	//then look for xsds imscp_rootv1p1p2 = 1.2 / adlcp_v1p3 = 2004
	if(xml.manifest.xmlns == "http://www.imsproject.org/xsd/imscp_rootv1p1p2")
	{
		//alert("there is a imscp_rootv1p1p2 reference, must be scorm 1.2")
		return "1.2";
	}else{
		//alert("there is no imscp_rootv1p1p2 reference, test for 2004")
		if(xml.manifest.xmlns == "http://www.imsglobal.org/xsd/imscp_v1p1" )
		{
			//alert("there is a imscp_v1p1 reference, must be scorm 2004")
			return "2004 3rd Edition";//we will assume 2004 3rd edition
		}else{
			//alert("failed to determine the scorm type, assume it is SCORM 1.2")
			return "1.2";
		}
	}	
	
}

/**
 *@method initTraverse
 *@param {file}
 *@return {n + closeULListView} An un-ordered list
 *@note Traverse the parsed imsmanifest.xml xml object. Calls 'this.traverse' to create the table of contents and the activity tree.
 */
CreateTableOfContents.prototype.initTraverse = function(file, continueCallback) {
	strCurrentLevel = 1;
	if(config.aicc_file != "")
	{
		//create an instance of manifest and make a scorm manifest from aicc files
		manifestInstance = new manifest(getCourseDirectory() + "/" + config.scormManifestFileName);
		xmlDom = manifestInstance.create();
		xml = utils.StringtoXML(xmlDom);
		this.objXmlData = new ParseXMLToObject.ParseXML().parseDocument( xml.documentElement );
        this.initTraverseContinue(continueCallback);
	}else{
		xml = new ParseXMLToObject.ParseXML( file );//returns XML object
        xml.async(this.initTraverseContinueWrapper, [this, continueCallback]);
		this.objXmlData = xml.parse();
	}
};

CreateTableOfContents.prototype.initTraverseContinueWrapper = function(objXmlData, args) {
    // Re-scope everything after the callback.  args[0] should be this.
    args[0].objXmlData = objXmlData;
    args[0].initTraverseContinue(args[1]);
};

CreateTableOfContents.prototype.initTraverseContinue = function(continueCallback) {
	if(typeof(this.objXmlData) == "undefined")
	{
		alert("The imsmanifest.xml file was not found at " + file + ".\nThe imsmanifest.xml file must be at the root of the SCORM package");
		return;
	}
	//get the scorm version
	this.schemaversion = this.getSchemaVersion(this.objXmlData);
	n = this.traverse(this.objXmlData);//returns the raw toc with no style
	//add in the final tags to close the tree
	var closeULListView = "";
	if(this.blnShowIndent == "ullistview")
	{
		closeULListView = "</li>";
		outdent = "</ul></li>";
		for(k=0; k<strCurrentLevel; k++)
		{
			closeULListView += outdent;
		}
	}else{
		closeULListView == "";
	}
	continueCallback(n + closeULListView);
};

strLastLevel = 0;

/**
 *@method getCurrentActivityId
 *@param {}
 *@return {this.activityId}
 *@note Returns the activity (SCO) within the activity tree that the learner is engaged in.  
 */
CreateTableOfContents.prototype.getCurrentActivityId = function()
{
return this.activityId;
}

/**
 *@method applyStyle
 *@param {str}
 *@param {indent}
 *@param {id}
 *@return {ret} 
 *@note Unordered list with styles applied.  
 */
CreateTableOfContents.prototype.applyStyle = function(str, indent,id) 
{
	before ="";
	after="";

	strCurrentLevel = indent.length +1;
	
	if(strCurrentLevel == 1)
	{
		if(strCurrentLevel > strLastLevel)
		{
			before += "<ul id='menu_level_"+strLastLevel+"'><li>";
		}
		if(strCurrentLevel < strLastLevel)
		{
			before = "";
		}		
		if(strCurrentLevel == strLastLevel)
		{
			before = "</ul>";
		}
	}else{
		if(strCurrentLevel > strLastLevel)
		{
			//indent
			//this code assumes that we indent by increments of 1
			before += "<ul id='menu_level_"+strLastLevel+"'><li id='" + id + "'>";//this is always UL LI for any level past 1
		}
		if(strCurrentLevel == strLastLevel)
		{
			//add a sibling
			before = "</li><li id='" + id + "'>";
		}
		if(strCurrentLevel < strLastLevel)
		{
			//outdent
			outdent = "</ul></li>";
			//you may outdent by an increment > 1
			//the outdent is the difference between the levels
			outdentInterval = strLastLevel - strCurrentLevel
			for(k=0; k<outdentInterval; k++)
			{
				before += outdent;
			}
			before += "<li id='" + id + "'>";
		}
	}
	ret = before + str + after;
	strLastLevel = strCurrentLevel;
	return ret;
}


/**
 *@method outputPlain
 *@param {str}
 *@param {indent}
 *@return {str} 
 *@note Returns list of items in the imsmanifest file seperated by breaks and indented with ">>"
 <br> mainly used for debugging.  
 */

CreateTableOfContents.prototype.outputPlain = function(str, indent) 
{
	str = indent.length + indent + str + "<br>";
	return str;
}

//global variables used by this.traverse
numOfOrganizations = 0;
aryLookingForItems = new Array();
strLastItemName = "";
aryAttributeCollection = new Array();
strCurrentItemId = "";
intIndexCount = 0;
intParentIndexCount = -1;
//end globals

/**
 *@method traverse
 *@param {obj}
 *@param {name}
 *@param {indent}
 *@param {depth}
 *@return {obj} 
 *@note Create the activity tree cache.
 */
CreateTableOfContents.prototype.traverse = function(obj, name, indent, depth) 
{
	attributes = "";
	
	if(typeof(name) == "undefined")
	{
		name = "";
		indent = "";
	}
	if(typeof(indent) == "undefined")indent = "";

	
	if(typeof obj == "object")
	{
		var child = null;
		var output = "";
		if(name == "organization"){
			numOfOrganizations++;
			if(numOfOrganizations > 1)
			{
				alert("This parser does not support multiple organizations.");
				return output;
			}
			aryLookingForItems = new Array("title");
			strLastItemName = "organization";
			indent = "";
		}
		if(name == "item")
		{
			aryLookingForItems = new Array("title", "identifier", "identifierref", "isvisible", "adlcp:datafromlms",
											"adlcp:masteryscore", "adlcp:timelimitaction", "adlcp:maxtimeallowed", 
											"adlcp:prerequisite", "item");
			strLastItemName = "item";
		}
		if(name == "resource")
		{
			//we are done parsing the manifest, there will not be any more activity related data after the resources
			return output;
		}
			for(var item in obj)
			{
				try{
					child = obj[item];
				}catch (e){
					child = "<Unable to Evaluate>";
				}
				if(typeof child == "object") 
				{
					output += this.traverse(child, item, indent, depth + 1);
				}else{
					
					//if(item == "schemaversion")
					//{
						//people put the schema version anywhere in the manifest file.
					//	this.schemaversion = child;
						//if we cant find the schemaversion then alert that there is no schema version in the manifest and that needs to be fixed
						//if the schema version is not in the correct place then look anywhere in the imsmanifest for the first occurance of the schemaversion and use that
					//}	
				
					for(j=0;j<aryLookingForItems.length;j++)
					{
						if(item == aryLookingForItems[j])
						{
							switch(item)//we looking for attributes or data within the tags, strLastItemName should be a tag
							{
								case "title":
									if(strLastItemName == "organization")
									{
										//this will display  the organizations title
										strLastItemName = "organization.title";
										aryLookingForItems = new Array("item");
										if(this.blnShowIndent == "debugview")
										{
											output = this.outputPlain(child, indent);
										}else{
											output = this.applyStyle(child, indent);
										}
										this.menuInstance.setMenuItem(child,"","","unknown",intIndexCount,intParentIndexCount);
										intIndexCount++;
										intParentIndexCount++;
									}								
									if(strLastItemName == "item")
									{
										//this will list all of the SCOS in the manifest
										strLastItemName = "item";
										aryLookingForItems = new Array("title", "identifier", "identifierref", 
											"isvisible", "adlcp:datafromlms", "adlcp:masteryscore", 
											"adlcp:timelimitaction", "adlcp:maxtimeallowed", 
											"adlcp:prerequisite", "item", "parameters");
										indent += ">";
										if(item == "title")
										{
											if(typeof(aryAttributeCollection["identifierref"]) != "undefined" || aryAttributeCollection["identifierref"] == "undefined")
											{
                                                str = "<a href='javascript:gotoSco("+ "\"" + aryAttributeCollection["identifierref"] + "\"" + ","+ "\"" + aryAttributeCollection["identifier"] + "\"" + ")'>"+child+"</a>";
												if(this.blnShowIndent == "debugview") {
													output = this.outputPlain(str, indent, aryAttributeCollection["identifier"]);
												} else {
													output = this.applyStyle(str, indent, aryAttributeCollection["identifier"]);
												}
												this.menuInstance.setMenuItem(child,aryAttributeCollection["identifier"],aryAttributeCollection["identifierref"],"unknown",intIndexCount,intParentIndexCount);
												intIndexCount++;
											}else{	
												if(this.blnShowIndent == "debugview")
												{
													output = this.outputPlain(child, indent);
												}else{
													output = this.applyStyle(child, indent);
												}
												this.menuInstance.setMenuItem(child,"","","unknown",intIndexCount,intParentIndexCount);
												intIndexCount++;
												intParentIndexCount++;
											}
										}else{
											if(this.blnShowIndent == "debugview")
											{
												output = this.outputPlain(item + ":" + child, indent);
											}else{
												output = this.applyStyle(item + ":" + child, indent);
											}
										}
										aryAttributeCollection = new Array();
									}
								break;
								case "identifier":
									if(strLastItemName == "item")
									{
										aryLookingForItems = new Array("title", "identifierref",
										"isvisible", "adlcp:datafromlms", "adlcp:masteryscore", 
										"adlcp:timelimitaction", "adlcp:maxtimeallowed", 
										"adlcp:prerequisite", "item", "parameters");
										
										aryAttributeCollection[item] = child;
										strCurrentItemId = child;
										strLastItemName = "item";
									}
								break;
								case "identifierref":
									if(strLastItemName == "item")
									{
										aryLookingForItems = new Array("title", "identifier",
										"isvisible", "adlcp:datafromlms", "adlcp:masteryscore", 
										"adlcp:timelimitaction", "adlcp:maxtimeallowed", 
										"adlcp:prerequisite", "item", "parameters");
										aryAttributeCollection[item] = child;
										strLastItemName = "item";
										this.totalNumOfSCOs++;
										
									}
								break;
								case "isvisible":
									if(strLastItemName == "item")
									{
										aryLookingForItems = new Array("title", "identifierref", "identifier",
										"adlcp:datafromlms", "adlcp:masteryscore", 
										"adlcp:timelimitaction", "adlcp:maxtimeallowed", 
										"adlcp:prerequisite", "item", "parameters");
										aryAttributeCollection[item] = child;
										strLastItemName = "item";
										
									}
								break;
								case "adlcp:datafromlms":
									if(strLastItemName == "item")
									{
										aryLookingForItems = new Array("title", "adlcp:masteryscore", "identifier", "identifierref",
										"adlcp:timelimitaction", "adlcp:maxtimeallowed", 
										"adlcp:prerequisite", "item", "parameters");
										obj[item] = child;
										this.data[strCurrentItemId] = obj;
									}
								break;
								case "adlcp:masteryscore":
									if(strLastItemName == "item")
									{
										aryLookingForItems = new Array("title", "adlcp:datafromlms", "identifier", "identifierref",
										"adlcp:timelimitaction", "adlcp:maxtimeallowed", 
										"adlcp:prerequisite", "item", "parameters");
										obj[item] = child;
										this.data[strCurrentItemId] = obj;
										
										
									}
								break;
								case "adlcp:timelimitaction":
									if(strLastItemName == "item")
									{
										aryLookingForItems = new Array("title", "adlcp:datafromlms", "adlcp:masteryscore", "identifier", "identifierref",
										"adlcp:maxtimeallowed", 
										"adlcp:prerequisite", "item", "parameters");
										obj[item] = child;
										this.data[strCurrentItemId] = obj;
										
										
									}
								break;	
								case "adlcp:maxtimeallowed":
									if(strLastItemName == "item")
									{
										aryLookingForItems = new Array("title", "adlcp:datafromlms", "adlcp:masteryscore", "identifier", "identifierref",
										"adlcp:timelimitaction", 
										"adlcp:prerequisite", "item", "parameters");
										obj[item] = child;
										this.data[strCurrentItemId] = obj;
										
									}
								break;	
								case "adlcp:prerequisite":
									if(strLastItemName == "item")
									{
										aryLookingForItems = new Array("title", "adlcp:datafromlms", "adlcp:masteryscore", "identifier", "identifierref",
										"adlcp:timelimitaction", "adlcp:maxtimeallowed", "item", "parameters");
										obj[item] = child;
										this.data[strCurrentItemId] = obj;
										
									}
								break;								
								case "parameters":
									if(strLastItemName == "item")
									{
										aryLookingForItems = new Array("title", "adlcp:datafromlms", "adlcp:masteryscore", "identifier", "identifierref",
										"adlcp:timelimitaction", "adlcp:maxtimeallowed", "item", "parameters");
										obj[item] = child;
										this.data[strCurrentItemId] = obj;

									}
								break;
							}
						}
					}
				}
			}
		return output;
	}else{
		return obj;
	}
}

/**
 *@method lookupHrefByRef
 *@param {id}
 *@param {activityId}
 *@return {VOID} 
 *@note Used to look up, and then launch, a SCO href using the activity id.
 */
CreateTableOfContents.prototype.lookupHrefByRef = function(id, activityId)
{
    var cmi_core_credit, cmi_core_lesson_mode, playerInitFn, datafromlms, masteryscore,
		maxtimeallowed, timelimitaction, parameters, path, studentid, student_name, i;

	try{
	document.getElementById(this.getCurrentActivityId()).childNodes[0].style.backgroundColor = "";
	}catch(e){}
	if(this.strCurrentActivityId != "")document.getElementById(this.strCurrentActivityId).childNodes[0].style.backgroundColor = "";
	
	if(id == "undefined"){alert("identifierref is undefined. Can not find content to launch.");return;}
	if(activityId == "undefined"){alert("identifier is undefined. Can not find content to launch."); return;}
	
	studentid = getStudentId();
	student_name = getStudentName();

	for (i=0; i<document.frmMain.credit.length; i++) 
	{
		if(document.frmMain.credit[i].checked)
		{
			cmi_core_credit = document.frmMain.credit[i].value;
		}	
	}
	
	for (i=0; i<document.frmMain.mode.length; i++) 
	{
		if(document.frmMain.mode[i].checked)
		{
			cmi_core_lesson_mode = document.frmMain.mode[i].value;
		}	
	}

	try{datafromlms 	= (typeof(this.data[activityId]["adlcp:datafromlms"]) == 'undefined') ? '' : this.data[activityId]["adlcp:datafromlms"]}catch(e){datafromlms=""};
	try{masteryscore 	= (typeof(this.data[activityId]["adlcp:masteryscore"]) == 'undefined') ? '' : this.data[activityId]["adlcp:masteryscore"]}catch(e){masteryscore=""};
	try{maxtimeallowed 	= (typeof(this.data[activityId]["adlcp:maxtimeallowed"]) == 'undefined') ? '' : this.data[activityId]["adlcp:maxtimeallowed"]}catch(e){maxtimeallowed=""};
	try{timelimitaction = (typeof(this.data[activityId]["adlcp:timelimitaction"]) == 'undefined') ? '' : this.data[activityId]["adlcp:timelimitaction"]}catch(e){timelimitaction=""};
    try{parameters      = (typeof(this.data[activityId]["parameters"]) == 'undefined') ? '' : this.data[activityId]["parameters"]}catch(e){parameters=""};
	parameters = parameters.trim();
	if (parameters.charAt(0) == '?') {
		parameters = parameters.substr(1);
	}

	if(config.masteryScore != "")this.data[activityId]["adlcp:masteryscore"] = config.masteryScore;
	
	for(res in this.objXmlData["manifest"]["resources"]["resource"])
	{
		var objResource = this.objXmlData["manifest"]["resources"]["resource"][res];
		if(typeof(objResource) == "string")
		{
			objResource=this.objXmlData["manifest"]["resources"]["resource"];
		}

		if(id == objResource["identifier"])
		{
			//we have had issues where the manifest schema version is not in the correct place or is not there at all. This method tries to infer the version through other means.
			//this.schemaversion = this.findSCORMVersion(this.schemaversion);
			switch(this.schemaversion)
			{
				case "":
					alert("No schemaversion found in the manifest. I can't tell what SCORM version you want me to launch the course as.")
					return;
				break;
				case "1.1":
				case "1.0":
					alert("This applications does not support launching SCORM 1.0 or 1.1 content. Please make sure you are using the correct schemaversion in the imsmanifest.xml file");
					return;
				case "aicc":
                    playerInitFn = initAiccPlayer;
                    break;
				case "1.2":
					//scorm_player_path = "scorm12player.htm"
                    playerInitFn = initScorm12Player;
                    break;
				case "CAM 1.3"://scorm 2004 2nd ed
				case "2004 3rd Edition"://scorm 2004 3rd ed
				case "2004 4th Edition"://scorm 2004 4th ed
					try{
						getScorm2004Api();//this method only exists in the SCORM 2004 without Sequencing and Navigation
					}catch(e){
						document.location.href = "scorm2004player.htm?" + document.location.href.split("?")[1];
						return;
					}
                    playerInitFn = initScorm2004Player;
				    break;
				default:
					alert("This applications does not recognize schemaversion "+this.schemaversion+". Please make sure you are using the correct schemaversion in the imsmanifest.xml file");
	
			}

			path = getCourseDirectory()+"/"+objResource["href"];
            if (parameters) {
				if (path.indexOf('?') > -1) {
	                path = path + "&" + parameters;
				}
				else {
	                path = path + "?" + parameters;
				}
            }
			scoid = id;
		
			//encode the course path with a special encoding so that the querystring parser does not parse out any course specific url variables that came from the manifest file.
			path = utils.jcaEncodePath(path);

			this.activityId = activityId;
            playerInitFn({
                act_id: activityId,
                sco_id: scoid,
                path: path,
                student_name: student_name,
			    student_id: studentid,
                data_from_lms: datafromlms,
			    mastery_score: masteryscore,
                max_time_allowed: maxtimeallowed,
                time_limit_action: timelimitaction,
                cmi_core_credit: cmi_core_credit,
                cmi_core_lesson_mode: cmi_core_lesson_mode
            });

            document.getElementById(activityId).childNodes[0].style.backgroundColor = config.activeItemHighlightColor;
            return;
		}
	}
};

CreateTableOfContents.prototype.findSCORMVersion = function(version)
{
	//check to see if there is a version that we know. If so then just return.
	switch(version)
	{
        case "aicc":
            return false;
        case "1.1":
		case "1.0":
		case "1.2":
            //return "1.2";
		case "CAM 1.3"://scorm 2004 2nd ed
		case "2004 3rd Edition"://scorm 2004 3rd ed
		case "2004 4th Edition"://scorm 2004 4th ed
			//return "2004";
            return version;
        default:
            //continue in because we dont have a version that will work.
	}
	//is there a schema version node anywhere in the xml object?
	n = JSON.stringify(this.objXmlData);
    //first check everywhere for <schemaversion>
    if(this.objXmlData.hasOwnProperty('schemaversion'))
    {
        alert("there is a schema version");

    }
    //scorm 1.2 has adlcp:scormtype scorm 2004 has adlcp:scormType
	if(n.indexOf("adlcp:scormtype") != -1)
	{
		return "1.2";
	}
	
	if(n.indexOf("adlcp:scormType") != -1)
	{
		if(n.indexOf("adlcp_v1p3") != -1)
		{
			//verified it is SCORM 2004 but the edition is unknown, run as 3rd ed
			return "2004 3rd Edition";
		}
	}
}
/**
 *@method swapIcon
 *@param {id}
 *@param {status}
 *@return {VOID} 
 *@note Used swapping out icons on the table of contents based on the status of the activity.
 */
CreateTableOfContents.prototype.swapIcon = function(id, status)
{
	switch(status)
	{
		case "completed":
			img = config.tocStatusImages["completed"];
			strImage = "url("+img+")";
		break;
		case "incomplete":
			img = config.tocStatusImages["incomplete"];
			strImage = "url("+img+")";
		break;
		case "unknown":
			img = config.tocStatusImages["unknown"];
			strImage = "url("+img+")";
		break;
		case "not attempted":
			img = config.tocStatusImages["not_attempted"];
			strImage = "url("+img+")";
		break;
		case "passed":
			img = config.tocStatusImages["passed"];
			strImage = "url("+img+")";
		break;
		case "failed":
			img = config.tocStatusImages["failed"];
			strImage = "url("+img+")";
		break;
	}
	// TODO: Re-organize the loading events so this doesn't have to occur in a timeout loop.
	(function(backImage) {
		setTimeout(function() {
			if (document.getElementById(id)) {
				document.getElementById(id).style.background = backImage;
				document.getElementById(id).style.backgroundRepeat="no-repeat";
			}
		}, 1);
	})(strImage);
}
/**
 *@method setCompletionStatus
 *@param {id}
 *@param {status}
 *@return {VOID} 
 *@note Sets the completion status of the activity.
 */
CreateTableOfContents.prototype.setCompletionStatus = function(id, status)
{
	this.menuInstance.updateItemStatusByItemId(id,status);
	this.aryCompletionStatus[id] = status;
	this.swapIcon(id,status)
	this.processRollup();
}
intLastParentIndex = -1;
strLastStatus = "";
strParentStatus = "unknown";
/**
 *@method processRollup
 *@return {VOID} 
 *@note Code is not used at this time.
 */
CreateTableOfContents.prototype.processRollup = function()
{
return;
//this code only works for one level of children
/*
root
	child
	child
*/
	objMenuItems = this.menuInstance.getMenuObject();		
	for(obj in objMenuItems)
	{ 
		strStatus = objMenuItems[obj].status;
		intCurrParentIndex = objMenuItems[obj].parent;
		if(strStatus != "")
		{
			switch(strStatus)
			{
				case "passed":
				case "completed":
					strStatus = "completed";
					break;
				case "failed":
				case "incomplete":
					strStatus = "incomplete";
					break;
				case "unknown":
					strStatus = "unknown";
					break;
			}
		}
		
		if(intCurrParentIndex == intLastParentIndex)
		{
			if(strLastStatus == strStatus)
			{
				strParentStatus = strStatus;

			}else{
				strParentStatus = "unknown";
			}
		}
		intLastParentIndex = intCurrParentIndex;
		strLastStatus = strStatus; 
	}
	this.menuInstance.updateItemStatusByItemId(intLastParentIndex,strParentStatus);
	_id = "menu_level_"+intLastParentIndex;
	document.getElementById(_id).childNodes[0].style.backgroundImage = "url(images/status/"+strParentStatus+".gif)";
}
/**
 *@method getCompletionStatus
 *@param {id}
 *@return {this.aryCompletionStatus[id]} 
 *@note Get the completion status of the activity.
 */
CreateTableOfContents.prototype.getCompletionStatus = function(id)
{
	return this.aryCompletionStatus[id];
}
/**
 *@method getTOCCache
 *@param {}
 *@return {"{"+a+"}"} 
 *@note Returns a JSON string containing the completion status for each activity in the activity tree. The name for this JSON string is set in the 
 config file using 'this.tocDataObjectName'
 */
CreateTableOfContents.prototype.getTOCCache = function()
{
	a = "\"aryCompletionStatus\":" + JSON.stringify(this.aryCompletionStatus);
	return "{"+a+"}"; 
}
/**
 *@method setTOCCache
 *@param {val}
 *@return {VOID} 
 *@note Parses the aryCompletionStatus JSON string containing the completion status for each activity in the activity tree. And returns an object that is then used to 
 populate the user interface with the correct status icons.
 */
CreateTableOfContents.prototype.setTOCCache = function(val)
{
	numberCompleted = 0;
	if(typeof(val) == "object")
	{
		objSuspendedData = val;
	}else{
		objSuspendedData = JSON.parse(val);
	}
	
	if(typeof(objSuspendedData.aryCompletionStatus) == 'undefined' || objSuspendedData.aryCompletionStatus == 'undefined'){
		return;
	}
	this.aryCompletionStatus = objSuspendedData.aryCompletionStatus;
	for(i in this.aryCompletionStatus)
	{
		if(i != "toJSONString")
		{
			this.swapIcon(i,this.aryCompletionStatus[i]);
			if(this.aryCompletionStatus[i] == "passed" || this.aryCompletionStatus[i] == "completed")
			{
			numberCompleted++;
			}
		}
	}
	if(this.totalNumOfSCOs == numberCompleted)
	{
		if(config.showCourseCertificate)
		{
			window.open("certificate.htm");
		}
	}else{
		//alert(this.totalNumOfSCOs +"=="+ numberCompleted);
	}
};
if (!window.console || !console.log) {
    var console = {};
    console.log = console.error = console.info = console.debug = console.warn = console.trace = console.dir = console.dirxml = console.group = console.groupEnd = console.time = console.timeEnd = console.assert = console.profile = function() {};
}

/**
 * @constructor
 * @class DebugWriter
 * @param {status,presentation}
 * @note main function for the Debug Writer
 */
function DebugWriter(status,presentation)
{
/**
 * @property
 * @type Array
 * @note this array holds all of the messages to be displayed in the debug window queue
 */
	this.aryDebugText = new Array();

/**
 * @property
 * @type Array
 * @note this array holds the type of message to be displayed in the debug window
 */	
	this.aryDebugType = new Array();
/**
 * @property
 * @type Object
 * @note object handle to teh debug window
 */
	this.objWin = new Object();
/**
 * @property
 * @type string
 * @note Name of the div layer where the debug info will be printed
 */	
	this.strDebugDivName = "_debug_window";
/**
 * @property
 * @type string
 * @note Name of the div layer where the debug toolbar will be printed
 */	
	this.strDebugToolbarDivName = "_debug_window_toolbar";
	
/**
 * @property
 * @type object
 * @note winObj.document
 */	
	var documentObject = new Object();
/**
 * @property
 * @type string
 * @note Is the debugger "on" or "off"
 */	
	this.status = status;
/**
 * @property
 * @type string
 * @note How should the debug information be presented? 
 * <br> "embed","popup","  "
 */	
	this.presentation = presentation;
	this.createDebugWindow(this.presentation);
	
}
	
/*method: create Debug Window
	Opens up the debug window and the document for writing
*/
DebugWriter.prototype.createDebugWindow = function(presentation) 
{
if(this.status == "off") return;
		switch(presentation)
		{
			case "popup":
				winObj = window.open();
				this.documentObject = winObj.document;
			break;
			case "embed":
				this.documentObject = window.document;
			break;
			case "console":
				this.documentObject = console.debug;
				return;
			break;
			default:
				winObj = window.open();
				this.documentObject = winObj.document;
			break;
		}
		eleDiv = this.documentObject.createElement('div');
		objDiv = this.documentObject.body.appendChild(eleDiv);
		objDiv.id = this.strDebugDivName;		
		objDiv.style.visibility = "hidden";
		objDiv.style.position = "absolute";
		objDiv.style.top = "50px";
		objDiv.style.left = "10px";
		objDiv.style.border =	"1px solid black";
		objDiv.style.backgroundColor = "#CCCCCC";
        objDiv.style.color = "#000000";
		objDiv.style.width = "80%";
		objDiv.style.height = "80%";
		objDiv.style.overflow = "auto";
		objDiv.style.paddingLeft = "5px";
		objDiv.style.zIndex=9;
		objDiv.innerHTML ="";
		
		//create the bar that will hold the print/save... buttons
		eleDiv1 = this.documentObject.createElement('div');
		objDiv1 = this.documentObject.body.appendChild(eleDiv1);
		objDiv1.id = this.strDebugToolbarDivName;
		objDiv1.style.visibility = "hidden";
		objDiv1.style.position = "absolute";
		tmp1 = objDiv.style.top;
		tmp2 = tmp1.split("px")[0];
		objDiv1.style.top = tmp2 - 30;
		objDiv1.style.left = objDiv.style.left;	
		objDiv1.style.width = objDiv.style.width;
		objDiv1.style.height = objDiv.style.height;
		if(presentation == "embed")
		{
			b1 = "<button onClick='debugWriter.saveDebugWindow();'>Save</button>";
			b2 = "<button onClick='debugWriter.printDebugWindow();'>Print</button>";
			b3 = "<button onClick='debugWriter.clearDebugWindow();'>Clear</button>";
			b4 = "<button onClick='debugWriter.hideDebugWindow();'>Hide</button>";
			b5 = "<button onClick='debugWriter.clearDebugQueue();'>Clear Queue</button>";
			objDiv1.innerHTML =	b1+b2+b3+b4+b5;				
		}else{
			b1 = "<button onClick='opener.debugWriter.saveDebugWindow();'>Save</button>";
			b2 = "<button onClick='opener.debugWriter.printDebugWindow();'>Print</button>";
			b3 = "<button onClick='opener.debugWriter.clearDebugWindow();'>Clear</button>";
			b4 = "<button onClick='opener.debugWriter.hideDebugWindow();'>Hide</button>";
			b5 = "<button onClick='opener.debugWriter.clearDebugQueue();'>Clear Queue</button>";
			objDiv1.innerHTML =	b1+b2+b3+b4+b5;				
			this.showDebugWindow()
		}

		
		//***********************	
	
}

DebugWriter.prototype.showDebugWindow = function() 
{
	if(this.status == "off") return;
	if(this.presentation == "console") return;
	
	if(this.documentObject.getElementById(this.strDebugDivName))
	{
		this.documentObject.getElementById(this.strDebugDivName).style.visibility="visible";
		this.documentObject.getElementById(this.strDebugToolbarDivName).style.visibility="visible";
		this.documentObject.getElementById(this.strDebugDivName).innerHTML = this.displayTextInDebugWindow();
	}
}
/*method: clearDebugWindow
	Clears all messages in the debug window
*/
DebugWriter.prototype.clearDebugWindow = function()
{if(this.status == "off") return;
	this.documentObject.getElementById(this.strDebugDivName).innerHTML = "";
	
}

DebugWriter.prototype.clearDebugQueue = function()
{if(this.status == "off") return;
	this.aryDebugText = [];
	this.aryDebugType = [];
	//if the window is visible and is created then refresh it to show that there is no more data
	if(this.documentObject.getElementById(this.strDebugDivName))
	{
		if(this.documentObject.getElementById(this.strDebugDivName).style.visibility == "visible")
		{
			this.showDebugWindow();
		}
	}
}

/*method: displayTextInDebugWindow
	If the debug window exists, then write to it
*/
DebugWriter.prototype.displayTextInDebugWindow = function() 
{if(this.status == "off") return;
  var strText = "";
	for (i = 0; i < this.aryDebugText.length; i++)
	{
		switch(this.aryDebugType[i].toLowerCase())
		{
			case "debug":
				strText += "<FONT COLOR=00FF00>";
				break;
			case "warning":
				strText += "<FONT COLOR=FFFF00>";
				break;
			case "error":
				strText += "<FONT COLOR=FF0000>";
				break;
			default:
				strText += "<FONT COLOR="+this.aryDebugType[i]+">";//they must have passed in a color instead of a type
				break;
		}
		strText += this.aryDebugText[i]+"<br>";
		strText += "</FONT><BR>";
	}
	return strText;
 }

/*method: closeDebugWindow
	If the debug window exists, then close it
*/
DebugWriter.prototype.hideDebugWindow = function() 
{if(this.status == "off") return;
	if(this.documentObject.getElementById(this.strDebugDivName))
	{
		this.documentObject.getElementById(this.strDebugDivName).style.visibility="hidden";
		this.documentObject.getElementById(this.strDebugToolbarDivName).style.visibility="hidden";
	}
}

/*method: writeToDebugWindow
	adds a message to the debug window queue
	Parameters: message -text message to print to the debug window
	                     type - the type of message (error, debug, warning, [some color] ) not case sensitive 
	
*/
DebugWriter.prototype.writeToDebugWindow = function(message,type) 
{if(this.status == "off") return;
	if(message =="")return;
	if(this.presentation == "console")
	{
		try{
		console.debug(message);
		}catch(e){
		//does not support console.log
		this.presentation = "popup";
		}
		return;
	}
	this.documentObject.getElementById(this.strDebugDivName).scrollTop = this.documentObject.getElementById(this.strDebugDivName).scrollHeight;
	if(type == "" || typeof(type) == "undefined")
	{	
		type = "#000000";//default is black text
	}
	this.aryDebugText[this.aryDebugText.length] = message
	this.aryDebugType[this.aryDebugType.length] = type
	if(this.documentObject.getElementById(this.strDebugDivName).style.visibility == "visible")//if it is already visible
	this.showDebugWindow();
}
/*method: printDebugWindow
	prints the debug window
*/
DebugWriter.prototype.printDebugWindow = function()
{if(this.status == "off") return;
	alert("print disabled");
	//window.print();
}

/*method: saveDebugWindow
	This function uses the file system object (FSO) to save a text file to the user's PC (C:\\debugger.txt)
*/
DebugWriter.prototype.saveDebugWindow = function(sText)
{if(this.status == "off") return;
	try{
		var fso = new ActiveXObject("Scripting.FileSystemObject");
		var s = fso.CreateTextFile("C:\\debugger.htm", true);
		s.WriteLine(this.displayTextInDebugWindow());
		s.Close();
		alert("File was saved to C:\\debugger.htm");
	}catch(e){
		alert(e.name + "\n" + e.description + "\nThe file was not saved. \nSave uses the activeX File System Object (FSO) so please check your activeX control permissions and try again.") 
	}
}
Menu = function()
{
	this.objMenuItems		= 	new Object();
}
/*
	title - the title of this item as it will display in the menu
	itemId - identifier for the item
	resourceId - resource associated with this item
	index - the position within the menu
*/
Menu.prototype.setMenuItem = function(title,itemId,resourceId,status,index,parentIndex)
{
	this.objMenuItems[index] = 
	{
		title:title,
		itemId:itemId,
		resourceId:resourceId,
		status:status,
		parent:parentIndex
	};
}

/*
name = title.itemId,resourceId,index
value = string to find 
*/
Menu.prototype.getMenuItem = function(name, value) 
{
	if(name == "index")
	{
		return this.objMenuItems[value];
	}else{
		for(obj in this.objMenuItems)
		{
			v = eval("this.objMenuItems[obj]." + name);
			if(v == value)
			{
				return this.objMenuItems[obj];
			}
		}
	}
	return -1;
}

Menu.prototype.getMenuItemByIndex = function(index)
{
	return this.objMenuItems[index];
}
Menu.prototype.getMenuItemIndex = function(name, value) 
{
	if(name == "index")
	{
		alert("Can not use the index to look up an index.")
	}else{
		for(obj in this.objMenuItems)
		{
			v = eval("this.objMenuItems[obj]." + name);
			if(v == value)
			{
				return obj;
			}
		}
	}
	return -1;
}

Menu.prototype.getMenuObject = function() 
{
	return this.objMenuItems;
}
Menu.prototype.getFirstLeafActivity = function() 
{
	for(obj in this.objMenuItems)
	{
		if(this.objMenuItems[obj].resourceId != "")
		{
			return this.objMenuItems[obj];
		}
	}
	return "";
}
Menu.prototype.getLastItem = function() 
{
	return this.objMenuItems[this.objMenuItems.length];
}
Menu.prototype.getLastAttemptedItem = function() 
{
	return "";
}

Menu.prototype.updateItemStatusByItemId = function(itemId,status)
{
	index = this.getMenuItemIndex("itemId", itemId);
	if(index == -1){return;}
	this.objMenuItems[index].status = status;
}
/** @constructor */
function StatementLogger(courseId, studentId) {
    this.courseId = courseId;
    this.studentId = studentId;
    this.uuid = generateUUID();
    this.statements = [];
    this.listeners = [];
}

StatementLogger.prototype.addStatement = function(statement) {
    var i;
    this.statements.push(statement);
    for (i=0; i < this.listeners.length; i++) {
        try {
            this.listeners[i](statement);
        }
        catch (e) {
            console.log('listener disappeared');
        }
    }
};

StatementLogger.prototype.serialize = function() {
    var i, arr = [];
    for (i=0; i < this.statements.length; i++) {
        arr.push({
            statementType: this.statements[i].statementType,
            statement: this.statements[i].statement,
            debugLevel: this.statements[i].debugLevel,
            displayWhen: this.statements[i].getDisplayWhen(),
            timeTaken: this.statements[i].timeTaken,
            subStatements: this.statements[i].subStatements
        });
    }
    return JSON.stringify(arr);
};

StatementLogger.prototype.save = function() {
    //noinspection JSUnresolvedFunction
    reqwest({
        url: config.statementLogSetUrl,
        method: config.ajaxType,
        type: "json",
        async: true,
        data: {
            "uuid": this.uuid,
            "courseId": this.courseId,
            "studentId": this.studentId,
            "timestamp": new Date().getTime(),
            "statements": this.serialize()
        }
    });
};

/** @constructor */
function StatementLogEntry(statementType) {
    this.when = new Date();
    this.statement = "";
    this.displayWhen = null;
    this.timeTaken = 0.;
    this.statementType = statementType;
    this.subStatements = [];
    this.debugLevel = "INFO";
}

StatementLogEntry.prototype.addSubStatement = function(subStatement) {
    this.subStatements.push(subStatement);
};

StatementLogEntry.prototype.stampTimeTaken = function() {
    this.timeTaken = (new Date().getTime() - this.when.getTime()) / 1000.
};

StatementLogEntry.prototype.getDisplayWhen = function() {
    if (!this.displayWhen) {
        this.displayWhen = this.when.toTimeString().split(" ")[0] + "." + this.when.getMilliseconds();
    }
    return this.displayWhen;
};
var ssla = (function (ssla) {
    if (!ssla) {
        ssla = {};
    }
    if (!ssla.storageLayers) {
        ssla.storageLayers = {};
    }

    ssla.storage = {
        getStorageLayer: function () {
            if (ssla.storageLayers.hasOwnProperty(config.storageMediaType)) {
                return ssla.storageLayers[config.storageMediaType];
            }
            alert('Storage layer type not recognized, check your configuration: ' + config.storageMediaType);
            return null;
        },

        load: function (callback, name, options) {
            return ssla.storage.getStorageLayer().load(callback, name, options);
        },

        save: function (callback, name, value, options) {
            return ssla.storage.getStorageLayer().save(callback, name, value, options);
        },

        saveDiff: function (callback, name, value, options) {
            return ssla.storage.getStorageLayer().saveDiff(callback, name, value, options);
        }
    };

    ssla.storageLayers.cookie = {
        doCallback: function(name, value, scormVersion) {
            if (scormVersion == "2004") {
                returnSCORMData(value);
            }
            else {
                if (name == "toc_data") {
                    returnFromAjaxTocData(value);
                }
                else {
                    returnFromAjaxScorm12Course(value);
                }
            }
        },

        load: function (callback, name, scormVersion) {
            var c = getCookies(), res;
            if (c[name]) {
                // TODO: Confirm the parse worked before blindly calling the callback.
                try {
                    res = JSON.parse(c[name]);
                    //return callback(true, name, res);
                    //return returnFromAjax(res);
                    ssla.storageLayers.cookie.doCallback(name, res, scormVersion);
                }
                catch (e) {
                    //return callback(false, name, null);
                    //return returnFromAjax(null);
                    ssla.storageLayers.cookie.doCallback(name, null, scormVersion);
                }
            }
            else {
                //callback(true, name, null);
                //return returnFromAjax(null);
                ssla.storageLayers.cookie.doCallback(name, null, scormVersion);
            }
        },

        save: function (callback, name, value) {
            var expires = null,
                path = '/',
                domain = null,
                secure = null;
            document.cookie = name + "=" + encodeURIComponent(value) +
            ((expires) ? "; expires=" + expires.toGMTString() : "") +
            ((path) ? "; path=" + path : "") +
            ((domain) ? "; domain=" + domain : "") +
            ((secure) ? "; secure" : "");
            if (callback) {
                callback(true, name, value);
            }
        },

        saveDiff: function (callback, name, value) {
            alert("ssla.storageLayers.cookie.saveDiff not supported.");
        }
    };

    function getCookies() {
        var cookies = {};           // The object we will return
        var all = document.cookie;  // Get all cookies in one big string
        if (all === "")             // If the property is the empty string
            return cookies;         // return an empty object
        var list = all.split("; "); // Split into individual name=value pairs
        for (var i = 0; i < list.length; i++) {  // For each cookie
            var cookie = list[i];
            var p = cookie.indexOf("=");        // Find the first = sign
            var name = cookie.substring(0, p);   // Get cookie name
            var value = cookie.substring(p + 1);  // Get cookie value
            value = decodeURIComponent(value);  // Decode the value
            cookies[name] = value;              // Store name and value in object
        }
        return cookies;
    }

    // TODO: There's too many external dependencies in here, the callbacks are wrong.
    ssla.storageLayers.server = {
        load: function (callback, name, scormVersion) {
            reqwest({
                url: config.getDataURL,
                method: config.ajaxType,
                type: "json",
                async: true,
                data: {
                    "name": name,
                    // TODO: Stop using global functions here.
                    "activityId": getCourseId(),
                    "studentId": getStudentId(),
                    "timestamp": new Date().getTime()
                },
                success: function (value) {
                    // If you return an empty response, reqwest gives you the XMLHttpRequest object as the first param.
                    debugWriter.writeToDebugWindow("in storage.load server returned value = " + value);
                    if (typeof(value) == "undefined" || !value ||
                        "responseText" in value ||
                        "responseXML" in value) {
                        value = {};
                    }
                    if (scormVersion == "2004") {
                        returnSCORMData(value);
                    }
                    else {
                        if (name == "toc_data") {
                            returnFromAjaxTocData(value);
                        }
                        else {
                            returnFromAjaxScorm12Course(value);
                        }
                    }
                },
                error: function (request, status, error) {
                    console.log(request, status, error);
                    debugWriter.writeToDebugWindow("in storage.load error retrieving data from server.");
                    alert("error in get ajax" + request + "," + status + "," + error);
                    returnFromAjax(null);
                }
            });
        },
        save: function (callback, name, value, options) {
            var async = true;
            globalActiveSaveCounter += 1;

            if (!options) {
                options = {};
            }
            if (config.forceSynchronousAjaxOnEnd && options.isEndRequest) {
                async = false;
            }

            reqwest({
                url: config.setDataURL,
                method: config.ajaxType,
                async: async,
                timeout: 5000,
                data: {
                    "name": name,
                    "theData": value,
                    // TODO: Stop using global functions here.
                    "activityId": getCourseId(),
                    "studentId": getStudentId(),
                    "timestamp": new Date().getTime()
                },
                success: function (msg) {
                    // alert( "Data Saved: " + msg );
                },
                error: function (msg) {
                    // alert( "Oops - something happened: " + msg);
                    // alert( "Data Saved: " + msg );
                },
                complete: function () {
                    ssla.storageLayers.server.onComplete();
                }
            });
            // Events don't fire for synchronous requests in reqwest, so do anything you have to
            // do on success manually here too.
            // https://github.com/ded/reqwest/issues/107
            if (!async) {
                ssla.storageLayers.server.onComplete();
            }
        },
        saveDiff: function (callback, name, value, options) {
            alert("ssla.storageLayers.server.saveDiff not supported.");
        },
        onComplete: function() {
            globalActiveSaveCounter -= 1;
        }
    };

    return ssla;
})(ssla);
/** @constructor */
function Utils() {
    this.currentCourseDetails = {};
}

Utils.prototype.StringtoXML = function (text) {
    var doc, parser;
    if (window.ActiveXObject) {
        doc = new ActiveXObject('Microsoft.XMLDOM');
        doc.async = 'false';
        doc.loadXML(text);
    }
    else {
        parser = new DOMParser();
        doc = parser.parseFromString(text, 'text/xml');
    }
    return doc;
};

Utils.prototype.openPage = function (strPageLocation, strWhere, windowName, settings) {
    var popUp;
    switch (strWhere) {
        case "self":
            document.location.replace(strPageLocation);
            break;
        case "popup":
            if (settings) {
                popUp = window.open(strPageLocation, windowName, settings);
            }
            else {
                popUp = window.open(strPageLocation, windowName);
            }
            if (popUp == null || typeof(popUp) == 'undefined') {
                //alert('Please disable your pop-up blocker and click the link again.');
            }
            else {
                popUp.focus();
            }
            break;
    }
    return popUp;
};

Utils.prototype.parseQueryString = function (variable) {
    var query = window.location.search.substring(1),
        obj = {},
        vars;
    vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        obj[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
    }
    return obj;
};

Utils.prototype.jcaDecodePath = function (p) {
    p = p.replace(/\[0\]/g, '&nbsp;');
    p = p.replace(/\[1\]/g, '&');
    p = p.replace(/\[2\]/g, '?');
    p = p.replace(/\[3\]/g, '=');
    return p;
};

Utils.prototype.jcaEncodePath = function (p) {
    p = p.replace(/&nbsp;/g, '[0]');
    p = p.replace(/\&/g, '[1]');
    p = p.replace(/\?/g, '[2]');
    p = p.replace(/\=/g, '[3]');
    return p;
};

Utils.prototype.decode = function (str) {
    return unescape(str.replace(/\+/g, " "));
};

function generateUUID() {
    var d = new Date().getTime();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
    });
}

function isEmptyObject(obj) {
    var name;
    for (name in obj) {
        return false;
    }
    return true;
}

/**
 *Matches a regular expression with a string
 *@required regexString - a regular expression , stringToCompare- a text string
 *@returns boolean true if the string matches the regular expression
 **/
function matchRegEx(regexString, stringToCompare) {
    stringToCompare = stringToCompare + "";
    var re = new RegExp(regexString);
    return !!stringToCompare.match(re);
}

function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

if (!String.prototype.trim) {
    (function () {
        // Make sure we trim BOM and NBSP
        var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
        String.prototype.trim = function () {
            return this.replace(rtrim, '');
        };
    })();
}

if (!window["configCustom"]) {
    window["configCustom"] = {};
}
var config = new Config(window["configCustom"]);
var debugWriter = new DebugWriter(config.debuggerStatus, config.debuggerLaunchType);
var utils = new Utils();
var objVars = utils.parseQueryString(document.location.href);
var globalActiveSaveCounter = 0;
var currentCourseDetails = {
    courseId: getCourseId(),
    studentId: getStudentId(),
    studentName: getStudentName()
};
utils.currentCourseDetails = currentCourseDetails;
var statementLogger = new StatementLogger(currentCourseDetails.courseId, currentCourseDetails.studentId);

//noinspection JSUnresolvedFunction
function getCourseId() {
    return objVars['courseId'];
}

function getCourseDirectory() {
    return config.courseBaseHtmlPath + objVars['courseDirectory'];
}

function getStudentId() {
    if (config.getStudentIdOverrideFn) {
        return config.getStudentIdOverrideFn();
    }
    return objVars['studentId'];
}

function getStudentName() {
    if (config.getStudentNameOverrideFn) {
        return config.getStudentNameOverrideFn();
    }
    return objVars['studentName'];
}

function prepareFrames() {
    var p = document.getElementById("frame-here");
    p.innerHTML = '<iframe name="jca_course_player" id="jca_course_player" frameborder="0" width="100%" height="100%" src="blank.htm"></iframe>';
    setupInterface();
    setupInterfaceNav();
}

// ------------------ START PARSER.HTM --------------------------

var activeCourse = getCourseDirectory() + "/" + config.scormManifestFileName;
utils.currentCourseDetails = currentCourseDetails;
var createTableOfContentsInstance;

function returnFromAjaxTocData(tocDataCache) {
    if (tocDataCache) {
        createTableOfContentsInstance.setTOCCache(tocDataCache);
    }

}

function setupInterface() {
    createTableOfContentsInstance = new CreateTableOfContents();
    createTableOfContentsInstance.initTraverse(activeCourse, setupInterface2);
}

function setupInterface2(strToc) {
    var creditNode, modeNode, objMenu;
    ssla.storage.getStorageLayer().load(null, config.tocDataObjectName);

    if (!config.showCourseCompletionStatus) {
        document.getElementById("course_completion_status_div").style.display = "none";
    }
    if (!config.showCourseSuccessStatus) {
        document.getElementById("course_success_status_div").style.display = "none";
    }
    if (!config.showCourseGrade) {
        document.getElementById("course_grade_div").style.display = "none";
    }

    creditNode = document.getElementById('credit-' + String(objVars['credit']));
    if (creditNode) {
        creditNode.checked = true;
    }
    modeNode = document.getElementById('mode-' + String(objVars['mode']));
    if (modeNode) {
        modeNode.checked = true;
    }

    loadTOC(strToc);
    if (config.autoLaunchFirstSCO == true) {
        //get the first item in the menu
        objMenu = createTableOfContentsInstance.menuInstance.getFirstLeafActivity();
        gotoSco(objMenu.resourceId, objMenu.itemId);
    }
}

function loadTOC(strToc) {
    document.getElementById('toc').innerHTML = strToc;
}

// ------------------ END PARSER.HTM --------------------------

// ------------------ START FRAMESETNAV.HTM --------------------------

var currMenuState = "hide";
function getTocInstance() {
    return createTableOfContentsInstance;
}

function toggleTOC() {
    var toggleMenu = document.getElementById('toggle_menu');
    switch (currMenuState) {
        case "hide":
            document.body.className = "hide-toc";
            currMenuState = "show";
            if (toggleMenu) {
                toggleMenu.innerHTML = "Show Menu";
            }
            break;
        case "show":
            document.body.className = "";
            currMenuState = "hide";
            if (toggleMenu) {
                toggleMenu.innerHTML = "Hide Menu";
            }
            break;
    }
}

function navigate(n) {
    var strCurrActivityId = getTocInstance().getCurrentActivityId();
    var strIndex = getTocInstance().menuInstance.getMenuItemIndex("itemId", strCurrActivityId);
    var strOp, intNewIndex, objMenu, i;

    switch (n) {
        case "previous":
            strOp = "-";
            break;
        case "next":
            strOp = "+";
            break;
        case "exit":
            //call commit
            //call finish
            //server then closes the SSLA
            endCurrentActivity();
            window.location.href = "blank_unloading.htm";
            window.close();
            return;
            break;
    }

    for (i = 1; i < 10; i++) {
        intNewIndex = eval("parseInt(" + strIndex + ")" + strOp + i);
        objMenu = createTableOfContentsInstance.menuInstance.getMenuItemByIndex(intNewIndex);
        try {
            if (objMenu.resourceId != "") {
                break;
            }
        }
        catch (e) {
        }
    }

    try {
        gotoSco(objMenu.resourceId, objMenu.itemId);
    }
    catch (e) {
        //there is no prev or next item
        var r = confirm("Would you like to close this course and return to the LMS main menu?");
        if (r) {
            top.window.close();
        }
    }
}

function endCurrentActivity() {
    // If an API handle exists of a particular mode, performs the close activity for it.
    if (API) {
        API.LMSCommit("");
        API.LMSFinish("");
    }
    else if (API_1484_11) {
        API_1484_11.Commit("");
        API_1484_11.Terminate("");
    }
}

function gotoSco(id, activityId) {
    // Force a finish.
    endCurrentActivity();

    // Navigate to a blank page to make sure any unload handlers fire.
    // TODO: Popup mode.
    jca_course_player.document.location.replace("blank.htm");

    var handler = setInterval(function() {
        if (globalActiveSaveCounter == 0) {
            createTableOfContentsInstance.lookupHrefByRef(id, activityId);
            clearInterval(handler);
        }
    }, 100);
}

function setupInterfaceNav() {
    if (!config.showSCOtoSCONavigation) {
        document.getElementById("sco_navigation").style.visibility = "hidden";
    }
    if (config.hideTOC) {
        toggleTOC();
    }
    if (config.showStatementLogPopupLink) {
        document.getElementById("show_statement_log_holder").style.visibility = "visible";
    }

    document.getElementById("prev").innerHTML = config.previousActivityText;
    document.getElementById("next").innerHTML = config.nextActivityText;
}

function showStatementLog() {
    utils.openPage("statementLog.htm", "popup", "statementLog");
}

// ------------------ END FRAMESETNAV.HTM --------------------------

// ------------------ START SCORM12PLAYER.HTM -------------------------
var qsObject, API, API_1484_11, CMI_DBInstance, oScormData, strCookieName, StatementLogEntry, popupSettings = "";
// we will init this global var in doLoadPage()
CMI_DBInstance = {};
oScormData = {};

strCookieName = '';

function initScorm12Player(initVars) {
    qsObject = initVars;
    debugWriter.showDebugWindow();
    API = getScorm12Api();
    doLoadPage(CMI_DB_12);
}

function initScorm2004Player(initVars) {
    qsObject = initVars;
    debugWriter.showDebugWindow();
    API_1484_11 = getScorm2004Api();
    doLoadPage(CMI_DB_2004);
}

//we use regex and not .trim() because we have to support IE8
function myTrim(x) {
    return x.replace(/^\s+|\s+$/gm, '');
}
/**
 * Parse the student name from the database and return it is a SCORM 1.2 conformant string
 * @required strName -  a string containing the user first and last name
 * @returns String a string formated lastName,firstName
 * @type String
 */
function parseStudentName(strName) {
    var strFirstName = "";
    var strLastName = "";
    var aryNames = [];
    if (strName.indexOf(",") != -1) {
        //there is already a comma
        aryNames = strName.split(",");
        strName = myTrim(aryNames[0]) + ", " + myTrim(aryNames[1]);
        return strName;
    }
    else {
        if (strName.indexOf(" ") != -1) {
            //there is a space, there are 2 names
            aryNames = strName.split(" ");
            for (i = 0; i < aryNames.length; i++) {
                if (i == 0) {
                    strFirstName = myTrim(aryNames[i]);
                }
                else if (i > 0) {
                    strLastName += myTrim(aryNames[i]);
                }
            }
            strName = strLastName + ", " + strFirstName;
            return strName;
        }
        else {
            return strName;
        }
    }
}

function doLoadPage(cmiDbClassVar) {
    debugWriter.writeToDebugWindow("doLoadPage :: Loading page data....");
    //if (config.convertStudentName) {
    //    stuName = getStudentName();
    //}
    //else {
    //    stuName = getStudentName();
    //}
    stuName = getStudentName();
    stuNumber = getStudentId();
    data_from_lms = qsObject["data_from_lms"];
    mastery_score = qsObject["mastery_score"];
    max_time_allowed = qsObject["max_time_allowed"];
    time_limit_action = qsObject["time_limit_action"];
    cmi_core_credit = qsObject["cmi_core_credit"];
    cmi_core_lesson_mode = qsObject["cmi_core_lesson_mode"];
    path = utils.jcaDecodePath(qsObject['path']);
    CMI_DBInstance = new cmiDbClassVar(stuName, stuNumber, data_from_lms, mastery_score, max_time_allowed, time_limit_action, cmi_core_credit, cmi_core_lesson_mode); //the interface to the database
    debugWriter.writeToDebugWindow("doLoadPage :: Loading Complete !");
    //Todo: make this a global object that can be referenced and then reference it as needed.
    loadCourse(stuNumber, qsObject['act_id'], qsObject['sco_id'], path);
}

function processRollup() {
    //root = parent.opener.document.getElementById('menu')
    //parent.opener.createTableOfContentsInstance.processRollup(root);
}

function loadCourse(strStudentId, strActId, strSCOId, coursePath) {
    debugWriter.writeToDebugWindow("in loadcourse()");
    strCookieName = strStudentId + "_" + strSCOId;
    debugWriter.writeToDebugWindow("in loadcourse() strCookieName = " + strCookieName);
    oScormData.coursePath = coursePath;
    debugWriter.writeToDebugWindow("in loadcourse() oScormData.coursePath = " + oScormData.coursePath);
    oScormData.strStudentId = strStudentId;
    debugWriter.writeToDebugWindow("in loadcourse() oScormData.strStudentId = " + oScormData.strStudentId);
    oScormData.strSCOId = strSCOId;
    debugWriter.writeToDebugWindow("in loadcourse() oScormData.strSCOId = " + oScormData.strSCOId);
    oScormData.strActivityId = strActId;
    v = ssla.storage.getStorageLayer().load(null, strCookieName);
    debugWriter.writeToDebugWindow("in loadCourse GetCookie() returned value = " + v);

}

function tryPopup(path) {
    return utils.openPage(path, "popup", "sco_win", popupSettings);
}

function popupManually() {
    var win = tryPopup(oScormData.coursePath);
    updateUserText();
    return win;
}

function updateCenterContent(s) {
    var handle = setInterval(function() {
        try {
            jca_course_player.document.getElementById("content").innerHTML = s;
            clearInterval(handle);
        }
        catch(e) { }
    }, 10);
}

function updateUserText() {
    updateCenterContent('Your course has been opened in a popup.  When you have completed your course, please press exit or close this window.');
}

function returnFromAjaxScorm12Course(v) {
    var i, win;
    debugWriter.writeToDebugWindow("in returnFromAjax() v = " + v);
    oScormData.data = v;
    debugWriter.writeToDebugWindow("in returnFromAjax() oScormData.coursePath = " + oScormData.coursePath);
    if (config.scoLaunchType == 2) {
        if (config.newWindowSettings.length == 0) {
            win = tryPopup(oScormData.coursePath);
        }
        else {
            //get all the settings
            popupSettings = "";
            for (i = 0; i < config.newWindowSettings.length; i++) {
                popupSettings += config.newWindowSettings[i] + ",";
            }
            win = tryPopup(oScormData.coursePath);
        }

        if (!win) {
            updateCenterContent('Your course window did not pop open correctly.<br>  <a onclick="parent.popupManually()" href="#">Click here to open the course.</a>');
        }
        else {
            updateUserText();
        }
    }
    else {
        jca_course_player.document.location.replace(oScormData.coursePath);
    }
}

// ------------------ END SCORM12PLAYER.HTM -------------------------

function wrapUp() {
    endCurrentActivity();
}
var arrInteractionTypes = {};//save all the interaction types for all the interactions so we can go back and look to see that the type sare valid.

var ScormBase = (function () {
    /** @constructor */
    var Base = function () {
        this._init();
    };

    Base.prototype._init = function () {
        /**
         * @property
         * @type Boolean
         * @note Variable used to check to see if any SCORM data has changed from the last time a commit was called. Only send commit data if there is a change.
         */
        this.lastSCORMData = "";

        /**
         * @property
         * @type Boolean
         * @note Set to true if setValue() has been called, when commit is called successfully it is set back to false.
         */
        this.isDirty = false;
        /**
         * @property
         * @type Boolean
         * @note Set to true if the SCO has been initialized
         */
        this._isInitialized = false;
        /**
         * @property
         * @type String
         * @note The Error code thrown by the API
         */
        this._errorCode;

        this.statementLogger = statementLogger;
        this.suspendFlagSet = false;
        // If we are on a final save/finish, mark it so we can handle the saving process differently.
        this.finishing = false;
    };

    Base.prototype.initialize = function (emptyStringNeeded) {
        var result, errorCode, statementEntry = new StatementLogEntry("runtime");

        ssla.events.lmsPreInitialize.dispatch();
        result = this._initialize(emptyStringNeeded);
        ssla.events.lmsPostInitialize.dispatch(result);

        errorCode = this._getLastError();

        statementEntry.statement = vsprintf("LMSInitialize(%S) returned %S.", [emptyStringNeeded,
                                                                               result]);
        statementEntry.stampTimeTaken();
        if (errorCode !== "0") {
            statementEntry.debugLevel = "ERROR";
            statementEntry.addSubStatement(vsprintf("LMSGetLastError returned %S.", [errorCode]));
        }
        this.statementLogger.addStatement(statementEntry);
        return result;
    };

    Base.prototype._initialize = function (emptyStringNeeded) {
        var strCookieName = oScormData.strStudentId + "_" + oScormData.strSCOId, res = "";

        /*
         * Checks if the SCO was previously initialized.
         */
        if (this._isInitialized) {
            this._errorCode = "101";
            //debugWriter.writeToDebugWindow("Initializing...Error 101","error");
            if (config.setInitializeToLMS) {
                ssla.storage.getStorageLayer().save(null, 'initialize', '{"' + strCookieName + '":"false"}');
            }
            res = "false";
        }
        else {
            /*
             * Checks whether the parameter is the required empty string and sets the
             * error code accordingly.
             */
            if (emptyStringNeeded != "" || emptyStringNeeded == null) {
                this._errorCode = "201";
                //debugWriter.writeToDebugWindow("Initializing...Error 201","error");
                if (config.setInitializeToLMS) {
                    ssla.storage.getStorageLayer().save(null, 'initialize', '{"' + strCookieName + '":"false"}');
                }
                res = "false";
            }
            else {
                /*
                 * Get the data back from the database and store in the local_data object
                 */
                var toFSO = oScormData.data; //dbConn.getDBdata
                //send the data from the database to local_data object
                //debugWriter.writeToDebugWindow("Restoring SCORM Data");
                CMI_DBInstance.callRestore(toFSO);
                //debugWriter.writeToDebugWindow(toFSO);
                //debugWriter.writeToDebugWindow("MS Browser. Called callRestore(toFSO)");
                this._isInitialized = true;
                this._errorCode = "0";
                //debugWriter.writeToDebugWindow("Initialized !");
                if (config.setInitializeToLMS) {
                    ssla.storage.getStorageLayer().save(null, 'initialize', '{"' + strCookieName + '":"true"}');
                }
                //as soon as we are initialized store some data in the LMS database so we have an attempt record
                CMI_DBInstance.callCommit();
                this.saveData();
                res = "true";
            }
        }
        return res;
    };

    Base.prototype.finish = function (emptyStringNeeded) {
        var result, errorCode, statementEntry = new StatementLogEntry("runtime");
        this.finishing = true;

        ssla.events.lmsPreFinish.dispatch();
        result = this._finish(emptyStringNeeded);
        ssla.events.lmsPreFinish.dispatch(result);

        errorCode = this._getLastError();

        statementEntry.statement = vsprintf("LMSFinish(%S) returned %S.", [emptyStringNeeded,
                                                                               result]);
        statementEntry.stampTimeTaken();
        if (errorCode !== "0") {
            statementEntry.debugLevel = "ERROR";
            statementEntry.addSubStatement(vsprintf("LMSGetLastError returned %S.", [errorCode]));
        }
        this.statementLogger.addStatement(statementEntry);
        return result;
    };

    Base.prototype._finish = function (emptyStringNeeded) {
        console.log('_finish not implemented');
    };

    Base.prototype.commit = function (emptyStringNeeded) {
        var result, errorCode, statementEntry = new StatementLogEntry("runtime");

        ssla.events.lmsPreCommit.dispatch();
        result = this._commit(emptyStringNeeded);
        ssla.events.lmsPostCommit.dispatch(result);
        errorCode = this._getLastError();

        statementEntry.statement = vsprintf("LMSCommit(%S) returned %S.", [emptyStringNeeded,
                                                                           result]);
        statementEntry.stampTimeTaken();
        if (errorCode !== "0") {
            statementEntry.debugLevel = "ERROR";
            statementEntry.addSubStatement(vsprintf("LMSGetLastError returned %S.", [errorCode]));
        }
        this.statementLogger.addStatement(statementEntry);
        return result;
    };

    Base.prototype._commit = function (empty_string_needed) {
        //debugWriter.writeToDebugWindow("LMSCommit :: Committing....");
        if (!this._isInitialized) {
            this._errorCode = "301";
            //debugWriter.writeToDebugWindow("Committing...Error 301","error");
            return "false";
        }
        if (empty_string_needed != "" || empty_string_needed == null) {
            this._errorCode = "201";
            //debugWriter.writeToDebugWindow("Committing...Error 201","error");
            return "false";
        }
        if (this.isDirty || this.finishing) {
            var so = CMI_DBInstance.callCommit();

            debugWriter.writeToDebugWindow("Committing data: " + so);
            //locateObjectInDom(getFrame("dbConn"),"flashSO").value = so;
            if (config.saveDataOnCommit) { this.saveData(); }
            if (so == null) {
                //debugWriter.writeToDebugWindow("Committing...Error data was not committed.","error");
                return "false";
            }
            else {
                //debugWriter.writeToDebugWindow("Committed !");
                this.isDirty = false;
                return "true";
            }
        }
        return "true";
    };

    Base.prototype.getValue = function (dataModelElement) {
        var result, errorCode, statementEntry = new StatementLogEntry("runtime");

        ssla.events.lmsPreGetValue.dispatch(dataModelElement);
        result = this._getValue(dataModelElement);
        ssla.events.lmsPostGetValue.dispatch(dataModelElement, result);

        errorCode = this._getLastError();

        statementEntry.statement = vsprintf("LMSGetValue(%S) returned %S.", [dataModelElement,
                                                                             result]);
        statementEntry.stampTimeTaken();
        if (errorCode !== "0") {
            statementEntry.debugLevel = "ERROR";
            statementEntry.addSubStatement(vsprintf("LMSGetLastError returned %S.", [errorCode]));
        }
        this.statementLogger.addStatement(statementEntry);
        return result;
    };

    /**
     * @method LMSGetValue
     * @param data_model_element  a valid CMI data model element as defined in the SCORM 1.2 RTE
     * @return String returns the value associated with the data model element that was requested
     * @type string
     * @note * Pseudo Code Logic:
     <br> 1. check to see if the data model element value requested is a valid data model element
     <br> 2. make sure the data model element is able to be read (not write only).
     <br> 3. make sure all the objectives rules are followed
     <br> 4. request data from the LMS
     */
    Base.prototype._getValue = function (data_model_element) {
        debugWriter.writeToDebugWindow("LMSGetValue :: Getting value " + data_model_element + " from LMS");

        /**
         * The value that is stored specified by the data model element
         * @type String
         */

        var value = "";
        if (this._isInitialized) {
            /*
             * Sets the error code based on the data model element passed in
             */
            this._errorCode = this.errorHandling(data_model_element, "", this._isInitialized, "get");

            /*
             * Checks whether element is readable and and is a valid data model element
             */
            if ((this.checkForValidDataModelElement(data_model_element)) && (this.isReadable(data_model_element))) {
                if (data_model_element.indexOf("_children") != -1) {
                    value = this.getDataModelElementChildElements(data_model_element);
                }
                else {
                    value = this._internalGetValue(data_model_element);
                }
            }
            debugWriter.writeToDebugWindow("LMSGetValue :: Value of " + data_model_element + " is " + value);
            return value.toString();
        }
        else {
            value = "";
            this._errorCode = "301";
            return ""
        }
    };

    Base.prototype.setValue = function (dataModelElement, value) {
        var result, errorCode, statementEntry = new StatementLogEntry("runtime");

        ssla.events.lmsPreSetValue.dispatch(dataModelElement, value);
        result = this._setValue(dataModelElement, value);
        ssla.events.lmsPostSetValue.dispatch(dataModelElement, value);
        errorCode = this._getLastError();

        statementEntry.statement = vsprintf("LMSSetValue(%S, %S) returned %S.", [dataModelElement,
                                                                                 value,
                                                                                 result]);
        statementEntry.stampTimeTaken();
        if (errorCode !== "0") {
            statementEntry.debugLevel = "ERROR";
            statementEntry.addSubStatement(vsprintf("LMSGetLastError returned %S.", [errorCode]));
        }
        this.statementLogger.addStatement(statementEntry);
        return result;
    };

    Base.prototype.getLastError = function () {
        var result, statementEntry = new StatementLogEntry("runtime");

        result = this._getLastError();

        statementEntry.statement = vsprintf("LMSGetLastError() returned %S.", [result]);
        statementEntry.stampTimeTaken();
        this.statementLogger.addStatement(statementEntry);
        return result;
    };

    Base.prototype._getLastError = function () {
        if (this._errorCode == null || this._errorCode == undefined) {
            //debugWriter.writeToDebugWindow("LMSGetLastError :: No Errors");
            return "0";
        }
        else {
            //debugWriter.writeToDebugWindow("LMSGetLastError :: "+this._errorCode, "error");
            return this._errorCode;
        }
    };

    Base.prototype.getErrorString = function (errorCode) {
        var result, statementEntry = new StatementLogEntry("runtime");

        result = this._getErrorString(errorCode);

        statementEntry.statement = vsprintf("LMSGetErrorString(%S) returned %S.", [result]);
        statementEntry.stampTimeTaken();
        this.statementLogger.addStatement(statementEntry);
        return result;
    };

    /**
     * SCORM 1.2 string representation / interpertation of the error code that is passed in as a parameter
     * @requires String returns the SCORM 1.2 string representation / interpertation of the error code that is passed in as a parameter
     * @returns True is SCO was initialized False otherwise
     * @type String
     */
    Base.prototype._getErrorString = function (error_code) {
        var errString = "";
        if (this.errorCodeMap[error_code]) {
            errString = this.errorCodeMap[error_code];
        }
        if (error_code != "0") {
            //debugWriter.writeToDebugWindow("LMSGetErrorString :: "+errString, "error");
        }
        else {
            //debugWriter.writeToDebugWindow("LMSGetErrorString :: "+errString);
        }
        return errString;
    };

    Base.prototype.getDiagnostic = function (errorCode) {
        var result, statementEntry = new StatementLogEntry("runtime");

        result = this._getDiagnostic(errorCode);

        statementEntry.statement = vsprintf("LMSGetDiagnostic(%S) returned %S.", [result]);
        statementEntry.stampTimeTaken();
        this.statementLogger.addStatement(statementEntry);
        return result;
    };

    /**
     * Specifies an error encountered by the LMS trying to execute a command from the SCO
     * @required error code
     * @returns String The error thrown by the API
     * @type String
     */
    Base.prototype._getDiagnostic = function (error_code) {
        return error_code;
    };

    Base.prototype.checkObjectives = function () {
        console.log('checkObjectives not implemented.');
    };

    Base.prototype.checkInteractions = function () {
        console.log('checkInteractions not implemented.');
    };

    Base.prototype.customSetValueDmeChecks = function (data_model_element, value) {
        return value;
    };

    /**
     * @method LMSSetValue
     * @param data_model_element  a valid CMI data model element as defined in the SCORM 1.2 RTE
     * @param value a valid CMI data value as defined in the SCORM 1.2 RTE
     * @return String True if the data was saved to CMI_DBInstance > local_store, returns False otherwise
     * @type Function
     * @note * Pseudo Code Logic:
     <br>1.check to see if the data model element being set is a valid data model element
     <br>2.check to see it the value being set is valid for that data model element
     <br>3.check to see that all values are in string format
     <br>4.make sure that the data model element is able to be written (not read only)
     <br>5.make sure all the objectives rules are followed
     */
    Base.prototype._setValue = function (data_model_element, value) {
        debugWriter.writeToDebugWindow("LMSSetValue :: Setting value " + data_model_element + " to " + value + " in the LMS");
        /*
         * Sets the error code based on the data model element and value passed in
         */
        if (this._isInitialized) {
            this._errorCode = this.errorHandling(data_model_element, value, this._isInitialized, "set");
            if (this._errorCode == "402")return "false";
            /*
             * Checks whether element is writable and and is a valid data model element
             */
            //debugWriter.writeToDebugWindow("Checking " + data_model_element + " , " + value);
            a = this.checkForValidDataModelElement(data_model_element);
            //debugWriter.writeToDebugWindow("Is valid data model element? " + CheckForValidDataModelElement(data_model_element) );
            b = this.isWritable(data_model_element);
            //debugWriter.writeToDebugWindow("Is this data model element writable? " + isWritable(data_model_element) );
            c = this.checkValidValues(data_model_element, value);
            //debugWriter.writeToDebugWindow("Is the value valid for the data model element? " + checkValidValues(data_model_element,value) );
            if (a && b && c) {
                value = this.customSetValueDmeChecks(data_model_element, value);
                ret = this._internalSetValue(data_model_element, value);
                if (ret == "true" || ret == true) {
                    this._errorCode = "0";
                    this.isDirty = true;
                    //debugWriter.writeToDebugWindow("LMSSetValue :: Set!");
                }
                else {
                    //debugWriter.writeToDebugWindow("LMSSetValue :: Not Set!","error");
                }

                return ret.toString();
            }
            return "false";
        }
        else {
            this._errorCode = "301";
            return "false";
        }
    };

    /**
     * Method returns true or false depending if the the data model element passed in has child elements
     * @required data_model_element -  a valid CMI data model element as defined in the SCORM 1.2 RTE
     * @returns Boolean returns true or false depending if the data model element has children
     * @type String
     */
    Base.prototype.hasChildren = function(data_model_element) {
        //debugWriter.writeToDebugWindow("hasChildren " + data_model_element);
        //makes sure the data model element is valid
        if (this.checkForValidDataModelElement(data_model_element)) {
            //if the data model element has the substring "cmi.objective" and the substring "score._children"
            //the it returns true
            if (data_model_element.indexOf("cmi.objectives") != -1 && data_model_element.indexOf("score._children") != -1) {
                return true;
            }
            else {
                switch (data_model_element) {
                    case "cmi.core._children":
                        return true;
                        break;
                    case "cmi.core.score._children":
                        return true;
                        break;
                    case "cmi.objectives._children":
                        return true;
                        break;
                    case "cmi.interactions._children":
                        return true;
                        break;
                    case "cmi.student_data._children":
                        return true;
                        break;
                    case "cmi.student_preference._children":
                        return true;
                        break;
                    default:
                        return false;
                        break;
                }
            }
        }
    };

    /**
     * Method handles the error handling logic
     * @required data_model_element -  a valid CMI data model element as defined in the SCORM 1.2 RTE
     * @required value - a valid data value as described in the SCORM 1.2 RTE or empty string
     * @returns String returns a string with the error code set by the handling logic
     * @type String
     */
    Base.prototype.errorHandling = function (data_model_element, value, initialized, funct) {
        //debugWriter.writeToDebugWindow("errorHandling: element=" + data_model_element + " value=" + value + "funct=" + funct);
        var error_code = "0";
        //initialized takes precedence over everything
        if (!initialized) {
            error_code = "301"
        }
        else {
            if (funct == "set") {
                if ((data_model_element.indexOf("._count") != -1) || (data_model_element.indexOf("._children") != -1)) {
                    error_code = "402";
                    return error_code;
                }
            }
            if (this.checkForValidDataModelElement(data_model_element)) {
                if (typeof(value) == "undefined") {
                    value = "";//set it to something so it does not break any of the rest of teh javascript
                    error_code = "201";
                    return error_code;
                }
                //errors pertaining to LMSGetValue - because the value is empty
                if (funct == "get") {
                    //debugWriter.writeToDebugWindow("Determining GetValue errors on element " + data_model_element);
                    //checking for child elements - have to make sure element has children
                    if (data_model_element.indexOf("_children") != -1) {
                        //checks whether the element has children
                        //debugWriter.writeToDebugWindow("Does " + data_model_element + " allow for _children?");
                        if (!this.hasChildren(data_model_element)) {
                            //element does not have children error code
                            //debugWriter.writeToDebugWindow(data_model_element + " does not allow _children.","red");
                            error_code = "202";
                        }
                        else {
                            //This element does allow children, but as read only
                            //debugWriter.writeToDebugWindow(data_model_element + " does allow _children.");
                        }
                    }
                    //checks that _count is a valid attribute of the data model element
                    if (data_model_element.indexOf("_count") != -1) {
                        //checks which elements have _count as attribute
                        //debugWriter.writeToDebugWindow("Does " + data_model_element + " allow for _count?");
                        if (!checkCountValid(data_model_element)) {
                            //debugWriter.writeToDebugWindow(data_model_element + " does not allow _count.","red");
                            error_code = "203";
                        }
                        else {
                            //This element does allow count, but as read only
                            //debugWriter.writeToDebugWindow(data_model_element + " does allow _count.");
                        }
                    }
                    //making sure the data model element can be read
                    //debugWriter.writeToDebugWindow("Is " + data_model_element + " readable?");
                    if (!this.isReadable(data_model_element)) {
                        //element is write only
                        //debugWriter.writeToDebugWindow(data_model_element + " is write only.", "red");
                        error_code = "404";
                    }
                    else {
                        //debugWriter.writeToDebugWindow(data_model_element + " is readable.");
                    }
                }
                //errors pertaining to LMSSetValue - because the value is not empty
                if (value != "") {
                    //checks if element is a keyword and a value is being set
                    //has precedence over other error codes
                    if (elementIsKeyWord(data_model_element)) {
                        //invalid set value, element is keyword
                        error_code = "402";
                    }
                    else {
                        if (!this.checkValidValues(data_model_element, value)) {
                            //icorrect data type
                            error_code = "405";
                        }
                        //making sure that the data model element can be writen to
                        if (!this.isWritable(data_model_element)) {
                            //e;ement is read only
                            error_code = "403";
                        }
                    }
                }
            }
            //this is in case it is an element that does not exists
            else {
                //error code for invalid argument
                if (data_model_element.indexOf("_children") != -1) {
                    //debugWriter.writeToDebugWindow(data_model_element + " does not allow _children.","red");
                    error_code = "202";
                }
                else if (data_model_element.indexOf("_count") != -1) {
                    //debugWriter.writeToDebugWindow(data_model_element + " does not allow _count.","red");
                    error_code = "203";

                }
                else {
                    error_code = "201";
                }

            }
        }

        return error_code;
    };

    Base.prototype.getDataModelElementChildElements = function (data_model_element) {
        //debugWriter.writeToDebugWindow("GetDataModelElementChildElements " + data_model_element);
        /**
         * String containing all of the child elements for a specified data model element
         * @type string
         */
        var cmi_core_children = "student_id,student_name,lesson_location,credit,lesson_status,entry,score,total_time,lesson_mode,exit,session_time";
        var score_children = "raw,min,max";
        var cmi_objectives_children = "id,score,status";
        var cmi_student_data_children = "mastery_score,max_time_allowed,time_limit_action";
        var cmi_student_preference_children = "audio,language,speed,text";
        var cmi_interactions_children = "id,objectives,time,type,correct_responses,weighting,student_response,result,latency";
        //checks to see if the data model element is valid
        if (this.checkForValidDataModelElement(data_model_element)) {
            //if the data model element contains the substring score._children
            //will return the string raw, min, max fir both cmi.objective.n.scor._children
            //and cmi.core.score._children
            if (data_model_element.indexOf("score._children") != -1) {
                return score_children;
            }
            else {
                switch (data_model_element) {
                    case "cmi.core._children":
                        return cmi_core_children;
                        break;
                    case "cmi.objectives._children":
                        return cmi_objectives_children;
                        break;
                    case "cmi.student_data._children":
                        return cmi_student_data_children;
                        break;
                    case "cmi.student_preference._children":
                        return cmi_student_preference_children;
                        break;
                    case "cmi.interactions._children":
                        return cmi_interactions_children;
                        break;
                    default:
                        return "";
                        break;
                }
            }
        }
    };

    /**
     * Method returns true or false depending if the the data model element passed in is a valid one
     * @required data_model_element -  a valid CMI data model element as defined in the SCORM 1.2 RTE
     * @returns Boolean returns true or false depending if the data model element is a valid one
     * @type Function
     */
    Base.prototype.checkForValidDataModelElement = function (data_model_element) {
        //debugWriter.writeToDebugWindow("CheckForValidDataModelElement " + data_model_element);
        //checks to see if the data model element is cmi.objective and makes sure that
        //the objectives data model element is valid
        if (data_model_element.indexOf("cmi.objectives") != -1) {
            if (this.checkObjectives(data_model_element) == true) {
                return true;
            }
        }
        if (data_model_element.indexOf("cmi.interactions") != -1) {
            n = this.checkInteractions(data_model_element);
            //debugWriter.writeToDebugWindow("checkInteractions returns " + n);
            return n;
        }
        //otherwise just checks the data model element if is contained in the array
        else {
            //checks if the data model element passed in is the the array and returns true
            for (var i = 0; i < this.validDmes.length; i++) {
                if (data_model_element == this.validDmes[i]) {
                    return true;
                }
            }
            return false;
        }
    };

    /**
     * Method checks that the values being set are valid for the data model element
     * @required data_model_element -  a valid CMI data model element as defined in the SCORM 1.2 RTE
     * @required value -  a valid set value as defined in the SCORM 1.2 RTE
     * @returns Boolean returns a string witht the error code set by the handling logic
     * @type String
     */
    Base.prototype.checkValidValues = function (data_model_element, value) {
        console.log('checkValidValues not implemented.');
    };

    /**
     * Method returns true or false depending if the the data model element passed in is writable
     * @required data_model_element -  a valid CMI data model element as defined in the SCORM 1.2 RTE
     * @returns Boolean returns true or false depending if the data model element is writable
     * @type String
     */
    Base.prototype.isWritable = function (data_model_element) {
        //debugWriter.writeToDebugWindow("isWritable " + data_model_element);
        if (this.checkForValidDataModelElement(data_model_element)) {
            if (data_model_element.indexOf("cmi.interactions") != -1) {
                //the only 2 non writable elements od cmi.objectives are _children and _count
                if (data_model_element.indexOf("_children") == -1 || data_model_element.indexOf("_count") == -1) {
                    if (this.checkInteractions(data_model_element) == true) {
                        return true;
                    }
                }
            }
            //checks to see if the data model element is cmi.objective and makes sure that
            //the objectives data model element is valid
            if (data_model_element.indexOf("cmi.objectives") != -1) {
                //the only 2 non writable elements od cmi.objectives are _children and _count
                if (data_model_element.indexOf("_children") == -1 || data_model_element.indexOf("_count") == -1) {
                    if (this.checkObjectives(data_model_element) == true) {
                        return true;
                    }
                }
            }
            else {
                for (var i = 0; i < this.validWritables.length; i++) {
                    if (data_model_element == this.validWritables[i]) {
                        return true;
                    }
                }
                //will return false if the data model element is not in the writable array
                return false;
            }
        }
    };

    /**
     * Method returns true or false depending if the the data model element passed in is readable
     * @required data_model_element -  a valid CMI data model element as defined in the SCORM 1.2 RTE
     * @returns Boolean returns true or false depending if the data model element is readable
     * @type Function
     */
    Base.prototype.isReadable = function (data_model_element) {
        //debugWriter.writeToDebugWindow("isReadable " + data_model_element);
        if (this.checkForValidDataModelElement(data_model_element)) {
            //interactions
            if (data_model_element.indexOf("cmi.interactions") != -1) {
                if (data_model_element.indexOf("._children") != -1) {
                    return true;
                }
                if (data_model_element.indexOf("._count") != -1) {
                    return true;
                }
            }

            //checks to see if the data model element is cmi.objective and makes sure that
            //the objectives data model element is valid
            if (data_model_element.indexOf("cmi.objectives") != -1) {
                if (this.checkObjectives(data_model_element) == true) {
                    return true;
                }
            }
            else {
                for (var i = 0; i < this.validReadables.length; i++) {
                    if (data_model_element == this.validReadables[i]) {
                        return true;
                    }
                }
                //will return false if it did not find the data model element in the readable array
                return false;
            }
        }

    };

    Base.prototype._internalGetValue = function (data_model_element) {
        console.log('_internalGetValue not implemented.');
    };

    Base.prototype._internalSetValue = function (data_model_element, value) {
        console.log('_internalSetValue not implemented.');
    };

    Base.prototype.checkStatus = function (value, n) {
        console.log('checkStatus not implemented.');
    };

    /**
     * Method checks the values for raw, min, max
     * @required data_model_element -  a valid CMI data model element as defined in the SCORM 1.2 RTE
     * @returns Boolean returns true or false if the value is valid
     * @type String
     */
    Base.prototype.checkRawMinMax = function (value) {
        //converts the string into a number if possible by multiplying by one
        var numVal = value * 1;
        //javascript method isNaN checks to see if the string is a number or not - returns true if it is not a number false otherwise
        if (isNaN(numVal) || numVal < 0 || numVal > 100) {
            //not a number
            return false;
        }
        //it is a number
        return true;
    };

    /**
     * Method checks that the CMI times stamp is correnct format
     * @required value -  a valid set value as defined in the SCORM 1.2 RTE
     * @returns Boolean returns true or false if the value is valid
     * @type String
     */
    Base.prototype.checkCMITimeSpan = function (value) {
        var timeSpan = value.split(":");
        var hours = timeSpan[0];
        var minutes = timeSpan[1];
        var seconds = timeSpan[2];
        //checks that the hours, minutes, and seconds are int eh correct format
        if (checkHours(hours) == false || checkMins(minutes) == false || checkSecs(seconds) == false) {
            //incorrect timespan formatt
            return false;
        }
        return true;
    };

    /**
     * Method checks that value if a CMIString with 255 characters
     * @required value -  a valid set value as defined in the SCORM 1.2 RTE
     * @returns Boolean returns true or false if the value is valid
     * @type String
     */
    Base.prototype.checkCMIString255 = function (value) {
        /*RTE requires that the cmi.core.lesson_location element does not exceed 255 characters*/
        var CMIString256 = '^.{0,255}$';
        return matchRegEx(CMIString256, value)
    };

    /**
     * Method checks that value if a CMIString with 4096 characters
     * @required value -  a valid set value as defined in the SCORM 1.2 RTE
     * @returns Boolean returns true or false if the value is valid
     * @type String
     */
    Base.prototype.checkCMIString4096 = function (value) {
        /*RTE requires that the cmi.comments element does not exceed 4096 characters	*/
        var CMIString4096 = '^.{0,4096}$';
        return matchRegEx(CMIString4096, value)
    };

    Base.prototype.saveData = function () {
        var dataName, dataValue, tocData;
        dataName = oScormData.strStudentId + "_" + oScormData.strSCOId;
        dataValue = CMI_DBInstance.toDB();
        if (this.lastSCORMData != dataValue || this.finishing) {
            n = ssla.storage.getStorageLayer().save(null, dataName, dataValue, {isEndRequest: this.finishing});
            this.lastSCORMData = dataValue;
            this.isDirty = false;
        }
        debugWriter.writeToDebugWindow("SaveData() setting :: Value of " + dataName + " is " + dataValue);
        try {
            tocData = createTableOfContentsInstance.getTOCCache();
        }
        catch (e) {
            debugWriter.writeToDebugWindow("SaveData() error :: failed to locate createTableOfContentsInstance.getTOCCache()");
        }
        ssla.storage.getStorageLayer().save(null, config.tocDataObjectName, tocData, {isEndRequest: this.finishing});
        // TODO: This should be based on an event that happens elsewhere.
        if (config.saveStatementLog) {
            parent.statementLogger.save();
        }
        debugWriter.writeToDebugWindow("Leaving");
    };

    /**
     * Method checks that the hours are in correct format required by CMITimespan
     * @required hours - the hours that were split from the input string to CIMTimespan
     * @returns Boolean returns true or false if the hours is valid
     * @type String
     */
    function checkHours(hours) {
        var hrs = hours * 1;
        //hours are required to either have 2 or 4 digits in length
        if (!isNaN(hrs) && (hours.length == 2 || hours.length == 4)) {
            //not a number
            return true;
        }
        return false;
    }

    /**
     * Method checks that the hours are in correct format required by CMITimespan
     * @required minutes - the minutes that were split from the input string to CIMTimespan
     * @returns Boolean returns true or false if the minutes is valid
     * @type String
     */
    function checkMins(minutes) {
        var mins = minutes * 1;
        //minutes are required to have 2 digits in length
        if ((!isNaN(mins)) && (minutes.length == 2)) {
            //it is a number
            return true;
        }
        return false;
    }

    /**
     * Method checks that the hours are in correct format required by CMITimespan
     * @required seconds - the seconds that were split from the input string to CIMTimespan
     * @returns Boolean returns true or false if the seconds is valid
     * @type String
     */
    function checkSecs(seconds) {
        var sec = seconds * 1;
        //the seconds maybe in format nn.n or nn.nn or nn - this checks to see if there is a decimal in the seconds
        if (seconds.indexOf(".") != -1) {
            s = seconds.split(".");
            if (s.length > 2) {
                return false;
            }

            //check the first 2 digits
            if ((!isNaN(s[0])) && (s[0].length == 2)) {
                return true;
            }
            else {
                return false;
            }

            //check the second 2 digits
            if ((!isNaN(s[1])) && (s[1].length == 0 || s[1].length == 1 || s[1].length == 2)) {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            s = seconds;
            //check the first 2 digits
            if ((!isNaN(s)) && (s.length == 2)) {
                return true;
            }
            else {
                return false;
            }
        }
    }

    /**
     * Method makes sure that count is valid for the data model element
     * @required data_model_element -  a valid CMI data model element as defined in the SCORM 1.2 RTE
     * @returns Boolean returns true or false if _count is an attribute of the data model element
     * @type String
     */
    function checkCountValid(data_model_element) {
        //debugWriter.writeToDebugWindow("checkCountValid " + data_model_element);
        //only data model element implemented that has attribute count is cmi.objectives
        if (data_model_element.indexOf("cmi.objectives") != -1 || data_model_element.indexOf("cmi.interactions") != -1) {
            return true;
        }
        return false;
    }

    /**
     * Method checks if element is a keyword
     * @required data_model_element -  a valid CMI data model element as defined in the SCORM 1.2 RTE
     * @returns Boolean returns true or false if the element is a keyword
     * @type String
     */
    function elementIsKeyWord(data_model_element) {
        //debugWriter.writeToDebugWindow("elementIsKeyWord " + data_model_element);
        //checks to see if the data model element is a keyword - (keywords are: _count and _children)
        if ((data_model_element.indexOf("_children") != -1) || (data_model_element.indexOf("_count") != -1)) {
            return true;
        }
        return false;
    }

    return Base;
});

/**
 * @constructor
 * @class CMI_DB_12
 * @param {string} student_name
 * @param {string} student_number
 * @param {string} data_from_lms
 * @param {string} mastery_score
 * @param {string} max_time_allowed
 * @param {string} time_limit_action
 * @param {string} cmi_core_credit
 * @param {string} cmi_core_lesson_mode
 * @note Holds a local cache of the SCORM JSON data
 */
function CMI_DB_12(student_name, student_number, data_from_lms, mastery_score, max_time_allowed, time_limit_action, cmi_core_credit, cmi_core_lesson_mode) {
    /**
     * @property
     * @type string
     * @note The name of the student takeing the SCO. Usually sent as Last,First
     */
    this.student_name = student_name;
    /**
     * @property
     * @type string
     * @note The ID of the student takeing the SCO.
     */
    this.student_number = student_number;
    /**
     * @property
     * @type string
     * @note Parsed from <adlcp:data_from_lms/> in the imsmanifest.xml file.
     */
    this.data_from_lms = data_from_lms;
    /**
     * @property
     * @type string
     * @note Parsed from <adlcp:mastery_score/> in the imsmanifest.xml file.
     */
    this.mastery_score = mastery_score;
    /**
     * @property
     * @type string
     * @note Parsed from <adlcp:max_time_allowed/> in the imsmanifest.xml file.
     */
    this.max_time_allowed = max_time_allowed;
    /**
     * @property
     * @type string
     * @note Parsed from <adlcp:time_limit_action/> in the imsmanifest.xml file.
     */
    this.time_limit_action = time_limit_action;
    /**
     * @property
     * @type string
     * @note Set by the LMS at runtime. If not set this adapter defaults to "credit". Can be set to "credit" or "no credit".
     */
    this.cmi_core_credit = cmi_core_credit;
    /**
     * @property
     * @type string
     * @note Set by the LMS at runtime. If not set this adapter defaults to "normal". Can be set to "browse" "normal" "review".
     */
    this.cmi_core_lesson_mode = cmi_core_lesson_mode;
    /**
     * @property
     * @type object
     * @note The object that holds the cache of all the SCORM data before it is sent to the LMS. This is the object that gets converted to a JSON string.
     */
    this.local_data = {};
    /**
     * @method _setLocalData
     * @param name
     * @param value
     * @return String "true" if saved, "false" otherwise
     * @type Function

     * @note
     */
    this._setLocalData = function (name, value) {
        try {
            this.local_data[name] = value;
            debugWriter.writeToDebugWindow("_setLocalData " + name + "=" + value, "blue");
            return "true";
        } catch (e) {
            debugWriter.writeToDebugWindow("ERROR: _setLocalData " + e.description, "red");
            return "false";
        }
    };
    /**
     * @method _getLocalData
     * @param name
     * @return String value
     * @type Function

     * @note
     */
    this._getLocalData = function (name) {
        var value;
        try {
            value = this.local_data[name]
        } catch (e) {
            debugWriter.writeToDebugWindow("ERROR: _getLocalData " + e.description, "red");
            value = "";
        }
        return value;
    };


    /**
     * @method addTimes
     * @param oldSessionTimeSTR - a cmi.core.total_time
     * @param newSessionTimeSTR - a cmi.core.session_time
     * @return String strTotalTime a CMITimeSpan of the two added times.

     * @note Utility method to add two CMITimespan values together, such as session_time and total_time from the CMI datamodel.
     <br><br>
     <br>Recognized formats:
     <br>HHHH:MM:SS.SS
     <br>HHH:MM:SS.SS
     <br>HH:MM:SS.SS
     <br>HHHH:MM:SS.S
     <br>HHH:MM:SS.S
     <br>HH:MM:SS.S
     <br>HHHH:MM:SS
     <br>HHH:MM:SS
     <br>HH:MM:SS
     */
    this.addTimes = function (oldSessionTimeSTR, newSessionTimeSTR) {
        var oldTimeArr = this.parseTime(oldSessionTimeSTR);
        var newTimeArr = this.parseTime(newSessionTimeSTR);

        var today = new Date();
        var oldSessionTime = new Date(today.getYear(), today.getMonth(), today.getDay(), oldTimeArr[0], oldTimeArr[1], oldTimeArr[2], oldTimeArr[3]);
        var newSessionTime = new Date(today.getYear(), today.getMonth(), today.getDay(), newTimeArr[0], newTimeArr[1], newTimeArr[2], newTimeArr[3]);

        var addH = newSessionTime.getHours();
        var addM = newSessionTime.getMinutes();
        var addS = newSessionTime.getSeconds();
        var addMS = this.getMilliseconds(newSessionTimeSTR);

        var hourDiff = addH + oldSessionTime.getHours();
        var minDiff = addM + oldSessionTime.getMinutes();
        var secDiff = addS + oldSessionTime.getSeconds();
        var msDiff = addMS + this.getMilliseconds(oldSessionTimeSTR);

        if (msDiff >= 100) {
            msDiff = -(100 - msDiff);
            secDiff++;
        }
        if (secDiff >= 60) {
            secDiff = -(60 - secDiff);
            minDiff++;
        }
        if (minDiff >= 60) {
            minDiff = -(60 - minDiff);
            hourDiff++;
        }
        if (hourDiff >= 24) {
            hourDiff = -(24 - hourDiff);
        }
        if (secDiff <= 9) {
            secDiff = "0" + secDiff;
        }
        if (minDiff <= 9) {
            minDiff = "0" + minDiff;
        }
        if (hourDiff <= 9) {
            hourDiff = "0" + hourDiff;
        }

        return hourDiff + ":" + minDiff + ":" + secDiff + "." + msDiff;
    };
    /**
     * @method getMilliseconds
     * @param time
     * @return Integer intMilliseconds
     * @type Function

     * @note date.getMilliseconds thinks n:n:n.02 is the same as n:n:n.20. Both return .20 for milliseconds.
     */
    this.getMilliseconds = function (time) {
        //fix for error, date.getMilliseconds thinks n:n:n.02 is the same as n:n:n.20. Both return .20 for milliseconds
        var tmp = time + "";
        var intMilliseconds = 0;
        if (tmp.indexOf(".") != -1) {
            intMilliseconds = parseInt(tmp.split(".")[1]);
        }
        return intMilliseconds;
    };
    /**
     * @method parseTime
     * @param strtime string
     * @return Array {bits} int array of values

     * @note Method to take in a SCORM CMITimespan string value and return an integer array of the values it contains, so that we can can perform arithmetic
     */
    this.parseTime = function (strtime) {
        var bits = [0, 0, 0, 0];
        if (strtime == "" || typeof(strtime) == "undefined") {
            return bits;
        }
        var resultStr = strtime.split(":");
        // do hours...
        bits[0] = parseInt(resultStr[0]);
        // do minutes
        bits[1] = parseInt(resultStr[1]);
        // do seconds
        if (resultStr[2].indexOf(".") != -1) {
            // do milliseconds... (if exist)
            var millis = resultStr[2].split(".");
            if (millis.length == 2) {
                bits[2] = parseInt(millis[0]);
                if (millis[1].length == 1) {
                    bits[3] = parseInt(millis[1]) * 10;
                } else {
                    bits[3] = parseInt(millis[1]);
                }
            }
        } else {
            bits[2] = parseInt(resultStr[2]);
        }
        return bits;
    }
}
CMI_DB_12.prototype.callSetValue = function (data_model_element, element_value) {
    var v = "NO_DATA_REPORTED";
    var n = 0;
    //debugWriter.writeToDebugWindow("CMI_DB_12.js > callSetValue " + data_model_element + "," + element_value);
    //make sure we handle any data model elements that must be concatenated
    //cmi.comments (we use a space to separate comments, SCORM docs are not specific on the delimiter, we should check with other LMSs on this, what does the ADL SRTE do?)
    //make sure we handle any data model elements that must be added together
    //session_time =+ total_time

    switch (data_model_element) {
        case "cmi.core.session_time":
            var total_time = this._getLocalData("cmi.core.total_time");
            if (typeof(total_time) == "undefined") {
                total_time = "0000:00:00";
            }
            var t = this.addTimes(total_time, element_value);
            v = this._setLocalData("cmi.core.total_time", t + "");
            break;
    }

    //make sure we internally keep the ._count properties for all the items that have a count.
    //cmi.objectives._count
    //cmi.interactions._count
    //cmi.interactions.n.objectives.m._count
    //cmi.interactions.n.correct_responses._count
    if (data_model_element.indexOf("cmi.objectives.") != -1) {
        if (data_model_element.indexOf(".id") != -1) {
            //if this id is already set then do not increment the count because this is not a new id
            v = this.local_data[data_model_element];
            if (typeof(v) == "undefined") {
                n = parseInt(this.local_data["cmi.objectives._count"]);
                if (isNaN(n)) {
                    n = 0;
                }
                n++;
               // v = this._setLocalData("cmi.objectives._count", n + "");
                this.local_data["cmi.objectives._count"] = n;
            }

        }
    } else if (data_model_element.indexOf("cmi.interactions.") != -1) {
        if (data_model_element.indexOf("type") != -1) {
            arrInteractionTypes[data_model_element] = element_value;//arrInteractionTypes is a global variable defined in api.js
        }
        if (data_model_element.indexOf(".objectives") != -1) {

            if (data_model_element.indexOf(".id") != -1) {
                v = this.local_data[data_model_element];
                if (typeof(v) == "undefined") {
                    var index = data_model_element.split(".")[2];
                    n = parseInt(this.local_data["cmi.interactions." + index + ".objectives._count"]);
                    if (isNaN(n)) {
                        n = 0;
                    }
                    n++;
                  //  v = this._setLocalData("cmi.interactions." + index + ".objectives._count", n + "");
                    this.local_data["cmi.interactions." + index + ".objectives._count"] = n;
                }
            }

        } else if (data_model_element.indexOf(".id") != -1) {
            v = this.local_data[data_model_element];
            if (typeof(v) == "undefined") {
                //sco is sending a new interaction
                n = parseInt(this.local_data["cmi.interactions._count"]);
                if (isNaN(n)) {
                    n = 0;
                }
                n++;
                //v = this._setLocalData("cmi.interactions._count", n + "");
                this.local_data["cmi.interactions._count"] = n;
            }
        } else if (data_model_element.indexOf(".correct_responses") != -1) {

            if (data_model_element.indexOf(".pattern") != -1) {
                v = this.local_data[data_model_element];
                if (typeof(v) == "undefined") {
                    index = data_model_element.split(".")[2];
                    n = parseInt(this.local_data["cmi.interactions." + index + ".correct_responses._count"]);
                    if (isNaN(n)) {
                        n = 0;
                    }
                    n++;
                    //v = this._setLocalData("cmi.interactions." + index + ".correct_responses._count", n + "");
                    this.local_data["cmi.interactions." + index + ".correct_responses._count"] = n;
                }
            }
        }
    }
    v = this._setLocalData(data_model_element, element_value);
    return v
};

CMI_DB_12.prototype.callGetValue = function (data_model_element) {
    var v = this._getLocalData(data_model_element);
    if (data_model_element.indexOf("._count") > -1 && typeof(v) == "undefined") {
        v = "0";
    }
    return v;
};

CMI_DB_12.prototype.callCommit = function () {
    return this.toDB()
};

CMI_DB_12.prototype.toDB = function () {
    debugWriter.writeToDebugWindow("CMI_DB_12.prototype.toDB() " + JSON.stringify(this.local_data), "blue");
    return JSON.stringify(this.local_data);
};

CMI_DB_12.prototype.callRestore = function (obj) {
    if (typeof(obj) === "undefined" || !obj || isEmptyObject(obj)) {
        //set up the string with all the default values
        debugWriter.writeToDebugWindow("CMI_DB_12.prototype.callRestore nothing to restore; set up the string with all the default values", "blue");
        this.local_data["cmi.core.lesson_status"] = "not attempted";//this is an LMS default and will never change
        this.local_data["cmi.suspend_data"] = "";
        this.local_data["cmi.core.lesson_location"] = "";
        this.local_data["cmi.core.total_time"] = "0000:00:00";
        this.local_data["cmi.core.entry"] = "ab-initio";//this is to initialize the data model element for the first attempt only, after the first attempt it will no longer be ab-initio
        this.local_data["cmi.core.score.raw"] = "";
        this.local_data["cmi.core.score.min"] = "";
        this.local_data["cmi.core.score.max"] = "";
        this.local_data["cmi.comments"] = "";
        this.local_data["cmi.comments_from_lms"] = "No comment";//this is a value that will never change
        this.local_data["cmi.objectives._count"] = "0";
        this.local_data["cmi.interactions._count"] = "0";
        this.local_data["cmi.student_preference.audio"] = "";
        this.local_data["cmi.student_preference.language"] = "";
        this.local_data["cmi.student_preference.speed"] = "";
        this.local_data["cmi.student_preference.text"] = "";
    } else {
        debugWriter.writeToDebugWindow("CMI_DB_12.prototype.callRestore " + this.local_data, "blue");
        this.local_data = obj;
        //fix the core.entry
        if(this.local_data["cmi.core.entry"] == "ab-initio"){
            this.local_data["cmi.core.entry"] = "";
        }
    }

    this._setLocalData("cmi.core.student_name", (!this.student_name) ? "" : this.student_name);
    this._setLocalData("cmi.core.student_id", (!this.student_number || this.student_number == "") ? "001DEFAULTSTUDENT" : this.student_number);
    this._setLocalData("cmi.launch_data", (!this.data_from_lms) ? "" : this.data_from_lms);
    this._setLocalData("cmi.student_data.mastery_score", (!this.mastery_score) ? "" : this.mastery_score);
    this._setLocalData("cmi.student_data.max_time_allowed", (!this.max_time_allowed) ? "" : this.max_time_allowed);
    this._setLocalData("cmi.student_data.time_limit_action", (!this.time_limit_action) ? "" : this.time_limit_action);
    this._setLocalData("cmi.core.credit", (!this.cmi_core_credit) ? "credit" : this.cmi_core_credit);
    this._setLocalData("cmi.core.lesson_mode", (!this.cmi_core_lesson_mode) ? "normal" : this.cmi_core_lesson_mode);
    //alert("restore data is turned off")

};

var ScormBase12 = (function (base) {
    /**
     * @property
     * @type string
     * @note Regex: A number that may have a decimal point. If not preceded by minus sign, the
     number is presumed positive. Examples: (2, 2.2, and -2.2).</CMIDecimal//
     */
    var CMIDecimal = "^-?([0-9]{0,3})(\.[0-9]{1,2})?$";
    /**
     * @property
     * @type string
     * @note Regex: A structured description of a student response in an interaction. The
     structure and contents of the feedback depends upon the type of interaction. </CMIFeedback//
     */
    var CMIFeedback = "^.{0,255}$";
    /**
     * @property
     * @type string
     * @note Regex: An alphanumeric group of characters with no white space or unprintable
     characters in it. Maximum of 255 characters.</CMIIdentifier//
     */

    var CMIIdentifier = "^\\w{1,255}$";
    /**
     * @property
     * @type string
     * @note Regex: A chronological point in a 24 hour clock. Identified in hours, minutes, and
     seconds in the format: HH:MM:SS.SS.</CMITime//
     */
    var CMITime = "^([0-2]{1}[0-9]{1}):([0-5]{1}[0-9]{1}):([0-5]{1}[0-9]{1})(\.[0-9]{1,2})?$";
    /**
     * @property
     * @type string
     * @note Regex: A length of time in hours, minutes, and seconds shown in the following
     numerical format: HHHH:MM:SS.SS.</CMITimespan//
     */

    var CMITimespan = "^([0-9]{2,4}):([0-9]{2}):([0-9]{2})(\.[0-9]{1,2})?$";
    /**
     * @property
     * @type string
     * @note Regex: A structured description of a student response to an interaction. Used for interaction.n.result.
     */
    var CMIVocabulary_CMIResult = "^correct$|^wrong$|^unanticipated$|^neutral$|^([0-9]{0,3})?(\.[0-9]{1,2})?$";

    /** @constructor */
    var Base12 = function () {
        this._init();
    };
    for (var i in base.prototype) {
        Base12.prototype[i] = base.prototype[i];
    }

    Base12.prototype.validDmes = [
        "cmi.comments_from_lms",
        "cmi.comments",
        "cmi.core._children",
        "cmi.core.credit",
        "cmi.core.entry",
        "cmi.core.exit",
        "cmi.core.lesson_location",
        "cmi.core.lesson_mode",
        "cmi.core.lesson_status",
        "cmi.core.score._children",
        "cmi.core.score.max",
        "cmi.core.score.min",
        "cmi.core.score.raw",
        "cmi.core.session_time",
        "cmi.core.student_id",
        "cmi.core.student_name",
        "cmi.core.total_time",
        "cmi.launch_data",
        "cmi.student_data._children",
        "cmi.student_data.mastery_score",
        "cmi.student_data.max_time_allowed",
        "cmi.student_data.time_limit_action",
        "cmi.student_preference._children",
        "cmi.student_preference.audio",
        "cmi.student_preference.language",
        "cmi.student_preference.speed",
        "cmi.student_preference.text",
        "cmi.suspend_data"
    ];

    Base12.prototype.validWritables = [
        "cmi.comments",
        "cmi.core.exit",
        "cmi.core.lesson_location",
        "cmi.core.lesson_status",
        "cmi.core.score.max",
        "cmi.core.score.min",
        "cmi.core.score.raw",
        "cmi.core.session_time",
        "cmi.student_preference.audio",
        "cmi.student_preference.language",
        "cmi.student_preference.speed",
        "cmi.student_preference.text",
        "cmi.suspend_data"
    ];

    Base12.prototype.validReadables = [
        "cmi.comments_from_lms",
        "cmi.comments",
        "cmi.core._children",
        "cmi.core.credit",
        "cmi.core.entry",
        "cmi.core.lesson_location",
        "cmi.core.lesson_mode",
        "cmi.core.lesson_status",
        "cmi.core.score._children",
        "cmi.core.score.max",
        "cmi.core.score.min",
        "cmi.core.score.raw",
        "cmi.core.student_id",
        "cmi.core.student_name",
        "cmi.core.total_time",
        "cmi.launch_data",
        "cmi.student_data._children",
        "cmi.student_data.mastery_score",
        "cmi.student_data.max_time_allowed",
        "cmi.student_data.time_limit_action",
        "cmi.student_preference._children",
        "cmi.student_preference.audio",
        "cmi.student_preference.language",
        "cmi.student_preference.speed",
        "cmi.student_preference.text",
        "cmi.suspend_data"
    ];

    Base12.prototype.errorCodeMap = {
        "0": "No error",
        "101": "General Exception",
        "201": "Invalid argument error",
        "202": "Element cannot have children",
        "203": "Element not an array.",
        "301": "Not initialized",
        "401": "Not implemented error",
        "402": "Invalid set value, element is a keyword",
        "403": "Element is read only",
        "404": "Element is write only",
        "405": "Incorrect Data Type"
    };

    Base12.prototype._finish = function (empty_string_needed) {
        var strCookieName = oScormData.strStudentId + "_" + oScormData.strSCOId;
        //debugWriter.writeToDebugWindow("LMSFinish :: Finishing....");

        /*
         * Checks whether the parameter is the required empty string or null and sets the
         * error code accordingly.
         */
        if (empty_string_needed != "" || empty_string_needed == null) {
            this._errorCode = "201";
            //debugWriter.writeToDebugWindow("Finishing...Error 201","error");
            if (config.setFinishToLMS) {
                ssla.storage.getStorageLayer().save(null, 'finish', '{"' + strCookieName + '":"false"}');
            }
            return "false";
        }

        /*
         * Checks if the SCO was previously initialized.
         * sets error code to 0 if it was initialized.
         */
        if (this._isInitialized) {
            //SCORM_1.2_RuntimeEnv.pdf pg 3-25
            /*
             Upon receiving the LMSFinish call or the user navigates away, the LMS should set the cmi.core.lesson_status for the SCO to "completed"
             */
            if (config.completeContentOnExit) CMI_DBInstance.callSetValue("cmi.core.lesson_status", "completed");
            /*
             After setting the cmi.lesson_status to "completed" the LMS should now check to see if the Mastery Score has bee specified in the cmi.student_data.mastery_score, if supported,
             or the manifest that the SCO is a member of. If a Mastery Score is provided and the SCO did set the cmi.core.score.raw, the LMS shall compare the cmi.score.raw to the
             Mastery Score and set the cmi.core.lesson_status to either "passed or "failed". If no Mastery Score is provided, the LMS will leave the cmi.core.lesson_status as "completed"
             */
            var mastery_score = CMI_DBInstance.local_data["cmi.student_data.mastery_score"];
            if (mastery_score != "") {
                //there is a mastery score
                var raw_score = CMI_DBInstance.callGetValue("cmi.core.score.raw");
                if (raw_score != "") {
                    //the sco did set the cmi.core.score.raw
                    if (parseInt(raw_score) >= parseInt(mastery_score)) {
                        CMI_DBInstance.callSetValue("cmi.core.lesson_status", "passed");
                    }
                    else {
                        CMI_DBInstance.callSetValue("cmi.core.lesson_status", "failed");
                    }
                }
                else {
                    //the sco has a mastery score, but the sco did not set the cmi.core.score.raw
                    //do nothing
                }

            }
            else {
                //there is not a mastery score
                //do nothing
            }
            //prepare the resume state
            if (this.suspendFlagSet) {
                CMI_DBInstance.callSetValue("cmi.core.entry", "resume");
            }
            else {
                CMI_DBInstance.callSetValue("cmi.core.entry", "");
            }

            //cleanup and send all data to the LMS in case the SCO never calls commit
            this.saveData();
            this._isInitialized = false;
            this._errorCode = "0";
            debugWriter.writeToDebugWindow("Finishing...LMS called LMSCommitted on data");
            debugWriter.writeToDebugWindow("Finished !");

            if (config.setFinishToLMS) {
                ssla.storage.getStorageLayer().save(null, 'finish', '{"' + strCookieName + '":"true"}');
            }
            return "true";
        }
        else {
            this._errorCode = "301";
            //debugWriter.writeToDebugWindow("Finishing...Error 301","error");
            if (config.setFinishToLMS) {
                ssla.storage.getStorageLayer().save(null, 'finish', '{"' + strCookieName + '":"false"}');
            }
            return "false";
        }
    };

    Base12.prototype.customSetValueDmeChecks = function (data_model_element, value) {
        switch (data_model_element) {
            case "cmi.comments":
                var strPrevVal = this._internalGetValue(data_model_element);
                value = strPrevVal + value;
                break;
            case "cmi.core.exit":
                //deal with cmi.core.entry
                //if the sco did not set the cmi.core.exit to any value that LMS should set cmi.core.entry to ""
                debugWriter.writeToDebugWindow("cmi_core_exit_value = " + value, "green");
                switch (value) {
                    case "time-out":
                    //This indicates that the SCO has ended because the SCO has determined an excessive amount of time has elapsed, or the max_time_allowed has been exceeded.
                    //set cmi.core.entry =  "" upon the next launching of the SCO
                    //CMI_DBInstance.callSetValue("cmi.core.entry", "");
                    case "":
                    //The empty string vocabulary should be used to represent a normal exit state.
                    //set cmi.core.entry =  "" upon the next launching of the SCO
                    //CMI_DBInstance.callSetValue("cmi.core.entry", "");
                    case "logout":
                        //This indicates that the student logged out from within the SCO instead of returning to the LMS system to log out. This implies that the SCO passed control to the LMS
                        //system, and the LMS system automatically logged the student out of the course -- after updating the appropriate data model elements.

                        //set cmi.core.entry =  "" upon the next launching of the SCO and log the student out of the course
                        //CMI_DBInstance.callSetValue("cmi.core.entry", "");
                        this.suspendFlagSet = false;
                        break;
                    case "suspend":
                        //This indicates the student left the SCO with the intent of returning to it later at the point where he/she left off.
                        //set cmi.core.entry =  "resume" upon the next launching of the SCO
                        /*
                         upon receiving an lmsfinish or the user navigates away the lms should set the cmi.core.entry to either ""
                         or "resume" this is determined by the lms looking at the value that the sco had set for the cmi.core.exit
                         if the sco set the value to suspend then the lms will set cmi.core entry to "resume" upon the NEXT LAUNCH
                         of the sco. if the sco set the cmi.core.exit to a value other than "resume" or did not set the value at all,
                         the LMS will set cmi.core.entry to ""
                         */
                        //CMI_DBInstance.callSetValue("cmi.core.entry", "resume");
                        this.suspendFlagSet = true;
                        break;
                }

                debugWriter.writeToDebugWindow("cmi.core.entry = " + CMI_DBInstance.callGetValue("cmi.core.entry"), "green");
                //end cmi.core.exit case
                break;
        }
        return value;
    };

    /**
     * Method returns true or false if it's a valid objectives data model element
     * @required data_model_element -  a valid CMI data model element as defined in the SCORM 1.2 RTE
     * @returns boolean returns true or false depending if the objectives data model element is a valid one
     */
    Base12.prototype.checkObjectives = function (dme) {
        //debugWriter.writeToDebugWindow("checkObjectives " + data_model_element);
        return !!(endsWith(dme, "._children") ||
            endsWith(dme, "._count") ||
            endsWith(dme, ".id") ||
            endsWith(dme, ".score._children") ||
            endsWith(dme, ".score.max") ||
            endsWith(dme, ".score.min") ||
            endsWith(dme, ".score.raw") ||
            endsWith(dme, ".status"));

    };

    Base12.prototype.checkInteractions = function (dme) {
        //id,objectives,time,type,correct_responses,weighting,student_response,result,latency
        //debugWriter.writeToDebugWindow("checkInteractions " + data_model_element);
        if (endsWith(dme, "._children") ||
            endsWith(dme, "._count") ||
            endsWith(dme, ".id") ||
            endsWith(dme, ".type") ||
            endsWith(dme, ".time") ||
            endsWith(dme, ".correct_responses._count") ||
            endsWith(dme, ".weighting") ||
            endsWith(dme, ".student_response") ||
            endsWith(dme, ".result") ||
            endsWith(dme, ".latency")
            ) {
            return true;
        }

        if (dme.indexOf("correct_responses") != -1) {
            if (dme.indexOf(".pattern") != -1) {
                return true;
            }
        }
        //check the objectives within teh interactions
        else if (dme.indexOf("objectives") != -1) {
            dme = "objectives" + dme.split(".objectives")[1];
            this.checkObjectives(dme)
        }
        return false;
    };

    /**
     * Method checks that the values being set are valid for the data model element
     * @required data_model_element -  a valid CMI data model element as defined in the SCORM 1.2 RTE
     * @required value -  a valid set value as defined in the SCORM 1.2 RTE
     * @returns Boolean returns a string witht the error code set by the handling logic
     * @type String
     */
    Base12.prototype.checkValidValues = function (data_model_element, value) {
        var aryEle = [], n, d, blnRetVal, type_dme, strVal = String(value);
        if (value == null) return false;
        if (typeof(value) == "undefined") return false;
        //cmi.objectives is treated differently because there mey be an array of objectives
        if (data_model_element.indexOf("cmi.objectives") != -1) {
            //the only 2 non writable elements of cmi.objectives are _children and _count
            if (data_model_element.indexOf("_children") == -1 || data_model_element.indexOf("_count") == -1) {
                if (data_model_element.indexOf("id") != -1) {
                    if (value == "") {
                        this._errorCode = "405";
                        return false;
                    }
                    n = this._internalGetValue("cmi.objectives._count");
                    aryEle = data_model_element.split(".");

                    if (parseInt(aryEle[2]) > (n + 1)) {
                        //this is a special case and must return error code 201
                        this._errorCode = "201";
                        return false;
                    }
                    if (matchRegEx(CMIIdentifier, value)) {
                        return true;
                    }
                    else {
                        if (!config.checkObjectiveId) {
                            //this is needed because some courses set the id incorrectly
                            this._errorCode = "0";
                            return true;
                        }
                        else {
                            this._errorCode = "405";
                            debugWriter.writeToDebugWindow("The interaction id " + value + " does not match the CMIIdentifier definition " + CMIIdentifier, "red");
                            return false;
                        }
                    }

                }
                if (data_model_element.indexOf("score.max") != -1) {
                    if (!this.checkRawMinMax(value))this._errorCode = "405";
                    return this.checkRawMinMax(value);
                }
                if (data_model_element.indexOf("score.min") != -1) {
                    if (!this.checkRawMinMax(value))this._errorCode = "405";
                    return this.checkRawMinMax(value);
                }
                if (data_model_element.indexOf("score.raw") != -1) {
                    if (!this.checkRawMinMax(value))this._errorCode = "405";
                    return this.checkRawMinMax(value);
                }
                if (data_model_element.indexOf("status") != -1) {
                    return this.checkStatus(value);
                }
            }
        }
        if (data_model_element.indexOf("cmi.interactions") != -1) {
            if (data_model_element.indexOf("_children") == -1 || data_model_element.indexOf("_count") == -1) {
                //check to make sure that the interaction index exists and that there is an id set for this interaction
                n = this._internalGetValue("cmi.interactions._count");
                aryEle = data_model_element.split(".");

                if (parseInt(aryEle[2]) > (n + 1)) {
                    //this is a special case and must return error code 201
                    this._errorCode = "201";
                    return false;
                }

                if (data_model_element.indexOf("id") != -1) {
                    if (value == "") {
                        this._errorCode = "405";
                        return false;
                    }
                    if (matchRegEx(CMIIdentifier, value)) {
                        return true;
                    }
                    else {
                        if (!config.checkInteractionId) {
                            //this is needed because some courses set the id incorrectly
                            this._errorCode = "0";
                            return true;
                        }
                        else {
                            this._errorCode = "405";
                            debugWriter.writeToDebugWindow("The interaction id " + value + " does not match the CMIIdentifier definition " + CMIIdentifier, "red");
                            return false;
                        }
                    }
                }
                if (data_model_element.indexOf("correct_responses") != -1) {
                    //if(value=="")
                    //{
                    //	this._errorCode = "405";
                    //	return false;
                    //}
                    d = data_model_element.split("correct_responses")[0] + "._count";

                    n = this._internalGetValue(d);
                    aryEle = data_model_element.split(".");

                    if (parseInt(aryEle[4]) > (n + 1)) {
                        //this is a special case and must return error code 201
                        this._errorCode = "201";
                        return false;
                    }
                    //return matchRegEx(CMIIdentifier, value)
                }
                //cmi.interactions.n.objectives
                if (data_model_element.indexOf("time") != -1) {
                    //CMITime
                    return matchRegEx(CMITime, value);
                }
                if (data_model_element.indexOf("type") != -1) {
                    return this.checkInteractionType(value);
                }
                if (data_model_element.indexOf("pattern") != -1) {
                    //CMIFeedback
                    //verify pattern matches interaction type
                    type_dme = data_model_element.replace("pattern", "type");
                    switch (arrInteractionTypes[type_dme]) {
                        case 'true-false':
                            if (strVal.match(/^0|1|t|f$/) != null) {
                                blnRetVal = true;
                            }
                            break;
                        case 'choice':
                            if (strVal.match(/(^([0-9a-z],){0,25}[0-9a-z]$)|(^\{([0-9a-z],){0,25}[0-9a-z]\}$)/) != null) {
                                blnRetVal = true;
                            }
                            break;
                        case 'fill-in':
                            if (strVal.match(/^[a-zA-Z0-9 ]{0,255}$/) != null) {
                                blnRetVal = true;
                            }
                            break;
                        case 'matching':
                            if (strVal.match(/(^([0-9a-z]\.[0-9a-z],)*[0-9a-z]\.[0-9a-z]$)|(^{([0-9a-z]\.[0-9a-z],)*[0-9a-z]\.[0-9a-z]}$)/) != null) {
                                blnRetVal = true;
                            }
                            break;
                        case 'performance':
                            if (strVal.match(/^[a-zA-Z0-9 ]{0,255}$/) != null) {
                                blnRetVal = true;
                            }
                            break;
                        case 'sequencing':
                            if (strVal.match(/^([0-9a-z],)*[0-9a-z]$/) != null) {
                                blnRetVal = true;
                            }
                            break;
                        case 'likert':
                            //p.3-54: There is no incorrect response for a likert question. Field may be left blank.
                            blnRetVal = true;
                            break;
                        case 'numeric':
                            if (strVal.match(/^[\+\-]?(\d+|\d*\.\d+)$/) != null) {
                                blnRetVal = true;
                            }
                            break;
                    }

                    //return matchRegEx(CMIFeedback,value);
                }
                if (data_model_element.indexOf("weighting") != -1) {
                    //CMIDecimal
                    return matchRegEx(CMIDecimal, value);
                }
                if (data_model_element.indexOf("student_response") != -1) {
                    //CMIFeedback
                    return matchRegEx(CMIFeedback, value);
                }
                if (data_model_element.indexOf("result") != -1) {
                    //CMIVocabulary_CMIResult
                    return matchRegEx(CMIVocabulary_CMIResult, value);
                }
                if (data_model_element.indexOf("latency") != -1) {
                    //CMITimespan
                    return this.checkCMITimeSpan(value);
                }
            }
        }
        var intValue = parseInt(value);
        var numVal = intValue * 1;
        switch (data_model_element) {
            case "cmi.suspend_data":
                return this.checkCMIString4096(value);
                break;
            case "cmi.core.lesson_location":
                return this.checkCMIString255(value);
                break;
            case "cmi.core.lesson_status":
                return this.checkStatus(value, 1);
                break;

            case "cmi.comments":
                return this.checkCMIString4096(value);
                break;

            case "cmi.core.exit":
                switch (value) {
                    case "time-out":
                        //isFirstTime = false;
                        return true;
                        break;
                    case "suspend":
                        //isFirstTime = false;
                        return true;
                        break;
                    case "logout":
                        //isFirstTime = false;
                        return true;
                        break;
                    case "":
                        //isFirstTime = false;
                        return true;
                        break;
                    default:
                        return false;
                        break;
                }
                break;

            case "cmi.core.score.max":
                return this.checkRawMinMax(value);
                break;

            case "cmi.core.score.min":
                return this.checkRawMinMax(value);
                break;

            case "cmi.core.score.raw":
                return this.checkRawMinMax(value);
                break;

            case "cmi.core.session_time":
                /*
                 *Check to see that the session time is in the correct time format
                 *Use regex for the comparision
                 */
                CMITimespan = '^([0-9]{2,4}):([0-9]{2}):([0-9]{2})(\.[0-9]{1,2})?$';
                if (!matchRegEx(CMITimespan, value)) {
                    return false;
                }
                return this.checkCMITimeSpan(value);
                break;

            case "cmi.student_preference.audio":
                if (value == "") {
                    this._errorCode = "405";
                    return false;
                }
                if ((typeof(value) != "string") || (value.indexOf(".") != -1) || (isNaN(value))) {
                    return false;
                }
                intValue = parseInt(value);
                numVal = intValue * 1;

                if (isNaN(numVal)) {
                    return false;
                }
                else if (numVal < -1 || numVal > 100) {
                    return false;
                }
                else {
                    return true;
                }
                break;

            case "cmi.student_preference.language":
                return this.checkCMIString255(value);
                break;

            case "cmi.student_preference.speed":
                if (value == "") {
                    this._errorCode = "405";
                    return false;
                }
                if ((typeof(value) != "string") || (value.indexOf(".") != -1) || (isNaN(value))) {
                    return false;
                }
                intValue = parseInt(value);
                numVal = intValue * 1;

                if (isNaN(numVal)) {
                    return false;
                }
                else if (numVal < -100 || numVal > 100) {
                    return false;
                }
                else {
                    return true;
                }
                break;

            case "cmi.student_preference.text":
                if (value == "") {
                    this._errorCode = "405";
                    return false;
                }
                if (typeof(value) != "string") {
                    return false;
                }
                if (value == "-1" || value == "0" || value == "1") {
                    return true;
                }
                else {
                    return false;
                }
                break;
            default:
                return true;
        }
    };

    /**
     * Calls to the CMI_DB.js to return values
     * @required data_model_element -  a valid CMI data model element as defined in the SCORM 1.2 RTE
     * @returns returns a string with the value returned from the local_data object
     * @type String
     */
    Base12.prototype._internalGetValue = function (data_model_element) {
        //debugWriter.writeToDebugWindow("getValue("+data_model_element+")");
        return CMI_DBInstance.callGetValue(data_model_element);
    };

    /**
     * Calls to the CMI_DB.js to set values
     * @required data_model_element -  a valid CMI data model element as defined in the SCORM 1.2 RTE
     * @required value -  a valid set value as defined in the SCORM 1.2 RTE
     * @returns returns a string with the value of true or false
     * @type Boolean
     */
    Base12.prototype._internalSetValue = function (data_model_element, value) {
        debugWriter.writeToDebugWindow("setValue(" + data_model_element + "," + value + ")");
        var op = CMI_DBInstance.callSetValue(data_model_element, value);
        debugWriter.writeToDebugWindow("CMI_DBInstance.callSetValue returned " + op);
        if (typeof(op) == "undefined") {
            op = "false";
        }
        else {
            try {
                if (config.saveDataOnSetValue) {
                    this.saveData();
                }
            }
            catch (e) {
                // do nothing and we will try again after
            }
        }

        //this code is to update the table of contents status indicators if infact they are using the TOC indicators
        if (data_model_element == "cmi.core.lesson_status") {
            if (createTableOfContentsInstance) {
                createTableOfContentsInstance.setCompletionStatus(oScormData.strActivityId, value);
            }
            debugWriter.writeToDebugWindow("setValue on activity id " + oScormData.strSCOId);
        }

        debugWriter.writeToDebugWindow("setValue(" + data_model_element + "," + value + ") Returns: " + op);
        return op;
    };

    /**
     * Method checks the value to make sure it is one of the required vobulary for status
     * @required value -  a valid set value as defined in the SCORM 1.2 RTE
     * @returns Boolean returns true or false if the value is valid
     * @type String
     */
    Base12.prototype.checkStatus = function (value, n) {
        switch (value) {
            case "passed":
            case "completed":
            case "failed":
            case "incomplete":
            case "browsed":
                return true;
                break;
            case "not attempted":
                if (n == 1)//this is checking lesson_status not objective.lesson_status
                {
                    return false;
                }
                return true;
                break;
            //SCO can not set not attempted only the LMS can initialize to this value
            //case "not attempted":
            //	return true;
            //	break;
            default:
                return false;
                break;
        }
    };

    /**
     * Method checks the value to make sure it is one of the required vobulary for status
     * @required value -  a valid set value as defined in the SCORM 1.2 RTE
     * @returns Boolean returns true or false if the value is valid
     * @type String
     */
    Base12.prototype.checkInteractionType = function(value) {
        if (value == "") {
            this._errorCode = "405";
            return false;
        }

        return !!(value === "true-false" ||
            value === "choice" ||
            value === "fill-in" ||
            value === "matching" ||
            value === "performance" ||
            value === "sequencing" ||
            value === "likert" ||
            value === "numeric");
    };

    return Base12;
});

function getScorm12Api() {
    var v = ScormBase12(new ScormBase());
    var base = new v();
    var api = (function (base) {
        return {
            LMSInitialize: function (s) {
                return base.initialize(s);
            },
            LMSFinish: function (s) {
                return base.finish(s);
            },
            LMSCommit: function (s) {
                return base.commit(s);
            },
            LMSGetValue: function (dme) {
                return base.getValue(dme);
            },
            LMSSetValue: function (dme, value) {
                return base.setValue(dme, value);
            },
            LMSGetLastError: function () {
                return base.getLastError();
            },
            LMSGetErrorString: function (errorCode) {
                return base.getErrorString(errorCode);
            },
            LMSGetDiagnostic: function (errorCode) {
                return base.getDiagnostic(errorCode);
            }
        }
    })(base);
    return api;
}