/*
DateFormat 1.0
(c) 2017 Mike Gieson (www.gieson.com)
MIT license

Simplified from:
Steven Levithan <stevenlevithan.com>
http://blog.stevenlevithan.com/archives/date-time-format

Includes enhancements by Scott Trenda <scott.trenda.net>
and Kris Kowal <cixar.com/~kris.kowal/>


--------------------------
Usage
--------------------------

// arguments can appear in any order (we'll sort them out for you)
DateFormat([date, format, gmt]);


// No args assumes "now" 
console.log( DateFormat() )				// Saturday, March 4, 2017 @ 6:08:09 AM"

// Format
console.log( DateFormat("Y-m-d") ) // 2025-4-1

// Include a date
var myDate = new Date(2025, 3, 1); // (months are zero-based) jan = 0
console.log( DateFormat("Y-m-d", myDate) ) // 2025-4-1

// Common formats
console.log( DateFormat("date") )	// 3/4/17
console.log( DateFormat("time") )	// 6:08

// Use GMT
console.log( DateFormat("time", true) ) // 2025-4-1 (converts to GMT)

// As GMT
console.log( DateFormat("date", true) ) // 2025-4-1

// With format, date and GMT
console.log( DateFormat(new Date(2025, 3, 1), "date", true) ) // 2025-4-1

-------------------
Common Formats 
-------------------
default		January 2, 2021 @ 8:04:05 PM
date		1/2/21
time		20:04:05
short		1/2/21 @ 20:04:05
longDate	January 2, 2021
longTime	08:04:05 PM
long		January 2, 2021 @ 8:04:05 PM
isoDate		2021-01-02
isoTime		20:04:05
iso			2021-01-02T20:04:05-0500
stamp		20210102200405678

example:
	console.log( DateFormat("short") ); // 1/2/21 @ 20:04:05

-------------------
Format Flags
-------------------
You can include any character not listed below for seperators, or additional text output
Example:
	DateFormat("y-m-d"); // adding "-" between flags

D 		Day of the month
DD 		Day of the month - padded
DDD 	Day of the month - with ordinal suffix (1st, 2nd, 3rd, 4th ...)
ddd 	Day of the week - short name (Sun, Mon, Tues...)
dddd	Day of the week - full name (Sunday, Monday, Tuesday...)
w 		Week Number (1-52)
W 		Week Number padded (01-52)
M 		Month (1-12)
MM 		Month - padded (01-12)
MMM 	Month - short name (Jan, Feb, Mar...)
MMMM 	Month - full name (January, Feburary, March...)
j 		(same as MMM) If you think Julian calendar
J 		(same as MMMM) If you think Julian calendar
y 		Year (21) (short 2 digit padded) (same as y, yy, YY)
yy 		Year (21) (short 2 digit padded) (same as y, yy, YY)
YY 		Year (2021) (short 2 digit padded) (same as y, yy, YY)
Y 		Year (2021) (same as YYYY)
YYYY 	Year (2021) (same as Y)
H 		Hours (24-hour clock)
HH 		Hours (24-hour clock) - padded
h 		Hours (12-hour clock) 
hh 		Hours (12-hour clock) - padded
m 		Minutes (0-59)
mm 		Minutes - padded (01-59)
s 		Seconds (0-59)
ss 		Seconds - padded (01-59)
l		Milliseconds - 3 digits (XXX)
L		Milliseconds - 3 digits prefixed with a dot (.XXX)
a 		AM / PM - lowercase - single-character (a or p)
aa 		AM / PM - lowercase - two-character (am or pm)
aaa 	AM / PM - lowercase - two-character with dots (a.m. or p.m.)
A 		AM / PM - uppercase, single-character (A or P)
AA 		AM / PM - lowercase - two-character (AM or PM)
AAA 	AM / PM - lowercase - two-character with dots (A.M. or P.M.)
z 		US timezone abbreviation, e.g. EST or MDT. For non-US timezones GMT/UTC returned,  e.g. GMT-0500
Z 		GMT/UTC timezone offset, e.g. -5 or +2.5
ZZ 		GMT/UTC timezone offset, e.g. -0500 or +0230
o 		Date's ordinal suffix (st, nd, rd, or th)
'foo' or "foo" 	Literal character sequence. Surrounding quotes are removed. 
			- Prevents words containing known entities from being parsed.
			- Any character outside the known entities is printed literally, e.g. colons are printed normally: hh:MM:ss

*/

(function (global) {
	
	// ---------------------
	// flagexp breakdown
	// ---------------------
	//  ([MHhSAaZ])\1?
	// 		Gets single + next character, if next character is identical, e.g. d dd
	//		- generally used for padded things like hours and minutes
	//		- except for yy yyyy, which is special
	//		- and AM/PM
	// 	d{1,4}
	//		Gets d or dd or ddd or dddd
	//
	// 	[LloGgZWYwJjz]
	// 		Gets exact single character, e.g. w
	//
	// 	"[^"]*"
	//		Gets double-quoted chars, e.g. "this"
	//
	// 	'[^']*'
	//		Gets single quoted chars, e.g. 'this'
	//
	var timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g;
	var timezoneClip = /[^-+\dA-Z]/g;
	function pad (val, len) {
		val = String(val);
		len = len || 2;
		while (val.length < len) {
			val = "0" + val;
		}
		return val;
	};
	var	flagexp = /"[^"]*"|'[^']*'|d{4}|d{3}|Y{4}|M{4}|M{3}|a{4}|a{3}|A{4}|A{3}|D{3}|([DMYHhmsaAZwyd])\1?|[DwMjJYHhmslaAzZoyLd]/g;
	var dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

	var common = [
		["default" 		, "dddd, J D, Y @ h:mm:ss AA"],	// 	Thursday, April 1, 2025 @ 3:16:42 AM

		["date" 	    , "M/D/YY"], 			// 	4/1/25
		["time" 		, "HH:mm:ss"], 			// 	03:16:42
		["short"        , "M/D/YY @ HH:mm:ss"], 	// 	4/1/25 @ 03:16:42

		["longDate" 	, "J D, Y"], 			// 	April 1, 2025
		["longTime" 	, "hh:mm:ss AA"], 		// 	03:16:42 AM
		["long" 	    , "J D, Y @ h:mm:ss AA"], 	// 	April 1, 2025 @ 3:16:42 AM

		["isoDate" 		, "Y-MM-DD"], 			// 	2025-04-01
		["isoTime" 		, "H:mm:ss"], 			// 	3:16:42
		["iso" 	        , "Y-MM-DDTHH:mm:ssZZ"], 	// 	2025-04-01T03:16:42-0500

		["stamp" 		, "YYYYMMDDHHmmssl"], 		// 	20250401031642001
	]

	var flags = {
		d 	: function(date){ return date.getDate() },
		D 	: function(date){ return date.getDate() },
		DD 	: function(date){ return pad(date.getDate()) },
		dd 	: function(date){ return pad(date.getDate()) },
		ddd : function(date){ return dayNames[ date.getDay() ].slice(0, 3) },
		dddd: function(date){ return dayNames[ date.getDay() ] },
		w 	: function(date){ return getWeekNumber(date) },
		ww 	: function(date){ return pad(getWeekNumber(date)) },
		M 	: function(date){ return date.getMonth() + 1 },
		MM 	: function(date){ return pad(date.getMonth() + 1) },
		MMM : function(date){ return monthNames[ date.getMonth() ].slice(0, 3) },
		MMMM: function(date){ return monthNames[ date.getMonth() ] },
		j 	: function(date){ return monthNames[ date.getMonth() ].slice(0, 3) },
		J	: function(date){ return monthNames[ date.getMonth() ] },
		y 	: function(date){ return String( date.getFullYear() ).slice(2) },
		yy 	: function(date){ return String( date.getFullYear() ).slice(2) },
		YY 	: function(date){ return String( date.getFullYear() ).slice(2) },
		Y 	: function(date){ return date.getFullYear() },
		YYYY: function(date){ return date.getFullYear() },
		H 	: function(date){ return date.getHours() },
		HH 	: function(date){ return pad( date.getHours() ) },
		h 	: function(date){ return date.getHours() % 12 || 12 },
		hh 	: function(date){ return pad(date.getHours() % 12 || 12) },
		m 	: function(date){ return date.getMinutes() },
		mm 	: function(date){ return pad( date.getMinutes() ) },
		s 	: function(date){ return date.getSeconds() },
		ss 	: function(date){ return pad( date.getSeconds() ) },
		l 	: function(date){ return pad( date.getMilliseconds() , 3) },
		L 	: function(date){ return "." + pad( date.getMilliseconds() , 3) },
		a 	: function(date){ return date.getHours() < 12 ? "a"  : "p" },
		aa 	: function(date){ return date.getHours() < 12 ? "am" : "pm" },
		aaa : function(date){ return date.getHours() < 12 ? "a.m." : "p.m." },
		aaaa : function(date){ return date.getHours() < 12 ? "a.m." : "p.m." },
		A 	: function(date){ return date.getHours() < 12 ? "A"  : "P" },
		AA 	: function(date){ return date.getHours() < 12 ? "AM" : "PM" },
		AAA : function(date){ return date.getHours() < 12 ? "A.M." : "P.M." },
		AAAA : function(date){ return date.getHours() < 12 ? "A.M." : "P.M." },
		z	: function(date){ 
					return (String(date).match(timezone) || [""]).pop().replace(timezoneClip, "")
				},
		Z 	: function(date){ 
					var val = date.getTimezoneOffset();
					return (val > 0 ? "-" : "+") + val/60 
				},
		ZZ 	: function(date){ 
					var val = date.getTimezoneOffset();
					return (val > 0 ? "-" : "+") + pad(Math.floor(Math.abs(val) / 60) * 100 + Math.abs(val) % 60, 4) 
				},
		DDD : function(date){ 
					var d = date.getDate();
					return d + "" + (["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10])
				}
		
	}
	
	function getWeekNumber(d) {
        let onejan = new Date(d.getFullYear(), 0, 1);
        return Math.ceil((((d.getTime() - onejan.getTime()) / 86400000) + onejan.getDay() + 1) / 7);
    }

    function getDate(gmt, dt){
        var now = dt || new Date();
        if(gmt){
            return new Date(now.getTime() + Number(now.getTimezoneOffset()) * 60000);
        } else {
            return now
        }
        
        // var date = new Date(); 
        // if(gmt){
        //     var now_utc =  Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
        //      date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
            
        //      return new Date(now_utc);
        // } else {
        //     return date
        // }
       
    }

	
	function DateFormat (arg1, arg2, arg3) {
	    
	    var fmt = null;
	    var dt = null;
	    var gmt = null;
	    
	    var t1 = typeof arg1;
	    var t2 = typeof arg2;
	    var t3 = typeof arg3;
	    
	    if(t1 == 'string'){
	        fmt = arg1;
	    } else if (t1 == 'object'){
	        dt = arg1;
	    } else if (t1 == 'boolean'){
	        gmt = arg1;
	    }
	
	    if(t2 == 'string'){
	        fmt = arg2;
	    } else if (t2 == 'object'){
	        dt = arg2;
	    } else if (t2 == 'boolean'){
	        gmt = arg2;
	    }
	    
	    if(t3 == 'string'){
	        fmt = arg3;
	    } else if (t3 == 'object'){
	        dt = arg3;
	    } else if (t3 == 'boolean'){
	        gmt = arg3;
	    }
	    
	    if(dt && gmt){
	        dt = getDate(gmt, dt);   
	    }
	    
        if( ! dt ){
            dt = getDate(gmt);
        }
		
		if( ! fmt ){
			fmt = common[0][1];
		}
		
		// Using common format?
		for(var i=0; i<common.length; i++){
		    var item = common[i];
			if(fmt == item[0]){
				fmt = item[1];
				break;
			}
		}
		
		
		return fmt.replace(flagexp, function (str) {
			// ""+ forces everything to a string.
			return str in flags ? "" + flags[str](dt) : str.slice(1, str.length - 1);
		});
	};
	
// 	var mdt = new Date('2021-01-02 20:04:05.678');
	
// // 	"default" 		: "W, J d, Y @ h:mm:ss AA",	// 	Thursday, April 1, 2025 @ 3:16:42 AM

// // 		"date" 	        : "M/D/YY", 			// 	4/1/25
// // 		"time" 			: "HH:mm:ss", 			// 	03:16:42
// // 		"short"         : "M/D/YY @ HH:mm:ss", 	// 	4/1/25 @ 03:16:42

// // 		"longDate" 		: "J D, Y", 			// 	April 1, 2025
// // 		"longTime" 		: "hh:mm:ss AA", 		// 	03:16:42 AM
// // 		"long" 	        : "J D, Y @ h:mm:ss AA", 	// 	April 1, 2025 @ 3:16:42 AM

// // 		"iso" 	        : "Y-MM-DDTHH:mm:ssZZ", 	// 	2025-04-01T03:16:42-0500
// // 		"isoDate" 		: "Y-MM-DD", 			// 	2025-04-01
// // 		"isoTime" 		: "H:mm:ss", 			// 	3:16:42

// // 		"stamp" 		: "YYYYMMDDHHmmssl", 		// 	20250401031642001
	
// 	for(var i=0; i<common.length; i++){
// 	    var item = common[i];
// 	    console.log(item[0], DateFormat(mdt, item[0]) );
// 	}
	
// 	for(var prop in flags){
// 	  console.log(prop, DateFormat(mdt, prop), DateFormat(mdt, prop, true) );  
// 	}
	
// 	// No args assumes "now" 
// console.log( DateFormat() )				// Saturday, March 4, 2017 @ 6:08:09 AM"

// // Format
// console.log( DateFormat("Y-m-d") ) // 2025-4-1

// // Include a date
// var myDate = new Date(2025, 3, 1); // (months are zero-based) jan = 0
// console.log( DateFormat("Y-m-d", myDate) ) // 2025-4-1

// // Common formats
// console.log( DateFormat("date") )	// 3/4/17
// console.log( DateFormat("time") )	// 6:08

// // Use GMT
// console.log( DateFormat("time", true) )	// 6:08

// // As GMT
// console.log( DateFormat("date", true) ) // 2025-4-1

// // With format, date and GMT
// console.log( DateFormat(new Date(2025, 3, 1), "date", true) ) // 2025-4-1





	if (typeof define === 'function' && define.amd) {
		define(function () {
			return DateFormat;
		});
	} else if (typeof exports === 'object') {
		module.exports = DateFormat;
	} else {
		global.DateFormat = DateFormat;
	}

/*
// For convenience... (un-coment to use)
Date.prototype.format = function (fmt) {
	return DateFormat(this, fmt);
};
*/
	
})(this);









