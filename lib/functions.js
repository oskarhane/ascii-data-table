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
//# sourceMappingURL=functions.js.map