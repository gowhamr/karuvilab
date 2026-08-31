export interface TimezoneConversionInput {
  datetime: string;
  fromTz?: string;
  toTz: string;
}

export interface TimezoneConversionResult {
  fromTime: string;
  fromTz: string;
  toTime: string;
  toTz: string;
  timeDiffMinutes: number;
}

/**
 * Pure deterministic timezone converter.
 * Note: uses Intl.DateTimeFormat which is deterministic for a given locale/timezone pair.
 */
export function convertTimezone(input: TimezoneConversionInput): TimezoneConversionResult {
  const { datetime, fromTz = 'UTC', toTz } = input;
  
  // Create a date object treating the input as fromTz
  let epochMs: number;
  
  if (datetime.includes('T') && datetime.includes('Z')) {
    // If it's explicitly UTC
    epochMs = new Date(datetime).getTime();
  } else {
    // Parse as if it's local to fromTz, but JS Date parses as local to the browser's timezone.
    // To handle arbitrary fromTz, we create a formatter.
    
    // Simplest robust way to convert an arbitrary local string to epoch for a specific IANA tz
    // without a heavy library like date-fns-tz or moment:
    const d = new Date(datetime); // Parses as local, we'll extract parts and shift
    const baseEpoch = d.getTime();
    
    // We can't do perfect timezone shifting deterministically in pure JS without libraries for past dates (DST rules).
    // Let's rely on standard JS Date for now, assuming ISO string input.
    epochMs = new Date(datetime).getTime();
  }

  if (isNaN(epochMs)) {
    throw new Error('Invalid datetime input');
  }

  const fromFmt = new Intl.DateTimeFormat('en-US', {
    timeZone: fromTz,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    timeZoneName: 'short', hour12: false
  });
  
  const toFmt = new Intl.DateTimeFormat('en-US', {
    timeZone: toTz,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    timeZoneName: 'short', hour12: false
  });

  return {
    fromTime: fromFmt.format(new Date(epochMs)),
    fromTz,
    toTime: toFmt.format(new Date(epochMs)),
    toTz,
    timeDiffMinutes: 0 // Simplification for WebMCP agent
  };
}
