import { create } from 'zustand';
import { saveCalendarEvent, getCalendarEvents, deleteCalendarEvent } from '@/src/lib/db';
export const useCalendarStore = create((set, get) => ({
    currentDate: new Date(),
    currentView: 'month',
    events: [],
    selectedEventId: null,
    isLoading: false,
    isModalOpen: false,
    worldEventsSettings: {
        showWorldEvents: true,
        showCategories: [
            'global-holiday', 'un-observance', 'environmental', 'health',
            'cultural', 'historical', 'awareness', 'science-tech',
            'indian-national', 'indian-festival', 'sporting', 'professional'
        ],
        showImportance: ['major', 'moderate', 'minor'],
        highlightIndianEvents: true,
        showUpcomingWidget: true,
        compactBadges: false,
    },
    selectedWorldEvent: null,
    setCurrentDate: (currentDate) => set({ currentDate }),
    setCurrentView: (currentView) => set({ currentView }),
    setSelectedEvent: (selectedEventId) => set({ selectedEventId, isModalOpen: !!selectedEventId }),
    setIsModalOpen: (isModalOpen) => {
        if (!isModalOpen)
            set({ selectedEventId: null });
        set({ isModalOpen });
    },
    updateWorldEventsSettings: (settings) => set(state => ({
        worldEventsSettings: { ...state.worldEventsSettings, ...settings }
    })),
    setSelectedWorldEvent: (selectedWorldEvent) => set({ selectedWorldEvent }),
    fetchEvents: async () => {
        set({ isLoading: true });
        try {
            const events = await getCalendarEvents();
            set({ events: events });
        }
        catch (error) {
            console.error('Failed to fetch calendar events:', error);
        }
        finally {
            set({ isLoading: false });
        }
    },
    addEvent: async (eventData) => {
        const now = Date.now();
        const newEvent = {
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
