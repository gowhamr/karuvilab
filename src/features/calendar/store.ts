import { create } from 'zustand';
import { CalendarView, CalendarEvent } from './types';
import { saveCalendarEvent, getCalendarEvents, deleteCalendarEvent } from '@/src/lib/db';

interface CalendarState {
  currentDate: Date;
  currentView: CalendarView;
  events: CalendarEvent[];
  selectedEventId: string | null;
  tamilModeEnabled: boolean;
  isLoading: boolean;
  isModalOpen: boolean;
  
  // Actions
  setCurrentDate: (date: Date) => void;
  setCurrentView: (view: CalendarView) => void;
  setTamilMode: (enabled: boolean) => void;
  setSelectedEvent: (id: string | null) => void;
  setIsModalOpen: (open: boolean) => void;
  
  fetchEvents: () => Promise<void>;
  addEvent: (event: Omit<CalendarEvent, 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateEvent: (event: CalendarEvent) => Promise<void>;
  removeEvent: (id: string) => Promise<void>;
}

export const useCalendarStore = create<CalendarState>((set, get) => ({
  currentDate: new Date(),
  currentView: 'month',
  events: [],
  selectedEventId: null,
  tamilModeEnabled: false,
  isLoading: false,
  isModalOpen: false,

  setCurrentDate: (currentDate) => set({ currentDate }),
  setCurrentView: (currentView) => set({ currentView }),
  setTamilMode: (tamilModeEnabled) => set({ tamilModeEnabled }),
  setSelectedEvent: (selectedEventId) => set({ selectedEventId, isModalOpen: !!selectedEventId }),
  setIsModalOpen: (isModalOpen) => {
    if (!isModalOpen) set({ selectedEventId: null });
    set({ isModalOpen });
  },

  fetchEvents: async () => {
    set({ isLoading: true });
    try {
      const events = await getCalendarEvents();
      set({ events: events as CalendarEvent[] });
    } catch (error) {
      console.error('Failed to fetch calendar events:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  addEvent: async (eventData) => {
    const now = Date.now();
    const newEvent: CalendarEvent = {
      ...eventData,
      createdAt: now,
      updatedAt: now,
    };
    
    await saveCalendarEvent(newEvent);
    set(state => ({ events: [...state.events, newEvent] }));
  },

  updateEvent: async (event) => {
    const updatedEvent = {
      ...event,
      updatedAt: Date.now(),
    };
    
    await saveCalendarEvent(updatedEvent);
    set(state => ({
      events: state.events.map(e => e.id === event.id ? updatedEvent : e)
    }));
  },

  removeEvent: async (id) => {
    await deleteCalendarEvent(id);
    set(state => ({
      events: state.events.filter(e => e.id !== id)
    }));
  },
}));
