
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

#### Additional Examples:

    writeTimestamp.format : "my timestamp" y-m-d   prints: my timestamp 2025-04-01
    writeTimestamp.format : // y-m-d               prints: // 2025-04-01)
    writeTimestamp.format : J D, Y @ h:mm:ss AA    prints: Thursday, April 1, 2025 @ 3:16:42 AM
	writeTimestamp.format : M/D/YY                 prints: 4/1/25
	writeTimestamp.format : HH:mm:ss               prints: 03:16:42
	writeTimestamp.format : M/D/YY @ HH:mm:ss      prints: 4/1/25 @ 03:16:42
	writeTimestamp.format : J D, Y                 prints: April 1, 2025
	writeTimestamp.format : hh:mm:ss AA            prints: 03:16:42 AM
	writeTimestamp.format : J D, Y @ h:mm:ss AA    prints: pril 1, 2025 @ 3:16:42 AM
    writeTimestamp.format : Y-MM-DD                prints: 2025-04-01
	writeTimestamp.format : H:mm:ss                prints: 3:16:42
	writeTimestamp.format : Y-MM-DDTHH:mm:ssZZ     prints: 2025-04-01T03:16:42-0500
    writeTimestamp.format : YYYYMMDDHHmmssl        prints: 20250401031642001

### Common "words"

Rather that manually specifying individual parts, you can set the "format" option to one of the following words for common timestamp formats

    default   prints: January 2, 2021 @ 8:04:05 PM
    date      prints: 1/2/21
    time      prints: 20:04:05
    short     prints: 1/2/21 @ 20:04:05
    longDate  prints: January 2, 2021
    longTime  prints: 08:04:05 PM
    long      prints: January 2, 2021 @ 8:04:05 PM
    isoDate   prints: 2021-01-02
    isoTime   prints: 20:04:05
    iso       prints: 2021-01-02T20:04:05-0500
    stamp     prints: 20210102200405678

Example:

    writeTimestamp.format : "short"


## Features

Describe specific features of your extension including screenshots of your extension in action. Image paths are relative to this README file.

For example if there is an image subfolder under your extension project workspace:

\!\[feature X\]\(images/feature-x.png\)

> Tip: Many popular extensions utilize animations. This is an excellent way to show off your extension! We recommend short, focused animations that are easy to follow.

## Extension Settings

This extension contributes the following settings:

* `writeTimestampString.format`: Enter flags or common word. When not set, will use default common word "short".
* `writeTimestampString.gmt`: check to print GMT (UTC) time (not your local time, will be offset to match GMT)

## Defaults

Keyboard shortcut (search `writeTimestamp` in CODE > Preferences > Keyboard Shortcuts):
- PC: `ctrl-shift-t`
- MAC: `cmd-shift-t`

Settings (search `Write Timestamp` in CODE > Preferences > Settings):
- Format : `short`
- GMT : `false`


## Known Issues

none yet

## Release Notes


### 1.0.0

Initial release

