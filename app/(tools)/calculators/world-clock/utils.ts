export const formatterCache = new Map<string, Intl.DateTimeFormat>();

export function getCachedFormatter(tz: string, options: Intl.DateTimeFormatOptions) {
  const key = `${tz}-${JSON.stringify(options)}`;
  let formatter = formatterCache.get(key);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat("en-US", { ...options, timeZone: tz });
    formatterCache.set(key, formatter);
  }
  return formatter;
}

export function getTimeInZone(tz: string, now: Date, hourFormat: 12 | 24, localTz: string) {
  try {
    // ALWAYS use h23 (0-23) internally so we can accurately calculate AM/PM, Night/Day, and relative offsets without formatting bugs
    const timeParts = getCachedFormatter(tz, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    }).formatToParts(now);
    
    const dateParts = getCachedFormatter(tz, {
      weekday: "short",
      month: "short",
      day: "numeric",
    }).formatToParts(now);

    const h = parseInt(timeParts.find((p) => p.type === "hour")?.value ?? "0", 10);
    const m = parseInt(timeParts.find((p) => p.type === "minute")?.value ?? "0", 10);
    const s = parseInt(timeParts.find((p) => p.type === "second")?.value ?? "0", 10);
    
    const wday = dateParts.find((p) => p.type === "weekday")?.value ?? "";
    const month = dateParts.find((p) => p.type === "month")?.value ?? "";
    const day = dateParts.find((p) => p.type === "day")?.value ?? "";

    const ampm = h >= 12 ? "PM" : "AM";
    const hour12 = h % 12 === 0 ? 12 : h % 12;

    const fullDateTimeOptions: Intl.DateTimeFormatOptions = { 
      year: 'numeric', month: 'numeric', day: 'numeric', 
      hour: 'numeric', minute: 'numeric', second: 'numeric', 
      hour12: false 
    };
    
    const nowLocal = new Date(getCachedFormatter(tz, fullDateTimeOptions).format(now));
    const nowUtc = new Date(getCachedFormatter("UTC", fullDateTimeOptions).format(now));
    const diffMs = nowLocal.getTime() - nowUtc.getTime();
    
    const diffH = Math.floor(Math.abs(diffMs) / 3600000);
    const diffM = Math.floor((Math.abs(diffMs) % 3600000) / 60000);
    const sign = diffMs >= 0 ? "+" : "-";
    const offset = `UTC${sign}${String(diffH).padStart(2, "0")}:${String(diffM).padStart(2, "0")}`;

    // Relative to Local
    const baseLocal = new Date(getCachedFormatter(localTz, fullDateTimeOptions).format(now)).getTime();
    const relativeMs = nowLocal.getTime() - baseLocal;
    const relDiffH = Math.round(relativeMs / 3600000);
    let relativeText = "Same time";
    if (relDiffH > 0) relativeText = `${relDiffH}h ahead`;
    if (relDiffH < 0) relativeText = `${Math.abs(relDiffH)}h behind`;

    const isNight = h >= 18 || h < 6;

    return {
      hours: h,
      minutes: m,
      seconds: s,
      displayTime: `${String(hourFormat === 12 ? hour12 : h).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
      displaySeconds: String(s).padStart(2, "0"),
      date: `${wday}, ${month} ${day}`,
      offset,
      ampm,
      relativeText,
      isNight
    };
  } catch {
    return { hours: 0, minutes: 0, seconds: 0, displayTime: "--:--", displaySeconds: "--", date: "Invalid TZ", offset: "UTC+0", ampm: "AM", relativeText: "", isNight: false };
  }
}

export function getBusinessStatus(tz: string, now: Date) {
  try {
    const parts = getCachedFormatter(tz, { hour: "numeric", minute: "numeric", weekday: "short", hour12: false }).formatToParts(now);
    const hour = parseInt(parts.find((p) => p.type === "hour")?.value ?? "0");
    const minute = parseInt(parts.find((p) => p.type === "minute")?.value ?? "0");
    const weekday = parts.find((p) => p.type === "weekday")?.value ?? "";
    
    const isWeekend = ["Sat", "Sun"].includes(weekday);
    const isOpen = !isWeekend && hour >= 9 && hour < 18;
    
    let text = "";
    let progress = 0;

    if (isOpen) {
      const minutesLeft = (18 * 60) - ((hour * 60) + minute);
      const totalBizMinutes = 9 * 60;
      progress = ((totalBizMinutes - minutesLeft) / totalBizMinutes) * 100;
      
      const hLeft = Math.floor(minutesLeft / 60);
      const mLeft = minutesLeft % 60;
      text = hLeft > 0 ? `Closes in ${hLeft}h ${mLeft}m` : `Closes in ${mLeft}m`;
    } else {
      progress = 0;
      if (isWeekend || hour >= 18) {
        text = "Opens Mon 9 AM";
      } else {
        const minutesLeft = (9 * 60) - ((hour * 60) + minute);
        const hLeft = Math.floor(minutesLeft / 60);
        const mLeft = minutesLeft % 60;
        text = hLeft > 0 ? `Opens in ${hLeft}h ${mLeft}m` : `Opens in ${mLeft}m`;
      }
    }

    return { isOpen, text, progress };
  } catch {
    return { isOpen: false, text: "", progress: 0 };
  }
}
