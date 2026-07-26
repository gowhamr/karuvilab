"use client";

import React, { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { m, AnimatePresence } from "framer-motion";
import { RotateCcw, Trophy, Timer, Undo2, Check, Lightbulb, Pencil } from "lucide-react";
import { idbStorage } from "@/src/store/idb-storage";
import { logger } from "@/src/lib/logger";

// ─── Sudoku Helpers & Generation ─────────────────────────────────────────────

type CellVal = number | null;
type Grid = CellVal[][];
type NotesGrid = number[][][]; // 9x9 grid of lists of numbers (1-9)

// Seed fully solved valid board
const SOLVED_SEED: Grid = [
  [5, 3, 4, 6, 7, 8, 9, 1, 2],
  [6, 7, 2, 1, 9, 5, 3, 4, 8],
  [1, 9, 8, 3, 4, 2, 5, 6, 7],
  [8, 5, 9, 7, 6, 1, 4, 2, 3],
  [4, 2, 6, 8, 5, 3, 7, 9, 1],
  [7, 1, 3, 9, 2, 4, 8, 5, 6],
  [9, 6, 1, 5, 3, 7, 2, 8, 4],
  [2, 8, 7, 4, 1, 9, 6, 3, 5],
  [3, 4, 5, 2, 8, 6, 1, 7, 9],
];

// Shuffle rows/cols within blocks and swap digits to generate random solved board
function generateSolvedBoard(): Grid {
  const board = SOLVED_SEED.map(row => [...row]);
  
  // Digit swap map
  const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const shuffledDigits = [...digits].sort(() => Math.random() - 0.5);
  const digitMap = new Map(digits.map((d, i) => [d, shuffledDigits[i]!]));

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      board[r]![c] = digitMap.get(board[r]![c]!)!;
    }
  }

  // Shuffle rows within 3x3 blocks
  for (let block = 0; block < 3; block++) {
    const rows = [block * 3, block * 3 + 1, block * 3 + 2];
    const shuf = [...rows].sort(() => Math.random() - 0.5);
    const temp = shuf.map(r => [...board[r]!]);
    rows.forEach((r, idx) => {
      board[r] = temp[idx]!;
    });
  }

  // Shuffle cols within 3x3 blocks
  for (let block = 0; block < 3; block++) {
    const cols = [block * 3, block * 3 + 1, block * 3 + 2];
    const shuf = [...cols].sort(() => Math.random() - 0.5);
    const temp = board.map(row => shuf.map(c => row[c]!));
    board.forEach((row, r) => {
      cols.forEach((c, idx) => {
        row[c] = temp[r]![idx]!;
      });
    });
  }

  return board;
}

// Generate starting board from solved board based on difficulty
type Difficulty = "easy" | "medium" | "hard";
const REMOVE_COUNTS: Record<Difficulty, number> = {
  easy: 35,   // 46 visible
  medium: 45, // 36 visible
  hard: 54,   // 27 visible
};

function makeStartingBoard(solved: Grid, diff: Difficulty): { startGrid: Grid; initialClues: boolean[][] } {
  const startGrid = solved.map(row => [...row]);
  const initialClues = Array.from({ length: 9 }, () => Array(9).fill(true));
  
  const toRemove = REMOVE_COUNTS[diff];
  const cells = Array.from({ length: 81 }, (_, i) => ({ r: Math.floor(i / 9), c: i % 9 }));
  const shuffledCells = cells.sort(() => Math.random() - 0.5);

  for (let i = 0; i < toRemove; i++) {
    const cell = shuffledCells[i];
    if (cell) {
      startGrid[cell.r]![cell.c] = null;
      initialClues[cell.r]![cell.c] = false;
    }
  }

  return { startGrid, initialClues };
}

interface Move {
  r: number;
  c: number;
  prevVal: CellVal;
  newVal: CellVal;
  isNote: boolean;
  prevNotes: number[];
}

const SPRING_CONFIG = { type: "spring" as const, stiffness: 300, damping: 30 };

const EMPTY_GRID: Grid = Array.from({ length: 9 }, () => Array(9).fill(null));
const EMPTY_CLUES: boolean[][] = Array.from({ length: 9 }, () => Array(9).fill(false));
const EMPTY_NOTES: NotesGrid = Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => []));

// ─── Component ────────────────────────────────────────────────────────────────

export default function SudokuClient() {
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [solvedBoard, setSolvedBoard] = useState<Grid>(() => generateSolvedBoard());
  const [grid, setGrid] = useState<Grid>(EMPTY_GRID);
  const [clues, setClues] = useState<boolean[][]>(EMPTY_CLUES);
  const [notes, setNotes] = useState<NotesGrid>(EMPTY_NOTES);
  const [selectedCell, setSelectedCell] = useState<{ r: number; c: number } | null>(null);
  
  const [isPencilMode, setIsPencilMode] = useState(false);
  const [history, setHistory] = useState<Move[]>([]);
  const [validationErrors, setValidationErrors] = useState<boolean[][]>(EMPTY_CLUES);
  
  // Timer & scores
  const [elapsed, setElapsed] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  
  const [bestTimes, setBestTimes] = useState<Record<Difficulty, number | null>>({
    easy: null,
    medium: null,
    hard: null,
  });
  const [bestLoaded, setBestLoaded] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load best scores
  useEffect(() => {
    const loadBests = async () => {
      const times = { easy: null, medium: null, hard: null } as Record<Difficulty, number | null>;
      try {
        for (const diff of ["easy", "medium", "hard"] as const) {
          const val = await idbStorage.getItem(`karuvi.breaktime.sudoku.best.${diff}`);
          if (val) times[diff] = parseInt(val, 10);
        }
        setBestTimes(times);
        setBestLoaded(true);
      } catch (e) {
        logger.error("[Sudoku] Failed to load best times", { error: e });
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
          idbStorage.setItem(`karuvi.breaktime.sudoku.best.${diff}`, String(time)).catch(e =>
            logger.error("[Sudoku] Failed to save best time", { error: e })
          );
        }
        return next;
      }
      return prev;
    });
  }, [bestLoaded]);

  // Load new puzzle
  const initPuzzle = useCallback((diff: Difficulty = difficulty) => {
    const solved = generateSolvedBoard();
    const { startGrid, initialClues } = makeStartingBoard(solved, diff);
    
    setSolvedBoard(solved);
    setGrid(startGrid);
    setClues(initialClues);
    setNotes(Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => [])));
    setSelectedCell(null);
    setHistory([]);
    setValidationErrors(Array.from({ length: 9 }, () => Array(9).fill(false)));
    setElapsed(0);
    setTimerActive(false);
    setGameWon(false);
  }, [difficulty]);

  // Handle puzzle init on first mount
  useEffect(() => {
    initPuzzle();
  }, [initPuzzle]);

  // Timer loop
  useEffect(() => {
    if (timerActive && !gameWon) {
      timerRef.current = setInterval(() => {
        setElapsed(t => t + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerActive, gameWon]);

  // Check victory condition
  const checkVictory = useCallback((currentGrid: Grid) => {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (currentGrid[r]![c] !== solvedBoard[r]![c]) return;
      }
    }
    setGameWon(true);
    setTimerActive(false);
    saveBestTime(difficulty, elapsed);
  }, [solvedBoard, difficulty, elapsed, saveBestTime]);

  // Input numbers
  const inputNumber = useCallback((val: number | null) => {
    if (!selectedCell || gameWon) return;
    const { r, c } = selectedCell;
    if (clues[r]![c]) return; // clue cells cannot be modified

    setTimerActive(true); // Start timer on first move

    if (isPencilMode && val !== null) {
      setNotes(prevNotes => {
        const cellNotes = prevNotes[r]![c]!;
        const hasNote = cellNotes.includes(val);
        const newCellNotes = hasNote ? cellNotes.filter(n => n !== val) : [...cellNotes, val].sort();
        
        setHistory(prev => [
          { r, c, prevVal: grid[r]![c]!, newVal: null, isNote: true, prevNotes: cellNotes },
          ...prev,
        ]);

        const nextNotes = prevNotes.map((row, ri) =>
          row.map((cell, ci) => (ri === r && ci === c ? newCellNotes : cell))
        );
        return nextNotes;
      });
      // Clear cell value if writing a note
      setGrid(prev => {
        const next = prev.map((row, ri) =>
          row.map((cell, ci) => (ri === r && ci === c ? null : cell))
        );
        return next;
      });
    } else {
      // Direct number entry
      setGrid(prev => {
        const prevVal = prev[r]![c]!;
        const next = prev.map((row, ri) =>
          row.map((cell, ci) => (ri === r && ci === c ? val : cell))
        );
        
        setHistory(prevHist => [
          { r, c, prevVal, newVal: val, isNote: false, prevNotes: [] },
          ...prevHist,
        ]);

        // Wipe pencil marks on direct entry
        setNotes(prevNotes =>
          prevNotes.map((row, ri) =>
            row.map((cell, ci) => (ri === r && ci === c ? [] : cell))
          )
        );

        // Remove error highlight on change
        setValidationErrors(errs =>
          errs.map((row, ri) =>
            row.map((cell, ci) => (ri === r && ci === c ? false : cell))
          )
        );

        checkVictory(next);
        return next;
      });
    }
  }, [selectedCell, clues, isPencilMode, grid, checkVictory, gameWon]);

  const undoLastMove = useCallback(() => {
    if (history.length === 0 || gameWon) return;
    const [move, ...rest] = history;
    if (!move) return;

    setGrid(prev =>
      prev.map((row, ri) =>
        row.map((cell, ci) => (ri === move.r && ci === move.c ? move.prevVal : cell))
      )
    );

    if (move.isNote) {
      setNotes(prevNotes =>
        prevNotes.map((row, ri) =>
          row.map((cell, ci) => (ri === move.r && ci === move.c ? move.prevNotes : cell))
        )
      );
    }

    setHistory(rest);
  }, [history, gameWon]);

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Backspace" || e.key === "Delete") {
        e.preventDefault();
        inputNumber(null);
      } else if (e.key >= "1" && e.key <= "9") {
        e.preventDefault();
        inputNumber(parseInt(e.key, 10));
      } else if (e.key === "n" || e.key === "N" || e.key === "p" || e.key === "P") {
        setIsPencilMode(p => !p);
      } else if (e.key === "z" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        undoLastMove();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [inputNumber, undoLastMove]);

  // Validation
  const validateGrid = useCallback(() => {
    const nextErrors = Array.from({ length: 9 }, () => Array(9).fill(false));
    let hasError = false;

    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const val = grid[r]![c]!;
        if (val !== null && val !== solvedBoard[r]![c]) {
          nextErrors[r]![c] = true;
          hasError = true;
        }
      }
    }
    setValidationErrors(nextErrors);
    if (!hasError && grid.some(row => row.some(cell => cell === null))) {
      // No errors but not complete
    }
  }, [grid, solvedBoard]);

  const fillHint = useCallback(() => {
    if (!selectedCell || gameWon) return;
    const { r, c } = selectedCell;
    if (clues[r]![c]) return;

    const answer = solvedBoard[r]![c]!;
    setGrid(prev => {
      const next = prev.map((row, ri) =>
        row.map((cell, ci) => (ri === r && ci === c ? answer : cell))
      );
      checkVictory(next);
      return next;
    });

    setClues(prev =>
      prev.map((row, ri) =>
        row.map((cell, ci) => (ri === r && ci === c ? true : cell))
      )
    );
  }, [selectedCell, solvedBoard, clues, checkVictory, gameWon]);

  // Cell highlight checking helper
  const isSameValue = (r: number, c: number) => {
    if (!selectedCell) return false;
    const val = grid[selectedCell.r]![selectedCell.c]!;
    return val !== null && grid[r]![c] === val;
  };

  const isRelated = (r: number, c: number) => {
    if (!selectedCell) return false;
    const { r: sr, c: sc } = selectedCell;
    const sameRow = r === sr;
    const sameCol = c === sc;
    const sameBox = Math.floor(r / 3) === Math.floor(sr / 3) && Math.floor(c / 3) === Math.floor(sc / 3);
    return sameRow || sameCol || sameBox;
  };

  const formatTime = (s: number) =>
    `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  const currentBest = bestTimes[difficulty];

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* ── Difficulty / Reset Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex gap-2">
          {(["easy", "medium", "hard"] as const).map((diff) => (
            <m.button
              key={diff}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setDifficulty(diff); initPuzzle(diff); }}
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

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-text-3 font-bold font-mono">
            <Timer className="w-4 h-4 text-primary" />
            <span>{formatTime(elapsed)}</span>
          </div>
          <m.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => initPuzzle(difficulty)}
            className="flex items-center gap-1.5 px-4 py-2 bg-surface border border-border text-text-2 rounded-xl font-bold hover:border-primary transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <RotateCcw className="w-4 h-4" /> Reset
          </m.button>
        </div>
      </div>

      {/* ── Grid Board ── */}
      <div className="relative">
        <div
          className="grid grid-cols-9 border-2 border-text bg-surface overflow-hidden aspect-square select-none rounded-2xl"
          role="grid"
          aria-label="Sudoku board"
        >
          {grid.map((row, r) =>
            row.map((cell, c) => {
              const isClue = clues[r]![c]!;
              const isSelected = selectedCell?.r === r && selectedCell?.c === c;
              const cellNotes = notes[r]![c]!;
              const hasError = validationErrors[r]![c]!;

              const isThickRight = c === 2 || c === 5;
              const isThickBottom = r === 2 || r === 5;

              return (
                <m.button
                  key={`${r}-${c}`}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCell({ r, c })}
                  role="gridcell"
                  className={`
                    relative aspect-square flex items-center justify-center border-r border-b text-lg font-bold transition-all outline-none
                    ${isThickRight ? "border-r-2 border-r-text" : "border-r-border/60"}
                    ${isThickBottom ? "border-b-2 border-b-text" : "border-b-border/60"}
                    ${c === 8 ? "border-r-0" : ""}
                    ${r === 8 ? "border-b-0" : ""}
                    ${isClue ? "bg-surface-elevated/20 text-text font-black" : "text-primary"}
                    ${isRelated(r, c) ? "bg-primary/5" : ""}
                    ${isSameValue(r, c) ? "bg-primary/15" : ""}
                    ${isSelected ? "bg-primary/20 ring-2 ring-primary inset-0 z-content scale-[1.01]" : ""}
                    ${hasError ? "bg-danger/15 text-danger font-bold" : ""}
                    focus-visible:bg-primary/10
                  `}
                >
                  {cell !== null ? (
                    <m.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      key={`${r}-${c}-${cell}`} // remounts to animate
                    >
                      {cell}
                    </m.div>
                  ) : (
                    // Note cell
                    <div className="grid grid-cols-3 gap-0.5 w-full h-full p-1 leading-none text-[8px] text-text-muted font-normal">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                        <span key={num} className="flex items-center justify-center">
                          {cellNotes.includes(num) ? num : ""}
                        </span>
                      ))}
                    </div>
                  )}
                </m.button>
              );
            })
          )}
        </div>

        {/* Victory Screen */}
        <AnimatePresence>
          {gameWon && (
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-surface/90 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center gap-4 z-above text-center"
              role="alert"
              aria-live="assertive"
            >
              <Trophy className="w-16 h-16 text-primary animate-bounce" />
              <div>
                <h2 className="text-3xl font-black text-text">Sudoku Solved!</h2>
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
                onClick={() => initPuzzle(difficulty)}
                className="px-6 py-2.5 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                Play Again
              </m.button>
            </m.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Number Pad & Control Toolbar ── */}
      <div className="space-y-4">
        {/* Toolbar */}
        <div className="flex justify-between items-center gap-3">
          <div className="flex gap-2">
            <m.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsPencilMode(p => !p)}
              className={`flex items-center gap-1.5 px-4 py-2 border rounded-xl font-bold text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                isPencilMode
                  ? "bg-primary/20 text-primary border-primary/30"
                  : "bg-surface border-border text-text-2 hover:border-primary/50"
              }`}
              title="Toggle Pencil Mode (N)"
            >
              <Pencil className="w-4 h-4" /> Pencil: {isPencilMode ? "ON" : "OFF"}
            </m.button>

            <m.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={undoLastMove}
              disabled={history.length === 0}
              className="flex items-center gap-1.5 px-4 py-2 bg-surface border border-border text-text-2 rounded-xl font-bold hover:border-primary disabled:opacity-40 disabled:hover:border-border disabled:hover:text-text-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              title="Undo move (Ctrl+Z)"
            >
              <Undo2 className="w-4 h-4" /> Undo
            </m.button>
          </div>

          <div className="flex gap-2">
            <m.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={fillHint}
              disabled={!selectedCell || clues[selectedCell.r]![selectedCell.c]!}
              className="flex items-center gap-1.5 px-4 py-2 bg-surface border border-border text-text-2 rounded-xl font-bold hover:border-primary disabled:opacity-40 disabled:hover:border-border disabled:hover:text-text-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              title="Get clue for selected cell"
            >
              <Lightbulb className="w-4 h-4 text-amber-500" /> Hint
            </m.button>
            <m.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={validateGrid}
              className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              title="Validate grid errors"
            >
              <Check className="w-4 h-4" /> Check
            </m.button>
          </div>
        </div>

        {/* Number Pad */}
        <div className="grid grid-cols-9 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <m.button
              key={num}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => inputNumber(num)}
              className="aspect-square flex items-center justify-center bg-surface border border-border text-text font-black text-xl rounded-xl hover:border-primary hover:text-primary transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {num}
            </m.button>
          ))}
        </div>

        {/* Erase button */}
        <m.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => inputNumber(null)}
          className="w-full py-2.5 bg-surface border border-border text-text hover:border-danger hover:text-danger rounded-xl font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger"
        >
          Erase Cell
        </m.button>
      </div>

      {/* Best Score Info */}
      {currentBest !== null && (
        <p className="text-center text-xs text-text-muted font-bold">
          Best time ({difficulty}): <strong>{formatTime(currentBest)}</strong>
        </p>
      )}
    </div>
  );
}
