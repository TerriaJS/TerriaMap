/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "dist/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function() {
    'use strict';

    /**
     * @exports defined
     *
     * @param {*} value The object.
     * @returns {Boolean} Returns true if the object is defined, returns false otherwise.
     *
     * @example
     * if (Cesium.defined(positions)) {
     *      doSomething();
     * } else {
     *      doSomethingElse();
     * }
     */
    function defined(value) {
        return value !== undefined && value !== null;
    }

    return defined;
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
        __webpack_require__(5)
    ], __WEBPACK_AMD_DEFINE_RESULT__ = (function(
        freezeObject) {
    'use strict';

    /**
     * Returns the first parameter if not undefined, otherwise the second parameter.
     * Useful for setting a default value for a parameter.
     *
     * @exports defaultValue
     *
     * @param {*} a
     * @param {*} b
     * @returns {*} Returns the first parameter if not undefined, otherwise the second parameter.
     *
     * @example
     * param = Cesium.defaultValue(param, 'default');
     */
    function defaultValue(a, b) {
        if (a !== undefined && a !== null) {
            return a;
        }
        return b;
    }

    /**
     * A frozen empty object that can be used as the default value for options passed as
     * an object literal.
     * @type {Object}
     */
    defaultValue.EMPTY_OBJECT = freezeObject({});

    return defaultValue;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _defined = __webpack_require__(0);

var _defined2 = _interopRequireDefault(_defined);

var _DataUri = __webpack_require__(3);

var _DataUri2 = _interopRequireDefault(_DataUri);

var _sortedIndices = __webpack_require__(9);

var _sortedIndices2 = _interopRequireDefault(_sortedIndices);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Create combined arrays from arrays of column values, eg. [[values1, values2, values3], [values4, values5]].
 * The first columns of each array must be of the same type (in the above example, values1 and values4).
 * These are combined and sorted into a single column.
 * Then the subsequent columns are added, filling with null where missing. (This could be an option in future.)
 * Eg. if the values of each col are: values1=[1,3]; values2=[10,30]; values3=[100,300]; values4=[1,2]; values5=[-1,-2];
 * then the resulting array of column values are, in order, [1,2,3]; [10,null,30]; [100,null,300]; [-1,-2,null].
 * @param {Array[]} valueArrays See description above.
 * @return {Array[]} The synthesized values which could be passed to a table structure.
 */
function combineValueArrays(valueArrays) {
    if (!(0, _defined2.default)(valueArrays) || valueArrays.length < 1) {
        return;
    }
    var combinedValueArrays = [];
    // Start by copying the first set of columns into the result.
    var firstArray = valueArrays[0];
    for (var j = 0; j < firstArray.length; j++) {
        var values = firstArray[j];
        combinedValueArrays.push(values.slice());
    }
    // Then add the subsequent sets of x-columns to the end of the first result column,
    // add nulls to the end of the other existing columns,
    // add nulls to the start of the new columns,
    // and add them to the end of the result.
    for (var i = 1; i < valueArrays.length; i++) {
        var currentValueArray = valueArrays[i];
        var currentFirstArray = currentValueArray[0];
        var preExistingValuesLength = combinedValueArrays[0].length;
        combinedValueArrays[0] = combinedValueArrays[0].concat(currentFirstArray);
        var empty1 = new Array(currentFirstArray.length); // elements are undefined.
        for (var k = 1; k < combinedValueArrays.length; k++) {
            combinedValueArrays[k] = combinedValueArrays[k].concat(empty1);
        }
        var empty2 = new Array(preExistingValuesLength); // elements are undefined.
        for (var _j = 1; _j < currentValueArray.length; _j++) {
            var _values = currentValueArray[_j];
            combinedValueArrays.push(empty2.concat(_values));
        }
    }

    // Sort by the first column.
    combinedValueArrays = sortByFirst(combinedValueArrays);
    combinedValueArrays = combineRepeated(combinedValueArrays);

    return combinedValueArrays;
}

/**
 * Eg. sortByFirst([['b', 'a', 'c'], [1, 2, 3]]) = [['a', 'b', 'c'], [2, 1, 3]].
 * @param  {Array[]} valueArrays The array of arrays of values to sort.
 * @return {Array[]} The values sorted by the first column.
 */
/* global onmessage:true */
function sortByFirst(valueArrays) {
    var firstValues = valueArrays[0];
    var indices = (0, _sortedIndices2.default)(firstValues);
    return valueArrays.map(function (values) {
        return indices.map(function (sortedIndex) {
            return values[sortedIndex];
        });
    });
}

/**
 * @param  {Array[]} sortedJulianDateOrValueArrays The array of arrays of values to combine. These must be sortedByFirst. Dates must be JulianDates.
 * @param  {Integer} [firstColumnType] Eg. VarType.TIME.
 * @return {Array[]} The values, with any repeats in the first column combined into one. Dates are converted to ISO8601 string representation.
 *
 * Eg.
 * var x = [['a', 'b', 'b', 'c'], [1, 2, undefined, 3], [4, undefined, 5, undefined]];
 * combineRepeated(x);
 * # x is [['a', 'b', 'c'], [1, 2, 3], [4, 5, undefined]].
 */
function combineRepeated(sortedValueArrays) {
    var result = new Array(sortedValueArrays.length);
    for (var i = 0; i < result.length; i++) {
        result[i] = [sortedValueArrays[i][0]];
    }
    for (var j = 1; j < sortedValueArrays[0].length; j++) {
        if (sortedValueArrays[0][j] === sortedValueArrays[0][j - 1]) {
            var currentIndex = result[0].length - 1;
            for (var _i = 0; _i < result.length; _i++) {
                if (result[_i][currentIndex] === undefined) {
                    result[_i][currentIndex] = sortedValueArrays[_i][j];
                }
            }
        } else {
            for (var _i2 = 0; _i2 < result.length; _i2++) {
                result[_i2].push(sortedValueArrays[_i2][j]);
            }
        }
    }
    return result;
}

/**
 * Convert an array of column values, with column names, to an array of row values.
 * @param  {Array[]} columnValueArrays Array of column values, eg. [[1,2,3], [4,5,6]].
 * @param  {String[]} columnNames Array of column names, eg ['x', 'y'].
 * @return {Array[]} Array of rows, starting with the column names, eg. [['x', 'y'], [1, 4], [2, 5], [3, 6]].
 */
function toArrayOfRows(columnValueArrays, columnNames) {
    if (columnValueArrays.length < 1) {
        return;
    }
    var rows = columnValueArrays[0].map(function (value0, rowIndex) {
        return columnValueArrays.map(function (values) {
            return values[rowIndex];
        });
    });
    rows.unshift(columnNames);
    return rows;
}

onmessage = function onmessage(event) {
    var valueArrays = event.data.values.map(function (valuesArray) {
        return valuesArray.map(function (values) {
            return Array.prototype.slice.call(values);
        });
    }); // Convert from typed arrays.
    var nameArrays = event.data.names;
    var combinedValues = combineValueArrays(valueArrays);
    var rows = toArrayOfRows(combinedValues, nameArrays);
    var joinedRows = rows.map(function (row) {
        return row.join(',');
    });
    var csvString = joinedRows.join('\n');
    var href = _DataUri2.default.make('csv', csvString);
    postMessage(href);
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var defined = __webpack_require__(0);
var FeatureDetection = __webpack_require__(4);
var TerriaError = __webpack_require__(8);

// Unfortunately there's no way to feature-detect for this, it's something that only MS browsers disallow for security reasons.
var canUseDataUriInHref = !(FeatureDetection.isInternetExplorer() || /Edge/.exec(navigator.userAgent));

var DataUri = {
    /**
     * Turn a file with the supplied type and stringified data into a data uri that can be set as the href of an anchor tag.
     * @param {String} type Data type, eg. 'json' or 'csv'.
     * @param {String} dataString The data.
     * @return {String} A string that can be used to in an anchor tag's 'href' attribute to represent downloadable data.
     */
    make: function make(type, dataString) {
        if (dataString) {
            // Using attachment/* mime type makes safari download as attachment. text/* works on Chrome (as does attachment).
            return 'data:attachment/' + type + ',' + encodeURIComponent(dataString);
        }
    },

    /**
     * Returns a flag stating if data uri links are supported by the user's browser.
     * If errorEvent is provided, presents an error message explaining why it won't work.
     * @param {Error} [errorEvent] A Cesium Event, eg. terria.error, used to raise an error if the browser does not support data download.
     * @param {String} [href] The link to provide in the error message. Required if errorEvent is provided.
     * @param {Boolean} [forceError] If true, always show the error message. Defaults to false, which only shows it if the browser cannot download uri links.
     * @return {Boolean} Returns whether the browser is compatible with data uris.
     */
    checkCompatibility: function checkCompatibility(errorEvent, href, forceError) {
        if (!canUseDataUriInHref || forceError) {
            if (defined(errorEvent)) {
                errorEvent.raiseEvent(new TerriaError({
                    title: 'Browser Does Not Support Data Download',
                    message: 'Unfortunately Microsoft browsers (including all versions of Internet Explorer and Edge) do not ' + 'support the data uri functionality needed to download data as a file. To download, copy the following uri ' + 'into another browser such as Chrome, Firefox or Safari: ' + href
                }));
            }
            return false;
        } else {
            return true;
        }
    }
};

module.exports = DataUri;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
        __webpack_require__(1),
        __webpack_require__(0),
        __webpack_require__(6)
    ], __WEBPACK_AMD_DEFINE_RESULT__ = (function(
        defaultValue,
        defined,
        Fullscreen) {
    'use strict';
    /*global CanvasPixelArray*/

    var theNavigator;
    if (typeof navigator !== 'undefined') {
        theNavigator = navigator;
    } else {
        theNavigator = {};
    }

    function extractVersion(versionString) {
        var parts = versionString.split('.');
        for (var i = 0, len = parts.length; i < len; ++i) {
            parts[i] = parseInt(parts[i], 10);
        }
        return parts;
    }

    var isChromeResult;
    var chromeVersionResult;
    function isChrome() {
        if (!defined(isChromeResult)) {
            isChromeResult = false;
            // Edge contains Chrome in the user agent too
            if (!isEdge()) {
                var fields = (/ Chrome\/([\.0-9]+)/).exec(theNavigator.userAgent);
                if (fields !== null) {
                    isChromeResult = true;
                    chromeVersionResult = extractVersion(fields[1]);
                }
            }
        }

        return isChromeResult;
    }

    function chromeVersion() {
        return isChrome() && chromeVersionResult;
    }

    var isSafariResult;
    var safariVersionResult;
    function isSafari() {
        if (!defined(isSafariResult)) {
            isSafariResult = false;

            // Chrome and Edge contain Safari in the user agent too
            if (!isChrome() && !isEdge() && (/ Safari\/[\.0-9]+/).test(theNavigator.userAgent)) {
                var fields = (/ Version\/([\.0-9]+)/).exec(theNavigator.userAgent);
                if (fields !== null) {
                    isSafariResult = true;
                    safariVersionResult = extractVersion(fields[1]);
                }
            }
        }

        return isSafariResult;
    }

    function safariVersion() {
        return isSafari() && safariVersionResult;
    }

    var isWebkitResult;
    var webkitVersionResult;
    function isWebkit() {
        if (!defined(isWebkitResult)) {
            isWebkitResult = false;

            var fields = (/ AppleWebKit\/([\.0-9]+)(\+?)/).exec(theNavigator.userAgent);
            if (fields !== null) {
                isWebkitResult = true;
                webkitVersionResult = extractVersion(fields[1]);
                webkitVersionResult.isNightly = !!fields[2];
            }
        }

        return isWebkitResult;
    }

    function webkitVersion() {
        return isWebkit() && webkitVersionResult;
    }

    var isInternetExplorerResult;
    var internetExplorerVersionResult;
    function isInternetExplorer() {
        if (!defined(isInternetExplorerResult)) {
            isInternetExplorerResult = false;

            var fields;
            if (theNavigator.appName === 'Microsoft Internet Explorer') {
                fields = /MSIE ([0-9]{1,}[\.0-9]{0,})/.exec(theNavigator.userAgent);
                if (fields !== null) {
                    isInternetExplorerResult = true;
                    internetExplorerVersionResult = extractVersion(fields[1]);
                }
            } else if (theNavigator.appName === 'Netscape') {
                fields = /Trident\/.*rv:([0-9]{1,}[\.0-9]{0,})/.exec(theNavigator.userAgent);
                if (fields !== null) {
                    isInternetExplorerResult = true;
                    internetExplorerVersionResult = extractVersion(fields[1]);
                }
            }
        }
        return isInternetExplorerResult;
    }

    function internetExplorerVersion() {
        return isInternetExplorer() && internetExplorerVersionResult;
    }

    var isEdgeResult;
    var edgeVersionResult;
    function isEdge() {
        if (!defined(isEdgeResult)) {
            isEdgeResult = false;
            var fields = (/ Edge\/([\.0-9]+)/).exec(theNavigator.userAgent);
            if (fields !== null) {
                isEdgeResult = true;
                edgeVersionResult = extractVersion(fields[1]);
            }
        }
        return isEdgeResult;
    }

    function edgeVersion() {
        return isEdge() && edgeVersionResult;
    }

    var isFirefoxResult;
    var firefoxVersionResult;
    function isFirefox() {
        if (!defined(isFirefoxResult)) {
            isFirefoxResult = false;

            var fields = /Firefox\/([\.0-9]+)/.exec(theNavigator.userAgent);
            if (fields !== null) {
                isFirefoxResult = true;
                firefoxVersionResult = extractVersion(fields[1]);
            }
        }
        return isFirefoxResult;
    }

    var isWindowsResult;
    function isWindows() {
        if (!defined(isWindowsResult)) {
            isWindowsResult = /Windows/i.test(theNavigator.appVersion);
        }
        return isWindowsResult;
    }

    function firefoxVersion() {
        return isFirefox() && firefoxVersionResult;
    }

    var hasPointerEvents;
    function supportsPointerEvents() {
        if (!defined(hasPointerEvents)) {
            //While navigator.pointerEnabled is deprecated in the W3C specification
            //we still need to use it if it exists in order to support browsers
            //that rely on it, such as the Windows WebBrowser control which defines
            //PointerEvent but sets navigator.pointerEnabled to false.

            //Firefox disabled because of https://github.com/AnalyticalGraphicsInc/cesium/issues/6372
            hasPointerEvents = !isFirefox() && typeof PointerEvent !== 'undefined' && (!defined(theNavigator.pointerEnabled) || theNavigator.pointerEnabled);
        }
        return hasPointerEvents;
    }

    var imageRenderingValueResult;
    var supportsImageRenderingPixelatedResult;
    function supportsImageRenderingPixelated() {
        if (!defined(supportsImageRenderingPixelatedResult)) {
            var canvas = document.createElement('canvas');
            canvas.setAttribute('style',
                                'image-rendering: -moz-crisp-edges;' +
                                'image-rendering: pixelated;');
            //canvas.style.imageRendering will be undefined, null or an empty string on unsupported browsers.
            var tmp = canvas.style.imageRendering;
            supportsImageRenderingPixelatedResult = defined(tmp) && tmp !== '';
            if (supportsImageRenderingPixelatedResult) {
                imageRenderingValueResult = tmp;
            }
        }
        return supportsImageRenderingPixelatedResult;
    }

    function imageRenderingValue() {
        return supportsImageRenderingPixelated() ? imageRenderingValueResult : undefined;
    }

    var typedArrayTypes = [];
    if (typeof ArrayBuffer !== 'undefined') {
        typedArrayTypes.push(Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array);

        if (typeof Uint8ClampedArray !== 'undefined') {
            typedArrayTypes.push(Uint8ClampedArray);
        }

        if (typeof CanvasPixelArray !== 'undefined') {
            typedArrayTypes.push(CanvasPixelArray);
        }
    }

    /**
     * A set of functions to detect whether the current browser supports
     * various features.
     *
     * @exports FeatureDetection
     */
    var FeatureDetection = {
        isChrome : isChrome,
        chromeVersion : chromeVersion,
        isSafari : isSafari,
        safariVersion : safariVersion,
        isWebkit : isWebkit,
        webkitVersion : webkitVersion,
        isInternetExplorer : isInternetExplorer,
        internetExplorerVersion : internetExplorerVersion,
        isEdge : isEdge,
        edgeVersion : edgeVersion,
        isFirefox : isFirefox,
        firefoxVersion : firefoxVersion,
        isWindows : isWindows,
        hardwareConcurrency : defaultValue(theNavigator.hardwareConcurrency, 3),
        supportsPointerEvents : supportsPointerEvents,
        supportsImageRenderingPixelated: supportsImageRenderingPixelated,
        imageRenderingValue: imageRenderingValue,
        typedArrayTypes: typedArrayTypes
    };

    /**
     * Detects whether the current browser supports the full screen standard.
     *
     * @returns {Boolean} true if the browser supports the full screen standard, false if not.
     *
     * @see Fullscreen
     * @see {@link http://dvcs.w3.org/hg/fullscreen/raw-file/tip/Overview.html|W3C Fullscreen Living Specification}
     */
    FeatureDetection.supportsFullscreen = function() {
        return Fullscreen.supportsFullscreen();
    };

    /**
     * Detects whether the current browser supports typed arrays.
     *
     * @returns {Boolean} true if the browser supports typed arrays, false if not.
     *
     * @see {@link http://www.khronos.org/registry/typedarray/specs/latest/|Typed Array Specification}
     */
    FeatureDetection.supportsTypedArrays = function() {
        return typeof ArrayBuffer !== 'undefined';
    };

    /**
     * Detects whether the current browser supports Web Workers.
     *
     * @returns {Boolean} true if the browsers supports Web Workers, false if not.
     *
     * @see {@link http://www.w3.org/TR/workers/}
     */
    FeatureDetection.supportsWebWorkers = function() {
        return typeof Worker !== 'undefined';
    };

    /**
     * Detects whether the current browser supports Web Assembly.
     *
     * @returns {Boolean} true if the browsers supports Web Assembly, false if not.
     *
     * @see {@link https://developer.mozilla.org/en-US/docs/WebAssembly}
     */
    FeatureDetection.supportsWebAssembly = function() {
        return typeof WebAssembly !== 'undefined' && !FeatureDetection.isEdge();
    };

    return FeatureDetection;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
        __webpack_require__(0)
    ], __WEBPACK_AMD_DEFINE_RESULT__ = (function(
        defined) {
    'use strict';

    /**
     * Freezes an object, using Object.freeze if available, otherwise returns
     * the object unchanged.  This function should be used in setup code to prevent
     * errors from completely halting JavaScript execution in legacy browsers.
     *
     * @private
     *
     * @exports freezeObject
     */
    var freezeObject = Object.freeze;
    if (!defined(freezeObject)) {
        freezeObject = function(o) {
            return o;
        };
    }

    return freezeObject;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
        __webpack_require__(0),
        __webpack_require__(7)
    ], __WEBPACK_AMD_DEFINE_RESULT__ = (function(
        defined,
        defineProperties) {
    'use strict';

    var _supportsFullscreen;
    var _names = {
        requestFullscreen : undefined,
        exitFullscreen : undefined,
        fullscreenEnabled : undefined,
        fullscreenElement : undefined,
        fullscreenchange : undefined,
        fullscreenerror : undefined
    };

    /**
     * Browser-independent functions for working with the standard fullscreen API.
     *
     * @exports Fullscreen
     *
     * @see {@link http://dvcs.w3.org/hg/fullscreen/raw-file/tip/Overview.html|W3C Fullscreen Living Specification}
     */
    var Fullscreen = {};

    defineProperties(Fullscreen, {
        /**
         * The element that is currently fullscreen, if any.  To simply check if the
         * browser is in fullscreen mode or not, use {@link Fullscreen#fullscreen}.
         * @memberof Fullscreen
         * @type {Object}
         * @readonly
         */
        element : {
            get : function() {
                if (!Fullscreen.supportsFullscreen()) {
                    return undefined;
                }

                return document[_names.fullscreenElement];
            }
        },

        /**
         * The name of the event on the document that is fired when fullscreen is
         * entered or exited.  This event name is intended for use with addEventListener.
         * In your event handler, to determine if the browser is in fullscreen mode or not,
         * use {@link Fullscreen#fullscreen}.
         * @memberof Fullscreen
         * @type {String}
         * @readonly
         */
        changeEventName : {
            get : function() {
                if (!Fullscreen.supportsFullscreen()) {
                    return undefined;
                }

                return _names.fullscreenchange;
            }
        },

        /**
         * The name of the event that is fired when a fullscreen error
         * occurs.  This event name is intended for use with addEventListener.
         * @memberof Fullscreen
         * @type {String}
         * @readonly
         */
        errorEventName : {
            get : function() {
                if (!Fullscreen.supportsFullscreen()) {
                    return undefined;
                }

                return _names.fullscreenerror;
            }
        },

        /**
         * Determine whether the browser will allow an element to be made fullscreen, or not.
         * For example, by default, iframes cannot go fullscreen unless the containing page
         * adds an "allowfullscreen" attribute (or prefixed equivalent).
         * @memberof Fullscreen
         * @type {Boolean}
         * @readonly
         */
        enabled : {
            get : function() {
                if (!Fullscreen.supportsFullscreen()) {
                    return undefined;
                }

                return document[_names.fullscreenEnabled];
            }
        },

        /**
         * Determines if the browser is currently in fullscreen mode.
         * @memberof Fullscreen
         * @type {Boolean}
         * @readonly
         */
        fullscreen : {
            get : function() {
                if (!Fullscreen.supportsFullscreen()) {
                    return undefined;
                }

                return Fullscreen.element !== null;
            }
        }
    });

    /**
     * Detects whether the browser supports the standard fullscreen API.
     *
     * @returns {Boolean} <code>true</code> if the browser supports the standard fullscreen API,
     * <code>false</code> otherwise.
     */
    Fullscreen.supportsFullscreen = function() {
        if (defined(_supportsFullscreen)) {
            return _supportsFullscreen;
        }

        _supportsFullscreen = false;

        var body = document.body;
        if (typeof body.requestFullscreen === 'function') {
            // go with the unprefixed, standard set of names
            _names.requestFullscreen = 'requestFullscreen';
            _names.exitFullscreen = 'exitFullscreen';
            _names.fullscreenEnabled = 'fullscreenEnabled';
            _names.fullscreenElement = 'fullscreenElement';
            _names.fullscreenchange = 'fullscreenchange';
            _names.fullscreenerror = 'fullscreenerror';
            _supportsFullscreen = true;
            return _supportsFullscreen;
        }

        //check for the correct combination of prefix plus the various names that browsers use
        var prefixes = ['webkit', 'moz', 'o', 'ms', 'khtml'];
        var name;
        for (var i = 0, len = prefixes.length; i < len; ++i) {
            var prefix = prefixes[i];

            // casing of Fullscreen differs across browsers
            name = prefix + 'RequestFullscreen';
            if (typeof body[name] === 'function') {
                _names.requestFullscreen = name;
                _supportsFullscreen = true;
            } else {
                name = prefix + 'RequestFullScreen';
                if (typeof body[name] === 'function') {
                    _names.requestFullscreen = name;
                    _supportsFullscreen = true;
                }
            }

            // disagreement about whether it's "exit" as per spec, or "cancel"
            name = prefix + 'ExitFullscreen';
            if (typeof document[name] === 'function') {
                _names.exitFullscreen = name;
            } else {
                name = prefix + 'CancelFullScreen';
                if (typeof document[name] === 'function') {
                    _names.exitFullscreen = name;
                }
            }

            // casing of Fullscreen differs across browsers
            name = prefix + 'FullscreenEnabled';
            if (document[name] !== undefined) {
                _names.fullscreenEnabled = name;
            } else {
                name = prefix + 'FullScreenEnabled';
                if (document[name] !== undefined) {
                    _names.fullscreenEnabled = name;
                }
            }

            // casing of Fullscreen differs across browsers
            name = prefix + 'FullscreenElement';
            if (document[name] !== undefined) {
                _names.fullscreenElement = name;
            } else {
                name = prefix + 'FullScreenElement';
                if (document[name] !== undefined) {
                    _names.fullscreenElement = name;
                }
            }

            // thankfully, event names are all lowercase per spec
            name = prefix + 'fullscreenchange';
            // event names do not have 'on' in the front, but the property on the document does
            if (document['on' + name] !== undefined) {
                //except on IE
                if (prefix === 'ms') {
                    name = 'MSFullscreenChange';
                }
                _names.fullscreenchange = name;
            }

            name = prefix + 'fullscreenerror';
            if (document['on' + name] !== undefined) {
                //except on IE
                if (prefix === 'ms') {
                    name = 'MSFullscreenError';
                }
                _names.fullscreenerror = name;
            }
        }

        return _supportsFullscreen;
    };

    /**
     * Asynchronously requests the browser to enter fullscreen mode on the given element.
     * If fullscreen mode is not supported by the browser, does nothing.
     *
     * @param {Object} element The HTML element which will be placed into fullscreen mode.
     * @param {HMDVRDevice} [vrDevice] The VR device.
     *
     * @example
     * // Put the entire page into fullscreen.
     * Cesium.Fullscreen.requestFullscreen(document.body)
     *
     * // Place only the Cesium canvas into fullscreen.
     * Cesium.Fullscreen.requestFullscreen(scene.canvas)
     */
    Fullscreen.requestFullscreen = function(element, vrDevice) {
        if (!Fullscreen.supportsFullscreen()) {
            return;
        }

        element[_names.requestFullscreen]({ vrDisplay: vrDevice });
    };

    /**
     * Asynchronously exits fullscreen mode.  If the browser is not currently
     * in fullscreen, or if fullscreen mode is not supported by the browser, does nothing.
     */
    Fullscreen.exitFullscreen = function() {
        if (!Fullscreen.supportsFullscreen()) {
            return;
        }

        document[_names.exitFullscreen]();
    };

    return Fullscreen;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
        __webpack_require__(0)
    ], __WEBPACK_AMD_DEFINE_RESULT__ = (function(
        defined) {
    'use strict';

    var definePropertyWorks = (function() {
        try {
            return 'x' in Object.defineProperty({}, 'x', {});
        } catch (e) {
            return false;
        }
    })();

    /**
     * Defines properties on an object, using Object.defineProperties if available,
     * otherwise returns the object unchanged.  This function should be used in
     * setup code to prevent errors from completely halting JavaScript execution
     * in legacy browsers.
     *
     * @private
     *
     * @exports defineProperties
     */
    var defineProperties = Object.defineProperties;
    if (!definePropertyWorks || !defined(defineProperties)) {
        defineProperties = function(o) {
            return o;
        };
    }

    return defineProperties;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*global require*/

var defaultValue = __webpack_require__(1);

/**
 * Represents an error that occurred in a TerriaJS module, especially an asynchronous one that cannot be raised
 * by throwing an exception because no one would be able to catch it.
 *
 * @alias TerriaError
 * @constructor
 *
 * @param {Object} options Object with the following properties:
 * @param {Object} [options.sender] The object raising the error.
 * @param {String} [options.title='An error occurred'] A short title describing the error.
 * @param {String} options.message A detailed message describing the error.  This message may be HTML and it should be sanitized before display to the user.
 */
var TerriaError = function TerriaError(options) {
  options = defaultValue(options, defaultValue.EMPTY_OBJECT);

  /**
   * Gets or sets the object that raised the error.
   * @type {Object}
   */
  this.sender = options.sender;

  /**
   * Gets or sets a short title describing the error.
   * @type {String}
   */
  this.title = defaultValue(options.title, 'An error occurred');

  /**
   * Gets or sets a metailed message describing the error.  This message may be HTML and it should be sanitized before display to the user.
   * @type {String}
   */
  this.message = options.message;

  /**
   * True if the user has seen this error; otherwise, false.
   * @type {Boolean}
   * @default false
   */
  this.raisedToUser = false;
};

module.exports = TerriaError;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Returns indices such that array[indices[i]] = sortedArray[i].
 * Eg. sortedIndices(['c', 'a', 'b', 'd']) => [1, 2, 0, 3]. (The sorted array is [a, b, c, d], and "a" was in position 1, "b" in position 2, etc.)
 * @param {Array} array The array to sort.
 * @param {Function} [compareFunction] The usual compare function, eg. function(a, b) { return a - b }.
 * @return {Array} The sorted indices, such that array[sortedIndices[0]] = sortedArray[0].
 */

function sortedIndices(array, compareFunction) {
    var length = array.length;
    var indices = new Array(length);
    for (var i = 0; i < length; i++) {
        indices[i] = i;
    }
    if (!compareFunction) {
        compareFunction = function compareFunction(a, b) {
            return a < b ? -1 : a > b ? 1 : 0;
        };
    }
    indices.sort(function (a, b) {
        return compareFunction(array[a], array[b]);
    });
    return indices;
}

//
// Note: for indices which go in the other direction, just use indexOf like this:
//
// it('inverse indices work', function() {
//     var data = ['c', 'a', 'b', 'd'];
//     var sorted = data.slice().sort();
//     var inverseIndices = data.map(function(datum) { return sorted.indexOf(datum); });
//     expect(inverseIndices).toEqual([2, 0, 1, 3]);
// });


module.exports = sortedIndices;

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjAyN2JkZDEyYWRjYTJjMTg4MDMud29ya2VyLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIGIwMjdiZGQxMmFkY2EyYzE4ODAzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy90ZXJyaWFqcy1jZXNpdW0vU291cmNlL0NvcmUvZGVmaW5lZC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdGVycmlhanMtY2VzaXVtL1NvdXJjZS9Db3JlL2RlZmF1bHRWYWx1ZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdGVycmlhanMvbGliL1JlYWN0Vmlld3MvQ3VzdG9tL0NoYXJ0L2Rvd25sb2FkSHJlZldvcmtlci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdGVycmlhanMvbGliL0NvcmUvRGF0YVVyaS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdGVycmlhanMtY2VzaXVtL1NvdXJjZS9Db3JlL0ZlYXR1cmVEZXRlY3Rpb24uanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3RlcnJpYWpzLWNlc2l1bS9Tb3VyY2UvQ29yZS9mcmVlemVPYmplY3QuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3RlcnJpYWpzLWNlc2l1bS9Tb3VyY2UvQ29yZS9GdWxsc2NyZWVuLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy90ZXJyaWFqcy1jZXNpdW0vU291cmNlL0NvcmUvZGVmaW5lUHJvcGVydGllcy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdGVycmlhanMvbGliL0NvcmUvVGVycmlhRXJyb3IuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3RlcnJpYWpzL2xpYi9Db3JlL3NvcnRlZEluZGljZXMuanMiXSwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiZGlzdC9cIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAyKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCBiMDI3YmRkMTJhZGNhMmMxODgwMyIsImRlZmluZShmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBleHBvcnRzIGRlZmluZWRcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSBvYmplY3QuXHJcbiAgICAgKiBAcmV0dXJucyB7Qm9vbGVhbn0gUmV0dXJucyB0cnVlIGlmIHRoZSBvYmplY3QgaXMgZGVmaW5lZCwgcmV0dXJucyBmYWxzZSBvdGhlcndpc2UuXHJcbiAgICAgKlxyXG4gICAgICogQGV4YW1wbGVcclxuICAgICAqIGlmIChDZXNpdW0uZGVmaW5lZChwb3NpdGlvbnMpKSB7XHJcbiAgICAgKiAgICAgIGRvU29tZXRoaW5nKCk7XHJcbiAgICAgKiB9IGVsc2Uge1xyXG4gICAgICogICAgICBkb1NvbWV0aGluZ0Vsc2UoKTtcclxuICAgICAqIH1cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gZGVmaW5lZCh2YWx1ZSkge1xyXG4gICAgICAgIHJldHVybiB2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBkZWZpbmVkO1xyXG59KTtcclxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvdGVycmlhanMtY2VzaXVtL1NvdXJjZS9Db3JlL2RlZmluZWQuanNcbi8vIG1vZHVsZSBpZCA9IDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZGVmaW5lKFtcclxuICAgICAgICAnLi9mcmVlemVPYmplY3QnXHJcbiAgICBdLCBmdW5jdGlvbihcclxuICAgICAgICBmcmVlemVPYmplY3QpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIGZpcnN0IHBhcmFtZXRlciBpZiBub3QgdW5kZWZpbmVkLCBvdGhlcndpc2UgdGhlIHNlY29uZCBwYXJhbWV0ZXIuXHJcbiAgICAgKiBVc2VmdWwgZm9yIHNldHRpbmcgYSBkZWZhdWx0IHZhbHVlIGZvciBhIHBhcmFtZXRlci5cclxuICAgICAqXHJcbiAgICAgKiBAZXhwb3J0cyBkZWZhdWx0VmFsdWVcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0geyp9IGFcclxuICAgICAqIEBwYXJhbSB7Kn0gYlxyXG4gICAgICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGZpcnN0IHBhcmFtZXRlciBpZiBub3QgdW5kZWZpbmVkLCBvdGhlcndpc2UgdGhlIHNlY29uZCBwYXJhbWV0ZXIuXHJcbiAgICAgKlxyXG4gICAgICogQGV4YW1wbGVcclxuICAgICAqIHBhcmFtID0gQ2VzaXVtLmRlZmF1bHRWYWx1ZShwYXJhbSwgJ2RlZmF1bHQnKTtcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gZGVmYXVsdFZhbHVlKGEsIGIpIHtcclxuICAgICAgICBpZiAoYSAhPT0gdW5kZWZpbmVkICYmIGEgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBiO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQSBmcm96ZW4gZW1wdHkgb2JqZWN0IHRoYXQgY2FuIGJlIHVzZWQgYXMgdGhlIGRlZmF1bHQgdmFsdWUgZm9yIG9wdGlvbnMgcGFzc2VkIGFzXHJcbiAgICAgKiBhbiBvYmplY3QgbGl0ZXJhbC5cclxuICAgICAqIEB0eXBlIHtPYmplY3R9XHJcbiAgICAgKi9cclxuICAgIGRlZmF1bHRWYWx1ZS5FTVBUWV9PQkpFQ1QgPSBmcmVlemVPYmplY3Qoe30pO1xyXG5cclxuICAgIHJldHVybiBkZWZhdWx0VmFsdWU7XHJcbn0pO1xyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy90ZXJyaWFqcy1jZXNpdW0vU291cmNlL0NvcmUvZGVmYXVsdFZhbHVlLmpzXG4vLyBtb2R1bGUgaWQgPSAxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0JztcblxudmFyIF9kZWZpbmVkID0gcmVxdWlyZSgndGVycmlhanMtY2VzaXVtL1NvdXJjZS9Db3JlL2RlZmluZWQnKTtcblxudmFyIF9kZWZpbmVkMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2RlZmluZWQpO1xuXG52YXIgX0RhdGFVcmkgPSByZXF1aXJlKCcuLi8uLi8uLi9Db3JlL0RhdGFVcmknKTtcblxudmFyIF9EYXRhVXJpMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX0RhdGFVcmkpO1xuXG52YXIgX3NvcnRlZEluZGljZXMgPSByZXF1aXJlKCcuLi8uLi8uLi9Db3JlL3NvcnRlZEluZGljZXMnKTtcblxudmFyIF9zb3J0ZWRJbmRpY2VzMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3NvcnRlZEluZGljZXMpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG4vKipcclxuICogQ3JlYXRlIGNvbWJpbmVkIGFycmF5cyBmcm9tIGFycmF5cyBvZiBjb2x1bW4gdmFsdWVzLCBlZy4gW1t2YWx1ZXMxLCB2YWx1ZXMyLCB2YWx1ZXMzXSwgW3ZhbHVlczQsIHZhbHVlczVdXS5cclxuICogVGhlIGZpcnN0IGNvbHVtbnMgb2YgZWFjaCBhcnJheSBtdXN0IGJlIG9mIHRoZSBzYW1lIHR5cGUgKGluIHRoZSBhYm92ZSBleGFtcGxlLCB2YWx1ZXMxIGFuZCB2YWx1ZXM0KS5cclxuICogVGhlc2UgYXJlIGNvbWJpbmVkIGFuZCBzb3J0ZWQgaW50byBhIHNpbmdsZSBjb2x1bW4uXHJcbiAqIFRoZW4gdGhlIHN1YnNlcXVlbnQgY29sdW1ucyBhcmUgYWRkZWQsIGZpbGxpbmcgd2l0aCBudWxsIHdoZXJlIG1pc3NpbmcuIChUaGlzIGNvdWxkIGJlIGFuIG9wdGlvbiBpbiBmdXR1cmUuKVxyXG4gKiBFZy4gaWYgdGhlIHZhbHVlcyBvZiBlYWNoIGNvbCBhcmU6IHZhbHVlczE9WzEsM107IHZhbHVlczI9WzEwLDMwXTsgdmFsdWVzMz1bMTAwLDMwMF07IHZhbHVlczQ9WzEsMl07IHZhbHVlczU9Wy0xLC0yXTtcclxuICogdGhlbiB0aGUgcmVzdWx0aW5nIGFycmF5IG9mIGNvbHVtbiB2YWx1ZXMgYXJlLCBpbiBvcmRlciwgWzEsMiwzXTsgWzEwLG51bGwsMzBdOyBbMTAwLG51bGwsMzAwXTsgWy0xLC0yLG51bGxdLlxyXG4gKiBAcGFyYW0ge0FycmF5W119IHZhbHVlQXJyYXlzIFNlZSBkZXNjcmlwdGlvbiBhYm92ZS5cclxuICogQHJldHVybiB7QXJyYXlbXX0gVGhlIHN5bnRoZXNpemVkIHZhbHVlcyB3aGljaCBjb3VsZCBiZSBwYXNzZWQgdG8gYSB0YWJsZSBzdHJ1Y3R1cmUuXHJcbiAqL1xuZnVuY3Rpb24gY29tYmluZVZhbHVlQXJyYXlzKHZhbHVlQXJyYXlzKSB7XG4gICAgaWYgKCEoMCwgX2RlZmluZWQyLmRlZmF1bHQpKHZhbHVlQXJyYXlzKSB8fCB2YWx1ZUFycmF5cy5sZW5ndGggPCAxKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIGNvbWJpbmVkVmFsdWVBcnJheXMgPSBbXTtcbiAgICAvLyBTdGFydCBieSBjb3B5aW5nIHRoZSBmaXJzdCBzZXQgb2YgY29sdW1ucyBpbnRvIHRoZSByZXN1bHQuXG4gICAgdmFyIGZpcnN0QXJyYXkgPSB2YWx1ZUFycmF5c1swXTtcbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IGZpcnN0QXJyYXkubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgdmFyIHZhbHVlcyA9IGZpcnN0QXJyYXlbal07XG4gICAgICAgIGNvbWJpbmVkVmFsdWVBcnJheXMucHVzaCh2YWx1ZXMuc2xpY2UoKSk7XG4gICAgfVxuICAgIC8vIFRoZW4gYWRkIHRoZSBzdWJzZXF1ZW50IHNldHMgb2YgeC1jb2x1bW5zIHRvIHRoZSBlbmQgb2YgdGhlIGZpcnN0IHJlc3VsdCBjb2x1bW4sXG4gICAgLy8gYWRkIG51bGxzIHRvIHRoZSBlbmQgb2YgdGhlIG90aGVyIGV4aXN0aW5nIGNvbHVtbnMsXG4gICAgLy8gYWRkIG51bGxzIHRvIHRoZSBzdGFydCBvZiB0aGUgbmV3IGNvbHVtbnMsXG4gICAgLy8gYW5kIGFkZCB0aGVtIHRvIHRoZSBlbmQgb2YgdGhlIHJlc3VsdC5cbiAgICBmb3IgKHZhciBpID0gMTsgaSA8IHZhbHVlQXJyYXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBjdXJyZW50VmFsdWVBcnJheSA9IHZhbHVlQXJyYXlzW2ldO1xuICAgICAgICB2YXIgY3VycmVudEZpcnN0QXJyYXkgPSBjdXJyZW50VmFsdWVBcnJheVswXTtcbiAgICAgICAgdmFyIHByZUV4aXN0aW5nVmFsdWVzTGVuZ3RoID0gY29tYmluZWRWYWx1ZUFycmF5c1swXS5sZW5ndGg7XG4gICAgICAgIGNvbWJpbmVkVmFsdWVBcnJheXNbMF0gPSBjb21iaW5lZFZhbHVlQXJyYXlzWzBdLmNvbmNhdChjdXJyZW50Rmlyc3RBcnJheSk7XG4gICAgICAgIHZhciBlbXB0eTEgPSBuZXcgQXJyYXkoY3VycmVudEZpcnN0QXJyYXkubGVuZ3RoKTsgLy8gZWxlbWVudHMgYXJlIHVuZGVmaW5lZC5cbiAgICAgICAgZm9yICh2YXIgayA9IDE7IGsgPCBjb21iaW5lZFZhbHVlQXJyYXlzLmxlbmd0aDsgaysrKSB7XG4gICAgICAgICAgICBjb21iaW5lZFZhbHVlQXJyYXlzW2tdID0gY29tYmluZWRWYWx1ZUFycmF5c1trXS5jb25jYXQoZW1wdHkxKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgZW1wdHkyID0gbmV3IEFycmF5KHByZUV4aXN0aW5nVmFsdWVzTGVuZ3RoKTsgLy8gZWxlbWVudHMgYXJlIHVuZGVmaW5lZC5cbiAgICAgICAgZm9yICh2YXIgX2ogPSAxOyBfaiA8IGN1cnJlbnRWYWx1ZUFycmF5Lmxlbmd0aDsgX2orKykge1xuICAgICAgICAgICAgdmFyIF92YWx1ZXMgPSBjdXJyZW50VmFsdWVBcnJheVtfal07XG4gICAgICAgICAgICBjb21iaW5lZFZhbHVlQXJyYXlzLnB1c2goZW1wdHkyLmNvbmNhdChfdmFsdWVzKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBTb3J0IGJ5IHRoZSBmaXJzdCBjb2x1bW4uXG4gICAgY29tYmluZWRWYWx1ZUFycmF5cyA9IHNvcnRCeUZpcnN0KGNvbWJpbmVkVmFsdWVBcnJheXMpO1xuICAgIGNvbWJpbmVkVmFsdWVBcnJheXMgPSBjb21iaW5lUmVwZWF0ZWQoY29tYmluZWRWYWx1ZUFycmF5cyk7XG5cbiAgICByZXR1cm4gY29tYmluZWRWYWx1ZUFycmF5cztcbn1cblxuLyoqXHJcbiAqIEVnLiBzb3J0QnlGaXJzdChbWydiJywgJ2EnLCAnYyddLCBbMSwgMiwgM11dKSA9IFtbJ2EnLCAnYicsICdjJ10sIFsyLCAxLCAzXV0uXHJcbiAqIEBwYXJhbSAge0FycmF5W119IHZhbHVlQXJyYXlzIFRoZSBhcnJheSBvZiBhcnJheXMgb2YgdmFsdWVzIHRvIHNvcnQuXHJcbiAqIEByZXR1cm4ge0FycmF5W119IFRoZSB2YWx1ZXMgc29ydGVkIGJ5IHRoZSBmaXJzdCBjb2x1bW4uXHJcbiAqL1xuLyogZ2xvYmFsIG9ubWVzc2FnZTp0cnVlICovXG5mdW5jdGlvbiBzb3J0QnlGaXJzdCh2YWx1ZUFycmF5cykge1xuICAgIHZhciBmaXJzdFZhbHVlcyA9IHZhbHVlQXJyYXlzWzBdO1xuICAgIHZhciBpbmRpY2VzID0gKDAsIF9zb3J0ZWRJbmRpY2VzMi5kZWZhdWx0KShmaXJzdFZhbHVlcyk7XG4gICAgcmV0dXJuIHZhbHVlQXJyYXlzLm1hcChmdW5jdGlvbiAodmFsdWVzKSB7XG4gICAgICAgIHJldHVybiBpbmRpY2VzLm1hcChmdW5jdGlvbiAoc29ydGVkSW5kZXgpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZXNbc29ydGVkSW5kZXhdO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn1cblxuLyoqXHJcbiAqIEBwYXJhbSAge0FycmF5W119IHNvcnRlZEp1bGlhbkRhdGVPclZhbHVlQXJyYXlzIFRoZSBhcnJheSBvZiBhcnJheXMgb2YgdmFsdWVzIHRvIGNvbWJpbmUuIFRoZXNlIG11c3QgYmUgc29ydGVkQnlGaXJzdC4gRGF0ZXMgbXVzdCBiZSBKdWxpYW5EYXRlcy5cclxuICogQHBhcmFtICB7SW50ZWdlcn0gW2ZpcnN0Q29sdW1uVHlwZV0gRWcuIFZhclR5cGUuVElNRS5cclxuICogQHJldHVybiB7QXJyYXlbXX0gVGhlIHZhbHVlcywgd2l0aCBhbnkgcmVwZWF0cyBpbiB0aGUgZmlyc3QgY29sdW1uIGNvbWJpbmVkIGludG8gb25lLiBEYXRlcyBhcmUgY29udmVydGVkIHRvIElTTzg2MDEgc3RyaW5nIHJlcHJlc2VudGF0aW9uLlxyXG4gKlxyXG4gKiBFZy5cclxuICogdmFyIHggPSBbWydhJywgJ2InLCAnYicsICdjJ10sIFsxLCAyLCB1bmRlZmluZWQsIDNdLCBbNCwgdW5kZWZpbmVkLCA1LCB1bmRlZmluZWRdXTtcclxuICogY29tYmluZVJlcGVhdGVkKHgpO1xyXG4gKiAjIHggaXMgW1snYScsICdiJywgJ2MnXSwgWzEsIDIsIDNdLCBbNCwgNSwgdW5kZWZpbmVkXV0uXHJcbiAqL1xuZnVuY3Rpb24gY29tYmluZVJlcGVhdGVkKHNvcnRlZFZhbHVlQXJyYXlzKSB7XG4gICAgdmFyIHJlc3VsdCA9IG5ldyBBcnJheShzb3J0ZWRWYWx1ZUFycmF5cy5sZW5ndGgpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVzdWx0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHJlc3VsdFtpXSA9IFtzb3J0ZWRWYWx1ZUFycmF5c1tpXVswXV07XG4gICAgfVxuICAgIGZvciAodmFyIGogPSAxOyBqIDwgc29ydGVkVmFsdWVBcnJheXNbMF0ubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgaWYgKHNvcnRlZFZhbHVlQXJyYXlzWzBdW2pdID09PSBzb3J0ZWRWYWx1ZUFycmF5c1swXVtqIC0gMV0pIHtcbiAgICAgICAgICAgIHZhciBjdXJyZW50SW5kZXggPSByZXN1bHRbMF0ubGVuZ3RoIC0gMTtcbiAgICAgICAgICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCByZXN1bHQubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdFtfaV1bY3VycmVudEluZGV4XSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdFtfaV1bY3VycmVudEluZGV4XSA9IHNvcnRlZFZhbHVlQXJyYXlzW19pXVtqXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmb3IgKHZhciBfaTIgPSAwOyBfaTIgPCByZXN1bHQubGVuZ3RoOyBfaTIrKykge1xuICAgICAgICAgICAgICAgIHJlc3VsdFtfaTJdLnB1c2goc29ydGVkVmFsdWVBcnJheXNbX2kyXVtqXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXHJcbiAqIENvbnZlcnQgYW4gYXJyYXkgb2YgY29sdW1uIHZhbHVlcywgd2l0aCBjb2x1bW4gbmFtZXMsIHRvIGFuIGFycmF5IG9mIHJvdyB2YWx1ZXMuXHJcbiAqIEBwYXJhbSAge0FycmF5W119IGNvbHVtblZhbHVlQXJyYXlzIEFycmF5IG9mIGNvbHVtbiB2YWx1ZXMsIGVnLiBbWzEsMiwzXSwgWzQsNSw2XV0uXHJcbiAqIEBwYXJhbSAge1N0cmluZ1tdfSBjb2x1bW5OYW1lcyBBcnJheSBvZiBjb2x1bW4gbmFtZXMsIGVnIFsneCcsICd5J10uXHJcbiAqIEByZXR1cm4ge0FycmF5W119IEFycmF5IG9mIHJvd3MsIHN0YXJ0aW5nIHdpdGggdGhlIGNvbHVtbiBuYW1lcywgZWcuIFtbJ3gnLCAneSddLCBbMSwgNF0sIFsyLCA1XSwgWzMsIDZdXS5cclxuICovXG5mdW5jdGlvbiB0b0FycmF5T2ZSb3dzKGNvbHVtblZhbHVlQXJyYXlzLCBjb2x1bW5OYW1lcykge1xuICAgIGlmIChjb2x1bW5WYWx1ZUFycmF5cy5sZW5ndGggPCAxKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHJvd3MgPSBjb2x1bW5WYWx1ZUFycmF5c1swXS5tYXAoZnVuY3Rpb24gKHZhbHVlMCwgcm93SW5kZXgpIHtcbiAgICAgICAgcmV0dXJuIGNvbHVtblZhbHVlQXJyYXlzLm1hcChmdW5jdGlvbiAodmFsdWVzKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWVzW3Jvd0luZGV4XTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgcm93cy51bnNoaWZ0KGNvbHVtbk5hbWVzKTtcbiAgICByZXR1cm4gcm93cztcbn1cblxub25tZXNzYWdlID0gZnVuY3Rpb24gb25tZXNzYWdlKGV2ZW50KSB7XG4gICAgdmFyIHZhbHVlQXJyYXlzID0gZXZlbnQuZGF0YS52YWx1ZXMubWFwKGZ1bmN0aW9uICh2YWx1ZXNBcnJheSkge1xuICAgICAgICByZXR1cm4gdmFsdWVzQXJyYXkubWFwKGZ1bmN0aW9uICh2YWx1ZXMpIHtcbiAgICAgICAgICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCh2YWx1ZXMpO1xuICAgICAgICB9KTtcbiAgICB9KTsgLy8gQ29udmVydCBmcm9tIHR5cGVkIGFycmF5cy5cbiAgICB2YXIgbmFtZUFycmF5cyA9IGV2ZW50LmRhdGEubmFtZXM7XG4gICAgdmFyIGNvbWJpbmVkVmFsdWVzID0gY29tYmluZVZhbHVlQXJyYXlzKHZhbHVlQXJyYXlzKTtcbiAgICB2YXIgcm93cyA9IHRvQXJyYXlPZlJvd3MoY29tYmluZWRWYWx1ZXMsIG5hbWVBcnJheXMpO1xuICAgIHZhciBqb2luZWRSb3dzID0gcm93cy5tYXAoZnVuY3Rpb24gKHJvdykge1xuICAgICAgICByZXR1cm4gcm93LmpvaW4oJywnKTtcbiAgICB9KTtcbiAgICB2YXIgY3N2U3RyaW5nID0gam9pbmVkUm93cy5qb2luKCdcXG4nKTtcbiAgICB2YXIgaHJlZiA9IF9EYXRhVXJpMi5kZWZhdWx0Lm1ha2UoJ2NzdicsIGNzdlN0cmluZyk7XG4gICAgcG9zdE1lc3NhZ2UoaHJlZik7XG59O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2JhYmVsLWxvYWRlci9saWI/P3JlZi0tNiEuL25vZGVfbW9kdWxlcy90ZXJyaWFqcy9saWIvUmVhY3RWaWV3cy9DdXN0b20vQ2hhcnQvZG93bmxvYWRIcmVmV29ya2VyLmpzXG4vLyBtb2R1bGUgaWQgPSAyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0JztcblxudmFyIGRlZmluZWQgPSByZXF1aXJlKCd0ZXJyaWFqcy1jZXNpdW0vU291cmNlL0NvcmUvZGVmaW5lZCcpO1xudmFyIEZlYXR1cmVEZXRlY3Rpb24gPSByZXF1aXJlKCd0ZXJyaWFqcy1jZXNpdW0vU291cmNlL0NvcmUvRmVhdHVyZURldGVjdGlvbicpO1xudmFyIFRlcnJpYUVycm9yID0gcmVxdWlyZSgnLi4vQ29yZS9UZXJyaWFFcnJvcicpO1xuXG4vLyBVbmZvcnR1bmF0ZWx5IHRoZXJlJ3Mgbm8gd2F5IHRvIGZlYXR1cmUtZGV0ZWN0IGZvciB0aGlzLCBpdCdzIHNvbWV0aGluZyB0aGF0IG9ubHkgTVMgYnJvd3NlcnMgZGlzYWxsb3cgZm9yIHNlY3VyaXR5IHJlYXNvbnMuXG52YXIgY2FuVXNlRGF0YVVyaUluSHJlZiA9ICEoRmVhdHVyZURldGVjdGlvbi5pc0ludGVybmV0RXhwbG9yZXIoKSB8fCAvRWRnZS8uZXhlYyhuYXZpZ2F0b3IudXNlckFnZW50KSk7XG5cbnZhciBEYXRhVXJpID0ge1xuICAgIC8qKlxyXG4gICAgICogVHVybiBhIGZpbGUgd2l0aCB0aGUgc3VwcGxpZWQgdHlwZSBhbmQgc3RyaW5naWZpZWQgZGF0YSBpbnRvIGEgZGF0YSB1cmkgdGhhdCBjYW4gYmUgc2V0IGFzIHRoZSBocmVmIG9mIGFuIGFuY2hvciB0YWcuXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdHlwZSBEYXRhIHR5cGUsIGVnLiAnanNvbicgb3IgJ2NzdicuXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZGF0YVN0cmluZyBUaGUgZGF0YS5cclxuICAgICAqIEByZXR1cm4ge1N0cmluZ30gQSBzdHJpbmcgdGhhdCBjYW4gYmUgdXNlZCB0byBpbiBhbiBhbmNob3IgdGFnJ3MgJ2hyZWYnIGF0dHJpYnV0ZSB0byByZXByZXNlbnQgZG93bmxvYWRhYmxlIGRhdGEuXHJcbiAgICAgKi9cbiAgICBtYWtlOiBmdW5jdGlvbiBtYWtlKHR5cGUsIGRhdGFTdHJpbmcpIHtcbiAgICAgICAgaWYgKGRhdGFTdHJpbmcpIHtcbiAgICAgICAgICAgIC8vIFVzaW5nIGF0dGFjaG1lbnQvKiBtaW1lIHR5cGUgbWFrZXMgc2FmYXJpIGRvd25sb2FkIGFzIGF0dGFjaG1lbnQuIHRleHQvKiB3b3JrcyBvbiBDaHJvbWUgKGFzIGRvZXMgYXR0YWNobWVudCkuXG4gICAgICAgICAgICByZXR1cm4gJ2RhdGE6YXR0YWNobWVudC8nICsgdHlwZSArICcsJyArIGVuY29kZVVSSUNvbXBvbmVudChkYXRhU3RyaW5nKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcclxuICAgICAqIFJldHVybnMgYSBmbGFnIHN0YXRpbmcgaWYgZGF0YSB1cmkgbGlua3MgYXJlIHN1cHBvcnRlZCBieSB0aGUgdXNlcidzIGJyb3dzZXIuXHJcbiAgICAgKiBJZiBlcnJvckV2ZW50IGlzIHByb3ZpZGVkLCBwcmVzZW50cyBhbiBlcnJvciBtZXNzYWdlIGV4cGxhaW5pbmcgd2h5IGl0IHdvbid0IHdvcmsuXHJcbiAgICAgKiBAcGFyYW0ge0Vycm9yfSBbZXJyb3JFdmVudF0gQSBDZXNpdW0gRXZlbnQsIGVnLiB0ZXJyaWEuZXJyb3IsIHVzZWQgdG8gcmFpc2UgYW4gZXJyb3IgaWYgdGhlIGJyb3dzZXIgZG9lcyBub3Qgc3VwcG9ydCBkYXRhIGRvd25sb2FkLlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IFtocmVmXSBUaGUgbGluayB0byBwcm92aWRlIGluIHRoZSBlcnJvciBtZXNzYWdlLiBSZXF1aXJlZCBpZiBlcnJvckV2ZW50IGlzIHByb3ZpZGVkLlxyXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBbZm9yY2VFcnJvcl0gSWYgdHJ1ZSwgYWx3YXlzIHNob3cgdGhlIGVycm9yIG1lc3NhZ2UuIERlZmF1bHRzIHRvIGZhbHNlLCB3aGljaCBvbmx5IHNob3dzIGl0IGlmIHRoZSBicm93c2VyIGNhbm5vdCBkb3dubG9hZCB1cmkgbGlua3MuXHJcbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufSBSZXR1cm5zIHdoZXRoZXIgdGhlIGJyb3dzZXIgaXMgY29tcGF0aWJsZSB3aXRoIGRhdGEgdXJpcy5cclxuICAgICAqL1xuICAgIGNoZWNrQ29tcGF0aWJpbGl0eTogZnVuY3Rpb24gY2hlY2tDb21wYXRpYmlsaXR5KGVycm9yRXZlbnQsIGhyZWYsIGZvcmNlRXJyb3IpIHtcbiAgICAgICAgaWYgKCFjYW5Vc2VEYXRhVXJpSW5IcmVmIHx8IGZvcmNlRXJyb3IpIHtcbiAgICAgICAgICAgIGlmIChkZWZpbmVkKGVycm9yRXZlbnQpKSB7XG4gICAgICAgICAgICAgICAgZXJyb3JFdmVudC5yYWlzZUV2ZW50KG5ldyBUZXJyaWFFcnJvcih7XG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnQnJvd3NlciBEb2VzIE5vdCBTdXBwb3J0IERhdGEgRG93bmxvYWQnLFxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnVW5mb3J0dW5hdGVseSBNaWNyb3NvZnQgYnJvd3NlcnMgKGluY2x1ZGluZyBhbGwgdmVyc2lvbnMgb2YgSW50ZXJuZXQgRXhwbG9yZXIgYW5kIEVkZ2UpIGRvIG5vdCAnICsgJ3N1cHBvcnQgdGhlIGRhdGEgdXJpIGZ1bmN0aW9uYWxpdHkgbmVlZGVkIHRvIGRvd25sb2FkIGRhdGEgYXMgYSBmaWxlLiBUbyBkb3dubG9hZCwgY29weSB0aGUgZm9sbG93aW5nIHVyaSAnICsgJ2ludG8gYW5vdGhlciBicm93c2VyIHN1Y2ggYXMgQ2hyb21lLCBGaXJlZm94IG9yIFNhZmFyaTogJyArIGhyZWZcbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRGF0YVVyaTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy90ZXJyaWFqcy9saWIvQ29yZS9EYXRhVXJpLmpzXG4vLyBtb2R1bGUgaWQgPSAzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImRlZmluZShbXHJcbiAgICAgICAgJy4vZGVmYXVsdFZhbHVlJyxcclxuICAgICAgICAnLi9kZWZpbmVkJyxcclxuICAgICAgICAnLi9GdWxsc2NyZWVuJ1xyXG4gICAgXSwgZnVuY3Rpb24oXHJcbiAgICAgICAgZGVmYXVsdFZhbHVlLFxyXG4gICAgICAgIGRlZmluZWQsXHJcbiAgICAgICAgRnVsbHNjcmVlbikge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgLypnbG9iYWwgQ2FudmFzUGl4ZWxBcnJheSovXHJcblxyXG4gICAgdmFyIHRoZU5hdmlnYXRvcjtcclxuICAgIGlmICh0eXBlb2YgbmF2aWdhdG9yICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIHRoZU5hdmlnYXRvciA9IG5hdmlnYXRvcjtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhlTmF2aWdhdG9yID0ge307XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZXh0cmFjdFZlcnNpb24odmVyc2lvblN0cmluZykge1xyXG4gICAgICAgIHZhciBwYXJ0cyA9IHZlcnNpb25TdHJpbmcuc3BsaXQoJy4nKTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gcGFydHMubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcclxuICAgICAgICAgICAgcGFydHNbaV0gPSBwYXJzZUludChwYXJ0c1tpXSwgMTApO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcGFydHM7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGlzQ2hyb21lUmVzdWx0O1xyXG4gICAgdmFyIGNocm9tZVZlcnNpb25SZXN1bHQ7XHJcbiAgICBmdW5jdGlvbiBpc0Nocm9tZSgpIHtcclxuICAgICAgICBpZiAoIWRlZmluZWQoaXNDaHJvbWVSZXN1bHQpKSB7XHJcbiAgICAgICAgICAgIGlzQ2hyb21lUmVzdWx0ID0gZmFsc2U7XHJcbiAgICAgICAgICAgIC8vIEVkZ2UgY29udGFpbnMgQ2hyb21lIGluIHRoZSB1c2VyIGFnZW50IHRvb1xyXG4gICAgICAgICAgICBpZiAoIWlzRWRnZSgpKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZmllbGRzID0gKC8gQ2hyb21lXFwvKFtcXC4wLTldKykvKS5leGVjKHRoZU5hdmlnYXRvci51c2VyQWdlbnQpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGZpZWxkcyAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlzQ2hyb21lUmVzdWx0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBjaHJvbWVWZXJzaW9uUmVzdWx0ID0gZXh0cmFjdFZlcnNpb24oZmllbGRzWzFdKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGlzQ2hyb21lUmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGNocm9tZVZlcnNpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIGlzQ2hyb21lKCkgJiYgY2hyb21lVmVyc2lvblJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgaXNTYWZhcmlSZXN1bHQ7XHJcbiAgICB2YXIgc2FmYXJpVmVyc2lvblJlc3VsdDtcclxuICAgIGZ1bmN0aW9uIGlzU2FmYXJpKCkge1xyXG4gICAgICAgIGlmICghZGVmaW5lZChpc1NhZmFyaVJlc3VsdCkpIHtcclxuICAgICAgICAgICAgaXNTYWZhcmlSZXN1bHQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIC8vIENocm9tZSBhbmQgRWRnZSBjb250YWluIFNhZmFyaSBpbiB0aGUgdXNlciBhZ2VudCB0b29cclxuICAgICAgICAgICAgaWYgKCFpc0Nocm9tZSgpICYmICFpc0VkZ2UoKSAmJiAoLyBTYWZhcmlcXC9bXFwuMC05XSsvKS50ZXN0KHRoZU5hdmlnYXRvci51c2VyQWdlbnQpKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZmllbGRzID0gKC8gVmVyc2lvblxcLyhbXFwuMC05XSspLykuZXhlYyh0aGVOYXZpZ2F0b3IudXNlckFnZW50KTtcclxuICAgICAgICAgICAgICAgIGlmIChmaWVsZHMgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICBpc1NhZmFyaVJlc3VsdCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgc2FmYXJpVmVyc2lvblJlc3VsdCA9IGV4dHJhY3RWZXJzaW9uKGZpZWxkc1sxXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBpc1NhZmFyaVJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBzYWZhcmlWZXJzaW9uKCkge1xyXG4gICAgICAgIHJldHVybiBpc1NhZmFyaSgpICYmIHNhZmFyaVZlcnNpb25SZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGlzV2Via2l0UmVzdWx0O1xyXG4gICAgdmFyIHdlYmtpdFZlcnNpb25SZXN1bHQ7XHJcbiAgICBmdW5jdGlvbiBpc1dlYmtpdCgpIHtcclxuICAgICAgICBpZiAoIWRlZmluZWQoaXNXZWJraXRSZXN1bHQpKSB7XHJcbiAgICAgICAgICAgIGlzV2Via2l0UmVzdWx0ID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICB2YXIgZmllbGRzID0gKC8gQXBwbGVXZWJLaXRcXC8oW1xcLjAtOV0rKShcXCs/KS8pLmV4ZWModGhlTmF2aWdhdG9yLnVzZXJBZ2VudCk7XHJcbiAgICAgICAgICAgIGlmIChmaWVsZHMgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGlzV2Via2l0UmVzdWx0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHdlYmtpdFZlcnNpb25SZXN1bHQgPSBleHRyYWN0VmVyc2lvbihmaWVsZHNbMV0pO1xyXG4gICAgICAgICAgICAgICAgd2Via2l0VmVyc2lvblJlc3VsdC5pc05pZ2h0bHkgPSAhIWZpZWxkc1syXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGlzV2Via2l0UmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHdlYmtpdFZlcnNpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIGlzV2Via2l0KCkgJiYgd2Via2l0VmVyc2lvblJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgaXNJbnRlcm5ldEV4cGxvcmVyUmVzdWx0O1xyXG4gICAgdmFyIGludGVybmV0RXhwbG9yZXJWZXJzaW9uUmVzdWx0O1xyXG4gICAgZnVuY3Rpb24gaXNJbnRlcm5ldEV4cGxvcmVyKCkge1xyXG4gICAgICAgIGlmICghZGVmaW5lZChpc0ludGVybmV0RXhwbG9yZXJSZXN1bHQpKSB7XHJcbiAgICAgICAgICAgIGlzSW50ZXJuZXRFeHBsb3JlclJlc3VsdCA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgdmFyIGZpZWxkcztcclxuICAgICAgICAgICAgaWYgKHRoZU5hdmlnYXRvci5hcHBOYW1lID09PSAnTWljcm9zb2Z0IEludGVybmV0IEV4cGxvcmVyJykge1xyXG4gICAgICAgICAgICAgICAgZmllbGRzID0gL01TSUUgKFswLTldezEsfVtcXC4wLTldezAsfSkvLmV4ZWModGhlTmF2aWdhdG9yLnVzZXJBZ2VudCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoZmllbGRzICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXNJbnRlcm5ldEV4cGxvcmVyUmVzdWx0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBpbnRlcm5ldEV4cGxvcmVyVmVyc2lvblJlc3VsdCA9IGV4dHJhY3RWZXJzaW9uKGZpZWxkc1sxXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhlTmF2aWdhdG9yLmFwcE5hbWUgPT09ICdOZXRzY2FwZScpIHtcclxuICAgICAgICAgICAgICAgIGZpZWxkcyA9IC9UcmlkZW50XFwvLipydjooWzAtOV17MSx9W1xcLjAtOV17MCx9KS8uZXhlYyh0aGVOYXZpZ2F0b3IudXNlckFnZW50KTtcclxuICAgICAgICAgICAgICAgIGlmIChmaWVsZHMgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICBpc0ludGVybmV0RXhwbG9yZXJSZXN1bHQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGludGVybmV0RXhwbG9yZXJWZXJzaW9uUmVzdWx0ID0gZXh0cmFjdFZlcnNpb24oZmllbGRzWzFdKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gaXNJbnRlcm5ldEV4cGxvcmVyUmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGludGVybmV0RXhwbG9yZXJWZXJzaW9uKCkge1xyXG4gICAgICAgIHJldHVybiBpc0ludGVybmV0RXhwbG9yZXIoKSAmJiBpbnRlcm5ldEV4cGxvcmVyVmVyc2lvblJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgaXNFZGdlUmVzdWx0O1xyXG4gICAgdmFyIGVkZ2VWZXJzaW9uUmVzdWx0O1xyXG4gICAgZnVuY3Rpb24gaXNFZGdlKCkge1xyXG4gICAgICAgIGlmICghZGVmaW5lZChpc0VkZ2VSZXN1bHQpKSB7XHJcbiAgICAgICAgICAgIGlzRWRnZVJlc3VsdCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB2YXIgZmllbGRzID0gKC8gRWRnZVxcLyhbXFwuMC05XSspLykuZXhlYyh0aGVOYXZpZ2F0b3IudXNlckFnZW50KTtcclxuICAgICAgICAgICAgaWYgKGZpZWxkcyAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgaXNFZGdlUmVzdWx0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGVkZ2VWZXJzaW9uUmVzdWx0ID0gZXh0cmFjdFZlcnNpb24oZmllbGRzWzFdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gaXNFZGdlUmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGVkZ2VWZXJzaW9uKCkge1xyXG4gICAgICAgIHJldHVybiBpc0VkZ2UoKSAmJiBlZGdlVmVyc2lvblJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgaXNGaXJlZm94UmVzdWx0O1xyXG4gICAgdmFyIGZpcmVmb3hWZXJzaW9uUmVzdWx0O1xyXG4gICAgZnVuY3Rpb24gaXNGaXJlZm94KCkge1xyXG4gICAgICAgIGlmICghZGVmaW5lZChpc0ZpcmVmb3hSZXN1bHQpKSB7XHJcbiAgICAgICAgICAgIGlzRmlyZWZveFJlc3VsdCA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgdmFyIGZpZWxkcyA9IC9GaXJlZm94XFwvKFtcXC4wLTldKykvLmV4ZWModGhlTmF2aWdhdG9yLnVzZXJBZ2VudCk7XHJcbiAgICAgICAgICAgIGlmIChmaWVsZHMgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGlzRmlyZWZveFJlc3VsdCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBmaXJlZm94VmVyc2lvblJlc3VsdCA9IGV4dHJhY3RWZXJzaW9uKGZpZWxkc1sxXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGlzRmlyZWZveFJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgaXNXaW5kb3dzUmVzdWx0O1xyXG4gICAgZnVuY3Rpb24gaXNXaW5kb3dzKCkge1xyXG4gICAgICAgIGlmICghZGVmaW5lZChpc1dpbmRvd3NSZXN1bHQpKSB7XHJcbiAgICAgICAgICAgIGlzV2luZG93c1Jlc3VsdCA9IC9XaW5kb3dzL2kudGVzdCh0aGVOYXZpZ2F0b3IuYXBwVmVyc2lvbik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBpc1dpbmRvd3NSZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZmlyZWZveFZlcnNpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIGlzRmlyZWZveCgpICYmIGZpcmVmb3hWZXJzaW9uUmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBoYXNQb2ludGVyRXZlbnRzO1xyXG4gICAgZnVuY3Rpb24gc3VwcG9ydHNQb2ludGVyRXZlbnRzKCkge1xyXG4gICAgICAgIGlmICghZGVmaW5lZChoYXNQb2ludGVyRXZlbnRzKSkge1xyXG4gICAgICAgICAgICAvL1doaWxlIG5hdmlnYXRvci5wb2ludGVyRW5hYmxlZCBpcyBkZXByZWNhdGVkIGluIHRoZSBXM0Mgc3BlY2lmaWNhdGlvblxyXG4gICAgICAgICAgICAvL3dlIHN0aWxsIG5lZWQgdG8gdXNlIGl0IGlmIGl0IGV4aXN0cyBpbiBvcmRlciB0byBzdXBwb3J0IGJyb3dzZXJzXHJcbiAgICAgICAgICAgIC8vdGhhdCByZWx5IG9uIGl0LCBzdWNoIGFzIHRoZSBXaW5kb3dzIFdlYkJyb3dzZXIgY29udHJvbCB3aGljaCBkZWZpbmVzXHJcbiAgICAgICAgICAgIC8vUG9pbnRlckV2ZW50IGJ1dCBzZXRzIG5hdmlnYXRvci5wb2ludGVyRW5hYmxlZCB0byBmYWxzZS5cclxuXHJcbiAgICAgICAgICAgIC8vRmlyZWZveCBkaXNhYmxlZCBiZWNhdXNlIG9mIGh0dHBzOi8vZ2l0aHViLmNvbS9BbmFseXRpY2FsR3JhcGhpY3NJbmMvY2VzaXVtL2lzc3Vlcy82MzcyXHJcbiAgICAgICAgICAgIGhhc1BvaW50ZXJFdmVudHMgPSAhaXNGaXJlZm94KCkgJiYgdHlwZW9mIFBvaW50ZXJFdmVudCAhPT0gJ3VuZGVmaW5lZCcgJiYgKCFkZWZpbmVkKHRoZU5hdmlnYXRvci5wb2ludGVyRW5hYmxlZCkgfHwgdGhlTmF2aWdhdG9yLnBvaW50ZXJFbmFibGVkKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGhhc1BvaW50ZXJFdmVudHM7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGltYWdlUmVuZGVyaW5nVmFsdWVSZXN1bHQ7XHJcbiAgICB2YXIgc3VwcG9ydHNJbWFnZVJlbmRlcmluZ1BpeGVsYXRlZFJlc3VsdDtcclxuICAgIGZ1bmN0aW9uIHN1cHBvcnRzSW1hZ2VSZW5kZXJpbmdQaXhlbGF0ZWQoKSB7XHJcbiAgICAgICAgaWYgKCFkZWZpbmVkKHN1cHBvcnRzSW1hZ2VSZW5kZXJpbmdQaXhlbGF0ZWRSZXN1bHQpKSB7XHJcbiAgICAgICAgICAgIHZhciBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcclxuICAgICAgICAgICAgY2FudmFzLnNldEF0dHJpYnV0ZSgnc3R5bGUnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdpbWFnZS1yZW5kZXJpbmc6IC1tb3otY3Jpc3AtZWRnZXM7JyArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2ltYWdlLXJlbmRlcmluZzogcGl4ZWxhdGVkOycpO1xyXG4gICAgICAgICAgICAvL2NhbnZhcy5zdHlsZS5pbWFnZVJlbmRlcmluZyB3aWxsIGJlIHVuZGVmaW5lZCwgbnVsbCBvciBhbiBlbXB0eSBzdHJpbmcgb24gdW5zdXBwb3J0ZWQgYnJvd3NlcnMuXHJcbiAgICAgICAgICAgIHZhciB0bXAgPSBjYW52YXMuc3R5bGUuaW1hZ2VSZW5kZXJpbmc7XHJcbiAgICAgICAgICAgIHN1cHBvcnRzSW1hZ2VSZW5kZXJpbmdQaXhlbGF0ZWRSZXN1bHQgPSBkZWZpbmVkKHRtcCkgJiYgdG1wICE9PSAnJztcclxuICAgICAgICAgICAgaWYgKHN1cHBvcnRzSW1hZ2VSZW5kZXJpbmdQaXhlbGF0ZWRSZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgIGltYWdlUmVuZGVyaW5nVmFsdWVSZXN1bHQgPSB0bXA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHN1cHBvcnRzSW1hZ2VSZW5kZXJpbmdQaXhlbGF0ZWRSZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gaW1hZ2VSZW5kZXJpbmdWYWx1ZSgpIHtcclxuICAgICAgICByZXR1cm4gc3VwcG9ydHNJbWFnZVJlbmRlcmluZ1BpeGVsYXRlZCgpID8gaW1hZ2VSZW5kZXJpbmdWYWx1ZVJlc3VsdCA6IHVuZGVmaW5lZDtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgdHlwZWRBcnJheVR5cGVzID0gW107XHJcbiAgICBpZiAodHlwZW9mIEFycmF5QnVmZmVyICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIHR5cGVkQXJyYXlUeXBlcy5wdXNoKEludDhBcnJheSwgVWludDhBcnJheSwgSW50MTZBcnJheSwgVWludDE2QXJyYXksIEludDMyQXJyYXksIFVpbnQzMkFycmF5LCBGbG9hdDMyQXJyYXksIEZsb2F0NjRBcnJheSk7XHJcblxyXG4gICAgICAgIGlmICh0eXBlb2YgVWludDhDbGFtcGVkQXJyYXkgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgIHR5cGVkQXJyYXlUeXBlcy5wdXNoKFVpbnQ4Q2xhbXBlZEFycmF5KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0eXBlb2YgQ2FudmFzUGl4ZWxBcnJheSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgdHlwZWRBcnJheVR5cGVzLnB1c2goQ2FudmFzUGl4ZWxBcnJheSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQSBzZXQgb2YgZnVuY3Rpb25zIHRvIGRldGVjdCB3aGV0aGVyIHRoZSBjdXJyZW50IGJyb3dzZXIgc3VwcG9ydHNcclxuICAgICAqIHZhcmlvdXMgZmVhdHVyZXMuXHJcbiAgICAgKlxyXG4gICAgICogQGV4cG9ydHMgRmVhdHVyZURldGVjdGlvblxyXG4gICAgICovXHJcbiAgICB2YXIgRmVhdHVyZURldGVjdGlvbiA9IHtcclxuICAgICAgICBpc0Nocm9tZSA6IGlzQ2hyb21lLFxyXG4gICAgICAgIGNocm9tZVZlcnNpb24gOiBjaHJvbWVWZXJzaW9uLFxyXG4gICAgICAgIGlzU2FmYXJpIDogaXNTYWZhcmksXHJcbiAgICAgICAgc2FmYXJpVmVyc2lvbiA6IHNhZmFyaVZlcnNpb24sXHJcbiAgICAgICAgaXNXZWJraXQgOiBpc1dlYmtpdCxcclxuICAgICAgICB3ZWJraXRWZXJzaW9uIDogd2Via2l0VmVyc2lvbixcclxuICAgICAgICBpc0ludGVybmV0RXhwbG9yZXIgOiBpc0ludGVybmV0RXhwbG9yZXIsXHJcbiAgICAgICAgaW50ZXJuZXRFeHBsb3JlclZlcnNpb24gOiBpbnRlcm5ldEV4cGxvcmVyVmVyc2lvbixcclxuICAgICAgICBpc0VkZ2UgOiBpc0VkZ2UsXHJcbiAgICAgICAgZWRnZVZlcnNpb24gOiBlZGdlVmVyc2lvbixcclxuICAgICAgICBpc0ZpcmVmb3ggOiBpc0ZpcmVmb3gsXHJcbiAgICAgICAgZmlyZWZveFZlcnNpb24gOiBmaXJlZm94VmVyc2lvbixcclxuICAgICAgICBpc1dpbmRvd3MgOiBpc1dpbmRvd3MsXHJcbiAgICAgICAgaGFyZHdhcmVDb25jdXJyZW5jeSA6IGRlZmF1bHRWYWx1ZSh0aGVOYXZpZ2F0b3IuaGFyZHdhcmVDb25jdXJyZW5jeSwgMyksXHJcbiAgICAgICAgc3VwcG9ydHNQb2ludGVyRXZlbnRzIDogc3VwcG9ydHNQb2ludGVyRXZlbnRzLFxyXG4gICAgICAgIHN1cHBvcnRzSW1hZ2VSZW5kZXJpbmdQaXhlbGF0ZWQ6IHN1cHBvcnRzSW1hZ2VSZW5kZXJpbmdQaXhlbGF0ZWQsXHJcbiAgICAgICAgaW1hZ2VSZW5kZXJpbmdWYWx1ZTogaW1hZ2VSZW5kZXJpbmdWYWx1ZSxcclxuICAgICAgICB0eXBlZEFycmF5VHlwZXM6IHR5cGVkQXJyYXlUeXBlc1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIERldGVjdHMgd2hldGhlciB0aGUgY3VycmVudCBicm93c2VyIHN1cHBvcnRzIHRoZSBmdWxsIHNjcmVlbiBzdGFuZGFyZC5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7Qm9vbGVhbn0gdHJ1ZSBpZiB0aGUgYnJvd3NlciBzdXBwb3J0cyB0aGUgZnVsbCBzY3JlZW4gc3RhbmRhcmQsIGZhbHNlIGlmIG5vdC5cclxuICAgICAqXHJcbiAgICAgKiBAc2VlIEZ1bGxzY3JlZW5cclxuICAgICAqIEBzZWUge0BsaW5rIGh0dHA6Ly9kdmNzLnczLm9yZy9oZy9mdWxsc2NyZWVuL3Jhdy1maWxlL3RpcC9PdmVydmlldy5odG1sfFczQyBGdWxsc2NyZWVuIExpdmluZyBTcGVjaWZpY2F0aW9ufVxyXG4gICAgICovXHJcbiAgICBGZWF0dXJlRGV0ZWN0aW9uLnN1cHBvcnRzRnVsbHNjcmVlbiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiBGdWxsc2NyZWVuLnN1cHBvcnRzRnVsbHNjcmVlbigpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIERldGVjdHMgd2hldGhlciB0aGUgY3VycmVudCBicm93c2VyIHN1cHBvcnRzIHR5cGVkIGFycmF5cy5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7Qm9vbGVhbn0gdHJ1ZSBpZiB0aGUgYnJvd3NlciBzdXBwb3J0cyB0eXBlZCBhcnJheXMsIGZhbHNlIGlmIG5vdC5cclxuICAgICAqXHJcbiAgICAgKiBAc2VlIHtAbGluayBodHRwOi8vd3d3Lmtocm9ub3Mub3JnL3JlZ2lzdHJ5L3R5cGVkYXJyYXkvc3BlY3MvbGF0ZXN0L3xUeXBlZCBBcnJheSBTcGVjaWZpY2F0aW9ufVxyXG4gICAgICovXHJcbiAgICBGZWF0dXJlRGV0ZWN0aW9uLnN1cHBvcnRzVHlwZWRBcnJheXMgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gdHlwZW9mIEFycmF5QnVmZmVyICE9PSAndW5kZWZpbmVkJztcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBEZXRlY3RzIHdoZXRoZXIgdGhlIGN1cnJlbnQgYnJvd3NlciBzdXBwb3J0cyBXZWIgV29ya2Vycy5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7Qm9vbGVhbn0gdHJ1ZSBpZiB0aGUgYnJvd3NlcnMgc3VwcG9ydHMgV2ViIFdvcmtlcnMsIGZhbHNlIGlmIG5vdC5cclxuICAgICAqXHJcbiAgICAgKiBAc2VlIHtAbGluayBodHRwOi8vd3d3LnczLm9yZy9UUi93b3JrZXJzL31cclxuICAgICAqL1xyXG4gICAgRmVhdHVyZURldGVjdGlvbi5zdXBwb3J0c1dlYldvcmtlcnMgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gdHlwZW9mIFdvcmtlciAhPT0gJ3VuZGVmaW5lZCc7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRGV0ZWN0cyB3aGV0aGVyIHRoZSBjdXJyZW50IGJyb3dzZXIgc3VwcG9ydHMgV2ViIEFzc2VtYmx5LlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtCb29sZWFufSB0cnVlIGlmIHRoZSBicm93c2VycyBzdXBwb3J0cyBXZWIgQXNzZW1ibHksIGZhbHNlIGlmIG5vdC5cclxuICAgICAqXHJcbiAgICAgKiBAc2VlIHtAbGluayBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYkFzc2VtYmx5fVxyXG4gICAgICovXHJcbiAgICBGZWF0dXJlRGV0ZWN0aW9uLnN1cHBvcnRzV2ViQXNzZW1ibHkgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gdHlwZW9mIFdlYkFzc2VtYmx5ICE9PSAndW5kZWZpbmVkJyAmJiAhRmVhdHVyZURldGVjdGlvbi5pc0VkZ2UoKTtcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIEZlYXR1cmVEZXRlY3Rpb247XHJcbn0pO1xyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy90ZXJyaWFqcy1jZXNpdW0vU291cmNlL0NvcmUvRmVhdHVyZURldGVjdGlvbi5qc1xuLy8gbW9kdWxlIGlkID0gNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJkZWZpbmUoW1xyXG4gICAgICAgICcuL2RlZmluZWQnXHJcbiAgICBdLCBmdW5jdGlvbihcclxuICAgICAgICBkZWZpbmVkKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBGcmVlemVzIGFuIG9iamVjdCwgdXNpbmcgT2JqZWN0LmZyZWV6ZSBpZiBhdmFpbGFibGUsIG90aGVyd2lzZSByZXR1cm5zXHJcbiAgICAgKiB0aGUgb2JqZWN0IHVuY2hhbmdlZC4gIFRoaXMgZnVuY3Rpb24gc2hvdWxkIGJlIHVzZWQgaW4gc2V0dXAgY29kZSB0byBwcmV2ZW50XHJcbiAgICAgKiBlcnJvcnMgZnJvbSBjb21wbGV0ZWx5IGhhbHRpbmcgSmF2YVNjcmlwdCBleGVjdXRpb24gaW4gbGVnYWN5IGJyb3dzZXJzLlxyXG4gICAgICpcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKlxyXG4gICAgICogQGV4cG9ydHMgZnJlZXplT2JqZWN0XHJcbiAgICAgKi9cclxuICAgIHZhciBmcmVlemVPYmplY3QgPSBPYmplY3QuZnJlZXplO1xyXG4gICAgaWYgKCFkZWZpbmVkKGZyZWV6ZU9iamVjdCkpIHtcclxuICAgICAgICBmcmVlemVPYmplY3QgPSBmdW5jdGlvbihvKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBvO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGZyZWV6ZU9iamVjdDtcclxufSk7XHJcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL3RlcnJpYWpzLWNlc2l1bS9Tb3VyY2UvQ29yZS9mcmVlemVPYmplY3QuanNcbi8vIG1vZHVsZSBpZCA9IDVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZGVmaW5lKFtcclxuICAgICAgICAnLi9kZWZpbmVkJyxcclxuICAgICAgICAnLi9kZWZpbmVQcm9wZXJ0aWVzJ1xyXG4gICAgXSwgZnVuY3Rpb24oXHJcbiAgICAgICAgZGVmaW5lZCxcclxuICAgICAgICBkZWZpbmVQcm9wZXJ0aWVzKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgdmFyIF9zdXBwb3J0c0Z1bGxzY3JlZW47XHJcbiAgICB2YXIgX25hbWVzID0ge1xyXG4gICAgICAgIHJlcXVlc3RGdWxsc2NyZWVuIDogdW5kZWZpbmVkLFxyXG4gICAgICAgIGV4aXRGdWxsc2NyZWVuIDogdW5kZWZpbmVkLFxyXG4gICAgICAgIGZ1bGxzY3JlZW5FbmFibGVkIDogdW5kZWZpbmVkLFxyXG4gICAgICAgIGZ1bGxzY3JlZW5FbGVtZW50IDogdW5kZWZpbmVkLFxyXG4gICAgICAgIGZ1bGxzY3JlZW5jaGFuZ2UgOiB1bmRlZmluZWQsXHJcbiAgICAgICAgZnVsbHNjcmVlbmVycm9yIDogdW5kZWZpbmVkXHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQnJvd3Nlci1pbmRlcGVuZGVudCBmdW5jdGlvbnMgZm9yIHdvcmtpbmcgd2l0aCB0aGUgc3RhbmRhcmQgZnVsbHNjcmVlbiBBUEkuXHJcbiAgICAgKlxyXG4gICAgICogQGV4cG9ydHMgRnVsbHNjcmVlblxyXG4gICAgICpcclxuICAgICAqIEBzZWUge0BsaW5rIGh0dHA6Ly9kdmNzLnczLm9yZy9oZy9mdWxsc2NyZWVuL3Jhdy1maWxlL3RpcC9PdmVydmlldy5odG1sfFczQyBGdWxsc2NyZWVuIExpdmluZyBTcGVjaWZpY2F0aW9ufVxyXG4gICAgICovXHJcbiAgICB2YXIgRnVsbHNjcmVlbiA9IHt9O1xyXG5cclxuICAgIGRlZmluZVByb3BlcnRpZXMoRnVsbHNjcmVlbiwge1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFRoZSBlbGVtZW50IHRoYXQgaXMgY3VycmVudGx5IGZ1bGxzY3JlZW4sIGlmIGFueS4gIFRvIHNpbXBseSBjaGVjayBpZiB0aGVcclxuICAgICAgICAgKiBicm93c2VyIGlzIGluIGZ1bGxzY3JlZW4gbW9kZSBvciBub3QsIHVzZSB7QGxpbmsgRnVsbHNjcmVlbiNmdWxsc2NyZWVufS5cclxuICAgICAgICAgKiBAbWVtYmVyb2YgRnVsbHNjcmVlblxyXG4gICAgICAgICAqIEB0eXBlIHtPYmplY3R9XHJcbiAgICAgICAgICogQHJlYWRvbmx5XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZWxlbWVudCA6IHtcclxuICAgICAgICAgICAgZ2V0IDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIUZ1bGxzY3JlZW4uc3VwcG9ydHNGdWxsc2NyZWVuKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiBkb2N1bWVudFtfbmFtZXMuZnVsbHNjcmVlbkVsZW1lbnRdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogVGhlIG5hbWUgb2YgdGhlIGV2ZW50IG9uIHRoZSBkb2N1bWVudCB0aGF0IGlzIGZpcmVkIHdoZW4gZnVsbHNjcmVlbiBpc1xyXG4gICAgICAgICAqIGVudGVyZWQgb3IgZXhpdGVkLiAgVGhpcyBldmVudCBuYW1lIGlzIGludGVuZGVkIGZvciB1c2Ugd2l0aCBhZGRFdmVudExpc3RlbmVyLlxyXG4gICAgICAgICAqIEluIHlvdXIgZXZlbnQgaGFuZGxlciwgdG8gZGV0ZXJtaW5lIGlmIHRoZSBicm93c2VyIGlzIGluIGZ1bGxzY3JlZW4gbW9kZSBvciBub3QsXHJcbiAgICAgICAgICogdXNlIHtAbGluayBGdWxsc2NyZWVuI2Z1bGxzY3JlZW59LlxyXG4gICAgICAgICAqIEBtZW1iZXJvZiBGdWxsc2NyZWVuXHJcbiAgICAgICAgICogQHR5cGUge1N0cmluZ31cclxuICAgICAgICAgKiBAcmVhZG9ubHlcclxuICAgICAgICAgKi9cclxuICAgICAgICBjaGFuZ2VFdmVudE5hbWUgOiB7XHJcbiAgICAgICAgICAgIGdldCA6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFGdWxsc2NyZWVuLnN1cHBvcnRzRnVsbHNjcmVlbigpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gX25hbWVzLmZ1bGxzY3JlZW5jaGFuZ2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBUaGUgbmFtZSBvZiB0aGUgZXZlbnQgdGhhdCBpcyBmaXJlZCB3aGVuIGEgZnVsbHNjcmVlbiBlcnJvclxyXG4gICAgICAgICAqIG9jY3Vycy4gIFRoaXMgZXZlbnQgbmFtZSBpcyBpbnRlbmRlZCBmb3IgdXNlIHdpdGggYWRkRXZlbnRMaXN0ZW5lci5cclxuICAgICAgICAgKiBAbWVtYmVyb2YgRnVsbHNjcmVlblxyXG4gICAgICAgICAqIEB0eXBlIHtTdHJpbmd9XHJcbiAgICAgICAgICogQHJlYWRvbmx5XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXJyb3JFdmVudE5hbWUgOiB7XHJcbiAgICAgICAgICAgIGdldCA6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFGdWxsc2NyZWVuLnN1cHBvcnRzRnVsbHNjcmVlbigpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gX25hbWVzLmZ1bGxzY3JlZW5lcnJvcjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIERldGVybWluZSB3aGV0aGVyIHRoZSBicm93c2VyIHdpbGwgYWxsb3cgYW4gZWxlbWVudCB0byBiZSBtYWRlIGZ1bGxzY3JlZW4sIG9yIG5vdC5cclxuICAgICAgICAgKiBGb3IgZXhhbXBsZSwgYnkgZGVmYXVsdCwgaWZyYW1lcyBjYW5ub3QgZ28gZnVsbHNjcmVlbiB1bmxlc3MgdGhlIGNvbnRhaW5pbmcgcGFnZVxyXG4gICAgICAgICAqIGFkZHMgYW4gXCJhbGxvd2Z1bGxzY3JlZW5cIiBhdHRyaWJ1dGUgKG9yIHByZWZpeGVkIGVxdWl2YWxlbnQpLlxyXG4gICAgICAgICAqIEBtZW1iZXJvZiBGdWxsc2NyZWVuXHJcbiAgICAgICAgICogQHR5cGUge0Jvb2xlYW59XHJcbiAgICAgICAgICogQHJlYWRvbmx5XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZW5hYmxlZCA6IHtcclxuICAgICAgICAgICAgZ2V0IDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIUZ1bGxzY3JlZW4uc3VwcG9ydHNGdWxsc2NyZWVuKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiBkb2N1bWVudFtfbmFtZXMuZnVsbHNjcmVlbkVuYWJsZWRdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogRGV0ZXJtaW5lcyBpZiB0aGUgYnJvd3NlciBpcyBjdXJyZW50bHkgaW4gZnVsbHNjcmVlbiBtb2RlLlxyXG4gICAgICAgICAqIEBtZW1iZXJvZiBGdWxsc2NyZWVuXHJcbiAgICAgICAgICogQHR5cGUge0Jvb2xlYW59XHJcbiAgICAgICAgICogQHJlYWRvbmx5XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZnVsbHNjcmVlbiA6IHtcclxuICAgICAgICAgICAgZ2V0IDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIUZ1bGxzY3JlZW4uc3VwcG9ydHNGdWxsc2NyZWVuKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiBGdWxsc2NyZWVuLmVsZW1lbnQgIT09IG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIERldGVjdHMgd2hldGhlciB0aGUgYnJvd3NlciBzdXBwb3J0cyB0aGUgc3RhbmRhcmQgZnVsbHNjcmVlbiBBUEkuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge0Jvb2xlYW59IDxjb2RlPnRydWU8L2NvZGU+IGlmIHRoZSBicm93c2VyIHN1cHBvcnRzIHRoZSBzdGFuZGFyZCBmdWxsc2NyZWVuIEFQSSxcclxuICAgICAqIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXHJcbiAgICAgKi9cclxuICAgIEZ1bGxzY3JlZW4uc3VwcG9ydHNGdWxsc2NyZWVuID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKGRlZmluZWQoX3N1cHBvcnRzRnVsbHNjcmVlbikpIHtcclxuICAgICAgICAgICAgcmV0dXJuIF9zdXBwb3J0c0Z1bGxzY3JlZW47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBfc3VwcG9ydHNGdWxsc2NyZWVuID0gZmFsc2U7XHJcblxyXG4gICAgICAgIHZhciBib2R5ID0gZG9jdW1lbnQuYm9keTtcclxuICAgICAgICBpZiAodHlwZW9mIGJvZHkucmVxdWVzdEZ1bGxzY3JlZW4gPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgLy8gZ28gd2l0aCB0aGUgdW5wcmVmaXhlZCwgc3RhbmRhcmQgc2V0IG9mIG5hbWVzXHJcbiAgICAgICAgICAgIF9uYW1lcy5yZXF1ZXN0RnVsbHNjcmVlbiA9ICdyZXF1ZXN0RnVsbHNjcmVlbic7XHJcbiAgICAgICAgICAgIF9uYW1lcy5leGl0RnVsbHNjcmVlbiA9ICdleGl0RnVsbHNjcmVlbic7XHJcbiAgICAgICAgICAgIF9uYW1lcy5mdWxsc2NyZWVuRW5hYmxlZCA9ICdmdWxsc2NyZWVuRW5hYmxlZCc7XHJcbiAgICAgICAgICAgIF9uYW1lcy5mdWxsc2NyZWVuRWxlbWVudCA9ICdmdWxsc2NyZWVuRWxlbWVudCc7XHJcbiAgICAgICAgICAgIF9uYW1lcy5mdWxsc2NyZWVuY2hhbmdlID0gJ2Z1bGxzY3JlZW5jaGFuZ2UnO1xyXG4gICAgICAgICAgICBfbmFtZXMuZnVsbHNjcmVlbmVycm9yID0gJ2Z1bGxzY3JlZW5lcnJvcic7XHJcbiAgICAgICAgICAgIF9zdXBwb3J0c0Z1bGxzY3JlZW4gPSB0cnVlO1xyXG4gICAgICAgICAgICByZXR1cm4gX3N1cHBvcnRzRnVsbHNjcmVlbjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vY2hlY2sgZm9yIHRoZSBjb3JyZWN0IGNvbWJpbmF0aW9uIG9mIHByZWZpeCBwbHVzIHRoZSB2YXJpb3VzIG5hbWVzIHRoYXQgYnJvd3NlcnMgdXNlXHJcbiAgICAgICAgdmFyIHByZWZpeGVzID0gWyd3ZWJraXQnLCAnbW96JywgJ28nLCAnbXMnLCAna2h0bWwnXTtcclxuICAgICAgICB2YXIgbmFtZTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gcHJlZml4ZXMubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcclxuICAgICAgICAgICAgdmFyIHByZWZpeCA9IHByZWZpeGVzW2ldO1xyXG5cclxuICAgICAgICAgICAgLy8gY2FzaW5nIG9mIEZ1bGxzY3JlZW4gZGlmZmVycyBhY3Jvc3MgYnJvd3NlcnNcclxuICAgICAgICAgICAgbmFtZSA9IHByZWZpeCArICdSZXF1ZXN0RnVsbHNjcmVlbic7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgYm9keVtuYW1lXSA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICAgICAgX25hbWVzLnJlcXVlc3RGdWxsc2NyZWVuID0gbmFtZTtcclxuICAgICAgICAgICAgICAgIF9zdXBwb3J0c0Z1bGxzY3JlZW4gPSB0cnVlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbmFtZSA9IHByZWZpeCArICdSZXF1ZXN0RnVsbFNjcmVlbic7XHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGJvZHlbbmFtZV0gPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgICAgICAgICBfbmFtZXMucmVxdWVzdEZ1bGxzY3JlZW4gPSBuYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgIF9zdXBwb3J0c0Z1bGxzY3JlZW4gPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBkaXNhZ3JlZW1lbnQgYWJvdXQgd2hldGhlciBpdCdzIFwiZXhpdFwiIGFzIHBlciBzcGVjLCBvciBcImNhbmNlbFwiXHJcbiAgICAgICAgICAgIG5hbWUgPSBwcmVmaXggKyAnRXhpdEZ1bGxzY3JlZW4nO1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGRvY3VtZW50W25hbWVdID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgICAgICBfbmFtZXMuZXhpdEZ1bGxzY3JlZW4gPSBuYW1lO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbmFtZSA9IHByZWZpeCArICdDYW5jZWxGdWxsU2NyZWVuJztcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZG9jdW1lbnRbbmFtZV0gPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgICAgICAgICBfbmFtZXMuZXhpdEZ1bGxzY3JlZW4gPSBuYW1lO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBjYXNpbmcgb2YgRnVsbHNjcmVlbiBkaWZmZXJzIGFjcm9zcyBicm93c2Vyc1xyXG4gICAgICAgICAgICBuYW1lID0gcHJlZml4ICsgJ0Z1bGxzY3JlZW5FbmFibGVkJztcclxuICAgICAgICAgICAgaWYgKGRvY3VtZW50W25hbWVdICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIF9uYW1lcy5mdWxsc2NyZWVuRW5hYmxlZCA9IG5hbWU7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBuYW1lID0gcHJlZml4ICsgJ0Z1bGxTY3JlZW5FbmFibGVkJztcclxuICAgICAgICAgICAgICAgIGlmIChkb2N1bWVudFtuYW1lXSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgX25hbWVzLmZ1bGxzY3JlZW5FbmFibGVkID0gbmFtZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gY2FzaW5nIG9mIEZ1bGxzY3JlZW4gZGlmZmVycyBhY3Jvc3MgYnJvd3NlcnNcclxuICAgICAgICAgICAgbmFtZSA9IHByZWZpeCArICdGdWxsc2NyZWVuRWxlbWVudCc7XHJcbiAgICAgICAgICAgIGlmIChkb2N1bWVudFtuYW1lXSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICBfbmFtZXMuZnVsbHNjcmVlbkVsZW1lbnQgPSBuYW1lO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbmFtZSA9IHByZWZpeCArICdGdWxsU2NyZWVuRWxlbWVudCc7XHJcbiAgICAgICAgICAgICAgICBpZiAoZG9jdW1lbnRbbmFtZV0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIF9uYW1lcy5mdWxsc2NyZWVuRWxlbWVudCA9IG5hbWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIHRoYW5rZnVsbHksIGV2ZW50IG5hbWVzIGFyZSBhbGwgbG93ZXJjYXNlIHBlciBzcGVjXHJcbiAgICAgICAgICAgIG5hbWUgPSBwcmVmaXggKyAnZnVsbHNjcmVlbmNoYW5nZSc7XHJcbiAgICAgICAgICAgIC8vIGV2ZW50IG5hbWVzIGRvIG5vdCBoYXZlICdvbicgaW4gdGhlIGZyb250LCBidXQgdGhlIHByb3BlcnR5IG9uIHRoZSBkb2N1bWVudCBkb2VzXHJcbiAgICAgICAgICAgIGlmIChkb2N1bWVudFsnb24nICsgbmFtZV0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgLy9leGNlcHQgb24gSUVcclxuICAgICAgICAgICAgICAgIGlmIChwcmVmaXggPT09ICdtcycpIHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lID0gJ01TRnVsbHNjcmVlbkNoYW5nZSc7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBfbmFtZXMuZnVsbHNjcmVlbmNoYW5nZSA9IG5hbWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIG5hbWUgPSBwcmVmaXggKyAnZnVsbHNjcmVlbmVycm9yJztcclxuICAgICAgICAgICAgaWYgKGRvY3VtZW50WydvbicgKyBuYW1lXSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAvL2V4Y2VwdCBvbiBJRVxyXG4gICAgICAgICAgICAgICAgaWYgKHByZWZpeCA9PT0gJ21zJykge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWUgPSAnTVNGdWxsc2NyZWVuRXJyb3InO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgX25hbWVzLmZ1bGxzY3JlZW5lcnJvciA9IG5hbWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBfc3VwcG9ydHNGdWxsc2NyZWVuO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEFzeW5jaHJvbm91c2x5IHJlcXVlc3RzIHRoZSBicm93c2VyIHRvIGVudGVyIGZ1bGxzY3JlZW4gbW9kZSBvbiB0aGUgZ2l2ZW4gZWxlbWVudC5cclxuICAgICAqIElmIGZ1bGxzY3JlZW4gbW9kZSBpcyBub3Qgc3VwcG9ydGVkIGJ5IHRoZSBicm93c2VyLCBkb2VzIG5vdGhpbmcuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGVsZW1lbnQgVGhlIEhUTUwgZWxlbWVudCB3aGljaCB3aWxsIGJlIHBsYWNlZCBpbnRvIGZ1bGxzY3JlZW4gbW9kZS5cclxuICAgICAqIEBwYXJhbSB7SE1EVlJEZXZpY2V9IFt2ckRldmljZV0gVGhlIFZSIGRldmljZS5cclxuICAgICAqXHJcbiAgICAgKiBAZXhhbXBsZVxyXG4gICAgICogLy8gUHV0IHRoZSBlbnRpcmUgcGFnZSBpbnRvIGZ1bGxzY3JlZW4uXHJcbiAgICAgKiBDZXNpdW0uRnVsbHNjcmVlbi5yZXF1ZXN0RnVsbHNjcmVlbihkb2N1bWVudC5ib2R5KVxyXG4gICAgICpcclxuICAgICAqIC8vIFBsYWNlIG9ubHkgdGhlIENlc2l1bSBjYW52YXMgaW50byBmdWxsc2NyZWVuLlxyXG4gICAgICogQ2VzaXVtLkZ1bGxzY3JlZW4ucmVxdWVzdEZ1bGxzY3JlZW4oc2NlbmUuY2FudmFzKVxyXG4gICAgICovXHJcbiAgICBGdWxsc2NyZWVuLnJlcXVlc3RGdWxsc2NyZWVuID0gZnVuY3Rpb24oZWxlbWVudCwgdnJEZXZpY2UpIHtcclxuICAgICAgICBpZiAoIUZ1bGxzY3JlZW4uc3VwcG9ydHNGdWxsc2NyZWVuKCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZWxlbWVudFtfbmFtZXMucmVxdWVzdEZ1bGxzY3JlZW5dKHsgdnJEaXNwbGF5OiB2ckRldmljZSB9KTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBc3luY2hyb25vdXNseSBleGl0cyBmdWxsc2NyZWVuIG1vZGUuICBJZiB0aGUgYnJvd3NlciBpcyBub3QgY3VycmVudGx5XHJcbiAgICAgKiBpbiBmdWxsc2NyZWVuLCBvciBpZiBmdWxsc2NyZWVuIG1vZGUgaXMgbm90IHN1cHBvcnRlZCBieSB0aGUgYnJvd3NlciwgZG9lcyBub3RoaW5nLlxyXG4gICAgICovXHJcbiAgICBGdWxsc2NyZWVuLmV4aXRGdWxsc2NyZWVuID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKCFGdWxsc2NyZWVuLnN1cHBvcnRzRnVsbHNjcmVlbigpKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGRvY3VtZW50W19uYW1lcy5leGl0RnVsbHNjcmVlbl0oKTtcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIEZ1bGxzY3JlZW47XHJcbn0pO1xyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy90ZXJyaWFqcy1jZXNpdW0vU291cmNlL0NvcmUvRnVsbHNjcmVlbi5qc1xuLy8gbW9kdWxlIGlkID0gNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJkZWZpbmUoW1xyXG4gICAgICAgICcuL2RlZmluZWQnXHJcbiAgICBdLCBmdW5jdGlvbihcclxuICAgICAgICBkZWZpbmVkKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgdmFyIGRlZmluZVByb3BlcnR5V29ya3MgPSAoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgcmV0dXJuICd4JyBpbiBPYmplY3QuZGVmaW5lUHJvcGVydHkoe30sICd4Jywge30pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH0pKCk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBEZWZpbmVzIHByb3BlcnRpZXMgb24gYW4gb2JqZWN0LCB1c2luZyBPYmplY3QuZGVmaW5lUHJvcGVydGllcyBpZiBhdmFpbGFibGUsXHJcbiAgICAgKiBvdGhlcndpc2UgcmV0dXJucyB0aGUgb2JqZWN0IHVuY2hhbmdlZC4gIFRoaXMgZnVuY3Rpb24gc2hvdWxkIGJlIHVzZWQgaW5cclxuICAgICAqIHNldHVwIGNvZGUgdG8gcHJldmVudCBlcnJvcnMgZnJvbSBjb21wbGV0ZWx5IGhhbHRpbmcgSmF2YVNjcmlwdCBleGVjdXRpb25cclxuICAgICAqIGluIGxlZ2FjeSBicm93c2Vycy5cclxuICAgICAqXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICpcclxuICAgICAqIEBleHBvcnRzIGRlZmluZVByb3BlcnRpZXNcclxuICAgICAqL1xyXG4gICAgdmFyIGRlZmluZVByb3BlcnRpZXMgPSBPYmplY3QuZGVmaW5lUHJvcGVydGllcztcclxuICAgIGlmICghZGVmaW5lUHJvcGVydHlXb3JrcyB8fCAhZGVmaW5lZChkZWZpbmVQcm9wZXJ0aWVzKSkge1xyXG4gICAgICAgIGRlZmluZVByb3BlcnRpZXMgPSBmdW5jdGlvbihvKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBvO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGRlZmluZVByb3BlcnRpZXM7XHJcbn0pO1xyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy90ZXJyaWFqcy1jZXNpdW0vU291cmNlL0NvcmUvZGVmaW5lUHJvcGVydGllcy5qc1xuLy8gbW9kdWxlIGlkID0gN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCc7XG5cbi8qZ2xvYmFsIHJlcXVpcmUqL1xuXG52YXIgZGVmYXVsdFZhbHVlID0gcmVxdWlyZSgndGVycmlhanMtY2VzaXVtL1NvdXJjZS9Db3JlL2RlZmF1bHRWYWx1ZScpO1xuXG4vKipcclxuICogUmVwcmVzZW50cyBhbiBlcnJvciB0aGF0IG9jY3VycmVkIGluIGEgVGVycmlhSlMgbW9kdWxlLCBlc3BlY2lhbGx5IGFuIGFzeW5jaHJvbm91cyBvbmUgdGhhdCBjYW5ub3QgYmUgcmFpc2VkXHJcbiAqIGJ5IHRocm93aW5nIGFuIGV4Y2VwdGlvbiBiZWNhdXNlIG5vIG9uZSB3b3VsZCBiZSBhYmxlIHRvIGNhdGNoIGl0LlxyXG4gKlxyXG4gKiBAYWxpYXMgVGVycmlhRXJyb3JcclxuICogQGNvbnN0cnVjdG9yXHJcbiAqXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIE9iamVjdCB3aXRoIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllczpcclxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zLnNlbmRlcl0gVGhlIG9iamVjdCByYWlzaW5nIHRoZSBlcnJvci5cclxuICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLnRpdGxlPSdBbiBlcnJvciBvY2N1cnJlZCddIEEgc2hvcnQgdGl0bGUgZGVzY3JpYmluZyB0aGUgZXJyb3IuXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBvcHRpb25zLm1lc3NhZ2UgQSBkZXRhaWxlZCBtZXNzYWdlIGRlc2NyaWJpbmcgdGhlIGVycm9yLiAgVGhpcyBtZXNzYWdlIG1heSBiZSBIVE1MIGFuZCBpdCBzaG91bGQgYmUgc2FuaXRpemVkIGJlZm9yZSBkaXNwbGF5IHRvIHRoZSB1c2VyLlxyXG4gKi9cbnZhciBUZXJyaWFFcnJvciA9IGZ1bmN0aW9uIFRlcnJpYUVycm9yKG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IGRlZmF1bHRWYWx1ZShvcHRpb25zLCBkZWZhdWx0VmFsdWUuRU1QVFlfT0JKRUNUKTtcblxuICAvKipcclxuICAgKiBHZXRzIG9yIHNldHMgdGhlIG9iamVjdCB0aGF0IHJhaXNlZCB0aGUgZXJyb3IuXHJcbiAgICogQHR5cGUge09iamVjdH1cclxuICAgKi9cbiAgdGhpcy5zZW5kZXIgPSBvcHRpb25zLnNlbmRlcjtcblxuICAvKipcclxuICAgKiBHZXRzIG9yIHNldHMgYSBzaG9ydCB0aXRsZSBkZXNjcmliaW5nIHRoZSBlcnJvci5cclxuICAgKiBAdHlwZSB7U3RyaW5nfVxyXG4gICAqL1xuICB0aGlzLnRpdGxlID0gZGVmYXVsdFZhbHVlKG9wdGlvbnMudGl0bGUsICdBbiBlcnJvciBvY2N1cnJlZCcpO1xuXG4gIC8qKlxyXG4gICAqIEdldHMgb3Igc2V0cyBhIG1ldGFpbGVkIG1lc3NhZ2UgZGVzY3JpYmluZyB0aGUgZXJyb3IuICBUaGlzIG1lc3NhZ2UgbWF5IGJlIEhUTUwgYW5kIGl0IHNob3VsZCBiZSBzYW5pdGl6ZWQgYmVmb3JlIGRpc3BsYXkgdG8gdGhlIHVzZXIuXHJcbiAgICogQHR5cGUge1N0cmluZ31cclxuICAgKi9cbiAgdGhpcy5tZXNzYWdlID0gb3B0aW9ucy5tZXNzYWdlO1xuXG4gIC8qKlxyXG4gICAqIFRydWUgaWYgdGhlIHVzZXIgaGFzIHNlZW4gdGhpcyBlcnJvcjsgb3RoZXJ3aXNlLCBmYWxzZS5cclxuICAgKiBAdHlwZSB7Qm9vbGVhbn1cclxuICAgKiBAZGVmYXVsdCBmYWxzZVxyXG4gICAqL1xuICB0aGlzLnJhaXNlZFRvVXNlciA9IGZhbHNlO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBUZXJyaWFFcnJvcjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy90ZXJyaWFqcy9saWIvQ29yZS9UZXJyaWFFcnJvci5qc1xuLy8gbW9kdWxlIGlkID0gOFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCc7XG5cbi8qKlxyXG4gKiBSZXR1cm5zIGluZGljZXMgc3VjaCB0aGF0IGFycmF5W2luZGljZXNbaV1dID0gc29ydGVkQXJyYXlbaV0uXHJcbiAqIEVnLiBzb3J0ZWRJbmRpY2VzKFsnYycsICdhJywgJ2InLCAnZCddKSA9PiBbMSwgMiwgMCwgM10uIChUaGUgc29ydGVkIGFycmF5IGlzIFthLCBiLCBjLCBkXSwgYW5kIFwiYVwiIHdhcyBpbiBwb3NpdGlvbiAxLCBcImJcIiBpbiBwb3NpdGlvbiAyLCBldGMuKVxyXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gc29ydC5cclxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2NvbXBhcmVGdW5jdGlvbl0gVGhlIHVzdWFsIGNvbXBhcmUgZnVuY3Rpb24sIGVnLiBmdW5jdGlvbihhLCBiKSB7IHJldHVybiBhIC0gYiB9LlxyXG4gKiBAcmV0dXJuIHtBcnJheX0gVGhlIHNvcnRlZCBpbmRpY2VzLCBzdWNoIHRoYXQgYXJyYXlbc29ydGVkSW5kaWNlc1swXV0gPSBzb3J0ZWRBcnJheVswXS5cclxuICovXG5cbmZ1bmN0aW9uIHNvcnRlZEluZGljZXMoYXJyYXksIGNvbXBhcmVGdW5jdGlvbikge1xuICAgIHZhciBsZW5ndGggPSBhcnJheS5sZW5ndGg7XG4gICAgdmFyIGluZGljZXMgPSBuZXcgQXJyYXkobGVuZ3RoKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGluZGljZXNbaV0gPSBpO1xuICAgIH1cbiAgICBpZiAoIWNvbXBhcmVGdW5jdGlvbikge1xuICAgICAgICBjb21wYXJlRnVuY3Rpb24gPSBmdW5jdGlvbiBjb21wYXJlRnVuY3Rpb24oYSwgYikge1xuICAgICAgICAgICAgcmV0dXJuIGEgPCBiID8gLTEgOiBhID4gYiA/IDEgOiAwO1xuICAgICAgICB9O1xuICAgIH1cbiAgICBpbmRpY2VzLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgcmV0dXJuIGNvbXBhcmVGdW5jdGlvbihhcnJheVthXSwgYXJyYXlbYl0pO1xuICAgIH0pO1xuICAgIHJldHVybiBpbmRpY2VzO1xufVxuXG4vL1xuLy8gTm90ZTogZm9yIGluZGljZXMgd2hpY2ggZ28gaW4gdGhlIG90aGVyIGRpcmVjdGlvbiwganVzdCB1c2UgaW5kZXhPZiBsaWtlIHRoaXM6XG4vL1xuLy8gaXQoJ2ludmVyc2UgaW5kaWNlcyB3b3JrJywgZnVuY3Rpb24oKSB7XG4vLyAgICAgdmFyIGRhdGEgPSBbJ2MnLCAnYScsICdiJywgJ2QnXTtcbi8vICAgICB2YXIgc29ydGVkID0gZGF0YS5zbGljZSgpLnNvcnQoKTtcbi8vICAgICB2YXIgaW52ZXJzZUluZGljZXMgPSBkYXRhLm1hcChmdW5jdGlvbihkYXR1bSkgeyByZXR1cm4gc29ydGVkLmluZGV4T2YoZGF0dW0pOyB9KTtcbi8vICAgICBleHBlY3QoaW52ZXJzZUluZGljZXMpLnRvRXF1YWwoWzIsIDAsIDEsIDNdKTtcbi8vIH0pO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gc29ydGVkSW5kaWNlcztcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy90ZXJyaWFqcy9saWIvQ29yZS9zb3J0ZWRJbmRpY2VzLmpzXG4vLyBtb2R1bGUgaWQgPSA5XG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTs7Ozs7OztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7Ozs7Ozs7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ2xKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7Ozs7Ozs7QUMvUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7Ozs7Ozs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBOzs7Ozs7O0FDN1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBOzs7Ozs7OztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QSIsInNvdXJjZVJvb3QiOiIifQ==