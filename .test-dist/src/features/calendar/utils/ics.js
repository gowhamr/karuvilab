/**
 * Serializes calendar events to standard iCalendar (.ics) string format.
 */
export function exportToICS(events) {
    const lines = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//KaruviLab//Calendar//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH'
    ];
    events.forEach(evt => {
        const startStr = formatICSDate(new Date(evt.startDate));
        const endStr = formatICSDate(new Date(evt.endDate));
        const nowStr = formatICSDate(new Date(evt.createdAt || Date.now()));
        lines.push('BEGIN:VEVENT');
        lines.push(`UID:${evt.id}`);
        lines.push(`DTSTAMP:${nowStr}`);
        lines.push(`DTSTART:${startStr}`);
        lines.push(`DTEND:${endStr}`);
        lines.push(`SUMMARY:${escapeICSString(evt.title)}`);
        if (evt.description) {
            lines.push(`DESCRIPTION:${escapeICSString(evt.description)}`);
        }
        if (evt.location) {
            lines.push(`LOCATION:${escapeICSString(evt.location)}`);
        }
        if (evt.recurrence && evt.recurrence.type !== 'none') {
            const freq = evt.recurrence.type.toUpperCase();
            let rrule = `RRULE:FREQ=${freq}`;
            if (evt.recurrence.endDate) {
                const untilStr = formatICSDate(new Date(evt.recurrence.endDate));
                rrule += `;UNTIL=${untilStr}`;
            }
            else if (evt.recurrence.count) {
                rrule += `;COUNT=${evt.recurrence.count}`;
            }
            lines.push(rrule);
        }
        lines.push('END:VEVENT');
    });
    lines.push('END:VCALENDAR');
    return lines.join('\r\n');
}
export function parseICS(icsText) {
    const events = [];
    const lines = icsText.split(/\r?\n/);
    let currentEvent = null;
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        if (line === undefined)
            continue;
        // Handle line folding (lines starting with spaces or tabs are continued)
        while (i + 1 < lines.length) {
            const nextLine = lines[i + 1];
            if (nextLine && (nextLine.startsWith(' ') || nextLine.startsWith('\t'))) {
                line += nextLine.substring(1);
                i++;
            }
            else {
                break;
            }
        }
        const firstColon = line.indexOf(':');
        if (firstColon === -1)
            continue;
        const key = line.substring(0, firstColon).trim();
        const val = line.substring(firstColon + 1).trim();
        if (key === 'BEGIN' && val === 'VEVENT') {
            currentEvent = {
                id: Math.random().toString(36).substring(2, 11),
                title: 'Untitled Event',
                startDate: '',
                endDate: '',
                allDay: false,
                color: 'indigo',
            };
        }
        else if (key === 'END' && val === 'VEVENT' && currentEvent) {
            if (currentEvent.startDate && currentEvent.endDate) {
                events.push(currentEvent);
            }
            currentEvent = null;
        }
        else if (currentEvent) {
            if (key.startsWith('DTSTART')) {
                currentEvent.startDate = parseICSDate(val).toISOString();
                if (key.includes('VALUE=DATE')) {
                    currentEvent.allDay = true;
                }
            }
            else if (key.startsWith('DTEND')) {
                currentEvent.endDate = parseICSDate(val).toISOString();
            }
            else if (key === 'SUMMARY') {
                currentEvent.title = unescapeICSString(val);
            }
            else if (key === 'DESCRIPTION') {
                currentEvent.description = unescapeICSString(val);
            }
            else if (key === 'LOCATION') {
                currentEvent.location = unescapeICSString(val);
            }
            else if (key === 'UID') {
                currentEvent.id = val;
            }
            else if (key.startsWith('RRULE')) {
                const parts = val.split(';');
                const rrule = {};
                parts.forEach(part => {
                    const eqIdx = part.indexOf('=');
                    if (eqIdx === -1)
                        return;
                    const pKey = part.substring(0, eqIdx).trim();
                    const pVal = part.substring(eqIdx + 1).trim();
                    if (pKey === 'FREQ') {
                        rrule.type = pVal.toLowerCase(); // daily, weekly, monthly, yearly
                    }
                    else if (pKey === 'UNTIL') {
                        rrule.endDate = parseICSDate(pVal).toISOString();
                    }
                    else if (pKey === 'COUNT') {
                        rrule.count = parseInt(pVal, 10);
                    }
                });
                if (rrule.type) {
                    currentEvent.recurrence = rrule;
                }
            }
        }
    }
    return events;
}
function formatICSDate(date) {
    const pad = (n) => n.toString().padStart(2, '0');
    return `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`;
}
function parseICSDate(val) {
    const clean = val.replace(/[^0-9T]/g, '');
    const year = parseInt(clean.substring(0, 4), 10);
    const month = parseInt(clean.substring(4, 6), 10) - 1;
    const day = parseInt(clean.substring(6, 8), 10);
    if (clean.includes('T')) {
        const hour = parseInt(clean.substring(9, 11), 10);
        const min = parseInt(clean.substring(11, 13), 10);
        const sec = parseInt(clean.substring(13, 15), 10);
        if (val.endsWith('Z')) {
            return new Date(Date.UTC(year, month, day, hour, min, sec));
        }
        return new Date(year, month, day, hour, min, sec);
    }
    return new Date(year, month, day);
}
function escapeICSString(str) {
    return str.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}
function unescapeICSString(str) {
    return str.replace(/\\n/g, '\n').replace(/\\,/g, ',').replace(/\\;/g, ';').replace(/\\\\/g, '\\');
}
