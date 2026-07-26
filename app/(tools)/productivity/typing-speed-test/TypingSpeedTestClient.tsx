"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Timer, Trophy, Target, RefreshCw, Keyboard, Activity, TrendingUp, AlertTriangle } from "lucide-react";
import { m, AnimatePresence } from "framer-motion";
import { idbStorage } from "@/src/store/idb-storage";
import { logger } from "@/src/lib/logger";

// ─── Constants ────────────────────────────────────────────────────────────────

const BEST_WPM_KEY = "karuvi.productivity.typing.bestWpm";
const BEST_ACC_KEY = "karuvi.productivity.typing.bestAcc";
const HISTORY_KEY = "karuvi.productivity.typing.history";

const SAMPLE_TEXTS = [
  "The quick brown fox jumps over the lazy dog near the riverbank on a sunny afternoon in autumn.",
  "Programming is the art of telling another human what one wants the computer to do in plain terms.",
  "In software development, debugging is twice as hard as writing the code in the first place.",
  "The best way to predict the future is to invent it. Innovation distinguishes between a leader and a follower.",
  "Simplicity is the soul of efficiency. A good engineer writes code that humans can understand as well as machines.",
  "Productivity is never an accident. It is always the result of commitment to excellence and intelligent planning.",
  "The only way to do great work is to love what you do. Stay hungry, stay foolish, and never stop learning.",
];

interface TestHistory {
  date: number;
  wpm: number;
  accuracy: number;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function TypingSpeedTestClient() {
  const [textIndex, setTextIndex] = useState(() => Math.floor(Math.random() * SAMPLE_TEXTS.length));
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"idle" | "typing" | "finished">("idle");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  
  const [mistakesCount, setMistakesCount] = useState(0);
  const [missedChars, setMissedChars] = useState<Record<string, number>>({});
  
  const [bestWpm, setBestWpm] = useState<number | null>(null);
  const [bestAcc, setBestAcc] = useState<number | null>(null);
  const [history, setHistory] = useState<TestHistory[]>([]);
  const [bestLoaded, setBestLoaded] = useState(false);
  
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const resetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const targetText = SAMPLE_TEXTS[textIndex]!;

  // ── Load persisted data ───────────────────────────────────────────────────

  useEffect(() => {
    Promise.all([
      idbStorage.getItem(BEST_WPM_KEY),
      idbStorage.getItem(BEST_ACC_KEY),
      idbStorage.getItem(HISTORY_KEY)
    ]).then(([wpmRaw, accRaw, histRaw]) => {
      if (wpmRaw || accRaw) {
        if (wpmRaw) setBestWpm(parseInt(wpmRaw, 10) || null);
        if (accRaw) setBestAcc(parseInt(accRaw, 10) || null);
        if (histRaw) {
          try {
            setHistory(JSON.parse(histRaw));
          } catch (e) {
            logger.error("[TypingTest] Failed to parse history", { error: e });
          }
        }
        setBestLoaded(true);
      } else {
        // Migration from legacy namespace
        Promise.all([
          idbStorage.getItem("karuvi.fun.typing.bestWpm"),
          idbStorage.getItem("karuvi.fun.typing.bestAcc"),
        ]).then(([legacyWpm, legacyAcc]) => {
          if (legacyWpm) {
            const w = parseInt(legacyWpm, 10) || null;
            setBestWpm(w);
            idbStorage.setItem(BEST_WPM_KEY, legacyWpm);
            idbStorage.removeItem("karuvi.fun.typing.bestWpm");
          }
          if (legacyAcc) {
            const a = parseInt(legacyAcc, 10) || null;
            setBestAcc(a);
            idbStorage.setItem(BEST_ACC_KEY, legacyAcc);
            idbStorage.removeItem("karuvi.fun.typing.bestAcc");
          }
          setBestLoaded(true);
        }).catch(() => setBestLoaded(true));
      }
    }).catch(e => {
      logger.error("[TypingTest] Failed to load data", { error: e });
      setBestLoaded(true);
    });
  }, []);

  // ── Timer management ──────────────────────────────────────────────────────

  useEffect(() => {
    if (status === "typing") {
      timerRef.current = setInterval(() => setSecondsElapsed(p => p + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [status]);

  useEffect(() => {
    return () => {
      if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
    };
  }, []);

  // ── Stats ─────────────────────────────────────────────────────────────────

  const stats = useMemo(() => {
    if (status === "idle") return { wpm: 0, accuracy: 0, timeS: 0 };
    const elapsed = status === "finished"
      ? (endTime! - startTime!) / 1000
      : secondsElapsed;
    const elapsedMin = elapsed / 60;

    let correctChars = 0;
    for (let i = 0; i < input.length; i++) {
      if (input[i] === targetText[i]) correctChars++;
    }

    const totalKeystrokes = Math.max(input.length, 1) + mistakesCount;
    const accuracy = Math.max(0, Math.round(((totalKeystrokes - mistakesCount) / totalKeystrokes) * 100));
    const wpm = elapsedMin > 0 ? Math.round((correctChars / 5) / elapsedMin) : 0;

    return { wpm, accuracy, timeS: Math.round(elapsed) };
  }, [input, status, startTime, endTime, targetText, secondsElapsed, mistakesCount]);

  // ── Input handler ─────────────────────────────────────────────────────────

  const handleInput = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (val.length > targetText.length) return;

    let currentStartTime = startTime;
    if (status === "idle") {
      setStatus("typing");
      currentStartTime = Date.now();
      setStartTime(currentStartTime);
      setSecondsElapsed(0);
      setMistakesCount(0);
      setMissedChars({});
    }
    
    // Track new mistakes if text was added
    let newMistakesCount = mistakesCount;
    if (val.length > input.length) {
      const newCharsStr = val.slice(input.length);
      const newMissedChars = { ...missedChars };
      
      for (let i = 0; i < newCharsStr.length; i++) {
        const idx = input.length + i;
        const typedChar = newCharsStr[i];
        const expectedChar = targetText[idx];
        
        if (typedChar !== expectedChar) {
          newMistakesCount++;
          const key = expectedChar || 'End';
          newMissedChars[key] = (newMissedChars[key] || 0) + 1;
        }
      }
      
      if (newMistakesCount > mistakesCount) {
        setMistakesCount(newMistakesCount);
        setMissedChars(newMissedChars);
      }
    }
    
    setInput(val);

    if (val === targetText) {
      setStatus("finished");
      const currentEndTime = Date.now();
      setEndTime(currentEndTime);

      if (bestLoaded) {
        const start = currentStartTime || Date.now();
        const elapsed = (currentEndTime - start) / 1000;
        const elapsedMin = elapsed / 60;
        
        const totalKeystrokes = Math.max(val.length, 1) + newMistakesCount;
        const finalAccuracy = Math.max(0, Math.round(((totalKeystrokes - newMistakesCount) / totalKeystrokes) * 100));
        const finalWpm = elapsedMin > 0 ? Math.round((val.length / 5) / elapsedMin) : 0;

        if (bestWpm === null || finalWpm > bestWpm) {
          setBestWpm(finalWpm);
          idbStorage.setItem(BEST_WPM_KEY, String(finalWpm)).catch(e => logger.error("[TypingTest]", e));
        }
        if (bestAcc === null || finalAccuracy > bestAcc) {
          setBestAcc(finalAccuracy);
          idbStorage.setItem(BEST_ACC_KEY, String(finalAccuracy)).catch(e => logger.error("[TypingTest]", e));
        }
        
        setHistory(prev => {
          const newHist = [...prev, { date: Date.now(), wpm: finalWpm, accuracy: finalAccuracy }].slice(-10);
          idbStorage.setItem(HISTORY_KEY, JSON.stringify(newHist)).catch(e => logger.error("[TypingTest]", e));
          return newHist;
        });
      }
    }
  }, [status, targetText, startTime, bestLoaded, bestWpm, bestAcc, input.length, mistakesCount, missedChars]);

  // ── Reset ─────────────────────────────────────────────────────────────────

  const reset = useCallback(() => {
    setInput("");
    setStatus("idle");
    setStartTime(null);
    setEndTime(null);
    setSecondsElapsed(0);
    setMistakesCount(0);
    setMissedChars({});
    setTextIndex(prev => (prev + 1) % SAMPLE_TEXTS.length);
    if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
    resetTimeoutRef.current = setTimeout(() => {
      inputRef.current?.focus();
      resetTimeoutRef.current = null;
    }, 50);
  }, []);

  // ── Render Helpers ────────────────────────────────────────────────────────

  const renderText = useCallback(() => {
    return targetText.split("").map((char, index) => {
      let cls = "text-text-muted";
      if (index < input.length) {
        cls = input[index] === char
          ? "text-emerald-500"
          : "text-rose-400 bg-rose-400/10 rounded-sm";
      } else if (index === input.length) {
        cls = "text-text border-b-2 border-[#8B5CF6] animate-pulse";
      }
      return (
        <span key={index} className={`transition-colors ${cls}`}>
          {char}
        </span>
      );
    });
  }, [targetText, input]);

  const isNewBestWpm = status === "finished" && bestLoaded && (bestWpm === stats.wpm);
  const isNewBestAcc = status === "finished" && bestLoaded && (bestAcc === stats.accuracy);

  const getTypingLevel = (wpm: number) => {
    if (wpm < 30) return { title: "Beginner", color: "text-blue-400" };
    if (wpm <= 50) return { title: "Intermediate", color: "text-emerald-400" };
    if (wpm <= 70) return { title: "Advanced", color: "text-purple-400" };
    if (wpm <= 90) return { title: "Professional", color: "text-orange-400" };
    return { title: "Typemaster", color: "text-rose-500" };
  };

  const getImprovementTip = (wpm: number, accuracy: number) => {
    if (accuracy < 90) return "Focus on accuracy first! Slow down slightly to reduce mistakes—your speed will naturally increase as you build muscle memory.";
    if (wpm > 70 && accuracy >= 95) return "Incredible typing! To push even further, try looking one or two words ahead while you type.";
    if (wpm <= 40) return "Great job! Try to keep your hands in the home row position (ASDF JKL;) and minimize looking at the keyboard.";
    return "Solid performance! Keep practicing daily to build more muscle memory and increase your speed.";
  };

  const level = getTypingLevel(stats.wpm);
  const topMissed = Object.entries(missedChars).sort((a, b) => b[1] - a[1]).slice(0, 3);
  
  const avgWpm = history.length > 0 
    ? Math.round(history.reduce((acc, h) => acc + h.wpm, 0) / history.length) 
    : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* ── Stats ── */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: Trophy,   label: "WPM",      val: stats.wpm,      suffix: "",  best: bestWpm, isNew: isNewBestWpm },
          { icon: Target,   label: "Accuracy", val: stats.accuracy, suffix: "%", best: bestAcc, isNew: isNewBestAcc },
          { icon: Timer,    label: "Time",     val: stats.timeS,    suffix: "s", best: null,    isNew: false },
        ].map(({ icon: Icon, label, val, suffix, best, isNew }) => (
          <div
            key={label}
            className="p-5 bg-surface border border-border rounded-3xl flex flex-col items-center justify-center gap-1.5"
            aria-label={`${label}: ${val}${suffix}`}
          >
            <Icon className="w-5 h-5 text-[#8B5CF6]" aria-hidden="true" />
            <div className="text-3xl font-black text-text">{val}{suffix}</div>
            <div className="text-xs font-bold text-text-muted uppercase tracking-widest">{label}</div>
            {best !== null && (
              <div className={`text-[10px] font-bold ${isNew ? "text-emerald-500" : "text-text-muted"}`}>
                {isNew ? "🏆 New best!" : `Best: ${best}${suffix}`}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── Text Display + Hidden Textarea ── */}
      <div
        className={`relative p-4 sm:p-8 bg-surface border rounded-4xl space-y-2 overflow-hidden cursor-text transition-colors duration-300 ${status === 'finished' ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-border'}`}
        onClick={() => inputRef.current?.focus()}
      >
        {status === "idle" && (
          <p className="text-xs font-bold text-[#8B5CF6] uppercase tracking-widest mb-2">
            <Keyboard className="w-3 h-3 inline mr-1.5" aria-hidden="true" />
            Click here or start typing
          </p>
        )}
        <div
          className="text-xl leading-relaxed font-medium font-mono select-none"
          aria-live="off"
        >
          {renderText()}
        </div>

        <textarea
          ref={inputRef}
          value={input}
          onChange={handleInput}
          disabled={status === "finished"}
          className="absolute inset-0 w-full h-full opacity-0 cursor-text resize-none"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          aria-label="Type the prompt text here."
        />

        <AnimatePresence>
          {status === "finished" && (
            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-4 pt-6 border-t border-border mt-6 relative z-content"
            >
              <button
                onClick={reset}
                className="flex items-center gap-2 px-6 py-3 bg-[#8B5CF6] text-white rounded-xl font-bold hover:bg-[#7C3AED] transition-colors shadow-lg shadow-[#8B5CF6]/20"
              >
                <RefreshCw className="w-4 h-4" /> Next Test
              </button>
            </m.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Bottom bar / Progress ── */}
      {status !== "finished" && (
        <div className="flex justify-between items-center px-1">
          <p className="text-sm text-text-muted font-medium">
            {status === "idle"
              ? "Start typing to begin the timer."
              : `${input.length} / ${targetText.length} characters`}
          </p>
          <button
            onClick={reset}
            className="flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-lg text-sm font-bold text-text-2 hover:border-[#8B5CF6] transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> Skip
          </button>
        </div>
      )}

      {/* ── Performance Summary (Finished State) ── */}
      <AnimatePresence>
        {status === "finished" && (
          <m.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 overflow-hidden"
          >
            {/* Level & Tips */}
            <div className="bg-surface border border-border p-6 rounded-3xl space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue/10 rounded-xl">
                  <Activity className="w-5 h-5 text-blue" />
                </div>
                <div>
                  <h3 className="font-bold text-text text-sm uppercase tracking-wider">Performance Summary</h3>
                  <p className="text-xs text-text-muted font-medium">Your skill assessment</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-border/50">
                <span className="text-sm text-text-3 font-bold">Typing Level</span>
                <span className={`text-lg font-black ${level.color}`}>{level.title}</span>
              </div>
              
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Improvement Tip</span>
                <p className="text-sm text-text-2 leading-relaxed bg-bg p-4 rounded-2xl border border-border/50">
                  {getImprovementTip(stats.wpm, stats.accuracy)}
                </p>
              </div>
            </div>

            {/* Mistakes & History */}
            <div className="bg-surface border border-border p-6 rounded-3xl space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-rose-500/10 rounded-xl">
                  <TrendingUp className="w-5 h-5 text-rose-500" />
                </div>
                <div>
                  <h3 className="font-bold text-text text-sm uppercase tracking-wider">Analysis & History</h3>
                  <p className="text-xs text-text-muted font-medium">Mistakes and tracking</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-bg p-4 rounded-2xl border border-border/50 flex flex-col justify-center gap-1">
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Mistakes Made</span>
                  <span className="text-2xl font-black text-text">{mistakesCount}</span>
                </div>
                <div className="bg-bg p-4 rounded-2xl border border-border/50 flex flex-col justify-center gap-1">
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Recent Avg WPM</span>
                  <span className="text-2xl font-black text-text">{history.length > 0 ? avgWpm : stats.wpm}</span>
                </div>
              </div>

              {topMissed.length > 0 && (
                <div className="pt-3">
                   <div className="flex items-center gap-2 mb-3">
                     <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />
                     <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Trouble Keys</span>
                   </div>
                   <div className="flex gap-2 flex-wrap">
                     {topMissed.map(([char, count]) => (
                       <div key={char} className="flex items-center gap-1.5 px-3 py-1.5 bg-bg border border-border rounded-lg text-sm">
                         <span className="font-mono font-bold text-rose-400">
                           {char === ' ' ? 'Space' : char}
                         </span>
                         <span className="text-text-muted text-xs font-bold">×{count}</span>
                       </div>
                     ))}
                   </div>
                </div>
              )}
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
