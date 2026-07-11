"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { m, AnimatePresence } from "framer-motion";
import { RotateCcw, Trophy, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { idbStorage } from "@/src/store/idb-storage";
import { logger } from "@/src/lib/logger";

// ─── Constants & Types ────────────────────────────────────────────────────────

const SIZE = 4;
const BEST_SCORE_KEY = "karuvi.breaktime.2048.best";

type Grid = (number | null)[][];
 
// ─── Tile Colors ──────────────────────────────────────────────────────────────
 
const TILE_STYLES: Record<number, { bg: string; text: string; font: string }> = {
  0:    { bg: "bg-surface border border-border", text: "text-transparent", font: "text-2xl" },
  2:    { bg: "bg-[#EDE0C8]", text: "text-[#776E65]", font: "text-3xl font-bold" },
  4:    { bg: "bg-[#EDE0C8]", text: "text-[#776E65]", font: "text-3xl font-bold" },
  8:    { bg: "bg-[#F2B179]", text: "text-white", font: "text-3xl font-bold" },
  16:   { bg: "bg-[#F59563]", text: "text-white", font: "text-3xl font-bold" },
  32:   { bg: "bg-[#F67C5F]", text: "text-white", font: "text-3xl font-bold" },
  64:   { bg: "bg-[#F65E3B]", text: "text-white", font: "text-3xl font-bold" },
  128:  { bg: "bg-[#EDCF72]", text: "text-white", font: "text-2xl font-bold" },
  256:  { bg: "bg-[#EDCC61]", text: "text-white", font: "text-2xl font-bold" },
  512:  { bg: "bg-[#EDC850]", text: "text-white", font: "text-2xl font-bold" },
  1024: { bg: "bg-[#EDC53F]", text: "text-white", font: "text-xl font-bold" },
  2048: { bg: "bg-[#EDC22E]", text: "text-white", font: "text-xl font-bold" },
};
 
function getTileStyle(val: number) {
  return TILE_STYLES[val] ?? { bg: "bg-[#3C3A32]", text: "text-white", font: "text-lg font-bold" };
}
 
// ─── Game Logic ───────────────────────────────────────────────────────────────
 
function emptyGrid(): Grid {
  return Array.from({ length: SIZE }, () => Array(SIZE).fill(null));
}
 
function addRandomTile(grid: Grid): Grid {
  const empties: [number, number][] = [];
  grid.forEach((row, r) => row.forEach((cell, c) => { if (!cell) empties.push([r, c]); }));
  if (!empties.length) return grid;
  const [r, c] = empties[Math.floor(Math.random() * empties.length)]!;
  const next = grid.map(row => [...row]) as Grid;
  next[r]![c] = Math.random() < 0.9 ? 2 : 4;
  return next;
}
 
function initGrid(): Grid {
  return addRandomTile(addRandomTile(emptyGrid()));
}
 
function slideRow(row: (number | null)[]): { row: (number | null)[]; gained: number } {
  const nums = row.filter(Boolean) as number[];
  let gained = 0;
  const merged: number[] = [];
  let i = 0;
  while (i < nums.length) {
    if (i + 1 < nums.length && nums[i] === nums[i + 1]) {
      const val = nums[i]! * 2;
      merged.push(val);
      gained += val;
      i += 2;
    } else {
      merged.push(nums[i]!);
      i++;
    }
  }
  while (merged.length < SIZE) merged.push(0);
  return { row: merged.map(v => v || null), gained };
}
 
type Direction = "up" | "down" | "left" | "right";
 
function moveGrid(grid: Grid, dir: Direction): { grid: Grid; score: number; moved: boolean } {
  let totalScore = 0;
  let moved = false;
  let next = grid.map(row => [...row]) as Grid;
 
  if (dir === "left") {
    next = next.map(row => {
      const { row: nr, gained } = slideRow(row);
      if (nr.join() !== row.join()) moved = true;
      totalScore += gained;
      return nr;
    });
  } else if (dir === "right") {
    next = next.map(row => {
      const rev = [...row].reverse();
      const { row: nr, gained } = slideRow(rev);
      if (nr.reverse().join() !== row.join()) moved = true;
      totalScore += gained;
      return nr.reverse();
    });
  } else if (dir === "up") {
    for (let c = 0; c < SIZE; c++) {
      const col = next.map(row => row[c]!);
      const { row: nc, gained } = slideRow(col);
      if (nc.join() !== col.join()) moved = true;
      totalScore += gained;
      nc.forEach((v, r) => { next[r]![c] = v; });
    }
  } else {
    for (let c = 0; c < SIZE; c++) {
      const col = next.map(row => row[c]!).reverse();
      const { row: nc, gained } = slideRow(col);
      const reversed = nc.reverse();
      if (reversed.join() !== next.map(row => row[c]).join()) moved = true;
      totalScore += gained;
      reversed.forEach((v, r) => { next[r]![c] = v; });
    }
  }
 
  return { grid: next, score: totalScore, moved };
}
 
function isGameOver(grid: Grid): boolean {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (!grid[r]![c]) return false;
      if (c + 1 < SIZE && grid[r]![c] === grid[r]![c + 1]) return false;
      if (r + 1 < SIZE && grid[r]![c] === grid[r + 1]![c]) return false;
    }
  }
  return true;
}
 
// ─── Component ────────────────────────────────────────────────────────────────
 
export default function Game2048Client() {
  const [grid, setGrid] = useState<Grid>(initGrid);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [bestLoaded, setBestLoaded] = useState(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
 
  // Load best score with legacy migration
  useEffect(() => {
    idbStorage.getItem(BEST_SCORE_KEY).then((raw) => {
      if (raw) {
        setBest(parseInt(raw, 10) || 0);
        setBestLoaded(true);
      } else {
        // Migration from legacy namespace
        idbStorage.getItem("karuvi.fun.2048.best").then((legacy) => {
          if (legacy) {
            const val = parseInt(legacy, 10) || 0;
            setBest(val);
            idbStorage.setItem(BEST_SCORE_KEY, legacy);
            idbStorage.removeItem("karuvi.fun.2048.best");
          }
          setBestLoaded(true);
        }).catch(() => setBestLoaded(true));
      }
    });
  }, []);
 
  // Persist best
  useEffect(() => {
    if (!bestLoaded) return;
    idbStorage.setItem(BEST_SCORE_KEY, String(best)).catch((e) =>
      logger.error("[2048] Failed to persist best score", { error: e })
    );
  }, [best, bestLoaded]);

  const applyMove = useCallback((dir: Direction) => {
    if (gameOver) return;
    setGrid(prev => {
      const { grid: next, score: gained, moved } = moveGrid(prev, dir);
      if (!moved) return prev;
      const withTile = addRandomTile(next);
      setScore(s => {
        const ns = s + gained;
        setBest(b => Math.max(b, ns));
        return ns;
      });
      if (isGameOver(withTile)) setGameOver(true);
      return withTile;
    });
  }, [gameOver]);

  // Keyboard handler
  useEffect(() => {
    const KEY_MAP: Record<string, Direction> = {
      ArrowLeft: "left", ArrowRight: "right", ArrowUp: "up", ArrowDown: "down",
      a: "left", d: "right", w: "up", s: "down",
    };
    const handler = (e: KeyboardEvent) => {
      const dir = KEY_MAP[e.key];
      if (dir) { e.preventDefault(); applyMove(dir); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [applyMove]);

  const resetGame = useCallback(() => {
    setGrid(initGrid());
    setScore(0);
    setGameOver(false);
  }, []);

  // Touch swipe
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const t = e.touches[0];
    if (t) touchStart.current = { x: t.clientX, y: t.clientY };
  }, []);

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const t = e.changedTouches[0];
    if (!t) return;
    const dx = t.clientX - touchStart.current.x;
    const dy = t.clientY - touchStart.current.y;
    touchStart.current = null;
    if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return;
    if (Math.abs(dx) > Math.abs(dy)) {
      applyMove(dx > 0 ? "right" : "left");
    } else {
      applyMove(dy > 0 ? "down" : "up");
    }
  }, [applyMove]);

  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          {[{ label: "Score", val: score }, { label: "Best", val: best }].map(({ label, val }) => (
            <div key={label} className="rounded-xl bg-surface border border-border px-4 py-2 text-center min-w-[80px]">
              <div className="text-xs font-bold text-text-4 uppercase tracking-widest">{label}</div>
              <div className="text-xl font-black text-text">{val}</div>
            </div>
          ))}
        </div>
        <button
          onClick={resetGame}
          className="flex items-center gap-2 px-4 py-2 bg-[#8B5CF6] text-white rounded-xl font-bold hover:bg-[#7C3AED] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]"
          aria-label="Start a new game"
        >
          <RotateCcw className="w-4 h-4" aria-hidden="true" /> New Game
        </button>
      </div>

      {/* ── Board ── */}
      <div
        className="relative rounded-2xl bg-surface border border-border p-3 select-none touch-none"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        role="application"
        aria-label="2048 game board. Use arrow keys or swipe to move tiles."
      >
        <div className="grid grid-cols-4 gap-2">
          {grid.map((row, r) =>
            row.map((cell, c) => {
              const style = getTileStyle(cell ?? 0);
              return (
                <m.div
                  key={`${r}-${c}-${cell}`}
                  layout
                  className={`${style.bg} ${style.text} ${style.font} aspect-square rounded-xl flex items-center justify-center transition-colors`}
                  aria-label={cell ? `Tile ${cell}` : "Empty cell"}
                >
                  <AnimatePresence mode="wait">
                    {cell && (
                      <m.span
                        key={cell}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      >
                        {cell}
                      </m.span>
                    )}
                  </AnimatePresence>
                </m.div>
              );
            })
          )}
        </div>

        {/* Game Over Overlay */}
        <AnimatePresence>
          {gameOver && (
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 rounded-2xl bg-surface/90 backdrop-blur-sm flex flex-col items-center justify-center gap-4"
              role="alert"
              aria-live="assertive"
            >
              <Trophy className="w-10 h-10 text-[#8B5CF6]" />
              <h2 className="text-2xl font-black text-text">Game Over!</h2>
              <p className="text-text-3">Score: <strong>{score}</strong> · Best: <strong>{best}</strong></p>
              <button
                onClick={resetGame}
                className="px-6 py-2.5 bg-[#8B5CF6] text-white rounded-xl font-bold hover:bg-[#7C3AED] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]"
              >
                Play Again
              </button>
            </m.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Arrow Controls (mobile-friendly) ── */}
      <div className="grid grid-cols-3 gap-2 max-w-[160px] mx-auto" aria-label="Game controls">
        <div />
        <button onClick={() => applyMove("up")} className="p-2 rounded-lg bg-surface border border-border hover:border-[#8B5CF6] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]" aria-label="Move up">
          <ChevronUp className="w-5 h-5 mx-auto" />
        </button>
        <div />
        <button onClick={() => applyMove("left")} className="p-2 rounded-lg bg-surface border border-border hover:border-[#8B5CF6] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]" aria-label="Move left">
          <ChevronLeft className="w-5 h-5 mx-auto" />
        </button>
        <button onClick={() => applyMove("down")} className="p-2 rounded-lg bg-surface border border-border hover:border-[#8B5CF6] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]" aria-label="Move down">
          <ChevronDown className="w-5 h-5 mx-auto" />
        </button>
        <button onClick={() => applyMove("right")} className="p-2 rounded-lg bg-surface border border-border hover:border-[#8B5CF6] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]" aria-label="Move right">
          <ChevronRight className="w-5 h-5 mx-auto" />
        </button>
      </div>
      <p className="text-center text-xs text-text-4">Arrow keys or swipe on mobile</p>
    </div>
  );
}
