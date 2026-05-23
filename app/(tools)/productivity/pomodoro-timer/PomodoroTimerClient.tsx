"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { usePomodoroStore } from '@/src/store/usePomodoroStore';
import { useSessionStore } from '@/src/store/useSessionStore';
import { SessionRestoredBanner } from '@/components/ui/SessionRestoredBanner';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Settings, Bell } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { PomodoroSettings } from './PomodoroSettings';

// Simple audio beep
const playSound = () => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
    oscillator.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.5);
  } catch(e) {
    console.warn("Could not play sound:", e);
  }
};

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

export default function PomodoroTimerClient() {
  const focusDuration = usePomodoroStore(state => state.focusDuration);
  const breakDuration = usePomodoroStore(state => state.breakDuration);
  const longBreakDuration = usePomodoroStore(state => state.longBreakDuration);
  const setDurations = usePomodoroStore(state => state.setDurations);
  const addSession = usePomodoroStore(state => state.addSession);

  const saveState = useSessionStore(state => state.saveState);
  const loadState = useSessionStore(state => state.loadState);
  const clearState = useSessionStore(state => state.clearState);
  const [showRestoredBanner, setShowRestoredBanner] = useState(false);

  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(focusDuration * 60);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const totalDuration = (mode === 'focus' ? focusDuration : breakDuration) * 60;

  useEffect(() => {
    const savedState = loadState<{ focus: number; break: number; longBreak: number }>('pomodoro-timer');
    if (savedState) {
      setDurations(savedState);
      setShowRestoredBanner(true);
    }
  }, [loadState, setDurations]);

  useEffect(() => {
    saveState('pomodoro-timer', { focus: focusDuration, break: breakDuration, longBreak: longBreakDuration });
  }, [focusDuration, breakDuration, longBreakDuration, saveState]);

  useEffect(() => {
    setTimeLeft(focusDuration * 60);
  }, [focusDuration]);

  const handleTimerEnd = useCallback(() => {
    playSound();
    addSession({ startTime: Date.now(), duration: totalDuration / 60, type: mode, completed: true });
    
    if (Notification.permission === 'granted') {
      new Notification(`Pomodoro: ${mode === 'focus' ? 'Focus' : 'Break'} session complete!`);
    }

    const nextMode = mode === 'focus' ? 'break' : 'focus';
    setMode(nextMode);
    setTimeLeft((nextMode === 'focus' ? focusDuration : breakDuration) * 60);
    setIsActive(false);
  }, [mode, focusDuration, breakDuration, addSession, totalDuration]);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimerEnd();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, handleTimerEnd]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft((mode === 'focus' ? focusDuration : breakDuration) * 60);
  };
  
  const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  };

  const handleClearSession = () => {
    clearState('pomodoro-timer');
    setDurations({ focus: 25, break: 5, longBreak: 15 });
    setShowRestoredBanner(false);
  };

  return (
    <div className="relative flex flex-col items-center justify-center gap-8 p-4">
      <SessionRestoredBanner 
        isVisible={showRestoredBanner}
        onClear={handleClearSession}
        onDismiss={() => setShowRestoredBanner(false)}
      />
      {/* Timer Card */}
      <div className="relative w-full max-w-sm aspect-square rounded-full bg-black/10 dark:bg-white/5 border border-white/10 backdrop-blur-2xl shadow-2xl flex items-center justify-center">
        <motion.div
          className="absolute inset-0 rounded-full border-[10px] border-blue"
          initial={{ scale: 0.9, rotate: -90 }}
          animate={{ pathLength: timeLeft / totalDuration }}
          style={{ pathLength: timeLeft / totalDuration }}
          transition={{ duration: 0.5 }}
        />
        <div className="text-center z-10">
          <p className="text-7xl font-bold font-mono tabular-nums">{formatTime(timeLeft)}</p>
          <p className="text-sm font-bold uppercase tracking-widest opacity-50">{mode}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-6">
        <button onClick={resetTimer} className="p-4 rounded-full bg-white/10 hover:bg-white/20 transition-colors"><RotateCcw /></button>
        <button onClick={toggleTimer} className="w-24 h-24 rounded-full bg-blue text-white flex items-center justify-center text-2xl font-bold shadow-lg shadow-blue/30">
          {isActive ? <Pause className="w-10 h-10" /> : <Play className="w-10 h-10" />}
        </button>
        <button onClick={() => setIsSettingsOpen(true)} className="p-4 rounded-full bg-white/10 hover:bg-white/20 transition-colors"><Settings /></button>
      </div>
      
      {/* Notification Button */}
      <button 
        onClick={requestNotificationPermission}
        className="flex items-center gap-2 text-sm text-text-4 hover:text-text"
      >
        <Bell className="w-4 h-4" /> Enable Notifications
      </button>

      <PomodoroSettings 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </div>
  );
}
