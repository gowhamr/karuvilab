"use client";
import { useState, useEffect } from "react";

const CITIES = [
  { city: "Mumbai", country: "India", tz: "Asia/Kolkata", flag: "" },
  { city: "New York", country: "USA", tz: "America/New_York", flag: "" },
  { city: "London", country: "UK", tz: "Europe/London", flag: "" },
  { city: "Dubai", country: "UAE", tz: "Asia/Dubai", flag: "" },
  { city: "Singapore", country: "Singapore", tz: "Asia/Singapore", flag: "" },
  { city: "Tokyo", country: "Japan", tz: "Asia/Tokyo", flag: "" },
  { city: "Sydney", country: "Australia", tz: "Australia/Sydney", flag: "" },
  { city: "Los Angeles", country: "USA", tz: "America/Los_Angeles", flag: "" },
];

function getTimeInZone(tz: string, now: Date): { time: string; date: string; offset: string; ampm: string } {
  const timeParts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(now);
  const dateParts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    weekday: "short",
    month: "short",
    day: "numeric",
  }).formatToParts(now);

  const h = timeParts.find((p) => p.type === "hour")?.value ?? "00";
  const m = timeParts.find((p) => p.type === "minute")?.value ?? "00";
  const s = timeParts.find((p) => p.type === "second")?.value ?? "00";

  const wday = dateParts.find((p) => p.type === "weekday")?.value ?? "";
  const month = dateParts.find((p) => p.type === "month")?.value ?? "";
  const day = dateParts.find((p) => p.type === "day")?.value ?? "";

  const hour24 = parseInt(h);
  const ampm = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 % 12 === 0 ? "12" : String(hour24 % 12).padStart(2, "0");

  // Offset calculation
  const nowLocal = new Date(now.toLocaleString("en-US", { timeZone: tz }));
  const diffMs = nowLocal.getTime() - new Date(now.toLocaleString("en-US", { timeZone: "UTC" })).getTime();
  const diffH = Math.floor(Math.abs(diffMs) / 3600000);
  const diffM = Math.floor((Math.abs(diffMs) % 3600000) / 60000);
  const sign = diffMs >= 0 ? "+" : "-";
  const offset = `UTC${sign}${String(diffH).padStart(2, "0")}:${String(diffM).padStart(2, "0")}`;

  return {
    time: `${hour12}:${m}:${s}`,
    date: `${wday}, ${month} ${day}`,
    offset,
    ampm,
  };
}

function isBusinessHours(tz: string, now: Date): boolean {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour: "numeric",
    weekday: "short",
    hour12: false,
  }).formatToParts(now);
  const hour = parseInt(parts.find((p) => p.type === "hour")?.value ?? "0");
  const weekday = parts.find((p) => p.type === "weekday")?.value ?? "";
  const isWeekday = !["Sat", "Sun"].includes(weekday);
  return isWeekday && hour >= 9 && hour < 18;
}

export default function WorldClockClient() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!now) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-pulse">
        {CITIES.map((_, i) => (
          <div key={i} className="bg-surface border border-border rounded-2xl p-5 h-[120px]" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {CITIES.map(({ city, country, tz, flag }) => {
          const t = getTimeInZone(tz, now);
          const biz = isBusinessHours(tz, now);
          return (
            <div
              key={tz}
              className="bg-surface border border-border rounded-2xl p-5 space-y-2 hover:border-blue/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{flag}</span>
                  <div>
                    <div className="font-bold text-text leading-tight">{city}</div>
                    <div className="text-xs text-text-4">{country}</div>
                  </div>
                </div>
                <div
                  className={`w-2 h-2 rounded-full ${biz ? "bg-green-500" : "bg-text-4"}`}
                  title={biz ? "Business hours" : "Off hours"}
                />
              </div>
              <div className="font-mono">
                <span className="text-2xl font-black text-text">{t.time}</span>
                <span className="text-sm font-bold text-text-3 ml-1.5">{t.ampm}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-4">{t.date}</span>
                <span className="text-text-4 font-mono">{t.offset}</span>
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-text-4 text-center">
        Times update every second · Green dot = business hours (9am–6pm, Mon–Fri)
      </p>
    </div>
  );
}
