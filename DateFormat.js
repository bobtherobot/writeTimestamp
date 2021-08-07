/*
DateFormat 1.0
(c) 2021 Mike Gieson (www.gieson.com)
MIT license


--------------------------
Usage
--------------------------

var DateFormat = require("DateFormat");
// or for browser: no need to require, just use window.DateFormat("y-m-d");

// arguments can appear in any order (we'll sort them out for you)
DateFormat([date, format, gmt]);

// No args assumes "now" 
console.log( DateFormat() )				// Saturday, March 4, 2017 @ 6:08:09 AM"

// Format
console.log( DateFormat("Y-m-d") ) 		// 2025-4-1

// Include a date
var myDate = new Date(2025, 3, 1); 			// (months are zero-based) jan = 0
console.log( DateFormat("y-m-d", myDate) ) 	// 2025-4-1

// GMT
console.log( DateFormat("H", true) ) 	// 7 (GMT offset applied)
console.log( DateFormat("H") ) 			// 12 (local hour)

// With format, date and GMT
console.log( DateFormat(new Date(2025, 3, 1), "y-m-d", true) ) // 2025-4-1

// With custom string
console.log( DateFormat('"hello double quotes" y-m-d') ) 		// hello there 2025-4-1
console.log( DateFormat("'hello single quotes' y-m-d") ) 		// hello there 2025-4-1
console.log( DateFormat('"internal s\'ingle quotes" y-m-d') ) 	// internal s'ingle quotes 2025-4-1
console.log( DateFormat("'internal d\"ouble quotes' y-m-d") ) 	// internal d"ouble quotes 2025-4-1

-------------------
Format Flags
-------------------
You can include any character not listed below for seperators, or additional text output
Example:
	DateFormat("y-m-d"); // adding "-" between flags

d 		Day of the month
dd 		Day of the month - padded
ddd 	Day of the month - with ordinal suffix (1st, 2nd, 3rd, 4th ...)
w 		Week day - short name (Sun, Mon, Tues...)
W		Week day - full name (Sunday, Monday, Tuesday...)
m 		Month (1-12)
mm 		Month - padded (01-12)
j 		Month - short name (Jan, Feb, Mar...)
J 		Month - full name (January, Feburary, March...)
y 		Year - full (2021) 
yy 		Year - short (21)
yyyy 	Year - full  (2021) (same as y)
H 		Hours (24-hour clock)
HH 		Hours (24-hour clock) - padded
h 		Hours (12-hour clock) 
hh 		Hours (12-hour clock) - padded
M 		Minutes (0-59)
MM 		Minutes (01-59) - padded
S 		Seconds (0-59)
SS 		Seconds (01-59) - padded
L		Milliseconds - 3 digits prefixed with a dot (.XXX)
a 		AM / PM - lowercase - single-character (a or p)
aa 		AM / PM - lowercase - two-character (am or pm)
aaa 	AM / PM - lowercase - two-character with dots (a.m. or p.m.)
A 		AM / PM - uppercase, single-character (A or P)
AA 		AM / PM - uppercase - two-character (AM or PM)
AAA 	AM / PM - uppercase - two-character with dots (A.M. or P.M.)
z 		US timezone abbreviation, e.g. EST or MDT. For non-US timezones GMT/UTC returned,  e.g. GMT-0500
Z 		GMT/UTC timezone offset, e.g. -5 or +2.5
ZZ 		GMT/UTC timezone offset, e.g. -0500 or +0230
'foo' or "foo" 	Literal character sequence.
		Examples: 
			' "bob did this on" y-m-d '
			" 'bob did this on' y-m-d "
		Quotes are not printed. If you need to print quotes, escape with a \backslash
			Examples:
					"bob\'s" y-m-d
					bob said \"this\" on y-m-d 


-------------------
Common Formats 
-------------------
y-mm-dd @ HH:MM:SS		//  2021-08-07 @ 06:01:19
y-mm-dd					//  2021-08-07
y-m-d					//  2021-8-7
m/d/y @ HH:MM:SS		//  8/7/2021 @ 06:01:19
m/d/y					//  8/7/2021
h:MM:SS AA				//  6:01:19 AM
HH:MM:SS				//  06:01:19
H:MM:SS					//  6:01:19
W, J d, y @ h:MM:SS AA	//  Saturday, August 7, 2021 @ 6:01:19 AM
w, j d, y @ h:MM:SS AA	//  Sat, Aug 7, 2021 @ 6:01:19 AM
w, j. d, y @ h:MM:SS AA	//  Sat, Aug. 7, 2021 @ 6:01:19 AM
J ddd, y @ h:MM:SS AA	//  August 7th, 2021 @ 6:01:19 AM
J d, y @ h:MM:SS AA		//  August 7, 2021 @ 6:01:19 AM
J d, y					//  August 7, 2021
y-mm-ddTHH:MM:SSZZ		//  2021-08-07T06:01:19-0400
ymmddHHMMSSL			//  20210807060119538
ymmddHHMMSS.L			//  20210807060119.538
'hello' y-m-d			//  hello 2021-8-7

*/

(function (global) {

	var defaultFormat = "W, J d, y @ hh:MM:SS AA";
	var timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g;
	var timezoneClip = /[^-+\dA-Z]/g;
	var flagexp = /"[^"]*"|'[^']*'|y{4}|a{4}|A{4}|a{3}|A{3}|d{3}|([dmyHhMSaAZ])\1?|[dwWmjJyHhMSLaAzZ]/g;
	var dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

	function pad(val, len) {
		val = String(val);
		len = len || 2;
		while (val.length < len) {
			val = "0" + val;
		}
		return val;
	};
	
	var flags = {
		d: function (date) { return date.getDate() },
		dd: function (date) { return pad(date.getDate()) },
		w: function (date) { return dayNames[date.getDay()].slice(0, 3) },
		W: function (date) { return dayNames[date.getDay()] },
		m: function (date) { return date.getMonth() + 1 },
		mm: function (date) { return pad(date.getMonth() + 1) },
		j: function (date) { return monthNames[date.getMonth()].slice(0, 3) },
		J: function (date) { return monthNames[date.getMonth()] },
		y: function (date) { return date.getFullYear() },
		yy: function (date) { return String(date.getFullYear()).slice(2) },
		yyyy: function (date) { return date.getFullYear() },
		H: function (date) { return date.getHours() },
		HH: function (date) { return pad(date.getHours()) },
		h: function (date) { return date.getHours() % 12 || 12 },
		hh: function (date) { return pad(date.getHours() % 12 || 12) },
		M: function (date) { return date.getMinutes() },
		MM: function (date) { return pad(date.getMinutes()) },
		S: function (date) { return date.getSeconds() },
		SS: function (date) { return pad(date.getSeconds()) },
		L: function (date) { return pad(date.getMilliseconds(), 3) },
		a: function (date) { return date.getHours() < 12 ? "a" : "p" },
		aa: function (date) { return date.getHours() < 12 ? "am" : "pm" },
		aaa: function (date) { return date.getHours() < 12 ? "a.m." : "p.m." },
		aaaa: function (date) { return date.getHours() < 12 ? "a.m." : "p.m." },
		A: function (date) { return date.getHours() < 12 ? "A" : "P" },
		AA: function (date) { return date.getHours() < 12 ? "AM" : "PM" },
		AAA: function (date) { return date.getHours() < 12 ? "A.M." : "P.M." },
		AAAA: function (date) { return date.getHours() < 12 ? "A.M." : "P.M." },
		z: function (date) {
			return (String(date).match(timezone) || [""]).pop().replace(timezoneClip, "")
		},
		Z: function (date) {
			var val = date.getTimezoneOffset();
			return (val > 0 ? "-" : "+") + val / 60
		},
		ZZ: function (date) {
			var val = date.getTimezoneOffset();
			return (val > 0 ? "-" : "+") + pad(Math.floor(Math.abs(val) / 60) * 100 + Math.abs(val) % 60, 4)
		},
		ddd: function (date) {
			var d = date.getDate();
			return d + "" + (["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10])
		}

	}

	function getDate(gmt, dt) {
		var now = dt || new Date();
		if (gmt) {
			return new Date(now.getTime() + Number(now.getTimezoneOffset()) * 60000);
		} else {
			return now
		}
	}


	function format(arg1, arg2, arg3) {

		var fmt = null;
		var dt = null;
		var gmt = null;

		var t1 = typeof arg1;
		var t2 = typeof arg2;
		var t3 = typeof arg3;

		if (t1 == 'string') {
			fmt = arg1;
		} else if (t1 == 'object') {
			dt = arg1;
		} else if (t1 == 'boolean') {
			gmt = arg1;
		}

		if (t2 == 'string') {
			fmt = arg2;
		} else if (t2 == 'object') {
			dt = arg2;
		} else if (t2 == 'boolean') {
			gmt = arg2;
		}

		if (t3 == 'string') {
			fmt = arg3;
		} else if (t3 == 'object') {
			dt = arg3;
		} else if (t3 == 'boolean') {
			gmt = arg3;
		}

		if (dt && gmt) {
			dt = getDate(gmt, dt);
		}

		if (!dt) {
			dt = getDate(gmt);
		}

		if (!fmt || fmt == "undefined") {
			fmt = defaultFormat;
		}

		console.log("");
		console.log(fmt + (gmt ? " (gmt)" : "") + "\t" );
		return fmt.replace(flagexp, function (str) {
			// ""+ forces everything to a string.
			return str in flags ? "" + flags[str](dt) : str.slice(1, str.length - 1);
		});
	};

	//var mdt = new Date('2021-01-02 20:04:05.678');
	var myDate = new Date();

    var flagList = [];
    var singleList = [];
    var doubleList = [];
    var tripleList = [];
    var quadList = [];
	for (var prop in flags) {
	    if(prop.length === 1 && singleList.indexOf(prop) < 0){
	        singleList.push(prop);
	    }
	    
	    if(prop.length === 2 && doubleList.indexOf(prop) < 0){
	        doubleList.push(prop.substr(0,1));
	    }
	    
	    if(prop.length === 3 && tripleList.indexOf(prop) < 0){
	        tripleList.push(prop.substr(0,1));
	    }
	    
	    if(prop.length === 4 && quadList.indexOf(prop) < 0){
	        quadList.push(prop.substr(0,1));
	    }
	    
	    flagList.push(prop);
	    
		console.log(format(myDate, prop));
		console.log(format(myDate, prop, true));
	}
	
	// console.log("\n --- all flags ---" );
	// console.log(format(myDate, flagList.join(" \t")));
	
	// console.log("\n --- singleList flags ---" );
	// console.log(singleList.join(""));
	
	// console.log("\n --- doubleList flags ---" );
	// console.log(doubleList.join(""));
	
	// console.log("\n --- tripleList flags ---" );
	// console.log(tripleList.join("{3}|") + "{3}|");
	
	// console.log("\n --- quadList flags ---" );
	// console.log(quadList.join("{4}|") + "{4}|");

	// // No args assumes "now" 
	// console.log("\n --- assume now ---" );
	// console.log(format())

	// // Format
	// console.log(format("y-m-d")) // 2025-4-1

	// // common formats

	// console.log("\n--- common formats ---");
	// console.log(format("y-mm-dd @ HH:MM:SS", myDate)); 	// 	2021-08-07 @ 04:29:09
	// console.log(format("y-mm-dd", myDate)); 			// 	2021-08-07
	// console.log(format("y-m-d", myDate)); 				// 	2021-8-7
	// console.log(format("m/d/y @ HH:MM:SS", myDate));	// 	8/7/2021 @ 04:29:09
	// console.log(format("m/d/y", myDate)); 				// 	8/7/2021
	// console.log(format("h:MM:SS AA", myDate));			// 	4:29:09 AM
	// console.log(format("HH:MM:SS", myDate));			// 	04:29:09
	// console.log(format("H:MM:SS", myDate));				// 	4:29:09
	// console.log(format("W, J d, y @ h:MM:SS AA", myDate));	// 	Thursday, April 1, 2025 @ 3:16:42 AM
	// console.log(format("w, j d, y @ h:MM:SS AA", myDate));	// 	Thu, Apr 1, 2025 @ 3:16:42 AM
	// console.log(format("w, j. d, y @ h:MM:SS AA", myDate));	// 	Thu, Apr. 1, 2025 @ 3:16:42 AM
	// console.log(format("J ddd, y @ h:MM:SS AA", myDate));			// 	August 7th, 2021 @ 4:29:09 AM
	// console.log(format("J d, y @ h:MM:SS AA", myDate));			// 	August 7, 2021 @ 4:29:09 AM
	// console.log(format("J d, y", myDate));						// 	August 7, 2021
	// console.log(format("y-mm-ddTHH:MM:SSZZ", myDate)); 	// 	2021-08-07T04:29:09-0400
	// console.log(format("ymmddHHMMSSL", myDate)); 		// 	20210807042909595
	// console.log(format("ymmddHHMMSS.L", myDate)); 		// 	20210807042909.595
	// console.log(format("'hello' y-m-d", myDate)); 		// 	hello 2021-8-7






	if (typeof define === 'function' && define.amd) {
		define(function () {
			return format;
		});
	} else if (typeof exports === 'object') {
		module.exports = format;
	} else {
		global.DateFormat = format;
	}

	/*
	// For convenience... (un-coment to use)
	Date.prototype.format = function (fmt) {
		return format(this, fmt);
	};
	*/

})(this);









