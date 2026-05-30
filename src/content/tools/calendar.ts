import { ToolContent } from '../../registry/types';

export const calendarContent: ToolContent = {
  detailedDescription: "<p>The <strong>Calendar</strong> tool provides a comprehensive, interactive date management and scheduling utility entirely within your browser. By leveraging KaruviLab's strict <strong>Zero-Server-Upload</strong> and <strong>Privacy-First</strong> philosophy, this tool ensures that your personal dates, schedules, and planning data never leave your device. All rendering and date calculations are handled exclusively through <strong>Local-First Execution</strong>.</p><p>Whether you need to quickly look up future dates, calculate durations between days, or manage your personal schedule without relying on external cloud providers, our browser-native solution offers unmatched speed and reliability. Since there is no dependency on backend processing, there are no delays or tracking mechanisms—your data is entirely yours to control.</p><p>Furthermore, our tool boasts true <strong>Offline Resilience</strong>. Once loaded, the Calendar application remains fully functional even if you lose your internet connection. We understand the importance of keeping your sensitive daily plans private and seamlessly accessible, which is why we've built an enterprise-grade utility that protects your privacy from the ground up.</p>",
  howTo: [
    "Navigate to the Calendar tool interface from the main dashboard.",
    "Select the target month and year using the intuitive navigation controls.",
    "Click on any specific date to view detailed properties, such as day of the year or week number.",
    "Utilize the built-in duration calculator by picking a start date and an end date.",
    "Review the generated results instantly on the screen without any page reloads."
  ],
  examples: [
    {
      label: "Find Days Between Dates",
      description: "Calculates the exact number of days between two calendar events.",
      input: "Start: Jan 1, 2024, End: Jan 10, 2024",
      output: "9 days"
    },
    {
      label: "Determine Weekday",
      description: "Quickly find out what day of the week a historical or future date falls on.",
      input: "Date: July 4, 1776",
      output: "Thursday"
    },
    {
      label: "Leap Year Check",
      description: "Identifies whether a specified year contains an extra day in February.",
      input: "Year: 2024",
      output: "Yes, 2024 is a leap year."
    }
  ],
  faq: [
    {
      question: "Is my calendar data stored on your servers?",
      answer: "No, we strictly adhere to a Zero-Server-Upload policy. All your scheduling data and date inputs are processed locally on your device and are never transmitted to our servers."
    },
    {
      question: "Can I use the Calendar tool offline?",
      answer: "Yes, the tool features Offline Resilience. Once you load the tool, you can disconnect from the internet and it will continue to function perfectly using your browser's local sandbox."
    },
    {
      question: "How accurate are the date calculations?",
      answer: "Our tool uses robust, built-in browser standard libraries to calculate dates, ensuring complete accuracy across different time zones and leap years."
    },
    {
      question: "Does the Calendar support international date formats?",
      answer: "Yes, the tool automatically respects your local system preferences but can also be manually configured to display formats like DD/MM/YYYY or MM/DD/YYYY."
    },
    {
      question: "Is the Calendar interface mobile-friendly?",
      answer: "Absolutely. The tool is fully responsive and designed to provide an enterprise-tier UX on both desktop and mobile devices."
    }
  ],
  useCases: [
    "Project Managers calculating the total number of working days available before a major milestone.",
    "Event Planners checking future weekdays for scheduling conferences or weddings.",
    "Developers needing to verify leap years or epoch timestamps for their coding projects.",
    "Students organizing their study schedules by accurately determining the remaining weeks before final exams."
  ],
  commonErrors: [
    {
      error: "Invalid Date Format",
      fix: "Ensure you are using standard date inputs or the provided date picker. Review the text box to remove any accidental special characters."
    },
    {
      error: "End Date Before Start Date",
      fix: "When calculating duration, ensure that the designated end date occurs chronologically after the start date."
    }
  ]
};
