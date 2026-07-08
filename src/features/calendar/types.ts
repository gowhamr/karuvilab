export type CalendarView = 'month' | 'week' | 'day' | 'agenda' | 'year';

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
    exceptions?: string[]; // ISO start dates of instances that are skipped or replaced
  };
  parentId?: string; // For exception events, links to the parent recurring series
  exceptionOriginalDate?: string; // The original start date of the occurrence this exception replaces
  reminderMinutes?: number;
  createdAt: number;
  updatedAt: number;
}

import { EventCategory, EventImportance } from './world-events-db';

export interface CalendarWorldEventsSettings {
  showWorldEvents: boolean;           // master toggle
  showCategories: EventCategory[];    // which categories to show
  showImportance: EventImportance[];  // major | moderate | minor
  highlightIndianEvents: boolean;     // extra prominence for Indian events
  showUpcomingWidget: boolean;        // sidebar widget
  compactBadges: boolean;             // show only emoji vs emoji+name
}
