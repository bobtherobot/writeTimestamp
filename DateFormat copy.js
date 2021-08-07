/*
DateFormat 1.0
(c) 2017 Mike Gieson (www.gieson.com)
MIT license


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

// GMT
console.log( DateFormat("HH", true) ) 	// 7 (GMT offset applied)
console.log( DateFormat("HH") ) 		// 12 (local hour)

// With format, date and GMT
console.log( DateFormat(new Date(2025, 3, 1), "Y-m-d", true) ) // 2025-4-1

// With custom string
console.log( DateFormat('"hello double quotes" Y-m-d') ) // hello there 2025-4-1
console.log( DateFormat("'hello single quotes' Y-m-d") ) // hello there 2025-4-1
console.log( DateFormat('"internal s\'ingle quotes" Y-m-d') ) // hello there 2025-4-1
console.log( DateFormat("'internal d\"ouble quotes' Y-m-d") ) // hello there 2025-4-1

-------------------
Format Flags
-------------------
You can include any character not listed below for seperators, or additional text output
Example:
	DateFormat("y-m-d"); // adding "-" between flags

d 		Day of the month
dd 		Day of the month - padded
ddd 	Day of the month - with ordinal suffix (1st, 2nd, 3rd, 4th ...)
D 		Week day - short name (Sun, Mon, Tues...)
DD		Week day - full name (Sunday, Monday, Tuesday...)
w 		Week Number (1-52)
ww 		Week Number padded (01-52)
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


-------------------
Common Formats 
-------------------
dddd, J d, y @ h:MM:SS AA	Friday, August 6, 2021 @ 8:18:42 PM
J d, y						August 6, 2021
m/d/y						8/6/2021
y-m-d						2021-8-6
y-mm-dd						2021-08-06
H:MM:SS						5:16:42
HH:MM:SS					05:16:42
HH:MM:SS					17:16:42 	(military time)
h:MM:SS AA					5:16:42 PM  (civilian time)
m/d/y @ HH:MM:SS			8/6/2021 @ 20:18:42
J d, y @ h:MM:SS AA			August 6, 2021 @ 8:18:42 PM
y-mm-ddTHH:MM:SSZZ			2021-08-06T20:18:42-0400
ymmddHHMMSSl				20210806201842354
ymmddHHMMSSL				20210806201842.354
'hello' y-m-d				hello 2021-8-6

*/

(function (global) {
	
	// ---------------------
	// flagexp breakdown
	// ---------------------
	//
	// 	"[^"]*"
	//		Gets double-quoted chars, e.g. "this"
	//
	// 	'[^']*'
	//		Gets single quoted chars, e.g. 'this'
	//
	//  ([DMYHhmsaAZwyd])\1?
	// 		Gets only 2 dientical chars, e.g. dd
	// 	d{4}
	//		Gets only 4 d's, e.g. dddd
	//
	// 	[DwMjJYHhmslaAzZoyLd]
	// 		Gets a single character, e.g. d
	//
	var defaultFormat = "W, J d, Y @ h:mm:ss AA";
	var timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g;
	var timezoneClip = /[^-+\dA-Z]/g;
	var	flagexp = /"[^"]*"|'[^']*'|d{4}|d{3}|Y{4}|M{4}|M{3}|a{4}|a{3}|A{4}|A{3}|D{3}|([DMYHhmSaAZwyd])\1?|[DwMjJYHhmSlaAzZoyLd]/g;
	var dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

	function pad (val, len) {
		val = String(val);
		len = len || 2;
		while (val.length < len) {
			val = "0" + val;
		}
		return val;
	};
	var flags = {
		d 	: function(date){ return date.getDate() },
		dd 	: function(date){ return pad(date.getDate()) },
		ddd : function(date){ return dayNames[ date.getDay() ].slice(0, 3) },
		dddd: function(date){ return dayNames[ date.getDay() ] },
		w 	: function(date){ return getWeekNumber(date) },
		ww 	: function(date){ return pad(getWeekNumber(date)) },
		m 	: function(date){ return date.getMonth() + 1 },
		mm 	: function(date){ return pad(date.getMonth() + 1) },
		mmm : function(date){ return monthNames[ date.getMonth() ].slice(0, 3) },
		mmmm: function(date){ return monthNames[ date.getMonth() ] },
		j 	: function(date){ return monthNames[ date.getMonth() ].slice(0, 3) },
		J	: function(date){ return monthNames[ date.getMonth() ] },
		y 	: function(date){ return date.getFullYear() },
		yy 	: function(date){ return String( date.getFullYear() ).slice(2) },
		yyyy: function(date){ return date.getFullYear() },
		H 	: function(date){ return date.getHours() },
		HH 	: function(date){ return pad( date.getHours() ) },
		h 	: function(date){ return date.getHours() % 12 || 12 },
		hh 	: function(date){ return pad(date.getHours() % 12 || 12) },
		M 	: function(date){ return date.getMinutes() },
		MM 	: function(date){ return pad( date.getMinutes() ) },
		S 	: function(date){ return date.getSeconds() },
		SS 	: function(date){ return pad( date.getSeconds() ) },
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
		D : function(date){ 
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
    }

	
	function format (arg1, arg2, arg3) {
	    
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
	
		if( ! fmt || fmt == "undefined"){
			fmt = defaultFormat;
		}
		console.log("fmt", fmt);
		return fmt.replace(flagexp, function (str) {
			// ""+ forces everything to a string.
			return str in flags ? "" + flags[str](dt) : str.slice(1, str.length - 1);
		});
	};
	
// 	var mdt = new Date('2021-01-02 20:04:05.678');

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









