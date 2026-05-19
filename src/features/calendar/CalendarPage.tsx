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

export default function CalendarPage() {
  const { currentView, fetchEvents, isLoading } = useCalendarStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialDate, setInitialDate] = useState<Date>(new Date());

  useReminders();

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleAddEvent = (date?: Date) => {
    setInitialDate(date || new Date());
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 min-h-[800px] flex flex-col">
      <CalendarHeader onAddEvent={() => handleAddEvent()} />

      <main className="flex-1 flex flex-col min-h-0 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 flex flex-col min-h-0"
          >
            {currentView === 'month' && <MonthView onAddEvent={handleAddEvent} />}
            {currentView === 'week' && <WeekView />}
            {currentView === 'day' && <DayView />}
            {currentView === 'agenda' && <AgendaView />}
          </motion.div>
        </AnimatePresence>

        {isLoading && (
          <div className="absolute inset-0 bg-surface/40 backdrop-blur-[2px] flex items-center justify-center z-40 rounded-[32px]">
            <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
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
