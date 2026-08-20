"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Flag, 
  Settings2, 
  Download, 
  Copy, 
  Share2, 
  Zap, 
  Timer, 
  Flame, 
  Activity, 
  Check, 
  Volume2, 
  VolumeX, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Sparkles,
  ShieldCheck,
  History,
  Trophy,
  GitCompare,
  Trash2,
  BookmarkPlus,
  BarChart2,
  X
} from "lucide-react";
import * as Popover from '@radix-ui/react-popover';
import * as Dialog from '@radix-ui/react-dialog';
import { cn } from "@/src/lib/utils";
import { useFullscreenContext } from "@/src/contexts/FullscreenContext";
import { useStopwatchStore } from "@/src/features/stopwatch/store";
import { 
  PrecisionMode,
  LapRecord,
  SavedSession,
  formatStopwatchTime, 
  formatDeltaTime,
  computeLapRecords,
  computeStopwatchStats,
  exportStopwatchCSV,
  exportStopwatchJSON,
  exportStopwatchText,
  useWakeLock,
  playCountdownBeep,
  playLapChime,
  playBeep,
  unlockAudioContext,
  getReactionBenchmarkTier,
  computeSessionPaceTrend,
  computeLapDistribution,
  computeReactionStats,
  compareStopwatchSessions,
  useStopwatchSessionStore
} from "@/src/features/stopwatch";
import { ToolWorkspace } from "@/components/ui/ToolWorkspace";
import { MetricCard } from "@/components/ui/MetricCard";
import { QRModal } from "@/components/ui/QRModal";
import { useToast } from "@/components/ui/Toast";
import { blobManager } from "@/src/lib/blob-manager";

type StopwatchTabMode = 'standard' | 'countdown' | 'interval' | 'reaction';

export default function StopwatchClient() {
  const { displayMode, activeToolId } = useFullscreenContext();
  const isDashboard = displayMode === 'dashboard' && activeToolId === 'stopwatch';
  const { toast } = useToast();

  const settings = useStopwatchStore((s) => s.settings);
  const updateSettings = useStopwatchStore((s) => s.updateSettings);

  // Phase 5 Session Store & Personal Records
  const sessions = useStopwatchSessionStore((s) => s.sessions);
  const personalRecords = useStopwatchSessionStore((s) => s.personalRecords);
  const saveSessionAction = useStopwatchSessionStore((s) => s.saveSession);
  const deleteSessionAction = useStopwatchSessionStore((s) => s.deleteSession);
  const clearAllSessionsAction = useStopwatchSessionStore((s) => s.clearAllSessions);
  const recordReactionScoreAction = useStopwatchSessionStore((s) => s.recordReactionScore);

  const [tabMode, setTabMode] = useState<StopwatchTabMode>('standard');
  const [precision, setPrecision] = useState<PrecisionMode>(settings.precision || 'milliseconds');

  // Standard Stopwatch State
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [rawLaps, setRawLaps] = useState<number[]>([]);
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [historyTab, setHistoryTab] = useState<'sessions' | 'records' | 'compare'>('sessions');

  // Comparison State
  const [compareSessionAId, setCompareSessionAId] = useState<string | null>(null);
  const [compareSessionBId, setCompareSessionBId] = useState<string | null>(null);

  // Countdown Start Mode State
  const [countdownFrom, setCountdownFrom] = useState(3);
  const [countdownValue, setCountdownValue] = useState<number | null>(null);
  const [isCountingDown, setIsCountingDown] = useState(false);

  // Interval / HIIT Timer State
  const [intervalState, setIntervalState] = useState<'idle' | 'prep' | 'work' | 'rest' | 'complete'>('idle');
  const [currentRound, setCurrentRound] = useState(1);
  const [intervalTimeRemaining, setIntervalTimeRemaining] = useState(0);
  const [isIntervalRunning, setIsIntervalRunning] = useState(false);
  const intervalTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Reaction Timer State
  const [reactionState, setReactionState] = useState<'idle' | 'waiting' | 'ready' | 'result' | 'early'>('idle');
  const [reactionStartTime, setReactionStartTime] = useState<number | null>(null);
  const [reactionScore, setReactionScore] = useState<number | null>(null);
  const [reactionHistory, setReactionHistory] = useState<number[]>([]);
  const [reactionFalseStarts, setReactionFalseStarts] = useState(0);
  const reactionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Screen Wake Lock
  const shouldWakeLock = isRunning || isIntervalRunning || isCountingDown || reactionState === 'waiting';
  const { isLocked: isWakeLocked } = useWakeLock(shouldWakeLock);

  // Animation Frame for Precision Stopwatch
  const requestRef = useRef<number | null>(null);
  const animateRef = useRef<() => void>(() => {});

  animateRef.current = () => {
    if (startTime !== null && isRunning) {
      setElapsed(performance.now() - startTime);
    }
    requestRef.current = requestAnimationFrame(animateRef.current);
  };

  useEffect(() => {
    if (isRunning) {
      requestRef.current = requestAnimationFrame(animateRef.current);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isRunning]);

  // Immediate elapsed time sync when user switches back from another tab/app
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isRunning && startTime !== null) {
        setElapsed(performance.now() - startTime);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isRunning, startTime]);

  // Derived Lap Records & Statistics
  const lapRecords = useMemo(() => computeLapRecords(rawLaps, elapsed), [rawLaps, elapsed]);
  const stats = useMemo(() => computeStopwatchStats(rawLaps, elapsed), [rawLaps, elapsed]);

  // Phase 5 Derived Analytics: Pace Trends & Distributions
  const paceTrend = useMemo(() => computeSessionPaceTrend(lapRecords), [lapRecords]);
  const lapDistribution = useMemo(() => computeLapDistribution(lapRecords, 4), [lapRecords]);
  const reactionStats = useMemo(() => computeReactionStats(reactionHistory, reactionFalseStarts), [reactionHistory, reactionFalseStarts]);

  // Core Stopwatch Actions
  const toggleStart = useCallback(() => {
    unlockAudioContext();
    if (isRunning) {
      setIsRunning(false);
    } else {
      if (startTime === null) {
        setStartTime(performance.now());
      } else {
        setStartTime(performance.now() - elapsed);
      }
      setIsRunning(true);
    }
  }, [isRunning, startTime, elapsed]);

  const handleLap = useCallback(() => {
    if (!isRunning) return;
    const previousLapsSum = rawLaps.reduce((a, b) => a + b, 0);
    const lapDuration = Math.max(0, elapsed - previousLapsSum);
    setRawLaps((prev) => [...prev, lapDuration]);

    if (settings.soundEnabled) {
      playLapChime();
    }
  }, [isRunning, elapsed, rawLaps, settings.soundEnabled]);

  const handleReset = useCallback(() => {
    setIsRunning(false);
    setStartTime(null);
    setElapsed(0);
    setRawLaps([]);
  }, []);

  // Save Current Session to History
  const handleSaveSession = () => {
    if (elapsed === 0) {
      toast("Cannot save an empty session.", "error");
      return;
    }
    const sessionName = `Session ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    saveSessionAction({
      name: sessionName,
      mode: tabMode,
      totalDurationMs: elapsed,
      lapCount: rawLaps.length,
      bestLapMs: stats.fastestLapMs,
      slowestLapMs: stats.slowestLapMs,
      avgLapMs: stats.avgLapMs,
      consistencyScore: stats.consistencyScore,
      rawLaps,
    });
    toast(`Saved "${sessionName}" to history.`, "success");
  };

  // Reaction Timer Implementation
  const handleReactionClick = useCallback(() => {
    unlockAudioContext();
    if (reactionState === 'idle' || reactionState === 'result' || reactionState === 'early') {
      setReactionState('waiting');
      const delay = Math.floor(Math.random() * 3000) + 1500;
      reactionTimeoutRef.current = setTimeout(() => {
        setReactionState('ready');
        setReactionStartTime(performance.now());
        if (settings.soundEnabled) playBeep(1000, 100);
      }, delay);
    } else if (reactionState === 'waiting') {
      if (reactionTimeoutRef.current) clearTimeout(reactionTimeoutRef.current);
      setReactionFalseStarts((c) => c + 1);
      setReactionState('early');
    } else if (reactionState === 'ready' && reactionStartTime !== null) {
      const score = Math.round(performance.now() - reactionStartTime);
      setReactionScore(score);
      setReactionHistory((prev) => [score, ...prev.slice(0, 19)]);
      recordReactionScoreAction(score);
      setReactionState('result');
      if (settings.soundEnabled) playLapChime();
    }
  }, [reactionState, reactionStartTime, settings.soundEnabled, recordReactionScoreAction]);

  // Keyboard Shortcuts Handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        if (tabMode === 'standard') {
          toggleStart();
        } else if (tabMode === 'reaction') {
          handleReactionClick();
        }
      } else if (e.key === 'l' || e.key === 'L') {
        if (tabMode === 'standard' && isRunning) {
          e.preventDefault();
          handleLap();
        }
      } else if (e.key === 'r' || e.key === 'R') {
        if (tabMode === 'standard' && !isRunning) {
          e.preventDefault();
          handleReset();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [tabMode, isRunning, toggleStart, handleLap, handleReset, handleReactionClick]);

  // Countdown Start Mode Implementation
  const startCountdownSequence = () => {
    unlockAudioContext();
    setIsCountingDown(true);
    setCountdownValue(countdownFrom);
    handleReset();

    if (settings.soundEnabled) playCountdownBeep(false);

    let current = countdownFrom;
    const interval = setInterval(() => {
      current -= 1;
      if (current > 0) {
        setCountdownValue(current);
        if (settings.soundEnabled) playCountdownBeep(false);
      } else if (current === 0) {
        setCountdownValue(0);
        if (settings.soundEnabled) playCountdownBeep(true);
      } else {
        clearInterval(interval);
        setIsCountingDown(false);
        setCountdownValue(null);
        setTabMode('standard');
        setStartTime(performance.now());
        setIsRunning(true);
      }
    }, 1000);
  };

  // Interval (HIIT) Timer Implementation
  const startInterval = () => {
    unlockAudioContext();
    setIsIntervalRunning(true);
    setIntervalState('prep');
    setIntervalTimeRemaining(3);
    setCurrentRound(1);
  };

  const pauseInterval = () => {
    setIsIntervalRunning(false);
    if (intervalTimerRef.current) clearInterval(intervalTimerRef.current);
  };

  const resetInterval = () => {
    setIsIntervalRunning(false);
    setIntervalState('idle');
    setCurrentRound(1);
    setIntervalTimeRemaining(0);
    if (intervalTimerRef.current) clearInterval(intervalTimerRef.current);
  };

  useEffect(() => {
    if (!isIntervalRunning) return;

    intervalTimerRef.current = setInterval(() => {
      setIntervalTimeRemaining((prev) => {
        if (prev > 1) {
          if (prev <= 4 && settings.soundEnabled) {
            playBeep(880, 80);
          }
          return prev - 1;
        }

        if (intervalState === 'prep') {
          setIntervalState('work');
          if (settings.soundEnabled) playCountdownBeep(true);
          return settings.workDurationSec;
        } else if (intervalState === 'work') {
          if (currentRound >= settings.totalRounds) {
            setIntervalState('complete');
            setIsIntervalRunning(false);
            if (settings.soundEnabled) playBeep(1320, 400);
            return 0;
          }
          setIntervalState('rest');
          if (settings.soundEnabled) playBeep(440, 200);
          return settings.restDurationSec;
        } else if (intervalState === 'rest') {
          setCurrentRound((r) => r + 1);
          setIntervalState('work');
          if (settings.soundEnabled) playCountdownBeep(true);
          return settings.workDurationSec;
        }

        return 0;
      });
    }, 1000);

    return () => {
      if (intervalTimerRef.current) clearInterval(intervalTimerRef.current);
    };
  }, [isIntervalRunning, intervalState, currentRound, settings]);

  // Export Handlers
  const handleCopySummary = async () => {
    const text = exportStopwatchText(stats, lapRecords, precision);
    try {
      await navigator.clipboard.writeText(text);
      toast("Stopwatch session report copied to clipboard.", "success");
    } catch {
      toast("Could not access clipboard.", "error");
    }
  };

  const handleDownloadCSV = () => {
    const csvContent = exportStopwatchCSV(stats, lapRecords, precision);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = blobManager.create(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stopwatch-laps-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => blobManager.revoke(url), 1000);
    toast("CSV file saved successfully.", "success");
  };

  const handleDownloadJSON = () => {
    const jsonContent = exportStopwatchJSON(stats, lapRecords, precision);
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const url = blobManager.create(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stopwatch-session-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => blobManager.revoke(url), 1000);
    toast("JSON session data saved successfully.", "success");
  };

  const displayString = formatStopwatchTime(elapsed, precision);

  // Fullscreen Dashboard Theme Handling
  const bgClasses = isDashboard ? {
    dark: 'bg-bg text-text',
    light: 'bg-slate-50 text-slate-900',
    amoled: 'bg-black text-white',
    blue: 'bg-blue-950 text-blue-50',
    matrix: 'bg-black text-green-500',
  }[settings.dashboardTheme] || 'bg-bg text-text' : '';

  const textSize = isDashboard ? {
    small: 'text-6xl md:text-8xl',
    medium: 'text-8xl md:text-[10rem]',
    large: 'text-[10rem] md:text-[14rem]',
    huge: 'text-[14rem] md:text-[18rem]',
  }[settings.clockSize] || 'text-8xl md:text-[14rem]' : 'text-5xl xs:text-6xl sm:text-7xl md:text-8xl';

  // Render Main Precision Clock
  const renderMainClock = () => (
    <div className="flex flex-col items-center justify-center w-full min-w-0">
      <div className={cn("font-mono font-black tabular-nums tracking-tighter text-center select-none transition-all", textSize)}>
        {displayString}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 mt-2 text-xs font-semibold text-text-muted">
        {isRunning && (
          <span className="flex items-center gap-1.5 text-success animate-pulse">
            <span className="w-2 h-2 rounded-full bg-success" />
            LIVE RUNNING
          </span>
        )}
        {isWakeLocked && (
          <span className="flex items-center gap-1 text-blue bg-blue/10 px-2 py-0.5 rounded-full border border-blue/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            Screen Awake
          </span>
        )}
        {stats.currentLapElapsedMs > 0 && isRunning && (
          <span>Current Lap: {formatStopwatchTime(stats.currentLapElapsedMs, precision)}</span>
        )}
      </div>
    </div>
  );

  // Render Tactile Action Controls
  const renderControls = () => (
    <div className="flex items-center justify-center gap-4 sm:gap-6 mt-6 sm:mt-8 w-full">
      <button
        type="button"
        onClick={handleLap}
        disabled={!isRunning}
        className={cn(
          "w-16 h-16 sm:w-20 sm:h-20 rounded-full flex flex-col items-center justify-center border-2 sm:border-4 transition-all focus:outline-none focus:ring-4 focus:ring-blue/30 active:scale-95 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed",
          isRunning 
            ? "border-blue/40 text-blue hover:bg-blue/10 shadow-lg shadow-blue/10" 
            : "border-border text-text-muted hover:border-text-muted"
        )}
        title="Record Lap (L)"
      >
        <Flag className="w-5 h-5 sm:w-7 sm:h-7" />
        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider mt-0.5">Lap</span>
      </button>

      <button
        type="button"
        onClick={toggleStart}
        className={cn(
          "w-20 h-20 sm:w-24 sm:h-24 rounded-full flex flex-col items-center justify-center transition-all focus:outline-none focus:ring-4 active:scale-95 text-white shadow-2xl cursor-pointer",
          isRunning 
            ? "bg-amber-500 hover:bg-amber-600 focus:ring-amber-500/30 shadow-amber-500/20" 
            : "bg-success hover:bg-success/90 focus:ring-success/30 shadow-success/20 pl-0.5"
        )}
        title={isRunning ? "Pause (Space)" : "Start (Space)"}
      >
        {isRunning ? (
          <>
            <Pause className="w-7 h-7 sm:w-9 sm:h-9 fill-current" />
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider mt-0.5">Pause</span>
          </>
        ) : (
          <>
            <Play className="w-7 h-7 sm:w-9 sm:h-9 fill-current" />
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider mt-0.5">
              {elapsed > 0 ? "Resume" : "Start"}
            </span>
          </>
        )}
      </button>

      <button
        type="button"
        onClick={handleReset}
        disabled={isRunning && elapsed === 0}
        className={cn(
          "w-16 h-16 sm:w-20 sm:h-20 rounded-full flex flex-col items-center justify-center border-2 sm:border-4 transition-all focus:outline-none focus:ring-4 focus:ring-red-500/30 active:scale-95 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed",
          elapsed > 0 && !isRunning
            ? "border-red-500/40 text-red-400 hover:bg-red-500/10 shadow-lg shadow-red-500/10"
            : "border-border text-text-muted hover:border-text-muted"
        )}
        title="Reset Stopwatch (R)"
      >
        <RotateCcw className="w-5 h-5 sm:w-7 sm:h-7" />
        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider mt-0.5">Reset</span>
      </button>
    </div>
  );

  // Settings Popover
  const renderSettingsPopover = () => (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button 
          type="button"
          className={cn("p-2.5 sm:p-3 rounded-xl backdrop-blur-md transition-colors border cursor-pointer", 
            isDashboard ? "bg-surface-2/20 hover:bg-surface-2/40 border-border/10" : "bg-surface hover:bg-surface-2 border-border"
          )}
          title="Stopwatch Settings"
        >
          <Settings2 className="w-5 h-5 opacity-70 hover:opacity-100" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content sideOffset={8} align="end" className="w-80 bg-surface border border-border shadow-2xl rounded-2xl p-4 z-popover animate-in fade-in zoom-in-95">
          <h3 className="font-bold text-xs uppercase tracking-widest text-text-muted mb-3">Stopwatch Settings</h3>
          
          <div className="space-y-4 text-xs">
            <label className="flex items-center justify-between cursor-pointer p-1.5 hover:bg-surface-2 rounded-lg">
              <span className="font-semibold text-text flex items-center gap-2">
                {settings.soundEnabled ? <Volume2 className="w-4 h-4 text-blue" /> : <VolumeX className="w-4 h-4 text-text-muted" />}
                Sound Cues & Chimes
              </span>
              <input 
                type="checkbox" 
                checked={settings.soundEnabled} 
                onChange={(e) => updateSettings({ soundEnabled: e.target.checked })} 
                className="accent-blue w-4 h-4" 
              />
            </label>

            {isDashboard && (
              <div className="space-y-1.5 pt-2 border-t border-border/60">
                <label className="font-bold text-text-muted">Dashboard Theme</label>
                <select 
                  value={settings.dashboardTheme} 
                  onChange={(e) => updateSettings({ dashboardTheme: e.target.value as any })}
                  className="w-full bg-surface-2 border border-border rounded-lg p-2 text-xs outline-none"
                >
                  <option value="dark">Dark (Default)</option>
                  <option value="amoled">Pitch Black (AMOLED)</option>
                  <option value="light">Light Mode</option>
                  <option value="blue">Deep Ocean Blue</option>
                  <option value="matrix">Matrix Hacker Green</option>
                </select>
              </div>
            )}

            {isDashboard && (
              <div className="space-y-1.5">
                <label className="font-bold text-text-muted">Clock Display Scale</label>
                <div className="grid grid-cols-4 gap-1">
                  {['small', 'medium', 'large', 'huge'].map((size) => (
                    <button 
                      key={size}
                      type="button"
                      onClick={() => updateSettings({ clockSize: size as any })}
                      className={cn("py-1 rounded text-xs font-bold capitalize transition-colors cursor-pointer", settings.clockSize === size ? "bg-blue text-white" : "bg-surface-2 text-text-muted hover:text-text")}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );

  // Live Lap Table
  const renderLapsList = () => {
    if (lapRecords.length === 0) {
      return (
        <div className="text-center text-text-muted opacity-50 py-8 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2">
          <Flag className="w-4 h-4" /> No laps recorded yet
        </div>
      );
    }

    return (
      <div className="w-full overflow-x-auto min-w-0 max-w-full">
        <table className="w-full text-left text-xs border-collapse min-w-[340px]">
          <thead>
            <tr className="border-b border-border text-text-muted bg-surface-2/50">
              <th className="py-2.5 px-3 font-semibold">Lap</th>
              <th className="py-2.5 px-3 font-semibold">Lap Time</th>
              <th className="py-2.5 px-3 font-semibold">Diff (±)</th>
              <th className="py-2.5 px-3 font-semibold text-right">Split Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {[...lapRecords].reverse().map((lap) => {
              return (
                <tr 
                  key={lap.id} 
                  className={cn(
                    "hover:bg-surface-2/40 transition-colors",
                    lap.isFastest ? "bg-emerald-500/5 text-emerald-400 font-semibold" : "",
                    lap.isSlowest ? "bg-red-500/5 text-red-400 font-semibold" : ""
                  )}
                >
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <span className="font-bold">Lap {String(lap.lapNumber).padStart(2, '0')}</span>
                    {lap.isFastest && (
                      <span className="ml-1.5 inline-flex items-center text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full">
                        ⭐ Best
                      </span>
                    )}
                    {lap.isSlowest && (
                      <span className="ml-1.5 inline-flex items-center text-[10px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded-full">
                        🐢 Slow
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold whitespace-nowrap">
                    {formatStopwatchTime(lap.lapTimeMs, precision)}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-text-muted whitespace-nowrap">
                    {lap.diffFromPrevMs === 0 ? '—' : formatDeltaTime(lap.diffFromPrevMs, precision)}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-text-muted text-right whitespace-nowrap">
                    {formatStopwatchTime(lap.splitTimeMs, precision)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  // Phase 5 Session Comparison Computed
  const sessionComparison = useMemo(() => {
    const sA = sessions.find((s) => s.id === compareSessionAId);
    const sB = sessions.find((s) => s.id === compareSessionBId);
    if (!sA || !sB) return null;
    return compareStopwatchSessions(sA, sB);
  }, [sessions, compareSessionAId, compareSessionBId]);

  // If in Fullscreen Dashboard Mode
  if (isDashboard) {
    return (
      <div className={cn("h-full w-full flex flex-col items-center justify-center relative overflow-hidden p-6", bgClasses)}>
        <div className="absolute top-6 right-6 z-modal flex items-center gap-2">
          {renderSettingsPopover()}
        </div>
        
        <div className="flex flex-col items-center justify-center w-full max-w-7xl px-4 sm:px-8 flex-1">
          {renderMainClock()}
          {renderControls()}
          <div className="w-full max-w-2xl mt-8 max-h-[35vh] overflow-y-auto rounded-2xl border border-border/40 p-2 bg-surface-2/20 backdrop-blur-md">
            {renderLapsList()}
          </div>
        </div>

        <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between opacity-40 text-xs font-bold uppercase tracking-widest border-t border-current/20 pt-4">
          <div className="flex items-center gap-2">
            <Timer className="w-4 h-4" />
            Precision Monotonic Engine
          </div>
          <div>Press Esc to Exit Fullscreen</div>
        </div>
      </div>
    );
  }

  // Standard Split Layout
  return (
    <div className="w-full min-w-0 max-w-full space-y-6">
      <QRModal url={typeof window !== 'undefined' ? window.location.href : ''} isOpen={isQrOpen} onClose={() => setIsQrOpen(false)} />

      {/* History & Personal Records Modal */}
      <Dialog.Root open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-modal animate-in fade-in" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl max-h-[85vh] overflow-y-auto bg-surface border border-border shadow-2xl rounded-3xl p-6 z-modal space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-blue/10 text-blue border border-blue/20">
                  <Trophy className="w-6 h-6" />
                </div>
                <div>
                  <Dialog.Title className="text-lg font-bold text-text">Session History & Records</Dialog.Title>
                  <p className="text-xs text-text-muted">IndexedDB local storage • 100% private to your browser</p>
                </div>
              </div>
              <Dialog.Close className="p-2 rounded-xl hover:bg-surface-2 text-text-muted hover:text-text cursor-pointer">
                <X className="w-5 h-5" />
              </Dialog.Close>
            </div>

            {/* History Modal Tabs */}
            <div className="flex gap-2 border-b border-border/60 pb-3">
              <button
                type="button"
                onClick={() => setHistoryTab('sessions')}
                className={cn("px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5", historyTab === 'sessions' ? "bg-blue text-white" : "bg-surface-2 text-text-muted hover:text-text")}
              >
                <History className="w-4 h-4" />
                <span>Saved Sessions ({sessions.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setHistoryTab('records')}
                className={cn("px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5", historyTab === 'records' ? "bg-blue text-white" : "bg-surface-2 text-text-muted hover:text-text")}
              >
                <Trophy className="w-4 h-4" />
                <span>Personal Records</span>
              </button>
              <button
                type="button"
                onClick={() => setHistoryTab('compare')}
                className={cn("px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5", historyTab === 'compare' ? "bg-blue text-white" : "bg-surface-2 text-text-muted hover:text-text")}
              >
                <GitCompare className="w-4 h-4" />
                <span>Compare Sessions</span>
              </button>
            </div>

            {/* Tab 1: Sessions List */}
            {historyTab === 'sessions' && (
              <div className="space-y-4">
                {sessions.length === 0 ? (
                  <div className="text-center py-12 text-text-muted space-y-2">
                    <History className="w-8 h-8 mx-auto opacity-40" />
                    <p className="text-sm font-semibold">No saved sessions yet</p>
                    <p className="text-xs">Record laps and click &ldquo;Save Session&rdquo; to persist them locally.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={clearAllSessionsAction}
                        className="text-xs text-red-400 hover:text-red-300 font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Clear All History
                      </button>
                    </div>

                    <div className="divide-y divide-border/60 border border-border rounded-2xl overflow-hidden">
                      {sessions.map((s) => (
                        <div key={s.id} className="p-4 bg-surface hover:bg-surface-2/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-text text-sm">{s.name}</span>
                              <span className="bg-surface-2 text-text-muted px-2 py-0.5 rounded-full uppercase font-mono text-[10px]">
                                {s.mode}
                              </span>
                            </div>
                            <div className="text-text-muted flex flex-wrap gap-3">
                              <span>📅 {new Date(s.timestamp).toLocaleDateString()}</span>
                              <span>⏱️ {formatStopwatchTime(s.totalDurationMs, 'centiseconds')}</span>
                              <span>🚩 {s.lapCount} laps</span>
                              {s.bestLapMs !== null && <span>⭐ Best: {formatStopwatchTime(s.bestLapMs, 'centiseconds')}</span>}
                              {s.consistencyScore !== null && <span>🎯 {s.consistencyScore}%</span>}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setCompareSessionAId(s.id);
                                setHistoryTab('compare');
                              }}
                              className="px-3 py-1.5 rounded-xl bg-surface-2 hover:bg-surface border border-border text-text font-semibold cursor-pointer"
                            >
                              Compare
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteSessionAction(s.id)}
                              className="p-2 rounded-xl text-text-muted hover:text-red-400 cursor-pointer"
                              title="Delete Session"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Personal Records */}
            {historyTab === 'records' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <MetricCard
                  label="Personal Best Lap"
                  value={personalRecords.bestLapMs !== null ? formatStopwatchTime(personalRecords.bestLapMs, 'milliseconds') : '—'}
                  sub="Fastest individual lap ever recorded"
                  accent
                />
                <MetricCard
                  label="Fastest Reaction Time"
                  value={personalRecords.bestReactionTimeMs !== null ? `${personalRecords.bestReactionTimeMs} ms` : '—'}
                  sub="Best reaction benchmark response"
                />
                <MetricCard
                  label="Best Consistency Score"
                  value={personalRecords.bestConsistencyScore !== null ? `${personalRecords.bestConsistencyScore}%` : '—'}
                  sub="Highest lap-to-lap rhythm accuracy"
                />
                <MetricCard
                  label="Total Sessions Completed"
                  value={personalRecords.totalSessionsCompleted.toString()}
                  sub={`Total Tracked: ${formatStopwatchTime(personalRecords.totalDurationTrackedMs, 'seconds')}`}
                />
              </div>
            )}

            {/* Tab 3: Session Comparison */}
            {historyTab === 'compare' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-text-muted">Session A (Baseline)</label>
                    <select
                      value={compareSessionAId || ''}
                      onChange={(e) => setCompareSessionAId(e.target.value)}
                      className="w-full bg-surface-2 border border-border rounded-xl p-2.5 text-xs text-text outline-none"
                    >
                      <option value="">Select Session A...</option>
                      {sessions.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({new Date(s.timestamp).toLocaleDateString()} - {formatStopwatchTime(s.totalDurationMs, 'centiseconds')})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-text-muted">Session B (Comparison)</label>
                    <select
                      value={compareSessionBId || ''}
                      onChange={(e) => setCompareSessionBId(e.target.value)}
                      className="w-full bg-surface-2 border border-border rounded-xl p-2.5 text-xs text-text outline-none"
                    >
                      <option value="">Select Session B...</option>
                      {sessions.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({new Date(s.timestamp).toLocaleDateString()} - {formatStopwatchTime(s.totalDurationMs, 'centiseconds')})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {sessionComparison ? (
                  <div className="border border-border rounded-2xl p-4 bg-surface-2/30 space-y-4 text-xs">
                    <div className="grid grid-cols-3 gap-3 text-center border-b border-border/60 pb-4">
                      <div>
                        <div className="text-text-muted">Metric</div>
                        <div className="font-bold text-sm mt-1">Total Time</div>
                        <div className="font-bold text-sm mt-1">Best Lap</div>
                        <div className="font-bold text-sm mt-1">Avg Lap</div>
                        <div className="font-bold text-sm mt-1">Consistency</div>
                      </div>
                      <div>
                        <div className="text-text-muted">{sessionComparison.sessionA.name}</div>
                        <div className="font-mono mt-1">{formatStopwatchTime(sessionComparison.sessionA.totalDurationMs, 'centiseconds')}</div>
                        <div className="font-mono mt-1">{sessionComparison.sessionA.bestLapMs ? formatStopwatchTime(sessionComparison.sessionA.bestLapMs, 'centiseconds') : '—'}</div>
                        <div className="font-mono mt-1">{sessionComparison.sessionA.avgLapMs ? formatStopwatchTime(sessionComparison.sessionA.avgLapMs, 'centiseconds') : '—'}</div>
                        <div className="font-mono mt-1">{sessionComparison.sessionA.consistency ? `${sessionComparison.sessionA.consistency}%` : '—'}</div>
                      </div>
                      <div>
                        <div className="text-text-muted">{sessionComparison.sessionB.name}</div>
                        <div className="font-mono mt-1">{formatStopwatchTime(sessionComparison.sessionB.totalDurationMs, 'centiseconds')}</div>
                        <div className="font-mono mt-1">{sessionComparison.sessionB.bestLapMs ? formatStopwatchTime(sessionComparison.sessionB.bestLapMs, 'centiseconds') : '—'}</div>
                        <div className="font-mono mt-1">{sessionComparison.sessionB.avgLapMs ? formatStopwatchTime(sessionComparison.sessionB.avgLapMs, 'centiseconds') : '—'}</div>
                        <div className="font-mono mt-1">{sessionComparison.sessionB.consistency ? `${sessionComparison.sessionB.consistency}%` : '—'}</div>
                      </div>
                    </div>

                    <div className="text-center font-bold text-sm">
                      {sessionComparison.totalDurationImprovementPct > 0 ? (
                        <span className="text-emerald-400">
                          🚀 Session B is {sessionComparison.totalDurationImprovementPct}% faster ({formatStopwatchTime(Math.abs(sessionComparison.totalDurationDiffMs), 'centiseconds')} lead)
                        </span>
                      ) : sessionComparison.totalDurationImprovementPct < 0 ? (
                        <span className="text-amber-400">
                          ⏱️ Session B is {Math.abs(sessionComparison.totalDurationImprovementPct)}% slower ({formatStopwatchTime(Math.abs(sessionComparison.totalDurationDiffMs), 'centiseconds')} gap)
                        </span>
                      ) : (
                        <span className="text-text">Sessions have identical duration</span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 text-text-muted text-xs">
                    Select two sessions above to compare their performance side-by-side.
                  </div>
                )}
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Mode Switcher Segmented Control */}
      <div className="flex items-center justify-between gap-2 flex-wrap border-b border-border/80 pb-4">
        <div className="grid grid-cols-2 sm:flex sm:flex-row gap-1 bg-surface-2 p-1 rounded-2xl border border-border text-xs min-w-0 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setTabMode('standard')}
            className={cn(
              "px-3 py-2 rounded-xl font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5",
              tabMode === 'standard' ? "bg-blue text-white shadow-sm" : "text-text-muted hover:text-text"
            )}
          >
            <Timer className="w-3.5 h-3.5" />
            <span>Stopwatch</span>
          </button>
          <button
            type="button"
            onClick={() => setTabMode('countdown')}
            className={cn(
              "px-3 py-2 rounded-xl font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5",
              tabMode === 'countdown' ? "bg-blue text-white shadow-sm" : "text-text-muted hover:text-text"
            )}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Countdown</span>
          </button>
          <button
            type="button"
            onClick={() => setTabMode('interval')}
            className={cn(
              "px-3 py-2 rounded-xl font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5",
              tabMode === 'interval' ? "bg-blue text-white shadow-sm" : "text-text-muted hover:text-text"
            )}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Interval (HIIT)</span>
          </button>
          <button
            type="button"
            onClick={() => setTabMode('reaction')}
            className={cn(
              "px-3 py-2 rounded-xl font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5",
              tabMode === 'reaction' ? "bg-blue text-white shadow-sm" : "text-text-muted hover:text-text"
            )}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Reaction Test</span>
          </button>
        </div>

        {/* Right Settings & History Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsHistoryOpen(true)}
            className="flex items-center gap-1.5 bg-surface hover:bg-surface-2 border border-border px-3 py-2 rounded-xl text-xs font-bold text-text-muted hover:text-text transition-colors cursor-pointer"
            title="Session History & Records"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Records & History</span>
          </button>

          {tabMode === 'standard' && (
            <div className="hidden sm:flex items-center gap-1 bg-surface-2 p-1 rounded-xl border border-border text-xs">
              <button
                type="button"
                onClick={() => setPrecision('seconds')}
                className={cn("px-2 py-1 rounded-lg font-medium transition-colors cursor-pointer", precision === 'seconds' ? "bg-blue text-white" : "text-text-muted hover:text-text")}
              >
                .0s
              </button>
              <button
                type="button"
                onClick={() => setPrecision('centiseconds')}
                className={cn("px-2 py-1 rounded-lg font-medium transition-colors cursor-pointer", precision === 'centiseconds' ? "bg-blue text-white" : "text-text-muted hover:text-text")}
              >
                .00s
              </button>
              <button
                type="button"
                onClick={() => setPrecision('milliseconds')}
                className={cn("px-2 py-1 rounded-lg font-medium transition-colors cursor-pointer", precision === 'milliseconds' ? "bg-blue text-white" : "text-text-muted hover:text-text")}
              >
                .000s
              </button>
            </div>
          )}
          {renderSettingsPopover()}
        </div>
      </div>

      {/* Mode 1: Standard Precision Stopwatch */}
      {tabMode === 'standard' && (
        <ToolWorkspace
          layout="split"
          input={
            <div className="flex flex-col items-center justify-center py-6 sm:py-10 space-y-6 sm:space-y-8 min-w-0 w-full">
              {renderMainClock()}
              {renderControls()}

              <div className="flex items-center justify-center gap-4 text-[11px] text-text-muted pt-4 border-t border-border/40 w-full">
                <span><kbd className="px-1.5 py-0.5 rounded bg-surface-2 border border-border font-mono">Space</kbd> Start/Pause</span>
                <span><kbd className="px-1.5 py-0.5 rounded bg-surface-2 border border-border font-mono">L</kbd> Lap</span>
                <span><kbd className="px-1.5 py-0.5 rounded bg-surface-2 border border-border font-mono">R</kbd> Reset</span>
              </div>
            </div>
          }
          optionsPanel={
            <div className="space-y-5">
              <h3 className="font-bold text-xs uppercase tracking-widest text-text-muted">Display Precision</h3>
              <div className="grid grid-cols-3 gap-1 bg-surface-2 p-1 rounded-xl border border-border text-xs">
                <button
                  type="button"
                  onClick={() => setPrecision('seconds')}
                  className={cn("py-1.5 rounded-lg font-medium transition-colors cursor-pointer text-center", precision === 'seconds' ? "bg-blue text-white" : "text-text-muted hover:text-text")}
                >
                  Seconds (.0)
                </button>
                <button
                  type="button"
                  onClick={() => setPrecision('centiseconds')}
                  className={cn("py-1.5 rounded-lg font-medium transition-colors cursor-pointer text-center", precision === 'centiseconds' ? "bg-blue text-white" : "text-text-muted hover:text-text")}
                >
                  Centiseconds (.00)
                </button>
                <button
                  type="button"
                  onClick={() => setPrecision('milliseconds')}
                  className={cn("py-1.5 rounded-lg font-medium transition-colors cursor-pointer text-center", precision === 'milliseconds' ? "bg-blue text-white" : "text-text-muted hover:text-text")}
                >
                  Milliseconds (.000)
                </button>
              </div>

              {/* Lap Statistics Summary */}
              {lapRecords.length > 0 && (
                <div className="pt-4 border-t border-border/60 space-y-3">
                  <h3 className="font-bold text-xs uppercase tracking-widest text-text-muted">Lap Statistics</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <MetricCard 
                      label="Fastest Lap" 
                      value={stats.fastestLapMs !== null ? formatStopwatchTime(stats.fastestLapMs, precision) : '—'} 
                      accent
                    />
                    <MetricCard 
                      label="Slowest Lap" 
                      value={stats.slowestLapMs !== null ? formatStopwatchTime(stats.slowestLapMs, precision) : '—'} 
                    />
                    <MetricCard 
                      label="Average Lap" 
                      value={stats.avgLapMs !== null ? formatStopwatchTime(stats.avgLapMs, precision) : '—'} 
                    />
                    <MetricCard 
                      label="Consistency" 
                      value={stats.consistencyScore !== null ? `${stats.consistencyScore.toFixed(1)}%` : '—'} 
                    />
                  </div>
                </div>
              )}

              {/* Phase 5 Pace Trend Progression */}
              {paceTrend && (
                <div className="pt-4 border-t border-border/60 space-y-2">
                  <h3 className="font-bold text-xs uppercase tracking-widest text-text-muted flex items-center justify-between">
                    <span>Pace Progression</span>
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                      paceTrend.trend === 'improving' ? "bg-emerald-500/20 text-emerald-400" :
                      paceTrend.trend === 'slowing' ? "bg-amber-500/20 text-amber-400" :
                      "bg-surface-2 text-text-muted"
                    )}>
                      {paceTrend.trend === 'improving' ? "🚀 Speeding Up" : paceTrend.trend === 'slowing' ? "🐢 Slowing Down" : "⚖️ Steady Pace"}
                    </span>
                  </h3>
                  <div className="bg-surface-2/40 border border-border rounded-xl p-3 text-xs space-y-1.5">
                    <div className="flex justify-between text-text-muted">
                      <span>First Half Avg:</span>
                      <strong className="text-text font-mono">{formatStopwatchTime(paceTrend.firstHalfAvgMs, precision)}</strong>
                    </div>
                    <div className="flex justify-between text-text-muted">
                      <span>Second Half Avg:</span>
                      <strong className="text-text font-mono">{formatStopwatchTime(paceTrend.secondHalfAvgMs, precision)}</strong>
                    </div>
                    <div className="flex justify-between text-text-muted">
                      <span>Pace Slope:</span>
                      <strong className="text-text font-mono">{paceTrend.slopeMsPerLap > 0 ? `+${paceTrend.slopeMsPerLap}` : paceTrend.slopeMsPerLap} ms/lap</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>
          }
          output={
            <div className="space-y-4 min-w-0 w-full">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm uppercase tracking-widest text-text">Lap Times</h3>
                  <span className="text-xs font-semibold text-text-muted bg-surface-2 px-2 py-0.5 rounded-md border border-border">
                    {lapRecords.length} Recorded
                  </span>
                </div>

                {/* Export & Save Action Buttons */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {elapsed > 0 && (
                    <button
                      type="button"
                      onClick={handleSaveSession}
                      className="flex items-center gap-1 bg-blue/10 text-blue hover:bg-blue/20 border border-blue/30 rounded-xl px-2.5 py-1.5 text-xs font-bold transition-colors cursor-pointer"
                      title="Save Session to Local History"
                    >
                      <BookmarkPlus className="w-3.5 h-3.5" />
                      <span>Save</span>
                    </button>
                  )}
                  {lapRecords.length > 0 && (
                    <>
                      <button
                        type="button"
                        onClick={handleCopySummary}
                        className="flex items-center gap-1 bg-surface-2 hover:bg-surface border border-border rounded-xl px-2.5 py-1.5 text-xs font-medium text-text-muted hover:text-text transition-colors cursor-pointer"
                        title="Copy text summary"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Copy</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleDownloadCSV}
                        className="flex items-center gap-1 bg-surface-2 hover:bg-surface border border-border rounded-xl px-2.5 py-1.5 text-xs font-medium text-text-muted hover:text-text transition-colors cursor-pointer"
                        title="Download CSV"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>CSV</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleDownloadJSON}
                        className="flex items-center gap-1 bg-surface-2 hover:bg-surface border border-border rounded-xl px-2.5 py-1.5 text-xs font-medium text-text-muted hover:text-text transition-colors cursor-pointer"
                        title="Download JSON"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>JSON</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsQrOpen(true)}
                        className="flex items-center gap-1 bg-surface-2 hover:bg-surface border border-border rounded-xl px-2.5 py-1.5 text-xs font-medium text-text-muted hover:text-text transition-colors cursor-pointer"
                        title="Share QR"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {renderLapsList()}

              {/* Phase 5 Lap Distribution Bar Chart */}
              {lapDistribution.length > 1 && (
                <div className="pt-4 border-t border-border/60 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-text-muted flex items-center gap-1.5">
                    <BarChart2 className="w-3.5 h-3.5 text-blue" />
                    <span>Lap Time Distribution</span>
                  </h4>
                  <div className="space-y-1.5">
                    {lapDistribution.map((bin, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-[11px] text-text-muted">
                          <span>{bin.label}</span>
                          <span>{bin.count} laps ({bin.pct}%)</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-surface-2 overflow-hidden">
                          <div className="h-full bg-blue rounded-full" style={{ width: `${bin.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          }
        />
      )}

      {/* Mode 2: Countdown Start Mode */}
      {tabMode === 'countdown' && (
        <div className="border border-border rounded-3xl p-6 sm:p-12 bg-surface flex flex-col items-center justify-center text-center space-y-6">
          <div className="max-w-md space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-text">Countdown-Linked Start</h2>
            <p className="text-xs sm:text-sm text-text-muted">
              Initiates an audible 3-2-1 countdown before automatically launching the precision stopwatch on &ldquo;GO!&rdquo;.
            </p>
          </div>

          {isCountingDown ? (
            <div className="my-8">
              <span className="text-8xl sm:text-9xl font-black text-blue animate-bounce">
                {countdownValue === 0 ? "GO!" : countdownValue}
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-6 my-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-text-muted">Countdown Seconds:</span>
                {[3, 5, 10].map((sec) => (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => setCountdownFrom(sec)}
                    className={cn(
                      "px-3 py-1.5 rounded-xl font-bold text-xs border transition-colors cursor-pointer",
                      countdownFrom === sec ? "bg-blue text-white border-blue" : "bg-surface-2 border-border text-text-muted hover:text-text"
                    )}
                  >
                    {sec}s
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={startCountdownSequence}
                className="bg-blue hover:bg-blue/90 text-white font-bold text-base px-8 py-4 rounded-2xl shadow-xl shadow-blue/20 transition-all active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                <span>Start {countdownFrom}s Countdown</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Mode 3: Interval Timer (HIIT / Work-Rest) */}
      {tabMode === 'interval' && (
        <div className="border border-border rounded-3xl p-6 sm:p-8 bg-surface space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
            <div>
              <h2 className="text-lg font-bold text-text flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500" />
                <span>Interval (HIIT) Workout Timer</span>
              </h2>
              <p className="text-xs text-text-muted">
                Configurable Work / Rest alternating rounds with audio bells.
              </p>
            </div>

            {!isIntervalRunning && intervalState === 'idle' && (
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-text-muted font-medium">Work:</span>
                  <input
                    type="number"
                    min="5"
                    max="600"
                    value={settings.workDurationSec}
                    onChange={(e) => updateSettings({ workDurationSec: Number(e.target.value) })}
                    className="w-16 bg-surface-2 border border-border rounded-lg px-2 py-1 text-center font-bold text-text"
                  />
                  <span className="text-text-muted">s</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-text-muted font-medium">Rest:</span>
                  <input
                    type="number"
                    min="0"
                    max="300"
                    value={settings.restDurationSec}
                    onChange={(e) => updateSettings({ restDurationSec: Number(e.target.value) })}
                    className="w-16 bg-surface-2 border border-border rounded-lg px-2 py-1 text-center font-bold text-text"
                  />
                  <span className="text-text-muted">s</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-text-muted font-medium">Rounds:</span>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={settings.totalRounds}
                    onChange={(e) => updateSettings({ totalRounds: Number(e.target.value) })}
                    className="w-16 bg-surface-2 border border-border rounded-lg px-2 py-1 text-center font-bold text-text"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col items-center justify-center py-6 text-center space-y-6">
            <div className="space-y-1">
              <span className={cn(
                "px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border",
                intervalState === 'work' ? "bg-orange-500/20 text-orange-400 border-orange-500/40 animate-pulse" :
                intervalState === 'rest' ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/40" :
                intervalState === 'prep' ? "bg-amber-500/20 text-amber-400 border-amber-500/40" :
                intervalState === 'complete' ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40" :
                "bg-surface-2 text-text-muted border-border"
              )}>
                {intervalState === 'idle' ? 'Ready' : intervalState.toUpperCase()}
              </span>
              <div className="text-sm font-semibold text-text-muted pt-1">
                Round {currentRound} of {settings.totalRounds}
              </div>
            </div>

            <div className="text-7xl sm:text-9xl font-black font-mono tracking-tighter tabular-nums">
              {String(Math.floor(intervalTimeRemaining / 60)).padStart(2, '0')}:
              {String(intervalTimeRemaining % 60).padStart(2, '0')}
            </div>

            <div className="flex items-center gap-4">
              {intervalState === 'idle' || intervalState === 'complete' ? (
                <button
                  type="button"
                  onClick={startInterval}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3.5 rounded-2xl shadow-xl shadow-orange-500/20 transition-all active:scale-95 cursor-pointer flex items-center gap-2"
                >
                  <Play className="w-5 h-5 fill-current" />
                  <span>Start Interval Workout</span>
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={isIntervalRunning ? pauseInterval : () => setIsIntervalRunning(true)}
                    className={cn(
                      "font-bold px-6 py-3 rounded-2xl text-white shadow-lg transition-all active:scale-95 cursor-pointer flex items-center gap-2",
                      isIntervalRunning ? "bg-amber-500 hover:bg-amber-600 shadow-amber-500/20" : "bg-success hover:bg-success/90 shadow-success/20"
                    )}
                  >
                    {isIntervalRunning ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                    <span>{isIntervalRunning ? "Pause" : "Resume"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={resetInterval}
                    className="bg-surface-2 hover:bg-surface border border-border text-text-muted hover:text-text font-bold px-5 py-3 rounded-2xl transition-all cursor-pointer flex items-center gap-2"
                  >
                    <RotateCcw className="w-5 h-5" />
                    <span>Reset</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mode 4: Reaction Time Benchmark */}
      {tabMode === 'reaction' && (
        <div className="space-y-6">
          <div
            onClick={handleReactionClick}
            className={cn(
              "w-full h-80 rounded-3xl flex flex-col items-center justify-center p-6 text-center select-none cursor-pointer transition-all duration-150 border-2",
              reactionState === 'idle' ? "bg-surface-2/60 border-border hover:border-blue text-text" :
              reactionState === 'waiting' ? "bg-red-600/90 border-red-500 text-white shadow-2xl shadow-red-500/20" :
              reactionState === 'ready' ? "bg-emerald-500 border-emerald-400 text-white shadow-2xl shadow-emerald-500/30 animate-pulse" :
              reactionState === 'early' ? "bg-amber-500/90 border-amber-400 text-white" :
              "bg-surface border-border text-text"
            )}
          >
            {reactionState === 'idle' && (
              <div className="space-y-2">
                <Zap className="w-12 h-12 text-blue mx-auto" />
                <h3 className="text-2xl font-bold">Reaction Time Benchmark</h3>
                <p className="text-xs sm:text-sm text-text-muted">Click or press <kbd className="px-1.5 py-0.5 bg-surface rounded border border-border font-mono">Space</kbd> to begin. When red turns GREEN, click as fast as you can!</p>
              </div>
            )}

            {reactionState === 'waiting' && (
              <div className="space-y-2">
                <h3 className="text-3xl font-black uppercase tracking-wider">Wait for Green...</h3>
                <p className="text-xs opacity-80">Do not click yet</p>
              </div>
            )}

            {reactionState === 'ready' && (
              <div className="space-y-2">
                <h3 className="text-5xl font-black uppercase tracking-wider">CLICK NOW!</h3>
              </div>
            )}

            {reactionState === 'early' && (
              <div className="space-y-2">
                <h3 className="text-3xl font-black uppercase tracking-wider">Too Soon! ⚠️</h3>
                <p className="text-xs">You clicked before green. Click to retry.</p>
              </div>
            )}

            {reactionState === 'result' && reactionScore !== null && (
              <div className="space-y-3">
                <div className="text-6xl font-black font-mono tracking-tight text-blue">
                  {reactionScore} ms
                </div>
                <div className={cn("text-sm font-bold", getReactionBenchmarkTier(reactionScore).className)}>
                  {getReactionBenchmarkTier(reactionScore).label}
                </div>
                <p className="text-xs text-text-muted">Click or press Space to test again</p>
              </div>
            )}
          </div>

          {/* Phase 5 Reaction Analytics Summary */}
          {reactionStats.attemptCount > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <MetricCard
                label="Best Reaction"
                value={reactionStats.bestReactionMs !== null ? `${reactionStats.bestReactionMs} ms` : '—'}
                accent
              />
              <MetricCard
                label="Average Reaction"
                value={reactionStats.avgReactionMs !== null ? `${reactionStats.avgReactionMs} ms` : '—'}
              />
              <MetricCard
                label="Median Reaction"
                value={reactionStats.medianReactionMs !== null ? `${reactionStats.medianReactionMs} ms` : '—'}
              />
              <MetricCard
                label="Consistency Index"
                value={reactionStats.consistencyScore !== null ? `${reactionStats.consistencyScore}%` : '—'}
              />
            </div>
          )}

          {/* Reaction History Table */}
          {reactionHistory.length > 0 && (
            <div className="border border-border rounded-2xl p-4 bg-surface space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-text uppercase tracking-wider">Session Attempts ({reactionHistory.length})</span>
                <span className="text-text-muted">
                  False Starts: <strong className="text-amber-400">{reactionStats.falseStartsCount}</strong>
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {reactionHistory.map((score, idx) => (
                  <span key={idx} className="font-mono text-xs px-2.5 py-1 rounded-lg bg-surface-2 border border-border text-text">
                    #{reactionHistory.length - idx}: <strong>{score} ms</strong>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
