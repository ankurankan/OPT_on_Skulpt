(function () {
    var COMPILED = true,
        goog = goog || {};
    goog.global = this;
    goog.DEBUG = false;
    goog.LOCALE = "en";
    goog.evalWorksForGlobals_ = null;
    goog.provide = function (a) {
        if (!COMPILED) {
            if (goog.getObjectByName(a) && !goog.implicitNamespaces_[a]) throw Error('Namespace "' + a + '" already declared.');
            for (var b = a; b = b.substring(0, b.lastIndexOf("."));) goog.implicitNamespaces_[b] = true
        }
        goog.exportPath_(a)
    };
    if (!COMPILED) goog.implicitNamespaces_ = {};
    goog.exportPath_ = function (a, b, c) {
        a = a.split(".");
        c = c || goog.global;
        !(a[0] in c) && c.execScript && c.execScript("var " + a[0]);
        for (var d; a.length && (d = a.shift());) if (!a.length && goog.isDef(b)) c[d] = b;
        else c = c[d] ? c[d] : c[d] = {}
    };
    goog.getObjectByName = function (a, b) {
        for (var c = a.split("."), d = b || goog.global, e; e = c.shift();) if (d[e]) d = d[e];
        else return null;
        return d
    };
    goog.globalize = function (a, b) {
        var c = b || goog.global,
            d;
        for (d in a) c[d] = a[d]
    };
    goog.addDependency = function (a, b, c) {
        if (!COMPILED) {
            var d;
            a = a.replace(/\\/g, "/");
            for (var e = goog.dependencies_, f = 0; d = b[f]; f++) {
                e.nameToPath[d] = a;
                a in e.pathToNames || (e.pathToNames[a] = {});
                e.pathToNames[a][d] = true
            }
            for (d = 0; b = c[d]; d++) {
                a in e.requires || (e.requires[a] = {});
                e.requires[a][b] = true
            }
        }
    };
    goog.require = function (a) {
        if (!COMPILED) if (!goog.getObjectByName(a)) {
            var b = goog.getPathFromDeps_(a);
            if (b) {
                goog.included_[b] = true;
                goog.writeScripts_()
            } else {
                a = "goog.require could not find: " + a;
                goog.global.console && goog.global.console.error(a);
                throw Error(a);
            }
        }
    };
    goog.basePath = "";
    goog.nullFunction = function () {};
    goog.identityFunction = function (a) {
        return a
    };
    goog.abstractMethod = function () {
        throw Error("unimplemented abstract method");
    };
    goog.addSingletonGetter = function (a) {
        a.getInstance = function () {
            return a.instance_ || (a.instance_ = new a)
        }
    };
    if (!COMPILED) {
        goog.included_ = {};
        goog.dependencies_ = {
            pathToNames: {},
            nameToPath: {},
            requires: {},
            visited: {},
            written: {}
        };
        goog.inHtmlDocument_ = function () {
            var a = goog.global.document;
            return typeof a != "undefined" && "write" in a
        };
        goog.findBasePath_ = function () {
            if (goog.inHtmlDocument_()) {
                var a = goog.global.document;
                if (goog.global.CLOSURE_BASE_PATH) goog.basePath = goog.global.CLOSURE_BASE_PATH;
                else {
                    a = a.getElementsByTagName("script");
                    for (var b = a.length - 1; b >= 0; --b) {
                        var c = a[b].src,
                            d = c.length;
                        if (c.substr(d - 7) == "base.js") {
                            goog.basePath = c.substr(0, d - 7);
                            break
                        }
                    }
                }
            }
        };
        goog.writeScriptTag_ = function (a) {
            if (goog.inHtmlDocument_() && !goog.dependencies_.written[a]) {
                goog.dependencies_.written[a] = true;
                goog.global.document.write('<script type="text/javascript" src="' + a + '"><\/script>')
            }
        };
        goog.writeScripts_ = function () {
            function a(f) {
                if (!(f in d.written)) {
                    if (!(f in d.visited)) {
                        d.visited[f] = true;
                        if (f in d.requires) for (var g in d.requires[f]) if (g in d.nameToPath) a(d.nameToPath[g]);
                        else if (!goog.getObjectByName(g)) throw Error("Undefined nameToPath for " + g);
                    }
                    if (!(f in c)) {
                        c[f] = true;
                        b.push(f)
                    }
                }
            }
            var b = [],
                c = {}, d = goog.dependencies_,
                e;
            for (e in goog.included_) d.written[e] || a(e);
            for (e = 0; e < b.length; e++) if (b[e]) goog.writeScriptTag_(goog.basePath + b[e]);
            else throw Error("Undefined script input");
        };
        goog.getPathFromDeps_ = function (a) {
            return a in goog.dependencies_.nameToPath ? goog.dependencies_.nameToPath[a] : null
        };
        goog.findBasePath_();
        goog.global.CLOSURE_NO_DEPS || goog.writeScriptTag_(goog.basePath + "deps.js")
    }
    goog.typeOf = function (a) {
        var b = typeof a;
        if (b == "object") if (a) {
            if (a instanceof Array || !(a instanceof Object) && Object.prototype.toString.call(a) == "[object Array]" || typeof a.length == "number" && typeof a.splice != "undefined" && typeof a.propertyIsEnumerable != "undefined" && !a.propertyIsEnumerable("splice")) return "array";
            if (!(a instanceof Object) && (Object.prototype.toString.call(a) == "[object Function]" || typeof a.call != "undefined" && typeof a.propertyIsEnumerable != "undefined" && !a.propertyIsEnumerable("call"))) return "function"
        } else return "null";
        else if (b == "function" && typeof a.call == "undefined") return "object";
        return b
    };
    goog.propertyIsEnumerableCustom_ = function (a, b) {
        if (b in a) for (var c in a) if (c == b && Object.prototype.hasOwnProperty.call(a, b)) return true;
        return false
    };
    goog.propertyIsEnumerable_ = function (a, b) {
        return a instanceof Object ? Object.prototype.propertyIsEnumerable.call(a, b) : goog.propertyIsEnumerableCustom_(a, b)
    };
    goog.isDef = function (a) {
        return a !== undefined
    };
    goog.isNull = function (a) {
        return a === null
    };
    goog.isDefAndNotNull = function (a) {
        return a != null
    };
    goog.isArray = function (a) {
        return goog.typeOf(a) == "array"
    };
    goog.isArrayLike = function (a) {
        var b = goog.typeOf(a);
        return b == "array" || b == "object" && typeof a.length == "number"
    };
    goog.isDateLike = function (a) {
        return goog.isObject(a) && typeof a.getFullYear == "function"
    };
    goog.isString = function (a) {
        return typeof a == "string"
    };
    goog.isBoolean = function (a) {
        return typeof a == "boolean"
    };
    goog.isNumber = function (a) {
        return typeof a == "number"
    };
    goog.isFunction = function (a) {
        return goog.typeOf(a) == "function"
    };
    goog.isObject = function (a) {
        a = goog.typeOf(a);
        return a == "object" || a == "array" || a == "function"
    };
    goog.getUid = function (a) {
        if (a.hasOwnProperty && a.hasOwnProperty(goog.UID_PROPERTY_)) return a[goog.UID_PROPERTY_];
        a[goog.UID_PROPERTY_] || (a[goog.UID_PROPERTY_] = ++goog.uidCounter_);
        return a[goog.UID_PROPERTY_]
    };
    goog.removeUid = function (a) {
        "removeAttribute" in a && a.removeAttribute(goog.UID_PROPERTY_);
        try {
            delete a[goog.UID_PROPERTY_]
        } catch (b) {}
    };
    goog.UID_PROPERTY_ = "closure_uid_" + Math.floor(Math.random() * 2147483648).toString(36);
    goog.uidCounter_ = 0;
    goog.getHashCode = goog.getUid;
    goog.removeHashCode = goog.removeUid;
    goog.cloneObject = function (a) {
        var b = goog.typeOf(a);
        if (b == "object" || b == "array") {
            if (a.clone) return a.clone();
            b = b == "array" ? [] : {};
            for (var c in a) b[c] = goog.cloneObject(a[c]);
            return b
        }
        return a
    };
    goog.bind = function (a, b) {
        var c = b || goog.global;
        if (arguments.length > 2) {
            var d = Array.prototype.slice.call(arguments, 2);
            return function () {
                var e = Array.prototype.slice.call(arguments);
                Array.prototype.unshift.apply(e, d);
                return a.apply(c, e)
            }
        } else return function () {
            return a.apply(c, arguments)
        }
    };
    goog.partial = function (a) {
        var b = Array.prototype.slice.call(arguments, 1);
        return function () {
            var c = Array.prototype.slice.call(arguments);
            c.unshift.apply(c, b);
            return a.apply(this, c)
        }
    };
    goog.mixin = function (a, b) {
        for (var c in b) a[c] = b[c]
    };
    goog.now = Date.now || function () {
        return +new Date
    };
    goog.globalEval = function (a) {
        if (goog.global.execScript) goog.global.execScript(a, "JavaScript");
        else if (goog.global.eval) {
            if (goog.evalWorksForGlobals_ == null) {
                goog.global.eval("var _et_ = 1;");
                if (typeof goog.global._et_ != "undefined") {
                    delete goog.global._et_;
                    goog.evalWorksForGlobals_ = true
                } else goog.evalWorksForGlobals_ = false
            }
            if (goog.evalWorksForGlobals_) goog.global.eval(a);
            else {
                var b = goog.global.document,
                    c = b.createElement("script");
                c.type = "text/javascript";
                c.defer = false;
                c.appendChild(b.createTextNode(a));
                b.body.appendChild(c);
                b.body.removeChild(c)
            }
        } else throw Error("goog.globalEval not available");
    };
    goog.typedef = true;
    goog.getCssName = function (a, b) {
        var c = a + (b ? "-" + b : "");
        return goog.cssNameMapping_ && c in goog.cssNameMapping_ ? goog.cssNameMapping_[c] : c
    };
    goog.setCssNameMapping = function (a) {
        goog.cssNameMapping_ = a
    };
    goog.getMsg = function (a, b) {
        var c = b || {}, d;
        for (d in c) {
            var e = ("" + c[d]).replace(/\$/g, "$$$$");
            a = a.replace(RegExp("\\{\\$" + d + "\\}", "gi"), e)
        }
        return a
    };
    goog.exportSymbol = function (a, b, c) {
        goog.exportPath_(a, b, c)
    };
    goog.exportProperty = function (a, b, c) {
        a[b] = c
    };
    goog.inherits = function (a, b) {
        function c() {}
        c.prototype = b.prototype;
        a.superClass_ = b.prototype;
        a.prototype = new c;
        a.prototype.constructor = a
    };
    goog.base = function (a, b) {
        var c = arguments.callee.caller;
        if (c.superClass_) return c.superClass_.constructor.apply(a, Array.prototype.slice.call(arguments, 1));
        for (var d = Array.prototype.slice.call(arguments, 2), e = false, f = a.constructor; f; f = f.superClass_ && f.superClass_.constructor) if (f.prototype[b] === c) e = true;
        else if (e) return f.prototype[b].apply(a, d);
        if (a[b] === c) return a.constructor.prototype[b].apply(a, d);
        else throw Error("goog.base called from a method of one name to a method of a different name");
    };
    goog.scope = function (a) {
        a.call(goog.global)
    };
    goog.string = {};
    goog.string.Unicode = {
        NBSP: "\u00a0"
    };
    goog.string.startsWith = function (a, b) {
        return a.lastIndexOf(b, 0) == 0
    };
    goog.string.endsWith = function (a, b) {
        var c = a.length - b.length;
        return c >= 0 && a.indexOf(b, c) == c
    };
    goog.string.caseInsensitiveStartsWith = function (a, b) {
        return goog.string.caseInsensitiveCompare(b, a.substr(0, b.length)) == 0
    };
    goog.string.caseInsensitiveEndsWith = function (a, b) {
        return goog.string.caseInsensitiveCompare(b, a.substr(a.length - b.length, b.length)) == 0
    };
    goog.string.subs = function (a) {
        for (var b = 1; b < arguments.length; b++) {
            var c = String(arguments[b]).replace(/\$/g, "$$$$");
            a = a.replace(/\%s/, c)
        }
        return a
    };
    goog.string.collapseWhitespace = function (a) {
        return a.replace(/[\s\xa0]+/g, " ").replace(/^\s+|\s+$/g, "")
    };
    goog.string.isEmpty = function (a) {
        return /^[\s\xa0]*$/.test(a)
    };
    goog.string.isEmptySafe = function (a) {
        return goog.string.isEmpty(goog.string.makeSafe(a))
    };
    goog.string.isBreakingWhitespace = function (a) {
        return !/[^\t\n\r ]/.test(a)
    };
    goog.string.isAlpha = function (a) {
        return !/[^a-zA-Z]/.test(a)
    };
    goog.string.isNumeric = function (a) {
        return !/[^0-9]/.test(a)
    };
    goog.string.isAlphaNumeric = function (a) {
        return !/[^a-zA-Z0-9]/.test(a)
    };
    goog.string.isSpace = function (a) {
        return a == " "
    };
    goog.string.isUnicodeChar = function (a) {
        return a.length == 1 && a >= " " && a <= "~" || a >= "\u0080" && a <= "\ufffd"
    };
    goog.string.stripNewlines = function (a) {
        return a.replace(/(\r\n|\r|\n)+/g, " ")
    };
    goog.string.canonicalizeNewlines = function (a) {
        return a.replace(/(\r\n|\r|\n)/g, "\n")
    };
    goog.string.normalizeWhitespace = function (a) {
        return a.replace(/\xa0|\s/g, " ")
    };
    goog.string.normalizeSpaces = function (a) {
        return a.replace(/\xa0|[ \t]+/g, " ")
    };
    goog.string.trim = function (a) {
        return a.replace(/^[\s\xa0]+|[\s\xa0]+$/g, "")
    };
    goog.string.trimLeft = function (a) {
        return a.replace(/^[\s\xa0]+/, "")
    };
    goog.string.trimRight = function (a) {
        return a.replace(/[\s\xa0]+$/, "")
    };
    goog.string.caseInsensitiveCompare = function (a, b) {
        var c = String(a).toLowerCase(),
            d = String(b).toLowerCase();
        return c < d ? -1 : c == d ? 0 : 1
    };
    goog.string.numerateCompareRegExp_ = /(\.\d+)|(\d+)|(\D+)/g;
    goog.string.numerateCompare = function (a, b) {
        if (a == b) return 0;
        if (!a) return -1;
        if (!b) return 1;
        for (var c = a.toLowerCase().match(goog.string.numerateCompareRegExp_), d = b.toLowerCase().match(goog.string.numerateCompareRegExp_), e = Math.min(c.length, d.length), f = 0; f < e; f++) {
            var g = c[f],
                h = d[f];
            if (g != h) {
                c = parseInt(g, 10);
                if (!isNaN(c)) {
                    d = parseInt(h, 10);
                    if (!isNaN(d) && c - d) return c - d
                }
                return g < h ? -1 : 1
            }
        }
        if (c.length != d.length) return c.length - d.length;
        return a < b ? -1 : 1
    };
    goog.string.encodeUriRegExp_ = /^[a-zA-Z0-9\-_.!~*'()]*$/;
    goog.string.urlEncode = function (a) {
        a = String(a);
        if (!goog.string.encodeUriRegExp_.test(a)) return encodeURIComponent(a);
        return a
    };
    goog.string.urlDecode = function (a) {
        return decodeURIComponent(a.replace(/\+/g, " "))
    };
    goog.string.newLineToBr = function (a, b) {
        return a.replace(/(\r\n|\r|\n)/g, b ? "<br />" : "<br>")
    };
    goog.string.htmlEscape = function (a, b) {
        if (b) return a.replace(goog.string.amperRe_, "&amp;").replace(goog.string.ltRe_, "&lt;").replace(goog.string.gtRe_, "&gt;").replace(goog.string.quotRe_, "&quot;");
        else {
            if (!goog.string.allRe_.test(a)) return a;
            if (a.indexOf("&") != -1) a = a.replace(goog.string.amperRe_, "&amp;");
            if (a.indexOf("<") != -1) a = a.replace(goog.string.ltRe_, "&lt;");
            if (a.indexOf(">") != -1) a = a.replace(goog.string.gtRe_, "&gt;");
            if (a.indexOf('"') != -1) a = a.replace(goog.string.quotRe_, "&quot;");
            return a
        }
    };
    goog.string.amperRe_ = /&/g;
    goog.string.ltRe_ = /</g;
    goog.string.gtRe_ = />/g;
    goog.string.quotRe_ = /\"/g;
    goog.string.allRe_ = /[&<>\"]/;
    goog.string.unescapeEntities = function (a) {
        if (goog.string.contains(a, "&")) return "document" in goog.global && !goog.string.contains(a, "<") ? goog.string.unescapeEntitiesUsingDom_(a) : goog.string.unescapePureXmlEntities_(a);
        return a
    };
    goog.string.unescapeEntitiesUsingDom_ = function (a) {
        var b = goog.global.document.createElement("a");
        b.innerHTML = a;
        b[goog.string.NORMALIZE_FN_] && b[goog.string.NORMALIZE_FN_]();
        a = b.firstChild.nodeValue;
        b.innerHTML = "";
        return a
    };
    goog.string.unescapePureXmlEntities_ = function (a) {
        return a.replace(/&([^;]+);/g, function (b, c) {
            switch (c) {
            case "amp":
                return "&";
            case "lt":
                return "<";
            case "gt":
                return ">";
            case "quot":
                return '"';
            default:
                if (c.charAt(0) == "#") {
                    var d = Number("0" + c.substr(1));
                    if (!isNaN(d)) return String.fromCharCode(d)
                }
                return b
            }
        })
    };
    goog.string.NORMALIZE_FN_ = "normalize";
    goog.string.whitespaceEscape = function (a, b) {
        return goog.string.newLineToBr(a.replace(/  /g, " &#160;"), b)
    };
    goog.string.stripQuotes = function (a, b) {
        for (var c = b.length, d = 0; d < c; d++) {
            var e = c == 1 ? b : b.charAt(d);
            if (a.charAt(0) == e && a.charAt(a.length - 1) == e) return a.substring(1, a.length - 1)
        }
        return a
    };
    goog.string.truncate = function (a, b, c) {
        if (c) a = goog.string.unescapeEntities(a);
        if (a.length > b) a = a.substring(0, b - 3) + "...";
        if (c) a = goog.string.htmlEscape(a);
        return a
    };
    goog.string.truncateMiddle = function (a, b, c) {
        if (c) a = goog.string.unescapeEntities(a);
        if (a.length > b) {
            var d = Math.floor(b / 2),
                e = a.length - d;
            d += b % 2;
            a = a.substring(0, d) + "..." + a.substring(e)
        }
        if (c) a = goog.string.htmlEscape(a);
        return a
    };
    goog.string.specialEscapeChars_ = {
        "\u0000": "\\0",
        "\u0008": "\\b",
        "\u000c": "\\f",
        "\n": "\\n",
        "\r": "\\r",
        "\t": "\\t",
        "\u000b": "\\x0B",
        '"': '\\"',
        "\\": "\\\\"
    };
    goog.string.jsEscapeCache_ = {
        "'": "\\'"
    };
    goog.string.quote = function (a) {
        a = String(a);
        if (a.quote) return a.quote();
        else {
            for (var b = ['"'], c = 0; c < a.length; c++) {
                var d = a.charAt(c),
                    e = d.charCodeAt(0);
                b[c + 1] = goog.string.specialEscapeChars_[d] || (e > 31 && e < 127 ? d : goog.string.escapeChar(d))
            }
            b.push('"');
            return b.join("")
        }
    };
    goog.string.escapeString = function (a) {
        for (var b = [], c = 0; c < a.length; c++) b[c] = goog.string.escapeChar(a.charAt(c));
        return b.join("")
    };
    goog.string.escapeChar = function (a) {
        if (a in goog.string.jsEscapeCache_) return goog.string.jsEscapeCache_[a];
        if (a in goog.string.specialEscapeChars_) return goog.string.jsEscapeCache_[a] = goog.string.specialEscapeChars_[a];
        var b = a,
            c = a.charCodeAt(0);
        if (c > 31 && c < 127) b = a;
        else {
            if (c < 256) {
                b = "\\x";
                if (c < 16 || c > 256) b += "0"
            } else {
                b = "\\u";
                if (c < 4096) b += "0"
            }
            b += c.toString(16).toUpperCase()
        }
        return goog.string.jsEscapeCache_[a] = b
    };
    goog.string.toMap = function (a) {
        for (var b = {}, c = 0; c < a.length; c++) b[a.charAt(c)] = true;
        return b
    };
    goog.string.contains = function (a, b) {
        return a.indexOf(b) != -1
    };
    goog.string.removeAt = function (a, b, c) {
        var d = a;
        if (b >= 0 && b < a.length && c > 0) d = a.substr(0, b) + a.substr(b + c, a.length - b - c);
        return d
    };
    goog.string.remove = function (a, b) {
        var c = RegExp(goog.string.regExpEscape(b), "");
        return a.replace(c, "")
    };
    goog.string.removeAll = function (a, b) {
        var c = RegExp(goog.string.regExpEscape(b), "g");
        return a.replace(c, "")
    };
    goog.string.regExpEscape = function (a) {
        return String(a).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08")
    };
    goog.string.repeat = function (a, b) {
        return Array(b + 1).join(a)
    };
    goog.string.padNumber = function (a, b, c) {
        a = goog.isDef(c) ? a.toFixed(c) : String(a);
        c = a.indexOf(".");
        if (c == -1) c = a.length;
        return goog.string.repeat("0", Math.max(0, b - c)) + a
    };
    goog.string.makeSafe = function (a) {
        return a == null ? "" : String(a)
    };
    goog.string.buildString = function () {
        return Array.prototype.join.call(arguments, "")
    };
    goog.string.getRandomString = function () {
        return Math.floor(Math.random() * 2147483648).toString(36) + (Math.floor(Math.random() * 2147483648) ^ goog.now()).toString(36)
    };
    goog.string.compareVersions = function (a, b) {
        for (var c = 0, d = goog.string.trim(String(a)).split("."), e = goog.string.trim(String(b)).split("."), f = Math.max(d.length, e.length), g = 0; c == 0 && g < f; g++) {
            var h = d[g] || "",
                i = e[g] || "",
                j = RegExp("(\\d*)(\\D*)", "g"),
                k = RegExp("(\\d*)(\\D*)", "g");
            do {
                var l = j.exec(h) || ["", "", ""],
                    m = k.exec(i) || ["", "", ""];
                if (l[0].length == 0 && m[0].length == 0) break;
                c = l[1].length == 0 ? 0 : parseInt(l[1], 10);
                var o = m[1].length == 0 ? 0 : parseInt(m[1], 10);
                c = goog.string.compareElements_(c, o) || goog.string.compareElements_(l[2].length == 0, m[2].length == 0) || goog.string.compareElements_(l[2], m[2])
            } while (c == 0)
        }
        return c
    };
    goog.string.compareElements_ = function (a, b) {
        if (a < b) return -1;
        else if (a > b) return 1;
        return 0
    };
    goog.string.HASHCODE_MAX_ = 4294967296;
    goog.string.hashCode = function (a) {
        for (var b = 0, c = 0; c < a.length; ++c) {
            b = 31 * b + a.charCodeAt(c);
            b %= goog.string.HASHCODE_MAX_
        }
        return b
    };
    goog.string.uniqueStringCounter_ = Math.random() * 2147483648 | 0;
    goog.string.createUniqueString = function () {
        return "goog_" + goog.string.uniqueStringCounter_++
    };
    goog.string.toNumber = function (a) {
        var b = Number(a);
        if (b == 0 && goog.string.isEmpty(a)) return NaN;
        return b
    };
    goog.debug = {};
    goog.debug.Error = function (a) {
        this.stack = Error().stack || "";
        if (a) this.message = String(a)
    };
    goog.inherits(goog.debug.Error, Error);
    goog.debug.Error.prototype.name = "CustomError";
    goog.asserts = {};
    goog.asserts.ENABLE_ASSERTS = goog.DEBUG;
    goog.asserts.AssertionError = function (a, b) {
        b.unshift(a);
        goog.debug.Error.call(this, goog.string.subs.apply(null, b));
        b.shift();
        this.messagePattern = a
    };
    goog.inherits(goog.asserts.AssertionError, goog.debug.Error);
    goog.asserts.AssertionError.prototype.name = "AssertionError";
    goog.asserts.doAssertFailure_ = function (a, b, c, d) {
        var e = "Assertion failed";
        if (c) {
            e += ": " + c;
            var f = d
        } else if (a) {
            e += ": " + a;
            f = b
        }
        throw new goog.asserts.AssertionError("" + e, f || []);
    };
    goog.asserts.assert = function (a, b) {
        goog.asserts.ENABLE_ASSERTS && !a && goog.asserts.doAssertFailure_("", null, b, Array.prototype.slice.call(arguments, 2))
    };
    goog.asserts.fail = function (a) {
        if (goog.asserts.ENABLE_ASSERTS) throw new goog.asserts.AssertionError("Failure" + (a ? ": " + a : ""), Array.prototype.slice.call(arguments, 1));
    };
    goog.asserts.assertNumber = function (a, b) {
        goog.asserts.ENABLE_ASSERTS && !goog.isNumber(a) && goog.asserts.doAssertFailure_("Expected number but got %s.", [a], b, Array.prototype.slice.call(arguments, 2));
        return a
    };
    goog.asserts.assertString = function (a, b) {
        goog.asserts.ENABLE_ASSERTS && !goog.isString(a) && goog.asserts.doAssertFailure_("Expected string but got %s.", [a], b, Array.prototype.slice.call(arguments, 2));
        return a
    };
    goog.asserts.assertFunction = function (a, b) {
        goog.asserts.ENABLE_ASSERTS && !goog.isFunction(a) && goog.asserts.doAssertFailure_("Expected function but got %s.", [a], b, Array.prototype.slice.call(arguments, 2));
        return a
    };
    goog.asserts.assertObject = function (a, b) {
        goog.asserts.ENABLE_ASSERTS && !goog.isObject(a) && goog.asserts.doAssertFailure_("Expected object but got %s.", [a], b, Array.prototype.slice.call(arguments, 2));
        return a
    };
    goog.asserts.assertArray = function (a, b) {
        goog.asserts.ENABLE_ASSERTS && !goog.isArray(a) && goog.asserts.doAssertFailure_("Expected array but got %s.", [a], b, Array.prototype.slice.call(arguments, 2));
        return a
    };
    goog.asserts.assertInstanceof = function (a, b, c) {
        goog.asserts.ENABLE_ASSERTS && !(a instanceof b) && goog.asserts.doAssertFailure_("instanceof check failed.", null, c, Array.prototype.slice.call(arguments, 3))
    };
    var Sk = Sk || {};
    Sk.configure = function (a) {
        Sk.output = a.output || Sk.output;
        goog.asserts.assert(typeof Sk.output === "function");
        Sk.debugout = a.debugout || Sk.debugout;
        goog.asserts.assert(typeof Sk.debugout === "function");
        Sk.read = a.read || Sk.read;
        goog.asserts.assert(typeof Sk.read === "function");
        Sk.sysargv = a.sysargv || Sk.sysargv;
        goog.asserts.assert(goog.isArrayLike(Sk.sysargv));
        if (a.syspath) {
            Sk.syspath = a.syspath;
            goog.asserts.assert(goog.isArrayLike(Sk.syspath));
            Sk.realsyspath = undefined;
            Sk.sysmodules = new Sk.builtin.dict([])
        }
        Sk.misceval.softspace_ = false
    };
    goog.exportSymbol("Sk.configure", Sk.configure);
    Sk.output = function () {};
    Sk.read = function () {
        throw "Sk.read has not been implemented";
    };
    Sk.sysargv = [];
    Sk.getSysArgv = function () {
        return Sk.sysargv
    };
    goog.exportSymbol("Sk.getSysArgv", Sk.getSysArgv);
    Sk.syspath = [];
    Sk.inBrowser = goog.global.document !== undefined;
    Sk.debugout = function () {};
    (function () {
        if (goog.global.write !== undefined) Sk.output = goog.global.write;
        else if (goog.global.console !== undefined && goog.global.console.log !== undefined) Sk.output = function (a) {
            goog.global.console.log(a)
        };
        else if (goog.global.print !== undefined) Sk.output = goog.global.print;
        if (goog.global.print !== undefined) Sk.debugout = goog.global.print
    })();
    if (!Sk.inBrowser) goog.writeScriptTag_ = function (a) {
        if (!goog.dependencies_.written[a]) {
            goog.dependencies_.written[a] = true;
            goog.global.eval(goog.global.read("support/closure-library/closure/goog/" + a))
        }
    };
    Sk.builtin = {};
    Sk.builtin.range = function (a, b, c) {
        var d = [];
        (new Sk.builtin.slice(a, b, c)).sssiter$(0, function (e) {
            d.push(e)
        });
        return new Sk.builtin.list(d)
    };
    Sk.builtin.len = function (a) {
        if (a.sq$length) return a.sq$length();
        if (a.mp$length) return a.mp$length();
        throw new Sk.builtin.TypeError("object of type '" + a.tp$name + "' has no len()");
    };
    Sk.builtin.min = function () {
        arguments = Sk.misceval.arrayFromArguments(arguments);
        for (var a = arguments[0], b = 1; b < arguments.length; ++b) if (Sk.misceval.richCompareBool(arguments[b], a, "Lt")) a = arguments[b];
        return a
    };
    Sk.builtin.max = function () {
        arguments = Sk.misceval.arrayFromArguments(arguments);
        for (var a = arguments[0], b = 1; b < arguments.length; ++b) if (Sk.misceval.richCompareBool(arguments[b], a, "Gt")) a = arguments[b];
        return a
    };
    Sk.builtin.sum = function (a, b) {
        var c = 0;
        if (a instanceof Sk.builtin.list) a = a.v;
        else throw "TypeError: an iterable is required";
        if (b === undefined) b = 0;
        for (var d = b; d < a.length; ++d) {
            if (typeof a[d] !== "number") throw "TypeError: an number is required";
            c += a[d]
        }
        return c
    };
    Sk.builtin.abs = function (a) {
        return Math.abs(a)
    };
    Sk.builtin.ord = function (a) {
        if (a.constructor !== Sk.builtin.str || a.v.length !== 1) throw "ord() expected string of length 1";
        return a.v.charCodeAt(0)
    };
    Sk.builtin.chr = function (a) {
        if (typeof a !== "number") throw "TypeError: an integer is required";
        return new Sk.builtin.str(String.fromCharCode(a))
    };
    Sk.builtin.dir = function (a) {
        var b = [],
            c;
        for (c in a.constructor.prototype) {
            var d;
            if (c.indexOf("$") !== -1) d = Sk.builtin.dir.slotNameToRichName(c);
            else if (c.charAt(c.length - 1) !== "_") d = c;
            d && b.push(new Sk.builtin.str(d))
        }
        b.sort(function (e, f) {
            return (e.v > f.v) - (e.v < f.v)
        });
        return new Sk.builtin.list(b)
    };
    Sk.builtin.dir.slotNameToRichName = function () {};
    Sk.builtin.repr = function (a) {
        return Sk.misceval.objectRepr(a)
    };
    Sk.builtin.open = function (a, b, c) {
        if (b === undefined) b = "r";
        if (b.v !== "r" && b.v !== "rb") throw "todo; haven't implemented non-read opens";
        return new Sk.builtin.file(a, b, c)
    };
    Sk.builtin.isinstance = function (a, b) {
        if (a.ob$type === b) return true;
        if (b instanceof Sk.builtin.tuple) {
            for (var c = 0; c < b.v.length; ++c) if (Sk.builtin.isinstance(a, b.v[c])) return true;
            return false
        }
        var d = function (e, f) {
            if (e === f) return true;
            if (e.$d === undefined) return false;
            for (var g = e.$d.mp$subscript(Sk.builtin.type.basesStr_), h = 0; h < g.v.length; ++h) if (d(g.v[h], f)) return true;
            return false
        };
        return d(a.ob$type, b)
    };
    Sk.builtin.hashCount = 0;
    Sk.builtin.hash = function (a) {
        if (a instanceof Object && a.tp$hash !== undefined) {
            if (a.$savedHash_) return a.$savedHash_;
            a.$savedHash_ = "custom " + a.tp$hash();
            return a.$savedHash_
        }
        if (a instanceof Object) {
            if (a.__id === undefined) {
                Sk.builtin.hashCount += 1;
                a.__id = "object " + Sk.builtin.hashCount
            }
            return a.__id
        }
        return typeof a + " " + String(a)
    };
    Sk.builtin.getattr = function (a, b, c) {
        a = a.tp$getattr(b.v);
        if (a === undefined) if (c !== undefined) return c;
        else throw new Sk.builtin.AttributeError;
        return a
    };
    Sk.builtin.input = function (a) {
        a = prompt(a.v);
        return new Sk.builtin.str(a)
    };
    Sk.builtin.Exception = function (a) {
        a = Array.prototype.slice.call(arguments);
        for (var b = 0; b < a.length; ++b) if (typeof a[b] === "string") a[b] = new Sk.builtin.str(a[b]);
        this.args = new Sk.builtin.tuple(a)
    };
    Sk.builtin.Exception.prototype.tp$name = "Exception";
    Sk.builtin.Exception.prototype.tp$str = function () {
        var a = "";
        if (this.args.v.length > 1) {
            a = 'File "' + this.args.v[1].v + '", line ' + this.args.v[2] + "\n" + this.args.v[4].v + "\n";
            for (var b = 0; b < this.args.v[3]; ++b) a += " ";
            a += "^\n"
        }
        a += this.tp$name;
        if (this.args) a += ": " + this.args.v[0].v;
        return new Sk.builtin.str(a)
    };
    Sk.builtin.Exception.prototype.toString = function () {
        return this.tp$str().v
    };
    Sk.builtin.AssertionError = function () {
        Sk.builtin.Exception.apply(this, arguments)
    };
    goog.inherits(Sk.builtin.AssertionError, Sk.builtin.Exception);
    Sk.builtin.AssertionError.prototype.tp$name = "AssertionError";
    goog.exportSymbol("Sk.builtin.AssertionError", Sk.builtin.AssertionError);
    Sk.builtin.AttributeError = function () {
        Sk.builtin.Exception.apply(this, arguments)
    };
    goog.inherits(Sk.builtin.AttributeError, Sk.builtin.Exception);
    Sk.builtin.AttributeError.prototype.tp$name = "AttributeError";
    Sk.builtin.ImportError = function () {
        Sk.builtin.Exception.apply(this, arguments)
    };
    goog.inherits(Sk.builtin.ImportError, Sk.builtin.Exception);
    Sk.builtin.ImportError.prototype.tp$name = "ImportError";
    Sk.builtin.IndentationError = function () {
        Sk.builtin.Exception.apply(this, arguments)
    };
    goog.inherits(Sk.builtin.IndentationError, Sk.builtin.Exception);
    Sk.builtin.IndentationError.prototype.tp$name = "IndentationError";
    Sk.builtin.IndexError = function () {
        Sk.builtin.Exception.apply(this, arguments)
    };
    goog.inherits(Sk.builtin.IndexError, Sk.builtin.Exception);
    Sk.builtin.IndexError.prototype.tp$name = "IndexError";
    Sk.builtin.KeyError = function () {
        Sk.builtin.Exception.apply(this, arguments)
    };
    goog.inherits(Sk.builtin.KeyError, Sk.builtin.Exception);
    Sk.builtin.KeyError.prototype.tp$name = "KeyError";
    Sk.builtin.NameError = function () {
        Sk.builtin.Exception.apply(this, arguments)
    };
    goog.inherits(Sk.builtin.NameError, Sk.builtin.Exception);
    Sk.builtin.NameError.prototype.tp$name = "NameError";
    Sk.builtin.ParseError = function () {
        Sk.builtin.Exception.apply(this, arguments)
    };
    goog.inherits(Sk.builtin.ParseError, Sk.builtin.Exception);
    Sk.builtin.ParseError.prototype.tp$name = "ParseError";
    Sk.builtin.SyntaxError = function () {
        Sk.builtin.Exception.apply(this, arguments)
    };
    goog.inherits(Sk.builtin.SyntaxError, Sk.builtin.Exception);
    Sk.builtin.SyntaxError.prototype.tp$name = "SyntaxError";
    Sk.builtin.TokenError = function () {
        Sk.builtin.Exception.apply(this, arguments)
    };
    goog.inherits(Sk.builtin.TokenError, Sk.builtin.Exception);
    Sk.builtin.TokenError.prototype.tp$name = "TokenError";
    Sk.builtin.TypeError = function () {
        Sk.builtin.Exception.apply(this, arguments)
    };
    goog.inherits(Sk.builtin.TypeError, Sk.builtin.Exception);
    Sk.builtin.TypeError.prototype.tp$name = "TypeError";
    goog.exportSymbol("Sk.builtin.TypeError", Sk.builtin.TypeError);
    Sk.builtin.ValueError = function () {
        Sk.builtin.Exception.apply(this, arguments)
    };
    goog.inherits(Sk.builtin.ValueError, Sk.builtin.Exception);
    Sk.builtin.ValueError.prototype.tp$name = "ValueError";
    Sk.builtin.ZeroDivisionError = function () {
        Sk.builtin.Exception.apply(this, arguments)
    };
    goog.inherits(Sk.builtin.ZeroDivisionError, Sk.builtin.Exception);
    Sk.builtin.ZeroDivisionError.prototype.tp$name = "ZeroDivisionError";
    Sk.builtin.type = function (a, b, c) {
        if (b === undefined && c === undefined) {
            if (a === true || a === false) return Sk.builtin.BoolObj.prototype.ob$type;
            if (a === null) return Sk.builtin.NoneObj.prototype.ob$type;
            if (typeof a === "number") return Math.floor(a) === a ? Sk.builtin.IntObj.prototype.ob$type : Sk.builtin.FloatObj.prototype.ob$type;
            return a.ob$type
        } else {
            var d = function (f) {
                if (!(this instanceof d)) return new d(Array.prototype.slice.call(arguments, 0));
                f = f || [];
                goog.asserts.assert(Sk.builtin.dict !== undefined);
                this.$d = new Sk.builtin.dict([]);
                var g = Sk.builtin.type.typeLookup(this.ob$type, "__init__");
                if (g !== undefined) {
                    f.unshift(this);
                    Sk.misceval.apply(g, undefined, undefined, undefined, f)
                }
                return this
            }, e;
            for (e in c) {
                d.prototype[e] = c[e];
                d[e] = c[e]
            }
            d.__class__ = d;
            d.prototype.tp$getattr = Sk.builtin.object.prototype.GenericGetAttr;
            d.prototype.tp$setattr = Sk.builtin.object.prototype.GenericSetAttr;
            d.prototype.tp$descr_get = function () {
                goog.asserts.fail("in type tp$descr_get")
            };
            d.prototype.$r = function () {
                var f = this.tp$getattr("__repr__");
                if (f !== undefined) return Sk.misceval.apply(f,
                undefined, undefined, undefined, []);
                f = c.__module__;
                var g = "";
                if (f) g = f.v + ".";
                return new Sk.builtin.str("<" + g + a + " object>")
            };
            d.prototype.tp$call = function (f, g) {
                var h = this.tp$getattr("__call__");
                if (h) return Sk.misceval.apply(h, undefined, undefined, g, f);
                throw new Sk.builtin.TypeError("'" + this.tp$name + "' object is not callable");
            };
            d.prototype.tp$iter = function () {
                var f = this.tp$getattr("__iter__");
                if (f) {
                    f = Sk.misceval.callsim(f);
                    if (f.tp$getattr("next") === undefined) throw new Sk.builtin.TypeError("iter() return non-iterator of type '" + this.tp$name + "'");
                    return f
                }
                throw new Sk.builtin.TypeError("'" + this.tp$name + "' object is not iterable");
            };
            d.prototype.tp$iternext = function () {
                var f = this.tp$getattr("next");
                goog.asserts.assert(f !== undefined, "iter() should have caught this");
                return Sk.misceval.callsim(f)
            };
            d.tp$name = a;
            if (b) {
                d.$d = new Sk.builtin.dict([]);
                d.$d.mp$ass_subscript(Sk.builtin.type.basesStr_, new Sk.builtin.tuple(b));
                b = Sk.builtin.type.buildMRO(d);
                d.$d.mp$ass_subscript(Sk.builtin.type.mroStr_, b);
                d.tp$mro = b
            }
            d.tp$getattr = Sk.builtin.type.prototype.tp$getattr;
            d.ob$type = Sk.builtin.type;
            d.prototype.ob$type = d;
            Sk.builtin.type.makeIntoTypeObj(a, d);
            return d
        }
    };
    Sk.builtin.type.makeTypeObj = function (a, b) {
        Sk.builtin.type.makeIntoTypeObj(a, b);
        return b
    };
    Sk.builtin.type.makeIntoTypeObj = function (a, b) {
        goog.asserts.assert(a !== undefined);
        goog.asserts.assert(b !== undefined);
        b.ob$type = Sk.builtin.type;
        b.tp$name = a;
        b.$r = function () {
            var c = b.__module__,
                d = "";
            if (c) d = c.v + ".";
            return new Sk.builtin.str("<class '" + d + b.tp$name + "'>")
        };
        b.tp$str = undefined;
        b.tp$getattr = Sk.builtin.type.prototype.tp$getattr;
        b.tp$setattr = Sk.builtin.object.prototype.GenericSetAttr;
        return b
    };
    Sk.builtin.type.ob$type = Sk.builtin.type;
    Sk.builtin.type.tp$name = "type";
    Sk.builtin.type.$r = function () {
        return new Sk.builtin.str("<type 'type'>")
    };
    Sk.builtin.type.prototype.tp$getattr = function (a) {
        var b = Sk.builtin.type.typeLookup(this, a),
            c;
        if (b !== undefined && b.ob$type !== undefined) c = b.ob$type.tp$descr_get;
        if (this.$d) {
            a = this.$d.mp$subscript(new Sk.builtin.str(a));
            if (a !== undefined) return a
        }
        if (c) return c.call(b, null, this);
        if (b) return b
    };
    Sk.builtin.type.typeLookup = function (a, b) {
        var c = a.tp$mro;
        if (!c) return a.prototype[b];
        for (var d = 0; d < c.v.length; ++d) {
            var e = c.v[d];
            if (e.hasOwnProperty(b)) return e[b];
            e = e.$d.mp$subscript(new Sk.builtin.str(b));
            if (e !== undefined) return e
        }
    };
    Sk.builtin.type.mroMerge_ = function (a) {
        for (var b = [];;) {
            for (var c = 0; c < a.length; ++c) {
                var d = a[c];
                if (d.length !== 0) break
            }
            if (c === a.length) return b;
            var e = [];
            for (c = 0; c < a.length; ++c) {
                d = a[c];
                if (d.length !== 0) {
                    d = d[0];
                    var f = 0;
                    a: for (; f < a.length; ++f) for (var g = a[f], h = 1; h < g.length; ++h) if (g[h] === d) break a;
                    f === a.length && e.push(d)
                }
            }
            if (e.length === 0) throw new TypeError("Inconsistent precedences in type hierarchy");
            e = e[0];
            b.push(e);
            for (c = 0; c < a.length; ++c) {
                d = a[c];
                d.length > 0 && d[0] === e && d.splice(0, 1)
            }
        }
    };
    Sk.builtin.type.buildMRO_ = function (a) {
        var b = [
            [a]
        ];
        a = a.$d.mp$subscript(Sk.builtin.type.basesStr_);
        for (var c = 0; c < a.v.length; ++c) b.push(Sk.builtin.type.buildMRO_(a.v[c]));
        var d = [];
        for (c = 0; c < a.v.length; ++c) d.push(a.v[c]);
        b.push(d);
        return Sk.builtin.type.mroMerge_(b)
    };
    Sk.builtin.type.buildMRO = function (a) {
        return new Sk.builtin.tuple(Sk.builtin.type.buildMRO_(a))
    };
    Sk.builtin.object = function () {
        if (!(this instanceof Sk.builtin.object)) return new Sk.builtin.object;
        this.$d = new Sk.builtin.dict([]);
        return this
    };
    Sk.builtin.object.prototype.GenericGetAttr = function (a) {
        goog.asserts.assert(typeof a === "string");
        var b = this.ob$type;
        goog.asserts.assert(b !== undefined, "object has no ob$type!");
        b = Sk.builtin.type.typeLookup(b, a);
        var c;
        if (b !== undefined && b.ob$type !== undefined) c = b.ob$type.tp$descr_get;
        if (this.$d) {
            var d;
            if (this.$d.mp$subscript) d = this.$d.mp$subscript(new Sk.builtin.str(a));
            else if (typeof this.$d === "object") d = this.$d[a];
            if (d !== undefined) return d
        }
        if (c) return c.call(b, this, this.ob$type);
        if (b) return b
    };
    goog.exportSymbol("Sk.builtin.object.prototype.GenericGetAttr", Sk.builtin.object.prototype.GenericGetAttr);
    Sk.builtin.object.prototype.GenericSetAttr = function (a, b) {
        goog.asserts.assert(typeof a === "string");
        if (this.$d.mp$ass_subscript) this.$d.mp$ass_subscript(new Sk.builtin.str(a), b);
        else if (typeof this.$d === "object") this.$d[a] = b
    };
    goog.exportSymbol("Sk.builtin.object.prototype.GenericSetAttr", Sk.builtin.object.prototype.GenericSetAttr);
    Sk.builtin.object.prototype.HashNotImplemented = function () {
        throw new Sk.builtin.TypeError("unhashable type: '" + this.tp$name + "'");
    };
    Sk.builtin.object.prototype.tp$getattr = Sk.builtin.object.prototype.GenericGetAttr;
    Sk.builtin.object.prototype.tp$setattr = Sk.builtin.object.prototype.GenericSetAttr;
    Sk.builtin.type.makeIntoTypeObj("object", Sk.builtin.object);
    Sk.builtin.BoolObj = function () {};
    Sk.builtin.BoolObj.prototype.ob$type = Sk.builtin.type.makeTypeObj("Bool", new Sk.builtin.BoolObj);
    Sk.builtin.IntObj = function () {};
    Sk.builtin.IntObj.prototype.ob$type = Sk.builtin.type.makeTypeObj("int", new Sk.builtin.IntObj);
    Sk.builtin.FloatObj = function () {};
    Sk.builtin.FloatObj.prototype.ob$type = Sk.builtin.type.makeTypeObj("float", new Sk.builtin.FloatObj);
    Sk.builtin.NoneObj = function () {};
    Sk.builtin.NoneObj.prototype.ob$type = Sk.builtin.type.makeTypeObj("None", new Sk.builtin.NoneObj);
    Sk.builtin.func = function (a, b, c, d) {
        this.func_code = a;
        this.func_globals = b || null;
        if (d !== undefined) for (var e in d) c[e] = d[e];
        this.func_closure = c;
        return this
    };
    goog.exportSymbol("Sk.builtin.func", Sk.builtin.func);
    Sk.builtin.func.prototype.tp$name = "function";
    Sk.builtin.func.prototype.tp$descr_get = function (a, b) {
        goog.asserts.assert(a !== undefined && b !== undefined);
        if (a == null) return this;
        return new Sk.builtin.method(this, a)
    };
    Sk.builtin.func.prototype.tp$call = function (a, b) {
        this.func_closure && a.push(this.func_closure);
        var c = this.func_code.co_kwargs,
            d = [];
        if (b) for (var e = b.length, f = this.func_code.co_varnames, g = f && f.length, h = 0; h < e; h += 2) {
            for (var i = 0; i < g; ++i) if (b[h] === f[i]) break;
            if (f && i !== g) a[i] = b[h + 1];
            else if (this.func_code.co_kwargs) {
                d.push(new Sk.builtin.str(b[h]));
                d.push(b[h + 1])
            }
        }
        c && a.unshift(d);
        return this.func_code.apply(this.func_globals, a)
    };
    Sk.builtin.func.prototype.ob$type = Sk.builtin.type.makeTypeObj("function", new Sk.builtin.func(null, null));
    Sk.builtin.func.prototype.$r = function () {
        return new Sk.builtin.str("<function " + (this.func_code && this.func_code.co_name && this.func_code.co_name.v || "<native JS>") + ">")
    };
    Sk.builtin.method = function (a, b) {
        this.im_func = a;
        this.im_self = b
    };
    goog.exportSymbol("Sk.builtin.method", Sk.builtin.method);
    Sk.builtin.method.prototype.tp$call = function (a, b)  {
        goog.asserts.assert(this.im_self, "should just be a function, not a method since there's no self?");
        goog.asserts.assert(this.im_func instanceof Sk.builtin.func);
        a.unshift(this.im_self);
        if (b) for (var c = b.length, d = 0; d < c; d += 2) {
            for (var e = this.im_func.func_code.co_varnames, f = e.length, g = 0; g < f; ++g) if (b[d] === e[g]) break;
            a[g] = b[d + 1]
        }
        return this.im_func.func_code.apply(this.im_func.func_globals, a)
    };
    Sk.builtin.method.prototype.$r = function () {
        return new Sk.builtin.str("<bound method " + this.im_self.ob$type.tp$name + "." + this.im_func.func_code.co_name.v + " of " + this.im_self.$r().v + ">")
    };
    Sk.misceval = {};
    Sk.misceval.isIndex = function (a) {
        return a === null || typeof a === "number" || a.constructor === Sk.builtin.lng || a.tp$index
    };
    goog.exportSymbol("Sk.misceval.isIndex", Sk.misceval.isIndex);
    Sk.misceval.asIndex = function (a) {
        if (Sk.misceval.isIndex(a)) if (a !== null) {
            if (typeof a === "number") return a;
            goog.asserts.fail("todo;")
        }
    };
    Sk.misceval.applySlice = function (a, b, c) {
        if (a.sq$slice && Sk.misceval.isIndex(b) && Sk.misceval.isIndex(c)) {
            b = Sk.misceval.asIndex(b);
            if (b === undefined) b = 0;
            c = Sk.misceval.asIndex(c);
            if (c === undefined) c = 1.0E100;
            return Sk.abstr.sequenceGetSlice(a, b, c)
        }
        return Sk.abstr.objectGetItem(a, new Sk.builtin.slice(b, c, null))
    };
    goog.exportSymbol("Sk.misceval.applySlice", Sk.misceval.applySlice);
    Sk.misceval.assignSlice = function (a, b, c, d) {
        if (a.sq$ass_slice && Sk.misceval.isIndex(b) && Sk.misceval.isIndex(c)) {
            b = Sk.misceval.asIndex(b) || 0;
            c = Sk.misceval.asIndex(c) || 1.0E100;
            d === null ? Sk.abstr.sequenceDelSlice(a, b, c) : Sk.abstr.sequenceSetSlice(a, b, c, d)
        } else {
            c = new Sk.builtin.slice(b, c);
            return d === null ? Sk.abstr.objectDelItem(a, c) : Sk.abstr.objectSetItem(a, c, d)
        }
    };
    goog.exportSymbol("Sk.misceval.assignSlice", Sk.misceval.assignSlice);
    Sk.misceval.arrayFromArguments = function (a) {
        if (a.length != 1) return a;
        var b = a[0];
        if (b instanceof Sk.builtin.set) b = b.tp$iter().$obj;
        else if (b instanceof Sk.builtin.dict) b = Sk.builtin.dict.prototype.keys.func_code(b);
        if (b instanceof Sk.builtin.list || b instanceof Sk.builtin.tuple) return b.v;
        return a
    };
    goog.exportSymbol("Sk.misceval.arrayFromArguments", Sk.misceval.arrayFromArguments);
    Sk.misceval.swappedOp_ = {
        Eq: "NotEq",
        NotEq: "Eq",
        Lt: "Gt",
        LtE: "GtE",
        Gt: "Lt",
        GtE: "LtE",
        Is: "IsNot",
        IsNot: "Is",
        In_: "NotIn",
        NotIn: "In_"
    };
    Sk.misceval.richCompareBool = function (a, b, c) {
        if (c === "Is") return a === b;
        if (c === "IsNot") return a !== b;
        if (a === b) if (c === "Eq") return true;
        else if (c === "NotEq") return false;
        if (a instanceof Sk.builtin.str && b instanceof Sk.builtin.str) if (c === "Eq") return a === b;
        else if (c === "NotEq") return a !== b;
        if ((typeof a === "number" || typeof a === "boolean") && (typeof b === "number" || typeof b === "boolean")) switch (c) {
        case "Lt":
            return a < b;
        case "LtE":
            return a <= b;
        case "Gt":
            return a > b;
        case "GtE":
            return a >= b;
        case "NotEq":
            return a != b;
        case "Eq":
            return a == b;
        default:
            throw "assert";
        } else {
            if (c === "In") return Sk.abstr.sequenceContains(b, a);
            if (c === "NotIn") return !Sk.abstr.sequenceContains(b, a);
            if (typeof a !== typeof b) return false;
            var d;
            if (a && a.tp$richcompare && (d = a.tp$richcompare(b, c)) !== undefined) return d;
            else if (b && b.tp$richcompare && (d = a.tp$richcompare(a, Sk.misceval.swappedOp_[c])) !== undefined) return d;
            else {
                if (c === "Eq") if (a && a.__eq__) return Sk.misceval.callsim(a.__eq__, a, b);
                else if (b && b.__ne__) return Sk.misceval.callsim(b.__ne__, b, a);
                else if (c === "NotEq") if (a && a.__ne__) return Sk.misceval.callsim(a.__ne__, a, b);
                else if (b && b.__eq__) return Sk.misceval.callsim(b.__eq__, b, a);
                else if (c === "Gt") if (a && a.__gt__) return Sk.misceval.callsim(a.__gt__, a, b);
                else if (b && b.__lt__) return Sk.misceval.callsim(b.__lt__, b, a);
                else if (c === "Lt") if (a && a.__lt__) return Sk.misceval.callsim(a.__lt__, a, b);
                else if (b && b.__gt__) return Sk.misceval.callsim(b.__gt__, b, a);
                else if (c === "GtE") if (a && a.__ge__) return Sk.misceval.callsim(a.__ge__, a, b);
                else if (b && b.__le__) return Sk.misceval.callsim(b.__le__,
                b, a);
                else if (c === "LtE") if (a && a.__le__) return Sk.misceval.callsim(a.__le__, a, b);
                else if (b && b.__ge__) return Sk.misceval.callsim(b.__ge__, b, a);
                if (a && a.__cmp__) {
                    d = Sk.misceval.callsim(a.__cmp__, a, b);
                    if (c === "Eq") return d === 0;
                    else if (c === "NotEq") return d !== 0;
                    else if (c === "Lt") return d < 0;
                    else if (c === "Gt") return d > 0;
                    else if (c === "LtE") return d <= 0;
                    else if (c === "GtE") return d >= 0
                } else if (b && b.__cmp__) {
                    d = Sk.misceval.callsim(b.__cmp__, b, a);
                    if (c === "Eq") return d === 0;
                    else if (c === "NotEq") return d !== 0;
                    else if (c === "Lt") return d > 0;
                    else if (c === "Gt") return d < 0;
                    else if (c === "LtE") return d >= 0;
                    else if (c === "GtE") return d <= 0
                }
            }
        }
        if (c === "Eq") return a === b;
        if (c === "NotEq") return a !== b;
        throw new Sk.builtin.ValueError("don't know how to compare '" + a.tp$name + "' and '" + b.tp$name + "'");
    };
    goog.exportSymbol("Sk.misceval.richCompareBool", Sk.misceval.richCompareBool);
    Sk.misceval.objectRepr = function (a) {
        goog.asserts.assert(a !== undefined, "trying to repr undefined");
        return a === null ? new Sk.builtin.str("None") : a === true ? new Sk.builtin.str("True") : a === false ? new Sk.builtin.str("False") : typeof a === "number" ? new Sk.builtin.str("" + a) : a.$r ? a.$r() : new Sk.builtin.str("<" + a.tp$name + " object>")
    };
    goog.exportSymbol("Sk.misceval.objectRepr", Sk.misceval.objectRepr);
    Sk.misceval.opAllowsEquality = function (a) {
        switch (a) {
        case "LtE":
        case "Eq":
        case "GtE":
            return true
        }
        return false
    };
    goog.exportSymbol("Sk.misceval.opAllowsEquality", Sk.misceval.opAllowsEquality);
    Sk.misceval.isTrue = function (a) {
        if (a === true) return true;
        if (a === false) return false;
        if (a === null) return false;
        if (typeof a === "number") return a !== 0;
        if (a.mp$length) return a.mp$length() !== 0;
        if (a.sq$length) return a.sq$length() !== 0;
        return true
    };
    goog.exportSymbol("Sk.misceval.isTrue", Sk.misceval.isTrue);
    Sk.misceval.softspace_ = false;
    Sk.misceval.print_ = function (a) {
        if (Sk.misceval.softspace_) {
            a !== "\n" && Sk.output(" ");
            Sk.misceval.softspace_ = false
        }
        a = new Sk.builtin.str(a);
        Sk.output(a.v);
        if (a.v.length === 0 || !(a.v[a.v.length - 1] === "\n" || a.v[a.v.length - 1] === "\t" || a.v[a.v.length - 1] === "\r") || a.v[a.v.length - 1] === " ") Sk.misceval.softspace_ = true
    };
    goog.exportSymbol("Sk.misceval.print_", Sk.misceval.print_);
    Sk.misceval.loadname = function (a, b) {
        var c = b[a];
        if (c !== undefined) return c;
        c = Sk.builtins[a];
        if (c !== undefined) return c;
        throw new Sk.builtin.NameError("name '" + a + "' is not defined");
    };
    goog.exportSymbol("Sk.misceval.loadname", Sk.misceval.loadname);
    Sk.misceval.call = function (a, b, c, d, e) {
        e = Array.prototype.slice.call(arguments, 4);
        return Sk.misceval.apply(a, b, c, d, e)
    };
    goog.exportSymbol("Sk.misceval.call", Sk.misceval.call);
    Sk.misceval.callsim = function (a, b) {
        b = Array.prototype.slice.call(arguments, 1);
        return Sk.misceval.apply(a, undefined, undefined, undefined, b)
    };
    goog.exportSymbol("Sk.misceval.callsim", Sk.misceval.callsim);
    Sk.misceval.apply = function (a, b, c, d, e) {
        if (typeof a === "function") {
            goog.asserts.assert(d === undefined);
            return a.apply(null, e)
        } else {
            var f = a.tp$call;
            if (f !== undefined) {
                if (c) {
                    c = c.tp$iter();
                    for (var g = c.tp$iternext(); g !== undefined; g = c.tp$iternext()) e.push(g)
                }
                b && goog.asserts.fail("todo;");
                return f.call(a, e, d, b)
            }
            f = a.__call__;
            if (f !== undefined) {
                e.unshift(a);
                return Sk.misceval.apply(f, d, e, b, c)
            }
            throw new TypeError("'" + a.tp$name + "' object is not callable");
        }
    };
    goog.exportSymbol("Sk.misceval.apply", Sk.misceval.apply);
    Sk.misceval.buildClass = function (a, b, c, d) {
        var e = Sk.builtin.type,
            f = {};
        b(a, f);
        f.__module__ = a.__name__;
        return Sk.misceval.callsim(e, c, d, f)
    };
    goog.exportSymbol("Sk.misceval.buildClass", Sk.misceval.buildClass);
    Sk.abstr = {};
    Sk.abstr.binop_type_error = function (a, b, c) {
        throw new TypeError("unsupported operand type(s) for " + c + ": '" + a.tp$name + "' and '" + b.tp$name + "'");
    };
    Sk.abstr.boNameToSlotFunc_ = function (a, b) {
        switch (b) {
        case "Add":
            return a.nb$add ? a.nb$add : a.__add__;
        case "Sub":
            return a.nb$subtract ? a.nb$subtract : a.__sub__;
        case "Mult":
            return a.nb$multiply ? a.nb$multiply : a.__mul__;
        case "Div":
            return a.nb$divide ? a.nb$divide : a.__div__;
        case "FloorDiv":
            return a.nb$floor_divide ? a.nb$floor_divide : a.__floordiv__;
        case "Mod":
            return a.nb$remainder ? a.nb$remainder : a.__mod__;
        case "Pow":
            return a.nb$power ? a.nb$power : a.__pow__
        }
    };
    Sk.abstr.iboNameToSlotFunc_ = function (a, b) {
        switch (b) {
        case "Add":
            return a.nb$inplace_add
        }
    };
    Sk.abstr.binary_op_ = function (a, b, c) {
        var d;
        d = Sk.abstr.boNameToSlotFunc_(a, c);
        if (d !== undefined) {
            d = d.call ? d.call(a, b) : Sk.misceval.callsim(d, a, b);
            if (d !== undefined) return d
        }
        d = Sk.abstr.boNameToSlotFunc_(b, c);
        if (d !== undefined) {
            d = d.call ? d.call(b, a) : Sk.misceval.callsim(d, b, a);
            if (d !== undefined) return d
        }
        if (c === "Add" && a.sq$concat) return a.sq$concat(b);
        else if (c === "Mult" && a.sq$repeat) return Sk.abstr.sequenceRepeat(a.sq$repeat, a, b);
        else if (c === "Mult" && b.sq$repeat) return Sk.abstr.sequenceRepeat(b.sq$repeat, b, a);
        Sk.abstr.binop_type_error(a, b, c)
    };
    Sk.abstr.binary_iop_ = function (a, b, c) {
        var d;
        d = Sk.abstr.iboNameToSlotFunc_(a, c);
        if (d !== undefined) {
            d = d.call(a, b);
            if (d !== undefined) return d
        }
        d = Sk.abstr.iboNameToSlotFunc_(b, c);
        if (d !== undefined) {
            d = d.call(b, a);
            if (d !== undefined) return d
        }
        if (c === "Add") if (a.sq$inplace_concat) return a.sq$inplace_concat(b);
        else {
            if (a.sq$concat) return a.sq$concat(b)
        } else if (c === "Mult") if (a.sq$inplace_repeat) return Sk.abstr.sequenceRepeat(a.sq$inplace_repeat, a, b);
        else if (a.sq$repeat) return Sk.abstr.sequenceRepeat(a.sq$repeat, a, b);
        else if (b.sq$repeat) return Sk.abstr.sequenceRepeat(b.sq$repeat, b, a);
        Sk.abstr.binop_type_error(a, b, c)
    };
    Sk.abstr.numOpAndPromote = function (a, b, c) {
        if (typeof a === "number" && typeof b === "number") {
            c = c(a, b);
            return c > Sk.builtin.lng.threshold$ || c < -Sk.builtin.lng.threshold$ ? [Sk.builtin.lng.fromInt$(a), Sk.builtin.lng.fromInt$(b)] : c
        } else if (a.constructor === Sk.builtin.lng && typeof b === "number") return [a, Sk.builtin.lng.fromInt$(b)];
        else if (b.constructor === Sk.builtin.lng && typeof a === "number") return [Sk.builtin.lng.fromInt$(a), b]
    };
    
    
    
    Sk.abstr.boNumPromote_ = {
        Add: function (a, b) {
            return a + b
        },
        Sub: function (a, b) {
            return a - b
        },
        Mult: function (a, b) {
            return a * b
        },
        Mod: function (a, b) {
            return (b < 0 ? -1 : 1) * (Math.abs(a) % b)
        },
        Div: function (a, b) {
            if (b === 0) throw new Sk.builtin.ZeroDivisionError("integer division or modulo by zero");
            else return a / b
        },
        FloorDiv: function (a, b) {
            return Math.floor(a / b)
        },
        Pow: Math.pow,
        BitAnd: function (a, b) {
            return a & b
        },
        BitOr: function (a, b) {
            return a | b
        },
        BitXor: function (a, b) {
            return a ^ b
        },
        LShift: function (a, b) {
            return a << b
        },
        RShift: function (a, b) {
            return a >> b
        }
    };







    Sk.abstr.numberBinOp = function (a, b, c) {
	console.trace();
        var d = Sk.abstr.boNumPromote_[c];
        if (d !== undefined) {
            d = Sk.abstr.numOpAndPromote(a, b, d);
            if (typeof d === "number") return d;
            else if (d !== undefined) {
                a = d[0];
                b = d[1]
            }
        }
        return Sk.abstr.binary_op_(a, b, c)
    };
    
    
    
    
    
    
    
    
    
    
    
    
    
    goog.exportSymbol("Sk.abstr.numberBinOp", Sk.abstr.numberBinOp);
    Sk.abstr.numberInplaceBinOp = function (a, b, c) {
        var d = Sk.abstr.boNumPromote_[c];
        if (d !== undefined) {
            d = Sk.abstr.numOpAndPromote(a, b, d);
            if (typeof d === "number") return d;
            else if (d !== undefined) {
                a = d[0];
                b = d[1]
            }
        }
        return Sk.abstr.binary_iop_(a, b, c)
    };
    goog.exportSymbol("Sk.abstr.numberInplaceBinOp", Sk.abstr.numberInplaceBinOp);
    Sk.abstr.numberUnaryOp = function (a, b) {
        if (b === "Not") return Sk.misceval.isTrue(a) ? false : true;
        else if (typeof a === "number" || typeof a === "boolean") {
            if (b === "USub") return -a;
            if (b === "UAdd") return a;
            if (b === "Invert") return~a
        } else {
            if (b === "USub" && a.nb$negative) return a.nb$negative();
            if (b === "UAdd" && a.nb$positive) return a.nb$positive()
        }
        throw new TypeError("unsupported operand type for " + b + " '" + a.tp$name + "'");
    };
    goog.exportSymbol("Sk.abstr.numberUnaryOp", Sk.abstr.numberUnaryOp);
    Sk.abstr.fixSeqIndex_ = function (a, b) {
        if (b < 0 && a.sq$length) b += a.sq$length();
        return b
    };
    Sk.abstr.sequenceContains = function (a, b) {
        if (a.sq$contains) return a.sq$contains(b);
        if (!a.tp$iter) throw new TypeError("argument of type '" + a.tp$name + "' is not iterable");
        for (var c = a.tp$iter(), d = c.tp$iternext(); d !== undefined; d = c.tp$iternext()) if (Sk.misceval.richCompareBool(d, b, "Eq")) return true;
        return false
    };
    Sk.abstr.sequenceGetItem = function () {
        goog.asserts.fail()
    };
    Sk.abstr.sequenceSetItem = function () {
        goog.asserts.fail()
    };
    Sk.abstr.sequenceDelItem = function (a, b) {
        if (a.sq$ass_item) {
            b = Sk.abstr.fixSeqIndex_(a, b);
            return a.sq$ass_item(b, null)
        }
        throw new TypeError("'" + a.tp$name + "' object does not support item deletion");
    };
    Sk.abstr.sequenceRepeat = function (a, b, c) {
        if (Sk.misceval.asIndex(c) === undefined) throw new TypeError("can't multiply sequence by non-int of type '" + c.tp$name + "'");
        return a.call(b, c)
    };
    Sk.abstr.sequenceGetSlice = function (a, b, c) {
        if (a.sq$slice) {
            b = Sk.abstr.fixSeqIndex_(a, b);
            c = Sk.abstr.fixSeqIndex_(a, c);
            return a.sq$slice(b, c)
        } else if (a.mp$subscript) return a.mp$subscript(new Sk.builtin.slice(b, c));
        throw new TypeError("'" + a.tp$name + "' object is unsliceable");
    };
    Sk.abstr.sequenceDelSlice = function (a, b, c) {
        if (a.sq$ass_slice) {
            b = Sk.abstr.fixSeqIndex_(a, b);
            c = Sk.abstr.fixSeqIndex_(a, c);
            return a.sq$ass_slice(b, c, null)
        }
        throw new TypeError("'" + a.tp$name + "' doesn't support slice deletion");
    };
    Sk.abstr.sequenceSetSlice = function (a, b, c, d) {
        if (a.sq$ass_slice) {
            b = Sk.abstr.fixSeqIndex_(a, b);
            c = Sk.abstr.fixSeqIndex_(a, c);
            a.sq$ass_slice(b, c, d)
        } else if (a.mp$ass_subscript) a.mp$ass_subscript(new Sk.builtin.slice(b, c), d);
        else throw new TypeError("'" + a.tp$name + "' object doesn't support slice assignment");
    };
    Sk.abstr.objectDelItem = function (a, b) {
        if (a.mp$ass_subscript) return a.mp$ass_subscript(b, null);
        if (a.sq$ass_item) {
            var c = Sk.misceval.asIndex(b);
            if (c === undefined) throw new TypeError("sequence index must be integer, not '" + b.tp$name + "'");
            return Sk.abstr.sequenceDelItem(a, c)
        }
        throw new TypeError("'" + a.tp$name + "' object does not support item deletion");
    };
    goog.exportSymbol("Sk.abstr.objectDelItem", Sk.abstr.objectDelItem);
    Sk.abstr.objectGetItem = function (a, b) {
        if (a.mp$subscript) return a.mp$subscript(b);
        else if (Sk.misceval.isIndex(b) && a.sq$item) return Sk.abstr.sequenceGetItem(a, Sk.misceval.asIndex(b));
        throw new TypeError("'" + a.tp$name + "' does not support indexing");
    };
    goog.exportSymbol("Sk.abstr.objectGetItem", Sk.abstr.objectGetItem);
    Sk.abstr.objectSetItem = function (a, b, c) {
        if (a.mp$ass_subscript) return a.mp$ass_subscript(b, c);
        else if (Sk.misceval.isIndex(b) && a.sq$ass_item) return Sk.abstr.sequenceSetItem(a, Sk.misceval.asIndex(b), c);
        throw new TypeError("'" + a.tp$name + "' does not support item assignment");
    };
    goog.exportSymbol("Sk.abstr.objectSetItem", Sk.abstr.objectSetItem);
    Sk.abstr.gattr = function (a, b) {
        var c = a.tp$getattr(b);
        if (c === undefined) throw new Sk.builtin.AttributeError("'" + a.tp$name + "' object has no attribute '" + b + "'");
        return c
    };
    goog.exportSymbol("Sk.abstr.gattr", Sk.abstr.gattr);
    Sk.abstr.sattr = function (a, b, c) {
        a.tp$setattr(b, c)
    };
    goog.exportSymbol("Sk.abstr.sattr", Sk.abstr.sattr);
    Sk.abstr.iter = function (a) {
        return a.tp$iter()
    };
    goog.exportSymbol("Sk.abstr.iter", Sk.abstr.iter);
    Sk.abstr.iternext = function (a) {
        return a.tp$iternext()
    };
    goog.exportSymbol("Sk.abstr.iternext", Sk.abstr.iternext);
    Sk.mergeSort = function (a, b, c, d) {
        goog.asserts.assert(!c, "todo;");
        goog.asserts.assert(!d, "todo;");
        if (!b) b = Sk.mergeSort.stdCmp;
        var e = function (f, g) {
            var h = g - f;
            if (!(h < 2)) {
                h = f + Math.floor(h / 2);
                e(f, h);
                e(h, g);
                for (var i = f; i < h; ++i) if (!(Sk.misceval.callsim(b, a[i], a[h]) < 0)) {
                    var j = a[i];
                    for (a[i] = a[h]; i + 1 < g && Sk.misceval.callsim(b, a[i + 1], j) < 0;) {
                        var k = a[i];
                        a[i] = a[i + 1];
                        a[i + 1] = k;
                        i += 1
                    }
                    a[i] = j
                }
            }
        };
        e(0, a.length);
        return null
    };
    Sk.mergeSort.stdCmp = new Sk.builtin.func(function (a, b) {
        return Sk.misceval.richCompareBool(a, b, "Lt") ? -1 : 0
    });
    Sk.builtin.list = function (a) {
        if (!(this instanceof Sk.builtin.list)) return new Sk.builtin.list(a);
        if (Object.prototype.toString.apply(a) === "[object Array]") this.v = a;
        else if (a.tp$iter) {
            this.v = [];
            a = a.tp$iter();
            for (var b = a.tp$iternext(); b !== undefined; b = a.tp$iternext()) this.v.push(b)
        } else throw new Sk.builtin.ValueError("expecting Array or iterable");
        this.v = this.v;
        return this
    };
    Sk.builtin.list.prototype.ob$type = Sk.builtin.type.makeIntoTypeObj("list", Sk.builtin.list);
    Sk.builtin.list.prototype.list_iter_ = function () {
        var a = {
            tp$iter: function () {
                return a
            },
            $obj: this,
            $index: 0,
            tp$iternext: function () {
                if (!(a.$index >= a.$obj.v.length)) return a.$obj.v[a.$index++]
            }
        };
        return a
    };
    Sk.builtin.list.prototype.list_concat_ = function (a) {
        for (var b = this.v.slice(), c = 0; c < a.v.length; ++c) b.push(a.v[c]);
        return new Sk.builtin.list(b)
    };
    Sk.builtin.list.prototype.list_ass_item_ = function (a, b) {
        if (a < 0 || a >= this.v.length) throw new Sk.builtin.IndexError("list assignment index out of range");
        if (b === null) return Sk.builtin.list.prototype.list_ass_slice_.call(this, a, a + 1, b);
        this.v[a] = b
    };
    Sk.builtin.list.prototype.list_ass_slice_ = function (a, b, c) {
        c = c === null ? [] : c.v.slice(0);
        c.unshift(b - a);
        c.unshift(a);
        this.v.splice.apply(this.v, c)
    };
    Sk.builtin.list.prototype.tp$name = "list";
    Sk.builtin.list.prototype.$r = function () {
        for (var a = [], b = this.tp$iter(), c = b.tp$iternext(); c !== undefined; c = b.tp$iternext()) a.push(Sk.misceval.objectRepr(c).v);
        return new Sk.builtin.str("[" + a.join(", ") + "]")
    };
    Sk.builtin.list.prototype.tp$getattr = Sk.builtin.object.prototype.GenericGetAttr;
    Sk.builtin.list.prototype.tp$hash = Sk.builtin.object.prototype.HashNotImplemented;
    Sk.builtin.list.prototype.tp$richcompare = function (a, b) {
        if (this === a && Sk.misceval.opAllowsEquality(b)) return true;
        var c = this.v;
        a = a.v;
        var d = c.length,
            e = a.length,
            f;
        for (f = 0; f < d && f < e; ++f) if (!Sk.misceval.richCompareBool(c[f], a[f], "Eq")) break;
        if (f >= d || f >= e) switch (b) {
        case "Lt":
            return d < e;
        case "LtE":
            return d <= e;
        case "Eq":
            return d === e;
        case "NotEq":
            return d !== e;
        case "Gt":
            return d > e;
        case "GtE":
            return d >= e;
        default:
            goog.asserts.fail()
        }
        if (b === "Eq") return false;
        if (b === "NotEq") return true;
        return Sk.misceval.richCompareBool(c[f],
        a[f], b)
    };
    Sk.builtin.list.prototype.tp$iter = Sk.builtin.list.prototype.list_iter_;
    Sk.builtin.list.prototype.sq$length = function () {
        return this.v.length
    };
    Sk.builtin.list.prototype.sq$concat = Sk.builtin.list.prototype.list_concat_;
    Sk.builtin.list.prototype.sq$repeat = function (a) {
        for (var b = [], c = 0; c < a; ++c) for (var d = 0; d < this.v.length; ++d) b.push(this.v[d]);
        return new Sk.builtin.list(b)
    };
    Sk.builtin.list.prototype.sq$ass_item = Sk.builtin.list.prototype.list_ass_item_;
    Sk.builtin.list.prototype.sq$ass_slice = Sk.builtin.list.prototype.list_ass_slice_;
    Sk.builtin.list.prototype.list_subscript_ = function (a) {
        if (typeof a === "number") {
            if (a < 0) a = this.v.length + a;
            if (a < 0 || a >= this.v.length) throw new Sk.builtin.IndexError("list index out of range");
            return this.v[a]
        } else if (a instanceof Sk.builtin.slice) {
            var b = [];
            a.sssiter$(this, function (c, d) {
                b.push(d.v[c])
            });
            return new Sk.builtin.list(b)
        } else throw new TypeError("list indices must be integers, not " + typeof a);
    };
    Sk.builtin.list.prototype.list_ass_item_ = function (a, b) {
        if (a < 0 || a >= this.v.length) throw new Sk.builtin.IndexError("list index out of range");
        if (b === null) this.list_ass_slice_(a, a + 1, b);
        else this.v[a] = b
    };
    Sk.builtin.list.prototype.list_ass_subscript_ = function (a, b) {
        if (Sk.misceval.isIndex(a)) {
            var c = Sk.misceval.asIndex(a);
            if (c < 0) c = this.v.length + c;
            this.list_ass_item_(c, b)
        } else if (a instanceof Sk.builtin.slice) if (a.step === 1) this.list_ass_slice_(a.start, a.stop, b);
        else if (b === null) {
            var d = this,
                e = 0,
                f = a.step > 0 ? 1 : 0;
            a.sssiter$(this, function (i) {
                d.v.splice(i - e, 1);
                e += f
            })
        } else {
            var g = [];
            a.sssiter$(this, function (i) {
                g.push(i)
            });
            var h = 0;
            if (g.length !== b.v.length) throw new Sk.builtin.ValueError("attempt to assign sequence of size " + b.v.length + " to extended slice of size " + g.length);
            for (c = 0; c < g.length; ++c) {
                this.v.splice(g[c], 1, b.v[h]);
                h += 1
            }
        } else throw new TypeError("list indices must be integers, not " + typeof a);
    };
    Sk.builtin.list.prototype.mp$subscript = Sk.builtin.list.prototype.list_subscript_;
    Sk.builtin.list.prototype.mp$ass_subscript = Sk.builtin.list.prototype.list_ass_subscript_;
    Sk.builtin.list.prototype.__getitem__ = new Sk.builtin.func(function (a, b) {
        return Sk.builtin.list.prototype.list_subscript_.call(a, b)
    });
    Sk.builtin.list.prototype.append = new Sk.builtin.func(function (a, b) {
        a.v.push(b);
        return null
    });
    Sk.builtin.list.prototype.insert = new Sk.builtin.func(function (a, b, c) {
        if (b < 0) b = 0;
        else if (b > a.v.length) b = a.v.length - 1;
        a.v.splice(b, 0, c)
    });
    Sk.builtin.list.prototype.extend = new Sk.builtin.func(function (a, b) {
        for (var c = b.tp$iter(), d = c.tp$iternext(); d !== undefined; d = c.tp$iternext()) a.v.push(d);
        return null
    });
    Sk.builtin.list.prototype.pop = new Sk.builtin.func(function (a, b) {
        if (b === undefined) b = a.v.length - 1;
        var c = a.v[b];
        a.v.splice(b, 1);
        return c
    });
    Sk.builtin.list.prototype.remove = new Sk.builtin.func(function (a, b) {
        var c = Sk.builtin.list.prototype.index.func_code(a, b);
        a.v.splice(c, 1);
        return null
    });
    Sk.builtin.list.prototype.index = new Sk.builtin.func(function (a, b) {
        for (var c = a.v.length, d = a.v, e = 0; e < c; ++e) if (Sk.misceval.richCompareBool(d[e], b, "Eq")) return e;
        throw new Sk.builtin.ValueError("list.index(x): x not in list");
    });
    Sk.builtin.list.prototype.count = new Sk.builtin.func(function (a, b) {
        for (var c = a.v.length, d = a.v, e = 0, f = 0; f < c; ++f) if (Sk.misceval.richCompareBool(d[f], b, "Eq")) e += 1;
        return e
    });
    Sk.builtin.list.prototype.reverse = new Sk.builtin.func(function (a) {
        for (var b = a.v, c = [], d = a.v.length - 1; d > -1; --d) c.push(b[d]);
        a.v = c;
        return null
    });
    Sk.builtin.list.prototype.sort = new Sk.builtin.func(function (a, b, c, d) {
        goog.asserts.assert(!c, "todo;");
        goog.asserts.assert(!d, "todo;");
        Sk.mergeSort(a.v, b);
        return null
    });
    goog.exportSymbol("Sk.builtin.list", Sk.builtin.list);
    var interned = {};
    Sk.builtin.str = function (a) {
        if (a === undefined) throw "error: trying to str() undefined (should be at least null)";
        if (a instanceof Sk.builtin.str && a !== Sk.builtin.str.prototype.ob$type) return a;
        if (!(this instanceof Sk.builtin.str)) return new Sk.builtin.str(a);
        if (a === true) a = "True";
        else if (a === false) a = "False";
        else if (a === null) a = "None";
        else if (typeof a === "number") {
            a = a.toString();
            if (a === "Infinity") a = "inf";
            else if (a === "-Infinity") a = "-inf"
        } else if (typeof a === "string") a = a;
        else if (a.tp$str !== undefined) {
            a = a.tp$str();
            if (!(a instanceof Sk.builtin.str)) throw new Sk.builtin.ValueError("__str__ didn't return a str");
            return a
        } else return a.__str__ !== undefined ? Sk.misceval.callsim(a.__str__, a) : Sk.misceval.objectRepr(a);
        if (Object.prototype.hasOwnProperty.call(interned, "1" + a)) return interned["1" + a];
        this.__class__ = Sk.builtin.str;
        this.v = this.v = a;
        interned["1" + a] = this;
        return this
    };
    goog.exportSymbol("Sk.builtin.str", Sk.builtin.str);
    Sk.builtin.str.$emptystr = new Sk.builtin.str("");
    Sk.builtin.str.prototype.mp$subscript = function (a) {
        if (typeof a === "number" && Math.floor(a) === a) {
            if (a < 0) a = this.v.length + a;
            if (a < 0 || a >= this.v.length) throw new Sk.builtin.IndexError("string index out of range");
            return new Sk.builtin.str(this.v.charAt(a))
        } else if (a instanceof Sk.builtin.slice) {
            var b = "";
            a.sssiter$(this, function (c, d) {
                if (c >= 0 && c < d.v.length) b += d.v.charAt(c)
            });
            return new Sk.builtin.str(b)
        } else throw new TypeError("string indices must be numbers, not " + typeof a);
    };
    Sk.builtin.str.prototype.sq$length = function () {
        return this.v.length
    };
    Sk.builtin.str.prototype.sq$concat = function (a) {
        return new Sk.builtin.str(this.v + a.v)
    };
    Sk.builtin.str.prototype.sq$repeat = function (a) {
        for (var b = "", c = 0; c < a; ++c) b += this.v;
        return new Sk.builtin.str(b)
    };
    Sk.builtin.str.prototype.sq$item = function () {
        goog.asserts.fail()
    };
    Sk.builtin.str.prototype.sq$slice = function (a, b) {
        return new Sk.builtin.str(this.v.substr(a, b - a))
    };
    Sk.builtin.str.prototype.sq$contains = function (a) {
        if (a.v === undefined || a.v.constructor != String) throw new TypeError("TypeError: 'In <string> requires string as left operand");
        return this.v.indexOf(a.v) != -1 ? true : false
    };
    Sk.builtin.str.prototype.tp$name = "str";
    Sk.builtin.str.prototype.tp$getattr = Sk.builtin.object.prototype.GenericGetAttr;
    Sk.builtin.str.prototype.tp$iter = function () {
        var a = {
            tp$iter: function () {
                return a
            },
            $obj: this,
            $index: 0,
            tp$iternext: function () {
                if (!(a.$index >= a.$obj.v.length)) return new Sk.builtin.str(a.$obj.v.substr(a.$index++, 1))
            }
        };
        return a
    };
    Sk.builtin.str.prototype.tp$richcompare = function (a, b) {
        if (a instanceof Sk.builtin.str) {
            if (this === a) switch (b) {
            case "Eq":
            case "LtE":
            case "GtE":
                return true;
            case "NotEq":
            case "Lt":
            case "Gt":
                return false
            }
            var c = this.v.length,
                d = a.v.length,
                e = Math.min(c, d),
                f = 0;
            if (e > 0) for (var g = 0; g < e; ++g) {
                if (this.v[g] != a.v[g]) {
                    f = this.v[g].charCodeAt(0) - a.v[g].charCodeAt(0);
                    break
                }
            } else f = 0;
            if (f == 0) f = c < d ? -1 : c > d ? 1 : 0;
            switch (b) {
            case "Lt":
                return f < 0;
            case "LtE":
                return f <= 0;
            case "Eq":
                return f == 0;
            case "NotEq":
                return f != 0;
            case "Gt":
                return f > 0;
            case "GtE":
                return f >= 0;
            default:
                goog.asserts.fail()
            }
        }
    };
    Sk.builtin.str.prototype.$r = function () {
        var a = "'";
        if (this.v.indexOf("'") !== -1 && this.v.indexOf('"') === -1) a = '"';
        for (var b = this.v.length, c = a, d = 0; d < b; ++d) {
            var e = this.v.charAt(d);
            if (e === a || e === "\\") c += "\\" + e;
            else if (e === "\t") c += "\\t";
            else if (e === "\n") c += "\\n";
            else if (e === "\r") c += "\\r";
            else if (e < " " || e >= 127) {
                e = e.charCodeAt(0).toString(16);
                if (e.length < 2) e = "0" + e;
                c += "\\x" + e
            } else c += e
        }
        c += a;
        return new Sk.builtin.str(c)
    };
    Sk.builtin.str.re_escape_ = function (a) {
        for (var b = [], c = /^[A-Za-z0-9]+$/, d = 0; d < a.length; ++d) {
            var e = a.charAt(d);
            if (c.test(e)) b.push(e);
            else e === "\\000" ? b.push("\\000") : b.push("\\" + e)
        }
        return b.join("")
    };
    Sk.builtin.str.prototype.lower = new Sk.builtin.func(function (a) {
        return new Sk.builtin.str(a.v.toLowerCase())
    });
    Sk.builtin.str.prototype.upper = new Sk.builtin.func(function (a) {
        return new Sk.builtin.str(a.v.toUpperCase())
    });
    Sk.builtin.str.prototype.capitalize = new Sk.builtin.func(function (a) {
        return new Sk.builtin.str(a.v.charAt(0).toUpperCase() + a.v.substring(1))
    });
    Sk.builtin.str.prototype.join = new Sk.builtin.func(function (a, b) {
        for (var c = [], d = b.tp$iter(), e = d.tp$iternext(); e !== undefined; e = d.tp$iternext()) {
            if (e.constructor !== Sk.builtin.str) throw "TypeError: sequence item " + c.length + ": expected string, " + typeof e + " found";
            c.push(e.v)
        }
        return new Sk.builtin.str(c.join(a.v))
    });
    Sk.builtin.str.prototype.split = new Sk.builtin.func(function (a, b, c) {
        a = b ? a.v.split((new Sk.builtin.str(b)).v, c) : a.v.trim().split(/[\s]+/, c);
        b = [];
        for (c = 0; c < a.length; ++c) b.push(new Sk.builtin.str(a[c]));
        return new Sk.builtin.list(b)
    });
    Sk.builtin.str.prototype.strip = new Sk.builtin.func(function (a, b) {
        goog.asserts.assert(!b, "todo;");
        return new Sk.builtin.str(a.v.replace(/^\s+|\s+$/g, ""))
    });
    Sk.builtin.str.prototype.lstrip = new Sk.builtin.func(function (a, b) {
        goog.asserts.assert(!b, "todo;");
        return new Sk.builtin.str(a.v.replace(/^\s+/g, ""))
    });
    Sk.builtin.str.prototype.rstrip = new Sk.builtin.func(function (a, b) {
        goog.asserts.assert(!b, "todo;");
        return new Sk.builtin.str(a.v.replace(/\s+$/g, ""))
    });
    Sk.builtin.str.prototype.partition = new Sk.builtin.func(function (a, b) {
        var c = new Sk.builtin.str(b),
            d = a.v.indexOf(c.v);
        if (d < 0) return new Sk.builtin.tuple([a, Sk.builtin.str.$emptystr, Sk.builtin.str.$emptystr]);
        return new Sk.builtin.tuple([new Sk.builtin.str(a.v.substring(0, d)), c, new Sk.builtin.str(a.v.substring(d + c.v.length))])
    });
    Sk.builtin.str.prototype.rpartition = new Sk.builtin.func(function (a, b) {
        var c = new Sk.builtin.str(b),
            d = a.v.lastIndexOf(c.v);
        if (d < 0) return new Sk.builtin.tuple([Sk.builtin.str.$emptystr, Sk.builtin.str.$emptystr, a]);
        return new Sk.builtin.tuple([new Sk.builtin.str(a.v.substring(0, d)), c, new Sk.builtin.str(a.v.substring(d + c.v.length))])
    });
    Sk.builtin.str.prototype.count = new Sk.builtin.func(function (a, b) {
        var c = a.v.match(RegExp(b.v, "g"));
        return c ? c.length : 0
    });
    Sk.builtin.str.prototype.ljust = new Sk.builtin.func(function (a, b) {
        if (a.v.length >= b) return a;
        else {
            var c = Array.prototype.join.call({
                length: Math.floor(b - a.v.length) + 1
            }, " ");
            return new Sk.builtin.str(a.v + c)
        }
    });
    Sk.builtin.str.prototype.rjust = new Sk.builtin.func(function (a, b) {
        if (a.v.length >= b) return a;
        else {
            var c = Array.prototype.join.call({
                length: Math.floor(b - a.v.length) + 1
            }, " ");
            return new Sk.builtin.str(c + a.v)
        }
    });
    Sk.builtin.str.prototype.center = new Sk.builtin.func(function (a, b) {
        if (a.v.length >= b) return a;
        else {
            var c = Array.prototype.join.call({
                length: Math.floor((b - a.v.length) / 2) + 1
            }, " ");
            c = c + a.v + c;
            if (c.length < b) c += " ";
            return new Sk.builtin.str(c)
        }
    });
    Sk.builtin.str.prototype.find = new Sk.builtin.func(function (a, b, c) {
        return a.v.indexOf(b.v, c)
    });
    Sk.builtin.str.prototype.index = new Sk.builtin.func(function (a, b, c) {
        return a.v.indexOf(b.v, c)
    });
    Sk.builtin.str.prototype.rfind = new Sk.builtin.func(function (a, b, c) {
        return a.v.lastIndexOf(b.v, c)
    });
    Sk.builtin.str.prototype.rindex = new Sk.builtin.func(function (a, b, c) {
        return a.v.lastIndexOf(b.v, c)
    });
    Sk.builtin.str.prototype.replace = new Sk.builtin.func(function (a, b, c, d) {
        if (b.constructor !== Sk.builtin.str || c.constructor !== Sk.builtin.str) throw new Sk.builtin.TypeError("expecting a string");
        goog.asserts.assert(d === undefined, "todo; replace() with count not implemented");
        b = RegExp(Sk.builtin.str.re_escape_(b.v), "g");
        return new Sk.builtin.str(a.v.replace(b, c.v))
    });
    Sk.builtin.str.prototype.ob$type = Sk.builtin.type.makeIntoTypeObj("str", Sk.builtin.str);
    Sk.builtin.str.prototype.nb$remainder = function (a) {
        if (a.constructor !== Sk.builtin.tuple && (a.mp$subscript === undefined || a.constructor === Sk.builtin.str)) a = new Sk.builtin.tuple([a]);
        var b = 0,
            c = this.v.replace(/%(\([a-zA-Z0-9]+\))?([#0 +\-]+)?(\*|[0-9]+)?(\.(\*|[0-9]+))?[hlL]?([diouxXeEfFgGcrs%])/g, function (d, e, f, g, h, i, j) {
                var k;
                if (e === undefined || e === "") k = b++;
                var l = false,
                    m = false,
                    o = false,
                    r = false,
                    q = false;
                if (f) {
                    if (f.indexOf("-") !== -1) m = true;
                    else if (f.indexOf("0") !== -1) l = true;
                    if (f.indexOf("+") !== -1) r = true;
                    else if (f.indexOf(" ") !== -1) o = true;
                    q = f.indexOf("#") !== -1
                }
                if (h) h = parseInt(h.substr(1), 10);
                f = function (n, s) {
                    var p, t, u = false;
                    if (typeof n === "number") {
                        if (n < 0) {
                            n = -n;
                            u = true
                        }
                        t = n.toString(s)
                    } else if (n instanceof Sk.builtin.lng) {
                        t = n.str$(s, false);
                        u = n.size$ < 0
                    }
                    goog.asserts.assert(t !== undefined, "unhandled number format");
                    var v = false;
                    if (h) for (p = t.length; p < h; ++p) {
                        t = "0" + t;
                        v = true
                    }
                    p = "";
                    if (u) p = "-";
                    else if (r) p = "+" + p;
                    else if (o) p = " " + p;
                    if (q) if (s === 16) p += "0x";
                    else if (s === 8 && !v && t !== "0") p += "0";
                    return [p, t]
                };
                d = function (n) {
                    var s = n[0];
                    n = n[1];
                    var p;
                    if (g) {
                        g = parseInt(g, 10);
                        p = n.length + s.length;
                        if (l) for (p = p; p < g; ++p) n = "0" + n;
                        else if (m) for (p = p; p < g; ++p) n += " ";
                        else for (p = p; p < g; ++p) s = " " + s
                    }
                    return s + n
                };
                if (a.constructor === Sk.builtin.tuple) e = a.v[k];
                else if (a.mp$subscript !== undefined) {
                    e = e.substring(1, e.length - 1);
                    e = a.mp$subscript(new Sk.builtin.str(e))
                } else throw new Sk.builtin.AttributeError(a.tp$name + " instance has no attribute 'mp$subscript'");
                switch (j) {
                case "d":
                case "i":
                    return d(f(e, 10));
                case "o":
                    return d(f(e, 8));
                case "x":
                    return d(f(e, 16));
                case "X":
                    return d(f(e,
                    16)).toUpperCase();
                case "e":
                case "E":
                case "f":
                case "F":
                case "g":
                case "G":
                    k = ["toExponential", "toFixed", "toPrecision"]["efg".indexOf(j.toLowerCase())];
                    e = e[k](h);
                    if ("EFG".indexOf(j) !== -1) e = e.toUpperCase();
                    return d(["", e]);
                case "c":
                    if (typeof e === "number") return String.fromCharCode(e);
                    else if (e instanceof Sk.builtin.lng) return String.fromCharCode(e.digit$[0] & 255);
                    else if (e.constructor === Sk.builtin.str) return e.v.substr(0, 1);
                    else throw new TypeError("an integer is required");
                case "r":
                    j = Sk.builtin.repr(e);
                    if (h) return j.v.substr(0, h);
                    return j.v;
                case "s":
                    j = new Sk.builtin.str(e);
                    if (h) return j.v.substr(0, h);
                    return j.v;
                case "%":
                    return "%"
                }
            });
        return new Sk.builtin.str(c)
    };
    Sk.builtin.tuple = function (a) {
        if (arguments.length > 1) throw new TypeError("tuple must be created from a sequence");
        if (!(a instanceof Sk.builtin.tuple)) {
            if (!(this instanceof Sk.builtin.tuple)) return new Sk.builtin.tuple(a);
            this.v = Object.prototype.toString.apply(a) === "[object Array]" ? a : a.v;
            this.__class__ = Sk.builtin.tuple;
            return this
        }
    };
    Sk.builtin.tuple.prototype.$r = function () {
        if (this.v.length === 0) return new Sk.builtin.str("()");
        for (var a = [], b = 0; b < this.v.length; ++b) a[b] = Sk.misceval.objectRepr(this.v[b]).v;
        a = a.join(", ");
        if (this.v.length === 1) a += ",";
        return new Sk.builtin.str("(" + a + ")")
    };
    Sk.builtin.tuple.prototype.mp$subscript = function (a) {
        if (typeof a === "number") {
            if (a < 0) a = this.v.length + a;
            if (a < 0 || a >= this.v.length) throw new Sk.builtin.IndexError("tuple index out of range");
            return this.v[a]
        } else if (a instanceof Sk.builtin.slice) {
            var b = [];
            a.sssiter$(this, function (c, d) {
                b.push(d.v[c])
            });
            return new Sk.builtin.tuple(b)
        } else throw new TypeError("tuple indices must be integers, not " + typeof a);
    };
    Sk.builtin.tuple.prototype.tp$hash = function () {
        for (var a = 1000003, b = 3430008, c = this.v.length, d = 0; d < c; ++d) {
            var e = Sk.builtin.hash(this.v[d]);
            if (e === -1) return -1;
            b = (b ^ e) * a;
            a += 82520 + c + c
        }
        b += 97531;
        if (b === -1) b = -2;
        return b
    };
    Sk.builtin.tuple.prototype.sq$repeat = function (a) {
        for (var b = [], c = 0; c < a; ++c) for (var d = 0; d < this.v.length; ++d) b.push(this.v[d]);
        return new Sk.builtin.tuple(b)
    };
    Sk.builtin.tuple.prototype.ob$type = Sk.builtin.type.makeIntoTypeObj("tuple", Sk.builtin.tuple);
    Sk.builtin.tuple.prototype.tp$iter = function () {
        var a = {
            tp$iter: function () {
                return a
            },
            $obj: this,
            $index: 0,
            tp$iternext: function () {
                if (!(a.$index >= a.$obj.v.length)) return a.$obj.v[a.$index++]
            }
        };
        return a
    };
    Sk.builtin.tuple.prototype.tp$richcompare = function (a, b) {
        var c = this.v;
        a = a.v;
        var d = c.length,
            e = a.length,
            f;
        for (f = 0; f < d && f < e; ++f) if (!Sk.misceval.richCompareBool(c[f], a[f], "Eq")) break;
        if (f >= d || f >= e) switch (b) {
        case "Lt":
            return d < e;
        case "LtE":
            return d <= e;
        case "Eq":
            return d === e;
        case "NotEq":
            return d !== e;
        case "Gt":
            return d > e;
        case "GtE":
            return d >= e;
        default:
            goog.asserts.fail()
        }
        if (b === "Eq") return false;
        if (b === "NotEq") return true;
        return Sk.misceval.richCompareBool(c[f], a[f], b)
    };
    Sk.builtin.tuple.prototype.sq$concat = function (a) {
        return new Sk.builtin.tuple(this.v.concat(a.v))
    };
    Sk.builtin.tuple.prototype.sq$length = function () {
        return this.v.length
    };
    goog.exportSymbol("Sk.builtin.tuple", Sk.builtin.tuple);
    Sk.builtin.dict = function (a) {
        if (!(this instanceof Sk.builtin.dict)) return new Sk.builtin.dict(a);
        for (var b = this.size = 0; b < a.length; b += 2) this.mp$ass_subscript(a[b], a[b + 1]);
        this.__class__ = Sk.builtin.dict;
        return this
    };
    Sk.builtin.dict.prototype.ob$type = Sk.builtin.type.makeIntoTypeObj("dict", Sk.builtin.dict);
    var kf = Sk.builtin.hash;
    Sk.builtin.dict.prototype.mp$subscript = function (a) {
        a = this[kf(a)];
        return a === undefined ? undefined : a.rhs
    };
    Sk.builtin.dict.prototype.mp$ass_subscript = function (a, b) {
        var c = kf(a);
        if (b === null) {
            if (this[c] !== undefined) {
                this.size -= 1;
                delete this[c]
            }
        } else {
            c in this || (this.size += 1);
            this[c] = {
                lhs: a,
                rhs: b
            }
        }
    };
    Sk.builtin.dict.prototype.tp$iter = function () {
        var a = [],
            b;
        for (b in this) if (this.hasOwnProperty(b)) {
            var c = this[b];
            c && c.lhs !== undefined && a.push(b)
        }
        var d = {
            tp$iter: function () {
                return d
            },
            $obj: this,
            $index: 0,
            $keys: a,
            tp$iternext: function () {
                if (!(d.$index >= d.$keys.length)) return d.$obj[d.$keys[d.$index++]].lhs
            }
        };
        return d
    };
    Sk.builtin.dict.prototype.$r = function () {
        for (var a = [], b = this.tp$iter(), c = b.tp$iternext(); c !== undefined; c = b.tp$iternext()) {
            var d = this.mp$subscript(c);
            if (d === undefined) d = null;
            a.push(Sk.misceval.objectRepr(c).v + ": " + Sk.misceval.objectRepr(d).v)
        }
        return new Sk.builtin.str("{" + a.join(", ") + "}")
    };
    Sk.builtin.dict.prototype.mp$length = function () {
        return this.size
    };
    Sk.builtin.dict.prototype.tp$getattr = Sk.builtin.object.prototype.GenericGetAttr;
    Sk.builtin.dict.prototype.get = new Sk.builtin.func(function (a, b, c) {
        if (c === undefined) c = null;
        a = a.mp$subscript(b);
        if (a !== undefined) return a;
        return c
    });
    Sk.builtin.dict.prototype.items = new Sk.builtin.func(function (a) {
        for (var b = [], c = a.tp$iter(), d = c.tp$iternext(); d !== undefined; d = c.tp$iternext()) {
            var e = a.mp$subscript(d);
            if (e === undefined) e = null;
            b.push(new Sk.builtin.tuple([d, e]))
        }
        return new Sk.builtin.list(b)
    });
    Sk.builtin.dict.prototype.keys = new Sk.builtin.func(function (a) {
        var b = [];
        a = a.tp$iter();
        for (var c = a.tp$iternext(); c !== undefined; c = a.tp$iternext()) b.push(c);
        return new Sk.builtin.list(b)
    });
    Sk.builtin.dict.prototype.values = new Sk.builtin.func(function (a) {
        for (var b = [], c = a.tp$iter(), d = c.tp$iternext(); d !== undefined; d = c.tp$iternext()) {
            d = a.mp$subscript(d);
            if (d === undefined) d = null;
            b.push(d)
        }
        return new Sk.builtin.list(b)
    });
    goog.exportSymbol("Sk.builtin.dict", Sk.builtin.dict);
    Sk.builtin.lng = function (a, b) {
        if (a) return Sk.builtin.lng.fromInt$(a);
        if (!(this instanceof Sk.builtin.lng)) return new Sk.builtin.lng(a, b);
        this.digit$ = Array(Math.abs(b));
        this.size$ = b;
        return this
    };
    Sk.builtin.lng.tp$index = function () {
        goog.asserts.fail("todo;")
    };
    Sk.builtin.lng.prototype.tp$name = "long";
    Sk.builtin.lng.prototype.ob$type = Sk.builtin.type.makeIntoTypeObj("long", Sk.builtin.lng);
    Sk.builtin.lng.SHIFT$ = 15;
    Sk.builtin.lng.BASE$ = 1 << Sk.builtin.lng.SHIFT$;
    Sk.builtin.lng.MASK$ = Sk.builtin.lng.BASE$ - 1;
    Sk.builtin.lng.threshold$ = Math.pow(2, 30);
    Sk.builtin.lng.fromInt$ = function (a) {
        var b = false;
        if (a < 0) {
            a = -a;
            b = true
        }
        for (var c = a, d = 0; c;) {
            d += 1;
            c >>= Sk.builtin.lng.SHIFT$
        }
        d = new Sk.builtin.lng(undefined, d);
        if (b) d.size$ = -d.size$;
        c = a;
        for (a = 0; c;) {
            d.digit$[a] = c & Sk.builtin.lng.MASK$;
            c >>= Sk.builtin.lng.SHIFT$;
            a += 1
        }
        return d
    };
    Sk.builtin.lng.mulInt$ = function (a, b) {
        var c = Math.abs(a.size$),
            d = new Sk.builtin.lng(undefined, c + 1),
            e = 0,
            f;
        for (f = 0; f < c; ++f) {
            e += a.digit$[f] * b;
            d.digit$[f] = e & Sk.builtin.lng.MASK$;
            e >>= Sk.builtin.lng.SHIFT$
        }
        d.digit$[f] = e;
        return Sk.builtin.lng.normalize$(d)
    };
    Sk.longFromStr = function (a) {
        goog.asserts.assert(a.charAt(a.length - 1) !== "L" && a.charAt(a.length - 1) !== "l", "L suffix should be removed before here");
        var b = false;
        if (a.substr(0, 1) === "-") {
            a = a.substr(1);
            b = true
        }
        var c = 10;
        if (a.substr(0, 2) === "0x" || a.substr(0, 2) === "0X") {
            a = a.substr(2);
            c = 16
        } else if (a.substr(0, 2) === "0o") {
            a = a.substr(2);
            c = 8
        } else if (a.substr(0, 1) === "0") {
            a = a.substr(1);
            c = 8
        } else if (a.substr(0, 2) === "0b") {
            a = a.substr(2);
            c = 2
        }
        for (var d = Sk.builtin.lng.fromInt$(0), e = Sk.builtin.lng.fromInt$(1), f, g = a.length - 1; g >= 0; --g) {
            f = Sk.builtin.lng.mulInt$(e, parseInt(a.substr(g, 1), 16));
            d = d.nb$add(f);
            e = Sk.builtin.lng.mulInt$(e, c)
        }
        if (b) d.size$ = -d.size$;
        return d
    };
    goog.exportSymbol("Sk.longFromStr", Sk.longFromStr);
    Sk.builtin.lng.prototype.clone = function () {
        var a = new Sk.builtin.lng(undefined, this.size$);
        a.digit$ = this.digit$.slice(0);
        return a
    };
    Sk.builtin.lng.prototype.nb$add = function (a) {
        if (this.size$ < 0) if (a.size$ < 0) {
            a = Sk.builtin.lng.add$(this, a);
            a.size$ = -a.size$
        } else a = Sk.builtin.lng.sub$(a, this);
        else a = a.size$ < 0 ? Sk.builtin.lng.sub$(this, a) : Sk.builtin.lng.add$(this, a);
        return a
    };
    Sk.builtin.lng.prototype.nb$inplace_add = Sk.builtin.lng.prototype.nb$add;
    Sk.builtin.lng.prototype.nb$subtract = function (a) {
        if (this.size$ < 0) {
            a = a.size$ < 0 ? Sk.builtin.lng.sub$(this, a) : Sk.builtin.lng.add$(this, a);
            a.size$ = -a.size$
        } else a = a.size < 0 ? Sk.builtin.lng.add$(this, a) : Sk.builtin.lng.sub$(this, a);
        return a
    };
    Sk.builtin.lng.prototype.nb$multiply = function (a) {
        var b = Sk.builtin.lng.mul$(this, a);
        if (this.size$ * a.size$ < 0) b.size$ = -b.size$;
        return b
    };
    Sk.builtin.lng.prototype.nb$power = function (a) {
        for (var b = Sk.builtin.lng.fromInt$(1), c = this.clone(); a.size$ > 0;) {
            if (a.digit$[0] % 2 !== 0) {
                b = Sk.builtin.lng.mul$(b, c);
                a.digit$[0] &= -2
            }
            c = Sk.builtin.lng.mul$(c, c);
            a.divremInt$(2)
        }
        if (this.size$ < 0) b.size$ = -b.size$;
        return b
    };
    Sk.builtin.lng.prototype.nb$negative = function () {
        var a = this.clone();
        a.size$ = -a.size$;
        return a
    };
    Sk.builtin.lng.prototype.nb$positive = function () {
        return this
    };
    Sk.builtin.lng.prototype.divrem$ = function (a) {
        var b = Math.abs(this.size$),
            c = Math.abs(a.size$);
        if (a.size$ === 0) throw new Sk.builtin.ZeroDivisionError("long division or modulo by zero");
        if (b < c || this.digit$[b - 1] < a.digit$[c - 1]) return [0, this];
        if (c === 1) {
            b = this.clone();
            var d = b.divremInt$(a.digit$[0]);
            c = new Sk.builtin.lng(undefined, 1);
            c.digit$[0] = d
        } else {
            c = Sk.builtin.lng.divremFull$(this, a);
            b = c[0];
            c = c[1]
        }
        if (this.size$ < 0 !== a.size$ < 0) b.size$ = -b.size$;
        if (this.size$ < 0 && c.size$ !== 0) c.size$ = -c.size$;
        return [b, c]
    };
    Sk.builtin.lng.divremFull$ = function () {
        throw "todo;";
    };
    Sk.builtin.lng.normalize$ = function (a) {
        for (var b = Math.abs(a.size$), c = b; c > 0 && a.digit$[c - 1] === 0;)--c;
        if (c !== b) a.size$ = a.size$ < 0 ? -c : c;
        return a
    };
    Sk.builtin.lng.add$ = function (a, b) {
        var c = Math.abs(a.size$),
            d = Math.abs(b.size$),
            e, f, g = 0;
        if (c < d) {
            e = a;
            a = b;
            b = e;
            e = c;
            c = d;
            d = e
        }
        e = new Sk.builtin.lng(undefined, c + 1);
        for (f = 0; f < d; ++f) {
            g += a.digit$[f] + b.digit$[f];
            e.digit$[f] = g & Sk.builtin.lng.MASK$;
            g >>= Sk.builtin.lng.SHIFT$
        }
        for (; f < c; ++f) {
            g += a.digit$[f];
            e.digit$[f] = g & Sk.builtin.lng.MASK$;
            g >>= Sk.builtin.lng.SHIFT$
        }
        e.digit$[f] = g;
        return Sk.builtin.lng.normalize$(e)
    };
    Sk.builtin.lng.sub$ = function (a, b) {
        var c = Math.abs(a.size$),
            d = Math.abs(b.size$),
            e, f, g = 1,
            h = 0;
        if (c < d) {
            g = -1;
            e = a;
            a = b;
            b = e;
            e = c;
            c = d;
            d = e
        } else if (c === d) {
            for (f = c; --f >= 0 && a.digit$[f] === b.digit$[f];);
            if (f < 0) return new Sk.builtin.lng(undefined, 0);
            if (a.digit$[f] < b.digit$[f]) {
                g = -1;
                e = a;
                a = b;
                b = e
            }
            c = d = f + 1
        }
        e = new Sk.builtin.lng(undefined, c);
        for (f = 0; f < d; ++f) {
            h = a.digit$[f] - b.digit$[f] - h;
            e.digit$[f] = h & Sk.builtin.lng.MASK$;
            h >>= Sk.builtin.lng.SHIFT$;
            h &= 1
        }
        for (; f < c; ++f) {
            h = a.digit$[f] - h;
            e.digit$[f] = h & Sk.builtin.lng.MASK$;
            h >>= Sk.builtin.lng.SHIFT$;
            h &= 1
        }
        goog.asserts.assert(h === 0);
        if (g < 0) e.size$ = -e.size$;
        return Sk.builtin.lng.normalize$(e)
    };
    Sk.builtin.lng.mul$ = function (a, b) {
        var c = Math.abs(a.size$),
            d = Math.abs(b.size$),
            e = new Sk.builtin.lng(undefined, c + d),
            f;
        for (f = 0; f < c + d; ++f) e.digit$[f] = 0;
        for (f = 0; f < c; ++f) {
            for (var g = 0, h = f, i = a.digit$[f], j = 0; j < d; ++j) {
                g += e.digit$[h] + b.digit$[j] * i;
                e.digit$[h++] = g & Sk.builtin.lng.MASK$;
                g >>= Sk.builtin.lng.SHIFT$;
                goog.asserts.assert(g <= Sk.builtin.lng.MASK$)
            }
            if (g) e.digit$[h++] += g & Sk.builtin.lng.MASK$
        }
        Sk.builtin.lng.normalize$(e);
        return e
    };
    Sk.builtin.lng.prototype.nb$nonzero = function () {
        return this.size$ !== 0
    };
    Sk.builtin.lng.prototype.divremInt$ = function (a) {
        for (var b, c = Math.abs(this.size$); --c >= 0;) {
            var d;
            b = (b << Sk.builtin.lng.SHIFT$) + this.digit$[c];
            this.digit$[c] = d = Math.floor(b / a);
            b -= d * a
        }
        Sk.builtin.lng.normalize$(this);
        return b
    };
    Sk.builtin.lng.prototype.$r = function () {
        return new Sk.builtin.str(this.str$(10, true) + "L")
    };
    Sk.builtin.lng.prototype.tp$str = function () {
        return new Sk.builtin.str(this.str$(10, true))
    };
    Sk.builtin.lng.prototype.str$ = function (a, b) {
        if (this.size$ === 0) return "0";
        if (a === undefined) a = 10;
        if (b === undefined) b = true;
        for (var c = "", d = this.clone(); d.nb$nonzero();) {
            var e = d.divremInt$(a);
            c = "0123456789abcdef".substring(e, e + 1) + c
        }
        return (b && this.size$ < 0 ? "-" : "") + c
    };
    Sk.builtin.int_ = function (a, b) {
        if (a instanceof Sk.builtin.str) {
            if (b === undefined) b = 10;
            if (a.v.substring(0, 2).toLowerCase() == "0x" && b != 16 && b != 0) throw new Sk.builtin.ValueError("int: Argument: " + a.v + " is not a valid literal");
            if (a.v.substring(0, 2).toLowerCase() == "0b") if (b != 2 && b != 0) throw new Sk.builtin.ValueError("int: Argument: " + a.v + " is not a valid literal");
            else {
                a.v = a.v.substring(2);
                b = 2
            }
            if (!isNaN(a.v) && a.v.indexOf(".") < 0) return parseInt(a.v, b);
            else throw new Sk.builtin.ValueError("int: Argument: " + a.v + " is not a valid literal");
        }
        return a | 0
    };
    Sk.builtin.int_.prototype.tp$name = "int";
    Sk.builtin.int_.prototype.ob$type = Sk.builtin.type.makeIntoTypeObj("int", Sk.builtin.int_);
    Sk.builtin.float_ = function (a) {
        if (a instanceof Sk.builtin.str) {
            if (a.v === "inf") return Infinity;
            if (a.v === "-inf") return -Infinity;
            if (isNaN(a.v)) throw new Sk.builtin.ValueError("float: Argument: " + a.v + " is not number");
            else return parseFloat(a.v)
        }
        return a
    };
    Sk.builtin.float_.prototype.tp$name = "float";
    Sk.builtin.float_.prototype.ob$type = Sk.builtin.type.makeIntoTypeObj("float", Sk.builtin.float_);
    Sk.builtin.slice = function (a, b, c) {
        if (!(this instanceof Sk.builtin.slice)) return new Sk.builtin.slice(a, b, c);
        if (b === undefined && c === undefined) {
            b = a;
            a = null
        }
        a || (a = null);
        if (b === undefined) b = null;
        if (c === undefined) c = null;
        this.start = a;
        this.stop = b;
        this.step = c;
        return this
    };
    Sk.builtin.slice.prototype.tp$str = function () {
        var a = Sk.builtin.repr(this.start).v,
            b = Sk.builtin.repr(this.stop).v,
            c = Sk.builtin.repr(this.step).v;
        return new Sk.builtin.str("slice(" + a + ", " + b + ", " + c + ")")
    };
    Sk.builtin.slice.prototype.indices = function (a) {
        var b = this.start,
            c = this.stop,
            d = this.step;
        if (d === null) d = 1;
        if (d > 0) {
            if (b === null) b = 0;
            if (c === null) c = a;
            if (b < 0) b = a + b;
            if (c < 0) c = a + c
        } else {
            if (b === null) b = a - 1;
            else if (b < 0) b = a + b;
            if (c === null) c = -1;
            else if (c < 0) c = a + c
        }
        return [b, c, d]
    };
    Sk.builtin.slice.prototype.sssiter$ = function (a, b) {
        var c = this.indices(typeof a === "number" ? a : a.v.length);
        if (c[2] > 0) {
            var d;
            for (d = c[0]; d < c[1]; d += c[2]) if (b(d, a) === false) break
        } else for (d = c[0]; d > c[1]; d += c[2]) if (b(d, a) === false) break
    };
    Sk.builtin.set = function (a) {
        if (!(this instanceof Sk.builtin.set)) return new Sk.builtin.set(a);
        if (typeof a === "undefined") a = [];
        this.set_reset_();
        a = new Sk.builtin.list(a);
        a = a.tp$iter();
        for (var b = a.tp$iternext(); b !== undefined; b = a.tp$iternext()) Sk.builtin.set.prototype.add.func_code(this, b);
        this.__class__ = Sk.builtin.set;
        this.v = this.v;
        return this
    };
    Sk.builtin.set.prototype.ob$type = Sk.builtin.type.makeIntoTypeObj("set", Sk.builtin.set);
    Sk.builtin.set.prototype.set_iter_ = function () {
        return Sk.builtin.dict.prototype.keys.func_code(this.v).tp$iter()
    };
    Sk.builtin.set.prototype.set_reset_ = function () {
        this.v = new Sk.builtin.dict([])
    };
    Sk.builtin.set.prototype.tp$name = "set";
    Sk.builtin.set.prototype.$r = function () {
        for (var a = [], b = this.tp$iter(), c = b.tp$iternext(); c !== undefined; c = b.tp$iternext()) a.push(Sk.misceval.objectRepr(c).v);
        return new Sk.builtin.str("set([" + a.join(", ") + "])")
    };
    Sk.builtin.set.prototype.tp$getattr = Sk.builtin.object.prototype.GenericGetAttr;
    Sk.builtin.set.prototype.tp$hash = Sk.builtin.object.prototype.HashNotImplemented;
    Sk.builtin.set.prototype.tp$richcompare = function (a, b) {
        if (this === a && Sk.misceval.opAllowsEquality(b)) return true;
        var c = this.sq$length(),
            d = a.sq$length();
        if (d !== c) {
            if (b === "Eq") return false;
            if (b === "NotEq") return true
        }
        var e = false,
            f = false;
        switch (b) {
        case "Lt":
        case "LtE":
        case "Eq":
        case "NotEq":
            e = Sk.builtin.set.prototype.issubset.func_code(this, a);
            break;
        case "Gt":
        case "GtE":
            f = Sk.builtin.set.prototype.issuperset.func_code(this, a);
            break;
        default:
            goog.asserts.fail()
        }
        switch (b) {
        case "Lt":
            return c < d && e;
        case "LtE":
        case "Eq":
            return e;
        case "NotEq":
            return !e;
        case "Gt":
            return c > d && f;
        case "GtE":
            return f
        }
    };
    Sk.builtin.set.prototype.tp$iter = Sk.builtin.set.prototype.set_iter_;
    Sk.builtin.set.prototype.sq$length = function () {
        return this.v.mp$length()
    };
    Sk.builtin.set.prototype.isdisjoint = new Sk.builtin.func(function (a, b) {
        for (var c = a.tp$iter(), d = c.tp$iternext(); d !== undefined; d = c.tp$iternext()) if (Sk.abstr.sequenceContains(b, d)) return false;
        return true
    });
    Sk.builtin.set.prototype.issubset = new Sk.builtin.func(function (a, b) {
        var c = a.sq$length(),
            d = b.sq$length();
        if (c > d) return false;
        c = a.tp$iter();
        for (d = c.tp$iternext(); d !== undefined; d = c.tp$iternext()) if (!Sk.abstr.sequenceContains(b, d)) return false;
        return true
    });
    Sk.builtin.set.prototype.issuperset = new Sk.builtin.func(function (a, b) {
        return Sk.builtin.set.prototype.issubset.func_code(b, a)
    });
    Sk.builtin.set.prototype.union = new Sk.builtin.func(function (a) {
        for (var b = new Sk.builtin.set(a), c = 1; c < arguments.length; c++) Sk.builtin.set.prototype.update.func_code(b, arguments[c]);
        return b
    });
    Sk.builtin.set.prototype.intersection = new Sk.builtin.func(function (a) {
        var b = Sk.builtin.set.prototype.copy.func_code(a);
        arguments[0] = b;
        Sk.builtin.set.prototype.intersection_update.func_code.apply(null, arguments);
        return b
    });
    Sk.builtin.set.prototype.difference = new Sk.builtin.func(function (a) {
        var b = Sk.builtin.set.prototype.copy.func_code(a);
        arguments[0] = b;
        Sk.builtin.set.prototype.difference_update.func_code.apply(null, arguments);
        return b
    });
    Sk.builtin.set.prototype.symmetric_difference = new Sk.builtin.func(function (a, b) {
        for (var c = Sk.builtin.set.prototype.union.func_code(a, b), d = c.tp$iter(), e = d.tp$iternext(); e !== undefined; e = d.tp$iternext()) Sk.abstr.sequenceContains(a, e) && Sk.abstr.sequenceContains(b, e) && Sk.builtin.set.prototype.discard.func_code(c, e);
        return c
    });
    Sk.builtin.set.prototype.copy = new Sk.builtin.func(function (a) {
        return new Sk.builtin.set(a)
    });
    Sk.builtin.set.prototype.update = new Sk.builtin.func(function (a, b) {
        for (var c = b.tp$iter(), d = c.tp$iternext(); d !== undefined; d = c.tp$iternext()) Sk.builtin.set.prototype.add.func_code(a, d);
        return null
    });
    Sk.builtin.set.prototype.intersection_update = new Sk.builtin.func(function (a) {
        for (var b = a.tp$iter(), c = b.tp$iternext(); c !== undefined; c = b.tp$iternext()) for (var d = 1; d < arguments.length; d++) if (!Sk.abstr.sequenceContains(arguments[d], c)) {
            Sk.builtin.set.prototype.discard.func_code(a, c);
            break
        }
        return null
    });
    Sk.builtin.set.prototype.difference_update = new Sk.builtin.func(function (a) {
        for (var b = a.tp$iter(), c = b.tp$iternext(); c !== undefined; c = b.tp$iternext()) for (var d = 1; d < arguments.length; d++) if (Sk.abstr.sequenceContains(arguments[d], c)) {
            Sk.builtin.set.prototype.discard.func_code(a, c);
            break
        }
        return null
    });
    Sk.builtin.set.prototype.symmetric_difference_update = new Sk.builtin.func(function (a, b) {
        var c = Sk.builtin.set.prototype.symmetric_difference.func_code(a, b);
        a.set_reset_();
        Sk.builtin.set.prototype.update.func_code(a, c);
        return null
    });
    Sk.builtin.set.prototype.add = new Sk.builtin.func(function (a, b) {
        a.v.mp$ass_subscript(b, true);
        return null
    });
    Sk.builtin.set.prototype.discard = new Sk.builtin.func(function (a, b) {
        a.v.mp$subscript(b) !== undefined && a.v.mp$ass_subscript(b, null);
        return null
    });
    Sk.builtin.set.prototype.pop = new Sk.builtin.func(function (a) {
        if (a.sq$length() === 0) throw new Sk.builtin.KeyError("pop from an empty set");
        var b = a.tp$iter().tp$iternext();
        Sk.builtin.set.prototype.discard.func_code(a, b);
        return b
    });
    Sk.builtin.set.prototype.remove = new Sk.builtin.func(function (a, b) {
        if (Sk.abstr.sequenceContains(a, b)) Sk.builtin.set.prototype.discard.func_code(a, b);
        else throw new Sk.builtin.KeyError(b);
        return null
    });
    goog.exportSymbol("Sk.builtin.set", Sk.builtin.set);
    Sk.builtin.module = function () {};
    goog.exportSymbol("Sk.builtin.module", Sk.builtin.module);
    Sk.builtin.module.prototype.ob$type = Sk.builtin.type.makeIntoTypeObj("module", Sk.builtin.module);
    Sk.builtin.module.prototype.tp$getattr = Sk.builtin.object.prototype.GenericGetAttr;
    Sk.builtin.module.prototype.tp$setattr = Sk.builtin.object.prototype.GenericSetAttr;
    Sk.builtin.generator = function (a, b, c, d, e) {
        if (a) {
            this.func_code = a;
            this.func_globals = b || null;
            this.gi$running = false;
            this.gi$resumeat = 0;
            this.gi$sentvalue = undefined;
            this.gi$locals = {};
            if (c.length > 0) for (b = 0; b < a.co_varnames.length; ++b) this.gi$locals[a.co_varnames[b]] = c[b];
            if (e !== undefined) for (var f in e) d[f] = e[f];
            this.func_closure = d;
            return this
        }
    };
    goog.exportSymbol("Sk.builtin.generator", Sk.builtin.generator);
    Sk.builtin.generator.prototype.tp$getattr = Sk.builtin.object.prototype.GenericGetAttr;
    Sk.builtin.generator.prototype.tp$iter = function () {
        return this
    };
    Sk.builtin.generator.prototype.tp$iternext = function (a) {
        this.gi$running = true;
        if (a === undefined) a = null;
        this.gi$sentvalue = a;
        a = [this];
        this.func_closure && a.push(this.func_closure);
        a = this.func_code.apply(this.func_globals, a);
        this.gi$running = false;
        goog.asserts.assert(a !== undefined);
        if (a !== null) {
            this.gi$resumeat = a[0];
            return a = a[1]
        }
    };
    Sk.builtin.generator.prototype.next = new Sk.builtin.func(function (a) {
        return a.tp$iternext()
    });
    Sk.builtin.generator.prototype.ob$type = Sk.builtin.type.makeIntoTypeObj("generator", Sk.builtin.generator);
    Sk.builtin.generator.prototype.$r = function () {
        return new Sk.builtin.str("<generator object " + this.func_code.co_name.v + ">")
    };
    Sk.builtin.generator.prototype.send = new Sk.builtin.func(function (a, b) {
        return a.tp$iternext(b)
    });
    Sk.builtin.file = function (a, b) {
        this.mode = b;
        this.name = a;
        this.closed = false;
        this.data$ = Sk.inBrowser ? document.all ? document.getElementById(a.v).innerText : document.getElementById(a.v).textContent : Sk.read(a.v);
        this.lineList = this.data$.split("\n");
        this.lineList = this.lineList.slice(0, - 1);
        for (var c in this.lineList) this.lineList[c] += "\n";
        this.pos$ = this.currentLine = 0;
        this.__class__ = Sk.builtin.file;
        return this
    };
    Sk.builtin.file.prototype.ob$type = Sk.builtin.type.makeIntoTypeObj("file", Sk.builtin.file);
    Sk.builtin.file.prototype.tp$getattr = Sk.builtin.object.prototype.GenericGetAttr;
    Sk.builtin.file.prototype.$r = function () {
        return new Sk.builtin.str("<" + (this.closed ? "closed" : "open") + "file '" + this.name + "', mode '" + this.mode + "'>")
    };
    Sk.builtin.file.prototype.tp$iter = function () {
        var a = {
            tp$iter: function () {
                return a
            },
            $obj: this,
            $index: 0,
            $lines: this.lineList,
            tp$iternext: function () {
                if (!(a.$index >= a.$lines.length)) return new Sk.builtin.str(a.$lines[a.$index++])
            }
        };
        return a
    };
    Sk.builtin.file.prototype.close = new Sk.builtin.func(function (a) {
        a.closed = true
    });
    Sk.builtin.file.prototype.flush = new Sk.builtin.func(function () {});
    Sk.builtin.file.prototype.fileno = new Sk.builtin.func(function () {
        return 10
    });
    Sk.builtin.file.prototype.isatty = new Sk.builtin.func(function () {
        return false
    });
    Sk.builtin.file.prototype.read = new Sk.builtin.func(function (a, b) {
        if (a.closed) throw new Sk.builtin.ValueError("I/O operation on closed file");
        var c = a.data$.length;
        if (b === undefined) b = c;
        var d = new Sk.builtin.str(a.data$.substr(a.pos$, b));
        a.pos$ += b;
        if (a.pos$ >= c) a.pos$ = c;
        return d
    });
    Sk.builtin.file.prototype.readline = new Sk.builtin.func(function (a) {
        var b = "";
        if (a.currentLine < a.lineList.length) {
            b = a.lineList[a.currentLine];
            a.currentLine++
        }
        return new Sk.builtin.str(b)
    });
    Sk.builtin.file.prototype.readlines = new Sk.builtin.func(function (a) {
        for (var b = [], c = a.currentLine; c < a.lineList.length; c++) b.push(new Sk.builtin.str(a.lineList[c]));
        return new Sk.builtin.list(b)
    });
    Sk.builtin.file.prototype.seek = new Sk.builtin.func(function (a, b, c) {
        if (c === undefined) c = 1;
        a.pos$ = c == 1 ? b : a.data$ + b
    });
    Sk.builtin.file.prototype.tell = new Sk.builtin.func(function (a) {
        return a.pos$
    });
    Sk.builtin.file.prototype.truncate = new Sk.builtin.func(function () {
        goog.asserts.fail()
    });
    Sk.builtin.file.prototype.write = new Sk.builtin.func(function () {
        goog.asserts.fail()
    });
    goog.exportSymbol("Sk.builtin.file", Sk.builtin.file);
    Sk.ffi = Sk.ffi || {};
    Sk.ffi.remapToPy = function (a) {
        if (Object.prototype.toString.call(a) === "[object Array]") {
            for (var b = [], c = 0; c < a.length; ++c) b.push(Sk.ffi.remapToPy(a[c]));
            return new Sk.builtin.list(b)
        } else if (typeof a === "object") {
            b = [];
            for (c in a) {
                b.push(Sk.ffi.remapToPy(c));
                b.push(Sk.ffi.remapToPy(a[c]))
            }
            return new Sk.builtin.dict(b)
        } else if (typeof a === "string") return new Sk.builtin.str(a);
        else if (typeof a === "number" || typeof a === "boolean") return a;
        goog.asserts.fail("unhandled remap type")
    };
    goog.exportSymbol("Sk.ffi.remapToPy", Sk.ffi.remapToPy);
    Sk.ffi.remapToJs = function (a) {
        if (a instanceof Sk.builtin.dict) {
            for (var b = {}, c = a.tp$iter(), d = c.tp$iternext(); d !== undefined; d = c.tp$iternext()) {
                var e = a.mp$subscript(d);
                if (e === undefined) e = null;
                d = Sk.ffi.remapToJs(d);
                b[d] = Sk.ffi.remapToJs(e)
            }
            return b
        } else if (a instanceof Sk.builtin.list) {
            b = [];
            for (c = 0; c < a.v.length; ++c) b.push(Sk.ffi.remapToJs(a.v[c]));
            return b
        } else return typeof a === "number" || typeof a === "boolean" ? a : a.v
    };
    goog.exportSymbol("Sk.ffi.remapToJs", Sk.ffi.remapToJs);
    Sk.ffi.callback = function (a) {
        if (a === undefined) return a;
        return function () {
            return Sk.misceval.apply(a, undefined, undefined, undefined, Array.prototype.slice.call(arguments, 0))
        }
    };
    goog.exportSymbol("Sk.ffi.callback", Sk.ffi.callback);
    Sk.ffi.stdwrap = function (a, b) {
        var c = new a;
        c.v = b;
        return c
    };
    goog.exportSymbol("Sk.ffi.stdwrap", Sk.ffi.stdwrap);
    Sk.ffi.basicwrap = function (a) {
        if (typeof a === "number" || typeof a === "boolean") return a;
        if (typeof a === "string") return new Sk.builtin.str(a);
        goog.asserts.fail("unexpected type for basicwrap")
    };
    goog.exportSymbol("Sk.ffi.basicwrap", Sk.ffi.basicwrap);
    Sk.ffi.unwrapo = function (a) {
        if (a !== undefined) return a.v
    };
    goog.exportSymbol("Sk.ffi.unwrapo", Sk.ffi.unwrapo);
    Sk.ffi.unwrapn = function (a) {
        if (a === null) return null;
        return a.v
    };
    goog.exportSymbol("Sk.ffi.unwrapn", Sk.ffi.unwrapn);
    Sk.Tokenizer = function (a, b, c) {
        this.filename = a;
        this.callback = c;
        this.parenlev = this.lnum = 0;
        this.continued = false;
        this.namechars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_";
        this.numchars = "0123456789";
        this.contstr = "";
        this.needcont = false;
        this.contline = undefined;
        this.indents = [0];
        this.endprog = /.*/;
        this.strstart = [-1, - 1];
        this.interactive = b;
        this.doneFunc = function () {
            for (var d = 1; d < this.indents.length; ++d) if (this.callback(Sk.Tokenizer.Tokens.T_DEDENT, "", [this.lnum, 0], [this.lnum, 0], "")) return "done";
            if (this.callback(Sk.Tokenizer.Tokens.T_ENDMARKER, "", [this.lnum, 0], [this.lnum, 0], "")) return "done";
            return "failed"
        };
        pseudoprog = RegExp(PseudoToken);
        single3prog = RegExp(Single3, "g");
        double3prog = RegExp(Double3, "g");
        endprogs = {
            "'": RegExp(Single, "g"),
            '"': RegExp(Double_, "g"),
            "'''": single3prog,
            '"""': double3prog,
            "r'''": single3prog,
            'r"""': double3prog,
            "u'''": single3prog,
            'u"""': double3prog,
            "b'''": single3prog,
            'b"""': double3prog,
            "ur'''": single3prog,
            'ur"""': double3prog,
            "br'''": single3prog,
            'br"""': double3prog,
            "R'''": single3prog,
            'R"""': double3prog,
            "U'''": single3prog,
            'U"""': double3prog,
            "B'''": single3prog,
            'B"""': double3prog,
            "uR'''": single3prog,
            'uR"""': double3prog,
            "Ur'''": single3prog,
            'Ur"""': double3prog,
            "UR'''": single3prog,
            'UR"""': double3prog,
            "bR'''": single3prog,
            'bR"""': double3prog,
            "Br'''": single3prog,
            'Br"""': double3prog,
            "BR'''": single3prog,
            'BR"""': double3prog,
            r: null,
            R: null,
            u: null,
            U: null,
            b: null,
            B: null
        }
    };
    Sk.Tokenizer.Tokens = {
        T_ENDMARKER: 0,
        T_NAME: 1,
        T_NUMBER: 2,
        T_STRING: 3,
        T_NEWLINE: 4,
        T_INDENT: 5,
        T_DEDENT: 6,
        T_LPAR: 7,
        T_RPAR: 8,
        T_LSQB: 9,
        T_RSQB: 10,
        T_COLON: 11,
        T_COMMA: 12,
        T_SEMI: 13,
        T_PLUS: 14,
        T_MINUS: 15,
        T_STAR: 16,
        T_SLASH: 17,
        T_VBAR: 18,
        T_AMPER: 19,
        T_LESS: 20,
        T_GREATER: 21,
        T_EQUAL: 22,
        T_DOT: 23,
        T_PERCENT: 24,
        T_BACKQUOTE: 25,
        T_LBRACE: 26,
        T_RBRACE: 27,
        T_EQEQUAL: 28,
        T_NOTEQUAL: 29,
        T_LESSEQUAL: 30,
        T_GREATEREQUAL: 31,
        T_TILDE: 32,
        T_CIRCUMFLEX: 33,
        T_LEFTSHIFT: 34,
        T_RIGHTSHIFT: 35,
        T_DOUBLESTAR: 36,
        T_PLUSEQUAL: 37,
        T_MINEQUAL: 38,
        T_STAREQUAL: 39,
        T_SLASHEQUAL: 40,
        T_PERCENTEQUAL: 41,
        T_AMPEREQUAL: 42,
        T_VBAREQUAL: 43,
        T_CIRCUMFLEXEQUAL: 44,
        T_LEFTSHIFTEQUAL: 45,
        T_RIGHTSHIFTEQUAL: 46,
        T_DOUBLESTAREQUAL: 47,
        T_DOUBLESLASH: 48,
        T_DOUBLESLASHEQUAL: 49,
        T_AT: 50,
        T_OP: 51,
        T_COMMENT: 52,
        T_NL: 53,
        T_RARROW: 54,
        T_ERRORTOKEN: 55,
        T_N_TOKENS: 56,
        T_NT_OFFSET: 256
    };

    function group() {
        return "(" + Array.prototype.slice.call(arguments).join("|") + ")"
    }
    function any() {
        return group.apply(null, arguments) + "*"
    }
    function maybe() {
        return group.apply(null, arguments) + "?"
    }
    var Whitespace = "[ \\f\\t]*",
        Comment_ = "#[^\\r\\n]*",
        Ident = "[a-zA-Z_]\\w*",
        Binnumber = "0[bB][01]*",
        Hexnumber = "0[xX][\\da-fA-F]*[lL]?",
        Octnumber = "0[oO]?[0-7]*[lL]?",
        Decnumber = "[1-9]\\d*[lL]?",
        Intnumber = group(Binnumber, Hexnumber, Octnumber, Decnumber),
        Exponent = "[eE][-+]?\\d+",
        Pointfloat = group("\\d+\\.\\d*", "\\.\\d+") + maybe(Exponent),
        Expfloat = "\\d+" + Exponent,
        Floatnumber = group(Pointfloat, Expfloat),
        Imagnumber = group("\\d+[jJ]", Floatnumber + "[jJ]"),
        Number_ = group(Imagnumber, Floatnumber, Intnumber),
        Single = "^[^'\\\\]*(?:\\\\.[^'\\\\]*)*'",
        Double_ = '^[^"\\\\]*(?:\\\\.[^"\\\\]*)*"',
        Single3 = "[^'\\\\]*(?:(?:\\\\.|'(?!''))[^'\\\\]*)*'''",
        Double3 = '[^"\\\\]*(?:(?:\\\\.|"(?!""))[^"\\\\]*)*"""',
        Triple = group("[ubUB]?[rR]?'''", '[ubUB]?[rR]?"""'),
        String_ = group("[uU]?[rR]?'[^\\n'\\\\]*(?:\\\\.[^\\n'\\\\]*)*'", '[uU]?[rR]?"[^\\n"\\\\]*(?:\\\\.[^\\n"\\\\]*)*"'),
        Operator = group("\\*\\*=?", ">>=?", "<<=?", "<>", "!=", "//=?", "->", "[+\\-*/%&|^=<>]=?", "~"),
        Bracket = "[\\][(){}]",
        Special = group("\\r?\\n", "[:;.,`@]"),
        Funny = group(Operator, Bracket, Special),
        ContStr = group("[uUbB]?[rR]?'[^\\n'\\\\]*(?:\\\\.[^\\n'\\\\]*)*" + group("'", "\\\\\\r?\\n"), '[uUbB]?[rR]?"[^\\n"\\\\]*(?:\\\\.[^\\n"\\\\]*)*' + group('"', "\\\\\\r?\\n")),
        PseudoExtras = group("\\\\\\r?\\n", Comment_, Triple),
        PseudoToken = group(PseudoExtras, Number_, Funny, ContStr, Ident),
        pseudoprog, single3prog, double3prog, endprogs = {}, triple_quoted = {
            "'''": true,
            '"""': true,
            "r'''": true,
            'r"""': true,
            "R'''": true,
            'R"""': true,
            "u'''": true,
            'u"""': true,
            "U'''": true,
            'U"""': true,
            "b'''": true,
            'b"""': true,
            "B'''": true,
            'B"""': true,
            "ur'''": true,
            'ur"""': true,
            "Ur'''": true,
            'Ur"""': true,
            "uR'''": true,
            'uR"""': true,
            "UR'''": true,
            'UR"""': true,
            "br'''": true,
            'br"""': true,
            "Br'''": true,
            'Br"""': true,
            "bR'''": true,
            'bR"""': true,
            "BR'''": true,
            'BR"""': true
        }, single_quoted = {
            "'": true,
            '"': true,
            "r'": true,
            'r"': true,
            "R'": true,
            'R"': true,
            "u'": true,
            'u"': true,
            "U'": true,
            'U"': true,
            "b'": true,
            'b"': true,
            "B'": true,
            'B"': true,
            "ur'": true,
            'ur"': true,
            "Ur'": true,
            'Ur"': true,
            "uR'": true,
            'uR"': true,
            "UR'": true,
            'UR"': true,
            "br'": true,
            'br"': true,
            "Br'": true,
            'Br"': true,
            "bR'": true,
            'bR"': true,
            "BR'": true,
            'BR"': true
        };
    (function () {
        for (var a in triple_quoted);
        for (a in single_quoted);
    })();
    var tabsize = 8;

    function contains(a, b) {
        for (var c = a.length; c--;) if (a[c] === b) return true;
        return false
    }
    function rstrip(a, b) {
        for (var c = a.length; c > 0; --c) if (b.indexOf(a.charAt(c - 1)) === -1) break;
        return a.substring(0, c)
    }
    Sk.Tokenizer.prototype.generateTokens = function (a) {
        var b, c, d, e, f;
        a || (a = "");
        this.lnum += 1;
        c = 0;
        f = a.length;
        if (this.contstr.length > 0) {
            if (!a) throw new Sk.builtin.TokenError("EOF in multi-line string", this.filename, this.strstart[0], this.strstart[1], this.contline);
            if (b = this.endprog.test(a)) {
                c = e = this.endprog.lastIndex;
                if (this.callback(Sk.Tokenizer.Tokens.T_STRING, this.contstr + a.substring(0, e), this.strstart, [this.lnum, e], this.contline + a)) return "done";
                this.contstr = "";
                this.needcont = false;
                this.contline = undefined
            } else {
                if (this.needcont && a.substring(a.length - 2) !== "\\\n" && a.substring(a.length - 3) !== "\\\r\n") {
                    if (this.callback(Sk.Tokenizer.Tokens.T_ERRORTOKEN, this.contstr + a, this.strstart, [this.lnum, a.length], this.contline)) return "done";
                    this.contstr = "";
                    this.contline = undefined
                } else {
                    this.contstr += a;
                    this.contline += a
                }
                return false
            }
        } else if (this.parenlev === 0 && !this.continued) {
            if (!a) return this.doneFunc();
            for (d = 0; c < f;) {
                if (a.charAt(c) === " ") d += 1;
                else if (a.charAt(c) === "\t") d = (d / tabsize + 1) * tabsize;
                else if (a.charAt(c) === "\u000c") d = 0;
                else break;
                c += 1
            }
            if (c === f) return this.doneFunc();
            if ("#\r\n".indexOf(a.charAt(c)) !== -1) if (a.charAt(c) === "#") {
                f = rstrip(a.substring(c), "\r\n");
                d = c + f.length;
                if (this.callback(Sk.Tokenizer.Tokens.T_COMMENT, f, [this.lnum, c], [this.lnum, c + f.length], a)) return "done";
                if (this.callback(Sk.Tokenizer.Tokens.T_NL, a.substring(d), [this.lnum, d], [this.lnum, a.length], a)) return "done";
                return false
            } else {
                if (this.callback(Sk.Tokenizer.Tokens.T_NL, a.substring(c), [this.lnum, c], [this.lnum, a.length], a)) return "done";
                if (!this.interactive) return false
            }
            if (d > this.indents[this.indents.length - 1]) {
                this.indents.push(d);
                if (this.callback(Sk.Tokenizer.Tokens.T_INDENT, a.substring(0, c), [this.lnum, 0], [this.lnum, c], a)) return "done"
            }
            for (; d < this.indents[this.indents.length - 1];) {
                if (!contains(this.indents, d)) throw new Sk.builtin.IndentationError("unindent does not match any outer indentation level", this.filename, this.lnum, c, a);
                this.indents.splice(this.indents.length - 1, 1);
                if (this.callback(Sk.Tokenizer.Tokens.T_DEDENT, "", [this.lnum, c], [this.lnum, c], a)) return "done"
            }
        } else {
            if (!a) throw new Sk.builtin.TokenError("EOF in multi-line statement",
            this.filename, this.lnum, 0, a);
            this.continued = false
        }
        for (; c < f;) {
            for (d = a.charAt(c); d === " " || d === "\u000c" || d === "\t";) {
                c += 1;
                d = a.charAt(c)
            }
            var g = pseudoprog.exec(a.substring(c));
            if (g) {
                d = c;
                e = d + g[1].length;
                g = [this.lnum, d];
                b = [this.lnum, e];
                c = e;
                e = a.substring(d, e);
                var h = a.charAt(d);
                if (this.numchars.indexOf(h) !== -1 || h === "." && e !== ".") {
                    if (this.callback(Sk.Tokenizer.Tokens.T_NUMBER, e, g, b, a)) return "done"
                } else if (h === "\r" || h === "\n") {
                    d = Sk.Tokenizer.Tokens.T_NEWLINE;
                    if (this.parenlev > 0) d = Sk.Tokenizer.Tokens.T_NL;
                    if (this.callback(d,
                    e, g, b, a)) return "done"
                } else if (h === "#") {
                    if (this.callback(Sk.Tokenizer.Tokens.T_COMMENT, e, g, b, a)) return "done"
                } else if (triple_quoted.hasOwnProperty(e)) {
                    this.endprog = endprogs[e];
                    if (b = this.endprog.test(a.substring(c))) {
                        c = this.endprog.lastIndex + c;
                        e = a.substring(d, c);
                        if (this.callback(Sk.Tokenizer.Tokens.T_STRING, e, g, [this.lnum, c], a)) return "done"
                    } else {
                        this.strstart = [this.lnum, d];
                        this.contstr = a.substring(d);
                        this.contline = a;
                        break
                    }
                } else if (single_quoted.hasOwnProperty(h) || single_quoted.hasOwnProperty(e.substring(0,
                2)) || single_quoted.hasOwnProperty(e.substring(0, 3))) if (e[e.length - 1] === "\n") {
                    this.strstart = [this.lnum, d];
                    this.endprog = endprogs[h] || endprogs[e[1]] || endprogs[e[2]];
                    this.contstr = a.substring(d);
                    this.needcont = true;
                    this.contline = a;
                    break
                } else {
                    if (this.callback(Sk.Tokenizer.Tokens.T_STRING, e, g, b, a)) return "done"
                } else if (this.namechars.indexOf(h) !== -1) {
                    if (this.callback(Sk.Tokenizer.Tokens.T_NAME, e, g, b, a)) return "done"
                } else if (h === "\\") {
                    if (this.callback(Sk.Tokenizer.Tokens.T_NL, e, g, [this.lnum, c], a)) return "done";
                    this.continued = true
                } else {
                    if ("([{".indexOf(h) !== -1) this.parenlev += 1;
                    else if (")]}".indexOf(h) !== -1) this.parenlev -= 1;
                    if (this.callback(Sk.Tokenizer.Tokens.T_OP, e, g, b, a)) return "done"
                }
            } else {
                if (this.callback(Sk.Tokenizer.Tokens.T_ERRORTOKEN, a.charAt(c), [this.lnum, c], [this.lnum, c + 1], a)) return "done";
                c += 1
            }
        }
        return false
    };
    Sk.Tokenizer.tokenNames = {
        0: "T_ENDMARKER",
        1: "T_NAME",
        2: "T_NUMBER",
        3: "T_STRING",
        4: "T_NEWLINE",
        5: "T_INDENT",
        6: "T_DEDENT",
        7: "T_LPAR",
        8: "T_RPAR",
        9: "T_LSQB",
        10: "T_RSQB",
        11: "T_COLON",
        12: "T_COMMA",
        13: "T_SEMI",
        14: "T_PLUS",
        15: "T_MINUS",
        16: "T_STAR",
        17: "T_SLASH",
        18: "T_VBAR",
        19: "T_AMPER",
        20: "T_LESS",
        21: "T_GREATER",
        22: "T_EQUAL",
        23: "T_DOT",
        24: "T_PERCENT",
        25: "T_BACKQUOTE",
        26: "T_LBRACE",
        27: "T_RBRACE",
        28: "T_EQEQUAL",
        29: "T_NOTEQUAL",
        30: "T_LESSEQUAL",
        31: "T_GREATEREQUAL",
        32: "T_TILDE",
        33: "T_CIRCUMFLEX",
        34: "T_LEFTSHIFT",
        35: "T_RIGHTSHIFT",
        36: "T_DOUBLESTAR",
        37: "T_PLUSEQUAL",
        38: "T_MINEQUAL",
        39: "T_STAREQUAL",
        40: "T_SLASHEQUAL",
        41: "T_PERCENTEQUAL",
        42: "T_AMPEREQUAL",
        43: "T_VBAREQUAL",
        44: "T_CIRCUMFLEXEQUAL",
        45: "T_LEFTSHIFTEQUAL",
        46: "T_RIGHTSHIFTEQUAL",
        47: "T_DOUBLESTAREQUAL",
        48: "T_DOUBLESLASH",
        49: "T_DOUBLESLASHEQUAL",
        50: "T_AT",
        51: "T_OP",
        52: "T_COMMENT",
        53: "T_NL",
        54: "T_RARROW",
        55: "T_ERRORTOKEN",
        56: "T_N_TOKENS",
        256: "T_NT_OFFSET"
    };
    goog.exportSymbol("Sk.Tokenizer", Sk.Tokenizer);
    goog.exportSymbol("Sk.Tokenizer.prototype.generateTokens", Sk.Tokenizer.prototype.generateTokens);
    goog.exportSymbol("Sk.Tokenizer.tokenNames", Sk.Tokenizer.tokenNames);
    Sk.OpMap = {
        "(": Sk.Tokenizer.Tokens.T_LPAR,
        ")": Sk.Tokenizer.Tokens.T_RPAR,
        "[": Sk.Tokenizer.Tokens.T_LSQB,
        "]": Sk.Tokenizer.Tokens.T_RSQB,
        ":": Sk.Tokenizer.Tokens.T_COLON,
        ",": Sk.Tokenizer.Tokens.T_COMMA,
        ";": Sk.Tokenizer.Tokens.T_SEMI,
        "+": Sk.Tokenizer.Tokens.T_PLUS,
        "-": Sk.Tokenizer.Tokens.T_MINUS,
        "*": Sk.Tokenizer.Tokens.T_STAR,
        "/": Sk.Tokenizer.Tokens.T_SLASH,
        "|": Sk.Tokenizer.Tokens.T_VBAR,
        "&": Sk.Tokenizer.Tokens.T_AMPER,
        "<": Sk.Tokenizer.Tokens.T_LESS,
        ">": Sk.Tokenizer.Tokens.T_GREATER,
        "=": Sk.Tokenizer.Tokens.T_EQUAL,
        ".": Sk.Tokenizer.Tokens.T_DOT,
        "%": Sk.Tokenizer.Tokens.T_PERCENT,
        "`": Sk.Tokenizer.Tokens.T_BACKQUOTE,
        "{": Sk.Tokenizer.Tokens.T_LBRACE,
        "}": Sk.Tokenizer.Tokens.T_RBRACE,
        "@": Sk.Tokenizer.Tokens.T_AT,
        "==": Sk.Tokenizer.Tokens.T_EQEQUAL,
        "!=": Sk.Tokenizer.Tokens.T_NOTEQUAL,
        "<>": Sk.Tokenizer.Tokens.T_NOTEQUAL,
        "<=": Sk.Tokenizer.Tokens.T_LESSEQUAL,
        ">=": Sk.Tokenizer.Tokens.T_GREATEREQUAL,
        "~": Sk.Tokenizer.Tokens.T_TILDE,
        "^": Sk.Tokenizer.Tokens.T_CIRCUMFLEX,
        "<<": Sk.Tokenizer.Tokens.T_LEFTSHIFT,
        ">>": Sk.Tokenizer.Tokens.T_RIGHTSHIFT,
        "**": Sk.Tokenizer.Tokens.T_DOUBLESTAR,
        "+=": Sk.Tokenizer.Tokens.T_PLUSEQUAL,
        "-=": Sk.Tokenizer.Tokens.T_MINEQUAL,
        "*=": Sk.Tokenizer.Tokens.T_STAREQUAL,
        "/=": Sk.Tokenizer.Tokens.T_SLASHEQUAL,
        "%=": Sk.Tokenizer.Tokens.T_PERCENTEQUAL,
        "&=": Sk.Tokenizer.Tokens.T_AMPEREQUAL,
        "|=": Sk.Tokenizer.Tokens.T_VBAREQUAL,
        "^=": Sk.Tokenizer.Tokens.T_CIRCUMFLEXEQUAL,
        "<<=": Sk.Tokenizer.Tokens.T_LEFTSHIFTEQUAL,
        ">>=": Sk.Tokenizer.Tokens.T_RIGHTSHIFTEQUAL,
        "**=": Sk.Tokenizer.Tokens.T_DOUBLESTAREQUAL,
        "//": Sk.Tokenizer.Tokens.T_DOUBLESLASH,
        "//=": Sk.Tokenizer.Tokens.T_DOUBLESLASHEQUAL,
        "->": Sk.Tokenizer.Tokens.T_RARROW
    };
    Sk.ParseTables = {
        sym: {
            and_expr: 257,
            and_test: 258,
            arglist: 259,
            argument: 260,
            arith_expr: 261,
            assert_stmt: 262,
            atom: 263,
            augassign: 264,
            break_stmt: 265,
            classdef: 266,
            comp_op: 267,
            comparison: 268,
            compound_stmt: 269,
            continue_stmt: 270,
            decorated: 271,
            decorator: 272,
            decorators: 273,
            del_stmt: 274,
            dictmaker: 275,
            dotted_as_name: 276,
            dotted_as_names: 277,
            dotted_name: 278,
            encoding_decl: 279,
            eval_input: 280,
            except_clause: 281,
            exec_stmt: 282,
            expr: 283,
            expr_stmt: 284,
            exprlist: 285,
            factor: 286,
            file_input: 287,
            flow_stmt: 288,
            for_stmt: 289,
            fpdef: 290,
            fplist: 291,
            funcdef: 292,
            gen_for: 293,
            gen_if: 294,
            gen_iter: 295,
            global_stmt: 296,
            if_stmt: 297,
            import_as_name: 298,
            import_as_names: 299,
            import_from: 300,
            import_name: 301,
            import_stmt: 302,
            lambdef: 303,
            list_for: 304,
            list_if: 305,
            list_iter: 306,
            listmaker: 307,
            not_test: 308,
            old_lambdef: 309,
            old_test: 310,
            or_test: 311,
            parameters: 312,
            pass_stmt: 313,
            power: 314,
            print_stmt: 315,
            raise_stmt: 316,
            return_stmt: 317,
            shift_expr: 318,
            simple_stmt: 319,
            single_input: 256,
            sliceop: 320,
            small_stmt: 321,
            stmt: 322,
            subscript: 323,
            subscriptlist: 324,
            suite: 325,
            term: 326,
            test: 327,
            testlist: 328,
            testlist1: 329,
            testlist_gexp: 330,
            testlist_safe: 331,
            trailer: 332,
            try_stmt: 333,
            varargslist: 334,
            while_stmt: 335,
            with_stmt: 336,
            with_var: 337,
            xor_expr: 338,
            yield_expr: 339,
            yield_stmt: 340
        },
        number2symbol: {
            256: "single_input",
            257: "and_expr",
            258: "and_test",
            259: "arglist",
            260: "argument",
            261: "arith_expr",
            262: "assert_stmt",
            263: "atom",
            264: "augassign",
            265: "break_stmt",
            266: "classdef",
            267: "comp_op",
            268: "comparison",
            269: "compound_stmt",
            270: "continue_stmt",
            271: "decorated",
            272: "decorator",
            273: "decorators",
            274: "del_stmt",
            275: "dictmaker",
            276: "dotted_as_name",
            277: "dotted_as_names",
            278: "dotted_name",
            279: "encoding_decl",
            280: "eval_input",
            281: "except_clause",
            282: "exec_stmt",
            283: "expr",
            284: "expr_stmt",
            285: "exprlist",
            286: "factor",
            287: "file_input",
            288: "flow_stmt",
            289: "for_stmt",
            290: "fpdef",
            291: "fplist",
            292: "funcdef",
            293: "gen_for",
            294: "gen_if",
            295: "gen_iter",
            296: "global_stmt",
            297: "if_stmt",
            298: "import_as_name",
            299: "import_as_names",
            300: "import_from",
            301: "import_name",
            302: "import_stmt",
            303: "lambdef",
            304: "list_for",
            305: "list_if",
            306: "list_iter",
            307: "listmaker",
            308: "not_test",
            309: "old_lambdef",
            310: "old_test",
            311: "or_test",
            312: "parameters",
            313: "pass_stmt",
            314: "power",
            315: "print_stmt",
            316: "raise_stmt",
            317: "return_stmt",
            318: "shift_expr",
            319: "simple_stmt",
            320: "sliceop",
            321: "small_stmt",
            322: "stmt",
            323: "subscript",
            324: "subscriptlist",
            325: "suite",
            326: "term",
            327: "test",
            328: "testlist",
            329: "testlist1",
            330: "testlist_gexp",
            331: "testlist_safe",
            332: "trailer",
            333: "try_stmt",
            334: "varargslist",
            335: "while_stmt",
            336: "with_stmt",
            337: "with_var",
            338: "xor_expr",
            339: "yield_expr",
            340: "yield_stmt"
        },
        dfas: {
            256: [
                [
                    [
                        [1, 1],
                        [2, 1],
                        [3, 2]
                    ],
                    [
                        [0, 1]
                    ],
                    [
                        [2, 1]
                    ]
                ], {
                    2: 1,
                    4: 1,
                    5: 1,
                    6: 1,
                    7: 1,
                    8: 1,
                    9: 1,
                    10: 1,
                    11: 1,
                    12: 1,
                    13: 1,
                    14: 1,
                    15: 1,
                    16: 1,
                    17: 1,
                    18: 1,
                    19: 1,
                    20: 1,
                    21: 1,
                    22: 1,
                    23: 1,
                    24: 1,
                    25: 1,
                    26: 1,
                    27: 1,
                    28: 1,
                    29: 1,
                    30: 1,
                    31: 1,
                    32: 1,
                    33: 1,
                    34: 1,
                    35: 1,
                    36: 1
                }],
            257: [
                [
                    [
                        [37, 1]
                    ],
                    [
                        [38, 0],
                        [0, 1]
                    ]
                ], {
                    6: 1,
                    8: 1,
                    9: 1,
                    11: 1,
                    13: 1,
                    17: 1,
                    20: 1,
                    24: 1,
                    28: 1,
                    35: 1
                }],
            258: [
                [
                    [
                        [39, 1]
                    ],
                    [
                        [40, 0],
                        [0, 1]
                    ]
                ], {
                    6: 1,
                    7: 1,
                    8: 1,
                    9: 1,
                    11: 1,
                    13: 1,
                    17: 1,
                    20: 1,
                    24: 1,
                    28: 1,
                    35: 1
                }],
            259: [
                [
                    [
                        [41, 1],
                        [42, 2],
                        [43, 3]
                    ],
                    [
                        [44, 4]
                    ],
                    [
                        [45, 5],
                        [0, 2]
                    ],
                    [
                        [44,
                        6]
                    ],
                    [
                        [45, 7],
                        [0, 4]
                    ],
                    [
                        [41, 1],
                        [42, 2],
                        [43, 3],
                        [0, 5]
                    ],
                    [
                        [0, 6]
                    ],
                    [
                        [42, 4],
                        [43, 3]
                    ]
                ], {
                    6: 1,
                    7: 1,
                    8: 1,
                    9: 1,
                    11: 1,
                    13: 1,
                    17: 1,
                    20: 1,
                    24: 1,
                    28: 1,
                    35: 1,
                    36: 1,
                    41: 1,
                    43: 1
                }],
            260: [
                [
                    [
                        [44, 1]
                    ],
                    [
                        [46, 2],
                        [47, 3],
                        [0, 1]
                    ],
                    [
                        [0, 2]
                    ],
                    [
                        [44, 2]
                    ]
                ], {
                    6: 1,
                    7: 1,
                    8: 1,
                    9: 1,
                    11: 1,
                    13: 1,
                    17: 1,
                    20: 1,
                    24: 1,
                    28: 1,
                    35: 1,
                    36: 1
                }],
            261: [
                [
                    [
                        [48, 1]
                    ],
                    [
                        [24, 0],
                        [35, 0],
                        [0, 1]
                    ]
                ], {
                    6: 1,
                    8: 1,
                    9: 1,
                    11: 1,
                    13: 1,
                    17: 1,
                    20: 1,
                    24: 1,
                    28: 1,
                    35: 1
                }],
            262: [
                [
                    [
                        [19, 1]
                    ],
                    [
                        [44, 2]
                    ],
                    [
                        [45, 3],
                        [0, 2]
                    ],
                    [
                        [44, 4]
                    ],
                    [
                        [0, 4]
                    ]
                ], {
                    19: 1
                }],
            263: [
                [
                    [
                        [17, 1],
                        [8, 2],
                        [9, 5],
                        [28, 4],
                        [11, 3],
                        [13, 6],
                        [20, 2]
                    ],
                    [
                        [17, 1],
                        [0, 1]
                    ],
                    [
                        [0, 2]
                    ],
                    [
                        [49, 7],
                        [50, 2]
                    ],
                    [
                        [51, 2],
                        [52, 8],
                        [53, 8]
                    ],
                    [
                        [54, 9],
                        [55, 2]
                    ],
                    [
                        [56, 10]
                    ],
                    [
                        [50, 2]
                    ],
                    [
                        [51, 2]
                    ],
                    [
                        [55, 2]
                    ],
                    [
                        [13, 2]
                    ]
                ], {
                    8: 1,
                    9: 1,
                    11: 1,
                    13: 1,
                    17: 1,
                    20: 1,
                    28: 1
                }],
            264: [
                [
                    [
                        [57, 1],
                        [58, 1],
                        [59, 1],
                        [60, 1],
                        [61, 1],
                        [62, 1],
                        [63, 1],
                        [64, 1],
                        [65, 1],
                        [66, 1],
                        [67, 1],
                        [68, 1]
                    ],
                    [
                        [0, 1]
                    ]
                ], {
                    57: 1,
                    58: 1,
                    59: 1,
                    60: 1,
                    61: 1,
                    62: 1,
                    63: 1,
                    64: 1,
                    65: 1,
                    66: 1,
                    67: 1,
                    68: 1
                }],
            265: [
                [
                    [
                        [31, 1]
                    ],
                    [
                        [0, 1]
                    ]
                ], {
                    31: 1
                }],
            266: [
                [
                    [
                        [10, 1]
                    ],
                    [
                        [20, 2]
                    ],
                    [
                        [69, 3],
                        [28, 4]
                    ],
                    [
                        [70, 5]
                    ],
                    [
                        [51, 6],
                        [71, 7]
                    ],
                    [
                        [0, 5]
                    ],
                    [
                        [69, 3]
                    ],
                    [
                        [51, 6]
                    ]
                ], {
                    10: 1
                }],
            267: [
                [
                    [
                        [72, 1],
                        [73, 1],
                        [7, 2],
                        [74, 1],
                        [72, 1],
                        [75, 1],
                        [76, 1],
                        [77, 3],
                        [78, 1],
                        [79, 1]
                    ],
                    [
                        [0, 1]
                    ],
                    [
                        [75, 1]
                    ],
                    [
                        [7, 1],
                        [0, 3]
                    ]
                ], {
                    7: 1,
                    72: 1,
                    73: 1,
                    74: 1,
                    75: 1,
                    76: 1,
                    77: 1,
                    78: 1,
                    79: 1
                }],
            268: [
                [
                    [
                        [80, 1]
                    ],
                    [
                        [81, 0],
                        [0, 1]
                    ]
                ], {
                    6: 1,
                    8: 1,
                    9: 1,
                    11: 1,
                    13: 1,
                    17: 1,
                    20: 1,
                    24: 1,
                    28: 1,
                    35: 1
                }],
            269: [
                [
                    [
                        [82, 1],
                        [83, 1],
                        [84, 1],
                        [85, 1],
                        [86, 1],
                        [87, 1],
                        [88, 1],
                        [89, 1]
                    ],
                    [
                        [0, 1]
                    ]
                ], {
                    4: 1,
                    10: 1,
                    14: 1,
                    16: 1,
                    27: 1,
                    30: 1,
                    33: 1,
                    34: 1
                }],
            270: [
                [
                    [
                        [32, 1]
                    ],
                    [
                        [0, 1]
                    ]
                ], {
                    32: 1
                }],
            271: [
                [
                    [
                        [90, 1]
                    ],
                    [
                        [88, 2],
                        [85, 2]
                    ],
                    [
                        [0, 2]
                    ]
                ], {
                    33: 1
                }],
            272: [
                [
                    [
                        [33, 1]
                    ],
                    [
                        [91, 2]
                    ],
                    [
                        [28, 4],
                        [2, 3]
                    ],
                    [
                        [0, 3]
                    ],
                    [
                        [51, 5],
                        [92, 6]
                    ],
                    [
                        [2, 3]
                    ],
                    [
                        [51, 5]
                    ]
                ], {
                    33: 1
                }],
            273: [
                [
                    [
                        [93, 1]
                    ],
                    [
                        [93, 1],
                        [0, 1]
                    ]
                ], {
                    33: 1
                }],
            274: [
                [
                    [
                        [21, 1]
                    ],
                    [
                        [94, 2]
                    ],
                    [
                        [0,
                        2]
                    ]
                ], {
                    21: 1
                }],
            275: [
                [
                    [
                        [44, 1]
                    ],
                    [
                        [69, 2]
                    ],
                    [
                        [44, 3]
                    ],
                    [
                        [45, 4],
                        [0, 3]
                    ],
                    [
                        [44, 1],
                        [0, 4]
                    ]
                ], {
                    6: 1,
                    7: 1,
                    8: 1,
                    9: 1,
                    11: 1,
                    13: 1,
                    17: 1,
                    20: 1,
                    24: 1,
                    28: 1,
                    35: 1,
                    36: 1
                }],
            276: [
                [
                    [
                        [91, 1]
                    ],
                    [
                        [95, 2],
                        [0, 1]
                    ],
                    [
                        [20, 3]
                    ],
                    [
                        [0, 3]
                    ]
                ], {
                    20: 1
                }],
            277: [
                [
                    [
                        [96, 1]
                    ],
                    [
                        [45, 0],
                        [0, 1]
                    ]
                ], {
                    20: 1
                }],
            278: [
                [
                    [
                        [20, 1]
                    ],
                    [
                        [97, 0],
                        [0, 1]
                    ]
                ], {
                    20: 1
                }],
            279: [
                [
                    [
                        [20, 1]
                    ],
                    [
                        [0, 1]
                    ]
                ], {
                    20: 1
                }],
            280: [
                [
                    [
                        [71, 1]
                    ],
                    [
                        [2, 1],
                        [98, 2]
                    ],
                    [
                        [0, 2]
                    ]
                ], {
                    6: 1,
                    7: 1,
                    8: 1,
                    9: 1,
                    11: 1,
                    13: 1,
                    17: 1,
                    20: 1,
                    24: 1,
                    28: 1,
                    35: 1,
                    36: 1
                }],
            281: [
                [
                    [
                        [99, 1]
                    ],
                    [
                        [44, 2],
                        [0, 1]
                    ],
                    [
                        [95, 3],
                        [45, 3],
                        [0, 2]
                    ],
                    [
                        [44, 4]
                    ],
                    [
                        [0, 4]
                    ]
                ], {
                    99: 1
                }],
            282: [
                [
                    [
                        [15, 1]
                    ],
                    [
                        [80, 2]
                    ],
                    [
                        [75, 3],
                        [0, 2]
                    ],
                    [
                        [44, 4]
                    ],
                    [
                        [45, 5],
                        [0, 4]
                    ],
                    [
                        [44, 6]
                    ],
                    [
                        [0, 6]
                    ]
                ], {
                    15: 1
                }],
            283: [
                [
                    [
                        [100, 1]
                    ],
                    [
                        [101, 0],
                        [0, 1]
                    ]
                ], {
                    6: 1,
                    8: 1,
                    9: 1,
                    11: 1,
                    13: 1,
                    17: 1,
                    20: 1,
                    24: 1,
                    28: 1,
                    35: 1
                }],
            284: [
                [
                    [
                        [71, 1]
                    ],
                    [
                        [102, 2],
                        [47, 3],
                        [0, 1]
                    ],
                    [
                        [71, 4],
                        [53, 4]
                    ],
                    [
                        [71, 5],
                        [53, 5]
                    ],
                    [
                        [0, 4]
                    ],
                    [
                        [47, 3],
                        [0, 5]
                    ]
                ], {
                    6: 1,
                    7: 1,
                    8: 1,
                    9: 1,
                    11: 1,
                    13: 1,
                    17: 1,
                    20: 1,
                    24: 1,
                    28: 1,
                    35: 1,
                    36: 1
                }],
            285: [
                [
                    [
                        [80, 1]
                    ],
                    [
                        [45, 2],
                        [0, 1]
                    ],
                    [
                        [80, 1],
                        [0, 2]
                    ]
                ], {
                    6: 1,
                    8: 1,
                    9: 1,
                    11: 1,
                    13: 1,
                    17: 1,
                    20: 1,
                    24: 1,
                    28: 1,
                    35: 1
                }],
            286: [
                [
                    [
                        [103, 2],
                        [24, 1],
                        [6, 1],
                        [35, 1]
                    ],
                    [
                        [104, 2]
                    ],
                    [
                        [0, 2]
                    ]
                ], {
                    6: 1,
                    8: 1,
                    9: 1,
                    11: 1,
                    13: 1,
                    17: 1,
                    20: 1,
                    24: 1,
                    28: 1,
                    35: 1
                }],
            287: [
                [
                    [
                        [2, 0],
                        [98, 1],
                        [105, 0]
                    ],
                    [
                        [0, 1]
                    ]
                ], {
                    2: 1,
                    4: 1,
                    5: 1,
                    6: 1,
                    7: 1,
                    8: 1,
                    9: 1,
                    10: 1,
                    11: 1,
                    12: 1,
                    13: 1,
                    14: 1,
                    15: 1,
                    16: 1,
                    17: 1,
                    18: 1,
                    19: 1,
                    20: 1,
                    21: 1,
                    22: 1,
                    23: 1,
                    24: 1,
                    25: 1,
                    26: 1,
                    27: 1,
                    28: 1,
                    29: 1,
                    30: 1,
                    31: 1,
                    32: 1,
                    33: 1,
                    34: 1,
                    35: 1,
                    36: 1,
                    98: 1
                }],
            288: [
                [
                    [
                        [106, 1],
                        [107, 1],
                        [108, 1],
                        [109, 1],
                        [110, 1]
                    ],
                    [
                        [0, 1]
                    ]
                ], {
                    5: 1,
                    18: 1,
                    25: 1,
                    31: 1,
                    32: 1
                }],
            289: [
                [
                    [
                        [27, 1]
                    ],
                    [
                        [94, 2]
                    ],
                    [
                        [75, 3]
                    ],
                    [
                        [71, 4]
                    ],
                    [
                        [69, 5]
                    ],
                    [
                        [70, 6]
                    ],
                    [
                        [111, 7],
                        [0, 6]
                    ],
                    [
                        [69, 8]
                    ],
                    [
                        [70, 9]
                    ],
                    [
                        [0, 9]
                    ]
                ], {
                    27: 1
                }],
            290: [
                [
                    [
                        [28, 1],
                        [20, 2]
                    ],
                    [
                        [112, 3]
                    ],
                    [
                        [0, 2]
                    ],
                    [
                        [51, 2]
                    ]
                ], {
                    20: 1,
                    28: 1
                }],
            291: [
                [
                    [
                        [113, 1]
                    ],
                    [
                        [45, 2],
                        [0, 1]
                    ],
                    [
                        [113,
                        1],
                        [0, 2]
                    ]
                ], {
                    20: 1,
                    28: 1
                }],
            292: [
                [
                    [
                        [4, 1]
                    ],
                    [
                        [20, 2]
                    ],
                    [
                        [114, 3]
                    ],
                    [
                        [69, 4]
                    ],
                    [
                        [70, 5]
                    ],
                    [
                        [0, 5]
                    ]
                ], {
                    4: 1
                }],
            293: [
                [
                    [
                        [27, 1]
                    ],
                    [
                        [94, 2]
                    ],
                    [
                        [75, 3]
                    ],
                    [
                        [115, 4]
                    ],
                    [
                        [116, 5],
                        [0, 4]
                    ],
                    [
                        [0, 5]
                    ]
                ], {
                    27: 1
                }],
            294: [
                [
                    [
                        [30, 1]
                    ],
                    [
                        [117, 2]
                    ],
                    [
                        [116, 3],
                        [0, 2]
                    ],
                    [
                        [0, 3]
                    ]
                ], {
                    30: 1
                }],
            295: [
                [
                    [
                        [46, 1],
                        [118, 1]
                    ],
                    [
                        [0, 1]
                    ]
                ], {
                    27: 1,
                    30: 1
                }],
            296: [
                [
                    [
                        [26, 1]
                    ],
                    [
                        [20, 2]
                    ],
                    [
                        [45, 1],
                        [0, 2]
                    ]
                ], {
                    26: 1
                }],
            297: [
                [
                    [
                        [30, 1]
                    ],
                    [
                        [44, 2]
                    ],
                    [
                        [69, 3]
                    ],
                    [
                        [70, 4]
                    ],
                    [
                        [111, 5],
                        [119, 1],
                        [0, 4]
                    ],
                    [
                        [69, 6]
                    ],
                    [
                        [70, 7]
                    ],
                    [
                        [0, 7]
                    ]
                ], {
                    30: 1
                }],
            298: [
                [
                    [
                        [20, 1]
                    ],
                    [
                        [95, 2],
                        [0, 1]
                    ],
                    [
                        [20, 3]
                    ],
                    [
                        [0, 3]
                    ]
                ], {
                    20: 1
                }],
            299: [
                [
                    [
                        [120, 1]
                    ],
                    [
                        [45, 2],
                        [0,
                        1]
                    ],
                    [
                        [120, 1],
                        [0, 2]
                    ]
                ], {
                    20: 1
                }],
            300: [
                [
                    [
                        [29, 1]
                    ],
                    [
                        [91, 2],
                        [97, 3]
                    ],
                    [
                        [23, 4]
                    ],
                    [
                        [91, 2],
                        [23, 4],
                        [97, 3]
                    ],
                    [
                        [121, 5],
                        [41, 5],
                        [28, 6]
                    ],
                    [
                        [0, 5]
                    ],
                    [
                        [121, 7]
                    ],
                    [
                        [51, 5]
                    ]
                ], {
                    29: 1
                }],
            301: [
                [
                    [
                        [23, 1]
                    ],
                    [
                        [122, 2]
                    ],
                    [
                        [0, 2]
                    ]
                ], {
                    23: 1
                }],
            302: [
                [
                    [
                        [123, 1],
                        [124, 1]
                    ],
                    [
                        [0, 1]
                    ]
                ], {
                    23: 1,
                    29: 1
                }],
            303: [
                [
                    [
                        [36, 1]
                    ],
                    [
                        [69, 2],
                        [125, 3]
                    ],
                    [
                        [44, 4]
                    ],
                    [
                        [69, 2]
                    ],
                    [
                        [0, 4]
                    ]
                ], {
                    36: 1
                }],
            304: [
                [
                    [
                        [27, 1]
                    ],
                    [
                        [94, 2]
                    ],
                    [
                        [75, 3]
                    ],
                    [
                        [126, 4]
                    ],
                    [
                        [127, 5],
                        [0, 4]
                    ],
                    [
                        [0, 5]
                    ]
                ], {
                    27: 1
                }],
            305: [
                [
                    [
                        [30, 1]
                    ],
                    [
                        [117, 2]
                    ],
                    [
                        [127, 3],
                        [0, 2]
                    ],
                    [
                        [0, 3]
                    ]
                ], {
                    30: 1
                }],
            306: [
                [
                    [
                        [128, 1],
                        [129, 1]
                    ],
                    [
                        [0, 1]
                    ]
                ], {
                    27: 1,
                    30: 1
                }],
            307: [
                [
                    [
                        [44, 1]
                    ],
                    [
                        [128, 2],
                        [45, 3],
                        [0, 1]
                    ],
                    [
                        [0, 2]
                    ],
                    [
                        [44, 4],
                        [0, 3]
                    ],
                    [
                        [45, 3],
                        [0, 4]
                    ]
                ], {
                    6: 1,
                    7: 1,
                    8: 1,
                    9: 1,
                    11: 1,
                    13: 1,
                    17: 1,
                    20: 1,
                    24: 1,
                    28: 1,
                    35: 1,
                    36: 1
                }],
            308: [
                [
                    [
                        [7, 1],
                        [130, 2]
                    ],
                    [
                        [39, 2]
                    ],
                    [
                        [0, 2]
                    ]
                ], {
                    6: 1,
                    7: 1,
                    8: 1,
                    9: 1,
                    11: 1,
                    13: 1,
                    17: 1,
                    20: 1,
                    24: 1,
                    28: 1,
                    35: 1
                }],
            309: [
                [
                    [
                        [36, 1]
                    ],
                    [
                        [69, 2],
                        [125, 3]
                    ],
                    [
                        [117, 4]
                    ],
                    [
                        [69, 2]
                    ],
                    [
                        [0, 4]
                    ]
                ], {
                    36: 1
                }],
            310: [
                [
                    [
                        [131, 1],
                        [115, 1]
                    ],
                    [
                        [0, 1]
                    ]
                ], {
                    6: 1,
                    7: 1,
                    8: 1,
                    9: 1,
                    11: 1,
                    13: 1,
                    17: 1,
                    20: 1,
                    24: 1,
                    28: 1,
                    35: 1,
                    36: 1
                }],
            311: [
                [
                    [
                        [132, 1]
                    ],
                    [
                        [133, 0],
                        [0, 1]
                    ]
                ], {
                    6: 1,
                    7: 1,
                    8: 1,
                    9: 1,
                    11: 1,
                    13: 1,
                    17: 1,
                    20: 1,
                    24: 1,
                    28: 1,
                    35: 1
                }],
            312: [
                [
                    [
                        [28, 1]
                    ],
                    [
                        [51, 2],
                        [125, 3]
                    ],
                    [
                        [0, 2]
                    ],
                    [
                        [51, 2]
                    ]
                ], {
                    28: 1
                }],
            313: [
                [
                    [
                        [22, 1]
                    ],
                    [
                        [0, 1]
                    ]
                ], {
                    22: 1
                }],
            314: [
                [
                    [
                        [134, 1]
                    ],
                    [
                        [135, 1],
                        [43, 2],
                        [0, 1]
                    ],
                    [
                        [104, 3]
                    ],
                    [
                        [0, 3]
                    ]
                ], {
                    8: 1,
                    9: 1,
                    11: 1,
                    13: 1,
                    17: 1,
                    20: 1,
                    28: 1
                }],
            315: [
                [
                    [
                        [12, 1]
                    ],
                    [
                        [44, 2],
                        [136, 3],
                        [0, 1]
                    ],
                    [
                        [45, 4],
                        [0, 2]
                    ],
                    [
                        [44, 5]
                    ],
                    [
                        [44, 2],
                        [0, 4]
                    ],
                    [
                        [45, 6],
                        [0, 5]
                    ],
                    [
                        [44, 7]
                    ],
                    [
                        [45, 8],
                        [0, 7]
                    ],
                    [
                        [44, 7],
                        [0, 8]
                    ]
                ], {
                    12: 1
                }],
            316: [
                [
                    [
                        [5, 1]
                    ],
                    [
                        [44, 2],
                        [0, 1]
                    ],
                    [
                        [45, 3],
                        [0, 2]
                    ],
                    [
                        [44, 4]
                    ],
                    [
                        [45, 5],
                        [0, 4]
                    ],
                    [
                        [44, 6]
                    ],
                    [
                        [0, 6]
                    ]
                ], {
                    5: 1
                }],
            317: [
                [
                    [
                        [18, 1]
                    ],
                    [
                        [71, 2],
                        [0, 1]
                    ],
                    [
                        [0, 2]
                    ]
                ], {
                    18: 1
                }],
            318: [
                [
                    [
                        [137, 1]
                    ],
                    [
                        [136, 0],
                        [138, 0],
                        [0, 1]
                    ]
                ], {
                    6: 1,
                    8: 1,
                    9: 1,
                    11: 1,
                    13: 1,
                    17: 1,
                    20: 1,
                    24: 1,
                    28: 1,
                    35: 1
                }],
            319: [
                [
                    [
                        [139, 1]
                    ],
                    [
                        [2, 2],
                        [140, 3]
                    ],
                    [
                        [0, 2]
                    ],
                    [
                        [139, 1],
                        [2, 2]
                    ]
                ], {
                    5: 1,
                    6: 1,
                    7: 1,
                    8: 1,
                    9: 1,
                    11: 1,
                    12: 1,
                    13: 1,
                    15: 1,
                    17: 1,
                    18: 1,
                    19: 1,
                    20: 1,
                    21: 1,
                    22: 1,
                    23: 1,
                    24: 1,
                    25: 1,
                    26: 1,
                    28: 1,
                    29: 1,
                    31: 1,
                    32: 1,
                    35: 1,
                    36: 1
                }],
            320: [
                [
                    [
                        [69, 1]
                    ],
                    [
                        [44, 2],
                        [0, 1]
                    ],
                    [
                        [0, 2]
                    ]
                ], {
                    69: 1
                }],
            321: [
                [
                    [
                        [141, 1],
                        [142, 1],
                        [143, 1],
                        [144, 1],
                        [145, 1],
                        [146, 1],
                        [147, 1],
                        [148, 1],
                        [149, 1]
                    ],
                    [
                        [0, 1]
                    ]
                ], {
                    5: 1,
                    6: 1,
                    7: 1,
                    8: 1,
                    9: 1,
                    11: 1,
                    12: 1,
                    13: 1,
                    15: 1,
                    17: 1,
                    18: 1,
                    19: 1,
                    20: 1,
                    21: 1,
                    22: 1,
                    23: 1,
                    24: 1,
                    25: 1,
                    26: 1,
                    28: 1,
                    29: 1,
                    31: 1,
                    32: 1,
                    35: 1,
                    36: 1
                }],
            322: [
                [
                    [
                        [1, 1],
                        [3, 1]
                    ],
                    [
                        [0, 1]
                    ]
                ], {
                    4: 1,
                    5: 1,
                    6: 1,
                    7: 1,
                    8: 1,
                    9: 1,
                    10: 1,
                    11: 1,
                    12: 1,
                    13: 1,
                    14: 1,
                    15: 1,
                    16: 1,
                    17: 1,
                    18: 1,
                    19: 1,
                    20: 1,
                    21: 1,
                    22: 1,
                    23: 1,
                    24: 1,
                    25: 1,
                    26: 1,
                    27: 1,
                    28: 1,
                    29: 1,
                    30: 1,
                    31: 1,
                    32: 1,
                    33: 1,
                    34: 1,
                    35: 1,
                    36: 1
                }],
            323: [
                [
                    [
                        [44, 1],
                        [69, 2],
                        [97, 3]
                    ],
                    [
                        [69, 2],
                        [0, 1]
                    ],
                    [
                        [44, 4],
                        [150, 5],
                        [0, 2]
                    ],
                    [
                        [97, 6]
                    ],
                    [
                        [150, 5],
                        [0, 4]
                    ],
                    [
                        [0, 5]
                    ],
                    [
                        [97, 5]
                    ]
                ], {
                    6: 1,
                    7: 1,
                    8: 1,
                    9: 1,
                    11: 1,
                    13: 1,
                    17: 1,
                    20: 1,
                    24: 1,
                    28: 1,
                    35: 1,
                    36: 1,
                    69: 1,
                    97: 1
                }],
            324: [
                [
                    [
                        [151, 1]
                    ],
                    [
                        [45, 2],
                        [0, 1]
                    ],
                    [
                        [151, 1],
                        [0, 2]
                    ]
                ], {
                    6: 1,
                    7: 1,
                    8: 1,
                    9: 1,
                    11: 1,
                    13: 1,
                    17: 1,
                    20: 1,
                    24: 1,
                    28: 1,
                    35: 1,
                    36: 1,
                    69: 1,
                    97: 1
                }],
            325: [
                [
                    [
                        [1, 1],
                        [2, 2]
                    ],
                    [
                        [0, 1]
                    ],
                    [
                        [152, 3]
                    ],
                    [
                        [105, 4]
                    ],
                    [
                        [153, 1],
                        [105, 4]
                    ]
                ], {
                    2: 1,
                    5: 1,
                    6: 1,
                    7: 1,
                    8: 1,
                    9: 1,
                    11: 1,
                    12: 1,
                    13: 1,
                    15: 1,
                    17: 1,
                    18: 1,
                    19: 1,
                    20: 1,
                    21: 1,
                    22: 1,
                    23: 1,
                    24: 1,
                    25: 1,
                    26: 1,
                    28: 1,
                    29: 1,
                    31: 1,
                    32: 1,
                    35: 1,
                    36: 1
                }],
            326: [
                [
                    [
                        [104, 1]
                    ],
                    [
                        [154, 0],
                        [41, 0],
                        [155, 0],
                        [156, 0],
                        [0, 1]
                    ]
                ], {
                    6: 1,
                    8: 1,
                    9: 1,
                    11: 1,
                    13: 1,
                    17: 1,
                    20: 1,
                    24: 1,
                    28: 1,
                    35: 1
                }],
            327: [
                [
                    [
                        [115, 1],
                        [157, 2]
                    ],
                    [
                        [30, 3],
                        [0, 1]
                    ],
                    [
                        [0, 2]
                    ],
                    [
                        [115, 4]
                    ],
                    [
                        [111, 5]
                    ],
                    [
                        [44, 2]
                    ]
                ], {
                    6: 1,
                    7: 1,
                    8: 1,
                    9: 1,
                    11: 1,
                    13: 1,
                    17: 1,
                    20: 1,
                    24: 1,
                    28: 1,
                    35: 1,
                    36: 1
                }],
            328: [
                [
                    [
                        [44, 1]
                    ],
                    [
                        [45, 2],
                        [0, 1]
                    ],
                    [
                        [44, 1],
                        [0, 2]
                    ]
                ], {
                    6: 1,
                    7: 1,
                    8: 1,
                    9: 1,
                    11: 1,
                    13: 1,
                    17: 1,
                    20: 1,
                    24: 1,
                    28: 1,
                    35: 1,
                    36: 1
                }],
            329: [
                [
                    [
                        [44, 1]
                    ],
                    [
                        [45, 0],
                        [0, 1]
                    ]
                ], {
                    6: 1,
                    7: 1,
                    8: 1,
                    9: 1,
                    11: 1,
                    13: 1,
                    17: 1,
                    20: 1,
                    24: 1,
                    28: 1,
                    35: 1,
                    36: 1
                }],
            330: [
                [
                    [
                        [44, 1]
                    ],
                    [
                        [46, 2],
                        [45, 3],
                        [0, 1]
                    ],
                    [
                        [0, 2]
                    ],
                    [
                        [44, 4],
                        [0, 3]
                    ],
                    [
                        [45, 3],
                        [0, 4]
                    ]
                ], {
                    6: 1,
                    7: 1,
                    8: 1,
                    9: 1,
                    11: 1,
                    13: 1,
                    17: 1,
                    20: 1,
                    24: 1,
                    28: 1,
                    35: 1,
                    36: 1
                }],
            331: [
                [
                    [
                        [117, 1]
                    ],
                    [
                        [45, 2],
                        [0, 1]
                    ],
                    [
                        [117, 3]
                    ],
                    [
                        [45, 4],
                        [0, 3]
                    ],
                    [
                        [117, 3],
                        [0, 4]
                    ]
                ], {
                    6: 1,
                    7: 1,
                    8: 1,
                    9: 1,
                    11: 1,
                    13: 1,
                    17: 1,
                    20: 1,
                    24: 1,
                    28: 1,
                    35: 1,
                    36: 1
                }],
            332: [
                [
                    [
                        [28, 1],
                        [97, 2],
                        [11, 3]
                    ],
                    [
                        [51, 4],
                        [92, 5]
                    ],
                    [
                        [20, 4]
                    ],
                    [
                        [158, 6]
                    ],
                    [
                        [0, 4]
                    ],
                    [
                        [51, 4]
                    ],
                    [
                        [50, 4]
                    ]
                ], {
                    11: 1,
                    28: 1,
                    97: 1
                }],
            333: [
                [
                    [
                        [14, 1]
                    ],
                    [
                        [69, 2]
                    ],
                    [
                        [70, 3]
                    ],
                    [
                        [159, 4],
                        [160, 5]
                    ],
                    [
                        [69, 6]
                    ],
                    [
                        [69, 7]
                    ],
                    [
                        [70, 8]
                    ],
                    [
                        [70, 9]
                    ],
                    [
                        [159, 4],
                        [111, 10],
                        [160, 5],
                        [0, 8]
                    ],
                    [
                        [0, 9]
                    ],
                    [
                        [69, 11]
                    ],
                    [
                        [70, 12]
                    ],
                    [
                        [160, 5],
                        [0, 12]
                    ]
                ], {
                    14: 1
                }],
            334: [
                [
                    [
                        [41, 1],
                        [113, 2],
                        [43, 3]
                    ],
                    [
                        [20, 4]
                    ],
                    [
                        [47, 5],
                        [45, 6],
                        [0, 2]
                    ],
                    [
                        [20, 7]
                    ],
                    [
                        [45, 8],
                        [0, 4]
                    ],
                    [
                        [44, 9]
                    ],
                    [
                        [41, 1],
                        [113, 2],
                        [43, 3],
                        [0, 6]
                    ],
                    [
                        [0, 7]
                    ],
                    [
                        [43, 3]
                    ],
                    [
                        [45, 6],
                        [0, 9]
                    ]
                ], {
                    20: 1,
                    28: 1,
                    41: 1,
                    43: 1
                }],
            335: [
                [
                    [
                        [16, 1]
                    ],
                    [
                        [44, 2]
                    ],
                    [
                        [69, 3]
                    ],
                    [
                        [70, 4]
                    ],
                    [
                        [111, 5],
                        [0, 4]
                    ],
                    [
                        [69, 6]
                    ],
                    [
                        [70, 7]
                    ],
                    [
                        [0, 7]
                    ]
                ], {
                    16: 1
                }],
            336: [
                [
                    [
                        [34, 1]
                    ],
                    [
                        [44, 2]
                    ],
                    [
                        [69, 3],
                        [161, 4]
                    ],
                    [
                        [70, 5]
                    ],
                    [
                        [69, 3]
                    ],
                    [
                        [0, 5]
                    ]
                ], {
                    34: 1
                }],
            337: [
                [
                    [
                        [95, 1]
                    ],
                    [
                        [80, 2]
                    ],
                    [
                        [0, 2]
                    ]
                ], {
                    95: 1
                }],
            338: [
                [
                    [
                        [162,
                        1]
                    ],
                    [
                        [163, 0],
                        [0, 1]
                    ]
                ], {
                    6: 1,
                    8: 1,
                    9: 1,
                    11: 1,
                    13: 1,
                    17: 1,
                    20: 1,
                    24: 1,
                    28: 1,
                    35: 1
                }],
            339: [
                [
                    [
                        [25, 1]
                    ],
                    [
                        [71, 2],
                        [0, 1]
                    ],
                    [
                        [0, 2]
                    ]
                ], {
                    25: 1
                }],
            340: [
                [
                    [
                        [53, 1]
                    ],
                    [
                        [0, 1]
                    ]
                ], {
                    25: 1
                }]
        },
        states: [
            [
                [
                    [1, 1],
                    [2, 1],
                    [3, 2]
                ],
                [
                    [0, 1]
                ],
                [
                    [2, 1]
                ]
            ],
            [
                [
                    [37, 1]
                ],
                [
                    [38, 0],
                    [0, 1]
                ]
            ],
            [
                [
                    [39, 1]
                ],
                [
                    [40, 0],
                    [0, 1]
                ]
            ],
            [
                [
                    [41, 1],
                    [42, 2],
                    [43, 3]
                ],
                [
                    [44, 4]
                ],
                [
                    [45, 5],
                    [0, 2]
                ],
                [
                    [44, 6]
                ],
                [
                    [45, 7],
                    [0, 4]
                ],
                [
                    [41, 1],
                    [42, 2],
                    [43, 3],
                    [0, 5]
                ],
                [
                    [0, 6]
                ],
                [
                    [42, 4],
                    [43, 3]
                ]
            ],
            [
                [
                    [44, 1]
                ],
                [
                    [46, 2],
                    [47, 3],
                    [0, 1]
                ],
                [
                    [0, 2]
                ],
                [
                    [44, 2]
                ]
            ],
            [
                [
                    [48, 1]
                ],
                [
                    [24, 0],
                    [35, 0],
                    [0, 1]
                ]
            ],
            [
                [
                    [19, 1]
                ],
                [
                    [44, 2]
                ],
                [
                    [45, 3],
                    [0, 2]
                ],
                [
                    [44, 4]
                ],
                [
                    [0, 4]
                ]
            ],
            [
                [
                    [17, 1],
                    [8, 2],
                    [9, 5],
                    [28, 4],
                    [11, 3],
                    [13, 6],
                    [20, 2]
                ],
                [
                    [17, 1],
                    [0, 1]
                ],
                [
                    [0, 2]
                ],
                [
                    [49, 7],
                    [50, 2]
                ],
                [
                    [51, 2],
                    [52, 8],
                    [53, 8]
                ],
                [
                    [54, 9],
                    [55, 2]
                ],
                [
                    [56, 10]
                ],
                [
                    [50, 2]
                ],
                [
                    [51, 2]
                ],
                [
                    [55, 2]
                ],
                [
                    [13, 2]
                ]
            ],
            [
                [
                    [57, 1],
                    [58, 1],
                    [59, 1],
                    [60, 1],
                    [61, 1],
                    [62, 1],
                    [63, 1],
                    [64, 1],
                    [65, 1],
                    [66, 1],
                    [67, 1],
                    [68, 1]
                ],
                [
                    [0, 1]
                ]
            ],
            [
                [
                    [31, 1]
                ],
                [
                    [0, 1]
                ]
            ],
            [
                [
                    [10, 1]
                ],
                [
                    [20, 2]
                ],
                [
                    [69, 3],
                    [28, 4]
                ],
                [
                    [70, 5]
                ],
                [
                    [51, 6],
                    [71, 7]
                ],
                [
                    [0, 5]
                ],
                [
                    [69, 3]
                ],
                [
                    [51, 6]
                ]
            ],
            [
                [
                    [72, 1],
                    [73, 1],
                    [7, 2],
                    [74, 1],
                    [72, 1],
                    [75, 1],
                    [76, 1],
                    [77, 3],
                    [78, 1],
                    [79, 1]
                ],
                [
                    [0, 1]
                ],
                [
                    [75, 1]
                ],
                [
                    [7, 1],
                    [0, 3]
                ]
            ],
            [
                [
                    [80, 1]
                ],
                [
                    [81,
                    0],
                    [0, 1]
                ]
            ],
            [
                [
                    [82, 1],
                    [83, 1],
                    [84, 1],
                    [85, 1],
                    [86, 1],
                    [87, 1],
                    [88, 1],
                    [89, 1]
                ],
                [
                    [0, 1]
                ]
            ],
            [
                [
                    [32, 1]
                ],
                [
                    [0, 1]
                ]
            ],
            [
                [
                    [90, 1]
                ],
                [
                    [88, 2],
                    [85, 2]
                ],
                [
                    [0, 2]
                ]
            ],
            [
                [
                    [33, 1]
                ],
                [
                    [91, 2]
                ],
                [
                    [28, 4],
                    [2, 3]
                ],
                [
                    [0, 3]
                ],
                [
                    [51, 5],
                    [92, 6]
                ],
                [
                    [2, 3]
                ],
                [
                    [51, 5]
                ]
            ],
            [
                [
                    [93, 1]
                ],
                [
                    [93, 1],
                    [0, 1]
                ]
            ],
            [
                [
                    [21, 1]
                ],
                [
                    [94, 2]
                ],
                [
                    [0, 2]
                ]
            ],
            [
                [
                    [44, 1]
                ],
                [
                    [69, 2]
                ],
                [
                    [44, 3]
                ],
                [
                    [45, 4],
                    [0, 3]
                ],
                [
                    [44, 1],
                    [0, 4]
                ]
            ],
            [
                [
                    [91, 1]
                ],
                [
                    [95, 2],
                    [0, 1]
                ],
                [
                    [20, 3]
                ],
                [
                    [0, 3]
                ]
            ],
            [
                [
                    [96, 1]
                ],
                [
                    [45, 0],
                    [0, 1]
                ]
            ],
            [
                [
                    [20, 1]
                ],
                [
                    [97, 0],
                    [0, 1]
                ]
            ],
            [
                [
                    [20, 1]
                ],
                [
                    [0, 1]
                ]
            ],
            [
                [
                    [71, 1]
                ],
                [
                    [2, 1],
                    [98, 2]
                ],
                [
                    [0, 2]
                ]
            ],
            [
                [
                    [99, 1]
                ],
                [
                    [44, 2],
                    [0, 1]
                ],
                [
                    [95, 3],
                    [45, 3],
                    [0, 2]
                ],
                [
                    [44, 4]
                ],
                [
                    [0, 4]
                ]
            ],
            [
                [
                    [15, 1]
                ],
                [
                    [80, 2]
                ],
                [
                    [75, 3],
                    [0, 2]
                ],
                [
                    [44, 4]
                ],
                [
                    [45, 5],
                    [0, 4]
                ],
                [
                    [44, 6]
                ],
                [
                    [0, 6]
                ]
            ],
            [
                [
                    [100, 1]
                ],
                [
                    [101, 0],
                    [0, 1]
                ]
            ],
            [
                [
                    [71, 1]
                ],
                [
                    [102, 2],
                    [47, 3],
                    [0, 1]
                ],
                [
                    [71, 4],
                    [53, 4]
                ],
                [
                    [71, 5],
                    [53, 5]
                ],
                [
                    [0, 4]
                ],
                [
                    [47, 3],
                    [0, 5]
                ]
            ],
            [
                [
                    [80, 1]
                ],
                [
                    [45, 2],
                    [0, 1]
                ],
                [
                    [80, 1],
                    [0, 2]
                ]
            ],
            [
                [
                    [103, 2],
                    [24, 1],
                    [6, 1],
                    [35, 1]
                ],
                [
                    [104, 2]
                ],
                [
                    [0, 2]
                ]
            ],
            [
                [
                    [2, 0],
                    [98, 1],
                    [105, 0]
                ],
                [
                    [0, 1]
                ]
            ],
            [
                [
                    [106, 1],
                    [107, 1],
                    [108, 1],
                    [109, 1],
                    [110, 1]
                ],
                [
                    [0, 1]
                ]
            ],
            [
                [
                    [27, 1]
                ],
                [
                    [94, 2]
                ],
                [
                    [75, 3]
                ],
                [
                    [71, 4]
                ],
                [
                    [69, 5]
                ],
                [
                    [70, 6]
                ],
                [
                    [111, 7],
                    [0, 6]
                ],
                [
                    [69, 8]
                ],
                [
                    [70, 9]
                ],
                [
                    [0, 9]
                ]
            ],
            [
                [
                    [28,
                    1],
                    [20, 2]
                ],
                [
                    [112, 3]
                ],
                [
                    [0, 2]
                ],
                [
                    [51, 2]
                ]
            ],
            [
                [
                    [113, 1]
                ],
                [
                    [45, 2],
                    [0, 1]
                ],
                [
                    [113, 1],
                    [0, 2]
                ]
            ],
            [
                [
                    [4, 1]
                ],
                [
                    [20, 2]
                ],
                [
                    [114, 3]
                ],
                [
                    [69, 4]
                ],
                [
                    [70, 5]
                ],
                [
                    [0, 5]
                ]
            ],
            [
                [
                    [27, 1]
                ],
                [
                    [94, 2]
                ],
                [
                    [75, 3]
                ],
                [
                    [115, 4]
                ],
                [
                    [116, 5],
                    [0, 4]
                ],
                [
                    [0, 5]
                ]
            ],
            [
                [
                    [30, 1]
                ],
                [
                    [117, 2]
                ],
                [
                    [116, 3],
                    [0, 2]
                ],
                [
                    [0, 3]
                ]
            ],
            [
                [
                    [46, 1],
                    [118, 1]
                ],
                [
                    [0, 1]
                ]
            ],
            [
                [
                    [26, 1]
                ],
                [
                    [20, 2]
                ],
                [
                    [45, 1],
                    [0, 2]
                ]
            ],
            [
                [
                    [30, 1]
                ],
                [
                    [44, 2]
                ],
                [
                    [69, 3]
                ],
                [
                    [70, 4]
                ],
                [
                    [111, 5],
                    [119, 1],
                    [0, 4]
                ],
                [
                    [69, 6]
                ],
                [
                    [70, 7]
                ],
                [
                    [0, 7]
                ]
            ],
            [
                [
                    [20, 1]
                ],
                [
                    [95, 2],
                    [0, 1]
                ],
                [
                    [20, 3]
                ],
                [
                    [0, 3]
                ]
            ],
            [
                [
                    [120, 1]
                ],
                [
                    [45, 2],
                    [0, 1]
                ],
                [
                    [120, 1],
                    [0, 2]
                ]
            ],
            [
                [
                    [29, 1]
                ],
                [
                    [91, 2],
                    [97,
                    3]
                ],
                [
                    [23, 4]
                ],
                [
                    [91, 2],
                    [23, 4],
                    [97, 3]
                ],
                [
                    [121, 5],
                    [41, 5],
                    [28, 6]
                ],
                [
                    [0, 5]
                ],
                [
                    [121, 7]
                ],
                [
                    [51, 5]
                ]
            ],
            [
                [
                    [23, 1]
                ],
                [
                    [122, 2]
                ],
                [
                    [0, 2]
                ]
            ],
            [
                [
                    [123, 1],
                    [124, 1]
                ],
                [
                    [0, 1]
                ]
            ],
            [
                [
                    [36, 1]
                ],
                [
                    [69, 2],
                    [125, 3]
                ],
                [
                    [44, 4]
                ],
                [
                    [69, 2]
                ],
                [
                    [0, 4]
                ]
            ],
            [
                [
                    [27, 1]
                ],
                [
                    [94, 2]
                ],
                [
                    [75, 3]
                ],
                [
                    [126, 4]
                ],
                [
                    [127, 5],
                    [0, 4]
                ],
                [
                    [0, 5]
                ]
            ],
            [
                [
                    [30, 1]
                ],
                [
                    [117, 2]
                ],
                [
                    [127, 3],
                    [0, 2]
                ],
                [
                    [0, 3]
                ]
            ],
            [
                [
                    [128, 1],
                    [129, 1]
                ],
                [
                    [0, 1]
                ]
            ],
            [
                [
                    [44, 1]
                ],
                [
                    [128, 2],
                    [45, 3],
                    [0, 1]
                ],
                [
                    [0, 2]
                ],
                [
                    [44, 4],
                    [0, 3]
                ],
                [
                    [45, 3],
                    [0, 4]
                ]
            ],
            [
                [
                    [7, 1],
                    [130, 2]
                ],
                [
                    [39, 2]
                ],
                [
                    [0, 2]
                ]
            ],
            [
                [
                    [36, 1]
                ],
                [
                    [69, 2],
                    [125, 3]
                ],
                [
                    [117, 4]
                ],
                [
                    [69, 2]
                ],
                [
                    [0, 4]
                ]
            ],
            [
                [
                    [131,
                    1],
                    [115, 1]
                ],
                [
                    [0, 1]
                ]
            ],
            [
                [
                    [132, 1]
                ],
                [
                    [133, 0],
                    [0, 1]
                ]
            ],
            [
                [
                    [28, 1]
                ],
                [
                    [51, 2],
                    [125, 3]
                ],
                [
                    [0, 2]
                ],
                [
                    [51, 2]
                ]
            ],
            [
                [
                    [22, 1]
                ],
                [
                    [0, 1]
                ]
            ],
            [
                [
                    [134, 1]
                ],
                [
                    [135, 1],
                    [43, 2],
                    [0, 1]
                ],
                [
                    [104, 3]
                ],
                [
                    [0, 3]
                ]
            ],
            [
                [
                    [12, 1]
                ],
                [
                    [44, 2],
                    [136, 3],
                    [0, 1]
                ],
                [
                    [45, 4],
                    [0, 2]
                ],
                [
                    [44, 5]
                ],
                [
                    [44, 2],
                    [0, 4]
                ],
                [
                    [45, 6],
                    [0, 5]
                ],
                [
                    [44, 7]
                ],
                [
                    [45, 8],
                    [0, 7]
                ],
                [
                    [44, 7],
                    [0, 8]
                ]
            ],
            [
                [
                    [5, 1]
                ],
                [
                    [44, 2],
                    [0, 1]
                ],
                [
                    [45, 3],
                    [0, 2]
                ],
                [
                    [44, 4]
                ],
                [
                    [45, 5],
                    [0, 4]
                ],
                [
                    [44, 6]
                ],
                [
                    [0, 6]
                ]
            ],
            [
                [
                    [18, 1]
                ],
                [
                    [71, 2],
                    [0, 1]
                ],
                [
                    [0, 2]
                ]
            ],
            [
                [
                    [137, 1]
                ],
                [
                    [136, 0],
                    [138, 0],
                    [0, 1]
                ]
            ],
            [
                [
                    [139, 1]
                ],
                [
                    [2, 2],
                    [140, 3]
                ],
                [
                    [0, 2]
                ],
                [
                    [139, 1],
                    [2, 2]
                ]
            ],
            [
                [
                    [69,
                    1]
                ],
                [
                    [44, 2],
                    [0, 1]
                ],
                [
                    [0, 2]
                ]
            ],
            [
                [
                    [141, 1],
                    [142, 1],
                    [143, 1],
                    [144, 1],
                    [145, 1],
                    [146, 1],
                    [147, 1],
                    [148, 1],
                    [149, 1]
                ],
                [
                    [0, 1]
                ]
            ],
            [
                [
                    [1, 1],
                    [3, 1]
                ],
                [
                    [0, 1]
                ]
            ],
            [
                [
                    [44, 1],
                    [69, 2],
                    [97, 3]
                ],
                [
                    [69, 2],
                    [0, 1]
                ],
                [
                    [44, 4],
                    [150, 5],
                    [0, 2]
                ],
                [
                    [97, 6]
                ],
                [
                    [150, 5],
                    [0, 4]
                ],
                [
                    [0, 5]
                ],
                [
                    [97, 5]
                ]
            ],
            [
                [
                    [151, 1]
                ],
                [
                    [45, 2],
                    [0, 1]
                ],
                [
                    [151, 1],
                    [0, 2]
                ]
            ],
            [
                [
                    [1, 1],
                    [2, 2]
                ],
                [
                    [0, 1]
                ],
                [
                    [152, 3]
                ],
                [
                    [105, 4]
                ],
                [
                    [153, 1],
                    [105, 4]
                ]
            ],
            [
                [
                    [104, 1]
                ],
                [
                    [154, 0],
                    [41, 0],
                    [155, 0],
                    [156, 0],
                    [0, 1]
                ]
            ],
            [
                [
                    [115, 1],
                    [157, 2]
                ],
                [
                    [30, 3],
                    [0, 1]
                ],
                [
                    [0, 2]
                ],
                [
                    [115, 4]
                ],
                [
                    [111, 5]
                ],
                [
                    [44, 2]
                ]
            ],
            [
                [
                    [44, 1]
                ],
                [
                    [45, 2],
                    [0, 1]
                ],
                [
                    [44, 1],
                    [0, 2]
                ]
            ],
            [
                [
                    [44, 1]
                ],
                [
                    [45, 0],
                    [0, 1]
                ]
            ],
            [
                [
                    [44, 1]
                ],
                [
                    [46, 2],
                    [45, 3],
                    [0, 1]
                ],
                [
                    [0, 2]
                ],
                [
                    [44, 4],
                    [0, 3]
                ],
                [
                    [45, 3],
                    [0, 4]
                ]
            ],
            [
                [
                    [117, 1]
                ],
                [
                    [45, 2],
                    [0, 1]
                ],
                [
                    [117, 3]
                ],
                [
                    [45, 4],
                    [0, 3]
                ],
                [
                    [117, 3],
                    [0, 4]
                ]
            ],
            [
                [
                    [28, 1],
                    [97, 2],
                    [11, 3]
                ],
                [
                    [51, 4],
                    [92, 5]
                ],
                [
                    [20, 4]
                ],
                [
                    [158, 6]
                ],
                [
                    [0, 4]
                ],
                [
                    [51, 4]
                ],
                [
                    [50, 4]
                ]
            ],
            [
                [
                    [14, 1]
                ],
                [
                    [69, 2]
                ],
                [
                    [70, 3]
                ],
                [
                    [159, 4],
                    [160, 5]
                ],
                [
                    [69, 6]
                ],
                [
                    [69, 7]
                ],
                [
                    [70, 8]
                ],
                [
                    [70, 9]
                ],
                [
                    [159, 4],
                    [111, 10],
                    [160, 5],
                    [0, 8]
                ],
                [
                    [0, 9]
                ],
                [
                    [69, 11]
                ],
                [
                    [70, 12]
                ],
                [
                    [160, 5],
                    [0, 12]
                ]
            ],
            [
                [
                    [41, 1],
                    [113, 2],
                    [43, 3]
                ],
                [
                    [20, 4]
                ],
                [
                    [47, 5],
                    [45, 6],
                    [0, 2]
                ],
                [
                    [20, 7]
                ],
                [
                    [45, 8],
                    [0, 4]
                ],
                [
                    [44,
                    9]
                ],
                [
                    [41, 1],
                    [113, 2],
                    [43, 3],
                    [0, 6]
                ],
                [
                    [0, 7]
                ],
                [
                    [43, 3]
                ],
                [
                    [45, 6],
                    [0, 9]
                ]
            ],
            [
                [
                    [16, 1]
                ],
                [
                    [44, 2]
                ],
                [
                    [69, 3]
                ],
                [
                    [70, 4]
                ],
                [
                    [111, 5],
                    [0, 4]
                ],
                [
                    [69, 6]
                ],
                [
                    [70, 7]
                ],
                [
                    [0, 7]
                ]
            ],
            [
                [
                    [34, 1]
                ],
                [
                    [44, 2]
                ],
                [
                    [69, 3],
                    [161, 4]
                ],
                [
                    [70, 5]
                ],
                [
                    [69, 3]
                ],
                [
                    [0, 5]
                ]
            ],
            [
                [
                    [95, 1]
                ],
                [
                    [80, 2]
                ],
                [
                    [0, 2]
                ]
            ],
            [
                [
                    [162, 1]
                ],
                [
                    [163, 0],
                    [0, 1]
                ]
            ],
            [
                [
                    [25, 1]
                ],
                [
                    [71, 2],
                    [0, 1]
                ],
                [
                    [0, 2]
                ]
            ],
            [
                [
                    [53, 1]
                ],
                [
                    [0, 1]
                ]
            ]
        ],
        labels: [
            [0, "EMPTY"],
            [319, null],
            [4, null],
            [269, null],
            [1, "def"],
            [1, "raise"],
            [32, null],
            [1, "not"],
            [2, null],
            [26, null],
            [1, "class"],
            [9, null],
            [1, "print"],
            [25, null],
            [1, "try"],
            [1, "exec"],
            [1, "while"],
            [3, null],
            [1, "return"],
            [1, "assert"],
            [1, null],
            [1, "del"],
            [1, "pass"],
            [1, "import"],
            [15, null],
            [1, "yield"],
            [1, "global"],
            [1, "for"],
            [7, null],
            [1, "from"],
            [1, "if"],
            [1, "break"],
            [1, "continue"],
            [50, null],
            [1, "with"],
            [14, null],
            [1, "lambda"],
            [318, null],
            [19, null],
            [308, null],
            [1, "and"],
            [16, null],
            [260, null],
            [36, null],
            [327, null],
            [12, null],
            [293, null],
            [22, null],
            [326, null],
            [307, null],
            [10, null],
            [8, null],
            [330, null],
            [339, null],
            [275, null],
            [27, null],
            [329, null],
            [46, null],
            [39, null],
            [41, null],
            [47, null],
            [42, null],
            [43, null],
            [37, null],
            [44, null],
            [49, null],
            [40, null],
            [38, null],
            [45, null],
            [11, null],
            [325, null],
            [328, null],
            [29, null],
            [21, null],
            [28, null],
            [1, "in"],
            [30, null],
            [1, "is"],
            [31, null],
            [20, null],
            [283, null],
            [267, null],
            [333, null],
            [297, null],
            [289, null],
            [266, null],
            [336, null],
            [335, null],
            [292, null],
            [271, null],
            [273, null],
            [278, null],
            [259, null],
            [272, null],
            [285, null],
            [1, "as"],
            [276, null],
            [23, null],
            [0, null],
            [1, "except"],
            [338, null],
            [18, null],
            [264, null],
            [314, null],
            [286, null],
            [322, null],
            [265, null],
            [270, null],
            [316, null],
            [317, null],
            [340, null],
            [1, "else"],
            [291, null],
            [290, null],
            [312, null],
            [311, null],
            [295, null],
            [310, null],
            [294, null],
            [1, "elif"],
            [298, null],
            [299, null],
            [277, null],
            [301, null],
            [300, null],
            [334, null],
            [331, null],
            [306, null],
            [304, null],
            [305, null],
            [268, null],
            [309, null],
            [258, null],
            [1, "or"],
            [263, null],
            [332, null],
            [35, null],
            [261, null],
            [34, null],
            [321, null],
            [13, null],
            [288, null],
            [262, null],
            [284, null],
            [313, null],
            [315, null],
            [274, null],
            [282, null],
            [296, null],
            [302, null],
            [320, null],
            [323, null],
            [5, null],
            [6, null],
            [48, null],
            [17, null],
            [24, null],
            [303, null],
            [324, null],
            [281, null],
            [1, "finally"],
            [337, null],
            [257, null],
            [33, null]
        ],
        keywords: {
            and: 40,
            as: 95,
            assert: 19,
            "break": 31,
            "class": 10,
            "continue": 32,
            def: 4,
            del: 21,
            elif: 119,
            "else": 111,
            except: 99,
            exec: 15,
            "finally": 160,
            "for": 27,
            from: 29,
            global: 26,
            "if": 30,
            "import": 23,
            "in": 75,
            is: 77,
            lambda: 36,
            not: 7,
            or: 133,
            pass: 22,
            print: 12,
            raise: 5,
            "return": 18,
            "try": 14,
            "while": 16,
            "with": 34,
            yield: 25
        },
        tokens: {
            0: 98,
            1: 20,
            2: 8,
            3: 17,
            4: 2,
            5: 152,
            6: 153,
            7: 28,
            8: 51,
            9: 11,
            10: 50,
            11: 69,
            12: 45,
            13: 140,
            14: 35,
            15: 24,
            16: 41,
            17: 155,
            18: 101,
            19: 38,
            20: 79,
            21: 73,
            22: 47,
            23: 97,
            24: 156,
            25: 13,
            26: 9,
            27: 55,
            28: 74,
            29: 72,
            30: 76,
            31: 78,
            32: 6,
            33: 163,
            34: 138,
            35: 136,
            36: 43,
            37: 63,
            38: 67,
            39: 58,
            40: 66,
            41: 59,
            42: 61,
            43: 62,
            44: 64,
            45: 68,
            46: 57,
            47: 60,
            48: 154,
            49: 65,
            50: 33
        },
        start: 256
    };

    function Parser(a) {
        this.grammar = a;
        return this
    }
    Parser.prototype.setup = function (a) {
        a = a || this.grammar.start;
        this.stack = [{
            dfa: this.grammar.dfas[a],
            state: 0,
            node: {
                type: a,
                value: null,
                context: null,
                children: []
            }
        }];
        this.used_names = {}
    };

    function findInDfa(a, b) {
        for (var c = a.length; c--;) if (a[c][0] === b[0] && a[c][1] === b[1]) return true;
        return false
    }
    Parser.prototype.addtoken = function (a, b, c) {
        var d = this.classify(a, b, c);
        a: for (;;) {
            for (var e = this.stack[this.stack.length - 1], f = e.dfa[0], g = f[e.state], h = 0; h < g.length; ++h) {
                var i = g[h][0],
                    j = g[h][1],
                    k = this.grammar.labels[i][0];
                if (d === i) {
                    goog.asserts.assert(k < 256);
                    this.shift(a, b, j, c);
                    for (a = j; f[a].length === 1 && f[a][0][0] === 0 && f[a][0][1] === a;) {
                        this.pop();
                        if (this.stack.length === 0) return true;
                        e = this.stack[this.stack.length - 1];
                        a = e.state;
                        f = e.dfa[0]
                    }
                    return false
                } else if (k >= 256) if (this.grammar.dfas[k][1].hasOwnProperty(d)) {
                    this.push(k,
                    this.grammar.dfas[k], j, c);
                    continue a
                }
            }
            if (findInDfa(g, [0, e.state])) {
                this.pop();
                if (this.stack.length === 0) throw new Sk.builtin.ParseError("too much input");
            } else throw new Sk.builtin.ParseError("bad input on line" + c[0][0].toString());
        }
    };
    Parser.prototype.classify = function (a, b, c) {
        var d;
        if (a === Sk.Tokenizer.Tokens.T_NAME) {
            this.used_names[b] = true;
            if (d = this.grammar.keywords.hasOwnProperty(b) && this.grammar.keywords[b]) return d
        }
        d = this.grammar.tokens.hasOwnProperty(a) && this.grammar.tokens[a];
        if (!d) throw new Sk.builtin.ParseError("bad token", a, b, c);
        return d
    };
    Parser.prototype.shift = function (a, b, c, d) {
        var e = this.stack[this.stack.length - 1].dfa,
            f = this.stack[this.stack.length - 1].node;
        f.children.push({
            type: a,
            value: b,
            lineno: d[0][0],
            col_offset: d[0][1],
            children: null
        });
        this.stack[this.stack.length - 1] = {
            dfa: e,
            state: c,
            node: f
        }
    };
    Parser.prototype.push = function (a, b, c, d) {
        a = {
            type: a,
            value: null,
            lineno: d[0][0],
            col_offset: d[0][1],
            children: []
        };
        this.stack[this.stack.length - 1] = {
            dfa: this.stack[this.stack.length - 1].dfa,
            state: c,
            node: this.stack[this.stack.length - 1].node
        };
        this.stack.push({
            dfa: b,
            state: 0,
            node: a
        })
    };
    Parser.prototype.pop = function () {
        var a = this.stack.pop().node;
        if (a) if (this.stack.length !== 0) this.stack[this.stack.length - 1].node.children.push(a);
        else {
            this.rootnode = a;
            this.rootnode.used_names = this.used_names
        }
    };

    function makeParser(a, b) {
        if (b === undefined) b = "file_input";
        var c = new Parser(Sk.ParseTables);
        b === "file_input" ? c.setup(Sk.ParseTables.sym.file_input) : goog.asserts.fail("todo;");
        var d = 1,
            e = "",
            f = Sk.Tokenizer.Tokens.T_COMMENT,
            g = Sk.Tokenizer.Tokens.T_NL,
            h = Sk.Tokenizer.Tokens.T_OP,
            i = new Sk.Tokenizer(a, b === "single_input", function (j, k, l, m, o) {
                if (j === f || j === g) {
                    e += k;
                    d = m[0];
                    if (k[k.length - 1] === "\n") d += 1
                } else {
                    if (j === h) j = Sk.OpMap[k];
                    if (c.addtoken(j, k, [l, m, o])) return true
                }
            });
        return function (j) {
            if (j = i.generateTokens(j)) {
                if (j !== "done") throw "ParseError: incomplete input";
                return c.rootnode
            }
            return false
        }
    }
    Sk.parse = function (a, b) {
        var c = makeParser(a);
        if (b.substr(b.length - 1, 1) !== "\n") b += "\n";
        for (var d = b.split("\n"), e, f = 0; f < d.length; ++f) e = c(d[f] + (f === d.length - 1 ? "" : "\n"));
        return e
    };
    Sk.parseTreeDump = function (a, b) {
        b = b || "";
        var c = "";
        c += b;
        if (a.type >= 256) {
            c += Sk.ParseTables.number2symbol[a.type] + "\n";
            for (var d = 0; d < a.children.length; ++d) c += Sk.parseTreeDump(a.children[d], b + "  ")
        } else c += Sk.Tokenizer.tokenNames[a.type] + ": " + (new Sk.builtin.str(a.value)).$r().v + "\n";
        return c
    };
    goog.exportSymbol("Sk.parse", Sk.parse);
    goog.exportSymbol("Sk.parseTreeDump", Sk.parseTreeDump);

    function Load() {}
    function Store() {}
    function Del() {}
    function AugLoad() {}
    function AugStore() {}
    function Param() {}
    function And() {}
    function Or() {}
    function Add() {}
    function Sub() {}
    function Mult() {}
    function Div() {}
    function Mod() {}
    function Pow() {}
    function LShift() {}
    function RShift() {}
    function BitOr() {}
    function BitXor() {}
    function BitAnd() {}
    function FloorDiv() {}
    function Invert() {}
    function Not() {}
    function UAdd() {}
    function USub() {}
    function Eq() {}
    function NotEq() {}
    function Lt() {}
    function LtE() {}

    function Gt() {}
    function GtE() {}
    function Is() {}
    function IsNot() {}
    function In_() {}
    function NotIn() {}
    function Module(a) {
	
        this.body = a;
        return this
    }
    function Interactive(a) {
        this.body = a;
        return this
    }
    function Expression(a) {
        goog.asserts.assert(a !== null && a !== undefined);
        this.body = a;
        return this
    }
    function Suite(a) {
        this.body = a;
        return this
    }

    function FunctionDef(a, b, c, d, e, f) {
        goog.asserts.assert(a !== null && a !== undefined);
        goog.asserts.assert(b !== null && b !== undefined);
        this.name = a;
        this.args = b;
        this.body = c;
        this.decorator_list = d;
        this.lineno = e;
        this.col_offset = f;
        return this
    }
    function ClassDef(a, b, c, d, e, f) {
        goog.asserts.assert(a !== null && a !== undefined);
        this.name = a;
        this.bases = b;
        this.body = c;
        this.decorator_list = d;
        this.lineno = e;
        this.col_offset = f;
        return this
    }
    function Return_(a, b, c) {
        this.value = a;
        this.lineno = b;
        this.col_offset = c;
        return this
    }

    function Delete_(a, b, c) {
        this.targets = a;
        this.lineno = b;
        this.col_offset = c;
        return this
    }
    function Assign(a, b, c, d) {
        goog.asserts.assert(b !== null && b !== undefined);
        this.targets = a;
        this.value = b;
        this.lineno = c;
        this.col_offset = d;
        return this
    }
    function AugAssign(a, b, c, d, e) {
        goog.asserts.assert(a !== null && a !== undefined);
        goog.asserts.assert(b !== null && b !== undefined);
        goog.asserts.assert(c !== null && c !== undefined);
        this.target = a;
        this.op = b;
        this.value = c;
        this.lineno = d;
        this.col_offset = e;
        return this
    }

    function Print(a, b, c, d, e) {
        this.dest = a;
        this.values = b;
        this.nl = c;
        this.lineno = d;
        this.col_offset = e;
        return this
    }
    function For_(a, b, c, d, e, f) {
        goog.asserts.assert(a !== null && a !== undefined);
        goog.asserts.assert(b !== null && b !== undefined);
        this.target = a;
        this.iter = b;
        this.body = c;
        this.orelse = d;
        this.lineno = e;
        this.col_offset = f;
        return this
    }
    function While_(a, b, c, d, e) {
        goog.asserts.assert(a !== null && a !== undefined);
        this.test = a;
        this.body = b;
        this.orelse = c;
        this.lineno = d;
        this.col_offset = e;
        return this
    }

    function If_(a, b, c, d, e) {
        goog.asserts.assert(a !== null && a !== undefined);
        this.test = a;
        this.body = b;
        this.orelse = c;
        this.lineno = d;
        this.col_offset = e;
        return this
    }
    function With_(a, b, c, d, e) {
        goog.asserts.assert(a !== null && a !== undefined);
        this.context_expr = a;
        this.optional_vars = b;
        this.body = c;
        this.lineno = d;
        this.col_offset = e;
        return this
    }
    function Raise(a, b, c, d, e) {
        this.type = a;
        this.inst = b;
        this.tback = c;
        this.lineno = d;
        this.col_offset = e;
        return this
    }

    function TryExcept(a, b, c, d, e) {
        this.body = a;
        this.handlers = b;
        this.orelse = c;
        this.lineno = d;
        this.col_offset = e;
        return this
    }
    function TryFinally(a, b, c, d) {
        this.body = a;
        this.finalbody = b;
        this.lineno = c;
        this.col_offset = d;
        return this
    }
    function Assert(a, b, c, d) {
        goog.asserts.assert(a !== null && a !== undefined);
        this.test = a;
        this.msg = b;
        this.lineno = c;
        this.col_offset = d;
        return this
    }
    function Import_(a, b, c) {
        this.names = a;
        this.lineno = b;
        this.col_offset = c;
        return this
    }

    function ImportFrom(a, b, c, d, e) {
        goog.asserts.assert(a !== null && a !== undefined);
        this.module = a;
        this.names = b;
        this.level = c;
        this.lineno = d;
        this.col_offset = e;
        return this
    }
    function Exec(a, b, c, d, e) {
        goog.asserts.assert(a !== null && a !== undefined);
        this.body = a;
        this.globals = b;
        this.locals = c;
        this.lineno = d;
        this.col_offset = e;
        return this
    }
    function Global(a, b, c) {
        this.names = a;
        this.lineno = b;
        this.col_offset = c;
        return this
    }

    function Expr(a, b, c) {
        goog.asserts.assert(a !== null && a !== undefined);
        this.value = a;
        this.lineno = b;
        this.col_offset = c;
        return this
    }
    function Pass(a, b) {
        this.lineno = a;
        this.col_offset = b;
        return this
    }
    function Break_(a, b) {
        this.lineno = a;
        this.col_offset = b;
        return this
    }
    function Continue_(a, b) {
        this.lineno = a;
        this.col_offset = b;
        return this
    }
    function BoolOp(a, b, c, d) {
        goog.asserts.assert(a !== null && a !== undefined);
        this.op = a;
        this.values = b;
        this.lineno = c;
        this.col_offset = d;
        return this
    }

    function BinOp(a, b, c, d, e) {
        goog.asserts.assert(a !== null && a !== undefined);
        goog.asserts.assert(b !== null && b !== undefined);
        goog.asserts.assert(c !== null && c !== undefined);
        this.left = a;
        this.op = b;
        this.right = c;
        this.lineno = d;
        this.col_offset = e;
        return this
    }
    function UnaryOp(a, b, c, d) {
        goog.asserts.assert(a !== null && a !== undefined);
        goog.asserts.assert(b !== null && b !== undefined);
        this.op = a;
        this.operand = b;
        this.lineno = c;
        this.col_offset = d;
        return this
    }

    function Lambda(a, b, c, d) {
        goog.asserts.assert(a !== null && a !== undefined);
        goog.asserts.assert(b !== null && b !== undefined);
        this.args = a;
        this.body = b;
        this.lineno = c;
        this.col_offset = d;
        return this
    }
    function IfExp(a, b, c, d, e) {
        goog.asserts.assert(a !== null && a !== undefined);
        goog.asserts.assert(b !== null && b !== undefined);
        goog.asserts.assert(c !== null && c !== undefined);
        this.test = a;
        this.body = b;
        this.orelse = c;
        this.lineno = d;
        this.col_offset = e;
        return this
    }

    function Dict(a, b, c, d) {
        this.keys = a;
        this.values = b;
        this.lineno = c;
        this.col_offset = d;
        return this
    }
    function ListComp(a, b, c, d) {
        goog.asserts.assert(a !== null && a !== undefined);
        this.elt = a;
        this.generators = b;
        this.lineno = c;
        this.col_offset = d;
        return this
    }
    function GeneratorExp(a, b, c, d) {
        goog.asserts.assert(a !== null && a !== undefined);
        this.elt = a;
        this.generators = b;
        this.lineno = c;
        this.col_offset = d;
        return this
    }
    function Yield(a, b, c) {
        this.value = a;
        this.lineno = b;
        this.col_offset = c;
        return this
    }

    function Compare(a, b, c, d, e) {
        goog.asserts.assert(a !== null && a !== undefined);
        this.left = a;
        this.ops = b;
        this.comparators = c;
        this.lineno = d;
        this.col_offset = e;
        return this
    }
    function Call(a, b, c, d, e, f, g) {
        goog.asserts.assert(a !== null && a !== undefined);
        this.func = a;
        this.args = b;
        this.keywords = c;
        this.starargs = d;
        this.kwargs = e;
        this.lineno = f;
        this.col_offset = g;
        return this
    }
    function Num(a, b, c) {
        goog.asserts.assert(a !== null && a !== undefined);
        this.n = a;
        this.lineno = b;
        this.col_offset = c;
        return this
    }

    function Str(a, b, c) {
        goog.asserts.assert(a !== null && a !== undefined);
        this.s = a;
        this.lineno = b;
        this.col_offset = c;
        return this
    }
    function Attribute(a, b, c, d, e) {
        goog.asserts.assert(a !== null && a !== undefined);
        goog.asserts.assert(b !== null && b !== undefined);
        goog.asserts.assert(c !== null && c !== undefined);
        this.value = a;
        this.attr = b;
        this.ctx = c;
        this.lineno = d;
        this.col_offset = e;
        return this
    }

    function Subscript(a, b, c, d, e) {
        goog.asserts.assert(a !== null && a !== undefined);
        goog.asserts.assert(b !== null && b !== undefined);
        goog.asserts.assert(c !== null && c !== undefined);
        this.value = a;
        this.slice = b;
        this.ctx = c;
        this.lineno = d;
        this.col_offset = e;
        return this
    }
    function Name(a, b, c, d) {
        goog.asserts.assert(a !== null && a !== undefined);
        goog.asserts.assert(b !== null && b !== undefined);
        this.id = a;
        this.ctx = b;
        this.lineno = c;
        this.col_offset = d;
        return this
    }

    function List(a, b, c, d) {
        goog.asserts.assert(b !== null && b !== undefined);
        this.elts = a;
        this.ctx = b;
        this.lineno = c;
        this.col_offset = d;
        return this
    }
    function Tuple(a, b, c, d) {
        goog.asserts.assert(b !== null && b !== undefined);
        this.elts = a;
        this.ctx = b;
        this.lineno = c;
        this.col_offset = d;
        return this
    }
    function Ellipsis() {
        return this
    }
    function Slice(a, b, c) {
        this.lower = a;
        this.upper = b;
        this.step = c;
        return this
    }
    function ExtSlice(a) {
        this.dims = a;
        return this
    }

    function Index(a) {
        goog.asserts.assert(a !== null && a !== undefined);
        this.value = a;
        return this
    }
    function comprehension(a, b, c) {
        goog.asserts.assert(a !== null && a !== undefined);
        goog.asserts.assert(b !== null && b !== undefined);
        this.target = a;
        this.iter = b;
        this.ifs = c;
        return this
    }
    function ExceptHandler(a, b, c, d, e) {
        this.type = a;
        this.name = b;
        this.body = c;
        this.lineno = d;
        this.col_offset = e;
        return this
    }
    function arguments_(a, b, c, d) {
        this.args = a;
        this.vararg = b;
        this.kwarg = c;
        this.defaults = d;
        return this
    }

    function keyword(a, b) {
        goog.asserts.assert(a !== null && a !== undefined);
        goog.asserts.assert(b !== null && b !== undefined);
        this.arg = a;
        this.value = b;
        return this
    }
    function alias(a, b) {
        goog.asserts.assert(a !== null && a !== undefined);
        this.name = a;
        this.asname = b;
        return this
    }
    Module.prototype._astname = "Module";
    Module.prototype._fields = ["body", function (a) {
        return a.body
    }];
    Interactive.prototype._astname = "Interactive";
    Interactive.prototype._fields = ["body", function (a) {
        return a.body
    }];
    Expression.prototype._astname = "Expression";
    Expression.prototype._fields = ["body", function (a) {
        return a.body
    }];
    Suite.prototype._astname = "Suite";
    Suite.prototype._fields = ["body", function (a) {
        return a.body
    }];
    FunctionDef.prototype._astname = "FunctionDef";
    FunctionDef.prototype._fields = ["name", function (a) {
        return a.name
    }, "args", function (a) {
        return a.args
    }, "body", function (a) {
        return a.body
    }, "decorator_list", function (a) {
        return a.decorator_list
    }];
    ClassDef.prototype._astname = "ClassDef";
    ClassDef.prototype._fields = ["name", function (a) {
        return a.name
    }, "bases", function (a) {
        return a.bases
    }, "body", function (a) {
        return a.body
    }, "decorator_list", function (a) {
        return a.decorator_list
    }];
    Return_.prototype._astname = "Return";
    Return_.prototype._fields = ["value", function (a) {
        return a.value
    }];
    Delete_.prototype._astname = "Delete";
    Delete_.prototype._fields = ["targets", function (a) {
        return a.targets
    }];
    Assign.prototype._astname = "Assign";
    Assign.prototype._fields = ["targets", function (a) {
        return a.targets
    }, "value", function (a) {
        return a.value
    }];
    AugAssign.prototype._astname = "AugAssign";
    AugAssign.prototype._fields = ["target", function (a) {
        return a.target
    }, "op", function (a) {
        return a.op
    }, "value", function (a) {
        return a.value
    }];
    Print.prototype._astname = "Print";
    Print.prototype._fields = ["dest", function (a) {
        return a.dest
    }, "values", function (a) {
        return a.values
    }, "nl", function (a) {
        return a.nl
    }];
    For_.prototype._astname = "For";
    For_.prototype._fields = ["target", function (a) {
        return a.target
    }, "iter", function (a) {
        return a.iter
    }, "body", function (a) {
        return a.body
    }, "orelse", function (a) {
        return a.orelse
    }];
    While_.prototype._astname = "While";
    While_.prototype._fields = ["test", function (a) {
        return a.test
    }, "body", function (a) {
        return a.body
    }, "orelse", function (a) {
        return a.orelse
    }];
    If_.prototype._astname = "If";
    If_.prototype._fields = ["test", function (a) {
        return a.test
    }, "body", function (a) {
        return a.body
    }, "orelse", function (a) {
        return a.orelse
    }];
    With_.prototype._astname = "With";
    With_.prototype._fields = ["context_expr", function (a) {
        return a.context_expr
    }, "optional_vars", function (a) {
        return a.optional_vars
    }, "body", function (a) {
        return a.body
    }];
    Raise.prototype._astname = "Raise";
    Raise.prototype._fields = ["type", function (a) {
        return a.type
    }, "inst", function (a) {
        return a.inst
    }, "tback", function (a) {
        return a.tback
    }];
    TryExcept.prototype._astname = "TryExcept";
    TryExcept.prototype._fields = ["body", function (a) {
        return a.body
    }, "handlers", function (a) {
        return a.handlers
    }, "orelse", function (a) {
        return a.orelse
    }];
    TryFinally.prototype._astname = "TryFinally";
    TryFinally.prototype._fields = ["body", function (a) {
        return a.body
    }, "finalbody", function (a) {
        return a.finalbody
    }];
    Assert.prototype._astname = "Assert";
    Assert.prototype._fields = ["test", function (a) {
        return a.test
    }, "msg", function (a) {
        return a.msg
    }];
    Import_.prototype._astname = "Import";
    Import_.prototype._fields = ["names", function (a) {
        return a.names
    }];
    ImportFrom.prototype._astname = "ImportFrom";
    ImportFrom.prototype._fields = ["module", function (a) {
        return a.module
    }, "names", function (a) {
        return a.names
    }, "level", function (a) {
        return a.level
    }];
    Exec.prototype._astname = "Exec";
    Exec.prototype._fields = ["body", function (a) {
        return a.body
    }, "globals", function (a) {
        return a.globals
    }, "locals", function (a) {
        return a.locals
    }];
    Global.prototype._astname = "Global";
    Global.prototype._fields = ["names", function (a) {
        return a.names
    }];
    Expr.prototype._astname = "Expr";
    Expr.prototype._fields = ["value", function (a) {
        return a.value
    }];
    Pass.prototype._astname = "Pass";
    Pass.prototype._fields = [];
    Break_.prototype._astname = "Break";
    Break_.prototype._fields = [];
    Continue_.prototype._astname = "Continue";
    Continue_.prototype._fields = [];
    BoolOp.prototype._astname = "BoolOp";
    BoolOp.prototype._fields = ["op", function (a) {
        return a.op
    }, "values", function (a) {
        return a.values
    }];
    BinOp.prototype._astname = "BinOp";
    BinOp.prototype._fields = ["left", function (a) {
        return a.left
    }, "op", function (a) {
        return a.op
    }, "right", function (a) {
        return a.right
    }];
    UnaryOp.prototype._astname = "UnaryOp";
    UnaryOp.prototype._fields = ["op", function (a) {
        return a.op
    }, "operand", function (a) {
        return a.operand
    }];
    Lambda.prototype._astname = "Lambda";
    Lambda.prototype._fields = ["args", function (a) {
        return a.args
    }, "body", function (a) {
        return a.body
    }];
    IfExp.prototype._astname = "IfExp";
    IfExp.prototype._fields = ["test", function (a) {
        return a.test
    }, "body", function (a) {
        return a.body
    }, "orelse", function (a) {
        return a.orelse
    }];
    Dict.prototype._astname = "Dict";
    Dict.prototype._fields = ["keys", function (a) {
        return a.keys
    }, "values", function (a) {
        return a.values
    }];
    ListComp.prototype._astname = "ListComp";
    ListComp.prototype._fields = ["elt", function (a) {
        return a.elt
    }, "generators", function (a) {
        return a.generators
    }];
    GeneratorExp.prototype._astname = "GeneratorExp";
    GeneratorExp.prototype._fields = ["elt", function (a) {
        return a.elt
    }, "generators", function (a) {
        return a.generators
    }];
    Yield.prototype._astname = "Yield";
    Yield.prototype._fields = ["value", function (a) {
        return a.value
    }];
    Compare.prototype._astname = "Compare";
    Compare.prototype._fields = ["left", function (a) {
        return a.left
    }, "ops", function (a) {
        return a.ops
    }, "comparators", function (a) {
        return a.comparators
    }];
    Call.prototype._astname = "Call";
    Call.prototype._fields = ["func", function (a) {
        return a.func
    }, "args", function (a) {
        return a.args
    }, "keywords", function (a) {
        return a.keywords
    }, "starargs", function (a) {
        return a.starargs
    }, "kwargs", function (a) {
        return a.kwargs
    }];
    Num.prototype._astname = "Num";
    Num.prototype._fields = ["n", function (a) {
        return a.n
    }];
    Str.prototype._astname = "Str";
    Str.prototype._fields = ["s", function (a) {
        return a.s
    }];
    Attribute.prototype._astname = "Attribute";
    Attribute.prototype._fields = ["value", function (a) {
        return a.value
    }, "attr", function (a) {
        return a.attr
    }, "ctx", function (a) {
        return a.ctx
    }];
    Subscript.prototype._astname = "Subscript";
    Subscript.prototype._fields = ["value", function (a) {
        return a.value
    }, "slice", function (a) {
        return a.slice
    }, "ctx", function (a) {
        return a.ctx
    }];
    Name.prototype._astname = "Name";
    Name.prototype._fields = ["id", function (a) {
        return a.id
    }, "ctx", function (a) {
        return a.ctx
    }];
    List.prototype._astname = "List";
    List.prototype._fields = ["elts", function (a) {
        return a.elts
    }, "ctx", function (a) {
        return a.ctx
    }];
    Tuple.prototype._astname = "Tuple";
    Tuple.prototype._fields = ["elts", function (a) {
        return a.elts
    }, "ctx", function (a) {
        return a.ctx
    }];
    Load.prototype._astname = "Load";
    Load.prototype._isenum = true;
    Store.prototype._astname = "Store";
    Store.prototype._isenum = true;
    Del.prototype._astname = "Del";
    Del.prototype._isenum = true;
    AugLoad.prototype._astname = "AugLoad";
    AugLoad.prototype._isenum = true;
    AugStore.prototype._astname = "AugStore";
    AugStore.prototype._isenum = true;
    Param.prototype._astname = "Param";
    Param.prototype._isenum = true;
    Ellipsis.prototype._astname = "Ellipsis";
    Ellipsis.prototype._fields = [];
    Slice.prototype._astname = "Slice";
    Slice.prototype._fields = ["lower", function (a) {
        return a.lower
    }, "upper", function (a) {
        return a.upper
    }, "step", function (a) {
        return a.step
    }];
    ExtSlice.prototype._astname = "ExtSlice";
    ExtSlice.prototype._fields = ["dims", function (a) {
        return a.dims
    }];
    Index.prototype._astname = "Index";
    Index.prototype._fields = ["value", function (a) {
        return a.value
    }];
    And.prototype._astname = "And";
    And.prototype._isenum = true;
    Or.prototype._astname = "Or";
    Or.prototype._isenum = true;
    Add.prototype._astname = "Add";
    Add.prototype._isenum = true;
    Sub.prototype._astname = "Sub";
    Sub.prototype._isenum = true;
    Mult.prototype._astname = "Mult";
    Mult.prototype._isenum = true;
    Div.prototype._astname = "Div";
    Div.prototype._isenum = true;
    Mod.prototype._astname = "Mod";
    Mod.prototype._isenum = true;
    Pow.prototype._astname = "Pow";
    Pow.prototype._isenum = true;
    LShift.prototype._astname = "LShift";
    LShift.prototype._isenum = true;
    RShift.prototype._astname = "RShift";
    RShift.prototype._isenum = true;
    BitOr.prototype._astname = "BitOr";
    BitOr.prototype._isenum = true;
    BitXor.prototype._astname = "BitXor";
    BitXor.prototype._isenum = true;
    BitAnd.prototype._astname = "BitAnd";
    BitAnd.prototype._isenum = true;
    FloorDiv.prototype._astname = "FloorDiv";
    FloorDiv.prototype._isenum = true;
    Invert.prototype._astname = "Invert";
    Invert.prototype._isenum = true;
    Not.prototype._astname = "Not";
    Not.prototype._isenum = true;
    UAdd.prototype._astname = "UAdd";
    UAdd.prototype._isenum = true;
    USub.prototype._astname = "USub";
    USub.prototype._isenum = true;
    Eq.prototype._astname = "Eq";
    Eq.prototype._isenum = true;
    NotEq.prototype._astname = "NotEq";
    NotEq.prototype._isenum = true;
    Lt.prototype._astname = "Lt";
    Lt.prototype._isenum = true;
    LtE.prototype._astname = "LtE";
    LtE.prototype._isenum = true;
    Gt.prototype._astname = "Gt";
    Gt.prototype._isenum = true;
    GtE.prototype._astname = "GtE";
    GtE.prototype._isenum = true;
    Is.prototype._astname = "Is";
    Is.prototype._isenum = true;
    IsNot.prototype._astname = "IsNot";
    IsNot.prototype._isenum = true;
    In_.prototype._astname = "In";
    In_.prototype._isenum = true;
    NotIn.prototype._astname = "NotIn";
    NotIn.prototype._isenum = true;
    comprehension.prototype._astname = "comprehension";
    comprehension.prototype._fields = ["target", function (a) {
        return a.target
    }, "iter", function (a) {
        return a.iter
    }, "ifs", function (a) {
        return a.ifs
    }];
    ExceptHandler.prototype._astname = "ExceptHandler";
    ExceptHandler.prototype._fields = ["type", function (a) {
        return a.type
    }, "name", function (a) {
        return a.name
    }, "body", function (a) {
        return a.body
    }];
    arguments_.prototype._astname = "arguments";
    arguments_.prototype._fields = ["args", function (a) {
        return a.args
    }, "vararg", function (a) {
        return a.vararg
    }, "kwarg", function (a) {
        return a.kwarg
    }, "defaults", function (a) {
        return a.defaults
    }];
    keyword.prototype._astname = "keyword";
    keyword.prototype._fields = ["arg", function (a) {
        return a.arg
    }, "value", function (a) {
        return a.value
    }];
    alias.prototype._astname = "alias";
    alias.prototype._fields = ["name", function (a) {
        return a.name
    }, "asname", function (a) {
        return a.asname
    }];
    var SYM = Sk.ParseTables.sym,
        TOK = Sk.Tokenizer.Tokens;

    function Compiling(a, b) {
	
        this.c_encoding = a;
        this.c_filename = b
    }
    function NCH(a) {
	
        goog.asserts.assert(a !== undefined);
        if (a.children === null) return 0;
        return a.children.length
    }
    function CHILD(a, b) {
        goog.asserts.assert(a !== undefined);
        goog.asserts.assert(b !== undefined);
        return a.children[b]
    }
    function REQ(a, b) {
	
        goog.asserts.assert(a.type === b, "node wasn't expected type")
    }

    function strobj(a) {
	
        goog.asserts.assert(typeof a === "string", "expecting string, got " + typeof a);
        return new Sk.builtin.str(a)
    }

    function numStmts(a) {
        switch (a.type) {
        case SYM.single_input:
            if (CHILD(a, 0).type === TOK.T_NEWLINE) break;
            else return numStmts(CHILD(a, 0));
        case SYM.file_input:
            for (var b = 0, c = 0; c < NCH(a); ++c) {
                var d = CHILD(a, c);
                if (d.type === SYM.stmt) b += numStmts(d)
            }
            return b;
        case SYM.stmt:
            return numStmts(CHILD(a, 0));
        case SYM.compound_stmt:
            return 1;
        case SYM.simple_stmt:
            return Math.floor(NCH(a) / 2);
        case SYM.suite:
            if (NCH(a) === 1) return numStmts(CHILD(a, 0));
            else {
                b = 0;
                for (c = 2; c < NCH(a) - 1; ++c) b += numStmts(CHILD(a, c));
                return b
            }
        default:
            goog.asserts.fail("Non-statement found")
        }
        return 0
    }

    function forbiddenCheck(a, b, c) {
	
        if (c === "None") throw new Sk.builtin.SyntaxError("assignment to None");
        if (c === "True" || c === "False") throw new Sk.builtin.SyntaxError("assignment to True dor False is forbidden");
    }

    function setContext(a, b, c, d) {
        goog.asserts.assert(c !== AugStore && c !== AugLoad);
        var e = null,
            f = null;
        switch (b.constructor) {
        case Attribute:
        case Name:
            c === Store && forbiddenCheck(a, d, b.attr);
            b.ctx = c;
            break;
        case Subscript:
            b.ctx = c;
            break;
        case List:
            b.ctx = c;
            e = b.elts;
            break;
        case Tuple:
            if (b.elts.length === 0) throw new Sk.builtin.SyntaxError("can't assign to ()");
            b.ctx = c;
            e = b.elts;
            break;
        case Lambda:
            f = "lambda";
            break;
        case Call:
            f = "function call";
            break;
        case BoolOp:
        case BinOp:
        case UnaryOp:
            f = "operator";
            break;
        case GeneratorExp:
            f = "generator expression";
            break;
        case Yield:
            f = "yield expression";
            break;
        case ListComp:
            f = "list comprehension";
            break;
        case Dict:
        case Num:
        case Str:
            f = "literal";
            break;
        case Compare:
            f = "comparison";
            break;
        case IfExp:
            f = "conditional expression";
            break;
        default:
            goog.asserts.fail("unhandled expression in assignment")
        }
        if (f) throw new Sk.builtin.SyntaxError("can't " + (c === Store ? "assign to" : "delete") + " " + f);
        if (e) for (b = 0; b < e.length; ++b) setContext(a, e[b], c, d)
    }
    var operatorMap = {};
    (function () {
        operatorMap[TOK.T_VBAR] = BitOr;
        operatorMap[TOK.T_VBAR] = BitOr;
        operatorMap[TOK.T_CIRCUMFLEX] = BitXor;
        operatorMap[TOK.T_AMPER] = BitAnd;
        operatorMap[TOK.T_LEFTSHIFT] = LShift;
        operatorMap[TOK.T_RIGHTSHIFT] = RShift;
        operatorMap[TOK.T_PLUS] = Add;
        operatorMap[TOK.T_MINUS] = Sub;
        operatorMap[TOK.T_STAR] = Mult;
        operatorMap[TOK.T_SLASH] = Div;
        operatorMap[TOK.T_DOUBLESLASH] = FloorDiv;
        operatorMap[TOK.T_PERCENT] = Mod
    })();

    function getOperator(a) {
        goog.asserts.assert(operatorMap[a.type] !== undefined);
        return operatorMap[a.type]
    }

    function astForCompOp(a, b) {
        REQ(b, SYM.comp_op);
        if (NCH(b) === 1) {
            b = CHILD(b, 0);
            switch (b.type) {
            case TOK.T_LESS:
                return Lt;
            case TOK.T_GREATER:
                return Gt;
            case TOK.T_EQEQUAL:
                return Eq;
            case TOK.T_LESSEQUAL:
                return LtE;
            case TOK.T_GREATEREQUAL:
                return GtE;
            case TOK.T_NOTEQUAL:
                return NotEq;
            case TOK.T_NAME:
                if (b.value === "in") return In_;
                if (b.value === "is") return Is
            }
        } else if (NCH(b) === 2) if (CHILD(b, 0).type === TOK.T_NAME) {
            if (CHILD(b, 1).value === "in") return NotIn;
            if (CHILD(b, 0).value === "is") return IsNot
        }
        goog.asserts.fail("invalid comp_op")
    }

    function seqForTestlist(a, b) {
        goog.asserts.assert(b.type === SYM.testlist || b.type === SYM.listmaker || b.type === SYM.testlist_gexp || b.type === SYM.testlist_safe || b.type === SYM.testlist1);
        for (var c = [], d = 0; d < NCH(b); d += 2) {
            goog.asserts.assert(CHILD(b, d).type === SYM.test || CHILD(b, d).type === SYM.old_test);
            c[d / 2] = astForExpr(a, CHILD(b, d))
        }
        return c
    }

    function astForSuite(a, b) {
        REQ(b, SYM.suite);
        var c = [],
            d = 0,
            e;
        if (CHILD(b, 0).type === SYM.simple_stmt) {
            b = CHILD(b, 0);
            e = NCH(b) - 1;
            if (CHILD(b, e - 1).type === TOK.T_SEMI) e -= 1;
            for (var f = 0; f < e; f += 2) c[d++] = astForStmt(a, CHILD(b, f))
        } else for (f = 2; f < NCH(b) - 1; ++f) {
            e = CHILD(b, f);
            REQ(e, SYM.stmt);
            if (numStmts(e) === 1) c[d++] = astForStmt(a, e);
            else {
                e = CHILD(e, 0);
                REQ(e, SYM.simple_stmt);
                for (var g = 0; g < NCH(e); g += 2) {
                    if (NCH(CHILD(e, g)) === 0) {
                        goog.asserts.assert(g + 1 === NCH(e));
                        break
                    }
                    c[d++] = astForStmt(a, CHILD(e, g))
                }
            }
        }
        goog.asserts.assert(d === numStmts(b));
        return c
    }

    function astForExceptClause(a, b, c) {
        REQ(b, SYM.except_clause);
        REQ(c, SYM.suite);
        if (NCH(b) === 1) return new ExceptHandler(null, null, astForSuite(a, c), b.lineno, b.col_offset);
        else if (NCH(b) === 2) return new ExceptHandler(astForExpr(a, CHILD(b, 1)), null, astForSuite(a, c), b.lineno, b.col_offset);
        else if (NCH(b) === 4) {
            var d = astForExpr(a, CHILD(b, 3));
            setContext(a, d, Store, CHILD(b, 3));
            return new ExceptHandler(astForExpr(a, CHILD(b, 1)), d, astForSuite(a, c), b.lineno, b.col_offset)
        }
        goog.asserts.fail("wrong number of children for except clause")
    }

    function astForTryStmt(a, b) {
        var c = NCH(b),
            d = (c - 3) / 3,
            e, f = [],
            g = null;
        REQ(b, SYM.try_stmt);
        e = astForSuite(a, CHILD(b, 2));
        if (CHILD(b, c - 3).type === TOK.T_NAME) {
            if (CHILD(b, c - 3).value === "finally") {
                if (c >= 9 && CHILD(b, c - 6).type === TOK.T_NAME) {
                    f = astForSuite(a, CHILD(b, c - 4));
                    d--
                }
                g = astForSuite(a, CHILD(b, c - 1))
            } else f = astForSuite(a, CHILD(b, c - 1));
            d--
        } else if (CHILD(b, c - 3).type !== SYM.except_clause) throw new Sk.builtin.SyntaxError("malformed 'try' statement");
        if (d > 0) {
            c = [];
            for (var h = 0; h < d; ++h) c[h] = astForExceptClause(a, CHILD(b,
            3 + h * 3), CHILD(b, 5 + h * 3));
            d = new TryExcept(e, c, f, b.lineno, b.col_offset);
            if (!g) return d;
            e = [d]
        }
        goog.asserts.assert(g !== null);
        return new TryFinally(e, g, b.lineno, b.col_offset)
    }
    function astForDottedName(a, b) {
        REQ(b, SYM.dotted_name);
        for (var c = b.lineno, d = b.col_offset, e = strobj(CHILD(b, 0).value), f = new Name(e, Load, c, d), g = 2; g < NCH(b); g += 2) {
            e = strobj(CHILD(b, g).value);
            f = new Attribute(f, e, Load, c, d)
        }
        return f
    }

    function astForDecorator(a, b) {
        REQ(b, SYM.decorator);
        REQ(CHILD(b, 0), TOK.T_AT);
        REQ(CHILD(b, NCH(b) - 1), TOK.T_NEWLINE);
        var c = astForDottedName(a, CHILD(b, 1));
        return NCH(b) === 3 ? c : NCH(b) === 5 ? new Call(c, [], [], null, null, b.lineno, b.col_offset) : astForCall(a, CHILD(b, 3), c)
    }
    function astForDecorators(a, b) {
        REQ(b, SYM.decorators);
        for (var c = [], d = 0; d < NCH(b); ++d) c[d] = astForDecorator(a, CHILD(b, d));
        return c
    }

    function astForDecorated(a, b) {
        REQ(b, SYM.decorated);
        var c = astForDecorators(a, CHILD(b, 0));
        goog.asserts.assert(CHILD(b, 1).type === SYM.funcdef || CHILD(b, 1).type === SYM.classdef);
        var d = null;
        if (CHILD(b, 1).type === SYM.funcdef) d = astForFuncdef(a, CHILD(b, 1), c);
        else if (CHILD(b, 1) === SYM.classdef) d = astForClassdef(a, CHILD(b, 1), c);
        if (d) {
            d.lineno = b.lineno;
            d.col_offset = b.col_offset
        }
        return d
    }
    function astForWithVar(a, b) {
        REQ(b, SYM.with_var);
        return astForExpr(a, CHILD(b, 1))
    }

    function astForWithStmt(a, b) {
        var c = 3;
        goog.asserts.assert(b.type === SYM.with_stmt);
        var d = astForExpr(a, CHILD(b, 1));
        if (CHILD(b, 2).type === SYM.with_var) {
            var e = astForWithVar(a, CHILD(b, 2));
            setContext(a, e, Store, b);
            c = 4
        }
        return new With_(d, e, astForSuite(a, CHILD(b, c)), b.lineno, b.col_offset)
    }

    function astForExecStmt(a, b) {
        var c, d = null,
            e = null,
            f = NCH(b);
        goog.asserts.assert(f === 2 || f === 4 || f === 6);
        REQ(b, SYM.exec_stmt);
        c = astForExpr(a, CHILD(b, 1));
        if (f >= 4) d = astForExpr(a, CHILD(b, 3));
        if (f === 6) e = astForExpr(a, CHILD(b, 5));
        return new Exec(c, d, e, b.lineno, b.col_offset)
    }

    function astForIfStmt(a, b) {
        REQ(b, SYM.if_stmt);
        if (NCH(b) === 4) return new If_(astForExpr(a, CHILD(b, 1)), astForSuite(a, CHILD(b, 3)), [], b.lineno, b.col_offset);
        var c = CHILD(b, 4).value.charAt(2);
        if (c === "s") return new If_(astForExpr(a, CHILD(b, 1)), astForSuite(a, CHILD(b, 3)), astForSuite(a, CHILD(b, 6)), b.lineno, b.col_offset);
        else if (c === "i") {
            c = NCH(b) - 4;
            var d = false,
                e = [];
            if (CHILD(b, c + 1).type === TOK.T_NAME && CHILD(b, c + 1).value.charAt(2) === "s") {
                d = true;
                c -= 3
            }
            c /= 4;
            if (d) {
                e = [new If_(astForExpr(a, CHILD(b, NCH(b) - 6)), astForSuite(a,
                CHILD(b, NCH(b) - 4)), astForSuite(a, CHILD(b, NCH(b) - 1)), CHILD(b, NCH(b) - 6).lineno, CHILD(b, NCH(b) - 6).col_offset)];
                c--
            }
            for (d = 0; d < c; ++d) {
                var f = 5 + (c - d - 1) * 4;
                e = [new If_(astForExpr(a, CHILD(b, f)), astForSuite(a, CHILD(b, f + 2)), e, CHILD(b, f).lineno, CHILD(b, f).col_offset)]
            }
            return new If_(astForExpr(a, CHILD(b, 1)), astForSuite(a, CHILD(b, 3)), e, b.lineno, b.col_offset)
        }
        goog.asserts.fail("unexpected token in 'if' statement")
    }

    function astForExprlist(a, b, c) {
        REQ(b, SYM.exprlist);
        for (var d = [], e = 0; e < NCH(b); e += 2) {
            var f = astForExpr(a, CHILD(b, e));
            d[e / 2] = f;
            c && setContext(a, f, c, CHILD(b, e))
        }
        return d
    }
    function astForDelStmt(a, b) {
        REQ(b, SYM.del_stmt);
        return new Delete_(astForExprlist(a, CHILD(b, 1), Del), b.lineno, b.col_offset)
    }
    function astForGlobalStmt(a, b) {
        REQ(b, SYM.global_stmt);
        for (var c = [], d = 1; d < NCH(b); d += 2) c[(d - 1) / 2] = strobj(CHILD(b, d).value);
        return new Global(c, b.lineno, b.col_offset)
    }

    function astForAssertStmt(a, b) {
        REQ(b, SYM.assert_stmt);
        if (NCH(b) === 2) return new Assert(astForExpr(a, CHILD(b, 1)), null, b.lineno, b.col_offset);
        else if (NCH(b) === 4) return new Assert(astForExpr(a, CHILD(b, 1)), astForExpr(a, CHILD(b, 3)), b.lineno, b.col_offset);
        goog.asserts.fail("improper number of parts to assert stmt")
    }

    function aliasForImportName(a, b) {
        a: for (;;) switch (b.type) {
        case SYM.import_as_name:
            var c = null,
                d = strobj(CHILD(b, 0).value);
            if (NCH(b) === 3) c = CHILD(b, 2).value;
            return new alias(d, c == null ? null : strobj(c));
        case SYM.dotted_as_name:
            if (NCH(b) === 1) {
                b = CHILD(b, 0);
                continue a
            } else {
                c = aliasForImportName(a, CHILD(b, 0));
                goog.asserts.assert(!c.asname);
                c.asname = strobj(CHILD(b, 2).value);
                return c
            }
        case SYM.dotted_name:
            if (NCH(b) === 1) return new alias(strobj(CHILD(b, 0).value), null);
            else {
                c = "";
                for (d = 0; d < NCH(b); d += 2) c += CHILD(b, d).value + ".";
                return new alias(strobj(c.substr(0, c.length - 1)), null)
            }
        case TOK.T_STAR:
            return new alias(strobj("*"), null);
        default:
            throw new Sk.builtin.SyntaxError("unexpected import name");
        }
    }

    function astForImportStmt(a, b) {
        REQ(b, SYM.import_stmt);
        var c = b.lineno,
            d = b.col_offset;
        b = CHILD(b, 0);
        if (b.type === SYM.import_name) {
            b = CHILD(b, 1);
            REQ(b, SYM.dotted_as_names);
            for (var e = [], f = 0; f < NCH(b); f += 2) e[f / 2] = aliasForImportName(a, CHILD(b, f));
            return new Import_(e, c, d)
        } else if (b.type === SYM.import_from) {
            var g = null,
                h = 0;
            for (e = 1; e < NCH(b); ++e) {
                if (CHILD(b, e).type === SYM.dotted_name) {
                    g = aliasForImportName(a, CHILD(b, e));
                    e++;
                    break
                } else if (CHILD(b, e).type !== TOK.T_DOT) break;
                h++
            }++e;
            switch (CHILD(b, e).type) {
            case TOK.T_STAR:
                b = CHILD(b, e);
                break;
            case TOK.T_LPAR:
                b = CHILD(b, e + 1);
                NCH(b);
                break;
            case SYM.import_as_names:
                b = CHILD(b, e);
                e = NCH(b);
                if (e % 2 === 0) throw new Sk.builtin.SyntaxError("trailing comma not allowed without surrounding parentheses");
                break;
            default:
                throw new Sk.builtin.SyntaxError("Unexpected node-type in from-import");
            }
            e = [];
            if (b.type === TOK.T_STAR) e[0] = aliasForImportName(a, b);
            else for (f = 0; f < NCH(b); f += 2) e[f / 2] = aliasForImportName(a, CHILD(b, f));
            return new ImportFrom(strobj(g ? g.name.v : ""), e, h, c, d)
        }
        throw new Sk.builtin.SyntaxError("unknown import statement");
    }
    function astForTestlistGexp(a, b) {
        goog.asserts.assert(b.type === SYM.testlist_gexp || b.type === SYM.argument);
        if (NCH(b) > 1 && CHILD(b, 1).type === SYM.gen_for) return astForGenexp(a, b);
        return astForTestlist(a, b)
    }

    function astForListcomp(a, b) {
        function c(m, o) {
            for (var r = 0;;) {
                REQ(o, SYM.list_iter);
                if (CHILD(o, 0).type === SYM.list_for) return r;
                o = CHILD(o, 0);
                REQ(o, SYM.list_if);
                r++;
                if (NCH(o) == 2) return r;
                o = CHILD(o, 2)
            }
        }
        REQ(b, SYM.listmaker);
        goog.asserts.assert(NCH(b) > 1);
        for (var d = astForExpr(a, CHILD(b, 0)), e = function (m, o) {
            var r = 0,
                q = CHILD(o, 1);
            a: for (;;) {
                r++;
                REQ(q, SYM.list_for);
                if (NCH(q) === 5) q = CHILD(q, 4);
                else return r;
                b: for (;;) {
                    REQ(q, SYM.list_iter);
                    q = CHILD(q, 0);
                    if (q.type === SYM.list_for) continue a;
                    else if (q.type === SYM.list_if) if (NCH(q) === 3) {
                        q = CHILD(q, 2);
                        continue b
                    } else return r;
                    break
                }
                break
            }
        }(a, b), f = [], g = CHILD(b, 1), h = 0; h < e; ++h) {
            REQ(g, SYM.list_for);
            var i = CHILD(g, 1),
                j = astForExprlist(a, i, Store),
                k = astForTestlist(a, CHILD(g, 3));
            i = NCH(i) === 1 ? new comprehension(j[0], k, []) : new comprehension(new Tuple(j, Store, g.lineno, g.col_offset), k, []);
            if (NCH(g) === 5) {
                g = CHILD(g, 4);
                j = c(a, g);
                k = [];
                for (var l = 0; l < j; ++l) {
                    REQ(g, SYM.list_iter);
                    g = CHILD(g, 0);
                    REQ(g, SYM.list_if);
                    k[l] = astForExpr(a, CHILD(g, 1));
                    if (NCH(g) === 3) g = CHILD(g, 2)
                }
                if (g.type === SYM.list_iter) g = CHILD(g,
                0);
                i.ifs = k
            }
            f[h] = i
        }
        return new ListComp(d, f, b.lineno, b.col_offset)
    }

    function astForFactor(a, b) {
        if (CHILD(b, 0).type === TOK.T_MINUS && NCH(b) === 2) {
            var c = CHILD(b, 1);
            if (c.type === SYM.factor && NCH(c) === 1) {
                c = CHILD(c, 0);
                if (c.type === SYM.power && NCH(c) === 1) {
                    c = CHILD(c, 0);
                    if (c.type === SYM.atom) {
                        var d = CHILD(c, 0);
                        if (d.type === TOK.T_NUMBER) {
                            d.value = "-" + d.value;
                            return astForAtom(a, c)
                        }
                    }
                }
            }
        }
        c = astForExpr(a, CHILD(b, 1));
        switch (CHILD(b, 0).type) {
        case TOK.T_PLUS:
            return new UnaryOp(UAdd, c, b.lineno, b.col_offset);
        case TOK.T_MINUS:
            return new UnaryOp(USub, c, b.lineno, b.col_offset);
        case TOK.T_TILDE:
            return new UnaryOp(Invert,
            c, b.lineno, b.col_offset)
        }
        goog.asserts.fail("unhandled factor")
    }
    function astForForStmt(a, b) {
        var c = [];
        REQ(b, SYM.for_stmt);
        if (NCH(b) === 9) c = astForSuite(a, CHILD(b, 8));
        var d = CHILD(b, 1),
            e = astForExprlist(a, d, Store);
        d = NCH(d) === 1 ? e[0] : new Tuple(e, Store, b.lineno, b.col_offset);
        return new For_(d, astForTestlist(a, CHILD(b, 3)), astForSuite(a, CHILD(b, 5)), c, b.lineno, b.col_offset)
    }

    function astForCall(a, b, c) {
        REQ(b, SYM.arglist);
        for (var d = 0, e = 0, f = 0, g = 0; g < NCH(b); ++g) {
            var h = CHILD(b, g);
            if (h.type === SYM.argument) if (NCH(h) === 1) d++;
            else if (CHILD(h, 1).type === SYM.gen_for) f++;
            else e++
        }
        if (f > 1 || f && (d || e)) throw new Sk.builtin.SyntaxError("Generator expression must be parenthesized if not sole argument");
        if (d + e + f > 255) throw new Sk.builtin.SyntaxError("more than 255 arguments");
        f = [];
        var i = [];
        e = d = 0;
        var j = null,
            k = null;
        for (g = 0; g < NCH(b); ++g) {
            h = CHILD(b, g);
            if (h.type === SYM.argument) if (NCH(h) === 1) {
                if (e) throw new Sk.builtin.SyntaxError("non-keyword arg after keyword arg");
                if (j) throw new Sk.builtin.SyntaxError("only named arguments may follow *expression");
                f[d++] = astForExpr(a, CHILD(h, 0))
            } else if (CHILD(h, 1).type === SYM.gen_for) f[d++] = astForGenexp(a, h);
            else {
                var l = astForExpr(a, CHILD(h, 0));
                if (l.constructor === Lambda) throw new Sk.builtin.SyntaxError("lambda cannot contain assignment");
                else if (l.constructor !== Name) throw new Sk.builtin.SyntaxError("keyword can't be an expression");
                l = l.id;
                forbiddenCheck(a, CHILD(h, 0), l);
                for (var m = 0; m < e; ++m) if (i[m].arg === l) throw new Sk.builtin.SyntaxError("keyword argument repeated");
                i[e++] = new keyword(l, astForExpr(a, CHILD(h, 2)))
            } else if (h.type === TOK.T_STAR) j = astForExpr(a, CHILD(b, ++g));
            else if (h.type === TOK.T_DOUBLESTAR) k = astForExpr(a, CHILD(b, ++g))
        }
        return new Call(c, f, i, j, k, c.lineno, c.col_offset)
    }

    function astForTrailer(a, b, c) {
        REQ(b, SYM.trailer);
        if (CHILD(b, 0).type === TOK.T_LPAR) return NCH(b) === 2 ? new Call(c, [], [], null, null, b.lineno, b.col_offset) : astForCall(a, CHILD(b, 1), c);
        else if (CHILD(b, 0).type === TOK.T_DOT) return new Attribute(c, strobj(CHILD(b, 1).value), Load, b.lineno, b.col_offset);
        else {
            REQ(CHILD(b, 0), TOK.T_LSQB);
            REQ(CHILD(b, 2), TOK.T_RSQB);
            b = CHILD(b, 1);
            if (NCH(b) === 1) return new Subscript(c, astForSlice(a, CHILD(b, 0)), Load, b.lineno, b.col_offset);
            else {
                for (var d = true, e = [], f = 0; f < NCH(b); f += 2) {
                    var g = astForSlice(a, CHILD(b, f));
                    if (g.constructor !== Index) d = false;
                    e[f / 2] = g
                }
                if (!d) return new Subscript(c, new ExtSlice(e), Load, b.lineno, b.col_offset);
                a = [];
                for (f = 0; f < e.length; ++f) {
                    g = e[f];
                    goog.asserts.assert(g.constructor === Index && g.value !== null && g.value !== undefined);
                    a[f] = g.value
                }
                e = new Tuple(a, Load, b.lineno, b.col_offset);
                return new Subscript(c, new Index(e), Load, b.lineno, b.col_offset)
            }
        }
    }

    function astForFlowStmt(a, b) {
        var c;
        REQ(b, SYM.flow_stmt);
        c = CHILD(b, 0);
        switch (c.type) {
        case SYM.break_stmt:
            return new Break_(b.lineno, b.col_offset);
        case SYM.continue_stmt:
            return new Continue_(b.lineno, b.col_offset);
        case SYM.yield_stmt:
            return new Expr(astForExpr(a, CHILD(c, 0)), b.lineno, b.col_offset);
        case SYM.return_stmt:
            return NCH(c) === 1 ? new Return_(null, b.lineno, b.col_offset) : new Return_(astForTestlist(a, CHILD(c, 1)), b.lineno, b.col_offset);
        case SYM.raise_stmt:
            if (NCH(c) === 1) return new Raise(null, null, null,
            b.lineno, b.col_offset);
            else if (NCH(c) === 2) return new Raise(astForExpr(a, CHILD(c, 1)), null, null, b.lineno, b.col_offset);
            else if (NCH(c) === 4) return new Raise(astForExpr(a, CHILD(c, 1)), astForExpr(a, CHILD(c, 3)), null, b.lineno, b.col_offset);
            else if (NCH(c) === 6) return new Raise(astForExpr(a, CHILD(c, 1)), astForExpr(a, CHILD(c, 3)), astForExpr(a, CHILD(c, 5)), b.lineno, b.col_offset);
        default:
            goog.asserts.fail("unexpected flow_stmt")
        }
        goog.asserts.fail("unhandled flow statement")
    }

    function astForArguments(a, b) {
        var c, d = null,
            e = null;
        if (b.type === SYM.parameters) {
            if (NCH(b) === 2) return new arguments_([], null, null, []);
            b = CHILD(b, 1)
        }
        REQ(b, SYM.varargslist);
        for (var f = [], g = [], h = false, i = 0, j = 0, k = 0; i < NCH(b);) {
            c = CHILD(b, i);
            switch (c.type) {
            case SYM.fpdef:
                var l = 0;
                a: for (;;) {
                    if (i + 1 < NCH(b) && CHILD(b, i + 1).type === TOK.T_EQUAL) {
                        g[j++] = astForExpr(a, CHILD(b, i + 2));
                        i += 2;
                        h = true
                    } else if (h) {
                        if (l) throw new Sk.builtin.SyntaxError("parenthesized arg with default");
                        throw new Sk.builtin.SyntaxError("non-default argument follows default argument");
                    }
                    if (NCH(c) === 3) {
                        c = CHILD(c, 1);
                        if (NCH(c) !== 1) throw new Sk.builtin.SyntaxError("tuple parameter unpacking has been removed", this.c_filename, b.lineno);
                        else {
                            l = true;
                            c = CHILD(c, 0);
                            goog.asserts.assert(c.type === SYM.fpdef);
                            continue a
                        }
                    }
                    if (CHILD(c, 0).type === TOK.T_NAME) {
                        forbiddenCheck(a, b, CHILD(c, 0).value);
                        var m = strobj(CHILD(c, 0).value);
                        f[k++] = new Name(m, Param, c.lineno, c.col_offset)
                    }
                    i += 2;
                    if (l) throw new Sk.builtin.SyntaxError("parenthesized argument names are invalid");
                    break
                }
                break;
            case TOK.T_STAR:
                forbiddenCheck(a,
                CHILD(b, i + 1), CHILD(b, i + 1).value);
                d = strobj(CHILD(b, i + 1).value);
                i += 3;
                break;
            case TOK.T_DOUBLESTAR:
                forbiddenCheck(a, CHILD(b, i + 1), CHILD(b, i + 1).value);
                e = strobj(CHILD(b, i + 1).value);
                i += 3;
                break;
            default:
                goog.asserts.fail("unexpected node in varargslist")
            }
        }
        return new arguments_(f, d, e, g)
    }

    function astForFuncdef(a, b, c) {
        REQ(b, SYM.funcdef);
        var d = strobj(CHILD(b, 1).value);
        forbiddenCheck(a, CHILD(b, 1), CHILD(b, 1).value);
        var e = astForArguments(a, CHILD(b, 2));
        a = astForSuite(a, CHILD(b, 4));
        return new FunctionDef(d, e, a, c, b.lineno, b.col_offset)
    }
    function astForClassBases(a, b) {
        goog.asserts.assert(NCH(b) > 0);
        REQ(b, SYM.testlist);
        if (NCH(b) === 1) return [astForExpr(a, CHILD(b, 0))];
        return seqForTestlist(a, b)
    }

    function astForClassdef(a, b, c) {
        REQ(b, SYM.classdef);
        forbiddenCheck(a, b, CHILD(b, 1).value);
        var d = strobj(CHILD(b, 1).value);
        if (NCH(b) === 4) return new ClassDef(d, [], astForSuite(a, CHILD(b, 3)), c, b.lineno, b.col_offset);
        if (CHILD(b, 3).type === TOK.T_RPAR) return new ClassDef(d, [], astForSuite(a, CHILD(b, 5)), c, b.lineno, b.col_offset);
        var e = astForClassBases(a, CHILD(b, 3));
        a = astForSuite(a, CHILD(b, 6));
        return new ClassDef(d, e, a, c, b.lineno, b.col_offset)
    }

    function astForLambdef(a, b) {
        var c, d;
        if (NCH(b) === 3) {
            c = new arguments_([], null, null, []);
            d = astForExpr(a, CHILD(b, 2))
        } else {
            c = astForArguments(a, CHILD(b, 1));
            d = astForExpr(a, CHILD(b, 3))
        }
        return new Lambda(c, d, b.lineno, b.col_offset)
    }

    function astForGenexp(a, b) {
        function c(o, r) {
            for (var q = 0;;) {
                REQ(r, SYM.gen_iter);
                if (CHILD(r, 0).type === SYM.gen_for) return q;
                r = CHILD(r, 0);
                REQ(r, SYM.gen_if);
                q++;
                if (NCH(r) == 2) return q;
                r = CHILD(r, 2)
            }
        }
        goog.asserts.assert(b.type === SYM.testlist_gexp || b.type === SYM.argument);
        goog.asserts.assert(NCH(b) > 1);
        for (var d = astForExpr(a, CHILD(b, 0)), e = function (o, r) {
            var q = 0,
                n = CHILD(r, 1);
            a: for (;;) {
                q++;
                REQ(n, SYM.gen_for);
                if (NCH(n) === 5) n = CHILD(n, 4);
                else return q;
                b: for (;;) {
                    REQ(n, SYM.gen_iter);
                    n = CHILD(n, 0);
                    if (n.type === SYM.gen_for) continue a;
                    else if (n.type === SYM.gen_if) if (NCH(n) === 3) {
                        n = CHILD(n, 2);
                        continue b
                    } else return q;
                    break
                }
                break
            }
            goog.asserts.fail("logic error in countGenFors")
        }(a, b), f = [], g = CHILD(b, 1), h = 0; h < e; ++h) {
            REQ(g, SYM.gen_for);
            var i = CHILD(g, 1),
                j = astForExprlist(a, i, Store),
                k = astForExpr(a, CHILD(g, 3));
            i = NCH(i) === 1 ? new comprehension(j[0], k, []) : new comprehension(new Tuple(j, Store, g.lineno, g.col_offset), k, []);
            if (NCH(g) === 5) {
                g = CHILD(g, 4);
                j = c(a, g);
                for (var l = [], m = 0; m < j; ++m) {
                    REQ(g, SYM.gen_iter);
                    g = CHILD(g, 0);
                    REQ(g, SYM.gen_if);
                    k = astForExpr(a,
                    CHILD(g, 1));
                    l[m] = k;
                    if (NCH(g) === 3) g = CHILD(g, 2)
                }
                if (g.type === SYM.gen_iter) g = CHILD(g, 0);
                i.ifs = l
            }
            f[h] = i
        }
        return new GeneratorExp(d, f, b.lineno, b.col_offset)
    }

    function astForWhileStmt(a, b) {
        REQ(b, SYM.while_stmt);
        if (NCH(b) === 4) return new While_(astForExpr(a, CHILD(b, 1)), astForSuite(a, CHILD(b, 3)), [], b.lineno, b.col_offset);
        else if (NCH(b) === 7) return new While_(astForExpr(a, CHILD(b, 1)), astForSuite(a, CHILD(b, 3)), astForSuite(a, CHILD(b, 6)), b.lineno, b.col_offset);
        goog.asserts.fail("wrong number of tokens for 'while' stmt")
    }

    function astForAugassign(a, b) {
        REQ(b, SYM.augassign);
        b = CHILD(b, 0);
        switch (b.value.charAt(0)) {
        case "+":
            return Add;
        case "-":
            return Sub;
        case "/":
            if (b.value.charAt(1) === "/") return FloorDiv;
            return Div;
        case "%":
            return Mod;
        case "<":
            return LShift;
        case ">":
            return RShift;
        case "&":
            return BitAnd;
        case "^":
            return BitXor;
        case "|":
            return BitOr;
        case "*":
            if (b.value.charAt(1) === "*") return Pow;
            return Mult;
        default:
            goog.asserts.fail("invalid augassign")
        }
    }

    function astForBinop(a, b) {
        for (var c = new BinOp(astForExpr(a, CHILD(b, 0)), getOperator(CHILD(b, 1)), astForExpr(a, CHILD(b, 2)), b.lineno, b.col_offset), d = (NCH(b) - 1) / 2, e = 1; e < d; ++e) {
            var f = CHILD(b, e * 2 + 1),
                g = getOperator(f),
                h = astForExpr(a, CHILD(b, e * 2 + 2));
            c = new BinOp(c, g, h, f.lineno, f.col_offset)
        }
        return c
    }

    function astForTestlist(a, b) {
	
        goog.asserts.assert(NCH(b) > 0);
        if (b.type === SYM.testlist_gexp) NCH(b) > 1 && goog.asserts.assert(CHILD(b, 1).type !== SYM.gen_for);
        else goog.asserts.assert(b.type === SYM.testlist || b.type === SYM.testlist_safe || b.type === SYM.testlist1);
        return NCH(b) === 1 ? astForExpr(a, CHILD(b, 0)) : new Tuple(seqForTestlist(a, b), Load, b.lineno, b.col_offset)
    }

    function astForExprStmt(a, b) {
	
        REQ(b, SYM.expr_stmt);
        if (NCH(b) === 1) return new Expr(astForTestlist(a, CHILD(b, 0)), b.lineno, b.col_offset);
        else if (CHILD(b, 1).type === SYM.augassign) {
            var c = CHILD(b, 0),
                d = astForTestlist(a, c);
            switch (d.constructor) {
            case GeneratorExp:
                throw new Sk.builtin.SyntaxError("augmented assignment to generator expression not possible");
            case Yield:
                throw new Sk.builtin.SyntaxError("augmented assignment to yield expression not possible");
            case Name:
                forbiddenCheck(a, c, d.id);
                break;
            case Attribute:
            case Subscript:
                break;
            default:
                throw new Sk.builtin.SyntaxError("illegal expression for augmented assignment");
            }
            setContext(a, d, Store, c);
            c = CHILD(b, 2);
            c = c.type === SYM.testlist ? astForTestlist(a, c) : astForExpr(a, c);
            return new AugAssign(d, astForAugassign(a, CHILD(b, 1)), c, b.lineno, b.col_offset)
        } else {
            REQ(CHILD(b, 1), TOK.T_EQUAL);
            d = [];
            for (var e = 0; e < NCH(b) - 2; e += 2) {
                c = CHILD(b, e);
                if (c.type === SYM.yield_expr) throw new Sk.builtin.SyntaxError("assignment to yield expression not possible");
                c = astForTestlist(a, c);
                setContext(a, c, Store, CHILD(b,
                e));
                d[e / 2] = c
            }
            c = CHILD(b, NCH(b) - 1);
            c = c.type === SYM.testlist ? astForTestlist(a, c) : astForExpr(a, c);
            return new Assign(d, c, b.lineno, b.col_offset)
        }
    }
    function astForIfexpr(a, b) {
        goog.asserts.assert(NCH(b) === 5);
        return new IfExp(astForExpr(a, CHILD(b, 2)), astForExpr(a, CHILD(b, 0)), astForExpr(a, CHILD(b, 4)), b.lineno, b.col_offset)
    }

    function parsestr(a, b) {
        var c = b.charAt(0),
            d = false;
        if (c === "u" || c === "U") {
            b = b.substr(1);
            c = b.charAt(0)
        } else if (c === "r" || c === "R") {
            b = b.substr(1);
            c = b.charAt(0);
            d = true
        }
        goog.asserts.assert(c !== "b" && c !== "B", "todo; haven't done b'' strings yet");
        goog.asserts.assert(c === "'" || c === '"' && b.charAt(b.length - 1) === c);
        b = b.substr(1, b.length - 2);
        if (b.length >= 4 && b.charAt(0) === c && b.charAt(1) === c) {
            goog.asserts.assert(b.charAt(b.length - 1) === c && b.charAt(b.length - 2) === c);
            b = b.substr(2, b.length - 4)
        }
        if (d || b.indexOf("\\") === -1) return strobj(decodeURIComponent(escape(b)));
        return strobj(function (e) {
            for (var f = e.length, g = "", h = 0; h < f; ++h) {
                var i = e[h];
                if (i === "\\") {
                    ++h;
                    i = e[h];
                    if (i === "n") g += "\n";
                    else if (i === "\\") g += "\\";
                    else if (i === "t") g += "\t";
                    else if (i === "r") g += "\r";
                    else if (i === "0") g += "\u0000";
                    else if (i === '"') g += '"';
                    else if (i === "'") g += "'";
                    else if (i !== "\n") if (i === "x") {
                        i = e[++h];
                        var j = e[++h];
                        g += String.fromCharCode(parseInt(i + j, 16))
                    } else if (i === "u" || i === "U") {
                        i = e[++h];
                        j = e[++h];
                        var k = e[++h],
                            l = e[++h];
                        g += String.fromCharCode(parseInt(i + j, 16), parseInt(k + l, 16))
                    } else goog.asserts.fail("unhandled escape: '" + i.charCodeAt(0) + "'")
                } else g += i
            }
            return g
        }(b, c))
    }
    function parsestrplus(a, b) {
        REQ(CHILD(b, 0), TOK.T_STRING);
        for (var c = new Sk.builtin.str(""), d = 0; d < NCH(b); ++d) c = c.sq$concat(parsestr(a, CHILD(b, d).value));
        return c
    }

    function parsenumber(a, b) {
        var c = b.charAt(b.length - 1);
        if (c === "l" || c === "L") return Sk.longFromStr(b.substr(0, b.length - 1));
        c = goog.global.eval(b);
        if ((c > Sk.builtin.lng.threshold$ || c < -Sk.builtin.lng.threshold$) && Math.floor(c) === c && b.indexOf("e") === -1 && b.indexOf("E") === -1) return Sk.longFromStr(b);
        if (b.indexOf(".") !== -1 || b.indexOf("e") !== -1 || b.indexOf("E") !== -1) return parseFloat(b);
        c = b;
        if (b.charAt(0) === "-") c = b.substr(1);
        return c.charAt(0) === "0" && (c.charAt(1) === "x" || c.charAt(1) === "X") ? parseInt(b, 16) : c.charAt(0) === "0" && (c.charAt(1) === "b" || c.charAt(1) === "B") ? parseInt(b, 2) : c.charAt(0) === "0" ? parseInt(b, 8) : parseInt(b, 10)
    }

    function astForSlice(a, b) {
        REQ(b, SYM.subscript);
        var c = CHILD(b, 0),
            d = null,
            e = null,
            f = null;
        if (c.type === TOK.T_DOT) return new Ellipsis;
        if (NCH(b) === 1 && c.type === SYM.test) return new Index(astForExpr(a, c));
        if (c.type === SYM.test) d = astForExpr(a, c);
        if (c.type === TOK.T_COLON) {
            if (NCH(b) > 1) {
                c = CHILD(b, 1);
                if (c.type === SYM.test) e = astForExpr(a, c)
            }
        } else if (NCH(b) > 2) {
            c = CHILD(b, 2);
            if (c.type === SYM.test) e = astForExpr(a, c)
        }
        c = CHILD(b, NCH(b) - 1);
        if (c.type === SYM.sliceop) if (NCH(c) === 1) {
            c = CHILD(c, 0);
            f = new Name(strobj("None"), Load, c.lineno,
            c.col_offset)
        } else {
            c = CHILD(c, 1);
            if (c.type === SYM.test) f = astForExpr(a, c)
        }
        return new Slice(d, e, f)
    }

    function astForAtom(a, b) {
	
        var c = CHILD(b, 0);
        switch (c.type) {
        case TOK.T_NAME:
            return new Name(strobj(c.value), Load, b.lineno, b.col_offset);
        case TOK.T_STRING:
            return new Str(parsestrplus(a, b), b.lineno, b.col_offset);
        case TOK.T_NUMBER:
            return new Num(parsenumber(a, c.value), b.lineno, b.col_offset);
        case TOK.T_LPAR:
            c = CHILD(b, 1);
            if (c.type === TOK.T_RPAR) return new Tuple([], Load, b.lineno, b.col_offset);
            if (c.type === SYM.yield_expr) return astForExpr(a, c);
            if (NCH(c) > 1 && CHILD(c, 1).type === SYM.gen_for) return astForGenexp(a,
            c);
            return astForTestlistGexp(a, c);
        case TOK.T_LSQB:
            c = CHILD(b, 1);
            if (c.type === TOK.T_RSQB) return new List([], Load, b.lineno, b.col_offset);
            REQ(c, SYM.listmaker);
            return NCH(c) === 1 || CHILD(c, 1).type === TOK.T_COMMA ? new List(seqForTestlist(a, c), Load, b.lineno, b.col_offset) : astForListcomp(a, c);
        case TOK.T_LBRACE:
            c = CHILD(b, 1);
            NCH(c);
            for (var d = [], e = [], f = 0; f < NCH(c); f += 4) {
                d[f / 4] = astForExpr(a, CHILD(c, f));
                e[f / 4] = astForExpr(a, CHILD(c, f + 2))
            }
            return new Dict(d, e, b.lineno, b.col_offset);
        case TOK.T_BACKQUOTE:
            throw new Sk.builtin.SyntaxError("backquote not supported, use repr()");
        default:
            goog.asserts.fail("unhandled atom", c.type)
        }
    }
    function astForPower(a, b) {
	
        REQ(b, SYM.power);
        var c = astForAtom(a, CHILD(b, 0));
        if (NCH(b) === 1) return c;
        for (var d = 1; d < NCH(b); ++d) {
            var e = CHILD(b, d);
            if (e.type !== SYM.trailer) break;
            e = astForTrailer(a, e, c);
            e.lineno = c.lineno;
            e.col_offset = c.col_offset;
            c = e
        }
        if (CHILD(b, NCH(b) - 1).type === SYM.factor) {
            d = astForExpr(a, CHILD(b, NCH(b) - 1));
            c = new BinOp(c, Pow, d, b.lineno, b.col_offset)
        }
        return c
    }

    function astForExpr(a, b) {
	
        a: for (;;) {
            switch (b.type) {
            case SYM.test:
            case SYM.old_test:
                if (CHILD(b, 0).type === SYM.lambdef || CHILD(b, 0).type === SYM.old_lambdef) return astForLambdef(a, CHILD(b, 0));
                else if (NCH(b) > 1) return astForIfexpr(a, b);
            case SYM.or_test:
            case SYM.and_test:
                if (NCH(b) === 1) {
                    b = CHILD(b, 0);
                    continue a
                }
                for (var c = [], d = 0; d < NCH(b); d += 2) c[d / 2] = astForExpr(a, CHILD(b, d));
                if (CHILD(b, 1).value === "and") return new BoolOp(And, c, b.lineno, b.col_offset);
                goog.asserts.assert(CHILD(b, 1).value === "or");
                return new BoolOp(Or,
                c, b.lineno, b.col_offset);
            case SYM.not_test:
                if (NCH(b) === 1) {
                    b = CHILD(b, 0);
                    continue a
                } else return new UnaryOp(Not, astForExpr(a, CHILD(b, 1)), b.lineno, b.col_offset);
            case SYM.comparison:
                if (NCH(b) === 1) {
                    b = CHILD(b, 0);
                    continue a
                } else {
                    c = [];
                    var e = [];
                    for (d = 1; d < NCH(b); d += 2) {
                        c[(d - 1) / 2] = astForCompOp(a, CHILD(b, d));
                        e[(d - 1) / 2] = astForExpr(a, CHILD(b, d + 1))
                    }
                    return new Compare(astForExpr(a, CHILD(b, 0)), c, e, b.lineno, b.col_offset)
                }
            case SYM.expr:
            case SYM.xor_expr:
            case SYM.and_expr:
            case SYM.shift_expr:
            case SYM.arith_expr:
            case SYM.term:
                if (NCH(b) === 1) {
                    b = CHILD(b, 0);
                    continue a
                }
                return astForBinop(a, b);
            case SYM.yield_expr:
                d = null;
                if (NCH(b) === 2) d = astForTestlist(a, CHILD(b, 1));
                return new Yield(d, b.lineno, b.col_offset);
            case SYM.factor:
                if (NCH(b) === 1) {
                    b = CHILD(b, 0);
                    continue a
                }
                return astForFactor(a, b);
            case SYM.power:
                return astForPower(a, b);
            default:
                goog.asserts.fail("unhandled expr", "n.type: %d", b.type)
            }
            break
        }
    }

    function astForPrintStmt(a, b) {
        var c = 1,
            d = null;
        REQ(b, SYM.print_stmt);
        if (NCH(b) >= 2 && CHILD(b, 1).type === TOK.T_RIGHTSHIFT) {
            d = astForExpr(a, CHILD(b, 2));
            c = 4
        }
        var e = [];
        c = c;
        for (var f = 0; c < NCH(b); c += 2, ++f) e[f] = astForExpr(a, CHILD(b, c));
        c = CHILD(b, NCH(b) - 1).type === TOK.T_COMMA ? false : true;
        return new Print(d, e, c, b.lineno, b.col_offset)
    }

    function astForStmt(a, b) {
	
        if (b.type === SYM.stmt) {
            goog.asserts.assert(NCH(b) === 1);
            b = CHILD(b, 0)
        }
        if (b.type === SYM.simple_stmt) {
            goog.asserts.assert(numStmts(b) === 1);
            b = CHILD(b, 0)
        }
        if (b.type === SYM.small_stmt) {
            REQ(b, SYM.small_stmt);
            b = CHILD(b, 0);
            switch (b.type) {
            case SYM.expr_stmt:
                return astForExprStmt(a, b);
            case SYM.print_stmt:
                return astForPrintStmt(a, b);
            case SYM.del_stmt:
                return astForDelStmt(a, b);
            case SYM.pass_stmt:
                return new Pass(b.lineno, b.col_offset);
            case SYM.flow_stmt:
                return astForFlowStmt(a, b);
            case SYM.import_stmt:
                return astForImportStmt(a,
                b);
            case SYM.global_stmt:
                return astForGlobalStmt(a, b);
            case SYM.exec_stmt:
                return astForExecStmt(a, b);
            case SYM.assert_stmt:
                return astForAssertStmt(a, b);
            default:
                goog.asserts.fail("unhandled small_stmt")
            }
        } else {
            var c = CHILD(b, 0);
            REQ(b, SYM.compound_stmt);
            switch (c.type) {
            case SYM.if_stmt:
                return astForIfStmt(a, c);
            case SYM.while_stmt:
                return astForWhileStmt(a, c);
            case SYM.for_stmt:
                return astForForStmt(a, c);
            case SYM.try_stmt:
                return astForTryStmt(a, c);
            case SYM.with_stmt:
                return astForWithStmt(a, c);
            case SYM.funcdef:
                return astForFuncdef(a,
                c, []);
            case SYM.classdef:
                return astForClassdef(a, c, []);
            case SYM.decorated:
                return astForDecorated(a, c);
            default:
                goog.asserts.assert("unhandled compound_stmt")
            }
        }
    }
    Sk.astFromParse = function (a, b) {
        var c = new Compiling("utf-8", b),
            d = [],
            e, f = 0;
        switch (a.type) {
        case SYM.file_input:
            for (var g = 0; g < NCH(a) - 1; ++g) {
                e = CHILD(a, g);
                if (a.type !== TOK.T_NEWLINE) {
                    REQ(e, SYM.stmt);
                    var h = numStmts(e);
                    if (h === 1) d[f++] = astForStmt(c, e);
                    else {
                        e = CHILD(e, 0);
                        REQ(e, SYM.simple_stmt);
                        for (var i = 0; i < h; ++i) d[f++] = astForStmt(c, CHILD(e, i * 2))
                    }
                }
            }
            return new Module(d);
        case SYM.eval_input:
            goog.asserts.fail("todo;");
        case SYM.single_input:
            goog.asserts.fail("todo;");
        default:
            goog.asserts.fail("todo;")
        }
    };
    Sk.astDump = function (a) {
        var b = function (d) {
            for (var e = "", f = 0; f < d; ++f) e += " ";
            return e
        }, c = function (d, e) {
            if (d === null) return e + "None";
            else if (d.prototype && d.prototype._astname !== undefined && d.prototype._isenum) return e + d.prototype._astname + "()";
            else if (d._astname !== undefined) {
                for (var f = b(d._astname.length + 1), g = [], h = 0; h < d._fields.length; h += 2) {
                    var i = d._fields[h],
                        j = d._fields[h + 1](d),
                        k = b(i.length + 1);
                    g.push([i, c(j, e + f + k)])
                }
                i = [];
                for (h = 0; h < g.length; ++h) {
                    j = g[h];
                    i.push(j[0] + "=" + j[1].replace(/^\s+/, ""))
                }
                h = i.join(",\n" + e + f);
                return e + d._astname + "(" + h + ")"
            } else if (goog.isArrayLike(d)) {
                f = [];
                for (h = 0; h < d.length; ++h) f.push(c(d[h], e + " "));
                h = f.join(",\n");
                return e + "[" + h.replace(/^\s+/, "") + "]"
            } else {
                h = d === true ? "True" : d === false ? "False" : d instanceof Sk.builtin.lng ? d.tp$str().v : d instanceof Sk.builtin.str ? d.$r().v : "" + d;
                return e + h
            }
        };
        return c(a, "")
    };
    goog.exportSymbol("Sk.astFromParse", Sk.astFromParse);
    goog.exportSymbol("Sk.astDump", Sk.astDump);
    var DEF_GLOBAL = 1,
        DEF_LOCAL = 2,
        DEF_PARAM = 4,
        USE = 8,
        DEF_STAR = 16,
        DEF_DOUBLESTAR = 32,
        DEF_INTUPLE = 64,
        DEF_FREE = 128,
        DEF_FREE_GLOBAL = 256,
        DEF_FREE_CLASS = 512,
        DEF_IMPORT = 1024,
        DEF_BOUND = DEF_LOCAL | DEF_PARAM | DEF_IMPORT,
        SCOPE_OFF = 11,
        SCOPE_MASK = 7,
        LOCAL = 1,
        GLOBAL_EXPLICIT = 2,
        GLOBAL_IMPLICIT = 3,
        FREE = 4,
        CELL = 5,
        OPT_IMPORT_STAR = 1,
        OPT_EXEC = 2,
        OPT_BARE_EXEC = 4,
        OPT_TOPLEVEL = 8,
        GENERATOR = 2,
        GENERATOR_EXPRESSION = 2,
        ModuleBlock = "module",
        FunctionBlock = "function",
        ClassBlock = "class";

    function Symbol(a, b, c) {
        this.__name = a;
        this.__flags = b;
        this.__scope = b >> SCOPE_OFF & SCOPE_MASK;
        this.__namespaces = c || []
    }
    Symbol.prototype.get_name = function () {
        return this.__name
    };
    Symbol.prototype.is_referenced = function () {
        return !!(this.__flags & USE)
    };
    Symbol.prototype.is_parameter = function () {
        return !!(this.__flags & DEF_PARAM)
    };
    Symbol.prototype.is_global = function () {
        return this.__scope === GLOBAL_IMPLICIT || this.__scope == GLOBAL_EXPLICIT
    };
    Symbol.prototype.is_declared_global = function () {
        return this.__scope == GLOBAL_EXPLICIT
    };
    Symbol.prototype.is_local = function () {
        return !!(this.__flags & DEF_BOUND)
    };
    Symbol.prototype.is_free = function () {
        return this.__scope == FREE
    };
    Symbol.prototype.is_imported = function () {
        return !!(this.__flags & DEF_IMPORT)
    };
    Symbol.prototype.is_assigned = function () {
        return !!(this.__flags & DEF_LOCAL)
    };
    Symbol.prototype.is_namespace = function () {
        return this.__namespaces && this.__namespaces.length > 0
    };
    Symbol.prototype.get_namespaces = function () {
        return this.__namespaces
    };
    var astScopeCounter = 0;

    function SymbolTableScope(a, b, c, d, e) {
        this.symFlags = {};
        this.name = b;
        this.varnames = [];
        this.children = [];
        this.blockType = c;
        this.returnsValue = this.varkeywords = this.varargs = this.generator = this.childHasFree = this.hasFree = this.isNested = false;
        this.lineno = e;
        this.table = a;
        if (a.cur && (a.cur.nested || a.cur.blockType === FunctionBlock)) this.isNested = true;
        d.scopeId = astScopeCounter++;
        a.stss[d.scopeId] = this;
        this.symbols = {}
    }
    SymbolTableScope.prototype.get_type = function () {
        return this.blockType
    };
    SymbolTableScope.prototype.get_name = function () {
        return this.name
    };
    SymbolTableScope.prototype.get_lineno = function () {
        return this.lineno
    };
    SymbolTableScope.prototype.is_nested = function () {
        return this.isNested
    };
    SymbolTableScope.prototype.has_children = function () {
        return this.children.length > 0
    };
    SymbolTableScope.prototype.get_identifiers = function () {
        return this._identsMatching(function () {
            return true
        })
    };
    SymbolTableScope.prototype.lookup = function (a) {
        if (this.symbols.hasOwnProperty(a)) a = this.symbols[a];
        else {
            var b = this.symFlags[a],
                c = this.__check_children(a);
            a = this.symbols[a] = new Symbol(a, b, c)
        }
        return a
    };
    SymbolTableScope.prototype.__check_children = function (a) {
        for (var b = [], c = 0; c < this.children.length; ++c) {
            var d = this.children[c];
            d.name === a && b.push(d)
        }
        return b
    };
    SymbolTableScope.prototype._identsMatching = function (a) {
        var b = [],
            c;
        for (c in this.symFlags) this.symFlags.hasOwnProperty(c) && a(this.symFlags[c]) && b.push(c);
        b.sort();
        return b
    };
    SymbolTableScope.prototype.get_parameters = function () {
        goog.asserts.assert(this.get_type() == "function", "get_parameters only valid for function scopes");
        if (!this._funcParams) this._funcParams = this._identsMatching(function (a) {
            return a & DEF_PARAM
        });
        return this._funcParams
    };
    SymbolTableScope.prototype.get_locals = function () {
        goog.asserts.assert(this.get_type() == "function", "get_locals only valid for function scopes");
        if (!this._funcLocals) this._funcLocals = this._identsMatching(function (a) {
            return a & DEF_BOUND
        });
        return this._funcLocals
    };
    SymbolTableScope.prototype.get_globals = function () {
        goog.asserts.assert(this.get_type() == "function", "get_globals only valid for function scopes");
        if (!this._funcGlobals) this._funcGlobals = this._identsMatching(function (a) {
            a = a >> SCOPE_OFF & SCOPE_MASK;
            return a == GLOBAL_IMPLICIT || a == GLOBAL_EXPLICIT
        });
        return this._funcGlobals
    };
    SymbolTableScope.prototype.get_frees = function () {
        goog.asserts.assert(this.get_type() == "function", "get_frees only valid for function scopes");
        if (!this._funcFrees) this._funcFrees = this._identsMatching(function (a) {
            return (a >> SCOPE_OFF & SCOPE_MASK) == FREE
        });
        return this._funcFrees
    };
    SymbolTableScope.prototype.get_methods = function () {
        goog.asserts.assert(this.get_type() == "class", "get_methods only valid for class scopes");
        if (!this._classMethods) {
            for (var a = [], b = 0; b < this.children.length; ++b) a.push(this.children[b].name);
            a.sort();
            this._classMethods = a
        }
        return this._classMethods
    };
    SymbolTableScope.prototype.getScope = function (a) {
        a = this.symFlags[a];
        if (a === undefined) return 0;
        return a >> SCOPE_OFF & SCOPE_MASK
    };

    function SymbolTable(a) {
	
        this.filename = a;
        this.top = this.cur = null;
        this.stack = [];
        this.curClass = this.global = null;
        this.tmpname = 0;
        this.stss = {}
    }
    SymbolTable.prototype.getStsForAst = function (a) {
        goog.asserts.assert(a.scopeId !== undefined, "ast wasn't added to st?");
        a = this.stss[a.scopeId];
        goog.asserts.assert(a !== undefined, "unknown sym tab entry");
        return a
    };
    SymbolTable.prototype.SEQStmt = function (a) {
        goog.asserts.assert(goog.isArrayLike(a), "SEQ: nodes isn't array? got %s", a);
        for (var b = a.length, c = 0; c < b; ++c) {
            var d = a[c];
            d && this.visitStmt(d)
        }
    };
    SymbolTable.prototype.SEQExpr = function (a) {
        goog.asserts.assert(goog.isArrayLike(a), "SEQ: nodes isn't array? got %s", a);
        for (var b = a.length, c = 0; c < b; ++c) {
            var d = a[c];
            d && this.visitExpr(d)
        }
    };
    SymbolTable.prototype.enterBlock = function (a, b, c, d) {
        var e = null;
        if (this.cur) {
            e = this.cur;
            this.stack.push(this.cur)
        }
        this.cur = new SymbolTableScope(this, a, b, c, d);
        if (a === "top") this.global = this.cur.symFlags;
        e && e.children.push(this.cur)
    };
    SymbolTable.prototype.exitBlock = function () {
        this.cur = null;
        if (this.stack.length > 0) this.cur = this.stack.pop()
    };
    SymbolTable.prototype.visitParams = function (a, b) {
        for (var c = 0; c < a.length; ++c) {
            var d = a[c];
            if (d.constructor === Name) {
                goog.asserts.assert(d.ctx === Param || d.ctx === Store && !b);
                this.addDef(d.id, DEF_PARAM)
            } else throw new SyntaxError("invalid expression in parameter list");
        }
    };
    SymbolTable.prototype.visitArguments = function (a) {
        a.args && this.visitParams(a.args, true);
        if (a.vararg) {
            this.addDef(a.vararg, DEF_PARAM);
            this.cur.varargs = true
        }
        if (a.kwarg) {
            this.addDef(a.kwarg, DEF_PARAM);
            this.cur.varkeywords = true
        }
    };
    SymbolTable.prototype.newTmpname = function () {
        this.addDef(new Sk.builtin.str("_[" + ++this.tmpname + "]"), DEF_LOCAL)
    };
    SymbolTable.prototype.addDef = function (a, b) {
        var c = mangleName(this.curClass, new Sk.builtin.str(a)).v,
            d = this.cur.symFlags[c];
        if (d !== undefined) {
            if (b & DEF_PARAM && d & DEF_PARAM) throw new Sk.builtin.SyntaxError("duplicate argument '" + a + "' in function definition");
            d |= b
        } else d = b;
        this.cur.symFlags[c] = d;
        if (b & DEF_PARAM) this.cur.varnames.push(c);
        else if (b & DEF_GLOBAL) {
            d = b;
            var e = this.global[c];
            if (e !== undefined) d |= e;
            this.global[c] = d
        }
    };
    SymbolTable.prototype.visitSlice = function (a) {
        switch (a.constructor) {
        case Slice:
            a.lower && this.visitExpr(a.lower);
            a.upper && this.visitExpr(a.upper);
            a.step && this.visitExpr(a.step);
            break;
        case ExtSlice:
            for (var b = 0; b < a.dims.length; ++b) this.visitSlice(a.dims[b]);
            break;
        case Index:
            this.visitExpr(a.value)
        }
    };
    SymbolTable.prototype.visitStmt = function (a) {
        goog.asserts.assert(a !== undefined, "visitStmt called with undefined");
        switch (a.constructor) {
        case FunctionDef:
            this.addDef(a.name, DEF_LOCAL);
            a.args.defaults && this.SEQExpr(a.args.defaults);
            a.decorator_list && this.SEQExpr(a.decorator_list);
            this.enterBlock(a.name.v, FunctionBlock, a, a.lineno);
            this.visitArguments(a.args);
            this.SEQStmt(a.body);
            this.exitBlock();
            break;
        case ClassDef:
            this.addDef(a.name, DEF_LOCAL);
            this.SEQExpr(a.bases);
            a.decorator_list && this.SEQExpr(a.decorator_list);
            this.enterBlock(a.name.v, ClassBlock, a, a.lineno);
            var b = this.curClass;
            this.curClass = a.name;
            this.SEQStmt(a.body);
            this.curCalss = b;
            this.exitBlock();
            break;
        case Return_:
            if (a.value) {
                this.visitExpr(a.value);
                this.cur.returnsValue = true;
                if (this.cur.generator) throw new SyntaxError("'return' with argument inside generator");
            }
            break;
        case Delete_:
            this.SEQExpr(a.targets);
            break;
        case Assign:
            this.SEQExpr(a.targets);
            this.visitExpr(a.value);
            break;
        case AugAssign:
            this.visitExpr(a.target);
            this.visitExpr(a.value);
            break;
        case Print:
            a.dest && this.visitExpr(a.dest);
            this.SEQExpr(a.values);
            break;
        case For_:
            this.visitExpr(a.target);
            this.visitExpr(a.iter);
            this.SEQStmt(a.body);
            a.orelse && this.SEQStmt(a.orelse);
            break;
        case While_:
            this.visitExpr(a.test);
            this.SEQStmt(a.body);
            a.orelse && this.SEQStmt(a.orelse);
            break;
        case If_:
            this.visitExpr(a.test);
            this.SEQStmt(a.body);
            a.orelse && this.SEQStmt(a.orelse);
            break;
        case Raise:
            if (a.type) {
                this.visitExpr(a.type);
                if (a.inst) {
                    this.visitExpr(a.inst);
                    a.tback && this.visitExpr(a.tback)
                }
            }
            break;
        case TryExcept:
            this.SEQStmt(a.body);
            this.SEQStmt(a.orelse);
            this.visitExcepthandlers(a.handlers);
            break;
        case TryFinally:
            this.SEQStmt(a.body);
            this.SEQStmt(a.finalbody);
            break;
        case Assert:
            this.visitExpr(a.test);
            a.msg && this.visitExpr(a.msg);
            break;
        case Import_:
        case ImportFrom:
            this.visitAlias(a.names);
            break;
        case Exec:
            this.visitExpr(a.body);
            if (a.globals) {
                this.visitExpr(a.globals);
                a.locals && this.visitExpr(a.locals)
            }
            break;
        case Global:
            b = a.names.length;
            for (var c = 0; c < b; ++c) {
                var d = mangleName(this.curClass, a.names[c]).v,
                    e = this.cur.symFlags[d];
                if (e & (DEF_LOCAL | USE)) if (e & DEF_LOCAL) throw new SyntaxError("name '" + d + "' is assigned to before global declaration");
                else throw new SyntaxError("name '" + d + "' is used prior to global declaration");
                this.addDef(new Sk.builtin.str(d), DEF_GLOBAL)
            }
            break;
        case Expr:
            this.visitExpr(a.value);
            break;
        case Pass:
        case Break_:
        case Continue_:
            break;
        case With_:
            this.newTmpname();
            this.visitExpr(a.context_expr);
            if (a.optional_vars) {
                this.newTmpname();
                this.visitExpr(a.optional_vars)
            }
            this.SEQStmt(a.body);
            break;
        default:
            goog.asserts.fail("Unhandled type " + a.constructor.name + " in visitStmt")
        }
    };
    SymbolTable.prototype.visitExpr = function (a) {
        goog.asserts.assert(a !== undefined, "visitExpr called with undefined");
        switch (a.constructor) {
        case BoolOp:
            this.SEQExpr(a.values);
            break;
        case BinOp:
            this.visitExpr(a.left);
            this.visitExpr(a.right);
            break;
        case UnaryOp:
            this.visitExpr(a.operand);
            break;
        case Lambda:
            this.addDef(new Sk.builtin.str("lambda"), DEF_LOCAL);
            a.args.defaults && this.SEQExpr(a.args.defaults);
            this.enterBlock("lambda", FunctionBlock, a, a.lineno);
            this.visitArguments(a.args);
            this.visitExpr(a.body);
            this.exitBlock();
            break;
        case IfExp:
            this.visitExpr(a.test);
            this.visitExpr(a.body);
            this.visitExpr(a.orelse);
            break;
        case Dict:
            this.SEQExpr(a.keys);
            this.SEQExpr(a.values);
            break;
        case ListComp:
            this.newTmpname();
            this.visitExpr(a.elt);
            this.visitComprehension(a.generators, 0);
            break;
        case GeneratorExp:
            this.visitGenexp(a);
            break;
        case Yield:
            a.value && this.visitExpr(a.value);
            this.cur.generator = true;
            if (this.cur.returnsValue) throw new SyntaxError("'return' with argument inside generator");
            break;
        case Compare:
            this.visitExpr(a.left);
            this.SEQExpr(a.comparators);
            break;
        case Call:
            this.visitExpr(a.func);
            this.SEQExpr(a.args);
            for (var b = 0; b < a.keywords.length; ++b) this.visitExpr(a.keywords[b].value);
            a.starargs && this.visitExpr(a.starargs);
            a.kwargs && this.visitExpr(a.kwargs);
            break;
        case Num:
        case Str:
            break;
        case Attribute:
            this.visitExpr(a.value);
            break;
        case Subscript:
            this.visitExpr(a.value);
            this.visitSlice(a.slice);
            break;
        case Name:
            this.addDef(a.id, a.ctx === Load ? USE : DEF_LOCAL);
            break;
        case List:
        case Tuple:
            this.SEQExpr(a.elts);
            break;
        default:
            goog.asserts.fail("Unhandled type " + a.constructor.name + " in visitExpr")
        }
    };
    SymbolTable.prototype.visitComprehension = function (a, b) {
        for (var c = a.length, d = b; d < c; ++d) {
            var e = a[d];
            this.visitExpr(e.target);
            this.visitExpr(e.iter);
            this.SEQExpr(e.ifs)
        }
    };
    SymbolTable.prototype.visitAlias = function (a) {
        for (var b = 0; b < a.length; ++b) {
            var c = a[b];
            var d = c = c.asname === null ? c.name.v : c.asname.v,
                e = c.indexOf(".");
            if (e !== -1) d = c.substr(0, e);
            if (c !== "*") this.addDef(new Sk.builtin.str(d), DEF_IMPORT);
            else if (this.cur.blockType !== ModuleBlock) throw new SyntaxError("import * only allowed at module level");
        }
    };
    SymbolTable.prototype.visitGenexp = function (a) {
        var b = a.generators[0];
        this.visitExpr(b.iter);
        this.enterBlock("genexpr", FunctionBlock, a, a.lineno);
        this.cur.generator = true;
        this.addDef(new Sk.builtin.str(".0"), DEF_PARAM);
        this.visitExpr(b.target);
        this.SEQExpr(b.ifs);
        this.visitComprehension(a.generators, 1);
        this.visitExpr(a.elt);
        this.exitBlock()
    };
    SymbolTable.prototype.visitExcepthandlers = function (a) {
        for (var b = 0, c; c = a[b]; ++b) {
            c.type && this.visitExpr(c.type);
            c.name && this.visitExpr(c.name);
            this.SEQStmt(c.body)
        }
    };

    function _dictUpdate(a, b) {
        for (var c in b) a[c] = b[c]
    }
    SymbolTable.prototype.analyzeBlock = function (a, b, c, d) {
        var e = {}, f = {}, g = {}, h = {}, i = {};
        if (a.blockType == ClassBlock) {
            _dictUpdate(g, d);
            b && _dictUpdate(h, b)
        }
        for (var j in a.symFlags) this.analyzeName(a, f, j, a.symFlags[j], b, e, c, d);
        if (a.blockType !== ClassBlock) {
            a.blockType === FunctionBlock && _dictUpdate(h, e);
            b && _dictUpdate(h, b);
            _dictUpdate(g, d)
        }
        d = {};
        e = a.children.length;
        for (j = 0; j < e; ++j) {
            var k = a.children[j];
            this.analyzeChildBlock(k, h, i, g, d);
            if (k.hasFree || k.childHasFree) a.childHasFree = true
        }
        _dictUpdate(i, d);
        a.blockType === FunctionBlock && this.analyzeCells(f, i);
        this.updateSymbols(a.symFlags, f, b, i, a.blockType === ClassBlock);
        _dictUpdate(c, i)
    };
    SymbolTable.prototype.analyzeChildBlock = function (a, b, c, d, e) {
        var f = {};
        _dictUpdate(f, b);
        b = {};
        _dictUpdate(b, c);
        c = {};
        _dictUpdate(c, d);
        this.analyzeBlock(a, f, b, c);
        _dictUpdate(e, b)
    };
    SymbolTable.prototype.analyzeCells = function (a, b) {
        for (var c in a) if (a[c] === LOCAL) if (b[c] !== undefined) {
            a[c] = CELL;
            delete b[c]
        }
    };
    SymbolTable.prototype.updateSymbols = function (a, b, c, d, e) {
        for (var f in a) {
            var g = a[f];
            g |= b[f] << SCOPE_OFF;
            a[f] = g
        }
        b = FREE << SCOPE_OFF;
        for (f in d) {
            g = a[f];
            if (g !== undefined) {
                if (e && g & (DEF_BOUND | DEF_GLOBAL)) a[f] = g | DEF_FREE_CLASS
            } else if (c[f] !== undefined) a[f] = b
        }
    };
    SymbolTable.prototype.analyzeName = function (a, b, c, d, e, f, g, h) {
        if (d & DEF_GLOBAL) {
            if (d & DEF_PARAM) throw new Sk.builtin.SyntaxError("name '" + c + "' is local and global");
            b[c] = GLOBAL_EXPLICIT;
            h[c] = null;
            e && e[c] !== undefined && delete e[c]
        } else if (d & DEF_BOUND) {
            b[c] = LOCAL;
            f[c] = null;
            delete h[c]
        } else if (e && e[c] !== undefined) {
            b[c] = FREE;
            a.hasFree = true;
            g[c] = null
        } else {
            if (!(h && h[c] !== undefined)) if (a.isNested) a.hasFree = true;
            b[c] = GLOBAL_IMPLICIT
        }
    };
    SymbolTable.prototype.analyze = function () {
        this.analyzeBlock(this.top, null, {}, {})
    };
    Sk.symboltable = function (a, b) {
        var c = new SymbolTable(b);
        c.enterBlock("top", ModuleBlock, a, 0);
        c.top = c.cur;
        for (var d = 0; d < a.body.length; ++d) c.visitStmt(a.body[d]);
        c.exitBlock();
        c.analyze();
        return c
    };
    Sk.dumpSymtab = function (a) {
        var b = function (e) {
            return e ? "True" : "False"
        }, c = function (e) {
            for (var f = [], g = 0; g < e.length; ++g) f.push((new Sk.builtin.str(e[g])).$r().v);
            return "[" + f.join(", ") + "]"
        }, d = function (e, f) {
            if (f === undefined) f = "";
            var g = "";
            g += f + "Sym_type: " + e.get_type() + "\n";
            g += f + "Sym_name: " + e.get_name() + "\n";
            g += f + "Sym_lineno: " + e.get_lineno() + "\n";
            g += f + "Sym_nested: " + b(e.is_nested()) + "\n";
            g += f + "Sym_haschildren: " + b(e.has_children()) + "\n";
            if (e.get_type() === "class") g += f + "Class_methods: " + c(e.get_methods()) + "\n";
            else if (e.get_type() === "function") {
                g += f + "Func_params: " + c(e.get_parameters()) + "\n";
                g += f + "Func_locals: " + c(e.get_locals()) + "\n";
                g += f + "Func_globals: " + c(e.get_globals()) + "\n";
                g += f + "Func_frees: " + c(e.get_frees()) + "\n"
            }
            g += f + "-- Identifiers --\n";
            for (var h = e.get_identifiers(), i = h.length, j = 0; j < i; ++j) {
                var k = e.lookup(h[j]);
                g += f + "name: " + k.get_name() + "\n";
                g += f + "  is_referenced: " + b(k.is_referenced()) + "\n";
                g += f + "  is_imported: " + b(k.is_imported()) + "\n";
                g += f + "  is_parameter: " + b(k.is_parameter()) + "\n";
                g += f + "  is_global: " + b(k.is_global()) + "\n";
                g += f + "  is_declared_global: " + b(k.is_declared_global()) + "\n";
                g += f + "  is_local: " + b(k.is_local()) + "\n";
                g += f + "  is_free: " + b(k.is_free()) + "\n";
                g += f + "  is_assigned: " + b(k.is_assigned()) + "\n";
                g += f + "  is_namespace: " + b(k.is_namespace()) + "\n";
                k = k.get_namespaces();
                var l = k.length;
                g += f + "  namespaces: [\n";
                for (var m = [], o = 0; o < l; ++o) m.push(d(k[o], f + "    "));
                g += m.join("\n");
                g += f + "  ]\n"
            }
            return g
        };
        return d(a.top, "")
    };
    goog.exportSymbol("Sk.symboltable", Sk.symboltable);
    goog.exportSymbol("Sk.dumpSymtab", Sk.dumpSymtab);
    var out;

    function Compiler(a, b, c, d) {
        this.filename = a;
        this.st = b;
        this.flags = c;
        this.interactive = false;
        this.nestlevel = 0;
        this.u = null;
        this.stack = [];
        this.result = [];
        this.gensymcount = 0;
        this.allUnits = [];
        this.source = d ? d.split("\n") : false
    }



    function CompilerUnit() {
        this.private_ = this.name = this.ste = null;
        this.lineno = this.firstlineno = 0;
        this.linenoSet = false;
        this.localnames = [];
        this.blocknum = 0;
        this.blocks = [];
        this.curblock = 0;
        this.scopename = null;
        this.suffixCode = this.switchCode = this.varDeclsCode = this.prefixCode = "";
        this.breakBlocks = [];
        this.continueBlocks = [];
        this.exceptBlocks = [];
        this.finallyBlocks = []
    }





    CompilerUnit.prototype.activateScope = function () {
        var a = this;
        out = function () {
            for (var b = a.blocks[a.curblock], c = 0; c < arguments.length; ++c) b.push(arguments[c])
        }
    };

// hey ankur, I return the line of the source code
// this.source is an array of lines of source code
    Compiler.prototype.getSourceLine = function (a) {
        goog.asserts.assert(this.source);
	return this.source[a - 1]
    };





    Compiler.prototype.annotateSource = function (a) {
        if (this.source) {
            var b = a.lineno;
            a = a.col_offset;
            out("\n//\n// line ", b, ":\n// ", this.getSourceLine(b), "\n// ");
            for (b = 0; b < a; ++b) out(" ");
            out("^\n//\n")
        }
    };




// I am just appending things to create strings like $scope0
    Compiler.prototype.gensym = function (a) {
        a = a || "";
        a = "$" + a;
        a += this.gensymcount++;
        return a
    };





    Compiler.prototype.niceName = function (a) {
        return this.gensym(a.replace("<", "").replace(">", "").replace(" ", "_"))
    };
    var reservedWords_ = {
        "abstract": true,
        as: true,
        "boolean": true,
        "break": true,
        "byte": true,
        "case": true,
        "catch": true,
        "char": true,
        "class": true,
        "continue": true,
        "const": true,
        "debugger": true,
        "default": true,
        "delete": true,
        "do": true,
        "double": true,
        "else": true,
        "enum": true,
        "export": true,
        "extends": true,
        "false": true,
        "final": true,
        "finally": true,
        "float": true,
        "for": true,
        "function": true,
        "goto": true,
        "if": true,
        "implements": true,
        "import": true,
        "in": true,
        "instanceof": true,
        "int": true,
        "interface": true,
        is: true,
        "long": true,
        namespace: true,
        "native": true,
        "new": true,
        "null": true,
        "package": true,
        "private": true,
        "protected": true,
        "public": true,
        "return": true,
        "short": true,
        "static": true,
        "super": true,
        "switch": true,
        "synchronized": true,
        "this": true,
        "throw": true,
        "throws": true,
        "transient": true,
        "true": true,
        "try": true,
        "typeof": true,
        use: true,
        "var": true,
        "void": true,
        "volatile": true,
        "while": true,
        "with": true
    };

    function fixReservedWords(a) {
	
        if (reservedWords_[a] !== true) return a;
        return a + "_$rw$"
    }

    function mangleName(a, b) {
        var c = b.v;
        if (a === null || c === null || c.charAt(0) !== "_" || c.charAt(1) !== "_") return b;
        if (c.charAt(c.length - 1) === "_" && c.charAt(c.length - 2) === "_") return b;
        if (a.v.replace(/_/g, "") === "") return b;
        a = a.v.replace(/^_*/, "");
        return "_" + a + c
    }





    Compiler.prototype._gr = function (a) {
        var b = this.gensym(a);
        out("var ", b, "=");
        for (var c = 1; c < arguments.length; ++c) out(arguments[c]);
        out(";");
        return b
    };





    Compiler.prototype._jumpfalse = function (a, b) {
        var c = this._gr("jfalse", "(", a, "===false||!Sk.misceval.isTrue(", a, "))");
        out("if(", c, "){/*test failed */$blk=", b, ";continue;}")
    };





    Compiler.prototype._jumpundef = function (a, b) {
        out("if(", a, "===undefined){$blk=", b, ";continue;}")
    };





    Compiler.prototype._jumptrue = function (a, b) {
        var c = this._gr("jtrue", "(", a, "===true||Sk.misceval.isTrue(", a, "))");
        out("if(", c, "){/*test passed */$blk=", b, ";continue;}")
    };





    Compiler.prototype._jump = function (a) {
        out("$blk=", a, ";/* jump */continue;")
    };





    Compiler.prototype.ctupleorlist = function (a, b, c) {
        goog.asserts.assert(c === "tuple" || c === "list");
        if (a.ctx === Store) for (var d = 0; d < a.elts.length; ++d) this.vexpr(a.elts[d], "Sk.abstr.objectGetItem(" + b + "," + d + ")");
        else if (a.ctx === Load) {
            b = [];
            for (d = 0; d < a.elts.length; ++d) b.push(this._gr("elem", this.vexpr(a.elts[d])));
            return this._gr("load" + c, "new Sk.builtins['", c, "']([", b, "])")
        }
    };






    Compiler.prototype.cdict = function (a) {
        goog.asserts.assert(a.values.length === a.keys.length);
        for (var b = [], c = 0; c < a.values.length; ++c) {
            var d = this.vexpr(a.values[c]);
            b.push(this.vexpr(a.keys[c]));
            b.push(d)
        }
        return this._gr("loaddict", "new Sk.builtins['dict']([", b, "])")
    };






    Compiler.prototype.clistcompgen = function (a, b, c, d) {
        var e = this.newBlock("list gen start"),
            f = this.newBlock("list gen skip"),
            g = this.newBlock("list gen anchor"),
            h = b[c],
            i = this._gr("iter", "Sk.abstr.iter(", this.vexpr(h.iter), ")");
        this._jump(e);
        this.setBlock(e);
        i = this._gr("next", "Sk.abstr.iternext(", i, ")");
        this._jumpundef(i, g);
        this.vexpr(h.target, i);
        i = h.ifs.length;
        for (var j = 0; j < i; ++j) this._jumpfalse(this.vexpr(h.ifs[j]), e);
        ++c < b.length && this.clistcompgen(a, b, c, d);
        if (c >= b.length) {
            b = this.vexpr(d);
            out(a, ".v.push(",
            b, ");");
            this._jump(f);
            this.setBlock(f)
        }
        this._jump(e);
        this.setBlock(g);
        return a
    };





    Compiler.prototype.clistcomp = function (a) {
        goog.asserts.assert(a instanceof ListComp);
        return this.clistcompgen(this._gr("_compr", "new Sk.builtins['list']([])"), a.generators, 0, a.elt)
    };




    Compiler.prototype.cyield = function (a) {
        if (this.u.ste.blockType !== FunctionBlock) throw new SyntaxError("'yield' outside function");
        var b = "null";
        if (a.value) b = this.vexpr(a.value);
        a = this.newBlock("after yield");
        out("return [/*resume*/", a, ",/*ret*/", b, "];");
        this.setBlock(a);
        return "$gen.gi$sentvalue"
    };





    Compiler.prototype.ccompare = function (a) {
        goog.asserts.assert(a.ops.length === a.comparators.length);
        for (var b = this.vexpr(a.left), c = a.ops.length, d = this.newBlock("done"), e = this._gr("compareres", "null"), f = 0; f < c; ++f) {
            var g = this.vexpr(a.comparators[f]);
            b = this._gr("compare", "Sk.misceval.richCompareBool(", b, ",", g, ",'", a.ops[f].prototype._astname, "')");
            out(e, "=", b, ";");
            this._jumpfalse(b, d);
            b = g
        }
        this._jump(d);
        this.setBlock(d);
        return e
    };





    Compiler.prototype.ccall = function (a) {	
        var b = this.vexpr(a.func),
            c = this.vseqexpr(a.args);
        if (a.keywords.length > 0 || a.starargs || a.kwargs) {
            for (var d = [], e = 0; e < a.keywords.length; ++e) {
                d.push("'" + a.keywords[e].arg.v + "'");
                d.push(this.vexpr(a.keywords[e].value))
            }
            d = "[" + d.join(",") + "]";
            var f = e = "undefined";
            if (a.starargs) e = this.vexpr(a.starargs);
            if (a.kwargs) f = this.vexpr(a.kwargs);
            return this._gr("call", "Sk.misceval.call(", b, ",", f, ",", e, ",", d, c.length > 0 ? "," : "", c, ")")
        } else return this._gr("call", "Sk.misceval.callsim(",
        b, c.length > 0 ? "," : "", c, ")")
    };





    Compiler.prototype.csimpleslice = function (a, b, c, d) {
        goog.asserts.assert(a.step === null);
        var e = "null",
            f = "null";
        if (a.lower) e = this.vexpr(a.lower);
        if (a.upper) f = this.vexpr(a.upper);
        switch (b) {
        case AugLoad:
        case Load:
            return this._gr("simpsliceload", "Sk.misceval.applySlice(", c, ",", e, ",", f, ")");
        case AugStore:
        case Store:
            out("Sk.misceval.assignSlice(", c, ",", e, ",", f, ",", d, ");");
            break;
        case Del:
            out("Sk.misceval.assignSlice(", c, ",", e, ",", f, ",null);");
            break;
        default:
            goog.asserts.fail("invalid simple slice")
        }
    };






    Compiler.prototype.cslice = function (a) {
        goog.asserts.assert(a instanceof Slice);
        var b = a.lower ? this.vexpr(a.lower) : "null",
            c = a.upper ? this.vexpr(a.upper) : "null";
        a = a.step ? this.vexpr(a.step) : "null";
        return this._gr("slice", "new Sk.builtins['slice'](", b, ",", c, ",", a, ")")
    };






    Compiler.prototype.vslice = function (a, b, c, d) {
        var e = null,
            f;
        switch (a.constructor) {
        case Index:
            e = "index";
            f = this.vexpr(a.value);
            break;
        case Slice:
            if (!a.step) return this.csimpleslice(a, b, c, d);
            if (b !== AugStore) f = this.cslice(a, b, c, d);
            break;
        case Ellipsis:
        case ExtSlice:
            goog.asserts.fail("todo;");
            break;
        default:
            goog.asserts.fail("invalid subscript kind")
        }
        return this.chandlesubscr(e, b, c, f, d)
    };
    Compiler.prototype.chandlesubscr = function (a, b, c, d, e) {
        if (b === Load || b === AugLoad) return this._gr("lsubscr", "Sk.abstr.objectGetItem(", c, ",", d, ")");
        else if (b === Store || b === AugStore) out("Sk.abstr.objectSetItem(", c, ",", d, ",", e, ");");
        else b === Del ? out("Sk.abstr.objectDelItem(", c, ",", d, ");") : goog.asserts.fail("handlesubscr fail")
    };





    Compiler.prototype.cboolop = function (a) {
        goog.asserts.assert(a instanceof BoolOp);
        var b;
        b = a.op === And ? this._jumpfalse : this._jumptrue;
        var c = this.newBlock("end of boolop");
        a = a.values;
        for (var d = a.length, e, f = 0; f < d; ++f) {
            var g = this.vexpr(a[f]);
            if (f === 0) e = this._gr("boolopsucc", g);
            out(e, "=", g, ";");
            b.call(this, g, c)
        }
        this._jump(c);
        this.setBlock(c);
        return e
    };







    Compiler.prototype.vexpr = function (a, b, c) {
        if (a.lineno > this.u.lineno) {
            this.u.lineno = a.lineno;
            this.u.linenoSet = false
        }
        switch (a.constructor) {
        case BoolOp:
            return this.cboolop(a);
        case BinOp:
            return this._gr("binop", "Sk.abstr.numberBinOp(", this.vexpr(a.left), ",", this.vexpr(a.right), ",'", a.op.prototype._astname, "')");
        case UnaryOp:
            return this._gr("unaryop", "Sk.abstr.numberUnaryOp(", this.vexpr(a.operand), ",'", a.op.prototype._astname, "')");
        case Lambda:
            return this.clambda(a);
        case IfExp:
            return this.cifexp(a);
        case Dict:
            return this.cdict(a);
        case ListComp:
            return this.clistcomp(a);
        case GeneratorExp:
            return this.cgenexp(a);
        case Yield:
            return this.cyield(a);
        case Compare:
            return this.ccompare(a);
        case Call:
            return this.ccall(a);
        case Num:
            if (typeof a.n === "number") return a.n;
            else if (a.n instanceof Sk.builtin.lng) return "Sk.longFromStr('" + a.n.tp$str().v + "')";
            goog.asserts.fail("unhandled Num type");
        case Str:
            return this._gr("str", "new Sk.builtins['str'](", a.s.$r().v, ")");
        case Attribute:
            var d;
            if (a.ctx !== AugStore) d = this.vexpr(a.value);
            switch (a.ctx) {
            case AugLoad:
            case Load:
                return this._gr("lattr", "Sk.abstr.gattr(", d, ",", a.attr.$r().v, ")");
            case AugStore:
                out("if(", b, "!==undefined){");
                d = this.vexpr(c || null);
                out("Sk.abstr.sattr(", d, ",", a.attr.$r().v, ",", b, ");");
                out("}");
                break;
            case Store:
                out("Sk.abstr.sattr(", d, ",", a.attr.$r().v, ",", b, ");");
                break;
            case Del:
                goog.asserts.fail("todo;");
                break;
            default:
                goog.asserts.fail("invalid attribute expression")
            }
            break;
        case Subscript:
            switch (a.ctx) {
            case AugLoad:
            case Load:
            case Store:
            case Del:
                return this.vslice(a.slice, a.ctx, this.vexpr(a.value), b);
            case AugStore:
                out("if(",
                b, "!==undefined){");
                d = this.vexpr(c || null);
                this.vslice(a.slice, a.ctx, d, b);
                out("}");
                break;
            default:
                goog.asserts.fail("invalid subscript expression")
            }
            break;
        case Name:
            return this.nameop(a.id, a.ctx, b);
        case List:
            return this.ctupleorlist(a, b, "list");
        case Tuple:
            return this.ctupleorlist(a, b, "tuple");
        default:
            goog.asserts.fail("unhandled case in vexpr")
        }
    };






    Compiler.prototype.vseqexpr = function (a, b) {
        goog.asserts.assert(b === undefined || a.length === b.length);
        for (var c = [], d = 0; d < a.length; ++d) c.push(this.vexpr(a[d], b === undefined ? undefined : b[d]));
        return c
    };






    Compiler.prototype.caugassign = function (a) {
        goog.asserts.assert(a instanceof AugAssign);
        var b = a.target;
        switch (b.constructor) {
        case Attribute:
            var c = new Attribute(b.value, b.attr, AugLoad, b.lineno, b.col_offset),
                d = this.vexpr(c),
                e = this.vexpr(a.value);
            a = this._gr("inplbinopattr", "Sk.abstr.numberInplaceBinOp(", d, ",", e, ",'", a.op.prototype._astname, "')");
            c.ctx = AugStore;
            return this.vexpr(c, a, b.value);
        case Subscript:
            c = new Subscript(b.value, b.slice, AugLoad, b.lineno, b.col_offset);
            d = this.vexpr(c);
            e = this.vexpr(a.value);
            a = this._gr("inplbinopsubscr", "Sk.abstr.numberInplaceBinOp(", d, ",", e, ",'", a.op.prototype._astname, "')");
            c.ctx = AugStore;
            return this.vexpr(c, a, b.value);
        case Name:
            c = this.nameop(b.id, Load);
            e = this.vexpr(a.value);
            a = this._gr("inplbinop", "Sk.abstr.numberInplaceBinOp(", c, ",", e, ",'", a.op.prototype._astname, "')");
            return this.nameop(b.id, Store, a);
        default:
            goog.asserts.fail("unhandled case in augassign")
        }
    };





    Compiler.prototype.exprConstant = function (a) {
        switch (a.constructor) {
        case Num:
            return Sk.misceval.isTrue(a.n);
        case Str:
            return Sk.misceval.isTrue(a.s);
        default:
            return -1
        }
    };








    Compiler.prototype.newBlock = function (a) {
        var b = this.u.blocknum++;
        this.u.blocks[b] = [];
        this.u.blocks[b]._name = a || "<unnamed>";
	return b
    };




    Compiler.prototype.setBlock = function (a) {
        goog.asserts.assert(a >= 0 && a < this.u.blocknum);
        this.u.curblock = a
    };









    Compiler.prototype.pushBreakBlock = function (a) {
        goog.asserts.assert(a >= 0 && a < this.u.blocknum);
        this.u.breakBlocks.push(a)
    };




    Compiler.prototype.popBreakBlock = function () {
	
        this.u.breakBlocks.pop()
    };






    Compiler.prototype.pushContinueBlock = function (a) {
	
        goog.asserts.assert(a >= 0 && a < this.u.blocknum);
        this.u.continueBlocks.push(a)
    };





    Compiler.prototype.popContinueBlock = function () {
	
        this.u.continueBlocks.pop()
    };




    Compiler.prototype.pushExceptBlock = function (a) {
	
        goog.asserts.assert(a >= 0 && a < this.u.blocknum);
        this.u.exceptBlocks.push(a)
    };




    Compiler.prototype.popExceptBlock = function () {
	
        this.u.exceptBlocks.pop()
    };





    Compiler.prototype.pushFinallyBlock = function (a) {
	
        goog.asserts.assert(a >= 0 && a < this.u.blocknum);
        this.u.finallyBlocks.push(a)
    };





    Compiler.prototype.popFinallyBlock = function () {
	
        this.u.finallyBlocks.pop()
    };





    Compiler.prototype.setupExcept = function (a) {
	
        out("$exc.push(", a, ");try{")
    };






    Compiler.prototype.endExcept = function () {
	
        out("$exc.pop();}catch($err){");
        out("$blk=$exc.pop();");
        out("continue;}")
    };






    Compiler.prototype.outputLocals = function (a) {	
        for (var b = {}, c = 0; a.argnames && c < a.argnames.length; ++c) b[a.argnames[c]] = true;
        a.localnames.sort();
        var d = [];
        for (c = 0; c < a.localnames.length; ++c) {
            var e = a.localnames[c];
            if (b[e] === undefined) {
                d.push(e);
                b[e] = true
            }
        }
        if (d.length > 0) return "var " + d.join(",") + "; /* locals */";
        return ""
    };






    Compiler.prototype.outputAllUnits = function () {
        for (var a = "", b = 0; b < this.allUnits.length; ++b) {
            var c = this.allUnits[b];
            a += c.prefixCode;
            a += this.outputLocals(c);
            a += c.varDeclsCode;
            a += c.switchCode;
            for (var d = c.blocks, e = 0; e < d.length; ++e) {
                a += "case " + e + ": /* --- " + d[e]._name + " --- */";
                a += d[e].join("");
                a += "goog.asserts.fail('unterminated block');"
            }
            a += c.suffixCode
        }
        return a
    };






    Compiler.prototype.cif = function (a) {	
        goog.asserts.assert(a instanceof If_);
        var b = this.exprConstant(a.test);
        if (b === 0) a.orelse && this.vseqstmt(a.orelse);
        else if (b === 1) this.vseqstmt(a.body);
        else {
            var c = this.newBlock("end of if");
            b = this.newBlock("next branch of if");
            this.vexpr(a.test);
            this._jumpfalse(this.vexpr(a.test), b);
            this.vseqstmt(a.body);
            this._jump(c);
            this.setBlock(b);
            a.orelse && this.vseqstmt(a.orelse);
            this._jump(c)
        }
        this.setBlock(c)
    };






    Compiler.prototype.cwhile = function (a) {	
        if (this.exprConstant(a.test) === 0) a.orelse && this.vseqstmt(a.orelse);
        else {
            var b = this.newBlock("while test");
            this._jump(b);
            this.setBlock(b);
            var c = this.newBlock("after while"),
                d = a.orelse.length > 0 ? this.newBlock("while orelse") : null,
                e = this.newBlock("while body");
            this._jumpfalse(this.vexpr(a.test), d ? d : c);
            this._jump(e);
            this.pushBreakBlock(c);
            this.pushContinueBlock(b);
            this.setBlock(e);
            this.vseqstmt(a.body);
            this._jump(b);
            this.popContinueBlock();
            this.popBreakBlock();
            if (a.orelse.length > 0) {
                this.setBlock(d);
                this.vseqstmt(a.orelse)
            }
            this.setBlock(c)
        }
    };





    Compiler.prototype.cfor = function (a) {
	
        var b = this.newBlock("for start"),
            c = this.newBlock("for cleanup"),
            d = this.newBlock("for end");
        this.pushBreakBlock(d);
        this.pushContinueBlock(b);
        var e = this.vexpr(a.iter),
            f;
        if (this.u.ste.generator) {
            f = "$loc." + this.gensym("iter");
            out(f, "=Sk.abstr.iter(", e, ");")
        } else f = this._gr("iter", "Sk.abstr.iter(", e, ")");
        this._jump(b);
        this.setBlock(b);
        e = this._gr("next", "Sk.abstr.iternext(", f, ")");
        this._jumpundef(e, c);
        this.vexpr(a.target, e);
        this.vseqstmt(a.body);
        this._jump(b);
        this.setBlock(c);
        this.popContinueBlock();
        this.popBreakBlock();
        this.vseqstmt(a.orelse);
        this._jump(d);
        this.setBlock(d)
    };






    Compiler.prototype.craise = function (a) {
        if (a.type.id.v === "StopIteration") out("return undefined;");
        else {
            var b = "";
            if (a.inst) b = this.vexpr(a.inst);
            out("throw new ", this.vexpr(a.type), "(", b, ");")
        }
    };







    Compiler.prototype.ctryexcept = function (a) {
        var b = this.newBlock("except"),
            c = this.newBlock("orelse"),
            d = this.newBlock("end");
        this.setupExcept(b);
        this.vseqstmt(a.body);
        this.endExcept();
        this._jump(c);
        this.setBlock(b);
        for (var e = a.handlers.length, f = 0; f < e; ++f) {
            var g = a.handlers[f];
            if (g.type && f < e - 1) throw new SyntaxError("default 'except:' must be last");
            b = this.newBlock("except_" + f + "_");
            g.type && this._jumpfalse(this.vexpr(g.type), b);
            this.vseqstmt(g.body)
        }
        this.setBlock(c);
        this.vseqstmt(a.orelse);
        this._jump(d);
        this.setBlock(d)
    };






    Compiler.prototype.ctryfinally = function () {
        out("/*todo; tryfinally*/")
    };






    Compiler.prototype.cassert = function (a) {
        var b = this.vexpr(a.test),
            c = this.newBlock("end");
        this._jumptrue(b, c);
        out("throw new Sk.builtins.AssertionError(", a.msg ? this.vexpr(a.msg) : "", ");");
        this.setBlock(c)
    };






    Compiler.prototype.cimportas = function (a, b, c) {
        a = a.v;
        var d = a.indexOf(".");
        c = c;
        if (d !== -1) for (a = a.substr(d + 1); d !== -1;) {
            d = a.indexOf(".");
            var e = d !== -1 ? a.substr(0, d) : a;
            c = this._gr("lattr", "Sk.abstr.gattr(", c, ",'", e, "')");
            a = a.substr(d + 1)
        }
        return this.nameop(b, Store, c)
    };






    Compiler.prototype.cimport = function (a) {	
        for (var b = a.names.length, c = 0; c < b; ++c) {
            var d = a.names[c],
                e = this._gr("module", "Sk.builtin.__import__(", d.name.$r().v, ",$gbl,$loc,[])");
            if (d.asname) this.cimportas(d.name, d.asname, e);
            else {
                d = d.name;
                var f = d.v.indexOf(".");
                if (f !== -1) d = new Sk.builtin.str(d.v.substr(0, f));
                this.nameop(d, Store, e)
            }
        }
    };






    Compiler.prototype.cfromimport = function (a) {
        for (var b = a.names.length, c = [], d = 0; d < b; ++d) c[d] = a.names[d].name.$r().v;
        c = this._gr("module", "Sk.builtin.__import__(", a.module.$r().v, ",$gbl,$loc,[", c, "])");
        for (d = 0; d < b; ++d) {
            var e = a.names[d];
            if (d === 0 && e.name.v === "*") {
                goog.asserts.assert(b === 1);
                out("Sk.importStar(", c, ");");
                break
            }
            var f = this._gr("item", "Sk.abstr.gattr(", c, ",", e.name.$r().v, ")"),
                g = e.name;
            if (e.asname) g = e.asname;
            this.nameop(g, Store, f)
        }
    };






    Compiler.prototype.buildcodeobj = function (a, b, c, d, e) {
        var f = [],
            g = null,
            h = null;
        c && this.vseqexpr(c);
        if (d && d.defaults) f = this.vseqexpr(d.defaults);
        if (d && d.vararg) g = d.vararg;
        if (d && d.kwarg) h = d.kwarg;
        a = this.enterScope(b, a, a.lineno);
        c = this.u.ste.generator;
        var i = this.u.ste.hasFree,
            j = this.u.ste.childHasFree,
            k = this.newBlock("codeobj entry");
        this.u.prefixCode = "var " + a + "=(function " + this.niceName(b.v) + "$(";
        b = [];
        if (c) b.push("$gen");
        else {
            h && b.push("$kwa");
            for (var l = 0; d && l < d.args.length; ++l) b.push(this.nameop(d.args[l].id,
            Param))
        }
        i && b.push("$free");
        this.u.prefixCode += b.join(",");
        this.u.prefixCode += "){";
        if (c) this.u.prefixCode += "\n// generator\n";
        if (i) this.u.prefixCode += "\n// has free\n";
        if (j) this.u.prefixCode += "\n// has cell\n";
        l = "{}";
        if (c) {
            k = "$gen.gi$resumeat";
            l = "$gen.gi$locals"
        }
        var m = "";
        if (j) m = ",$cell={}";
        this.u.varDeclsCode += "var $blk=" + k + ",$exc=[],$loc=" + l + m + ",$gbl=this;";
        for (l = 0; d && l < d.args.length; ++l) {
            j = d.args[l].id;
            if (this.isCell(j)) this.u.varDeclsCode += "$cell." + j.v + "=" + j.v + ";"
        }
        if (f.length > 0) {
            j = d.args.length - f.length;
            for (l = 0; l < f.length; ++l) {
                k = this.nameop(d.args[l + j].id, Param);
                this.u.varDeclsCode += "if(" + k + "===undefined)" + k + "=" + a + ".$defaults[" + l + "];"
            }
        }
        if (g) this.u.varDeclsCode += g.v + "=new Sk.builtins['tuple'](Array.prototype.slice.call(arguments," + b.length + ")); /*vararg*/";
        if (h) this.u.varDeclsCode += h.v + "=new Sk.builtins['dict']($kwa);";
        this.u.switchCode += "while(true){switch($blk){";
        this.u.suffixCode = "}break;}});";
        e.call(this, a);
        var o;
        if (d && d.args.length > 0) {
            e = [];
            for (l = 0; l < d.args.length; ++l) e.push(d.args[l].id.v);
            o = e.join("', '");
            this.u.argnames = e
        }
        this.exitScope();
        f.length > 0 && out(a, ".$defaults=[", f.join(","), "];");
        o && out(a, ".co_varnames=['", o, "'];");
        h && out(a, ".co_kwargs=1;");
        f = "";
        if (i) {
            f = ",$cell";
            if (this.u.ste.hasFree) f += ",$free"
        }
        return c ? d && d.args.length > 0 ? this._gr("gener", "(function(){var $origargs=Array.prototype.slice.call(arguments);return new Sk.builtins['generator'](", a, ",$gbl,$origargs", f, ");})") : this._gr("gener", "(function(){return new Sk.builtins['generator'](", a, ",$gbl,[]", f, ");})") : this._gr("funcobj", "new Sk.builtins['function'](", a, ",$gbl", f, ")")
    };





    Compiler.prototype.cfunction = function (a) {
        goog.asserts.assert(a instanceof FunctionDef);
        var b = this.buildcodeobj(a, a.name, a.decorator_list, a.args, function () {
            this.vseqstmt(a.body);
            out("return null;")
        });
        this.nameop(a.name, Store, b)
    };






    Compiler.prototype.clambda = function (a) {
        goog.asserts.assert(a instanceof Lambda);
        return this.buildcodeobj(a, new Sk.builtin.str("<lambda>"), null, a.args, function () {
            var b = this.vexpr(a.body);
            out("return ", b, ";")
        })
    };






    Compiler.prototype.cifexp = function (a) {
	
        var b = this.newBlock("next of ifexp"),
            c = this.newBlock("end of ifexp"),
            d = this._gr("res", "null");
        this._jumpfalse(this.vexpr(a.test), b);
        out(d, "=", this.vexpr(a.body), ";");
        this._jump(c);
        this.setBlock(b);
        out(d, "=", this.vexpr(a.orelse), ";");
        this._jump(c);
        this.setBlock(c);
        return d
    };






    Compiler.prototype.cgenexpgen = function (a, b, c) {
        var d = this.newBlock("start for " + b),
            e = this.newBlock("skip for " + b);
        this.newBlock("if cleanup for " + b);
        var f = this.newBlock("end for " + b),
            g = a[b],
            h;
        if (b === 0) h = "$loc.$iter0";
        else {
            var i = this.vexpr(g.iter);
            h = "$loc." + this.gensym("iter");
            out(h, "=", "Sk.abstr.iter(", i, ");")
        }
        this._jump(d);
        this.setBlock(d);
        h = this._gr("next", "Sk.abstr.iternext(", h, ")");
        this._jumpundef(h, f);
        this.vexpr(g.target, h);
        h = g.ifs.length;
        for (i = 0; i < h; ++i) this._jumpfalse(this.vexpr(g.ifs[i]), d);
        ++b < a.length && this.cgenexpgen(a, b, c);
        if (b >= a.length) {
            a = this.vexpr(c);
            out("return [", e, "/*resume*/,", a, "/*ret*/];");
            this.setBlock(e)
        }
        this._jump(d);
        this.setBlock(f);
        b === 1 && out("return null;")
    };






    Compiler.prototype.cgenexp = function (a) {	
        var b = this._gr("gener", this.buildcodeobj(a, new Sk.builtin.str("<genexpr>"), null, null, function () {
            this.cgenexpgen(a.generators, 0, a.elt)
        }), "()");
        out(b, ".gi$locals.$iter0=Sk.abstr.iter(", this.vexpr(a.generators[0].iter), ");");
        return b
    };








    Compiler.prototype.cclass = function (a) {	
        goog.asserts.assert(a instanceof ClassDef);
        var b = this.vseqexpr(a.bases),
            c = this.enterScope(a.name, a, a.lineno),
            d = this.newBlock("class entry");
        this.u.prefixCode = "var " + c + "=(function $" + a.name.v + "$class_outer($globals,$locals,$rest){var $gbl=$globals,$loc=$locals;";
        this.u.switchCode += "return(function " + a.name.v + "(){";
        this.u.switchCode += "var $blk=" + d + ",$exc=[];while(true){switch($blk){";
        this.u.suffixCode = "}break;}}).apply(null,$rest);});";
        this.u.private_ = a.name;
        this.cbody(a.body);
        out("break;");
        this.exitScope();
        b = this._gr("built", "Sk.misceval.buildClass($gbl,", c, ",", a.name.$r().v, ",[", b, "])");
        this.nameop(a.name, Store, b)
    };








    Compiler.prototype.ccontinue = function () {	
        if (this.u.continueBlocks.length === 0) throw new SyntaxError("'continue' outside loop");
        this._jump(this.u.continueBlocks[this.u.continueBlocks.length - 1])
    };







    Compiler.prototype.vstmt = function (a) {
        this.u.lineno = a.lineno;
        this.u.linenoSet = false;
        this.annotateSource(a);
        switch (a.constructor) {
        case FunctionDef:
            this.cfunction(a);
            break;
        case ClassDef:
            this.cclass(a);
            break;
        case Return_:
            if (this.u.ste.blockType !== FunctionBlock) throw new SyntaxError("'return' outside function");
            a.value ? out("return ", this.vexpr(a.value), ";") : out("return null;");
            break;
        case Delete_:
            this.vseqexpr(a.targets);
            break;
        case Assign:
            for (var b = a.targets.length, c = this.vexpr(a.value), d = 0; d < b; ++d) this.vexpr(a.targets[d],
            c);
            break;
        case AugAssign:
            return this.caugassign(a);
        case Print:
            this.cprint(a);
            break;
        case For_:
            return this.cfor(a);
        case While_:
            return this.cwhile(a);
        case If_:
            return this.cif(a);
        case Raise:
            return this.craise(a);
        case TryExcept:
            return this.ctryexcept(a);
        case TryFinally:
            return this.ctryfinally(a);
        case Assert:
            return this.cassert(a);
        case Import_:
            return this.cimport(a);
        case ImportFrom:
            return this.cfromimport(a);
        case Global:
            break;
        case Expr:
            this.vexpr(a.value);
            break;
        case Pass:
            break;
        case Break_:
            if (this.u.breakBlocks.length === 0) throw new SyntaxError("'break' outside loop");
            this._jump(this.u.breakBlocks[this.u.breakBlocks.length - 1]);
            break;
        case Continue_:
            this.ccontinue(a);
            break;
        default:
            goog.asserts.fail("unhandled case in vstmt")
        }
    };





    Compiler.prototype.vseqstmt = function (a) {	
        for (var b = 0; b < a.length; ++b) this.vstmt(a[b])
    };
    var OP_FAST = 0,
        OP_GLOBAL = 1,
        OP_DEREF = 2,
        OP_NAME = 3,
        D_NAMES = 0,
        D_FREEVARS = 1,
        D_CELLVARS = 2;






    Compiler.prototype.isCell = function (a) {
        if (this.u.ste.getScope(mangleName(this.u.private_, a).v) === CELL) return true;
        return false
    };






    Compiler.prototype.nameop = function (a, b, c) {	
        if ((b === Store || b === AugStore || b === Del) && a.v === "__debug__") this.error("can not assign to __debug__");
        if ((b === Store || b === AugStore || b === Del) && a.v === "None") this.error("can not assign to None");
        if (a.v === "None") return "null";
        if (a.v === "True") return "true";
        if (a.v === "False") return "false";
        var d = mangleName(this.u.private_, a).v,
            e = OP_NAME,
            f = this.u.ste.getScope(d),
            g = null;
        switch (f) {
        case FREE:
            g = "$free";
            e = OP_DEREF;
            break;
        case CELL:
            g = "$cell";
            e = OP_DEREF;
            break;
        case LOCAL:
            if (this.u.ste.blockType === FunctionBlock && !this.u.ste.generator) e = OP_FAST;
            break;
        case GLOBAL_IMPLICIT:
            if (this.u.ste.blockType === FunctionBlock) e = OP_GLOBAL;
            break;
        case GLOBAL_EXPLICIT:
            e = OP_GLOBAL
        }
        d = fixReservedWords(d);
        goog.asserts.assert(f || a.v.charAt(1) === "_");
        a = d;
        if (this.u.ste.generator || this.u.ste.blockType !== FunctionBlock) d = "$loc." + d;
        else if (e === OP_FAST || e === OP_NAME) this.u.localnames.push(d);
        switch (e) {
        case OP_FAST:
            switch (b) {
            case Load:
            case Param:
                return d;
            case Store:
                out(d, "=", c, ";");
                break;
            case Del:
                out("delete ", d, ";");
                break;
            default:
                goog.asserts.fail("unhandled")
            }
            break;
        case OP_NAME:
            switch (b) {
            case Load:
                b = this.gensym("loadname");
                out("var ", b, "=", d, "!==undefined?", d, ":Sk.misceval.loadname('", a, "',$gbl);");
                return b;
            case Store:
                out(d, "=", c, ";");
                break;
            case Del:
                out("delete ", d, ";");
                break;
            case Param:
                return d;
            default:
                goog.asserts.fail("unhandled")
            }
            break;
        case OP_GLOBAL:
            switch (b) {
            case Load:
                return this._gr("loadgbl", "Sk.misceval.loadname('", a, "',$gbl)");
            case Store:
                out("$gbl.", a, "=", c, ";");
                break;
            case Del:
                out("delete $gbl.", a);
                break;
            default:
                goog.asserts.fail("unhandled case in name op_global")
            }
            break;
        case OP_DEREF:
            switch (b) {
            case Load:
                return g + "." + a;
            case Store:
                out(g, ".", a, "=", c, ";");
                break;
            case Param:
                return a;
            default:
                goog.asserts.fail("unhandled case in name op_deref")
            }
            break;
        default:
            goog.asserts.fail("unhandled case")
        }
    };




///////////////////////////////Enter Scope//////////////////////////
    Compiler.prototype.enterScope = function (a, b, c) {
        var d = new CompilerUnit; // initializing a few variables
        d.ste = this.st.getStsForAst(b);
        d.name = a;
        d.firstlineno = c;
        this.stack.push(this.u);
        this.allUnits.push(d);
	a = this.gensym("scope");
        d.scopename = a;
	this.u = d;
        this.u.activateScope();
        this.nestlevel++;
        return a
    };





    Compiler.prototype.exitScope = function () {
        var a = this.u;
        this.nestlevel--;
        (this.u = this.stack.length - 1 >= 0 ? this.stack.pop() : null) && this.u.activateScope();
        a.name.v !== "<module>" && out(a.scopename, ".co_name=new Sk.builtins['str'](", a.name.$r().v, ");")
    };





    Compiler.prototype.cbody = function (a) {
        for (var b = 0; b < a.length; ++b) this.vstmt(a[b])
    };






    Compiler.prototype.cprint = function (a) {
        goog.asserts.assert(a instanceof Print);
        a.dest && this.vexpr(a.dest);
        for (var b = a.values.length, c = 0; c < b; ++c) out("Sk.misceval.print_(", "new Sk.builtins['str'](", this.vexpr(a.values[c]), ").v);");
        a.nl && out("Sk.misceval.print_(", '"\\n");')
    };

////////////////////////////my functions /////////////////////////////////////////

value = function(obj){
    if (obj._astname == "Num"){
	return (obj.n);
    }
    else if (obj._astname == "Str"){
	return (obj.s.v);
    }
    else if (obj._astname == "List") {
	var values = new Array();
	for (j=0; j<obj.elts.length; j++){
	    values[j] = value(obj.elts[j]);				
	}
	console.log(values);
	return(values);
    }
    else if (obj._astname == "Dict"){
	var values = new Array();
	var keys = new Array();
	for (j=0; j<obj.keys.length; j++){
	    keys[j] = value(obj.keys[j]);
	    values[j] = value(obj.values[j]);
	}
	return([keys, values]);
    }
    else if (obj._astname == "BinOp"){
	return(BinOper(obj));

/*	var left = obj.left;
	var right = obj.right;
	console.log(left);
	console.log(right);
	if (left._astname == "BinOp"){
	    left = value(left);
	}
	if (left._astname == "Num"){
	    left = left.n;
	}
	if (right._astname == "Num"){
	    right = right.n;
	}
	if (left._astname == "Str"){
	    left = left.s;
	}
	if (right._astname == "Str"){
	    right = right.s;
	}
	return (Sk.abstr.numberBinOp(left,right,obj.op.prototype._astname));
*/
    }
}

BinOper = function (obj){
    var left = obj.left;
    var right = obj.right;
    if (left._astname == "BinOp"){
	left = BinOper(left);
    }
    console.log(right);
    if (left._astname == "Num"){
	left = left.n;
    }
    if (right._astname == "Num"){
	right = right.n;
    }
    if (left._astname == "Str"){
	left = left.s;
    }
    if (right._astname = "Str"){
	right = right.s;
    }
    console.log(left);
    console.log(right);
    return(Sk.abstr.numberBinOp(left,right,obj.op.prototype._astname));
}

/*
	value_List = function (obj){
			var value = new Array();
			for (j =0; j<obj.elts.length; j++){
				value[j] = obj.elts[j].n;
				};
			};
	value_Dict = function (obj){
			var values = new Array();
			var keys = new Array();
			for (j=0; j<obj.keys.length; j++){
								

*/
//////////////////////////////////////  CMOD   /////////////////////////

    Compiler.prototype.cmod = function (a) {
        console.log("a", a);


////////////////////////////////mycode/////////////////////////////////	

	for (i = 0; i< a.body.length;i++){
	    console.log("ordered globals", a.body[i].targets[0].id.v);
	    console.log("value", value(a.body[i].value));
	    console.log("lineno", a.body[i].lineno);

/*
	    if (a.body[i].value._astname == "Num"){
		console.log("ordered globals", a.body[i].targets[0].id.v);
		console.log("value", a.body[i].value.n);
		console.log("lineno", a.body[i].lineno);
	    }
	    else if (a.body[i].value._astname == "Str"){
		console.log("ordered globals", a.body[i].targets[0].id.v);
		console.log("value", a.body[i].value.s.v);
		console.log("lineno", a.body[i].lineno);
	    }
	    else if (a.body[i].value._astname == "List"){
		console.log("ordered globals", a.body[i].targets[0].id.v);
		var value = new Array();
		for (j = 0; j<a.body[i].value.elts.length; j++){
		    if (a.body[i].value.elts[j]._astname == "List"){
			//call the function for list process
		    }
		    else if (a.body[i].value.elts[j]._astname == "Num"){
			value[j] = a.body[i].value.elts[j].n;				
		    }
		    else if (a.body[i].value.elts[j]._astname == "Str"){
			//process 
			//else if process dictionary
		    }
		    console.log("value", value);
		    console.log("lineno", a.body[i].lineno);
		}
	    }
	    else if (a.body[i].value._astname == "Dict"){
		var keys = new Array();
		var values = new Array();
		for (j = 0; j<a.body[i].value.keys.length; j++){
		    // keys [j] == process the value
		    // values[j] == process the value				
		}			
	    }
	    else if (a.body[i].value._astname == "BinOp"){
		if (a.body[i].value.left._astname == "Num"){
		    console.log("ordered globals", a.body[i].targets[0].id.v);
		    console.log("value", Sk.abstr.numberBinOp( a.body[i].value.left.n , a.body[i].value.right.n, a.body[i].value.op.prototype._astname));
		    console.log("lineno", a.body[i].lineno);
		}
		else{
		    console.log("ordered globals", a.body[i].targets[0].id.v);
		    console.log("value", Sk.abstr.numberBinOp (a.body[i].value.left.s, a.body[i].value.right.s, a.body[i].value.op.prototype._astname).v);
		    console.log("lineno", a.body[i].lineno);
		}
	    }
*/
	}

/////////////////////////////////////////////////////////////////////
        var b = this.enterScope(new Sk.builtin.str("<module>"), a, 0),
            c = this.newBlock("module entry");
        this.u.prefixCode = "var " + b + "=(function($modname){";
        this.u.varDeclsCode = "var $blk=" + c + ",$exc=[],$gbl={},$loc=$gbl;$gbl.__name__=$modname;";
        this.u.switchCode = "while(true){switch($blk){";
        this.u.suffixCode = "}}});";

        switch (a.constructor) {
        case Module:
            this.cbody(a.body);
            out("return $loc;");
            break;
        default:
            goog.asserts.fail("todo; unhandled case in compilerMod")
        }
        this.exitScope();
        this.result.push(this.outputAllUnits());
        return b
    };




    Sk.compile = function (a, b) {
        var c = Sk.parse(b, a);
        c = Sk.astFromParse(c, b);
        var d = Sk.symboltable(c, b);
        d = new Compiler(b, d, 0, a);
        c = d.cmod(c);
        d = d.result.join("");
        return {
            funcname: c,
            code: d
        }
    };
    goog.exportSymbol("Sk.compile", Sk.compile);


    Sk.sysmodules = new Sk.builtin.dict([]);


    Sk.realsyspath = undefined;



    Sk.importSearchPathForName = function (a, b, c) {
        for (var d = Sk.realsyspath.tp$iter(), e = d.tp$iternext(); e !== undefined; e = d.tp$iternext()) {
            var f = a.replace(/\./g, "/");
            e = [e.v + "/" + f + b, e.v + "/" + f + "/__init__" + b];
            for (f = 0; f < e.length; ++f) {
                var g = e[f];
                try {
                    Sk.read(g);
                    return g
                } catch (h) {}
            }
        }
        if (!c) throw new Sk.builtin.ImportError("No module named " + a);
    };



    Sk.doOneTimeInitialization = function () {
        Sk.builtin.type.basesStr_ = new Sk.builtin.str("__bases__");
        Sk.builtin.type.mroStr_ = new Sk.builtin.str("__mro__");
        Sk.builtin.object.$d = new Sk.builtin.dict([]);
        Sk.builtin.object.$d.mp$ass_subscript(Sk.builtin.type.basesStr_, new Sk.builtin.tuple([]));
        Sk.builtin.object.$d.mp$ass_subscript(Sk.builtin.type.mroStr_, new Sk.builtin.tuple([Sk.builtin.object]))
    };



    Sk.importSetUpPath = function () {
        if (!Sk.realsyspath) {
            for (var a = [new Sk.builtin.str("src/builtin"), new Sk.builtin.str("src/lib"), new Sk.builtin.str(".")], b = 0; b < Sk.syspath.length; ++b) a.push(new Sk.builtin.str(Sk.syspath[b]));
            Sk.realsyspath = new Sk.builtin.list(a);
            Sk.doOneTimeInitialization()
        }
    };
    if (COMPILED) var js_beautify = function (a) {
        return a
    };





    Sk.importModuleInternal_ = function (a, b, c, d) {
        Sk.importSetUpPath();
        if (c === undefined) c = a;
        var e = null,
            f = c.split("."),
            g, h = Sk.sysmodules.mp$subscript(c);
        if (h !== undefined) return f.length > 1 ? Sk.sysmodules.mp$subscript(f[0]) : h;
        if (f.length > 1) {
            g = f.slice(0, f.length - 1).join(".");
            e = Sk.importModuleInternal_(g, b)
        }
        h = new Sk.builtin.module;
        Sk.sysmodules.mp$ass_subscript(a, h);
        var i;
        if (d) {
            a = a + ".py";
            i = Sk.compile(d, a, "exec")
        } else if (d = Sk.importSearchPathForName(a, ".js", true)) {
            a = d;
            i = {
                funcname: "$builtinmodule",
                code: Sk.read(a)
            }
        } else {
            a = Sk.importSearchPathForName(a, ".py");
            i = Sk.compile(Sk.read(a), a, "exec")
        }
        a = h.$js = i.code;
        if (b) {
            Sk.debugout("-----");
            a = function () {
                for (var j = js_beautify(i.code).split("\n"), k = 1; k <= j.length; ++k) {
                    for (var l = "", m = ("" + k).length; m < 5; ++m) l += " ";
                    j[k - 1] = "/* " + l + k + " */ " + j[k - 1]
                }
                return j.join("\n")
            }(i.code);
            Sk.debugout(a)
        }
        a += "\n" + i.funcname + "(" + ("new Sk.builtin.str('" + c + "')") + ");";
        b = goog.global.eval(a);
        b.__name__ || (b.__name__ = new Sk.builtin.str(c));
        h.$d = b;
        if (e) {
            Sk.sysmodules.mp$subscript(g).tp$setattr(f[f.length - 1], h);
            return e
        }
        return h
    };


    Sk.importModule = function (a, b) {
        return Sk.importModuleInternal_(a, b)
    };



    Sk.importMain = function (a, b) {
        return Sk.importModuleInternal_(a, b, "__main__")
    };


var code;
    Sk.importMainWithBody = function (a, b, c) {
	code = c;
        return Sk.importModuleInternal_(a, b, "__main__", c)
    };



    Sk.builtin.__import__ = function (a, b, c, d) {
        b = Sk.importModuleInternal_(a);
        if (!d || d.length === 0) return b;
        b = Sk.sysmodules.mp$subscript(a);
        goog.asserts.assert(b);
        return b
    };
    goog.exportSymbol("Sk.importMain", Sk.importMain);
    goog.exportSymbol("Sk.importMainWithBody", Sk.importMainWithBody);
    goog.exportSymbol("Sk.builtin.__import__", Sk.builtin.__import__);




    Sk.builtins = {
        range: Sk.builtin.range,
        len: Sk.builtin.len,
        min: Sk.builtin.min,
        max: Sk.builtin.max,
        sum: Sk.builtin.sum,
        abs: Sk.builtin.abs,
        ord: Sk.builtin.ord,
        chr: Sk.builtin.chr,
        dir: Sk.builtin.dir,
        repr: Sk.builtin.repr,
        open: Sk.builtin.open,
        isinstance: Sk.builtin.isinstance,
        hash: Sk.builtin.hash,
        getattr: Sk.builtin.getattr,
        float_$rw$: Sk.builtin.float_,
        int_$rw$: Sk.builtin.int_,
        AttributeError: Sk.builtin.AttributeError,
        ValueError: Sk.builtin.ValueError,
        dict: Sk.builtin.dict,
        file: Sk.builtin.file,
        "function": Sk.builtin.func,
        generator: Sk.builtin.generator,
        list: Sk.builtin.list,
        long_$rw$: Sk.builtin.lng,
        method: Sk.builtin.method,
        object: Sk.builtin.object,
        slice: Sk.builtin.slice,
        str: Sk.builtin.str,
        set: Sk.builtin.set,
        tuple: Sk.builtin.tuple,
        type: Sk.builtin.type,
        input: Sk.builtin.input
    };
    goog.exportSymbol("Sk.builtins", Sk.builtins);
}());
