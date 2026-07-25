import { ToolContent } from '../../registry/types';

export const timezoneConverter: ToolContent = {
  detailedDescription: `
# KaruviLab Elite Learning Hub: Timezone Architecture & Epoch Math

Welcome to the engineering guide to Timezones. This handbook explains why storing local time in a database is a rookie mistake, and the absolute chaos of Daylight Saving Time.

---

## 1. Prerequisites: The Database Nightmare

Imagine you are building a flight booking system. A user in New York books a flight for 9:00 AM on July 1st. 
You save this to your database: \`2026-07-01 09:00:00\`.

**The Disaster:** A user in London views the flight schedule. The system reads the database and displays "9:00 AM". The Londoner shows up to the airport at 9:00 AM UK time... but the flight doesn't leave for another 5 hours because it was booked in New York time!

**The Golden Rule of Engineering:** NEVER save local time to a database. 
You must **always** convert the time to UTC (Coordinated Universal Time) or Unix Epoch before saving.

---

## 2. Core Concepts: UTC vs Epoch

### UTC (Coordinated Universal Time)
UTC is the absolute baseline of time on Earth. It has no Daylight Saving Time. 
In a database, it is often stored in the ISO-8601 string format:
\`2026-07-01T13:00:00Z\` (The \`Z\` stands for Zulu, indicating strict UTC).

### Unix Epoch Time
Computer processors prefer math over strings. Unix Epoch time is the exact number of seconds that have elapsed since **January 1st, 1970, at 00:00:00 UTC**.
If the Epoch is \`1782910800\`, the Londoner's browser can instantly run math to subtract their local timezone offset and render the correct local time on their screen.

---

## 3. Threat Model: Daylight Saving Time (DST)

DST is the ultimate enemy of software engineers. 
If a user schedules a daily alarm for 8:00 AM, you cannot just tell the server to "wait 24 hours". 
- In March (when clocks spring forward), the day only has 23 hours! If you wait 24 hours, the alarm will ring at 9:00 AM.
- In November (when clocks fall back), the day has 25 hours!

**The IANA tz Database:**
Because politicians constantly change DST rules (e.g., stopping it entirely, or shifting the months), operating systems rely on the **tz database** (maintained by IANA). This database tracks the historical and future rules for every timezone on Earth (e.g., \`America/New_York\`). If your server's tz database is out of date, your scheduled cron jobs will drift.

---

## 4. Production Workflows

- **Frontend Rendering (Intl API):** Modern web browsers have a built-in \`Intl.DateTimeFormat\` API. The backend sends the raw UTC string to the frontend, and the frontend automatically references the user's OS timezone settings to format the date perfectly (e.g., converting UTC to IST for a user in Mumbai).
- **Distributed Logs:** AWS and Google Cloud servers operate strictly in UTC. If servers in Tokyo, Paris, and Seattle all logged errors in their local times, debugging a global outage would be impossible. Standardizing on UTC allows engineers to seamlessly interlace logs chronologically.

---

## 5. Interactive Quiz

**Beginner:**
1. Should you save a user's local time (like 5:00 PM EST) directly into a database? *(Answer: No! You must always convert it to a universal standard like UTC before saving, otherwise users in other countries will see the wrong time).*

**Intermediate:**
2. What is Unix Epoch Time? *(Answer: It is the total number of seconds that have passed since January 1st, 1970 (UTC), providing computers with a simple integer they can use for ultra-fast time calculations).*

**Advanced:**
3. Why is it dangerous to schedule a recurring daily event by simply adding exactly 24 hours (86,400 seconds) to a timestamp? *(Answer: Because of Daylight Saving Time (DST). On the days when clocks change, a day might have 23 or 25 hours. Adding exactly 24 hours will cause the event to trigger an hour early or late).*

---
*End of Elite Learning Hub Content.*
`,
  howTo: [
    "**Step 1:** Select your source Timezone and enter the local time.",
    "**Step 2:** Select your target Timezone(s).",
    "**Step 3:** The engine queries the IANA tz database to apply exact offsets (including complex DST rules for the specific date selected).",
    "**Step 4:** The tool outputs the exact local time in the target cities, alongside the universally safe UTC timestamp."
  ],
  faq: [
    {
      question: "Why does the time offset for New York change depending on the month?",
      answer: "New York observes Daylight Saving Time. From March to November, it is UTC-4. During the winter, it falls back to UTC-5."
    }
  ],
  useCases: [],
  examples: [],
  commonErrors: [],
  alternatives: ["Unix Timestamp", "World Clock"]
};
