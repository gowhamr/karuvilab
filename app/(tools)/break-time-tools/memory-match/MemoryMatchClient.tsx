"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { m, AnimatePresence } from "framer-motion";
import { RotateCcw, Trophy, Timer, Eye } from "lucide-react";
import { idbStorage } from "@/src/store/idb-storage";
import { logger } from "@/src/lib/logger";

// ─── Constants & Types ────────────────────────────────────────────────────────

const CARD_POOL = ["🦊", "🐼", "🦁", "🐸", "🦋", "🐬", "🦜", "🦄", "🐙", "🐯", "🐨", "🐒"];

type Difficulty = "easy" | "medium" | "hard";

interface DifficultyConfig {
  rows: number;
  cols: number;
  pairs: number;
}

const DIFFICULTIES: Record<Difficulty, DifficultyConfig> = {
  easy: { rows: 3, cols: 4, pairs: 6 },
  medium: { rows: 4, cols: 4, pairs: 8 },
  hard: { rows: 5, cols: 4, pairs: 10 },
};

function getBestScoreKey(diff: Difficulty) {
  return `karuvi.breaktime.memory.best.${diff}`;
}

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

function buildDeck(config: DifficultyConfig): Card[] {
  const selectedEmojis = shuffle(CARD_POOL).slice(0, config.pairs);
  const pairs = selectedEmojis.flatMap((emoji, pairId) => [
    { id: pairId * 2,     emoji, pairId, flipped: false, matched: false },
    { id: pairId * 2 + 1, emoji, pairId, flipped: false, matched: false },
  ]);
  return shuffle(pairs);
}

const EMPTY_BEST = 9999;
const SPRING_CONFIG = { type: "spring" as const, stiffness: 300, damping: 30 };

// ─── Component ────────────────────────────────────────────────────────────────

export default function MemoryMatchClient() {
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [cards, setCards] = useState<Card[]>(() => buildDeck(DIFFICULTIES.medium));
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  
  // Best scores state per difficulty
  const [bestScores, setBestScores] = useState<Record<Difficulty, number>>({
    easy: EMPTY_BEST,
    medium: EMPTY_BEST,
    hard: EMPTY_BEST,
  });
  const [bestLoaded, setBestLoaded] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const lockRef = useRef(false); // prevents triple-click during flip animation
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const flipTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startedRef = useRef(false);

  // Load best scores on mount
  useEffect(() => {
    const loadAllBest = async () => {
      try {
        const loadedScores = { easy: EMPTY_BEST, medium: EMPTY_BEST, hard: EMPTY_BEST } as Record<Difficulty, number>;
        
        // Try reading v2 keys
        for (const diff of ["easy", "medium", "hard"] as const) {
          const val = await idbStorage.getItem(getBestScoreKey(diff));
          if (val) {
            loadedScores[diff] = parseInt(val, 10) || EMPTY_BEST;
          }
        }

        // Migrate legacy best if present (mapped to medium difficulty)
        const legacyVal = await idbStorage.getItem("karuvi.breaktime.memory.best");
        const oldestVal = await idbStorage.getItem("karuvi.fun.memory.best");
        const migrationSource = legacyVal || oldestVal;

        if (migrationSource && loadedScores.medium === EMPTY_BEST) {
          const val = parseInt(migrationSource, 10) || EMPTY_BEST;
          loadedScores.medium = val;
          await idbStorage.setItem(getBestScoreKey("medium"), String(val));
          if (legacyVal) await idbStorage.removeItem("karuvi.breaktime.memory.best");
          if (oldestVal) await idbStorage.removeItem("karuvi.fun.memory.best");
        }

        setBestScores(loadedScores);
        setBestLoaded(true);
      } catch (e) {
        logger.error("[MemoryMatch] Failed to load scores", { error: e });
        setBestLoaded(true);
      }
    };
    loadAllBest();
  }, []);

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

  const resetGame = useCallback((diff: Difficulty = difficulty) => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    if (flipTimeoutRef.current) {
      clearTimeout(flipTimeoutRef.current);
      flipTimeoutRef.current = null;
    }
    startedRef.current = false;
    setCards(buildDeck(DIFFICULTIES[diff]));
    setFlippedIds([]);
    setMoves(0);
    setElapsed(0);
    setGameWon(false);
    lockRef.current = false;
    setIsLocked(false);
  }, [difficulty]);

  const handleDifficultyChange = useCallback((diff: Difficulty) => {
    setDifficulty(diff);
    resetGame(diff);
  }, [resetGame]);

  const handleCardClick = useCallback((cardId: number) => {
    if (lockRef.current || gameWon) return;

    const clickedCard = cards.find(c => c.id === cardId);
    if (!clickedCard || clickedCard.flipped || clickedCard.matched) return;

    startTimer();

    setFlippedIds(prev => {
      const next = [...prev, cardId];

      if (next.length === 2) {
        lockRef.current = true;
        setIsLocked(true);
        const [a, b] = next.map(id => cards.find(c => c.id === id)!);
        const isMatched = a?.pairId === b?.pairId;

        flipTimeoutRef.current = setTimeout(() => {
          setCards(prevCards => {
            const updated = prevCards.map(c => {
              if (next.includes(c.id)) {
                return { ...c, flipped: isMatched, matched: isMatched };
              }
              return c;
            });
            const allMatched = updated.every(c => c.matched);
            if (allMatched) {
              const finalMoves = moves + 1;
              setGameWon(true);
              setBestScores(scores => {
                const currentBest = scores[difficulty];
                if (finalMoves < currentBest) {
                  const updatedScores = { ...scores, [difficulty]: finalMoves };
                  if (bestLoaded) {
                    idbStorage.setItem(getBestScoreKey(difficulty), String(finalMoves)).catch(e =>
                      logger.error("[MemoryMatch] Failed to save best score", { error: e })
                    );
                  }
                  return updatedScores;
                }
                return scores;
              });
            }
            return updated;
          });
          setMoves(m => m + 1);
          setFlippedIds([]);
          lockRef.current = false;
          setIsLocked(false);
          flipTimeoutRef.current = null;
        }, 600);

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
  }, [cards, gameWon, moves, startTimer, difficulty, bestLoaded]);

  const matchedCount = cards.filter(c => c.matched).length / 2;
  const config = DIFFICULTIES[difficulty];
  const totalPairs = config.pairs;
  const progressPct = (matchedCount / totalPairs) * 100;

  const formatTime = (s: number) =>
    `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  const currentBest = bestScores[difficulty];

  return (
    <div className="max-w-lg mx-auto space-y-6">
      {/* ── Difficulty Switcher ── */}
      <div className="flex gap-2 justify-center">
        {(["easy", "medium", "hard"] as const).map((diff) => (
          <m.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            key={diff}
            onClick={() => handleDifficultyChange(diff)}
            className={`px-4 py-2 rounded-xl font-bold text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
              difficulty === diff
                ? "bg-primary text-white"
                : "bg-surface border border-border text-text-2 hover:border-primary/50"
            }`}
          >
            {diff.toUpperCase()} ({DIFFICULTIES[diff].rows}x{DIFFICULTIES[diff].cols})
          </m.button>
        ))}
      </div>

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
            <span className="text-xs font-bold text-text-muted uppercase tracking-widest">{label}</span>
          </div>
        ))}
      </div>

      {/* ── Progress Bar ── */}
      <div className="h-1.5 bg-border rounded-full overflow-hidden" role="progressbar" aria-valuenow={progressPct} aria-valuemin={0} aria-valuemax={100} aria-label="Game progress">
        <m.div
          className="h-full bg-primary rounded-full"
          animate={{ width: `${progressPct}%` }}
          transition={SPRING_CONFIG}
        />
      </div>

      {/* ── Card Grid ── */}
      <div
        className={`grid gap-3`}
        style={{
          gridTemplateColumns: `repeat(${config.cols}, minmax(0, 1fr))`
        }}
        role="list"
        aria-label="Memory match cards"
      >
        {cards.map(card => (
          <m.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
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
              transition={{ duration: 0.25 }}
              style={{ backfaceVisibility: "hidden" }}
              className="flex items-center justify-center"
            >
              {card.flipped || card.matched ? (
                <m.span
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={SPRING_CONFIG}
                >
                  {card.emoji}
                </m.span>
              ) : (
                <Eye className="w-6 h-6 text-text-muted" />
              )}
            </m.div>
          </m.button>
        ))}
      </div>

      {/* ── Controls ── */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-text-muted font-bold">
          Best ({difficulty}): {currentBest === EMPTY_BEST ? "–" : `${currentBest} moves`}
        </p>
        <m.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={() => resetGame()}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary "
          aria-label="Start a new game"
        >
          <RotateCcw className="w-4 h-4" aria-hidden="true" /> New Game
        </m.button>
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
              {currentBest === moves ? " · 🏆 New best!" : ""}
            </p>
            <m.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => resetGame()}
              className="px-6 py-2.5 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Play Again
            </m.button>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
