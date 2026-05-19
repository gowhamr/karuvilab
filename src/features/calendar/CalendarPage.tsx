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
  } = useCalendarStore();
  const [initialDate, setInitialDate] = useState<Date>(new Date());

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
    <div className="max-w-[1600px] mx-auto px-4 md:px-8 space-y-6 md:space-y-8 min-h-screen flex flex-col pb-10">
      <CalendarHeader onAddEvent={() => handleAddEvent()} />

      <main className="flex-1 flex flex-col min-h-0 relative">
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
          <div className="absolute inset-0 bg-surface/20 backdrop-blur-md flex items-center justify-center z-40 rounded-[32px] border border-border/20">
            <div className="w-14 h-14 border-[5px] border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin shadow-lg shadow-indigo-500/20" />
          </div>
        )}
      </main>

      <EventModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialDate={initialDate}
      />
    </div>
  );
}
