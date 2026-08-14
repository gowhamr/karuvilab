"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { m, AnimatePresence } from "framer-motion";
import { RotateCcw, Trophy, Timer, Flag, Bomb, ShieldAlert, Sparkles, Smile, Frown } from "lucide-react";
import { idbStorage } from "@/src/store/idb-storage";
import { logger } from "@/src/lib/logger";
import { ToolWorkspace } from "@/components/ui/ToolWorkspace";

// ─── Types & Constants ────────────────────────────────────────────────────────

type Difficulty = "easy" | "medium" | "hard";

interface BoardConfig {
  rows: number;
  cols: number;
  mines: number;
}

const CONFIGS: Record<Difficulty, BoardConfig> = {
  easy: { rows: 9, cols: 9, mines: 10 },
  medium: { rows: 16, cols: 16, mines: 40 },
  hard: { rows: 16, cols: 30, mines: 99 },
};

interface Cell {
  r: number;
  c: number;
  isMine: boolean;
  neighborMines: number;
  isRevealed: boolean;
  isFlagged: boolean;
}

const NUMBER_COLORS: Record<number, string> = {
  1: "text-blue font-bold",
  2: "text-emerald-500 font-bold",
  3: "text-danger font-bold",
  4: "text-purple-500 font-bold",
  5: "text-amber-600 font-bold",
  6: "text-cyan-500 font-bold",
  7: "text-pink-500 font-bold",
  8: "text-text-2 font-bold",
};

const SPRING_CONFIG = { type: "spring" as const, stiffness: 300, damping: 30 };

function generateMines(startRow: number, startCol: number, currentBoard: Cell[][], config: BoardConfig) {
  const updatedBoard = currentBoard.map(row => row.map(cell => ({ ...cell })));
  let minesPlaced = 0;
  while (minesPlaced < config.mines) {
    const r = Math.floor(Math.random() * config.rows);
    const c = Math.floor(Math.random() * config.cols);

    // Do not place on starting cell or surrounding cells
    const isStartArea = Math.abs(r - startRow) <= 1 && Math.abs(c - startCol) <= 1;

    if (!updatedBoard[r]![c]!.isMine && !isStartArea) {
      updatedBoard[r]![c]!.isMine = true;
      minesPlaced++;
    }
  }

  // Compute neighbors
  for (let r = 0; r < config.rows; r++) {
    for (let c = 0; c < config.cols; c++) {
      if (updatedBoard[r]![c]!.isMine) continue;
      let count = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < config.rows && nc >= 0 && nc < config.cols) {
            if (updatedBoard[nr]![nc]!.isMine) count++;
          }
        }
      }
      updatedBoard[r]![c]!.neighborMines = count;
    }
  }

  return updatedBoard;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function MinesweeperClient() {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [board, setBoard] = useState<Cell[][]>([]);
  const [minesGenerated, setMinesGenerated] = useState(false);
  const [gameState, setGameState] = useState<"idle" | "playing" | "won" | "lost">("idle");
  const [isProcessing, setIsProcessing] = useState(false);
  const [flagMode, setFlagMode] = useState(false); // Mobile flag placement toggle
  const [flagsPlaced, setFlagsPlaced] = useState(0);

  // Timer & Highscores
  const [elapsed, setElapsed] = useState(0);
  const [bestTimes, setBestTimes] = useState<Record<Difficulty, number | null>>({
    easy: null,
    medium: null,
    hard: null,
  });
  const [bestLoaded, setBestLoaded] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Config shorthand
  const config = CONFIGS[difficulty];

  // Load best scores
  useEffect(() => {
    const loadBests = async () => {
      const times = { easy: null, medium: null, hard: null } as Record<Difficulty, number | null>;
      try {
        for (const diff of ["easy", "medium", "hard"] as const) {
          const val = await idbStorage.getItem(`karuvi.breaktime.minesweeper.best.${diff}`);
          if (val) times[diff] = parseInt(val, 10);
        }
        setBestTimes(times);
        setBestLoaded(true);
      } catch (e) {
        logger.error("[Minesweeper] Failed to load scores", { error: e });
        setBestLoaded(true);
      }
    };
    loadBests();
  }, []);

  const saveBestTime = useCallback((diff: Difficulty, time: number) => {
    setBestTimes(prev => {
      const current = prev[diff];
      if (current === null || time < current) {
        const next = { ...prev, [diff]: time };
        if (bestLoaded) {
          idbStorage.setItem(`karuvi.breaktime.minesweeper.best.${diff}`, String(time)).catch(e =>
            logger.error("[Minesweeper] Failed to save score", { error: e })
          );
        }
        return next;
      }
      return prev;
    });
  }, [bestLoaded]);

  // Create empty grid on mount/difficulty change
  const initBoard = useCallback((diff: Difficulty = difficulty) => {
    const activeConfig = CONFIGS[diff];
    const newBoard = Array.from({ length: activeConfig.rows }, (_, r) =>
      Array.from({ length: activeConfig.cols }, (_, c) => ({
        r,
        c,
        isMine: false,
        neighborMines: 0,
        isRevealed: false,
        isFlagged: false,
      }))
    );
    setBoard(newBoard);
    setMinesGenerated(false);
    setGameState("idle");
    setFlagsPlaced(0);
    setElapsed(0);
    if (timerRef.current) clearInterval(timerRef.current);
  }, [difficulty]);

  useEffect(() => {
    initBoard();
  }, [initBoard]);

  // Timer loop
  useEffect(() => {
    if (gameState === "playing") {
      timerRef.current = setInterval(() => {
        setElapsed(t => t + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState]);

  // Generate mines after first click for 100% safety
  // (moved outside component to avoid react-hooks/purity lint on Math.random)

  // Reveal flood fill
  const revealCell = async (r: number, c: number, currentBoard: Cell[][]) => {
    const stack: [number, number][] = [[r, c]];
    const updated = currentBoard.map(row => row.map(cell => ({ ...cell })));
    let iterations = 0;

    while (stack.length > 0) {
      if (++iterations % 50 === 0) {
        // Yield to main thread to prevent UI freezing
        if (typeof (globalThis as any).scheduler !== 'undefined' && (globalThis as any).scheduler.yield) {
          await (globalThis as any).scheduler.yield();
        } else {
          await new Promise(res => setTimeout(res, 0));
        }
      }
      const [currR, currC] = stack.pop()!;
      const cell = updated[currR]![currC]!;
      if (cell.isRevealed || cell.isFlagged) continue;

      cell.isRevealed = true;

      // If cell has 0 neighbors, push all surrounding cells
      if (cell.neighborMines === 0 && !cell.isMine) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = currR + dr;
            const nc = currC + dc;
            if (nr >= 0 && nr < config.rows && nc >= 0 && nc < config.cols) {
              if (!updated[nr]![nc]!.isRevealed && !updated[nr]![nc]!.isFlagged) {
                stack.push([nr, nc]);
              }
            }
          }
        }
      }
    }

    return updated;
  };

  // Click handler
  const handleCellClick = async (r: number, c: number) => {
    if (gameState === "won" || gameState === "lost" || isProcessing) return;
    const cell = board[r]![c]!;
    if (cell.isRevealed) return;

    if (flagMode) {
      toggleFlag(r, c);
      return;
    }

    if (cell.isFlagged) return;

    let activeBoard = board;
    let nextState = gameState;

    if (!minesGenerated) {
      activeBoard = generateMines(r, c, board, config);
      setMinesGenerated(true);
      nextState = "playing";
      setGameState("playing");
    }

    const clicked = activeBoard[r]![c]!;

    if (clicked.isMine) {
      // Hit mine! Game over.
      const lostBoard = activeBoard.map(row =>
        row.map(cl => {
          if (cl.isMine) return { ...cl, isRevealed: true };
          return cl;
        })
      );
      setBoard(lostBoard);
      setGameState("lost");
      return;
    }

    // Reveal cells
    setIsProcessing(true);
    const revealedBoard = await revealCell(r, c, activeBoard);
    setIsProcessing(false);

    // Check win condition
    let revealedCount = 0;
    const totalCells = config.rows * config.cols;
    revealedBoard.forEach(row => row.forEach(cl => {
      if (cl.isRevealed) revealedCount++;
    }));

    if (revealedCount === totalCells - config.mines) {
      // Win!
      const wonBoard = revealedBoard.map(row =>
        row.map(cl => {
          if (cl.isMine) return { ...cl, isFlagged: true };
          return cl;
        })
      );
      setBoard(wonBoard);
      setGameState("won");
      setFlagsPlaced(config.mines);
      saveBestTime(difficulty, elapsed);
    } else {
      setBoard(revealedBoard);
    }
  };

  // Flag toggle
  const toggleFlag = (r: number, c: number, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (gameState === "won" || gameState === "lost") return;
    const cell = board[r]![c]!;
    if (cell.isRevealed) return;

    setBoard(prev => {
      const nextFlagState = !cell.isFlagged;
      setFlagsPlaced(f => f + (nextFlagState ? 1 : -1));
      return prev.map((row, ri) =>
        row.map((cl, ci) => (ri === r && ci === c ? { ...cl, isFlagged: nextFlagState } : cl))
      );
    });
  };

  const handleDifficultyChange = (diff: Difficulty) => {
    setDifficulty(diff);
    initBoard(diff);
  };

  const formatTime = (s: number) =>
    `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  const currentBest = bestTimes[difficulty];
  const minesLeft = config.mines - flagsPlaced;

  return (
    <ToolWorkspace
      layout="stacked"
      optionsPanel={
        <div className="space-y-6">
          {/* ── Settings / Stats Toolbar ── */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Difficulties */}
            <div className="flex gap-2">
              {(["easy", "medium", "hard"] as const).map((diff) => (
                <m.button
                  key={diff}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { setDifficulty(diff); initBoard(diff); }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    difficulty === diff
                      ? "bg-primary/20 text-primary border border-primary/30"
                      : "bg-surface border border-border text-text-muted hover:text-text-2 hover:border-primary/50"
                  }`}
                >
                  {diff}
                </m.button>
              ))}
            </div>

            {/* Stats Grid */}
            <div className="flex items-center justify-between sm:justify-end gap-6 font-mono font-bold text-text-3">
              <div className="flex items-center gap-1.5" title="Mines remaining">
                <Bomb className="w-4 h-4 text-primary" />
                <span>{minesLeft}</span>
              </div>

              <div className="flex items-center gap-1.5" title="Timer">
                <Timer className="w-4 h-4 text-primary" />
                <span>{formatTime(elapsed)}</span>
              </div>

              <m.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => initBoard(difficulty)}
                className="flex items-center gap-1.5 px-4 py-2 bg-surface border border-border text-text-2 rounded-xl font-bold hover:border-primary transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <RotateCcw className="w-4 h-4" /> Reset
              </m.button>
            </div>
          </div>

          {/* ── Mobile Flag Mode Selector ── */}
          <div className="flex gap-2 justify-center">
            <m.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => setFlagMode(false)}
              className={`flex items-center gap-1.5 px-4 py-2 border rounded-xl font-bold text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                !flagMode
                  ? "bg-primary/20 text-primary border-primary/30"
                  : "bg-surface border-border text-text-2 hover:border-primary/50"
              }`}
            >
              <Smile className="w-4 h-4" /> Reveal Mode
            </m.button>
            <m.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFlagMode(!flagMode)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                flagMode 
                  ? "bg-danger/20 text-danger border border-danger/30 shadow-inner" 
                  : "bg-surface border border-border text-text shadow-md hover:border-primary/50"
              }`}
            >
              <Flag className={`w-5 h-5 ${flagMode ? "fill-danger" : ""}`} />
              {flagMode ? "Flag Mode: ON" : "Flag Mode: OFF"}
            </m.button>
          </div>
        </div>
      }
      output={
        <div className="relative overflow-auto max-w-full flex justify-center py-4">
          <div
            className="grid gap-1 select-none w-max"
            style={{
              gridTemplateColumns: `repeat(${config.cols}, minmax(0, 1fr))`,
            }}
            role="grid"
            aria-label="Minesweeper board"
          >
            {board.map((row, r) =>
              row.map((cell, c) => {
                const { isRevealed, isFlagged, isMine, neighborMines } = cell;

                return (
                  <m.button
                    key={`${r}-${c}`}
                    whileHover={!isRevealed ? { scale: 1.05 } : {}}
                    whileTap={!isRevealed ? { scale: 0.95 } : {}}
                    onClick={() => handleCellClick(r, c)}
                    onContextMenu={(e) => toggleFlag(r, c, e)}
                    role="gridcell"
                    className={`
                      w-8 h-8 rounded-md flex items-center justify-center text-sm font-black transition-all outline-none border border-border/40
                      ${isRevealed
                        ? isMine
                          ? "bg-danger/25 text-danger border-danger"
                          : "bg-surface-elevated/20 text-text border-border/30 shadow-inner"
                        : "bg-surface-elevated hover:bg-primary/10 hover:border-primary/40 cursor-pointer shadow-md"
                      }
                      ${isFlagged ? "bg-primary/10 border-primary" : ""}
                    `}
                  >
                    <AnimatePresence>
                      {isRevealed && (
                        <m.div
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.5, opacity: 0 }}
                          className="flex items-center justify-center w-full h-full"
                        >
                          {isMine ? (
                            <Bomb className="w-4 h-4 text-danger fill-danger" />
                          ) : neighborMines > 0 ? (
                            <span className={NUMBER_COLORS[neighborMines]}>{neighborMines}</span>
                          ) : null}
                        </m.div>
                      )}
                      {!isRevealed && isFlagged && (
                        <m.div
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.5, opacity: 0 }}
                        >
                          <Flag className="w-4 h-4 text-danger fill-danger" />
                        </m.div>
                      )}
                    </AnimatePresence>
                  </m.button>
                );
              })
            )}
          </div>

          {/* Win/Loss Overlays */}
          <AnimatePresence>
            {gameState === "won" && (
              <m.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-surface/90 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center gap-4 z-content text-center"
                role="alert"
                aria-live="assertive"
              >
                <Sparkles className="w-16 h-16 text-primary animate-bounce" />
                <div>
                  <h2 className="text-3xl font-black text-text">Board Cleared! 🏆</h2>
                  <p className="text-text-3 text-sm mt-1">
                    Difficulty: <strong>{difficulty.toUpperCase()}</strong> · Time: <strong>{formatTime(elapsed)}</strong>
                    {currentBest !== null && elapsed <= currentBest && (
                      <span className="block text-primary font-bold mt-1">🏆 New Best Time!</span>
                    )}
                  </p>
                </div>
                <m.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => initBoard(difficulty)}
                  className="px-6 py-2.5 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  Play Again
                </m.button>
              </m.div>
            )}

            {gameState === "lost" && (
              <m.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-surface/90 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center gap-4 z-content text-center"
                role="alert"
                aria-live="assertive"
              >
                <ShieldAlert className="w-16 h-16 text-danger animate-pulse" />
                <div>
                  <h2 className="text-2xl font-black text-text">Mine Detonated!</h2>
                  <p className="text-text-3 text-sm mt-1">
                    Better luck next time.
                  </p>
                </div>
                <m.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => initBoard(difficulty)}
                  className="px-6 py-2.5 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  Try Again
                </m.button>
              </m.div>
            )}
          </AnimatePresence>
        </div>
      }
      infoPanel={
        <div className="flex flex-col items-center gap-1.5 text-center text-xs text-text-muted font-bold">
          <p>Right-click or click Flag Mode to place flags. Double-click or click surrounding revealed numbers to check.</p>
          {currentBest !== null && (
            <p>
              Best Time ({difficulty}): <strong>{formatTime(currentBest)}</strong>
            </p>
          )}
        </div>
      }
    />
  );
}
