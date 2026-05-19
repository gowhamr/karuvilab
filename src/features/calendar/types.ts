export type CalendarView = 'month' | 'week' | 'day' | 'agenda';

export type EventColor = 'indigo' | 'blue' | 'green' | 'yellow' | 'orange' | 'red' | 'purple' | 'pink';

export type RecurrenceType = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: string; // ISO string
  endDate: string;   // ISO string
  allDay: boolean;
  location?: string;
  color: EventColor;
  recurrence?: {
    type: RecurrenceType;
    endDate?: string; // ISO string
    count?: number;
  };
  reminderMinutes?: number;
  createdAt: number;
  updatedAt: number;
}

export interface TamilDateInfo {
  year: number;
  month: number; // 0-11
  day: number;
  monthName: string;
  weekday: string;
  isFestival?: boolean;
  festivalName?: string;
}
