import { ToolContent } from '../../registry/types';

export const ageCalculator: ToolContent = {
  detailedDescription:
    "Calculate your exact age in years, months, and days from a birth date to today or any target date. Also shows the day of the week you were born and how many days remain until your next birthday. All calculations are done in the browser.",
  howTo: [
    "Enter your date of birth using the date picker.",
    "Optionally enter a target date (defaults to today).",
    "Click 'Calculate Age' to see the result.",
    "View your age broken down into years, months, and days.",
  ],
  faq: [
    {
      question: "How are months calculated?",
      answer:
        "The tool counts complete calendar months. Partial months are represented by the remaining days.",
    },
    {
      question: "Does it handle leap years?",
      answer:
        "Yes. Leap years are accounted for when counting days, so ages across February 29 are calculated correctly.",
    },
    {
      question: "Can I calculate the age difference between two people?",
      answer:
        "Enter one person's birth date as the 'from' date and the other's birth date as the 'to' date to find the exact difference.",
    },
  ],
  useCases: [
    "Calculating exact age for official forms requiring years, months, and days",
    "Finding the day of the week you were born",
    "Checking how many days until your next birthday",
    "Calculating the age of a pet, document, or building",
  ],
  commonErrors: [
    {
      error: "Age is off by one day",
      fix: "Check whether the target date is set to today's date in the correct timezone. The tool uses the browser's local date.",
    },
    {
      error: "Future birth date entered by mistake",
      fix: "The tool requires the birth date to be earlier than the target date. Entering a future birth date produces an error.",
    },
  ],
  alternatives: ["timeanddate.com Age Calculator", "Calculator.net", "Wolfram Alpha"],
};
