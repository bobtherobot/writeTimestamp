
## Format options:

    D       Day of the month
    DD      Day of the month - padded
    DDD     Day of the month - with ordinal suffix (1st, 2nd, 3rd, 4th ...)
    ddd     Day of the week - short name (Sun, Mon, Tues...)
    dddd    Day of the week - full name (Sunday, Monday, Tuesday...)
    w       Week Number (1-52)
    W       Week Number padded (01-52)
    M       Month (1-12)
    MM      Month - padded (01-12)
    MMM     Month - short name (Jan, Feb, Mar...)
    MMMM    Month - full name (January, Feburary, March...)
    j       (same as MMM) If you think Julian calendar
    J       (same as MMMM) If you think Julian calendar
    y       Year (21) (short 2 digit padded) (same as y, yy, YY)
    yy      Year (21) (short 2 digit padded) (same as y, yy, YY)
    YY      Year (2021) (short 2 digit padded) (same as y, yy, YY)
    Y       Year (2021) (same as YYYY)
    YYYY    Year (2021) (same as Y)
    H       Hours (24-hour clock)
    HH      Hours (24-hour clock) - padded
    h       Hours (12-hour clock) 
    hh      Hours (12-hour clock) - padded
    m       Minutes (0-59)
    mm      Minutes - padded (01-59)
    s       Seconds (0-59)
    ss      Seconds - padded (01-59)
    l       Milliseconds - 3 digits (XXX)
    L       Milliseconds - 3 digits prefixed with a dot (.XXX)
    a       AM / PM - lowercase - single-character (a or p)
    aa      AM / PM - lowercase - two-character (am or pm)
    aaa     AM / PM - lowercase - two-character with dots (a.m. or p.m.)
    A       AM / PM - uppercase, single-character (A or P)
    AA      AM / PM - lowercase - two-character (AM or PM)
    AAA     AM / PM - lowercase - two-character with dots (A.M. or P.M.)
    z       US timezone abbreviation, e.g. EST or MDT. For non-US timezones GMT/UTC returned,  e.g. GMT-0500
    Z       GMT/UTC timezone offset, e.g. -5 or +2.5
    ZZ      GMT/UTC timezone offset, e.g. -0500 or +0230
    o       Date's ordinal suffix (st, nd, rd, or th)

> Tip: __Include characters not listed__ above in your format. Example: `// y-m-d` prefixes with comment "//" and adds "-" between flags

> Tip: __Include any additional words__ in your format, just surround with quotes (use single or double qutes). Example: `"shmoo" y-m-d` prefix the word "shmoo", which prevents the flags "s", "m" "h" and "o" from being evaluated, because "shmoo" was wrapped with quotes.

Quotes:
- Prevents words containing known entities from being parsed.
- Any character outside the known entities is printed literally, e.g. colons are printed normally: hh:MM:ss

#### Common Formats:

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


## Features

- Customizable Keyboard shortcut
- Customizable time format
- Include non-time strings in format e.g. "hello" y-m-d

## Extension Settings

This extension contributes the following settings:

* `writeTimestampString.format`: Enter flags or common word. When not set (empty), will use the default format dddd, J d, y @ h:MM:SS AA.
* `writeTimestampString.gmt`: check to print GMT (UTC) time (not your local time, will be offset to match GMT)

## Defaults

Keyboard shortcut (search `writeTimestamp` in CODE > Preferences > Keyboard Shortcuts):
- PC: `ctrl-shift-t`
- MAC: `cmd-shift-t`

Settings (search `Write Timestamp` in CODE > Preferences > Settings):
- Format : `y-m-d HH:MM:SS`
- GMT : `false`


## Known Issues

none yet

## Release Notes


### 1.0.0

Initial release

