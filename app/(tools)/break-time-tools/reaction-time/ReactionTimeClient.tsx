"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { m, AnimatePresence } from "framer-motion";
import { RotateCcw, Trophy, Zap, AlertCircle } from "lucide-react";
import { idbStorage } from "@/src/store/idb-storage";
import { logger } from "@/src/lib/logger";
import { ToolWorkspace } from "@/components/ui/ToolWorkspace";

const BEST_SCORE_KEY = "karuvi.breaktime.reaction.best";

type GameState = "idle" | "waiting" | "stimulus" | "result" | "penalty";

export default function ReactionTimeClient() {
  const [gameState, setGameState] = useState<GameState>("idle");
  const [time, setTime] = useState<number | null>(null);
  const [best, setBest] = useState<number | null>(null);
  const [history, setHistory] = useState<number[]>([]);
  const [bestLoaded, setBestLoaded] = useState(false);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTimeRef = useRef<number>(0);

  // Load best score on mount
  useEffect(() => {
    idbStorage.getItem(BEST_SCORE_KEY).then((raw) => {
      if (raw) {
        setBest(parseInt(raw, 10));
      }
      setBestLoaded(true);
    }).catch((e) => {
      logger.error("[ReactionTime] Failed to load best score", { error: e });
      setBestLoaded(true);
    });
  }, []);

  // Save best score to idb
  const updateBest = useCallback((newScore: number) => {
    setBest((prev) => {
      const next = prev === null ? newScore : Math.min(prev, newScore);
      if (next === newScore) {
        idbStorage.setItem(BEST_SCORE_KEY, String(next)).catch((e) => {
          logger.error("[ReactionTime] Failed to save best score", { error: e });
        });
      }
      return next;
    });
  }, []);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const triggerStimulus = useCallback(() => {
    setGameState("stimulus");
    startTimeRef.current = performance.now();
  }, []);

  const startTest = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setGameState("waiting");
    setTime(null);

    // Random delay between 1500ms and 4500ms
    const delay = 1500 + Math.random() * 3000;
    timeoutRef.current = setTimeout(triggerStimulus, delay);
  }, [triggerStimulus]);

  const handleTrigger = useCallback(() => {
    if (gameState === "idle" || gameState === "result" || gameState === "penalty") {
      startTest();
    } else if (gameState === "waiting") {
      // False start! Penalty.
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setGameState("penalty");
    } else if (gameState === "stimulus") {
      const endTime = performance.now();
      const reactTime = Math.round(endTime - startTimeRef.current);
      setTime(reactTime);
      setHistory((prev) => [...prev, reactTime]);
      updateBest(reactTime);
      setGameState("result");
    }
  }, [gameState, startTest, updateBest]);

  // Spacebar to trigger test clicks for keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        handleTrigger();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleTrigger]);

  const resetHistory = useCallback(() => {
    setHistory([]);
    setTime(null);
    setGameState("idle");
  }, []);

  const average = history.length > 0 
    ? Math.round(history.reduce((a, b) => a + b, 0) / history.length) 
    : null;

  return (
    <ToolWorkspace
      layout="stacked"
      input={
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Best Reflex", val: best ? `${best} ms` : "—", icon: <Trophy className="w-4 h-4 text-primary" /> },
            { label: "Average", val: average ? `${average} ms` : "—", icon: <Zap className="w-4 h-4 text-primary" /> },
            { label: "Attempts", val: history.length, icon: <RotateCcw className="w-4 h-4 text-primary" /> },
          ].map(({ label, val, icon }) => (
            <div key={label} className="rounded-card border border-divider bg-surface p-3 flex flex-col items-center gap-1 select-none">
              {icon}
              <span className="text-xl font-black text-text">{val}</span>
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest text-center">{label}</span>
            </div>
          ))}
        </div>
      }
      output={
        <m.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={handleTrigger}
          className={`w-full aspect-[4/3] rounded-card border-2 transition-all flex flex-col items-center justify-center gap-4 text-center cursor-pointer select-none outline-none focus-visible:ring-4 focus-visible:ring-primary/40 relative overflow-hidden ${
            gameState === "idle" && "border-divider bg-surface hover:border-primary/40 hover:bg-surface-elevated/20"
          } ${
            gameState === "waiting" && "border-warning/30 bg-warning/5 text-warning"
          } ${
            gameState === "stimulus" && "border-success bg-success/15 text-success scale-[1.01]"
          } ${
            gameState === "result" && "border-primary bg-primary/5 text-primary"
          } ${
            gameState === "penalty" && "border-danger bg-danger/10 text-danger"
          }`}
          aria-label="Reaction Stimulus Screen"
        >
          <AnimatePresence mode="wait">
            {gameState === "idle" && (
              <m.div
                key="idle"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="p-6 space-y-2 flex flex-col items-center"
              >
                <Zap className="w-12 h-12 text-primary animate-pulse" />
                <h2 className="text-2xl font-black text-text">Reaction Time Test</h2>
                <p className="text-text-muted text-sm max-w-sm">
                  Click anywhere on this screen or press <kbd className="px-1.5 py-0.5 rounded bg-surface-elevated border border-divider text-xs font-mono">Spacebar</kbd> to begin.
                </p>
              </m.div>
            )}

            {gameState === "waiting" && (
              <m.div
                key="waiting"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-6 space-y-2 flex flex-col items-center"
              >
                <div className="w-3 h-3 rounded-full bg-warning animate-ping" />
                <h2 className="text-3xl font-black">Wait for green...</h2>
                <p className="opacity-80 text-sm">Don't click yet!</p>
              </m.div>
            )}

            {gameState === "stimulus" && (
              <m.div
                key="stimulus"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="p-6 space-y-2 flex flex-col items-center"
              >
                <div className="absolute inset-0 bg-success/10 animate-ping pointer-events-none" />
                <h2 className="text-4xl font-black tracking-tight animate-bounce">CLICK NOW!</h2>
                <p className="opacity-90 text-sm">FAST!</p>
              </m.div>
            )}

            {gameState === "result" && (
              <m.div
                key="result"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 space-y-2 flex flex-col items-center"
              >
                <h2 className="text-5xl font-black tracking-tight">{time} <span className="text-lg font-bold">ms</span></h2>
                <p className="text-text-muted text-sm">
                  Click to try again.
                </p>
                {best === time && (
                  <div className="mt-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-xs font-bold text-primary flex items-center gap-1.5">
                    <Trophy className="w-3 h-3" /> New Personal Best!
                  </div>
                )}
              </m.div>
            )}

            {gameState === "penalty" && (
              <m.div
                key="penalty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 space-y-2 flex flex-col items-center"
              >
                <AlertCircle className="w-12 h-12 text-danger" />
                <h2 className="text-2xl font-black">Too early!</h2>
                <p className="text-text-muted text-sm">
                  Wait for the screen to turn green before clicking.
                </p>
                <p className="text-xs text-danger/80 font-bold uppercase tracking-wider mt-2">
                  Click to restart
                </p>
              </m.div>
            )}
          </AnimatePresence>
        </m.button>
      }
      infoPanel={
        history.length > 0 && (
          <div className="flex items-center justify-between">
            <p className="text-xs text-text-muted">
              Test results are persisted locally.
            </p>
            <m.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={resetHistory}
              className="rounded-btn px-4 py-2 bg-surface border border-divider text-text-muted hover:text-text-primary hover:border-danger/30 hover:bg-danger/5 transition-all text-xs font-bold flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary "
            >
              <RotateCcw className="w-3.5 h-3.5" /> Clear History
            </m.button>
          </div>
        )
      }
    />
  );
}
