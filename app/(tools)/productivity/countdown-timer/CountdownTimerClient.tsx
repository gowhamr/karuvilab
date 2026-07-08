"use client";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Play, Square, Timer, Settings2, BellRing, Pause, RotateCcw } from "lucide-react";
import * as Popover from '@radix-ui/react-popover';
import { cn } from "@/src/lib/utils";
import { useFullscreenContext } from "@/src/contexts/FullscreenContext";
import { useCountdownTimerStore } from "@/src/features/countdown-timer/store";

// Helper to play a simple beep using Web Audio API so we don't need external files
function playAlarmBeep() {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    // Play 3 beeps
    for (let i = 0; i < 3; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime + (i * 0.5));
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + (i * 0.5) + 0.3);
      
      gain.gain.setValueAtTime(1, ctx.currentTime + (i * 0.5));
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + (i * 0.5) + 0.3);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(ctx.currentTime + (i * 0.5));
      osc.stop(ctx.currentTime + (i * 0.5) + 0.3);
    }
  } catch (e) {
    console.error("Audio play failed", e);
  }
}

function formatTime(ms: number, showMs: boolean = true) {
  if (ms <= 0) return showMs ? "00:00.00" : "00:00";
  
  const totalSecs = Math.floor(ms / 1000);
  const hrs = Math.floor(totalSecs / 3600);
  const mins = Math.floor((totalSecs % 3600) / 60);
  const secs = totalSecs % 60;
  const millis = Math.floor((ms % 1000) / 10);

  const mStr = String(mins).padStart(2, "0");
  const sStr = String(secs).padStart(2, "0");
  const msStr = String(millis).padStart(2, "0");

  if (hrs > 0) {
    const hStr = String(hrs).padStart(2, "0");
    return showMs ? `${hStr}:${mStr}:${sStr}.${msStr}` : `${hStr}:${mStr}:${sStr}`;
  }

  return showMs ? `${mStr}:${sStr}.${msStr}` : `${mStr}:${sStr}`;
}

export default function CountdownTimerClient() {
  const { displayMode, activeToolId } = useFullscreenContext();
  const isDashboard = displayMode === 'dashboard' && activeToolId === 'countdown-timer';
  
  const settings = useCountdownTimerStore(state => state.settings);
  const updateSettings = useCountdownTimerStore(state => state.updateSettings);

  // States
  const [inputH, setInputH] = useState("00");
  const [inputM, setInputM] = useState("05");
  const [inputS, setInputS] = useState("00");
  
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  
  // High precision tracking
  const [targetTime, setTargetTime] = useState<number | null>(null);
  const [remainingTime, setRemainingTime] = useState(0);
  const [pauseDuration, setPauseDuration] = useState(0); // time left when paused
  
  const requestRef = useRef<number | null>(null);
  const alarmPlayedRef = useRef(false);

  const totalInputMs = (parseInt(inputH || "0") * 3600 + parseInt(inputM || "0") * 60 + parseInt(inputS || "0")) * 1000;

  const animateRef = useRef<(time: number) => void>(() => {});

  useEffect(() => {
    animateRef.current = (time: number) => {
      if (targetTime !== null && isRunning && !isPaused) {
        const now = performance.now();
        const timeLeft = Math.max(0, targetTime - now);
        setRemainingTime(timeLeft);
        
        if (timeLeft <= 0) {
          setIsRunning(false);
          setIsFinished(true);
          if (settings.soundEnabled && !alarmPlayedRef.current) {
            playAlarmBeep();
            alarmPlayedRef.current = true;
          }
          return; // stop animation
        }
      }
      requestRef.current = requestAnimationFrame(animateRef.current);
    };
  });

  useEffect(() => {
    if (isRunning && !isPaused) {
      requestRef.current = requestAnimationFrame(animateRef.current);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isRunning, isPaused]);

  const handleStart = () => {
    if (totalInputMs <= 0) return;
    const now = performance.now();
    setTargetTime(now + (remainingTime > 0 ? remainingTime : totalInputMs));
    setIsRunning(true);
    setIsPaused(false);
    setIsFinished(false);
  };

  const handlePause = () => {
    setIsPaused(true);
    setIsRunning(false);
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsPaused(false);
    setIsFinished(false);
    setRemainingTime(0);
    setTargetTime(null);
    alarmPlayedRef.current = false;
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
  };

  const handleStopAlarm = () => {
    setIsFinished(false);
    handleReset();
  };

  const displayString = useMemo(() => {
    const timeToFormat = isRunning || isPaused || isFinished ? remainingTime : totalInputMs;
    const ms = Math.floor((timeToFormat % 1000) / 10);
    const totalSecs = Math.floor(timeToFormat / 1000);
    const secs = totalSecs % 60;
    const mins = Math.floor(totalSecs / 60) % 60;
    const hrs = Math.floor(totalSecs / 3600);

    const pad = (n: number) => String(n).padStart(2, "0");
    const base = `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
    return settings.showMilliseconds ? `${base}.${pad(ms)}` : base;
  }, [remainingTime, totalInputMs, isRunning, isPaused, isFinished, settings.showMilliseconds]);

  const textSize = isDashboard ? {
    small: 'text-4xl md:text-6xl',
    medium: 'text-6xl md:text-8xl',
    large: 'text-8xl md:text-[12rem]',
    huge: 'text-[10rem] md:text-[16rem]'
  }[settings.clockSize] || 'text-8xl md:text-[14rem]' : 'text-6xl md:text-8xl';

  const renderMainClock = () => (
    <div className={cn("font-mono font-black tabular-nums tracking-tighter text-center transition-colors", 
      textSize,
      isFinished ? "text-error animate-pulse" : ""
    )}>
      {displayString}
    </div>
  );

  const handleInputChange = (setter: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/[^0-9]/g, '');
    if (val.length > 2) val = val.slice(-2);
    setter(val);
  };

  const renderInputScreen = () => (
    <div className={cn("flex flex-col items-center justify-center gap-6", isDashboard ? "scale-125 md:scale-150" : "")}>
      <div className="flex flex-col items-center gap-2 mb-2">
        <p className="text-sm font-bold text-text-4 uppercase tracking-widest">Custom Timer</p>
        <div className="flex items-center gap-4 text-5xl md:text-7xl font-mono font-black">
          <div className="flex flex-col items-center gap-2">
            <input type="text" value={inputH} onChange={handleInputChange(setInputH)} onFocus={(e) => e.target.select()} className="w-20 md:w-24 text-center bg-transparent border-b-4 border-border focus:border-blue outline-none transition-colors py-2" placeholder="00" />
            <span className="text-xs md:text-sm font-bold text-text-4 uppercase tracking-widest">Hours</span>
          </div>
          <span className="mb-6 md:mb-8">:</span>
          <div className="flex flex-col items-center gap-2">
            <input type="text" value={inputM} onChange={handleInputChange(setInputM)} onFocus={(e) => e.target.select()} className="w-20 md:w-24 text-center bg-transparent border-b-4 border-border focus:border-blue outline-none transition-colors py-2" placeholder="00" />
            <span className="text-xs md:text-sm font-bold text-text-4 uppercase tracking-widest">Mins</span>
          </div>
          <span className="mb-6 md:mb-8">:</span>
          <div className="flex flex-col items-center gap-2">
            <input type="text" value={inputS} onChange={handleInputChange(setInputS)} onFocus={(e) => e.target.select()} className="w-20 md:w-24 text-center bg-transparent border-b-4 border-border focus:border-blue outline-none transition-colors py-2" placeholder="00" />
            <span className="text-xs md:text-sm font-bold text-text-4 uppercase tracking-widest">Secs</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 max-w-sm mb-4">
        {[
          { label: '1m', h: '00', m: '01', s: '00' },
          { label: '3m', h: '00', m: '03', s: '00' },
          { label: '5m', h: '00', m: '05', s: '00' },
          { label: '10m', h: '00', m: '10', s: '00' },
          { label: '15m', h: '00', m: '15', s: '00' },
          { label: '30m', h: '00', m: '30', s: '00' },
          { label: '1h', h: '01', m: '00', s: '00' },
        ].map(preset => (
          <button
            key={preset.label}
            onClick={() => {
              setInputH(preset.h);
              setInputM(preset.m);
              setInputS(preset.s);
            }}
            className="px-3 py-1.5 rounded-lg bg-surface-elevated hover:bg-bg border border-border text-xs font-bold transition-all focus:ring-2 focus:ring-blue"
          >
            {preset.label}
          </button>
        ))}
      </div>

      <button
        onClick={handleStart}
        disabled={totalInputMs <= 0}
        className="px-10 py-3 md:px-12 md:py-4 bg-blue hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-lg md:text-xl rounded-full tracking-widest uppercase flex items-center gap-3 shadow-xl shadow-blue/20 transition-all active:scale-95"
      >
        <Play className="w-5 h-5 md:w-6 md:h-6 fill-current" />
        Start Timer
      </button>
    </div>
  );

  const renderControls = () => {
    if (isFinished) {
      return (
        <div className={cn("flex items-center justify-center gap-6", isDashboard ? "mt-12 scale-150" : "mt-8")}>
          <button
            onClick={handleStopAlarm}
            className="px-8 py-4 rounded-full flex items-center justify-center gap-3 transition-all focus:outline-none focus:ring-4 active:scale-95 text-white shadow-2xl bg-error hover:bg-error/90 focus:ring-error/30 shadow-error/20 font-black uppercase tracking-widest text-lg"
          >
            <BellRing className="w-6 h-6 animate-bounce" />
            Stop Alarm
          </button>
        </div>
      );
    }

    return (
      <div className={cn("flex items-center justify-center gap-6", isDashboard ? "mt-12 scale-150" : "mt-8")}>
        <button
          onClick={handleReset}
          className="w-20 h-20 rounded-full flex items-center justify-center border-4 transition-all focus:outline-none focus:ring-4 focus:ring-blue/30 active:scale-95 border-text-4 text-text-3 hover:border-text-3"
          title="Reset"
        >
          <RotateCcw className="w-8 h-8" />
        </button>

        <button
          onClick={isPaused ? handleStart : handlePause}
          className={cn(
            "w-24 h-24 rounded-full flex items-center justify-center transition-all focus:outline-none focus:ring-4 active:scale-95 text-white shadow-2xl",
            isPaused 
              ? "bg-success hover:bg-success/90 focus:ring-success/30 shadow-success/20 pl-2"
              : "bg-warning hover:bg-warning/90 focus:ring-warning/30 shadow-warning/20" 
          )}
          title={isPaused ? "Resume" : "Pause"}
        >
          {isPaused ? <Play className="w-12 h-12 fill-current" /> : <Pause className="w-10 h-10 fill-current" />}
        </button>
      </div>
    );
  };

  const renderSettingsPopover = () => (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button className={cn("p-3 rounded-xl backdrop-blur-md transition-colors border", 
          isDashboard ? "bg-surface-elevated/20 hover:bg-surface-elevated/40 border-border/10" : "bg-surface hover:bg-surface-elevated border-border"
        )}>
          <Settings2 className="w-6 h-6 opacity-60 hover:opacity-100" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content sideOffset={8} align="end" className="w-80 bg-surface border border-border shadow-2xl rounded-2xl p-4 z-popover animate-in fade-in zoom-in-95">
          <h3 className="font-bold text-sm uppercase tracking-widest text-text-4 mb-4">Settings</h3>
          
          <div className="space-y-4">
            {isDashboard && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-3">Theme (Dashboard)</label>
                <select 
                  value={settings.dashboardTheme} 
                  onChange={e => updateSettings({ dashboardTheme: e.target.value as any })}
                  className="w-full bg-surface-elevated border border-border rounded-lg p-2 text-sm outline-none"
                >
                  <option value="dark">Dark (Default)</option>
                  <option value="amoled">Pitch Black (AMOLED)</option>
                  <option value="light">Light Mode</option>
                  <option value="matrix">Matrix Hacker</option>
                </select>
              </div>
            )}

            {isDashboard && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-3">Clock Size</label>
                <div className="flex gap-2">
                  {['small', 'medium', 'large', 'huge'].map(size => (
                    <button 
                      key={size}
                      onClick={() => updateSettings({ clockSize: size as any })}
                      className={cn("flex-1 py-1.5 rounded text-xs font-bold capitalize transition-colors", settings.clockSize === size ? "bg-blue text-white" : "bg-surface-elevated text-text-4 hover:text-text")}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2 pt-2 border-t border-border">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm font-medium">Show Milliseconds</span>
                <input type="checkbox" checked={settings.showMilliseconds} onChange={e => updateSettings({ showMilliseconds: e.target.checked })} className="accent-blue" />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm font-medium">Play Alarm Sound</span>
                <input type="checkbox" checked={settings.soundEnabled} onChange={e => updateSettings({ soundEnabled: e.target.checked })} className="accent-blue" />
              </label>
            </div>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );

  const bgClasses = isDashboard ? {
    dark: 'bg-bg text-text',
    light: 'bg-slate-50 text-slate-900',
    amoled: 'bg-black text-white',
    blue: 'bg-blue-950 text-blue-50',
    matrix: 'bg-black text-green-500',
  }[settings.dashboardTheme] || 'bg-bg text-text' : '';

  if (isDashboard) {
    return (
      <div className={cn("h-full w-full flex flex-col items-center justify-center relative overflow-hidden", bgClasses)}>
        <div className="absolute top-6 right-6 z-modal">
          {renderSettingsPopover()}
        </div>
        
        <div className="flex flex-col items-center justify-center w-full max-w-7xl px-8 flex-1">
          {!isRunning && !isPaused && !isFinished ? (
            renderInputScreen()
          ) : (
            <>
              {renderMainClock()}
              {renderControls()}
            </>
          )}
        </div>

        <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between opacity-30 text-sm font-bold uppercase tracking-widest border-t-2 border-current pt-4">
          <div className="flex items-center gap-2">
            <Timer className="w-4 h-4" />
            High Precision Active
          </div>
          <div>Esc to Exit Full Screen</div>
        </div>
      </div>
    );
  }

  // Normal / Focus Mode
  return (
    <div className="space-y-8 max-w-4xl mx-auto flex flex-col items-center py-12">
      <div className="w-full flex justify-end px-4">
        {renderSettingsPopover()}
      </div>
      
      <div className="bg-surface border border-border rounded-5xl p-12 shadow-2xl w-full flex flex-col items-center justify-center overflow-hidden relative min-h-[400px]">
        {!isRunning && !isPaused && !isFinished ? (
          renderInputScreen()
        ) : (
          <>
            {renderMainClock()}
            {renderControls()}
          </>
        )}
      </div>
    </div>
  );
}
