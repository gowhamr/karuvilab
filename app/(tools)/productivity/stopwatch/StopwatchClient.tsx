"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { Play, Square, Timer, RefreshCw, Flag, Settings2, Trash2, ArrowUpCircle } from "lucide-react";
import * as Popover from '@radix-ui/react-popover';
import { cn } from "@/src/lib/utils";
import { useFullscreenContext } from "@/src/contexts/FullscreenContext";
import { useStopwatchStore, Lap } from "@/src/features/stopwatch/store";

function formatTime(ms: number, showMs: boolean = true) {
  const mins = Math.floor(ms / 60000);
  const secs = Math.floor((ms % 60000) / 1000);
  const millis = Math.floor((ms % 1000) / 10);

  const mStr = String(mins).padStart(2, "0");
  const sStr = String(secs).padStart(2, "0");
  const msStr = String(millis).padStart(2, "0");

  if (mins >= 60) {
    const hrs = Math.floor(mins / 60);
    const remMins = mins % 60;
    const hStr = String(hrs).padStart(2, "0");
    const rmStr = String(remMins).padStart(2, "0");
    return showMs ? `${hStr}:${rmStr}:${sStr}.${msStr}` : `${hStr}:${rmStr}:${sStr}`;
  }

  return showMs ? `${mStr}:${sStr}.${msStr}` : `${mStr}:${sStr}`;
}

export default function StopwatchClient() {
  const { displayMode, activeToolId } = useFullscreenContext();
  const isDashboard = displayMode === 'dashboard' && activeToolId === 'stopwatch';
  
  const settings = useStopwatchStore(state => state.settings);
  const updateSettings = useStopwatchStore(state => state.updateSettings);

  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [laps, setLaps] = useState<Lap[]>([]);
  
  const requestRef = useRef<number | null>(null);
  
  const animateRef = useRef<(time: number) => void>(() => {});

  useEffect(() => {
    animateRef.current = (time: number) => {
      if (startTime !== null && isRunning) {
        setElapsed(performance.now() - startTime);
      }
      requestRef.current = requestAnimationFrame(animateRef.current);
    };
  });

  useEffect(() => {
    if (isRunning) {
      requestRef.current = requestAnimationFrame(animateRef.current);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isRunning]);

  const toggleStart = () => {
    if (isRunning) {
      setIsRunning(false);
    } else {
      if (startTime === null) {
        setStartTime(performance.now());
      } else {
        // Resuming: shift startTime to account for paused time
        setStartTime(performance.now() - elapsed);
      }
      setIsRunning(true);
    }
  };

  const handleLapOrReset = () => {
    if (isRunning) {
      // Record Lap
      const lastTotal = laps.length > 0 ? laps[0]!.totalTime : 0;
      const lapTime = elapsed - lastTotal;
      const newLap: Lap = {
        id: Math.random().toString(36).substr(2, 9),
        lapTime,
        totalTime: elapsed
      };
      setLaps([newLap, ...laps]);
    } else {
      // Reset
      setIsRunning(false);
      setStartTime(null);
      setElapsed(0);
      setLaps([]);
    }
  };

  const displayString = formatTime(elapsed, settings.showMilliseconds);

  // Layout calculations
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
  }[settings.clockSize] || 'text-8xl md:text-[14rem]' : 'text-6xl md:text-8xl';

  const renderMainClock = () => (
    <div className={cn("font-mono font-black tabular-nums tracking-tighter text-center", textSize)}>
      {displayString}
    </div>
  );

  const renderControls = () => (
    <div className={cn("flex items-center justify-center gap-6", isDashboard ? "mt-12 scale-150" : "mt-8")}>
      <button
        onClick={handleLapOrReset}
        className={cn(
          "w-20 h-20 rounded-full flex items-center justify-center border-4 transition-all focus:outline-none focus:ring-4 focus:ring-blue/30 active:scale-95",
          isRunning 
            ? "border-text-4 text-text-3 hover:border-text-3" 
            : "border-error/20 text-error hover:border-error/40 hover:bg-error/5"
        )}
        title={isRunning ? "Lap" : "Reset"}
      >
        {isRunning ? <Flag className="w-8 h-8" /> : <RefreshCw className="w-8 h-8" />}
      </button>

      <button
        onClick={toggleStart}
        className={cn(
          "w-24 h-24 rounded-full flex items-center justify-center transition-all focus:outline-none focus:ring-4 active:scale-95 text-white shadow-2xl",
          isRunning 
            ? "bg-error hover:bg-error/90 focus:ring-error/30 shadow-error/20" 
            : "bg-success hover:bg-success/90 focus:ring-success/30 shadow-success/20 pl-2"
        )}
        title={isRunning ? "Stop" : "Start"}
      >
        {isRunning ? <Square className="w-10 h-10 fill-current" /> : <Play className="w-12 h-12 fill-current" />}
      </button>
    </div>
  );

  const renderSettingsPopover = () => (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button className={cn("p-3 rounded-xl backdrop-blur-md transition-colors border", 
          isDashboard ? "bg-surface-2/20 hover:bg-surface-2/40 border-border/10" : "bg-surface hover:bg-surface-2 border-border"
        )}>
          <Settings2 className="w-6 h-6 opacity-60 hover:opacity-100" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content sideOffset={8} align="end" className="w-80 bg-surface border border-border shadow-2xl rounded-2xl p-4 z-popover animate-in fade-in zoom-in-95">
          <h3 className="font-bold text-sm uppercase tracking-widest text-text-muted mb-4">Settings</h3>
          
          <div className="space-y-4">
            {isDashboard && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-3">Theme (Dashboard)</label>
                <select 
                  value={settings.dashboardTheme} 
                  onChange={e => updateSettings({ dashboardTheme: e.target.value as "dark" | "amoled" | "light" | "matrix" })}
                  className="w-full bg-surface-2 border border-border rounded-lg p-2 text-sm outline-none"
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
                      onClick={() => updateSettings({ clockSize: size as "small" | "medium" | "large" | "huge" })}
                      className={cn("flex-1 py-1.5 rounded text-xs font-bold capitalize transition-colors", settings.clockSize === size ? "bg-blue text-white" : "bg-surface-2 text-text-muted hover:text-text")}
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
                <span className="text-sm font-medium">Show Laps</span>
                <input type="checkbox" checked={settings.showLaps} onChange={e => updateSettings({ showLaps: e.target.checked })} className="accent-blue" />
              </label>
            </div>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );

  const renderLapsList = () => (
    <div className={cn("w-full max-w-2xl mx-auto flex-1 overflow-auto mt-12", isDashboard ? "max-h-[40vh]" : "max-h-[500px]")}>
      {laps.length === 0 ? (
        <div className="text-center text-text-muted opacity-50 py-8 text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2">
          <Flag className="w-4 h-4" /> No laps recorded
        </div>
      ) : (
        <div className="space-y-2">
          {laps.map((lap, idx) => {
            const lapNum = laps.length - idx;
            const isFastest = laps.length > 2 && lap.lapTime === Math.min(...laps.map(l => l.lapTime));
            const isSlowest = laps.length > 2 && lap.lapTime === Math.max(...laps.map(l => l.lapTime));
            
            return (
              <div 
                key={lap.id} 
                className={cn(
                  "flex items-center justify-between py-4 px-6 rounded-2xl border transition-colors",
                  isDashboard ? "bg-surface-2/10 border-border/20 backdrop-blur-md" : "bg-surface border-border",
                  isFastest ? "text-success border-success/30 bg-success/5" : "",
                  isSlowest ? "text-error border-error/30 bg-error/5" : ""
                )}
              >
                <span className={cn("font-bold", isFastest ? "text-success" : isSlowest ? "text-error" : "text-text-muted")}>
                  Lap {String(lapNum).padStart(2, '0')}
                </span>
                
                <span className="font-mono font-bold text-xl tabular-nums tracking-tight">
                  {isFastest && <ArrowUpCircle className="inline-block w-4 h-4 mr-2" />}
                  {formatTime(lap.lapTime, settings.showMilliseconds)}
                </span>
                
                <span className="font-mono font-medium text-text-muted tabular-nums w-32 text-right">
                  {formatTime(lap.totalTime, settings.showMilliseconds)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  if (isDashboard) {
    return (
      <div className={cn("h-full w-full flex flex-col items-center justify-center relative overflow-hidden", bgClasses)}>
        <div className="absolute top-6 right-6 z-modal">
          {renderSettingsPopover()}
        </div>
        
        <div className="flex flex-col items-center justify-center w-full max-w-7xl px-8 flex-1">
          {renderMainClock()}
          {renderControls()}
          {settings.showLaps && renderLapsList()}
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
      
      <div className="bg-surface border border-border rounded-5xl p-12 shadow-2xl w-full flex flex-col items-center justify-center overflow-hidden relative">
        {renderMainClock()}
        {renderControls()}
      </div>

      {settings.showLaps && renderLapsList()}
    </div>
  );
}
