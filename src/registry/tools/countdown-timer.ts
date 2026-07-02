import { ToolEntry } from '../types';

export const countdown_timer: ToolEntry = {
  id: 'countdown-timer',
  name: 'Countdown Timer',
  desc: 'A professional countdown timer with fullscreen dashboard mode and custom alarm sounds',
  href: 'productivity/countdown-timer/',
  category: 'productivity',
  subCategory: 'Time Management',
  keywords: ['countdown', 'timer', 'alarm', 'time', 'productivity'],
  searchIntent: 'action',
  status: 'new',
  seoContent: {
    detailedDescription: 'The KaruviLab Countdown Timer is a robust, zero-dependency browser-based timer designed for absolute reliability. Whether you are managing a presentation, cooking, or timing a workout, it delivers pixel-perfect precision alongside a stunning Full-Screen Dashboard Mode.',
    howTo: [
      'Enter the desired hours, minutes, and seconds into the input fields.',
      'Click Start to begin the countdown.',
      'Press F11 to enter Dashboard Mode for a full-screen, high-visibility display.',
      'When the timer reaches zero, an alarm will sound. Click Stop to dismiss it.'
    ],
    faq: [
      {
        question: 'Will the timer keep running if I switch tabs?',
        answer: 'Yes, the timer calculates the exact remaining time based on your systems absolute timestamp, meaning it will never lose precision even if the browser aggressively throttles background tabs.'
      },
      {
        question: 'Does this tool require an internet connection?',
        answer: 'No, like all KaruviLab tools, this countdown timer runs entirely locally in your browser and works completely offline.'
      },
      {
        question: 'Can I customize the display?',
        answer: 'Yes! By pressing F11 to enter Dashboard Mode, you can access a settings menu to change the theme, clock size, and toggle milliseconds.'
      }
    ]
  }
};
