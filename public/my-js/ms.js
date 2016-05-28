'use strict';

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var y = d * 365.25;

function parse(str, options) {
   options = options || {
         default: NaN
      };
   str = '' + str;
   if (str.length > 10000) {
      return options.default;
   }
   var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(str);
   if (!match) {
      return options.default;
   }
   var n = parseFloat(match[1]);
   var type = (match[2] || 'ms').toLowerCase();
   switch (type) {
      case 'years':
      case 'year':
      case 'yrs':
      case 'yr':
      case 'y':
         return n * y;
      case 'days':
      case 'day':
      case 'd':
         return n * d;
      case 'hours':
      case 'hour':
      case 'hrs':
      case 'hr':
      case 'h':
         return n * h;
      case 'minutes':
      case 'minute':
      case 'mins':
      case 'min':
      case 'm':
         return n * m;
      case 'seconds':
      case 'second':
      case 'secs':
      case 'sec':
      case 's':
         return n * s;
      case 'milliseconds':
      case 'millisecond':
      case 'msecs':
      case 'msec':
      case 'ms':
         return n;
   }
}

