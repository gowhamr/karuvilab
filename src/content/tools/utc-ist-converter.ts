import { ToolContent } from '../../registry/types';

export const utcIstConverter: ToolContent = {
  detailedDescription:
    "Quickly and deterministically convert between Coordinated Universal Time (UTC) and Indian Standard Time (IST, UTC+5:30). Supports interactive single conversions, 12/24-hour modes, second/millisecond precision, Unix timestamps, ISO 8601 strings, batch conversions, CSV/JSON exports, and date rollover detection. Works 100% offline in your browser.",
  howTo: [
    "Enter a UTC or IST date/time, ISO 8601 string, or Unix epoch timestamp.",
    "Use the Swap button (⇄) to seamlessly switch between UTC → IST and IST → UTC.",
    "Toggle between 12-Hour (AM/PM) and 24-Hour formats, and select precision (Minutes, Seconds, Milliseconds).",
    "Switch to the 'Batch & CSV/JSON' tab to convert multi-line timestamps or download CSV and JSON reports.",
    "Click any of the one-click copy buttons to copy ISO strings, Unix timestamps, or structured JSON data.",
  ],
  faq: [
    {
      question: "What is the exact offset between UTC and IST?",
      answer: "IST (Indian Standard Time) is exactly 5 hours and 30 minutes ahead of UTC (Coordinated Universal Time), represented as UTC+05:30 (+19,800,000 milliseconds).",
    },
    {
      question: "Does India observe Daylight Saving Time (DST)?",
      answer: "No. India does not observe Daylight Saving Time. The +5:30 offset remains constant and invariant throughout the entire year.",
    },
    {
      question: "What does the '+1 Day' or '-1 Day' rollover alert indicate?",
      answer: "Because IST is 5.5 hours ahead of UTC, UTC times in the late evening (18:30 to 23:59) roll over into the next calendar day in India (+1 Day). Conversely, early morning IST times (00:00 to 05:29) correspond to the previous calendar day in UTC (-1 Day).",
    },
    {
      question: "Can I convert Unix timestamps and ISO 8601 strings?",
      answer: "Yes. The converter automatically detects 10-digit epoch seconds, 13-digit epoch milliseconds, standard ISO 8601 strings with timezone suffixes, and custom datetime formats.",
    },
    {
      question: "How does batch conversion work?",
      answer: "In the 'Batch & CSV / JSON' tab, you can paste multiple lines of timestamps or date strings. The tool parses each line in real-time and allows one-click export to CSV or JSON format.",
    },
  ],
  useCases: [
    "Debugging and decoding server log timestamps into local Indian Standard Time",
    "Scheduling global engineering standups and client meetings across time zones",
    "Calculating trade settlement and market opening/closing times (NSE/BSE, NYSE, LSE)",
    "Converting CI/CD pipelines, Git commit timestamps, and API payloads",
    "Bulk processing time series datasets and database log exports",
  ],
  alternatives: ["UTCto.net", "TimeBie", "WorldTimeBuddy"],
};
