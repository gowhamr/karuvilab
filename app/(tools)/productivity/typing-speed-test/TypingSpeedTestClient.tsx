"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Timer, Trophy, Target, RefreshCw, Keyboard } from "lucide-react";
import { m, AnimatePresence } from "framer-motion";
import { idbStorage } from "@/src/store/idb-storage";
import { logger } from "@/src/lib/logger";

// ─── Constants ────────────────────────────────────────────────────────────────

const BEST_WPM_KEY = "karuvi.productivity.typing.bestWpm";
const BEST_ACC_KEY = "karuvi.productivity.typing.bestAcc";

const SAMPLE_TEXTS = [
  "The quick brown fox jumps over the lazy dog near the riverbank on a sunny afternoon in autumn.",
  "Programming is the art of telling another human what one wants the computer to do in plain terms.",
  "In software development, debugging is twice as hard as writing the code in the first place.",
  "The best way to predict the future is to invent it. Innovation distinguishes between a leader and a follower.",
  "Simplicity is the soul of efficiency. A good engineer writes code that humans can understand as well as machines.",
  "Productivity is never an accident. It is always the result of commitment to excellence and intelligent planning.",
  "The only way to do great work is to love what you do. Stay hungry, stay foolish, and never stop learning.",
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function TypingSpeedTestClient() {
  const [textIndex, setTextIndex] = useState(() => Math.floor(Math.random() * SAMPLE_TEXTS.length));
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"idle" | "typing" | "finished">("idle");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [bestWpm, setBestWpm] = useState<number | null>(null);
  const [bestAcc, setBestAcc] = useState<number | null>(null);
  const [bestLoaded, setBestLoaded] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const resetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const targetText = SAMPLE_TEXTS[textIndex]!;

  // ── Load persisted bests with legacy migration support ──────────────────────

  useEffect(() => {
    Promise.all([
      idbStorage.getItem(BEST_WPM_KEY),
      idbStorage.getItem(BEST_ACC_KEY),
    ]).then(([wpmRaw, accRaw]) => {
      if (wpmRaw || accRaw) {
        if (wpmRaw) setBestWpm(parseInt(wpmRaw, 10) || null);
        if (accRaw) setBestAcc(parseInt(accRaw, 10) || null);
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
      logger.error("[TypingTest] Failed to load bests", { error: e });
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

  // Cleanup reset timer on unmount
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

    const accuracy = input.length > 0 ? Math.round((correctChars / input.length) * 100) : 0;
    const wpm = elapsedMin > 0 ? Math.round((correctChars / 5) / elapsedMin) : 0;

    return { wpm, accuracy, timeS: Math.round(elapsed) };
  }, [input, status, startTime, endTime, targetText, secondsElapsed]);

  // ── Input handler ─────────────────────────────────────────────────────────

  const handleInput = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;

    // Prevent typing past target length
    if (val.length > targetText.length) return;

    let currentStartTime = startTime;
    if (status === "idle") {
      setStatus("typing");
      currentStartTime = Date.now();
      setStartTime(currentStartTime);
      setSecondsElapsed(0);
    }
    setInput(val);

    if (val === targetText) {
      setStatus("finished");
      const currentEndTime = Date.now();
      setEndTime(currentEndTime);

      // Perform calculations and save immediately inline
      if (bestLoaded) {
        const start = currentStartTime || Date.now();
        const elapsed = (currentEndTime - start) / 1000;
        const elapsedMin = elapsed / 60;
        
        let correctChars = 0;
        for (let i = 0; i < val.length; i++) {
          if (val[i] === targetText[i]) correctChars++;
        }
        
        const accuracy = val.length > 0 ? Math.round((correctChars / val.length) * 100) : 0;
        const wpm = elapsedMin > 0 ? Math.round((correctChars / 5) / elapsedMin) : 0;

        if (bestWpm === null || wpm > bestWpm) {
          setBestWpm(wpm);
          idbStorage.setItem(BEST_WPM_KEY, String(wpm)).catch((e) =>
            logger.error("[TypingTest] Failed to persist best WPM", { error: e })
          );
        }
        if (bestAcc === null || accuracy > bestAcc) {
          setBestAcc(accuracy);
          idbStorage.setItem(BEST_ACC_KEY, String(accuracy)).catch((e) =>
            logger.error("[TypingTest] Failed to persist best accuracy", { error: e })
          );
        }
      }
    }
  }, [status, targetText, startTime, bestLoaded, bestWpm, bestAcc]);

  // ── Reset ─────────────────────────────────────────────────────────────────

  const reset = useCallback(() => {
    setInput("");
    setStatus("idle");
    setStartTime(null);
    setEndTime(null);
    setSecondsElapsed(0);
    setTextIndex(prev => (prev + 1) % SAMPLE_TEXTS.length);
    if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
    resetTimeoutRef.current = setTimeout(() => {
      inputRef.current?.focus();
      resetTimeoutRef.current = null;
    }, 50);
  }, []);

  // ── Render characters ─────────────────────────────────────────────────────

  const renderText = useCallback(() => {
    return targetText.split("").map((char, index) => {
      let cls = "text-text-4"; // not yet typed
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

  const formatTime = (s: number) =>
    s < 60 ? `${s}s` : `${Math.floor(s / 60)}m ${s % 60}s`;

  const isNewBestWpm = status === "finished" && bestLoaded && (bestWpm === stats.wpm);
  const isNewBestAcc = status === "finished" && bestLoaded && (bestAcc === stats.accuracy);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* ── Stats ── */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: Trophy,   label: "WPM",      val: stats.wpm,      suffix: "",  best: bestWpm, isNew: isNewBestWpm },
          { icon: Target,   label: "Accuracy", val: stats.accuracy, suffix: "%", best: bestAcc, isNew: isNewBestAcc },
          { icon: Timer,    label: "Time",      val: stats.timeS,   suffix: "s", best: null,    isNew: false },
        ].map(({ icon: Icon, label, val, suffix, best, isNew }) => (
          <div
            key={label}
            className="p-5 bg-surface border border-border rounded-3xl flex flex-col items-center justify-center gap-1.5"
            aria-label={`${label}: ${val}${suffix}`}
          >
            <Icon className="w-5 h-5 text-[#8B5CF6]" aria-hidden="true" />
            <div className="text-3xl font-black text-text">{val}{suffix}</div>
            <div className="text-xs font-bold text-text-4 uppercase tracking-widest">{label}</div>
            {best !== null && (
              <div className={`text-[10px] font-bold ${isNew ? "text-emerald-500" : "text-text-4"}`}>
                {isNew ? "🏆 New best!" : `Best: ${best}${suffix}`}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── Text Display + Hidden Textarea ── */}
      <div
        className="relative p-8 bg-surface border border-border rounded-4xl space-y-2 overflow-hidden cursor-text"
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
          aria-label="Typing prompt text"
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
          aria-label="Type the prompt text here. Your input is tracked character by character."
        />

        <AnimatePresence>
          {status === "finished" && (
            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-4 pt-6 border-t border-border"
            >
              <span className="text-xl font-bold text-emerald-500">
                {stats.accuracy >= 95 ? "🎉 Excellent!" : "✓ Complete!"}
              </span>
              <button
                onClick={reset}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#8B5CF6] text-white rounded-xl font-bold hover:bg-[#7C3AED] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]"
                aria-label="Try a new text prompt"
              >
                <RefreshCw className="w-4 h-4" aria-hidden="true" /> Try Again
              </button>
            </m.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Bottom bar ── */}
      <div className="flex justify-between items-center px-1">
        <p className="text-sm text-text-4 font-medium">
          {status === "idle"
            ? "Start typing to begin the timer."
            : status === "typing"
            ? `${input.length} / ${targetText.length} characters`
            : "Finished! See your results above."}
        </p>
        <button
          onClick={reset}
          className="flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-lg text-sm font-bold text-text-2 hover:border-[#8B5CF6] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]"
          aria-label="Reset test and get a new prompt"
        >
          <RefreshCw className="w-4 h-4" aria-hidden="true" /> New Prompt
        </button>
      </div>
    </div>
  );
}
