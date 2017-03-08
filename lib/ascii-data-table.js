'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _functions = require('./functions');

var R = _interopRequireWildcard(_functions);

var _repeat = require('core-js/library/fn/string/repeat');

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
//# sourceMappingURL=ascii-data-table.js.map