"use client";

import React, { useState, useCallback, useEffect } from "react";
import { m, AnimatePresence } from "framer-motion";
import { RotateCcw, Trophy } from "lucide-react";
import { idbStorage } from "@/src/store/idb-storage";
import { logger } from "@/src/lib/logger";

// ─── Types ────────────────────────────────────────────────────────────────────

type Player = "X" | "O";
type Cell = Player | null;
type BoardState = Cell[];

const WINNING_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
  [0, 4, 8], [2, 4, 6],             // diagonals
];

const SCORE_KEY = "karuvi.fun.ttt.scores";

interface Scores {
  x: number;
  o: number;
  draws: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function checkWinner(board: BoardState): { winner: Player | "draw" | null; line: number[] | null } {
  for (const line of WINNING_LINES) {
    const [a, b, c] = line as [number, number, number];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a] as Player, line };
    }
  }
  if (board.every(Boolean)) return { winner: "draw", line: null };
  return { winner: null, line: null };
}

const EMPTY_BOARD: BoardState = Array(9).fill(null);
const DEFAULT_SCORES: Scores = { x: 0, o: 0, draws: 0 };

// ─── Component ────────────────────────────────────────────────────────────────

export default function TicTacToeClient() {
  const [board, setBoard] = useState<BoardState>(EMPTY_BOARD);
  const [current, setCurrent] = useState<Player>("X");
  const [scores, setScores] = useState<Scores>(DEFAULT_SCORES);
  const [winResult, setWinResult] = useState<{ winner: Player | "draw"; line: number[] | null } | null>(null);
  const [scoresLoaded, setScoresLoaded] = useState(false);

  // Load persisted scores on mount
  useEffect(() => {
    idbStorage.getItem(SCORE_KEY).then((raw) => {
      if (raw) {
        try {
          setScores(JSON.parse(raw));
        } catch {
          logger.warn("[TicTacToe] Failed to parse persisted scores");
        }
      }
      setScoresLoaded(true);
    });
  }, []);

  // Persist scores whenever they change (after initial load)
  useEffect(() => {
    if (!scoresLoaded) return;
    idbStorage.setItem(SCORE_KEY, JSON.stringify(scores)).catch((e) =>
      logger.error("[TicTacToe] Failed to persist scores", { error: e })
    );
  }, [scores, scoresLoaded]);

  const handleCellClick = useCallback(
    (index: number) => {
      if (board[index] || winResult) return;
      const nextBoard = board.slice() as BoardState;
      nextBoard[index] = current;
      const result = checkWinner(nextBoard);

      setBoard(nextBoard);
      if (result.winner) {
        setWinResult(result as { winner: Player | "draw"; line: number[] | null });
        setScores((prev) => {
          if (result.winner === "X") return { ...prev, x: prev.x + 1 };
          if (result.winner === "O") return { ...prev, o: prev.o + 1 };
          return { ...prev, draws: prev.draws + 1 };
        });
      } else {
        setCurrent(current === "X" ? "O" : "X");
      }
    },
    [board, current, winResult]
  );

  const resetGame = useCallback(() => {
    setBoard(EMPTY_BOARD);
    setCurrent("X");
    setWinResult(null);
  }, []);

  const resetAll = useCallback(() => {
    resetGame();
    setScores(DEFAULT_SCORES);
  }, [resetGame]);

  const { winner, line: winLine } = winResult ?? { winner: null, line: null };

  const statusText = winner
    ? winner === "draw"
      ? "It's a draw!"
      : `Player ${winner} wins! 🎉`
    : `Player ${current}'s turn`;

  return (
    <div className="max-w-lg mx-auto space-y-8">
      {/* ── Score Panel ── */}
      <div className="grid grid-cols-3 gap-3">
        {(["X", "Draw", "O"] as const).map((label) => {
          const count =
            label === "X" ? scores.x : label === "O" ? scores.o : scores.draws;
          const isActive =
            (label === "X" && current === "X" && !winner) ||
            (label === "O" && current === "O" && !winner);
          return (
            <div
              key={label}
              className={`rounded-2xl border p-4 flex flex-col items-center gap-1 transition-all ${
                isActive
                  ? "border-[#8B5CF6] bg-[#8B5CF6]/10"
                  : "border-border bg-surface"
              }`}
              aria-label={`${label} score: ${count}`}
            >
              <Trophy className="w-4 h-4 text-[#8B5CF6]" aria-hidden="true" />
              <span className="text-2xl font-black text-text">{count}</span>
              <span className="text-xs font-bold text-text-4 uppercase tracking-widest">
                {label === "Draw" ? "Draws" : `Player ${label}`}
              </span>
            </div>
          );
        })}
      </div>

      {/* ── Status ── */}
      <p
        className="text-center text-lg font-bold text-text-2"
        role="status"
        aria-live="polite"
      >
        {statusText}
      </p>

      {/* ── Board ── */}
      <div
        className="grid grid-cols-3 gap-3"
        role="grid"
        aria-label="Tic-Tac-Toe board"
      >
        {board.map((cell, i) => {
          const isWinCell = winLine?.includes(i) ?? false;
          return (
            <m.button
              key={i}
              role="gridcell"
              aria-label={`Cell ${i + 1}${cell ? `, ${cell}` : ", empty"}`}
              onClick={() => handleCellClick(i)}
              disabled={!!cell || !!winner}
              whileHover={!cell && !winner ? { scale: 1.04, y: -2 } : {}}
              whileTap={!cell && !winner ? { scale: 0.96 } : {}}
              className={`
                aspect-square rounded-2xl border-2 flex items-center justify-center text-5xl font-black transition-all
                ${isWinCell ? "border-[#8B5CF6] bg-[#8B5CF6]/20" : "border-border bg-surface"}
                ${!cell && !winner ? "hover:border-[#8B5CF6]/50 hover:bg-[#8B5CF6]/5 cursor-pointer" : ""}
                ${cell ? "cursor-default" : ""}
                ${winner && !isWinCell ? "opacity-40" : ""}
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]
              `}
            >
              <AnimatePresence mode="wait">
                {cell && (
                  <m.span
                    key={cell + i}
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className={cell === "X" ? "text-[#6366F1]" : "text-[#EC4899]"}
                  >
                    {cell}
                  </m.span>
                )}
              </AnimatePresence>
            </m.button>
          );
        })}
      </div>

      {/* ── Actions ── */}
      <div className="flex gap-3 justify-center">
        <button
          onClick={resetGame}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#8B5CF6] text-white rounded-xl font-bold hover:bg-[#7C3AED] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]"
          aria-label="Start a new game"
        >
          <RotateCcw className="w-4 h-4" aria-hidden="true" />
          New Game
        </button>
        <button
          onClick={resetAll}
          className="flex items-center gap-2 px-5 py-2.5 bg-surface border border-border text-text-2 rounded-xl font-bold hover:border-[#8B5CF6] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]"
          aria-label="Reset all scores"
        >
          Reset Scores
        </button>
      </div>
    </div>
  );
}
