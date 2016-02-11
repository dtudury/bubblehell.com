(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      }
      throw TypeError('Uncaught, unspecified "error" event.');
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],2:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DumbSet = function () {
    function DumbSet() {
        var _this = this;

        _classCallCheck(this, DumbSet);

        this.members = [];

        for (var _len = arguments.length, startingMembers = Array(_len), _key = 0; _key < _len; _key++) {
            startingMembers[_key] = arguments[_key];
        }

        startingMembers.forEach(function (member) {
            return _this.add(member);
        });
    }

    _createClass(DumbSet, [{
        key: "add",
        value: function add(member) {
            if (this.members.indexOf(member) >= 0) return false;
            this.members.push(member);
            return true;
        }
    }, {
        key: "remove",
        value: function remove(member) {
            var i = this.members.indexOf(member);
            if (i < 0) return false;
            this.members.splice(i, 1);
            return true;
        }
    }, {
        key: "forEach",
        value: function forEach(f) {
            return this.members.forEach(f);
        }
    }, {
        key: "length",
        get: function get() {
            return this.members.length;
        }
    }]);

    return DumbSet;
}();

exports.default = DumbSet;

},{}],3:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Point = function () {
    function Point(x, y) {
        _classCallCheck(this, Point);

        this.x = x;
        this.y = y;
    }

    _createClass(Point, null, [{
        key: "distance",
        value: function distance(p1, p2) {
            return Math.sqrt(Point.distance_squared(p1, p2));
        }
    }, {
        key: "distance_squared",
        value: function distance_squared(p1, p2) {
            return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
        }
    }]);

    return Point;
}();

exports.default = Point;

},{}],4:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _Point = require("./Point.js");

var _Point2 = _interopRequireDefault(_Point);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Quad = function () {
    function Quad(x, y, width, height) {
        _classCallCheck(this, Quad);

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    _createClass(Quad, [{
        key: "overlaps",
        value: function overlaps(quad) {
            return Quad.overlaps(this, quad);
        }
    }, {
        key: "overlaps_point",
        value: function overlaps_point(p) {
            return Quad.overlaps_point(this, p);
        }
    }, {
        key: "left",
        get: function get() {
            return this.x;
        }
    }, {
        key: "top",
        get: function get() {
            return this.y;
        }
    }, {
        key: "right",
        get: function get() {
            return this.x + this.width;
        }
    }, {
        key: "bottom",
        get: function get() {
            return this.y + this.height;
        }
    }, {
        key: "tl",
        get: function get() {
            return new _Point2.default(this.left, this.top);
        }
    }, {
        key: "tr",
        get: function get() {
            return new _Point2.default(this.right, this.top);
        }
    }, {
        key: "bl",
        get: function get() {
            return new _Point2.default(this.left, this.bottom);
        }
    }, {
        key: "br",
        get: function get() {
            return new _Point2.default(this.right, this.bottom);
        }
    }], [{
        key: "overlaps",
        value: function overlaps(a, b) {
            return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
        }
    }, {
        key: "overlaps_point",
        value: function overlaps_point(q, p) {
            return p.x > q.left && p.x < q.right && p.y > q.top && p.y < q.bottom;
        }
    }]);

    return Quad;
}();

exports.default = Quad;

},{"./Point.js":3}],5:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _Quad2 = require("./Quad.js");

var _Quad3 = _interopRequireDefault(_Quad2);

var _DumbSet = require("./DumbSet.js");

var _DumbSet2 = _interopRequireDefault(_DumbSet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var QuadTree = function (_Quad) {
    _inherits(QuadTree, _Quad);

    function QuadTree() {
        var x = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
        var y = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
        var size = arguments.length <= 2 || arguments[2] === undefined ? 400 : arguments[2];
        var capacity = arguments.length <= 3 || arguments[3] === undefined ? 2 : arguments[3];
        var max_levels = arguments.length <= 4 || arguments[4] === undefined ? 8 : arguments[4];

        _classCallCheck(this, QuadTree);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(QuadTree).call(this, x, y, size, size));

        _this.size = size;
        _this.capacity = capacity;
        _this.max_levels = max_levels;
        _this.bucket = new _DumbSet2.default();
        _this.nodes = null;
        _this.things = new _DumbSet2.default();
        return _this;
    }

    _createClass(QuadTree, [{
        key: "add",
        value: function add(thing) {
            if (!thing.overlaps_quad(this)) return;
            if (!this.things.add(thing)) return;
            if (this.bucket) {
                if (this.bucket.length < this.capacity || !this.max_levels) {
                    this.bucket.add(thing);
                    thing.quads.add(this);
                    return;
                }
                this.split();
            }
            for (var x = 0; x < 2; x++) {
                for (var y = 0; y < 2; y++) {
                    this.nodes[x][y].add(thing);
                }
            }
        }
    }, {
        key: "remove",
        value: function remove(thing) {
            var _this2 = this;

            if (!this.things.remove(thing)) return;
            if (this.bucket) {
                this.bucket.remove(thing);
                thing.quads.remove(this);
            } else {
                var remove_from_nodes = function remove_from_nodes(thing) {
                    for (var x = 0; x < 2; x++) {
                        for (var y = 0; y < 2; y++) {
                            _this2.nodes[x][y].remove(thing);
                        }
                    }
                };
                remove_from_nodes(thing);
                if (this.things.length <= this.capacity) {
                    this.things.forEach(remove_from_nodes);
                    delete this.nodes;
                    this.bucket = new _DumbSet2.default();
                    this.things.forEach(function (thing) {
                        _this2.bucket.add(thing);
                    });
                }
            }
        }
    }, {
        key: "get_thing_at",
        value: function get_thing_at(x, y) {
            var p = { x: x, y: y };
            var found_thing = null;
            if (!this.overlaps_point(p)) return found_thing;
            if (this.bucket) {
                this.bucket.forEach(function (thing) {
                    if (thing.overlaps_point(p)) found_thing = thing;
                });
                return found_thing;
            }
            for (var i = 0; i < 2; i++) {
                for (var j = 0; j < 2; j++) {
                    found_thing = found_thing || this.nodes[i][j].get_thing_at(x, y);
                }
            }
            return found_thing;
        }
    }, {
        key: "split",
        value: function split() {
            var _this3 = this;

            var half_size = this.size / 2;
            this.nodes = [];
            for (var x = 0; x < 2; x++) {
                this.nodes[x] = [];

                var _loop = function _loop(y) {
                    var qt = new QuadTree(_this3.x + half_size * x, _this3.y + half_size * y, half_size, _this3.capacity, _this3.max_levels - 1);
                    _this3.nodes[x][y] = qt;
                    _this3.bucket.forEach(function (t) {
                        return qt.add(t);
                    });
                };

                for (var y = 0; y < 2; y++) {
                    _loop(y);
                }
            }
            delete this.bucket;
        }
    }]);

    return QuadTree;
}(_Quad3.default);

exports.default = QuadTree;

},{"./DumbSet.js":2,"./Quad.js":4}],6:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _Quad = require("./Quad.js");

var _Quad2 = _interopRequireDefault(_Quad);

var _Point = require("./Point.js");

var _Point2 = _interopRequireDefault(_Point);

var _Thing2 = require("./Thing.js");

var _Thing3 = _interopRequireDefault(_Thing2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RoundThing = function (_Thing) {
    _inherits(RoundThing, _Thing);

    function RoundThing(r, x, y) {
        var dx = arguments.length <= 3 || arguments[3] === undefined ? 0 : arguments[3];
        var dy = arguments.length <= 4 || arguments[4] === undefined ? 0 : arguments[4];
        var ax = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];
        var ay = arguments.length <= 6 || arguments[6] === undefined ? 0 : arguments[6];

        _classCallCheck(this, RoundThing);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(RoundThing).call(this));

        _this.r = r;
        _this.x = x;
        _this.y = y;
        _this.dx = dx;
        _this.dy = dy;
        _this.ax = ax;
        _this.ay = ay;
        return _this;
    }

    _createClass(RoundThing, [{
        key: "overlaps_quad",
        value: function overlaps_quad(quad) {
            return _Quad2.default.overlaps(this, quad) && RoundThing.overlaps_circle_and_quad(this, quad);
        }
    }, {
        key: "overlaps_point",
        value: function overlaps_point(p) {
            return RoundThing.overlaps_circle_and_point(this, p);
        }
    }, {
        key: "left",
        get: function get() {
            return this.x - this.r;
        }
    }, {
        key: "top",
        get: function get() {
            return this.y - this.r;
        }
    }, {
        key: "right",
        get: function get() {
            return this.x + this.r;
        }
    }, {
        key: "bottom",
        get: function get() {
            return this.y + this.r;
        }
    }], [{
        key: "overlaps_circle_and_quad",
        value: function overlaps_circle_and_quad(c, q) {
            if (c.x > q.left && c.x < q.right) return c.y + c.r > q.top && c.y - c.r < q.bottom;
            if (c.y > q.top && c.y < q.bottom) return c.x + c.r > q.left && c.x - c.r < q.right;
            var r2 = Math.pow(c.r);
            return _Point2.default.distance_squared(c, q.tl) < r2 || _Point2.default.distance_squared(c, q.tr) < r2 || _Point2.default.distance_squared(c, q.bl) < r2 || _Point2.default.distance_squared(c, q.br) < r2;
        }
    }, {
        key: "overlaps_circle_and_circle",
        value: function overlaps_circle_and_circle(c1, c2) {
            return _Point2.default.distance_squared(c1, c2) < Math.pow(c1.r + c2.r, 2);
        }
    }, {
        key: "overlaps_circle_and_point",
        value: function overlaps_circle_and_point(c, p) {
            return _Point2.default.distance_squared(c, p) < Math.pow(c.r, 2);
        }
    }]);

    return RoundThing;
}(_Thing3.default);

exports.default = RoundThing;

},{"./Point.js":3,"./Quad.js":4,"./Thing.js":7}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _DumbSet = require("./DumbSet");

var _DumbSet2 = _interopRequireDefault(_DumbSet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Thing = function Thing() {
    _classCallCheck(this, Thing);

    this.quads = new _DumbSet2.default();
};

exports.default = Thing;

},{"./DumbSet":2}],8:[function(require,module,exports){
"use strict";

var _ref, _, _2, _atrig2;

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.emitter = exports.MOVE = undefined;
exports.calculate_arrow = calculate_arrow;

var _events = require("events");

var _events2 = _interopRequireDefault(_events);

var _KeyboardControl = require("./KeyboardControl.js");

var KeyboardControl = _interopRequireWildcard(_KeyboardControl);

var _MouseControl = require("./MouseControl.js");

var MouseControl = _interopRequireWildcard(_MouseControl);

var _MouseLock = require("./MouseLock.js");

var MouseLock = _interopRequireWildcard(_MouseLock);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*********** I guess we're using turn/8 as our angle unit
 * 5  6  7 *
 *  \ | /  *
 *   \|/   *
 * 4-- --0 *
 *   /|\   *
 *  / | \  *
 * 3  2  1 *
 ***********/

var _trig = {
    0: { x: 1, y: 0 },
    1: { x: Math.SQRT1_2, y: Math.SQRT1_2 },
    2: { x: 0, y: 1 },
    3: { x: -Math.SQRT1_2, y: Math.SQRT1_2 },
    4: { x: -1, y: 0 },
    5: { x: -Math.SQRT1_2, y: -Math.SQRT1_2 },
    6: { x: 0, y: -1 },
    7: { x: Math.SQRT1_2, y: -Math.SQRT1_2 }
};

var _atrig = (_atrig2 = {}, _defineProperty(_atrig2, -1, (_ref = {}, _defineProperty(_ref, -1, 5), _defineProperty(_ref, 0, 6), _defineProperty(_ref, 1, 7), _ref)), _defineProperty(_atrig2, 0, (_ = {}, _defineProperty(_, -1, 4), _defineProperty(_, 0, null), _defineProperty(_, 1, 0), _)), _defineProperty(_atrig2, 1, (_2 = {}, _defineProperty(_2, -1, 3), _defineProperty(_2, 0, 2), _defineProperty(_2, 1, 1), _2)), _atrig2);

var _locked = false;
var _micro_angle = 0;
var mangle = _trig[0];
var kangle = { x: 0, y: 0 };

function calculate_arrow(p) {
    if (p.y < 0) {
        if (p.x < 0) return "↖";
        if (p.x > 0) return "↗";
        return "↑";
    }
    if (p.y > 0) {
        if (p.x < 0) return "↙";
        if (p.x > 0) return "↘";
        return "↓";
    }
    if (p.x < 0) return "←";
    if (p.x > 0) return "→";
    return "·";
}

KeyboardControl.emitter.on(KeyboardControl.CHORD, function (chord, ts) {
    var x = 0;
    var y = 0;
    var left = +!!(~chord.indexOf(37) || ~chord.indexOf(65));
    var up = +!!(~chord.indexOf(38) || ~chord.indexOf(87));
    var right = +!!(~chord.indexOf(39) || ~chord.indexOf(68));
    var down = +!!(~chord.indexOf(40) || ~chord.indexOf(83));
    if (left ^ right) {
        if (left) x = -1;else x = 1;
    }
    if (up ^ down) {
        if (up) y = -1;else y = 1;
    }
    if (x && y) {
        x *= Math.SQRT1_2;
        y *= Math.SQRT1_2;
    }
    kangle = { x: x, y: y };
    emitter.emit(MOVE, kangle, mangle, ts);
});
MouseLock.emitter.on(MouseLock.LOCKED, function (ts) {
    _locked = true;
});
MouseLock.emitter.on(MouseLock.UNLOCKED, function (ts) {
    _locked = false;
});
MouseControl.emitter.on(MouseControl.MOVE, function (dx, dy, ts) {
    //if (!_locked) return;
    var r = 320; //just feels about right to me...
    _micro_angle = ((_micro_angle + dx) % r + r) % r;
    var angle = _trig[Math.floor(_micro_angle / r * 8)];
    if (mangle === angle) return;
    mangle = angle;
    emitter.emit(MOVE, kangle, mangle, ts);
});

var MOVE = exports.MOVE = "move";
var emitter = exports.emitter = new _events2.default();

},{"./KeyboardControl.js":9,"./MouseControl.js":10,"./MouseLock.js":11,"events":1}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.emitter = exports.CHORD = undefined;

var _events = require("events");

var _events2 = _interopRequireDefault(_events);

var _DumbSet = require("../DumbSet.js");

var _DumbSet2 = _interopRequireDefault(_DumbSet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _set = new _DumbSet2.default();

function update_direction(e, state) {
    var keyCode = (e || window.event).keyCode;
    if (e.type === "keyup") {
        if (!_set.remove(keyCode)) return;
    } else if (e.type === "keydown") {
        if (!_set.add(keyCode)) return;
    }
    emitter.emit(CHORD, _set.members, e.timeStamp);
}

window.addEventListener("keydown", update_direction);
window.addEventListener("keyup", update_direction);

var CHORD = exports.CHORD = "chord";
var emitter = exports.emitter = new _events2.default();

},{"../DumbSet.js":2,"events":1}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.emitter = exports.MOVE = undefined;

var _events = require("events");

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

document.addEventListener("mousemove", function (e) {
    var dx = e.movementX || e.mozMovementX || 0;
    var dy = e.movementY || e.mozMovementY || 0;
    if (dx || dy) emitter.emit(MOVE, dx, dy, e.timeStamp);
});

var MOVE = exports.MOVE = "look";
var emitter = exports.emitter = new _events2.default();

},{"events":1}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.emitter = exports.UNLOCKED = exports.LOCKED = exports.locked = undefined;
exports.set = set;

var _events = require("events");

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var locked = exports.locked = false;

function get_pointerLockElement() {
    return document.pointerLockElement || document.mozPointerLockElement || document.webkitPointerLockElement;
}

function update_pointerlock(e, element) {
    var pointerLockElement = get_pointerLockElement();
    if (locked === !!pointerLockElement) return;
    exports.locked = locked = !!pointerLockElement;
    emitter.emit(pointerLockElement ? LOCKED : UNLOCKED, e.timeStamp);
}

function set(element) {
    var event_name = "pointerlockchange";
    if ("onmozpointerlockchange" in document) event_name = "mozpointerlockchange";else if ("onwebkitpointerlockchange" in document) event_name = "webkitpointerlockchange";
    document.addEventListener(event_name, function (e) {
        return update_pointerlock(e, element);
    });
    element.addEventListener("click", function (e) {
        return element.requestPointerLock();
    });
}

var LOCKED = exports.LOCKED = "locked";
var UNLOCKED = exports.UNLOCKED = "unlocked";
var emitter = exports.emitter = new _events2.default();

},{"events":1}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (element, board) {
    element.addEventListener("click", function (e) {
        var p = board.reverse_map(e.x, e.y);
        var thing = _World.quadtree.get_thing_at(p.x, p.y);
        if (thing) {
            _World.quadtree.remove(thing);
        } else {
            var w = 400;
            var h = 300;
            var r = Math.random() * 4 + 1;
            var angle = Math.random() * 2 * Math.PI;
            var speed = Math.random() * 5 + 2;
            var dx = Math.cos(angle) * speed;
            var dy = Math.sin(angle) * speed;
            var _thing = new _RoundThing2.default(r, p.x, p.y, dx, dy);
            _World.quadtree.add(_thing);
        }
    });
};

var _World = require("../model/World.js");

var _RoundThing = require("../RoundThing.js");

var _RoundThing2 = _interopRequireDefault(_RoundThing);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"../RoundThing.js":6,"../model/World.js":14}],13:[function(require,module,exports){
"use strict";

var _Board = require("./view/Board.js");

var _Board2 = _interopRequireDefault(_Board);

var _MouseLock = require("./controller/MouseLock.js");

var _QuadTreeDebug = require("./controller/QuadTreeDebug.js");

var _QuadTreeDebug2 = _interopRequireDefault(_QuadTreeDebug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.onload = function () {
    var _canvas = document.createElement("canvas");
    if (!_canvas.getContext) window.alert("no getContext..."); //catastrophic failure
    document.body.appendChild(_canvas);
    var _board = new _Board2.default(_canvas.getContext("2d"));

    function handle_resize() {
        _canvas.width = window.innerWidth;
        _canvas.height = window.innerHeight;
        _board.resize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener("resize", handle_resize);
    handle_resize();

    //setMouseLock(_canvas);
    (0, _QuadTreeDebug2.default)(_canvas, _board);
};

},{"./controller/MouseLock.js":11,"./controller/QuadTreeDebug.js":12,"./view/Board.js":15}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.quadtree = undefined;

var _RoundThing = require("../RoundThing.js");

var _RoundThing2 = _interopRequireDefault(_RoundThing);

var _QuadTree = require("../QuadTree.js");

var _QuadTree2 = _interopRequireDefault(_QuadTree);

var _DoubleJoystick = require("../controller/DoubleJoystick.js");

var DoubleJoystick = _interopRequireWildcard(_DoubleJoystick);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

DoubleJoystick.emitter.on(DoubleJoystick.MOVE, function (k, m, ts) {
    console.log(DoubleJoystick.calculate_arrow(k), DoubleJoystick.calculate_arrow(m), ts);
});

var w = 400;
var h = 300;
var quadtree = exports.quadtree = new _QuadTree2.default(0, 0, Math.max(w, h));

var _loop = function _loop(i) {
    var r = Math.random() * 4 + 1;
    var x = Math.random() * (w - 2 * r) + r;
    var y = Math.random() * (h - 2 * r) + r;
    var angle = Math.random() * 2 * Math.PI;
    var speed = Math.random() * 5 + 2;
    var dx = Math.cos(angle) * speed;
    var dy = Math.sin(angle) * speed;
    var thing = new _RoundThing2.default(r, x, y, dx, dy);
    var no_collision = true;
    quadtree.things.members.forEach(function (thing2) {
        if (_RoundThing2.default.overlaps_circle_and_circle(thing, thing2)) {
            no_collision = false;
        }
    });
    if (no_collision) quadtree.add(thing);
};

for (var i = 0; i < 40; i++) {
    _loop(i);
}

},{"../QuadTree.js":5,"../RoundThing.js":6,"../controller/DoubleJoystick.js":8}],15:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _World = require("../model/World.js");

var _Quad = require("../Quad.js");

var _Quad2 = _interopRequireDefault(_Quad);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _SCALE = Symbol();

var Board = function () {
    function Board(context) {
        var _this = this;

        var vwidth = arguments.length <= 1 || arguments[1] === undefined ? 400 : arguments[1];
        var vheight = arguments.length <= 2 || arguments[2] === undefined ? 300 : arguments[2];

        _classCallCheck(this, Board);

        this.context = context;
        this.vwidth = vwidth; //let's pretend this is the width when talking to Board
        this.vheight = vheight; //let's pretend this is the height when talking to Board
        this.inner = new _Quad2.default(0, 0, vwidth, vheight);
        this[_SCALE] = 1;
        var redraw_loop = function redraw_loop() {
            _this.redraw();
            window.requestAnimationFrame(redraw_loop);
        };
        window.requestAnimationFrame(redraw_loop);
    }

    _createClass(Board, [{
        key: "resize",
        value: function resize(width, height) {
            this.windowWidth = width;
            this.windowHeight = height;
            //size to fit
            var inner_ratio = this.vwidth / this.vheight;
            var outer_ratio = width / height;
            this.inner.x = 0;
            this.inner.y = 0;
            this.inner.width = width;
            this.inner.height = height;
            if (outer_ratio > inner_ratio) {
                //window is too wide;
                this.inner.width = Math.floor(height * inner_ratio);
                this.inner.x = Math.floor((width - this.inner.width) / 2);
            } else {
                //window is too tall;
                this.inner.height = Math.floor(width / inner_ratio);
                this.inner.y = Math.floor((height - this.inner.height) / 2);
            }
            this[_SCALE] = this.inner.width / this.vwidth;
            this.redraw();
        }
    }, {
        key: "redraw",
        value: function redraw() {
            var _this2 = this;

            this.context.clearRect(0, 0, this.windowWidth, this.windowHeight);
            this.context.strokeWidth = 1;
            var draw_quadtree = function draw_quadtree(quadtree) {
                if (quadtree.nodes) {
                    var middle = _this2.map(quadtree.x + quadtree.width / 2, quadtree.y + quadtree.height / 2);
                    var tl = _this2.map(quadtree.x, quadtree.y);
                    var br = _this2.map(quadtree.x + quadtree.size, quadtree.y + quadtree.size);
                    _this2.context.beginPath();
                    _this2.context.moveTo(middle.x, tl.y);
                    _this2.context.lineTo(middle.x, br.y);
                    _this2.context.moveTo(tl.x, middle.y);
                    _this2.context.lineTo(br.x, middle.y);
                    _this2.context.stroke();
                    for (var x = 0; x < 2; x++) {
                        for (var y = 0; y < 2; y++) {
                            draw_quadtree(quadtree.nodes[x][y]);
                        }
                    }
                }
            };

            this.context.strokeStyle = "rgb(200,200,255)";
            draw_quadtree(_World.quadtree);
            this.context.strokeStyle = "green";
            _World.quadtree.things.members.forEach(function (thing) {
                _this2.context.beginPath();
                var p = _this2.map(thing.x, thing.y);
                var r = _this2.scale(thing.r);
                _this2.context.arc(p.x, p.y, r, 0, Math.PI * 2, true);
                _this2.context.stroke();
            });

            this.context.strokeStyle = "blue";
            this.context.strokeWidth = 3;
            var origin = this.map(0, 0);
            this.context.strokeStyle = "black";
            this.context.strokeRect(origin.x, origin.y, this.scale(this.vwidth), this.scale(this.vheight));
        }
    }, {
        key: "map",
        value: function map(x, y) {
            return { x: this.inner.x + this.scale(x), y: this.inner.y + this.scale(y) };
        }
    }, {
        key: "reverse_map",
        value: function reverse_map(x, y) {
            return { x: this.reverse_scale(x - this.inner.x), y: this.reverse_scale(y - this.inner.y) };
        }
    }, {
        key: "scale",
        value: function scale(v) {
            return this[_SCALE] * v;
        }
    }, {
        key: "reverse_scale",
        value: function reverse_scale(v) {
            return v / this[_SCALE];
        }
    }]);

    return Board;
}();

exports.default = Board;

},{"../Quad.js":4,"../model/World.js":14}]},{},[13])


//# sourceMappingURL=bundle.js.map
