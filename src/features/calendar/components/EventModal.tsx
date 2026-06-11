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

import { Checkbox } from "@/components/ui/Checkbox";
import { RECURRENCE_LABELS } from "../constants";
import { useToast } from "@/components/ui/Toast";

export function EventModal({ 
  isOpen, 
  onClose, 
  initialDate 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  initialDate?: Date 
}) {
  const addEvent = useCalendarStore(state => state.addEvent);
  const events = useCalendarStore(state => state.events);
  const selectedEventId = useCalendarStore(state => state.selectedEventId);
  const setSelectedEvent = useCalendarStore(state => state.setSelectedEvent);
  const updateEvent = useCalendarStore(state => state.updateEvent);
  const removeEvent = useCalendarStore(state => state.removeEvent);
  const { toast } = useToast();

  const editingEvent = selectedEventId ? events.find(e => e.id === selectedEventId) : null;

  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [allDay, setAllDay] = useState(false);
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState<EventColor>("indigo");
  const [recurrence, setRecurrence] = useState<RecurrenceType>("none");

  useEffect(() => {
    if (editingEvent) {
      setTitle(editingEvent.title);
      setStartDate(format(parseISO(editingEvent.startDate), "yyyy-MM-dd'T'HH:mm"));
      setEndDate(format(parseISO(editingEvent.endDate), "yyyy-MM-dd'T'HH:mm"));
      setAllDay(editingEvent.allDay);
      setLocation(editingEvent.location || "");
      setDescription(editingEvent.description || "");
      setColor(editingEvent.color);
      setRecurrence(editingEvent.recurrence?.type || "none");
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
      setRecurrence("none");
    }
  }, [editingEvent, initialDate, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const eventData: any = {
      id: editingEvent?.id || generateId(),
      title,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      allDay,
      location,
      description,
      color,
    };

    if (recurrence !== "none") {
      eventData.recurrence = { type: recurrence };
    }

    if (editingEvent) {
      await updateEvent({ ...editingEvent, ...eventData, updatedAt: Date.now() });
    } else {
      await addEvent(eventData);
    }

    onClose();
  };

  const handleDelete = async () => {
    if (editingEvent) {
      toast("Are you sure you want to delete this event?", "warn", {
        label: "Delete",
        onClick: async () => {
          await removeEvent(editingEvent.id);
          onClose();
        }
      });
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 animate-in fade-in" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-surface border border-border rounded-4xl p-8 shadow-2xl z-50 animate-in zoom-in-95 duration-200 overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue/10 flex items-center justify-center text-blue">
                <CalendarIcon className="w-5 h-5" />
              </div>
              <Dialog.Title className="text-xl font-black tracking-tight text-text">
                {editingEvent ? "Edit Event" : "Create Event"}
              </Dialog.Title>
            </div>
            <Dialog.Close asChild>
              <button className="p-2 hover:bg-bg rounded-xl text-text-4 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 no-scrollbar">
            <ToolInput
              label="Event Title"
              value={title}
              onChange={setTitle}
              placeholder="E.g. Weekly Review"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-4 ml-4">Start Time</label>
                <div className="relative group">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-4 group-focus-within:text-blue transition-colors" />
                  <input
                    type="datetime-local"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full h-12 pl-12 pr-4 bg-bg border border-border rounded-2xl text-xs font-bold focus:border-blue outline-none transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-4 ml-4">End Time</label>
                <div className="relative group">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-4 group-focus-within:text-blue transition-colors" />
                  <input
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full h-12 pl-12 pr-4 bg-bg border border-border rounded-2xl text-xs font-bold focus:border-blue outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 px-4 py-2 bg-bg/50 rounded-2xl border border-border/40">
              <div className="flex items-center gap-3">
                <Checkbox 
                  id="allDay" 
                  label="All Day"
                  checked={allDay} 
                  onChange={(e) => setAllDay(e.target.checked)}
                />
              </div>

              <div className="flex items-center gap-3 border-l border-border/40 pl-6">
                <label htmlFor="event-recurrence" className="text-[10px] font-black uppercase tracking-widest text-text-4">Repeat</label>
                <select
                  id="event-recurrence"
                  value={recurrence}
                  onChange={(e) => setRecurrence(e.target.value as RecurrenceType)}
                  className="bg-transparent text-xs font-bold text-blue outline-none cursor-pointer"
                >
                  {(Object.keys(RECURRENCE_LABELS) as RecurrenceType[]).map(type => (
                    <option key={type} value={type}>{RECURRENCE_LABELS[type]}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="relative group">
                <MapPin className="absolute left-4 top-3.5 w-4 h-4 text-text-4 group-focus-within:text-blue transition-colors" />
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Add location"
                  className="w-full h-12 pl-12 pr-4 bg-bg border border-border rounded-2xl text-xs font-bold focus:border-blue outline-none transition-all placeholder:text-text-4"
                />
              </div>

              <div className="relative group">
                <AlignLeft className="absolute left-4 top-4 w-4 h-4 text-text-4 group-focus-within:text-blue transition-colors" />
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add description or notes"
                  rows={3}
                  className="w-full pl-12 pr-4 py-3 bg-bg border border-border rounded-2xl text-xs font-bold focus:border-blue outline-none transition-all placeholder:text-text-4 resize-none"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-4 ml-4">Category Color</label>
              <div className="flex flex-wrap gap-3 px-2">
                {(Object.keys(COLOR_MAP) as EventColor[]).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={cn(
                      "w-10 h-10 rounded-2xl border-2 transition-all flex items-center justify-center",
                      color === c ? "border-text scale-110 shadow-lg" : "border-transparent opacity-40 hover:opacity-100"
                    )}
                    style={{ backgroundColor: COLOR_MAP[c].hex }}
                  >
                    {color === c && <div className="w-2 h-2 rounded-full bg-white shadow-sm" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-6 flex gap-4">
              {editingEvent && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-6 h-14 bg-error/10 text-error rounded-3xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-error hover:text-white transition-all active:scale-95"
                >
                  Delete
                </button>
              )}
              <button
                type="submit"
                className="flex-1 h-14 bg-blue text-white rounded-3xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-dark transition-all shadow-xl shadow-blue/20 active:scale-95"
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

