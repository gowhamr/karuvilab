"use client";

import { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useCalendarStore } from "../store";
import { format, parseISO, addHours, startOfHour } from "date-fns";
import { X, MapPin, AlignLeft, Clock, Calendar as CalendarIcon } from "lucide-react";
import { ToolInput } from "@/components/ui/ToolInput";
import { COLOR_MAP } from "../constants";
import { EventColor, RecurrenceType } from "../types";
import { generateId } from "../utils";
import { cn } from "@/src/lib/utils";

export function EventModal({ 
  isOpen, 
  onClose, 
  initialDate 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  initialDate?: Date 
}) {
  const { addEvent, events, selectedEventId, setSelectedEvent, updateEvent, removeEvent } = useCalendarStore();
  
  const editingEvent = selectedEventId ? events.find(e => e.id === selectedEventId) : null;

  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [allDay, setAllDay] = useState(false);
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState<EventColor>("indigo");

  useEffect(() => {
    if (editingEvent) {
      setTitle(editingEvent.title);
      setStartDate(format(parseISO(editingEvent.startDate), "yyyy-MM-dd'T'HH:mm"));
      setEndDate(format(parseISO(editingEvent.endDate), "yyyy-MM-dd'T'HH:mm"));
      setAllDay(editingEvent.allDay);
      setLocation(editingEvent.location || "");
      setDescription(editingEvent.description || "");
      setColor(editingEvent.color);
    } else if (initialDate) {
      const start = startOfHour(initialDate);
      const end = addHours(start, 1);
      setTitle("");
      setStartDate(format(start, "yyyy-MM-dd'T'HH:mm"));
      setEndDate(format(end, "yyyy-MM-dd'T'HH:mm"));
      setAllDay(false);
      setLocation("");
      setDescription("");
      setColor("indigo");
    }
  }, [editingEvent, initialDate, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const eventData = {
      id: editingEvent?.id || generateId(),
      title,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      allDay,
      location,
      description,
      color,
    };

    if (editingEvent) {
      await updateEvent({ ...editingEvent, ...eventData, updatedAt: Date.now() });
    } else {
      await addEvent(eventData);
    }
    
    onClose();
  };

  const handleDelete = async () => {
    if (editingEvent) {
      await removeEvent(editingEvent.id);
      onClose();
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 animate-in fade-in" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-surface border border-border rounded-[32px] p-8 shadow-2xl z-50 animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between mb-8">
            <Dialog.Title className="text-xl font-black tracking-tight text-text">
              {editingEvent ? "Edit Event" : "Create Event"}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="p-2 hover:bg-bg rounded-xl text-text-4 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <ToolInput
              label="Event Title"
              value={title}
              onChange={setTitle}
              placeholder="E.g. Design Sync"
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-text-4 ml-4">Start</label>
                <input
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full h-12 px-4 bg-bg border border-border rounded-2xl text-xs font-bold focus:border-indigo-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-text-4 ml-4">End</label>
                <input
                  type="datetime-local"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full h-12 px-4 bg-bg border border-border rounded-2xl text-xs font-bold focus:border-indigo-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 px-4">
              <input 
                type="checkbox" 
                id="allDay" 
                checked={allDay} 
                onChange={(e) => setAllDay(e.target.checked)}
                className="w-4 h-4 rounded border-border text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="allDay" className="text-xs font-bold text-text-2">All Day Event</label>
            </div>

            <ToolInput
              label="Location"
              value={location}
              onChange={setLocation}
              placeholder="Add location"
            />

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-text-4 ml-4">Color Category</label>
              <div className="flex flex-wrap gap-2 px-2">
                {(Object.keys(COLOR_MAP) as EventColor[]).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={cn(
                      "w-8 h-8 rounded-full border-2 transition-all",
                      color === c ? "border-text scale-110" : "border-transparent opacity-60 hover:opacity-100"
                    )}
                    style={{ backgroundColor: COLOR_MAP[c].hex }}
                  />
                ))}
              </div>
            </div>

            <div className="pt-6 flex gap-3">
              {editingEvent && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-6 h-12 bg-red-500/10 text-red-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                >
                  Delete
                </button>
              )}
              <button
                type="submit"
                className="flex-1 h-12 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20"
              >
                {editingEvent ? "Save Changes" : "Create Event"}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
