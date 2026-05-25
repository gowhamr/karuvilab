import { ToolContent } from '../../registry/types';

export const timezoneConverterContent: ToolContent = {
  detailedDescription: "The KaruviLab Time Zone Converter is a professional-grade, browser-native utility designed for global teams, digital nomads, and remote workers. In an increasingly connected world, scheduling meetings across multiple continents can be a logistical challenge. Our tool simplifies this process by providing an intuitive interface to compare and convert times between hundreds of IANA time zones instantly. Unlike other converters that require server-side processing, KaruviLab executes all calculations locally on your device. This 'Zero-Upload' architecture ensures that your scheduling data and location preferences never leave your browser, providing ultimate privacy and security. The tool features a searchable database of global cities, real-time offset calculations, and relative day indicators (Yesterday/Today/Tomorrow) to help you avoid common scheduling pitfalls like missing a day or miscalculating a midnight transition.",
  howTo: [
    "Select your 'Base Time' by choosing a date and time from the picker. This is usually your local time or the time of the event you are planning.",
    "Choose your 'Base Time Zone' using the searchable dropdown. You can search by city name (e.g., 'London'), country, or the specific IANA zone name (e.g., 'Europe/London').",
    "Add 'Target Time Zones' by typing in the search box in the right panel. You can add multiple zones to compare them side-by-side in a grid view.",
    "Observe the real-time conversions. Each card shows the local time, date, and the positive or negative offset relative to your base zone.",
    "Use the 'Set to Now' button to quickly synchronize the converter with the current moment.",
    "Copy specific converted times to your clipboard using the copy icon on each timezone card for easy sharing in emails or calendar invites."
  ],
  faq: [
    {
      question: "How does the Time Zone Converter handle Daylight Saving Time (DST)?",
      answer: "Our tool uses the native Intl API of your browser, which is powered by the latest IANA Time Zone Database. It automatically accounts for DST transitions based on the specific date you select. If a region is in DST on your chosen date, the offset will reflect that correctly."
    },
    {
      question: "Is my location or data sent to any server?",
      answer: "No. Privacy is a core mandate at KaruviLab. All time zone data and calculations are handled by your browser's local engine. We do not track your location, and we do not store your scheduling data on any server."
    },
    {
      question: "What is an IANA Time Zone?",
      answer: "The IANA (Internet Assigned Numbers Authority) Time Zone Database, also known as the Olson database, is a comprehensive collection of information about the world's time zones. It uses a naming convention like 'Area/Location' (e.g., 'America/New_York') to uniquely identify zones regardless of political changes."
    },
    {
      question: "Can I use this tool offline for international travel?",
      answer: "Yes. Once you have visited KaruviLab, the Time Zone Converter is cached by our Service Worker (PWA technology). You can use it in 'Airplane Mode' or in regions with poor connectivity, making it a perfect companion for international travelers."
    },
    {
      question: "Does it show if the target time is on a different day?",
      answer: "Absolutely. Each timezone card includes a 'Next Day' or 'Previous Day' badge if the converted time falls on a different calendar day than your base time, helping you avoid meeting errors."
    }
  ]
};
