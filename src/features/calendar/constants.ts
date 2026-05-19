import { EventColor, RecurrenceType } from './types';

export const COLOR_MAP: Record<EventColor, { bg: string; border: string; text: string; hex: string }> = {
  indigo: { bg: 'bg-indigo-500/10', border: 'border-indigo-500', text: 'text-indigo-600 dark:text-indigo-400', hex: '#6366f1' },
  blue: { bg: 'bg-blue-500/10', border: 'border-blue-500', text: 'text-blue-600 dark:text-blue-400', hex: '#3b82f6' },
  green: { bg: 'bg-green-500/10', border: 'border-green-500', text: 'text-green-600 dark:text-green-400', hex: '#22c55e' },
  yellow: { bg: 'bg-yellow-500/10', border: 'border-yellow-500', text: 'text-yellow-600 dark:text-yellow-400', hex: '#eab308' },
  orange: { bg: 'bg-orange-500/10', border: 'border-orange-500', text: 'text-orange-600 dark:text-orange-400', hex: '#f97316' },
  red: { bg: 'bg-red-500/10', border: 'border-red-500', text: 'text-red-600 dark:text-red-400', hex: '#ef4444' },
  purple: { bg: 'bg-purple-500/10', border: 'border-purple-500', text: 'text-purple-600 dark:text-purple-400', hex: '#a855f7' },
  pink: { bg: 'bg-pink-500/10', border: 'border-pink-500', text: 'text-pink-600 dark:text-pink-400', hex: '#ec4899' },
};

export const RECURRENCE_LABELS: Record<RecurrenceType, string> = {
  none: 'Does not repeat',
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
  yearly: 'Yearly',
};

export const TAMIL_MONTHS = [
  'Chithirai', 'Vaikasi', 'Aani', 'Aadi', 'Aavani', 'Purattasi',
  'Aippasi', 'Karthigai', 'Margazhi', 'Thai', 'Maasi', 'Panguni'
];

export const TAMIL_WEEKDAYS = [
  'Gnayiru', 'Thingal', 'Sevvai', 'Budhan', 'Vyazhan', 'Velli', 'Sani'
];
