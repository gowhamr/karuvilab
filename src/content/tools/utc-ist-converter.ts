import { ToolContent } from '../../registry/types';

export const utcIstConverter: ToolContent = {
  detailedDescription:
    "Quickly convert between Coordinated Universal Time (UTC) and Indian Standard Time (IST). This tool is essential for developers, IT professionals, and traders who frequently deal with server logs, international APIs, and global schedules. Works 100% offline.",
  howTo: [
    "Enter a time in the UTC field to see the equivalent IST time.",
    "Alternatively, enter an IST time to convert it back to UTC.",
    "Use the 'Current Time' button to instantly convert the present moment.",
    "The 5-hour 30-minute offset is automatically applied.",
  ],
  faq: [
    {
      question: "What is the offset between UTC and IST?",
      answer: "IST (Indian Standard Time) is 5 hours and 30 minutes ahead of UTC (Coordinated Universal Time).",
    },
    {
      question: "Does IST have Daylight Saving Time?",
      answer: "No. India does not observe Daylight Saving Time. The +5:30 offset remains constant throughout the year.",
    },
    {
      question: "Can I convert other time zones?",
      answer: "This specific tool is optimized for UTC/IST. For other zones, use our general Time Zone Converter or World Clock.",
    },
  ],
  useCases: [
    "Decoding server log timestamps into local Indian time",
    "Scheduling meetings between Indian and international teams",
    "Calculating trade settlement times for global markets",
    "Converting GitHub commit times to local time",
  ],
  alternatives: ["UTCto.net", "TimeBie", "WorldTimeBuddy"],
};
