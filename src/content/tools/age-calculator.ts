import { ToolContent } from '../../registry/types';

export const ageCalculator: ToolContent = {
  detailedDescription: `
<p>The KaruviLab Age Calculator provides a deterministic, browser-native mathematical engine to compute your exact age in completed years, months, and days from your date of birth to any reference date. Whether you are validating eligibility for civil examinations, filling out official documentation, or exploring astronomical and life-span milestones, this tool delivers instant, reproducible results with zero server communication.</p>

<p>Accurate calendar date difference calculation requires resolving variable-length month intervals and Gregorian leap year rules. Simple Unix timestamp subtraction often causes 1-to-2 day discrepancies because months range from 28 to 31 days and common years differ from leap years. KaruviLab's pure arithmetic engine evaluates full annual milestone cycles, accounts for February 29 quadrennial and centurial boundaries, and computes remaining days against the exact calendar length of intervening months.</p>

<p>In addition to basic chronological age, the tool computes total elapsed life metrics (total months, weeks, days, hours, minutes, and seconds), upcoming birthday countdowns, biological heartbeat and breathing estimates, and astronomical celestial positions (tropical western signs, sidereal Vedic rasi and nakshatra, and Chitra Paksha ayanamsa).</p>

<p>All calculations run 100% locally on your device within the browser thread or Web Worker. KaruviLab adheres strictly to a zero-telemetry, zero-server-upload architecture: your birth date, calculation dates, and personal inputs never leave your device.</p>
`,
  howTo: [
    "<strong>Enter Date of Birth:</strong> Type your birth date in DD / MM / YYYY format or open the calendar selector to choose your exact birth day.",
    "<strong>Set As-Of Calculation Date:</strong> The calculator defaults to today's date. Adjust the calculation date to find your age on a historical date or future milestone.",
    "<strong>Explore Calculation Options (Optional):</strong> Expand Calculation Options to enable Age Comparison Mode (comparing two individuals) or enter birth time and timezone for high-precision celestial ephemeris coordinates.",
    "<strong>Inspect Results & Share:</strong> Review exact years, months, days, total elapsed time, and countdown to your next birthday. Use the Share button to generate a canonical URL that reproduces the exact calculation for others.",
  ],
  faq: [
    {
      question: "How does the calculator handle leap years and February 29 birthdays?",
      answer: "The engine implements the full Gregorian calendar rule: years divisible by 4 are leap years, except centuries unless divisible by 400. For individuals born on February 29, the calculator recognizes February 29 in leap years and accurately transitions the annual milestone to March 1 in non-leap common years.",
    },
    {
      question: "Why does subtracting timestamps sometimes give different month counts?",
      answer: "Months have variable lengths of 28, 29, 30, or 31 days. Dividing absolute milliseconds by an average month length (e.g. 30.4375 days) causes drift. KaruviLab resolves this by stepping through actual calendar month milestones from your birth date to the target date.",
    },
    {
      question: "How does Age Comparison mode work?",
      answer: "Age Comparison mode allows you to enter a second birth date. The engine identifies the older and younger individuals and computes the exact difference in years, months, and days between both dates.",
    },
    {
      question: "What are the astronomical and celestial coordinates calculated?",
      answer: "Using pure local astronomical algorithms, the calculator computes your Western tropical sun and moon signs, Vedic sidereal rasi and nakshatra (with Lahiri ayanamsa), moon phase illumination, and planetary ephemeris longitudes without contacting external APIs.",
    },
    {
      question: "Is any birth date or personal data transmitted to external servers?",
      answer: "No. KaruviLab operates on a zero-upload principle. All calculations are executed entirely inside your browser's JavaScript runtime. No cookies, trackers, or analytics capture your data.",
    },
  ],
  useCases: [
    "Verifying exact age requirements for passport applications, government examinations, and insurance policies.",
    "Tracking pediatric developmental age in exact months and days for infants and toddlers.",
    "Calculating exact age differences between family members, partners, or colleagues.",
    "Determining exact milestone days lived, estimated heartbeats, and statistical lifespan progress.",
    "Looking up astronomical birth chart data, moon signs, nakshatras, and Chinese zodiac elements.",
  ],
  examples: [
    {
      input: "Date of Birth: 2000-01-15 | Calculate As Of: 2025-06-20",
      output: "25 Years, 5 Months, 5 Days (Total Days: 9,288)",
      description: "Standard calculation spanning multiple leap years (2000, 2004, 2008, 2012, 2016, 2020, 2024)."
    },
    {
      input: "Date of Birth: 2000-02-29 | Calculate As Of: 2025-02-28",
      output: "24 Years, 11 Months, 30 Days (Next Birthday: 2025-02-28)",
      description: "Leap year birth date evaluated on the last day of February in a non-leap year."
    },
    {
      input: "Date of Birth: 1990-05-10 | Person 2 DOB: 1995-08-20",
      output: "Age Difference: 5 Years, 3 Months, 10 Days",
      description: "Comparison mode calculation measuring the exact interval between two individuals."
    }
  ],
  commonErrors: [
    {
      error: "Date of Birth In Future",
      fix: "The calculation date must be on or after the date of birth. Verify that your birth date year is earlier than the calculation year.",
    },
    {
      error: "Invalid Date Format",
      fix: "Ensure date inputs use a valid calendar date in DD / MM / YYYY or YYYY-MM-DD format without invalid month numbers (1-12) or days (1-31).",
    },
  ],
  alternatives: ["timeanddate.com Age Calculator", "Calculator.net Age Calculator", "Wolfram Alpha"],
};
