import { ToolEntry } from '../types';

export const stopwatch: ToolEntry = {
  id: 'stopwatch',
  name: 'Stopwatch',
  desc: 'A precise, professional stopwatch with lap tracking and fullscreen dashboard mode.',
  href: 'productivity/stopwatch/',
  category: 'productivity',
  subCategory: 'Time Management',
  keywords: ['stopwatch', 'timer', 'lap', 'time', 'productivity'],
  searchIntent: 'action',
  status: 'new',
  seoContent: {
    detailedDescription: 'The KaruviLab Stopwatch is a highly precise, zero-dependency browser-based stopwatch designed for maximum performance. It features a stunning Full-Screen Dashboard Mode (Kiosk Mode) perfect for events, presentations, or second monitors, alongside an advanced Focus Mode for distraction-free tracking.',
    howTo: [
      'Click the Start button to begin timing.',
      'Use the Lap button to record splits without stopping the timer.',
      'Press F11 to enter Dashboard Mode for a full-screen, high-visibility display.',
      'Click Stop to pause, and Reset to clear all laps and start over.'
    ],
    faq: [
      {
        question: 'Does this stopwatch work offline?',
        answer: 'Yes, like all KaruviLab tools, this stopwatch runs entirely in your browser and works completely offline without needing an internet connection.'
      },
      {
        question: 'How precise is the timer?',
        answer: 'The stopwatch uses the modern Performance API when available (falling back to Date objects) to ensure maximum sub-millisecond precision even when the browser tab is backgrounded.'
      },
      {
        question: 'Does the timer keep running if I switch tabs?',
        answer: 'Yes, the stopwatch tracks the exact start time in your browser, meaning it will perfectly calculate the elapsed time even if your tab is sleeping or running in the background.'
      }
    ]
  }
};
