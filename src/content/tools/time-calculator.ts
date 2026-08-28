import { ToolContent } from '../../registry/types';

export const timeCalculator: ToolContent = {
  detailedDescription: `
<p>The KaruviLab Time Calculator provides a deterministic, browser-native calculation engine to compute exact time intervals, sum multiple durations (for timesheets, video editing, or athletic logs), and calculate clock time offsets with automatic midnight rollover detection. Designed for engineers, payroll professionals, researchers, and learners, it runs 100% offline with zero server data transfer.</p>

<p>Calculating time differences requires accurate sexagesimal (base-60) arithmetic and 24-hour clock modular arithmetic. Naive decimal division often introduces rounding inaccuracies when converting minutes and seconds into fractional hours. KaruviLab's integer-based arithmetic converts all times into absolute seconds from midnight, computes exact differences and sums, and converts back into canonical hours, minutes, and seconds alongside high-precision decimal hours.</p>

<p>The tool supports three distinct operations: <strong>Time Difference</strong> (calculating elapsed hours, minutes, seconds, and decimal hours between two clock times, with automatic detection of overnight shifts crossing midnight), <strong>Sum Durations</strong> (adding multiple time spans for timesheet totaling), and <strong>Clock Time Offset</strong> (adding or subtracting hours, minutes, and seconds from any reference clock time with day shift indicators).</p>

<p>All calculations are performed entirely within your browser runtime. KaruviLab adheres strictly to a zero-telemetry architecture: no times, schedule logs, or duration records are ever stored or transmitted across the network.</p>
`,
  howTo: [
    "<strong>Select Mode:</strong> Choose between 'Time Difference' (to find elapsed time between two points), 'Sum Durations' (to total multiple time entries), or 'Add / Subtract Time'.",
    "<strong>Enter Times:</strong> Enter clock times in standard 24-hour (HH:MM or HH:MM:SS) format.",
    "<strong>Overnight Shifts:</strong> When calculating differences, if the end time is earlier than the start time, the tool automatically calculates the duration across the midnight boundary.",
    "<strong>Review & Share:</strong> Inspect detailed breakdowns (hours, minutes, seconds, and decimal hours). Use the Share button to copy a reproducible link.",
  ],
  faq: [
    {
      question: "How does the tool handle overnight shifts crossing midnight?",
      answer: "When the end time is numerically earlier than the start time (e.g. 22:00 to 06:30), the engine detects a midnight boundary crossing and adds 24 hours (86,400 seconds) to compute the true 8h 30m shift duration.",
    },
    {
      question: "Can I input seconds precision?",
      answer: "Yes. The calculator accepts both standard HH:MM (e.g. 09:30) and high-precision HH:MM:SS (e.g. 09:30:45) formats.",
    },
    {
      question: "What are decimal hours used for?",
      answer: "Decimal hours convert minutes and seconds into a base-10 number (e.g. 8 hours and 30 minutes = 8.5000 hours), which is required for payroll processing, billing rate multiplication, and timecard systems.",
    },
    {
      question: "Can I add more than 24 hours of total duration?",
      answer: "Yes. The Sum Durations mode supports arbitrarily large cumulative durations (e.g. 150 hours and 45 minutes) for weekly or monthly timesheet totals.",
    },
    {
      question: "Is any timesheet or schedule data uploaded to external servers?",
      answer: "No. KaruviLab operates on a zero-upload principle. All calculations run strictly in your device's browser memory.",
    },
  ],
  useCases: [
    "Calculating daily work hours and overtime for timesheets and payroll.",
    "Summing video clips, podcast segments, and music tracks for total run time.",
    "Calculating flight duration, layovers, and travel itineraries.",
    "Timing multi-step culinary recipes and scientific laboratory protocols.",
    "Measuring athletic lap splits and training intervals.",
  ],
  examples: [
    {
      input: "Start Time: 09:00 | End Time: 17:30",
      output: "8 Hours, 30 Minutes (Total Minutes: 510, Decimal Hours: 8.5)",
      description: "Standard daytime work shift calculation."
    },
    {
      input: "Start Time: 22:00 | End Time: 06:30",
      output: "8 Hours, 30 Minutes (Overnight Midnight Crossing)",
      description: "Night shift calculation crossing the midnight boundary."
    },
    {
      input: "Durations: 01:30, 02:45, 00:45",
      output: "Total: 5 Hours, 0 Minutes, 0 Seconds",
      description: "Sum of three project task durations."
    }
  ],
  commonErrors: [
    {
      error: "Invalid Time Format",
      fix: "Ensure clock times use valid 24-hour notation (00:00 to 23:59) with valid minutes (00 to 59).",
    },
    {
      error: "Empty Duration Entry",
      fix: "Provide at least one valid duration row when using Sum Durations mode.",
    },
  ],
  alternatives: ["Timeanddate.com", "Calculator.net Time Calculator", "Online-Stopwatch.com"],
};
