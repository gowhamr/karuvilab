"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { m, AnimatePresence } from "framer-motion";
import { RotateCcw, Trophy, Award, Timer, ShieldAlert } from "lucide-react";
import { idbStorage } from "@/src/store/idb-storage";
import { logger } from "@/src/lib/logger";

const BEST_STREAK_KEY = "karuvi.breaktime.colormatch.best";
const ROUND_TIME_LIMIT = 5; // 5 seconds per round

interface HSL {
  h: number;
  s: number;
  l: number;
}

interface Swatch {
  id: number;
  color: HSL;
  isTarget: boolean;
}

type GameState = "idle" | "playing" | "gameover";

function toHSLString(color: HSL): string {
  return `hsl(${color.h}, ${color.s}%, ${color.l}%)`;
}

// Helper to shuffle array
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

export default function ColorMatchClient() {
  const [gameState, setGameState] = useState<GameState>("idle");
  const [targetColor, setTargetColor] = useState<HSL>({ h: 0, s: 0, l: 0 });
  const [swatches, setSwatches] = useState<Swatch[]>([]);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [bestLoaded, setBestLoaded] = useState(false);
  
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [correctAttempts, setCorrectAttempts] = useState(0);
  
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME_LIMIT);
  const [gameOverReason, setGameOverReason] = useState<"incorrect" | "timeout" | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load best streak on mount
  useEffect(() => {
    idbStorage.getItem(BEST_STREAK_KEY).then((raw) => {
      if (raw) setBestStreak(parseInt(raw, 10) || 0);
      setBestLoaded(true);
    }).catch((e) => {
      logger.error("[ColorMatch] Failed to load best streak", { error: e });
      setBestLoaded(true);
    });
  }, []);

  // Save best streak to idb
  const updateBestStreak = useCallback((newStreak: number) => {
    setBestStreak((prev) => {
      const next = Math.max(prev, newStreak);
      if (next === newStreak && bestLoaded) {
        idbStorage.setItem(BEST_STREAK_KEY, String(next)).catch((e) => {
          logger.error("[ColorMatch] Failed to save best streak", { error: e });
        });
      }
      return next;
    });
  }, [bestLoaded]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Stable ref so nextRound's interval callback can call handleRoundEnd without hoisting issues (KL-04 pattern)
  const handleRoundEndRef = useRef<(correct: boolean, reason: "incorrect" | "timeout" | null) => void>(() => {});

  // Generate game board for the current streak level
  const nextRound = useCallback((currentStreak: number) => {
    // Generate target color
    const target: HSL = {
      h: Math.floor(Math.random() * 360),
      s: 50 + Math.floor(Math.random() * 40), // 50% - 90%
      l: 40 + Math.floor(Math.random() * 30), // 40% - 70%
    };
    setTargetColor(target);

    // Calculate variation range based on streak (gets harder as streak increases)
    // Level 0: variation is large. Level 20+: variation is tiny.
    const diffFactor = Math.max(0.1, 1 - currentStreak * 0.04); // reduces color difference as streak increases
    const hDiff = Math.max(4, Math.round(25 * diffFactor));
    const sDiff = Math.max(3, Math.round(20 * diffFactor));
    const lDiff = Math.max(3, Math.round(20 * diffFactor));

    const options: Swatch[] = [
      { id: 1, color: target, isTarget: true }
    ];

    // Helper to add sign variation
    const sign = () => (Math.random() > 0.5 ? 1 : -1);

    // Generate N-1 similar swatches (grid of 4 swatches total)
    for (let i = 2; i <= 4; i++) {
      // Add slight variations to target color
      const hOffset = (hDiff + Math.floor(Math.random() * hDiff)) * sign();
      const sOffset = (sDiff + Math.floor(Math.random() * sDiff)) * sign();
      const lOffset = (lDiff + Math.floor(Math.random() * lDiff)) * sign();

      options.push({
        id: i,
        color: {
          h: (target.h + hOffset + 360) % 360,
          s: Math.max(20, Math.min(95, target.s + sOffset)),
          l: Math.max(20, Math.min(85, target.l + lOffset)),
        },
        isTarget: false,
      });
    }

    setSwatches(shuffle(options));
    setTimeLeft(ROUND_TIME_LIMIT);
    setGameState("playing");

    // Start 5-second round countdown timer
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0.1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleRoundEndRef.current(false, "timeout");
          return 0;
        }
        return Number((prev - 0.1).toFixed(1));
      });
    }, 100);
  }, []);

  const handleRoundEnd = useCallback((correct: boolean, reason: "incorrect" | "timeout" | null = null) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTotalAttempts(p => p + 1);

    if (correct) {
      setCorrectAttempts(p => p + 1);
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      updateBestStreak(nextStreak);
      nextRound(nextStreak);
    } else {
      setGameOverReason(reason);
      setGameState("gameover");
    }
  }, [streak, nextRound, updateBestStreak]);

  useEffect(() => {
    handleRoundEndRef.current = handleRoundEnd;
  }, [handleRoundEnd]);


  const selectSwatch = useCallback((swatch: Swatch) => {
    if (gameState !== "playing") return;
    handleRoundEnd(swatch.isTarget, "incorrect");
  }, [gameState, handleRoundEnd]);

  const startGame = useCallback(() => {
    setStreak(0);
    setTotalAttempts(0);
    setCorrectAttempts(0);
    setGameOverReason(null);
    nextRound(0);
  }, [nextRound]);

  // Keyboard controls: 1, 2, 3, 4 for accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== "playing") return;
      const keyMap: Record<string, number> = { "1": 0, "2": 1, "3": 2, "4": 3 };
      if (e.key in keyMap) {
        const idx = keyMap[e.key]!;
        if (swatches[idx]) {
          selectSwatch(swatches[idx]);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState, swatches, selectSwatch]);

  const accuracy = totalAttempts > 0 
    ? Math.round((correctAttempts / totalAttempts) * 100) 
    : 0;

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Stats display */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Best Streak", val: bestStreak, icon: <Trophy className="w-4 h-4 text-primary" /> },
          { label: "Current Streak", val: streak, icon: <Award className="w-4 h-4 text-primary" /> },
          { label: "Accuracy", val: totalAttempts > 0 ? `${accuracy}%` : "—", icon: <Timer className="w-4 h-4 text-primary" /> },
        ].map(({ label, val, icon }) => (
          <div key={label} className="rounded-card border border-divider bg-surface p-3 flex flex-col items-center gap-1 select-none">
            {icon}
            <span className="text-xl font-black text-text">{val}</span>
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest text-center">{label}</span>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {gameState === "idle" && (
          <m.div
            key="idle"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-card border border-divider bg-surface p-4 sm:p-8 text-center space-y-5"
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto text-3xl">
              🎨
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-text">Color Match Test</h2>
              <p className="text-text-muted text-sm max-w-sm mx-auto leading-relaxed">
                A target color block will be shown. You have 5 seconds to select the exact matching swatch from 4 similar choices.
              </p>
            </div>
            <m.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={startGame}
              className="rounded-btn px-6 py-3 bg-primary text-white font-bold hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary "
            >
              Start Game
            </m.button>
          </m.div>
        )}

        {gameState === "playing" && (
          <m.div
            key="playing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Round info and Timer */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-text-muted">
                <span>PICK THE EXACT MATCH</span>
                <span className={timeLeft <= 1.5 ? "text-danger animate-pulse" : ""}>
                  TIME: {timeLeft.toFixed(1)}s
                </span>
              </div>
              <div className="h-2 bg-divider rounded-full overflow-hidden" role="progressbar" aria-valuenow={timeLeft} aria-valuemin={0} aria-valuemax={ROUND_TIME_LIMIT}>
                <m.div
                  className={`h-full rounded-full ${timeLeft <= 1.5 ? "bg-danger" : "bg-primary"}`}
                  animate={{ width: `${(timeLeft / ROUND_TIME_LIMIT) * 100}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
            </div>

            {/* Target Color Block */}
            <div className="flex flex-col items-center justify-center gap-2 p-6 rounded-card border border-divider bg-surface select-none">
              <div
                className="w-32 h-32 rounded-2xl shadow-inner border border-black/10"
                style={{ backgroundColor: toHSLString(targetColor) }}
              />
              <span className="text-xs font-black text-text-muted mt-2 tracking-widest uppercase">Target Color</span>
            </div>

            {/* Swatch Grid */}
            <div className="grid grid-cols-2 gap-4">
              {swatches.map((swatch, idx) => (
                <m.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  key={swatch.id}
                  onClick={() => selectSwatch(swatch)}
                  className="p-3 rounded-card border-2 border-divider bg-surface hover:border-primary/50  transition-all flex flex-col items-center gap-3 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  aria-label={`Color swatch option ${idx + 1}`}
                >
                  <div
                    className="w-full aspect-[2/1] rounded-xl border border-black/5"
                    style={{ backgroundColor: toHSLString(swatch.color) }}
                  />
                  <div className="flex items-center gap-1.5 justify-center">
                    <kbd className="px-1.5 py-0.5 rounded bg-surface-elevated border border-divider text-[10px] font-mono font-bold text-text-muted">
                      {idx + 1}
                    </kbd>
                    <span className="text-xs font-bold text-text-muted">Select</span>
                  </div>
                </m.button>
              ))}
            </div>
          </m.div>
        )}

        {gameState === "gameover" && (
          <m.div
            key="gameover"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="rounded-card border border-divider bg-surface p-4 sm:p-8 text-center space-y-5"
          >
            <div className="w-16 h-16 rounded-full bg-danger/10 text-danger flex items-center justify-center mx-auto">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-text">
                {gameOverReason === "timeout" ? "Time ran out!" : "Incorrect Match!"}
              </h2>
              <p className="text-text-muted text-sm max-w-sm mx-auto">
                You reached a streak of <strong className="text-text-primary">{streak}</strong>. Good effort!
              </p>
            </div>

            <div className="border border-divider rounded-2xl p-4 bg-surface-elevated/40 grid grid-cols-2 gap-2 text-center text-sm font-medium">
              <div>
                <span className="text-text-muted block text-xs">Total Rounds</span>
                <span className="text-lg font-black text-text">{totalAttempts}</span>
              </div>
              <div>
                <span className="text-text-muted block text-xs">Correct Matches</span>
                <span className="text-lg font-black text-text">{correctAttempts}</span>
              </div>
            </div>

            <div className="flex justify-center gap-3">
              <m.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => setGameState("idle")}
                className="rounded-btn px-5 py-2.5 bg-surface border border-divider font-bold text-text-secondary hover:text-text-primary transition-all "
              >
                Back Menu
              </m.button>
              <m.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={startGame}
                className="rounded-btn px-6 py-2.5 bg-primary text-white font-bold hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary "
              >
                Play Again
              </m.button>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
