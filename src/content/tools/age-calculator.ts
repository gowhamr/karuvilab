import { ToolContent } from '../../registry/types';

export const ageCalculator: ToolContent = {
  detailedDescription: `
    <p>The KaruviLab Age Calculator provides an accurate way to calculate the precise time between any two dates. Whether you need to know your exact age in years, months, and days for official government documentation, or you are simply curious about how many days have passed since a significant life milestone, this tool delivers instant, precise results.</p>
    
    <p>Age calculations can be trickier than they appear, particularly when accounting for leap years, variations in month lengths, and the specific number of days in different calendar months. Our calculator uses precise date-math to ensure that your results are always accurate, regardless of the complexity of the calendar intervals involved.</p>

    <p>Like all KaruviLab utilities, your data stays on your device. We do not store, track, or share your birth date or any other information you input. This tool is a reliable, privacy-first alternative to the many tracking-heavy sites found across the web, making it the perfect choice for users who value data security alongside utility.</p>
  `,
  howTo: [
    "<strong>Set Date of Birth:</strong> Click the birth date field to open the calendar and select your date of birth.",
    "<strong>Choose Target Date:</strong> The tool defaults to the current date. You can change this to calculate your age as of a specific past or future date.",
    "<strong>Calculate:</strong> Click 'Calculate Age'. The tool will immediately return your precise age broken down by years, total months, total weeks, and total days.",
    "<strong>Next Birthday:</strong> The tool also calculates the time remaining until your next upcoming birthday.",
  ],
  faq: [
    {
      question: "How does the tool handle leap years?",
      answer: "We account for leap years automatically. Days are calculated based on the specific calendar length of each month and year passed between the two dates.",
    },
    {
      question: "Can I use this for calculating the age of a pet?",
      answer: "Yes. You can use the calculator with your pet's date of birth as the start date and today's date as the end date to see their age in days, weeks, and months.",
    },
    {
      question: "How accurate is the 'total days' count?",
      answer: "The 'total days' count represents the cumulative number of days between the two selected dates, including all weekends and holidays.",
    },
    {
      question: "Does it track my birthday?",
      answer: "No. KaruviLab operates on a zero-upload principle. None of your input data, including your birthday, is ever saved or sent to any server.",
    },
  ],
  useCases: [
    "Filling out official government forms that require age in years, months, and days.",
    "Determining the exact number of days until a significant upcoming milestone or birthday.",
    "Calculating the precise age of documents, historical buildings, or projects.",
    "Tracking how many days an infant has been alive for pediatric or developmental milestones.",
  ],
  examples: [
    {
      input: "Birth Date: Jan 1, 1990 | Target Date: May 24, 2026",
      output: "36 years, 4 months, 23 days",
      description: "A standard calculation for a person born on New Year's Day."
    }
  ],
  commonErrors: [
    {
      error: "Age is off by one day",
      fix: "Ensure that your system clock (computer time) is correct. Our calculator uses the local date provided by your browser.",
    },
    {
      error: "Future birth date error",
      fix: "The calculator cannot process a birth date that is later than the target date. Ensure the 'Birth Date' field is set to an earlier date than the 'Target Date'.",
    },
  ],
  alternatives: ["timeanddate.com Age Calculator", "Calculator.net Age Calculator", "Wolfram Alpha"],
};
