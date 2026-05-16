import { ToolContent } from '../../registry/types';

export const dateCalculator: ToolContent = {
  detailedDescription:
    "Add or subtract days, weeks, months, or years from a given date, or calculate the exact difference between two dates in multiple units. Handles daylight saving transitions and leap years correctly. Useful for deadline calculations, project planning, and scheduling.",
  howTo: [
    "To find a future or past date: enter the start date, select an operation (add/subtract), and enter the number of days/weeks/months/years.",
    "To find the difference between two dates: enter both dates in the 'Date Difference' tab.",
    "The result is displayed in days, weeks, months, and years.",
  ],
  faq: [
    {
      question: "Does it account for leap years?",
      answer:
        "Yes. JavaScript's Date object, which powers the tool, handles leap years and varying month lengths automatically.",
    },
    {
      question: "Can I add business days only (excluding weekends)?",
      answer:
        "Yes, if the tool has a 'business days' mode. Enable it to skip Saturdays and Sundays when adding or subtracting days.",
    },
    {
      question: "Are public holidays excluded?",
      answer:
        "Public holidays are not excluded by default as they vary by country. Use the business-days mode for weekend exclusion only.",
    },
  ],
  useCases: [
    "Finding the deadline date N days from today",
    "Calculating how many days until a project delivery",
    "Determining someone's age in total days",
    "Computing the number of days between two contract dates",
  ],
  examples: [
    {
      label: "Add 90 days to today",
      input: "2026-05-07 + 90 days",
      output: "2026-08-05",
    },
  ],
  commonErrors: [
    {
      error: "Date result is off by one day",
      fix: "This may be a timezone issue. The tool uses the browser's local timezone. Dates near midnight may shift in UTC.",
    },
    {
      error: "Adding months gives an unexpected end date",
      fix: "Adding a month to January 31 gives February 28/29 (the last day of the month), which is the standard behaviour.",
    },
  ],
  alternatives: ["timeanddate.com Date Calculator", "Calculator.net", "Wolfram Alpha"],
};
