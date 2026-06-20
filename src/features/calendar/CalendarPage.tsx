"use client";

import { useEffect, useState } from "react";
import { useCalendarStore } from "./store";
import { CalendarHeader } from "./components/CalendarHeader";
import { MonthView } from "./components/MonthView";
import { WeekView } from "./components/WeekView";
import { DayView } from "./components/DayView";
import { AgendaView } from "./components/AgendaView";
import { EventModal } from "./components/EventModal";
import { motion, AnimatePresence } from "framer-motion";
import { useReminders } from "./hooks/useReminders";
import { addMonths, subMonths, addWeeks, subWeeks, addDays, subDays } from "date-fns";

import { useShallow } from "zustand/react/shallow";
import { WorldEventPanel } from "./components/WorldEventPanel";
import { CalendarSidebar } from "./components/CalendarSidebar";
import { X } from "lucide-react";

export default function CalendarPage() {
  const { 
    currentView, 
    setCurrentView, 
    currentDate, 
    setCurrentDate, 
    fetchEvents, 
    isLoading,
    isModalOpen,
    setIsModalOpen
  } = useCalendarStore(useShallow(state => ({
    currentView: state.currentView,
    setCurrentView: state.setCurrentView,
    currentDate: state.currentDate,
    setCurrentDate: state.setCurrentDate,
    fetchEvents: state.fetchEvents,
    isLoading: state.isLoading,
    isModalOpen: state.isModalOpen,
    setIsModalOpen: state.setIsModalOpen
  })));
  
  const selectedWorldEvent = useCalendarStore(state => state.selectedWorldEvent);
  const setSelectedWorldEvent = useCalendarStore(state => state.setSelectedWorldEvent);

  const [initialDate, setInitialDate] = useState<Date>(new Date());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useReminders();

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.key.toLowerCase()) {
        case 't':
          setCurrentDate(new Date());
          break;
        case 'n':
          handleAddEvent();
          break;
        case 'm':
          setCurrentView('month');
          break;
        case 'w':
          setCurrentView('week');
          break;
        case 'd':
          setCurrentView('day');
          break;
        case 'a':
          setCurrentView('agenda');
          break;
        case 'arrowleft':
          handlePrev();
          break;
        case 'arrowright':
          handleNext();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentView, currentDate]);

  const handlePrev = () => {
    if (currentView === 'month') setCurrentDate(subMonths(currentDate, 1));
    else if (currentView === 'week') setCurrentDate(subWeeks(currentDate, 1));
    else setCurrentDate(subDays(currentDate, 1));
  };

  const handleNext = () => {
    if (currentView === 'month') setCurrentDate(addMonths(currentDate, 1));
    else if (currentView === 'week') setCurrentDate(addWeeks(currentDate, 1));
    else setCurrentDate(addDays(currentDate, 1));
  };

  const handleAddEvent = (date?: Date) => {
    setInitialDate(date || new Date());
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-2 md:px-8 space-y-4 md:space-y-8 min-h-screen flex flex-col pb-10">
      <CalendarHeader onAddEvent={() => handleAddEvent()} onToggleSidebar={() => setIsSidebarOpen(prev => !prev)} />

      <div className="flex-1 flex flex-col lg:flex-row gap-6 md:gap-8 min-h-0 relative">
        <div className="flex-1 flex flex-col min-h-0 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 flex flex-col min-h-0"
            >
              {currentView === 'month' && <MonthView onAddEvent={handleAddEvent} />}
              {currentView === 'week' && <WeekView />}
              {currentView === 'day' && <DayView />}
              {currentView === 'agenda' && <AgendaView />}
            </motion.div>
          </AnimatePresence>

          {isLoading && (
            <div className="absolute inset-0 bg-surface/20 backdrop-blur-md flex items-center justify-center z-above rounded-4xl border border-border/20">
              <div className="w-14 h-14 border-4 border-blue/10 border-t-blue rounded-full animate-spin shadow-lg shadow-blue/20" />
            </div>
          )}
        </div>

        {/* Desktop Sidebar (inline) */}
        <div className="hidden lg:block">
          <CalendarSidebar />
        </div>
      </div>

      <EventModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialDate={initialDate}
      />

      <AnimatePresence>
        {selectedWorldEvent && (
          <WorldEventPanel
            event={selectedWorldEvent.event}
            date={selectedWorldEvent.date}
            onClose={() => setSelectedWorldEvent(null)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Settings Sidebar Drawer */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-modalBackdrop lg:hidden"
            />
            {/* Slide-in Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 280 }}
              className="fixed left-0 top-0 bottom-0 w-[85vw] max-w-80 bg-surface/95 backdrop-blur-2xl border-r border-border/40 z-modal p-6 flex flex-col shadow-2xl overflow-y-auto no-scrollbar lg:hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm font-black uppercase tracking-wider text-text-3">Preferences</span>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="w-11 h-11 rounded-lg bg-surface-2 border border-border/30 flex items-center justify-center text-text-3 hover:text-text active:scale-95 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <CalendarSidebar />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

