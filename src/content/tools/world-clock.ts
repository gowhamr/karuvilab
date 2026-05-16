import { ToolContent } from '../../registry/types';

export const worldClock: ToolContent = {
  detailedDescription:
    "Track current time across multiple global cities simultaneously with our responsive World Clock. Perfect for scheduling international meetings, tracking market hours, or keeping in touch with global teams. Displays local time, UTC offset, and date for each selected location.",
  howTo: [
    "Search for a city or country in the search bar.",
    "Click 'Add' to include the location in your dashboard.",
    "View the current time, date, and time zone for all saved cities.",
    "Remove cities by clicking the 'X' or 'Remove' button.",
    "Toggle between digital and analog views (if available).",
  ],
  faq: [
    {
      question: "Does it account for Daylight Saving Time (DST)?",
      answer: "Yes. The tool uses the browser's Intl API which automatically adjusts for current DST rules in every time zone.",
    },
    {
      question: "Can I add as many cities as I want?",
      answer: "Yes. You can add dozens of cities. Your list is saved locally in your browser so it persists between visits.",
    },
    {
      question: "How accurate is the time?",
      answer: "The time is based on your system clock. For best results, ensure your device time is synchronised with an internet time server.",
    },
  ],
  useCases: [
    "Coordinating calls with offshore development teams",
    "Tracking opening hours of global stock exchanges",
    "Staying connected with family living in different time zones",
    "Planning international travel itineraries",
  ],
  alternatives: ["WorldTimeServer.com", "Timeanddate.com World Clock", "Google 'time in [city]'"],
};
