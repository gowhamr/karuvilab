"use client";

import { useEffect, useRef } from "react";
import { useCalendarStore } from "../store";
import { parseISO, differenceInMinutes, isFuture } from "date-fns";

export function useReminders() {
  const events = useCalendarStore(state => state.events);
  const notifiedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) return;

    if (Notification.permission === "default") {
      Notification.requestPermission();
    }

    const checkReminders = () => {
      if (Notification.permission !== "granted") return;

      const now = new Date();
      
      events.forEach(event => {
        if (!event.reminderMinutes || notifiedRef.current.has(event.id)) return;
        
        const start = parseISO(event.startDate);
        if (!isFuture(start)) return;

        const diff = differenceInMinutes(start, now);
        
        if (diff <= event.reminderMinutes && diff > 0) {
          new Notification(`Reminder: ${event.title}`, {
            body: `Starting in ${diff} minutes${event.location ? ` at ${event.location}` : ''}`,
            icon: '/favicon.ico'
          });
          notifiedRef.current.add(event.id);
        }
      });
    };

    const interval = setInterval(checkReminders, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, [events, notifiedRef]);
}
