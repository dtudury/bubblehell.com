!function t(e,n,r){function i(s,u){if(!n[s]){if(!e[s]){var a="function"==typeof require&&require;if(!u&&a)return a(s,!0);if(o)return o(s,!0);var c=new Error("Cannot find module '"+s+"'");throw c.code="MODULE_NOT_FOUND",c}var l=n[s]={exports:{}};e[s][0].call(l.exports,function(t){var n=e[s][1][t];return i(n?n:t)},l,l.exports,t,e,n,r)}return n[s].exports}for(var o="function"==typeof require&&require,s=0;s<r.length;s++)i(r[s]);return i}({1:[function(t,e,n){function r(){this._events=this._events||{},this._maxListeners=this._maxListeners||void 0}function i(t){return"function"==typeof t}function o(t){return"number"==typeof t}function s(t){return"object"==typeof t&&null!==t}function u(t){return void 0===t}e.exports=r,r.EventEmitter=r,r.prototype._events=void 0,r.prototype._maxListeners=void 0,r.defaultMaxListeners=10,r.prototype.setMaxListeners=function(t){if(!o(t)||0>t||isNaN(t))throw TypeError("n must be a positive number");return this._maxListeners=t,this},r.prototype.emit=function(t){var e,n,r,o,a,c;if(this._events||(this._events={}),"error"===t&&(!this._events.error||s(this._events.error)&&!this._events.error.length)){if(e=arguments[1],e instanceof Error)throw e;throw TypeError('Uncaught, unspecified "error" event.')}if(n=this._events[t],u(n))return!1;if(i(n))switch(arguments.length){case 1:n.call(this);break;case 2:n.call(this,arguments[1]);break;case 3:n.call(this,arguments[1],arguments[2]);break;default:o=Array.prototype.slice.call(arguments,1),n.apply(this,o)}else if(s(n))for(o=Array.prototype.slice.call(arguments,1),c=n.slice(),r=c.length,a=0;r>a;a++)c[a].apply(this,o);return!0},r.prototype.addListener=function(t,e){var n;if(!i(e))throw TypeError("listener must be a function");return this._events||(this._events={}),this._events.newListener&&this.emit("newListener",t,i(e.listener)?e.listener:e),this._events[t]?s(this._events[t])?this._events[t].push(e):this._events[t]=[this._events[t],e]:this._events[t]=e,s(this._events[t])&&!this._events[t].warned&&(n=u(this._maxListeners)?r.defaultMaxListeners:this._maxListeners,n&&n>0&&this._events[t].length>n&&(this._events[t].warned=!0,console.error("(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.",this._events[t].length),"function"==typeof console.trace&&console.trace())),this},r.prototype.on=r.prototype.addListener,r.prototype.once=function(t,e){function n(){this.removeListener(t,n),r||(r=!0,e.apply(this,arguments))}if(!i(e))throw TypeError("listener must be a function");var r=!1;return n.listener=e,this.on(t,n),this},r.prototype.removeListener=function(t,e){var n,r,o,u;if(!i(e))throw TypeError("listener must be a function");if(!this._events||!this._events[t])return this;if(n=this._events[t],o=n.length,r=-1,n===e||i(n.listener)&&n.listener===e)delete this._events[t],this._events.removeListener&&this.emit("removeListener",t,e);else if(s(n)){for(u=o;u-- >0;)if(n[u]===e||n[u].listener&&n[u].listener===e){r=u;break}if(0>r)return this;1===n.length?(n.length=0,delete this._events[t]):n.splice(r,1),this._events.removeListener&&this.emit("removeListener",t,e)}return this},r.prototype.removeAllListeners=function(t){var e,n;if(!this._events)return this;if(!this._events.removeListener)return 0===arguments.length?this._events={}:this._events[t]&&delete this._events[t],this;if(0===arguments.length){for(e in this._events)"removeListener"!==e&&this.removeAllListeners(e);return this.removeAllListeners("removeListener"),this._events={},this}if(n=this._events[t],i(n))this.removeListener(t,n);else if(n)for(;n.length;)this.removeListener(t,n[n.length-1]);return delete this._events[t],this},r.prototype.listeners=function(t){var e;return e=this._events&&this._events[t]?i(this._events[t])?[this._events[t]]:this._events[t].slice():[]},r.prototype.listenerCount=function(t){if(this._events){var e=this._events[t];if(i(e))return 1;if(e)return e.length}return 0},r.listenerCount=function(t,e){return t.listenerCount(e)}},{}],2:[function(t,e,n){"use strict";function r(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function i(t){return new v(Math.sqrt(t.r*t.r+t.i*t.i),0)}function o(t,e){return new v(t.r+e.r,t.i+e.i)}function s(t,e){var n=e.r*e.r+e.i*e.i;return new v((t.r*e.r+t.i*e.i)/n,(t.i*e.r-t.r*e.i)/n)}function u(t,e){return new v(t.r*e.r-t.i*e.i,t.r*e.i+t.i*e.r)}function a(t){return new v(-t.r,-t.i)}function c(t){if(!t.i)return t.r<0?new v(0,Math.sqrt(-t.r)):new v(Math.sqrt(t.r),0);var e=i(t).r/2,n=t.r/2,r=Math.sqrt(e+n),o=d(t.i)*Math.sqrt(e-n);return new v(r,o)}function l(t,e){return new v(t.r-e.r,t.i-e.i)}Object.defineProperty(n,"__esModule",{value:!0});var h="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol?"symbol":typeof t},f=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}(),d=Math.sign||function(t){return t&&t>0?1:-1},v=function(){function t(){var e=arguments.length<=0||void 0===arguments[0]?0:arguments[0],n=arguments.length<=1||void 0===arguments[1]?0:arguments[1];r(this,t),this.r=e,this.i=n}return f(t,[{key:"abs",value:function(){return i(this)}},{key:"add",value:function(e){return o(this,t.convert(e))}},{key:"div",value:function(e){return s(this,t.convert(e))}},{key:"mul",value:function(e){return u(this,t.convert(e))}},{key:"neg",value:function(){return a(this)}},{key:"sqrt",value:function(){return c(this)}},{key:"sub",value:function(e){return l(this,t.convert(e))}}],[{key:"convert",value:function(e){var n=arguments.length<=1||void 0===arguments[1]?0:arguments[1];if(e){var r="undefined"==typeof e?"undefined":h(e);if("number"===r)return new t(e,n);if("object"===r)return new t("number"==typeof e.r?e.r:parseFloat(e.r)||0,"number"==typeof e.i?e.i:parseFloat(e.i)||0)}return new t(0,n)}},{key:"abs",value:function(){var e=arguments.length<=0||void 0===arguments[0]?0:arguments[0],n=arguments.length<=1||void 0===arguments[1]?0:arguments[1];return i(t.convert(e,n))}},{key:"add",value:function(e,n){return o(t.convert(e),t.convert(n))}},{key:"div",value:function(e,n){return s(t.convert(e),t.convert(n))}},{key:"mul",value:function(e,n){return u(t.convert(e),t.convert(n))}},{key:"neg",value:function(){var e=arguments.length<=0||void 0===arguments[0]?0:arguments[0],n=arguments.length<=1||void 0===arguments[1]?0:arguments[1];return a(t.convert(e,n))}},{key:"sqrt",value:function(){var e=arguments.length<=0||void 0===arguments[0]?0:arguments[0],n=arguments.length<=1||void 0===arguments[1]?0:arguments[1];return c(t.convert(e,n))}},{key:"sub",value:function(e,n){return l(t.convert(e),t.convert(n))}},{key:"sqrt2",value:function(){var e=arguments.length<=0||void 0===arguments[0]?0:arguments[0],n=arguments.length<=1||void 0===arguments[1]?0:arguments[1],r=Math.pow(e*e+n*n,.25),i=Math.atan2(n,e)/2,o=Math.cos(i)*r,s=Math.sin(i)*r;return new t(o,s)}}]),t}();n["default"]=v},{}],3:[function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{"default":t}}function i(t){return p(t)*Math.pow(Math.abs(t),1/3)}function o(t,e,n){return n?[y(-e/t)]:[-e/t]}function s(t,e,n,r){var i=2*t,o=e*e-4*t*n,s=e/i,u=Math.sqrt(Math.abs(o))/i;return r?0>o?[y(-s,u),y(-s,-u)]:[y(-s-u),y(-s+u)]:0>o?[]:[-s-u,-s+u]}function u(t,e,n,r,o){var s=t*t,u=s*t,a=e*e,c=a*e,l=(3*n/t-a/s)/3,h=(2*c/u-9*e*n/s+27*r/t)/27,f=h*h,d=f/4+l*l*l/27;if(d>0){var v=Math.sqrt(d),g=-h/2+v,m=i(g),p=-h/2-v,b=i(p);if(o){var w=(m+b)/2-e/(3*t),x=(m-b)*_/2;return[y(m+b-e/(3*t)),y(w,x),y(w,-x)]}return[m+b-e/(3*t)]}if(0===d&&0===l&&0===h)return o?[y(-i(r/t))]:[-i(r/t)];var k=Math.sqrt(f/4-d),M=i(k),j=Math.acos(-h/(2*k)),O=Math.cos(j/3),E=_*Math.sin(j/3),P=-e/(3*t);return o?[y(-M*(O-E)+P),y(-M*(O+E)+P),y(2*M*Math.cos(j/3)-e/(3*t))]:[-M*(O-E)+P,-M*(O+E)+P,2*M*Math.cos(j/3)-e/(3*t)]}function a(t,e,n,r,i,o){e/=t,n/=t,r/=t,i/=t;var s=e*e,a=n-3*s/8,c=s*e,l=r+c/8-e*n/2,h=c*e,f=i-3*h/256+s*n/16-e*r/4,d=u(1,a/2,(a*a-4*f)/16,-l*l/64,!0);d.sort(function(t,e){return e.i-t.i||e.r-t.r});var v=d[0].sqrt(),g=d[1].sqrt(),m=y(-l).div(v.mul(g).mul(8)),p=y(e/4),_=[v.add(g).add(m).sub(p),v.sub(g).sub(m).sub(p),v.neg().add(g).sub(m).sub(p),v.neg().sub(g).add(m).sub(p)];return o?_:_.filter(function(t){return!t.i}).map(function(t){return t.r})}function c(t){for(var e=arguments.length<=1||void 0===arguments[1]?!1:arguments[1],n=t.slice();n.length&&!n[0];)n.shift();var r=[];if(!n.length)return r;if(!n[n.length-1])for(e?r.push(y(0)):r.push(0);!n[n.length-1];)n.pop();if(n.length<2)return r;var i=n[0],c=n[1];if(2===n.length)return o(i,c,e).concat(r);var l=n[2];if(3===n.length)return s(i,c,l,e).concat(r);var h=n[3];if(4===n.length)return u(i,c,l,h,e).concat(r);var f=n[4];return 5===n.length?a(i,c,l,h,f,e).concat(r):"unhandled polynomic order"}function l(t){var e=arguments.length<=1||void 0===arguments[1]?!1:arguments[1];return e?c(t,e).sort(function(t,e){return t.r-e.r||t.i-e.i}):c(t,e).sort(function(t,e){return t-e})}function h(t,e){var n=arguments.length<=2||void 0===arguments[2]?!1:arguments[2];return l([t,e],n)}function f(t,e,n){var r=arguments.length<=3||void 0===arguments[3]?!1:arguments[3];return l([t,e,n],r)}function d(t,e,n,r){var i=arguments.length<=4||void 0===arguments[4]?!1:arguments[4];return l([t,e,n,r],i)}function v(t,e,n,r,i){var o=arguments.length<=5||void 0===arguments[5]?!1:arguments[5];return l([t,e,n,r,i],o)}Object.defineProperty(n,"__esModule",{value:!0}),n.solve=l,n.linear=h,n.quadratic=f,n.cubic=d,n.quartic=v;var g=t("./Complex.js"),m=r(g),y=m["default"].convert,p=Math.sign||function(t){return t&&t>0?1:-1},_=Math.sqrt(3)},{"./Complex.js":2}],4:[function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{"default":t}}function i(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function o(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}function s(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}function u(t){var e=[],n=[{name:"left wall",type:"vertical_wall",x:0,side:1},{name:"right wall",type:"vertical_wall",x:400,side:-1},{name:"roof",type:"horizontal_wall",y:0,side:1},{name:"floor",type:"horizontal_wall",y:300,side:-1}];return n.forEach(function(n){var r=void 0;"horizontal_wall"==n.type?r=[t.ddy/2,t.dy,t.y-n.y-n.side*t.r]:"vertical_wall"==n.type&&(r=[t.ddx/2,t.dx,t.x-n.x-n.side*t.r]);var i=(0,f.solve)(r);i.forEach(function(r){0>=r||e.push({thing:t,type:n.type,t:t.t+r})})}),e}Object.defineProperty(n,"__esModule",{value:!0});var a=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}(),c=function v(t,e,n){null===t&&(t=Function.prototype);var r=Object.getOwnPropertyDescriptor(t,e);if(void 0===r){var i=Object.getPrototypeOf(t);return null===i?void 0:v(i,e,n)}if("value"in r)return r.value;var o=r.get;if(void 0!==o)return o.call(n)},l=t("./QuadTree"),h=r(l),f=t("./EquationSolver"),d=function(t){function e(t){var n=arguments.length<=1||void 0===arguments[1]?0:arguments[1],r=arguments.length<=2||void 0===arguments[2]?0:arguments[2],s=arguments.length<=3||void 0===arguments[3]?400:arguments[3],u=arguments.length<=4||void 0===arguments[4]?300:arguments[4],a=arguments.length<=5||void 0===arguments[5]?2:arguments[5],c=arguments.length<=6||void 0===arguments[6]?8:arguments[6];i(this,e);var l=o(this,Object.getPrototypeOf(e).call(this,n,r,Math.max(s,u),a,c));return l.t=void 0===t?Date.now():t,l.court_width=s,l.court_height=u,l.collisions=[],l}return s(e,t),a(e,[{key:"get_things_at_t",value:function(t){for(var n=this,r=function(){var t=n.collisions.shift(),r=void 0;"horizontal_wall"===t.type?(n.remove(t.thing),r=t.thing.clone_at_t(t.t),r.dy*=-1,c(Object.getPrototypeOf(e.prototype),"add",n).call(n,r)):"vertical_wall"===t.type&&(n.remove(t.thing),r=t.thing.clone_at_t(t.t),r.dx*=-1,c(Object.getPrototypeOf(e.prototype),"add",n).call(n,r)),n.collisions=n.collisions.filter(function(e){return e.thing!==t.thing});var i=u(r);i=i.filter(function(e){return e.t>t.t+1e-6}),n.collisions=n.collisions.concat(i),n.collisions.sort(function(t,e){return t.t-e.t})};this.collisions.length&&this.collisions[0].t<t;)r();return this.t=t,Array.from(this.things_set).map(function(e){return e.clone_at_t(t)})}},{key:"predict_collisions",value:function(){}},{key:"add",value:function(t){if(c(Object.getPrototypeOf(e.prototype),"add",this).call(this,t)){var n=u(t);this.collisions=this.collisions.concat(n),this.collisions.sort(function(t,e){return t.t-e.t})}}}]),e}(h["default"]);n["default"]=d},{"./EquationSolver":3,"./QuadTree":8}],5:[function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{"default":t}}function i(t,e){return t.left<=e.right&&t.right>=e.left&&t.top<=e.bottom&&t.bottom>=e.top}function o(t,e){return e.x>=t.left&&e.x<=t.right&&e.y>=t.top&&e.y<=t.bottom}function s(t,e){if(i(t,e))return!0;if(e.x>t.left&&e.x<t.right)return e.y+e.r>=t.top&&e.y-e.r<=t.bottom;if(e.y>t.top&&e.y<=t.bottom)return e.x+e.r>=t.left&&e.x-e.r<=t.right;var n=Math.pow(e.r,2);return l["default"].distance_squared(e,t.tl)<=n||l["default"].distance_squared(e,t.tr)<=n||l["default"].distance_squared(e,t.bl)<=n||l["default"].distance_squared(e,t.br)<=n}function u(t,e){return l["default"].distance_squared(t,e)<=Math.pow(t.r+e.r,2)}function a(t,e){return l["default"].distance_squared(t,e)<=Math.pow(t.r,2)}Object.defineProperty(n,"__esModule",{value:!0}),n.quad_and_quad=i,n.quad_and_point=o,n.quad_and_circle=s,n.circle_and_circle=u,n.circle_and_point=a;var c=t("./Point.js"),l=r(c)},{"./Point.js":6}],6:[function(t,e,n){"use strict";function r(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(n,"__esModule",{value:!0});var i=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}(),o=function(){function t(e,n){r(this,t),this.x=e,this.y=n}return i(t,null,[{key:"distance",value:function(e,n){return Math.sqrt(t.distance_squared(e,n))}},{key:"distance_squared",value:function(t,e){return Math.pow(t.x-e.x,2)+Math.pow(t.y-e.y,2)}}]),t}();n["default"]=o},{}],7:[function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{"default":t}}function i(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(n,"__esModule",{value:!0});var o=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}(),s=t("./Point.js"),u=r(s),a=function(){function t(e,n,r,o){i(this,t),this.x=e,this.y=n,this.width=r,this.height=o}return o(t,[{key:"left",get:function(){return this.x}},{key:"top",get:function(){return this.y}},{key:"right",get:function(){return this.x+this.width}},{key:"bottom",get:function(){return this.y+this.height}},{key:"tl",get:function(){return new u["default"](this.left,this.top)}},{key:"tr",get:function(){return new u["default"](this.right,this.top)}},{key:"bl",get:function(){return new u["default"](this.left,this.bottom)}},{key:"br",get:function(){return new u["default"](this.right,this.bottom)}}]),t}();n["default"]=a},{"./Point.js":6}],8:[function(t,e,n){"use strict";function r(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n]);return e["default"]=t,e}function i(t){return t&&t.__esModule?t:{"default":t}}function o(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function s(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}function u(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}Object.defineProperty(n,"__esModule",{value:!0});var a=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}(),c=t("./Quad.js"),l=i(c),h=t("./Overlaps.js"),f=r(h),d=function(t){function e(){var t=arguments.length<=0||void 0===arguments[0]?0:arguments[0],n=arguments.length<=1||void 0===arguments[1]?0:arguments[1],r=arguments.length<=2||void 0===arguments[2]?400:arguments[2],i=arguments.length<=3||void 0===arguments[3]?2:arguments[3],u=arguments.length<=4||void 0===arguments[4]?8:arguments[4];o(this,e);var a=s(this,Object.getPrototypeOf(e).call(this,t,n,r,r));return a.size=r,a.capacity=i,a.max_levels=u,a.bucket_set=new Set,a.nodes=null,a.things_set=new Set,a}return u(e,t),a(e,[{key:"touch_things",value:function(){this.bucket_set&&this.bucket_set.forEach(function(t){return t.touch()})}},{key:"add",value:function(t){if(!f.quad_and_circle(this,t))return!1;if(!this.things_set.add(t))return!1;if(this.bucket_set){if(this.bucket_set.size<this.capacity||!this.max_levels)return this.bucket_set.add(t),t.quads_set.add(this),this.touch_things(),!0;this.split()}return this.nodes.forEach(function(e){return e.add(t)}),!0}},{key:"remove",value:function(t){var e=this;if(!this.things_set["delete"](t))return!1;if(this.bucket_set)this.bucket_set["delete"](t),t.quads_set["delete"](this),this.touch_things();else{var n=function(t){e.nodes.forEach(function(e){return e.remove(t)})};n(t),this.things_set.size<=this.capacity&&(this.things_set.forEach(n),delete this.nodes,this.bucket_set=new Set,this.things_set.forEach(function(t){e.bucket_set.add(t),t.quads_set.add(e)}),this.touch_things())}return!0}},{key:"get_thing_at",value:function(t,e){var n={x:t,y:e},r=null;return f.quad_and_point(this,n)?this.bucket_set?(this.bucket_set.forEach(function(t){f.circle_and_point(t,n)&&(r=t)}),r):(this.nodes.forEach(function(n){return r=r||n.get_thing_at(t,e)}),r):null}},{key:"split",value:function(){var t=this;this.bucket_set.forEach(function(e){return e.quads_set["delete"](t)});var n=this.size/2;this.nodes=[];for(var r=0;4>r;r++){var i=r%2,o=r/2>>>0,s=new e(this.x+n*i,this.y+n*o,n,this.capacity,this.max_levels-1);this.nodes[r]=s,this.bucket_set.forEach(s.add.bind(s))}delete this.bucket_set}}]),e}(l["default"]);n["default"]=d},{"./Overlaps.js":5,"./Quad.js":7}],9:[function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{"default":t}}function i(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function o(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}function s(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}Object.defineProperty(n,"__esModule",{value:!0});var u=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}(),a=function f(t,e,n){null===t&&(t=Function.prototype);var r=Object.getOwnPropertyDescriptor(t,e);if(void 0===r){var i=Object.getPrototypeOf(t);return null===i?void 0:f(i,e,n)}if("value"in r)return r.value;var o=r.get;if(void 0!==o)return o.call(n)},c=t("./Thing.js"),l=r(c),h=function(t){function e(t,n,r,s,u,a){var c=arguments.length<=6||void 0===arguments[6]?0:arguments[6],l=arguments.length<=7||void 0===arguments[7]?1e-5:arguments[7],h=arguments.length<=8||void 0===arguments[8]?"black":arguments[8];i(this,e),t=void 0===t?Date.now():t;var f=o(this,Object.getPrototypeOf(e).call(this,t,r,s,u,a,c,l));return f.r=n,f.color=h,f}return s(e,t),u(e,[{key:"clone_at_t",value:function(t){var n=a(Object.getPrototypeOf(e.prototype),"clone_at_t",this).call(this,t);return new e(t,this.r,n.x,n.y,n.dx,n.dy,n.ddx,n.ddy,this.color)}},{key:"left",get:function(){return this.x-this.r}},{key:"top",get:function(){return this.y-this.r}},{key:"right",get:function(){return this.x+this.r}},{key:"bottom",get:function(){return this.y+this.r}}],[{key:"random",value:function(t,n,r,i,o){t=void 0===t?Date.now():t,n=void 0===n?400:n,r=void 0===r?300:r;var s=5*Math.random()+5;i=void 0===i?Math.random()*(n-2*s)+s:i,o=void 0===o?Math.random()*(r-2*s)+s:o;var u=2*Math.random()*Math.PI,a=.01*(5*Math.random()+2),c=Math.cos(u)*a,l=Math.sin(u)*a,h=2*Math.random()*Math.PI,f=1e-5,d=Math.cos(h)*f,v=Math.sin(h)*f;return new e(t,s,i,o,c,l,d,v)}}]),e}(l["default"]);n["default"]=h},{"./Thing.js":10}],10:[function(t,e,n){"use strict";function r(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(n,"__esModule",{value:!0});var i=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}(),o=function(){function t(e){var n=arguments.length<=1||void 0===arguments[1]?0:arguments[1],i=arguments.length<=2||void 0===arguments[2]?0:arguments[2],o=arguments.length<=3||void 0===arguments[3]?0:arguments[3],s=arguments.length<=4||void 0===arguments[4]?0:arguments[4],u=arguments.length<=5||void 0===arguments[5]?0:arguments[5],a=arguments.length<=6||void 0===arguments[6]?0:arguments[6];r(this,t),this.t=void 0===e?Date.now():e,this.x=n,this.y=i,this.dx=o,this.dy=s,this.ddx=u,this.ddy=a,this.quads_set=new Set}return i(t,[{key:"clone_at_t",value:function(e){var n=e-this.t,r=n*n;return new t(e,this.x+n*this.dx+r*this.ddx/2,this.y+n*this.dy+r*this.ddy/2,this.dx+n*this.ddx,this.dy+n*this.ddy,this.ddx,this.ddy)}},{key:"touch",value:function(){if(!this.touched){var t=["red","orange","yellow","lime","aqua","blue","fuchsia"];void 0===this.color_index?this.color_index=Math.floor(Math.random()*t.length):(this.color_index+=3,this.color_index%=t.length),this.color=t[this.color_index],this.touched=!0}}},{key:"untouch",value:function(){this.touched=!1}}]),t}();n["default"]=o},{}],11:[function(t,e,n){"use strict";function r(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n]);return e["default"]=t,e}function i(t){return t&&t.__esModule?t:{"default":t}}function o(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function s(t){return t.y<0?t.x<0?"↖":t.x>0?"↗":"↑":t.y>0?t.x<0?"↙":t.x>0?"↘":"↓":t.x<0?"←":t.x>0?"→":"·"}Object.defineProperty(n,"__esModule",{value:!0}),n.emitter=n.MOVE=void 0;var u,a,c,l;n.calculate_arrow=s;var h=t("events"),f=i(h),d=t("./KeyboardControl.js"),v=r(d),g=t("./MouseControl.js"),m=r(g),y=t("./MouseLock.js"),p=r(y),_=n.MOVE="move",b=n.emitter=new f["default"],w={0:{x:1,y:0},1:{x:Math.SQRT1_2,y:Math.SQRT1_2},2:{x:0,y:1},3:{x:-Math.SQRT1_2,y:Math.SQRT1_2},4:{x:-1,y:0},5:{x:-Math.SQRT1_2,y:-Math.SQRT1_2},6:{x:0,y:-1},7:{x:Math.SQRT1_2,y:-Math.SQRT1_2}},x=(l={},o(l,-1,(u={},o(u,-1,5),o(u,0,6),o(u,1,7),u)),o(l,0,(a={},o(a,-1,4),o(a,0,null),o(a,1,0),a)),o(l,1,(c={},o(c,-1,3),o(c,0,2),o(c,1,1),c)),l,!1),k=0,M=w[0],j={x:0,y:0};v.emitter.on(v.CHORD,function(t,e){var n=0,r=0,i=+(t.has(37)||t.has(65)),o=+(t.has(38)||t.has(87)),s=+(t.has(39)||t.has(68)),u=+(t.has(40)||t.has(83));i^s&&(n=i?-1:1),o^u&&(r=o?-1:1),n&&r&&(n*=Math.SQRT1_2,r*=Math.SQRT1_2),(n!==j.x||r!==j.y)&&(j={x:n,y:r},b.emit(_,j,M,e))}),p.emitter.on(p.LOCKED,function(t){x=!0}),p.emitter.on(p.UNLOCKED,function(t){x=!1}),m.emitter.on(m.MOVE,function(t,e,n){var r=320;k=((k+t)%r+r)%r;var i=w[Math.floor(k/r*8)];M!==i&&(M=i,b.emit(_,j,M,n))})},{"./KeyboardControl.js":12,"./MouseControl.js":13,"./MouseLock.js":14,events:1}],12:[function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{"default":t}}function i(t,e){var n=(t||window.event).keyCode;if("keyup"===t.type){if(!u["delete"](n))return}else if("keydown"===t.type&&!u.add(n))return;c.emit(a,u,t.timeStamp)}Object.defineProperty(n,"__esModule",{value:!0}),n.emitter=n.CHORD=void 0;var o=t("events"),s=r(o),u=new Set;window.addEventListener("keydown",i),window.addEventListener("keyup",i);var a=n.CHORD="chord",c=n.emitter=new s["default"]},{events:1}],13:[function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{"default":t}}Object.defineProperty(n,"__esModule",{value:!0}),n.emitter=n.MOVE=void 0;var i=t("events"),o=r(i);document.addEventListener("mousemove",function(t){var e=t.movementX||t.mozMovementX||0,n=t.movementY||t.mozMovementY||0;(e||n)&&u.emit(s,e,n,t.timeStamp)});var s=n.MOVE="look",u=n.emitter=new o["default"]},{events:1}],14:[function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{"default":t}}function i(){return document.pointerLockElement||document.mozPointerLockElement||document.webkitPointerLockElement}function o(t,e){var r=i();c===r&&(n.unlocked=c=!r,f.emit(c?h:l,t.timeStamp))}function s(t){var e="pointerlockchange";"onmozpointerlockchange"in document?e="mozpointerlockchange":"onwebkitpointerlockchange"in document&&(e="webkitpointerlockchange"),document.addEventListener(e,function(e){return o(e,t)}),t.addEventListener("click",function(e){return t.requestPointerLock()})}Object.defineProperty(n,"__esModule",{value:!0}),n.emitter=n.UNLOCKED=n.LOCKED=n.unlocked=void 0,n.set=s;var u=t("events"),a=r(u),c=n.unlocked=!1,l=n.LOCKED="locked",h=n.UNLOCKED="unlocked",f=n.emitter=new a["default"]},{events:1}],15:[function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{"default":t}}Object.defineProperty(n,"__esModule",{value:!0}),n["default"]=function(t,e){t.addEventListener("click",function(t){var n=e.reverse_map(t.x,t.y),r=i.movingThings.get_thing_at(n.x,n.y);r?i.movingThings.remove(r):i.movingThings.add(s["default"].random(Date.now(),400,300,n.x,n.y))}),window.addEventListener("mousemove",function(t){var n=e.reverse_map(t.x,t.y);i.movingThings.thing=i.movingThings.get_thing_at(n.x,n.y)})};var i=t("../model/World.js"),o=t("../RoundThing.js"),s=r(o)},{"../RoundThing.js":9,"../model/World.js":17}],16:[function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{"default":t}}var i=t("./view/Board.js"),o=r(i),s=(t("./controller/MouseLock.js"),t("./controller/QuadTreeDebug.js")),u=r(s);window.onload=function(){function t(){e.width=window.innerWidth,e.height=window.innerHeight,n.resize(window.innerWidth,window.innerHeight)}var e=document.createElement("canvas");e.getContext||window.alert("no getContext..."),document.body.appendChild(e);var n=new o["default"](e.getContext("2d"));window.addEventListener("resize",t),t(),(0,u["default"])(e,n)}},{"./controller/MouseLock.js":14,"./controller/QuadTreeDebug.js":15,"./view/Board.js":18}],17:[function(t,e,n){"use strict";function r(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n]);return e["default"]=t,e}function i(t){return t&&t.__esModule?t:{"default":t}}Object.defineProperty(n,"__esModule",{value:!0}),n.movingThings=void 0;var o=t("../RoundThing.js"),s=i(o),u=t("../MovingThings.js"),a=i(u),c=t("../controller/DoubleJoystick.js"),l=r(c),h=t("../Overlaps.js"),f=r(h);l.emitter.on(l.MOVE,function(t,e,n){console.log(l.calculate_arrow(t),l.calculate_arrow(e),n)});for(var d=400,v=300,g=Date.now(),m=n.movingThings=new a["default"](g,0,0,d,v),y=function(t){var e=s["default"].random(g,d,v),n=!0;m.things_set.forEach(function(t){f.circle_and_circle(e,t)&&(n=!1)}),n&&m.add(e)},p=0;1e3>p;p++)y(p);m.predict_collisions()},{"../MovingThings.js":4,"../Overlaps.js":5,"../RoundThing.js":9,"../controller/DoubleJoystick.js":11}],18:[function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{"default":t}}function i(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(n,"__esModule",{value:!0});var o=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}(),s=t("../model/World.js"),u=t("../Quad.js"),a=r(u),c=Symbol(),l=function(){function t(e){var n=this,r=arguments.length<=1||void 0===arguments[1]?400:arguments[1],o=arguments.length<=2||void 0===arguments[2]?300:arguments[2];i(this,t),this.context=e,this.vwidth=r,this.vheight=o,this.inner=new a["default"](0,0,r,o),this[c]=1;var s=function u(){n.redraw(),window.requestAnimationFrame(u)};window.requestAnimationFrame(s)}return o(t,[{key:"resize",value:function(t,e){this.windowWidth=t,this.windowHeight=e;var n=this.vwidth/this.vheight,r=t/e;this.inner.x=0,this.inner.y=0,this.inner.width=t,this.inner.height=e,r>n?(this.inner.width=Math.floor(e*n),this.inner.x=Math.floor((t-this.inner.width)/2)):(this.inner.height=Math.floor(t/n),this.inner.y=Math.floor((e-this.inner.height)/2)),this[c]=this.inner.width/this.vwidth,this.redraw()}},{key:"redraw",value:function(){var t=this,e=s.movingThings.get_things_at_t(Date.now());this.context.clearRect(0,0,this.windowWidth,this.windowHeight),this.context.lineWidth=1;var n=function i(e){if(e.nodes){var n=t.map(e.x+e.size/2,e.y+e.size/2),r=t.map(e.x,e.y),o=t.map(e.x+e.size,e.y+e.size);t.context.beginPath(),t.context.moveTo(n.x,r.y),t.context.lineTo(n.x,o.y),t.context.moveTo(r.x,n.y),t.context.lineTo(o.x,n.y),t.context.stroke(),e.nodes.forEach(function(t){return i(t)})}};this.context.strokeStyle="rgb(240,240,255)",n(s.movingThings),s.movingThings.thing&&(this.context.strokeStyle="rgb(220,220,255)",this.context.lineWidth=2,s.movingThings.thing.quads_set.forEach(function(e){var n=t.map(e.x,e.y),r=t.scale(e.size);t.context.strokeRect(n.x,n.y,r,r)})),this.context.lineWidth=1,e.forEach(function(e){t.context.strokeStyle=e.color||"green",e.untouch(),t.context.beginPath();var n=t.map(e.x,e.y),r=t.scale(e.r);t.context.arc(n.x,n.y,r,0,2*Math.PI,!0),t.context.stroke()}),this.context.strokeStyle="blue",this.context.lineWidth=1;var r=this.map(0,0);this.context.strokeStyle="black",this.context.strokeRect(r.x,r.y,this.scale(this.vwidth),this.scale(this.vheight))}},{key:"map",value:function(t,e){return{x:this.inner.x+this.scale(t),y:this.inner.y+this.scale(e)}}},{key:"reverse_map",value:function(t,e){return{x:this.reverse_scale(t-this.inner.x),y:this.reverse_scale(e-this.inner.y)}}},{key:"scale",value:function(t){return this[c]*t}},{key:"reverse_scale",value:function(t){return t/this[c]}}]),t}();n["default"]=l},{"../Quad.js":7,"../model/World.js":17}]},{},[16]);
//# sourceMappingURL=bundle.js.map
