/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
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
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!******************************!*\
  !*** ./src/entry-angular.js ***!
  \******************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _asciiDataTable = __webpack_require__(/*! ../src/ascii-data-table */ 1);
	
	var _asciiDataTable2 = _interopRequireDefault(_asciiDataTable);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	module.exports = angular.module('AsciiTableModule', []).service('AsciiTable', function () {
	  return _asciiDataTable2.default;
	}); /* global angular */

/***/ },
/* 1 */
/*!*********************************!*\
  !*** ./src/ascii-data-table.js ***!
  \*********************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _functions = __webpack_require__(/*! ./functions */ 2);
	
	var R = _interopRequireWildcard(_functions);
	
	var _repeat = __webpack_require__(/*! core-js/library/fn/string/repeat */ 3);
	
	var _repeat2 = _interopRequireDefault(_repeat);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	var len = function len(val) {
	  return typeof val === 'undefined' ? 0 : ('' + val).length;
	};
	var arrLen = function arrLen(arr) {
	  return arr.length;
	};
	var arrMax = function arrMax(arr) {
	  return R.apply(Math.max, arr);
	};
	var matrixCol = function matrixCol(matrix) {
	  return function (colNr) {
	    return R.pluck(colNr, matrix);
	  };
	};
	var padString = function padString(character) {
	  return function (width) {
	    return !width ? '' : (0, _repeat2.default)(character, width);
	  };
	};
	var spacePad = padString(' ');
	var stringifyArray = R.cMap(JSON.stringify);
	var stringifyRows = function stringifyRows(rows) {
	  return R.EitherArray(rows).fold(function () {
	    return null;
	  }, R.cMap(stringifyArray));
	};
	var insertColSeparators = function insertColSeparators(arr) {
	  return '│' + arr.join('│') + '│';
	};
	var getSeparatorLine = function getSeparatorLine(horChar, leftChar, crossChar, rightChar) {
	  return function (colWidths) {
	    return R.concat(leftChar, colWidths.map(function (w) {
	      return padString(horChar)(w);
	    }).join(crossChar), rightChar);
	  };
	};
	var topSeparatorLine = getSeparatorLine('═', '╒', '╤', '╕');
	var thickSeparatorLine = getSeparatorLine('═', '╞', '╪', '╡');
	var thinSeparatorLine = getSeparatorLine('─', '├', '┼', '┤');
	var bottomSeparatorLine = getSeparatorLine('─', '└', '┴', '┘');
	
	var colWidths = function colWidths(maxWidth, minWidth, input) {
	  var inputEither = R.EitherArray(input);
	  var columnAtIndex = matrixCol(input);
	  var normalizeWidth = function normalizeWidth(w) {
	    return Math.min(Math.max(w, minWidth), maxWidth || Infinity);
	  };
	  return inputEither.map(function (r) {
	    return R.head(r)[0];
	  }) // Grab title row
	  .map(arrLen) // Get the number of columns
	  .map(R.array) // Create a new array with same number of columns
	  .map(R.cMap(columnAtIndex)) // Populate new array with columns from input
	  .map(R.cMap(R.cMap(len))) // Measure the width of every column of every row
	  .map(R.cMap(arrMax)) // Grab the max width of every column
	  .map(R.cMap(normalizeWidth)) // Normalize width to be within limits
	  .fold(function () {
	    return [0];
	  }, R.id); // default to 0
	};
	
	var rowHeights = function rowHeights(maxWidth, input) {
	  return input.map(function (row) {
	    var maxLen = arrMax(row.map(len));
	    var numLines = Math.ceil(maxLen / maxWidth);
	    return numLines;
	  });
	};
	
	var rowsToLines = function rowsToLines(maxWidth, heights, widths, input) {
	  var columnToLinesWidths = columnToLines(widths, maxWidth);
	  return input.map(function (row, i) {
	    return row.map(columnToLinesWidths(heights[i]));
	  });
	};
	
	var columnToLines = function columnToLines(widths, maxWidth) {
	  return function (rowHeight) {
	    return function (col, colIndex) {
	      var lines = R.splitEvery(maxWidth, col);
	      lines[lines.length - 1] += spacePad(widths[colIndex] - len(R.last(lines)));
	      while (lines.length < rowHeight) {
	        lines.push(spacePad(widths[colIndex]));
	      }
	      return lines;
	    };
	  };
	};
	
	var createLines = function createLines(rows) {
	  return rows.reduce(function (lines, row) {
	    if (!Array.isArray(row)) {
	      return [].concat(lines, row);
	    }
	    var tRow = R.transpose(row).map(insertColSeparators);
	    return [].concat(lines, tRow);
	  }, []);
	};
	
	var main = function main(rows) {
	  var maxColWidth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 30;
	  var minColWidth = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 3;
	
	  if (!Array.isArray(rows) || !rows.length) {
	    return '';
	  }
	  maxColWidth = parseInt(maxColWidth);
	  var widths = colWidths(maxColWidth, minColWidth, rows);
	  var heights = rowHeights(maxColWidth, rows);
	  var norm = rowsToLines(maxColWidth, heights, widths, rows);
	  var header = createLines(R.head(norm));
	  var separated = R.intersperse(thinSeparatorLine(widths), R.tail(norm));
	  var lines = createLines(separated);
	  return [topSeparatorLine(widths)].concat(_toConsumableArray(header), [thickSeparatorLine(widths)], _toConsumableArray(lines), [bottomSeparatorLine(widths)]).join('\n');
	};
	
	exports.default = {
	  serializeData: function serializeData(rows) {
	    return stringifyRows(rows);
	  },
	  tableFromSerializedData: function tableFromSerializedData(serializedRows) {
	    var maxColumnWidth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 30;
	    return main(serializedRows, maxColumnWidth);
	  },
	  table: function table(rows) {
	    var maxColumnWidth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 30;
	    return main(stringifyRows(rows), maxColumnWidth);
	  },
	  maxColumnWidth: function maxColumnWidth(rows) {
	    return arrMax(colWidths(0, 0, stringifyRows(rows)));
	  }
	};

/***/ },
/* 2 */
/*!**************************!*\
  !*** ./src/functions.js ***!
  \**************************/
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var array = exports.array = function array(len) {
	  return Array.apply(null, Array(len)).map(function (_, i) {
	    return i;
	  });
	};
	var id = exports.id = function id(x) {
	  return x;
	};
	var pluck = exports.pluck = function pluck(p, arr) {
	  return arr.map(function (o) {
	    return o[p];
	  });
	};
	var apply = exports.apply = function apply(fn, arr) {
	  return fn.apply(null, arr);
	};
	var cMap = exports.cMap = function cMap(fn) {
	  return function (arr) {
	    return arr.map(fn);
	  };
	};
	var splitEvery = exports.splitEvery = function splitEvery(w, a) {
	  if (!a) return a;
	  var tot = a.length;
	  var out = [];
	  var pos = 0;
	  while (pos < tot) {
	    var got = a.slice(pos, pos + w);
	    out = out.concat(got);
	    pos += got.length;
	  }
	  return out;
	};
	var last = exports.last = function last(arr) {
	  return arr.slice(-1);
	};
	var head = exports.head = function head(arr) {
	  return arr.slice(0, 1);
	};
	var tail = exports.tail = function tail(arr) {
	  return arr.slice(1);
	};
	var concat = exports.concat = function concat(one, two) {
	  var _ref;
	
	  var concatenated = (_ref = []).concat.apply(_ref, arguments);
	  if (Array.isArray(one)) return concatenated;
	  return concatenated.join('');
	};
	var transpose = exports.transpose = function transpose(arr) {
	  return arr[0].map(function (_, i) {
	    return arr.map(function (v) {
	      return v[i];
	    });
	  });
	};
	var intersperse = exports.intersperse = function intersperse(c, a) {
	  return a.reduce(function (all, v, i) {
	    if (i === a.length - 1) {
	      all.push(v);
	      return all;
	    }
	    all.push(v, c);
	    return all;
	  }, []);
	};
	
	var Either = exports.Either = function Either(x) {
	  return x != null ? Right(x) : Left(x);
	};
	var EitherArray = exports.EitherArray = function EitherArray(x) {
	  return Array.isArray(x) ? Right(x) : Left(x);
	};
	
	var Right = exports.Right = function Right(x) {
	  return {
	    chain: function chain(f) {
	      return f(x);
	    },
	    map: function map(f) {
	      return Right(f(x));
	    },
	    fold: function fold(f, g) {
	      return g(x);
	    },
	    inspect: function inspect() {
	      return 'Right(' + x + ')';
	    },
	    log: function log() {
	      var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
	
	      console.log(str, 'Right', x);
	      return Right(x);
	    }
	  };
	};
	
	var Left = exports.Left = function Left(x) {
	  return {
	    chain: function chain(f) {
	      return Left(x);
	    },
	    map: function map(f) {
	      return Left(x);
	    },
	    fold: function fold(f, g) {
	      return f(x);
	    },
	    inspect: function inspect() {
	      return 'Left(' + x + ')';
	    },
	    log: function log() {
	      var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
	
	      console.log(str, 'Left', x);
	      return Left(x);
	    }
	  };
	};

/***/ },
/* 3 */
/*!***********************************************!*\
  !*** ./~/core-js/library/fn/string/repeat.js ***!
  \***********************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(/*! ../../modules/es6.string.repeat */ 4);
	module.exports = __webpack_require__(/*! ../../modules/_core */ 7).String.repeat;

/***/ },
/* 4 */
/*!********************************************************!*\
  !*** ./~/core-js/library/modules/es6.string.repeat.js ***!
  \********************************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var $export = __webpack_require__(/*! ./_export */ 5);
	
	$export($export.P, 'String', {
	  // 21.1.3.13 String.prototype.repeat(count)
	  repeat: __webpack_require__(/*! ./_string-repeat */ 20)
	});

/***/ },
/* 5 */
/*!**********************************************!*\
  !*** ./~/core-js/library/modules/_export.js ***!
  \**********************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var global = __webpack_require__(/*! ./_global */ 6),
	    core = __webpack_require__(/*! ./_core */ 7),
	    ctx = __webpack_require__(/*! ./_ctx */ 8),
	    hide = __webpack_require__(/*! ./_hide */ 10),
	    PROTOTYPE = 'prototype';
	
	var $export = function $export(type, name, source) {
	  var IS_FORCED = type & $export.F,
	      IS_GLOBAL = type & $export.G,
	      IS_STATIC = type & $export.S,
	      IS_PROTO = type & $export.P,
	      IS_BIND = type & $export.B,
	      IS_WRAP = type & $export.W,
	      exports = IS_GLOBAL ? core : core[name] || (core[name] = {}),
	      expProto = exports[PROTOTYPE],
	      target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE],
	      key,
	      own,
	      out;
	  if (IS_GLOBAL) source = name;
	  for (key in source) {
	    // contains in native
	    own = !IS_FORCED && target && target[key] !== undefined;
	    if (own && key in exports) continue;
	    // export native or passed
	    out = own ? target[key] : source[key];
	    // prevent global pollution for namespaces
	    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
	    // bind timers to global for call from export context
	    : IS_BIND && own ? ctx(out, global)
	    // wrap global constructors for prevent change them in library
	    : IS_WRAP && target[key] == out ? function (C) {
	      var F = function F(a, b, c) {
	        if (this instanceof C) {
	          switch (arguments.length) {
	            case 0:
	              return new C();
	            case 1:
	              return new C(a);
	            case 2:
	              return new C(a, b);
	          }return new C(a, b, c);
	        }return C.apply(this, arguments);
	      };
	      F[PROTOTYPE] = C[PROTOTYPE];
	      return F;
	      // make static versions for prototype methods
	    }(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
	    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
	    if (IS_PROTO) {
	      (exports.virtual || (exports.virtual = {}))[key] = out;
	      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
	      if (type & $export.R && expProto && !expProto[key]) hide(expProto, key, out);
	    }
	  }
	};
	// type bitmap
	$export.F = 1; // forced
	$export.G = 2; // global
	$export.S = 4; // static
	$export.P = 8; // proto
	$export.B = 16; // bind
	$export.W = 32; // wrap
	$export.U = 64; // safe
	$export.R = 128; // real proto method for `library` 
	module.exports = $export;

/***/ },
/* 6 */
/*!**********************************************!*\
  !*** ./~/core-js/library/modules/_global.js ***!
  \**********************************************/
/***/ function(module, exports) {

	'use strict';
	
	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
	if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef

/***/ },
/* 7 */
/*!********************************************!*\
  !*** ./~/core-js/library/modules/_core.js ***!
  \********************************************/
/***/ function(module, exports) {

	'use strict';
	
	var core = module.exports = { version: '2.4.0' };
	if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef

/***/ },
/* 8 */
/*!*******************************************!*\
  !*** ./~/core-js/library/modules/_ctx.js ***!
  \*******************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// optional / simple context binding
	var aFunction = __webpack_require__(/*! ./_a-function */ 9);
	module.exports = function (fn, that, length) {
	  aFunction(fn);
	  if (that === undefined) return fn;
	  switch (length) {
	    case 1:
	      return function (a) {
	        return fn.call(that, a);
	      };
	    case 2:
	      return function (a, b) {
	        return fn.call(that, a, b);
	      };
	    case 3:
	      return function (a, b, c) {
	        return fn.call(that, a, b, c);
	      };
	  }
	  return function () /* ...args */{
	    return fn.apply(that, arguments);
	  };
	};

/***/ },
/* 9 */
/*!**************************************************!*\
  !*** ./~/core-js/library/modules/_a-function.js ***!
  \**************************************************/
/***/ function(module, exports) {

	'use strict';
	
	module.exports = function (it) {
	  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
	  return it;
	};

/***/ },
/* 10 */
/*!********************************************!*\
  !*** ./~/core-js/library/modules/_hide.js ***!
  \********************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var dP = __webpack_require__(/*! ./_object-dp */ 11),
	    createDesc = __webpack_require__(/*! ./_property-desc */ 19);
	module.exports = __webpack_require__(/*! ./_descriptors */ 15) ? function (object, key, value) {
	  return dP.f(object, key, createDesc(1, value));
	} : function (object, key, value) {
	  object[key] = value;
	  return object;
	};

/***/ },
/* 11 */
/*!*************************************************!*\
  !*** ./~/core-js/library/modules/_object-dp.js ***!
  \*************************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var anObject = __webpack_require__(/*! ./_an-object */ 12),
	    IE8_DOM_DEFINE = __webpack_require__(/*! ./_ie8-dom-define */ 14),
	    toPrimitive = __webpack_require__(/*! ./_to-primitive */ 18),
	    dP = Object.defineProperty;
	
	exports.f = __webpack_require__(/*! ./_descriptors */ 15) ? Object.defineProperty : function defineProperty(O, P, Attributes) {
	  anObject(O);
	  P = toPrimitive(P, true);
	  anObject(Attributes);
	  if (IE8_DOM_DEFINE) try {
	    return dP(O, P, Attributes);
	  } catch (e) {/* empty */}
	  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
	  if ('value' in Attributes) O[P] = Attributes.value;
	  return O;
	};

/***/ },
/* 12 */
/*!*************************************************!*\
  !*** ./~/core-js/library/modules/_an-object.js ***!
  \*************************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var isObject = __webpack_require__(/*! ./_is-object */ 13);
	module.exports = function (it) {
	  if (!isObject(it)) throw TypeError(it + ' is not an object!');
	  return it;
	};

/***/ },
/* 13 */
/*!*************************************************!*\
  !*** ./~/core-js/library/modules/_is-object.js ***!
  \*************************************************/
/***/ function(module, exports) {

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	module.exports = function (it) {
	  return (typeof it === 'undefined' ? 'undefined' : _typeof(it)) === 'object' ? it !== null : typeof it === 'function';
	};

/***/ },
/* 14 */
/*!******************************************************!*\
  !*** ./~/core-js/library/modules/_ie8-dom-define.js ***!
  \******************************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	module.exports = !__webpack_require__(/*! ./_descriptors */ 15) && !__webpack_require__(/*! ./_fails */ 16)(function () {
	  return Object.defineProperty(__webpack_require__(/*! ./_dom-create */ 17)('div'), 'a', { get: function get() {
	      return 7;
	    } }).a != 7;
	});

/***/ },
/* 15 */
/*!***************************************************!*\
  !*** ./~/core-js/library/modules/_descriptors.js ***!
  \***************************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// Thank's IE8 for his funny defineProperty
	module.exports = !__webpack_require__(/*! ./_fails */ 16)(function () {
	  return Object.defineProperty({}, 'a', { get: function get() {
	      return 7;
	    } }).a != 7;
	});

/***/ },
/* 16 */
/*!*********************************************!*\
  !*** ./~/core-js/library/modules/_fails.js ***!
  \*********************************************/
/***/ function(module, exports) {

	"use strict";
	
	module.exports = function (exec) {
	  try {
	    return !!exec();
	  } catch (e) {
	    return true;
	  }
	};

/***/ },
/* 17 */
/*!**************************************************!*\
  !*** ./~/core-js/library/modules/_dom-create.js ***!
  \**************************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var isObject = __webpack_require__(/*! ./_is-object */ 13),
	    document = __webpack_require__(/*! ./_global */ 6).document
	// in old IE typeof document.createElement is 'object'
	,
	    is = isObject(document) && isObject(document.createElement);
	module.exports = function (it) {
	  return is ? document.createElement(it) : {};
	};

/***/ },
/* 18 */
/*!****************************************************!*\
  !*** ./~/core-js/library/modules/_to-primitive.js ***!
  \****************************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// 7.1.1 ToPrimitive(input [, PreferredType])
	var isObject = __webpack_require__(/*! ./_is-object */ 13);
	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string
	module.exports = function (it, S) {
	  if (!isObject(it)) return it;
	  var fn, val;
	  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
	  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
	  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
	  throw TypeError("Can't convert object to primitive value");
	};

/***/ },
/* 19 */
/*!*****************************************************!*\
  !*** ./~/core-js/library/modules/_property-desc.js ***!
  \*****************************************************/
/***/ function(module, exports) {

	"use strict";
	
	module.exports = function (bitmap, value) {
	  return {
	    enumerable: !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable: !(bitmap & 4),
	    value: value
	  };
	};

/***/ },
/* 20 */
/*!*****************************************************!*\
  !*** ./~/core-js/library/modules/_string-repeat.js ***!
  \*****************************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var toInteger = __webpack_require__(/*! ./_to-integer */ 21),
	    defined = __webpack_require__(/*! ./_defined */ 22);
	
	module.exports = function repeat(count) {
	  var str = String(defined(this)),
	      res = '',
	      n = toInteger(count);
	  if (n < 0 || n == Infinity) throw RangeError("Count can't be negative");
	  for (; n > 0; (n >>>= 1) && (str += str)) {
	    if (n & 1) res += str;
	  }return res;
	};

/***/ },
/* 21 */
/*!**************************************************!*\
  !*** ./~/core-js/library/modules/_to-integer.js ***!
  \**************************************************/
/***/ function(module, exports) {

	"use strict";
	
	// 7.1.4 ToInteger
	var ceil = Math.ceil,
	    floor = Math.floor;
	module.exports = function (it) {
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};

/***/ },
/* 22 */
/*!***********************************************!*\
  !*** ./~/core-js/library/modules/_defined.js ***!
  \***********************************************/
/***/ function(module, exports) {

	"use strict";
	
	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function (it) {
	  if (it == undefined) throw TypeError("Can't call method on  " + it);
	  return it;
	};

/***/ }
/******/ ]);
//# sourceMappingURL=bundle-angular.js.map