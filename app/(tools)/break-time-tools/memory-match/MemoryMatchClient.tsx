"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { m, AnimatePresence } from "framer-motion";
import { RotateCcw, Trophy, Timer } from "lucide-react";
import { idbStorage } from "@/src/store/idb-storage";
import { logger } from "@/src/lib/logger";

// ─── Card data ────────────────────────────────────────────────────────────────

const CARD_EMOJIS = ["🦊", "🐼", "🦁", "🐸", "🦋", "🐬", "🦜", "🦄"];

const BEST_SCORE_KEY = "karuvi.breaktime.memory.best"; // best = fewest moves

interface Card {
  id: number;       // unique per slot
  emoji: string;
  pairId: number;   // shared with its match
  flipped: boolean;
  matched: boolean;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

function buildDeck(): Card[] {
  const pairs = CARD_EMOJIS.flatMap((emoji, pairId) => [
    { id: pairId * 2,     emoji, pairId, flipped: false, matched: false },
    { id: pairId * 2 + 1, emoji, pairId, flipped: false, matched: false },
  ]);
  return shuffle(pairs);
}

const EMPTY_BEST = 9999;

// ─── Component ────────────────────────────────────────────────────────────────

export default function MemoryMatchClient() {
  const [cards, setCards] = useState<Card[]>(buildDeck);
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [best, setBest] = useState(EMPTY_BEST);
  const [bestLoaded, setBestLoaded] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const lockRef = useRef(false); // prevents triple-click during flip animation
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const flipTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startedRef = useRef(false);

  // Load best score with legacy migration support
  useEffect(() => {
    idbStorage.getItem(BEST_SCORE_KEY).then((raw) => {
      if (raw) {
        setBest(parseInt(raw, 10) || EMPTY_BEST);
        setBestLoaded(true);
      } else {
        // Check legacy key
        idbStorage.getItem("karuvi.fun.memory.best").then((legacy) => {
          if (legacy) {
            const val = parseInt(legacy, 10) || EMPTY_BEST;
            setBest(val);
            idbStorage.setItem(BEST_SCORE_KEY, legacy);
            idbStorage.removeItem("karuvi.fun.memory.best");
          }
          setBestLoaded(true);
        });
      }
    });
  }, []);

  // Persist best
  useEffect(() => {
    if (!bestLoaded || best === EMPTY_BEST) return;
    idbStorage.setItem(BEST_SCORE_KEY, String(best)).catch((e) =>
      logger.error("[MemoryMatch] Failed to persist best score", { error: e })
    );
  }, [best, bestLoaded]);

  // Timer — starts on first flip, stops on win
  useEffect(() => {
    if (gameWon) {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (flipTimeoutRef.current) clearTimeout(flipTimeoutRef.current);
    };
  }, [gameWon]);

  const startTimer = useCallback(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    timerRef.current = setInterval(() => setElapsed(p => p + 1), 1000);
  }, []);

  const resetGame = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    if (flipTimeoutRef.current) {
      clearTimeout(flipTimeoutRef.current);
      flipTimeoutRef.current = null;
    }
    startedRef.current = false;
    setCards(buildDeck());
    setFlippedIds([]);
    setMoves(0);
    setElapsed(0);
    setGameWon(false);
    lockRef.current = false;
    setIsLocked(false);
  }, []);

  const handleCardClick = useCallback((cardId: number) => {
    if (lockRef.current || gameWon) return;

    setCards(prev => {
      const card = prev.find(c => c.id === cardId);
      if (!card || card.flipped || card.matched) return prev;
      return prev;
    });

    setFlippedIds(prev => {
      const card = cards.find(c => c.id === cardId);
      if (!card || card.flipped || card.matched || lockRef.current) return prev;

      startTimer();
      const next = [...prev, cardId];

      if (next.length === 2) {
        lockRef.current = true;
        setIsLocked(true);
        const [a, b] = next.map(id => cards.find(c => c.id === id)!);
        const matched = a?.pairId === b?.pairId;

        flipTimeoutRef.current = setTimeout(() => {
          setCards(prevCards => {
            const updated = prevCards.map(c => {
              if (next.includes(c.id)) {
                return { ...c, flipped: matched ? true : false, matched: matched ? true : c.matched };
              }
              return c;
            });
            const allMatched = updated.every(c => c.matched);
            if (allMatched) {
              const finalMoves = moves + 1;
              setGameWon(true);
              setBest(b => Math.min(b, finalMoves));
            }
            return updated;
          });
          setMoves(m => m + 1);
          setFlippedIds([]);
          lockRef.current = false;
          setIsLocked(false);
          flipTimeoutRef.current = null;
        }, 700);

        // Flip both cards face-up temporarily
        setCards(prev =>
          prev.map(c => next.includes(c.id) ? { ...c, flipped: true } : c)
        );
        return [];
      }

      // First card flip
      setCards(prev =>
        prev.map(c => c.id === cardId ? { ...c, flipped: true } : c)
      );
      return next;
    });
  }, [cards, gameWon, moves, startTimer]);

  const matchedCount = cards.filter(c => c.matched).length / 2;
  const totalPairs = CARD_EMOJIS.length;
  const progressPct = (matchedCount / totalPairs) * 100;

  const formatTime = (s: number) =>
    `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <div className="max-w-lg mx-auto space-y-6">
      {/* ── Stats ── */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Pairs", val: `${matchedCount}/${totalPairs}`, icon: <Trophy className="w-4 h-4 text-primary" /> },
          { label: "Moves", val: moves, icon: <RotateCcw className="w-4 h-4 text-primary" /> },
          { label: "Time", val: formatTime(elapsed), icon: <Timer className="w-4 h-4 text-primary" /> },
        ].map(({ label, val, icon }) => (
          <div key={label} className="rounded-2xl border border-border bg-surface p-3 flex flex-col items-center gap-1">
            {icon}
            <span className="text-xl font-black text-text">{val}</span>
            <span className="text-xs font-bold text-text-4 uppercase tracking-widest">{label}</span>
          </div>
        ))}
      </div>

      {/* ── Progress Bar ── */}
      <div className="h-1.5 bg-border rounded-full overflow-hidden" role="progressbar" aria-valuenow={progressPct} aria-valuemin={0} aria-valuemax={100} aria-label="Game progress">
        <m.div
          className="h-full bg-primary rounded-full"
          animate={{ width: `${progressPct}%` }}
          transition={{ type: "spring", stiffness: 200, damping: 30 }}
        />
      </div>

      {/* ── Card Grid ── */}
      <div
        className="grid grid-cols-4 gap-3"
        role="list"
        aria-label="Memory match cards"
      >
        {cards.map(card => (
          <button
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            disabled={card.matched || card.flipped || isLocked || gameWon}
            aria-label={card.flipped || card.matched ? `Card: ${card.emoji}` : "Face-down card"}
            aria-pressed={card.flipped || card.matched}
            className={`
              aspect-square rounded-2xl border-2 flex items-center justify-center text-3xl transition-all
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary
              ${card.matched ? "border-primary bg-primary/10 cursor-default" : "border-border bg-surface cursor-pointer hover:border-primary/50"}
              ${!card.flipped && !card.matched ? "hover:bg-primary/5" : ""}
            `}
          >
            <m.div
              animate={{ rotateY: card.flipped || card.matched ? 0 : 180 }}
              transition={{ duration: 0.3 }}
              style={{ backfaceVisibility: "hidden" }}
            >
              {card.flipped || card.matched ? (
                <m.span
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {card.emoji}
                </m.span>
              ) : (
                <span className="text-text-4 text-2xl">🎴</span>
              )}
            </m.div>
          </button>
        ))}
      </div>

      {/* ── Controls ── */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-text-4">
          Best: {best === EMPTY_BEST ? "–" : `${best} moves`}
        </p>
        <button
          onClick={resetGame}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label="Start a new game"
        >
          <RotateCcw className="w-4 h-4" aria-hidden="true" /> New Game
        </button>
      </div>

      {/* ── Win Overlay ── */}
      <AnimatePresence>
        {gameWon && (
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-3xl border border-primary bg-primary/10 p-6 text-center space-y-3"
            role="alert"
            aria-live="assertive"
          >
            <div className="text-4xl">🎉</div>
            <h2 className="text-xl font-black text-text">You matched all pairs!</h2>
            <p className="text-text-3">
              {moves} moves · {formatTime(elapsed)}
              {best === moves ? " · 🏆 New best!" : ""}
            </p>
            <button
              onClick={resetGame}
              className="px-6 py-2.5 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Play Again
            </button>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
