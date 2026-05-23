"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X, Clock } from "lucide-react";
import { usePomodoroStore } from "@/src/store/usePomodoroStore";
import { SliderField } from "@/components/ui/SliderField";

interface PomodoroSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PomodoroSettings({ isOpen, onClose }: PomodoroSettingsProps) {
  const { focusDuration, breakDuration, longBreakDuration, setDurations } = usePomodoroStore();

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] animate-in fade-in duration-200" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-surface border border-border p-8 rounded-[32px] shadow-2xl z-[101] animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue/10 flex items-center justify-center text-blue">
                <Clock className="w-5 h-5" />
              </div>
              <Dialog.Title className="text-xl font-black tracking-tight">Timer Settings</Dialog.Title>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-bg rounded-xl transition-colors text-text-4">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            <SliderField 
              label="Focus Duration"
              id="focus-duration"
              min={1} 
              max={60} 
              step={1}
              value={focusDuration}
              onChange={(v) => setDurations({ focus: v, break: breakDuration, longBreak: longBreakDuration })}
              format={(v) => `${v}m`}
            />

            <SliderField 
              label="Short Break"
              id="break-duration"
              min={1} 
              max={30} 
              step={1}
              value={breakDuration}
              onChange={(v) => setDurations({ focus: focusDuration, break: v, longBreak: longBreakDuration })}
              format={(v) => `${v}m`}
            />

            <SliderField 
              label="Long Break"
              id="long-break-duration"
              min={1} 
              max={45} 
              step={1}
              value={longBreakDuration}
              onChange={(v) => setDurations({ focus: focusDuration, break: breakDuration, longBreak: v })}
              format={(v) => `${v}m`}
            />
          </div>

          <button
            onClick={onClose}
            className="w-full mt-10 py-4 bg-blue text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-blue/20 active:scale-[0.98] transition-all"
          >
            Apply Changes
          </button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
