"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { usePomodoroStore } from '@/src/features/pomodoro-timer/store';
import { useSessionStore } from '@/src/store/useSessionStore';
import { SessionRestoredBanner } from '@/components/ui/SessionRestoredBanner';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Settings, Bell, Sparkles, Trophy, Coffee } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { PomodoroSettings } from './PomodoroSettings';

// STYLE-001: Standardized animation tokens
const TRANSITION = { type: "spring", bounce: 0.2, duration: 0.6 } as const;

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
  const sessions = usePomodoroStore(state => state.sessions);

  const saveState = useSessionStore(state => state.saveState);
  const loadState = useSessionStore(state => state.loadState);
  const clearState = useSessionStore(state => state.clearState);
  const [showRestoredBanner, setShowRestoredBanner] = useState(false);

  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(focusDuration * 60);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [notificationStatus, setNotificationStatus] = useState<NotificationPermission | 'unsupported'>('default');
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const totalDuration = (mode === 'focus' ? focusDuration : breakDuration) * 60;

  // STATS-001: Track current cycle
  const dailyCompleted = sessions.filter(s => 
    s.completed && 
    new Date(s.startTime).toDateString() === new Date().toDateString() &&
    s.type === 'focus'
  ).length;

  useEffect(() => {
    if ('Notification' in window) {
      setNotificationStatus(Notification.permission);
    } else {
      setNotificationStatus('unsupported');
    }
  }, []);

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
    if (!isActive) {
      setTimeLeft((mode === 'focus' ? focusDuration : breakDuration) * 60);
    }
  }, [focusDuration, breakDuration, mode, isActive]);

  const handleTimerEnd = useCallback(() => {
    playSound();
    addSession({ startTime: Date.now(), duration: totalDuration / 60, type: mode, completed: true });
    
    if (notificationStatus === 'granted') {
      new Notification(`Pomodoro: ${mode === 'focus' ? 'Focus' : 'Break'} session complete!`);
    }

    const nextMode = mode === 'focus' ? 'break' : 'focus';
    setMode(nextMode);
    setTimeLeft((nextMode === 'focus' ? focusDuration : breakDuration) * 60);
    setIsActive(false);
  }, [mode, focusDuration, breakDuration, addSession, totalDuration, notificationStatus]);

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

  const switchMode = (newMode: 'focus' | 'break') => {
    setIsActive(false);
    setMode(newMode);
  };
  
  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission !== 'granted') {
      const permission = await Notification.requestPermission();
      setNotificationStatus(permission);
    }
  };

  const handleClearSession = () => {
    clearState('pomodoro-timer');
    setDurations({ focus: 25, break: 5, longBreak: 15 });
    setShowRestoredBanner(false);
  };

  const progress = timeLeft / totalDuration;

  return (
    <div className="relative flex flex-col items-center justify-center gap-12 py-8 max-w-2xl mx-auto">
      <SessionRestoredBanner 
        isVisible={showRestoredBanner}
        onClear={handleClearSession}
        onDismiss={() => setShowRestoredBanner(false)}
      />

      {/* Header Stats */}
      <div className="w-full flex items-center justify-between px-6 py-4 bg-surface/40 backdrop-blur-md border border-border rounded-3xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-warning/10 flex items-center justify-center text-warning">
            <Trophy size={20} />
          </div>
          <div>
            <p className="text-tiny font-bold uppercase tracking-widest-sm text-text-4">Today's Focus</p>
            <p className="text-sm font-black text-text">{dailyCompleted} Sessions</p>
          </div>
        </div>

        <div className="h-8 w-px bg-border/50 mx-2" />

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue/10 flex items-center justify-center text-blue">
            <Sparkles size={20} />
          </div>
          <div>
            <p className="text-tiny font-bold uppercase tracking-widest-sm text-text-4">Current Streak</p>
            <p className="text-sm font-black text-text">{dailyCompleted % 4} / 4 Pomos</p>
          </div>
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="flex p-1.5 bg-surface border border-border rounded-2xl shadow-premium relative z-10">
        {(['focus', 'break'] as const).map((m) => (
          <button
            key={m}
            onClick={() => switchMode(m)}
            className={cn(
              "relative px-8 py-3 rounded-2xl text-tiny font-bold uppercase tracking-widest-sm-lg transition-all outline-none",
              mode === m ? "text-white" : "text-text-4 hover:text-text"
            )}
          >
            {mode === m && (
              <motion.div
                layoutId="pomo-mode"
                className="absolute inset-0 bg-blue rounded-2xl -z-10 shadow-md shadow-blue/10"
                transition={TRANSITION}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              {m === 'focus' ? <Sparkles size={14} /> : <Coffee size={14} />}
              {m}
            </span>
          </button>
        ))}
      </div>

      {/* Timer Card */}
      <div className="relative group">
        {/* Glow Effect */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1.1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 bg-blue/20 blur-3xl rounded-full -z-10"
              transition={{ repeat: Infinity, repeatType: "reverse", duration: 2 }}
            />
          )}
        </AnimatePresence>

        <div className="relative w-72 md:w-80 aspect-square rounded-full flex items-center justify-center bg-surface border border-border/50 shadow-surface-4 transition-all group-hover:border-blue/30">
          <svg className="absolute inset-0 w-full h-full transform -rotate-90 p-4" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="48"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="transparent"
              className="text-white/5"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="48"
              stroke="currentColor"
              className="text-blue"
              strokeWidth="2.5"
              strokeDasharray="301.6"
              initial={{ strokeDashoffset: 0 }}
              animate={{ strokeDashoffset: 301.6 * (1 - progress) }}
              transition={{ duration: 1, ease: "linear" }}
              fill="transparent"
              strokeLinecap="round"
            />
          </svg>
          <div className="text-center z-10">
            <motion.p 
              key={timeLeft}
              initial={{ scale: 0.95, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-7xl font-black font-mono tabular-nums tracking-tighter text-text"
            >
              {formatTime(timeLeft)}
            </motion.p>
            <p className="text-tiny font-bold uppercase tracking-widest-sm-2xl text-text-4 mt-2">
              {isActive ? 'Keep Going' : 'Ready?'}
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-8">
        <motion.button 
          whileHover={{ scale: 1.1, rotate: -30 }}
          whileTap={{ scale: 0.9 }}
          onClick={resetTimer} 
          title="Reset Timer"
          className="p-5 rounded-3xl bg-surface border border-border hover:border-blue/30 hover:text-blue transition-all shadow-sm"
        >
          <RotateCcw className="w-6 h-6" />
        </motion.button>
        
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleTimer} 
          className="w-28 h-28 rounded-5xl bg-blue text-white flex items-center justify-center shadow-2xl shadow-blue/40 hover:bg-blue/90 transition-all border-4 border-white/10"
        >
          {isActive ? <Pause className="w-12 h-12" /> : <Play className="w-12 h-12 ml-1" />}
        </motion.button>

        <motion.button 
          whileHover={{ scale: 1.1, rotate: 30 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsSettingsOpen(true)} 
          title="Settings"
          className="p-5 rounded-3xl bg-surface border border-border hover:border-blue/30 hover:text-blue transition-all shadow-sm"
        >
          <Settings className="w-6 h-6" />
        </motion.button>
      </div>
      
      {/* Footer Info */}
      <div className="flex flex-col items-center gap-4">
        {notificationStatus !== 'granted' && notificationStatus !== 'unsupported' && (
          <button 
            onClick={requestNotificationPermission}
            className="flex items-center gap-2 px-6 py-3 bg-blue/5 border border-blue/10 rounded-2xl text-tiny font-bold uppercase tracking-widest-sm text-blue hover:bg-blue/10 transition-all"
          >
            <Bell className="w-4 h-4" /> Enable Alerts
          </button>
        )}
        
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface/30 border border-border/50">
          <div className={cn("w-2 h-2 rounded-full", isActive ? "bg-success animate-pulse" : "bg-text-4")} />
          <span className="text-tiny font-bold uppercase tracking-widest-sm text-text-4">
            {isActive ? 'Session in progress' : 'Timer Paused'}
          </span>
        </div>
      </div>

      <PomodoroSettings 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </div>
  );
}
