"use client";

import React, { useState, useCallback, useEffect, useMemo } from "react";
import { m, AnimatePresence } from "framer-motion";
import { RotateCcw, Trophy, Bot, Users, Sparkles } from "lucide-react";
import { idbStorage } from "@/src/store/idb-storage";
import { logger } from "@/src/lib/logger";

// ─── Types ────────────────────────────────────────────────────────────────────

type Player = "X" | "O";
type Cell = Player | null;
type BoardState = Cell[];
type GameMode = "pvp" | "ai";
type AIDifficulty = "easy" | "medium" | "hard";

const WINNING_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
  [0, 4, 8], [2, 4, 6],             // diagonals
];

const SCORE_KEY = "karuvi.breaktime.ttt.scores";

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

// ─── AI (Minimax) ─────────────────────────────────────────────────────────────

function minimax(
  board: BoardState,
  depth: number,
  isMaximizing: boolean,
  maxDepth: number
): number {
  const result = checkWinner(board);
  if (result.winner === "O") return 10 - depth;
  if (result.winner === "X") return depth - 10;
  if (result.winner === "draw") return 0;
  if (depth >= maxDepth) return 0;

  const scores: number[] = [];
  for (let i = 0; i < 9; i++) {
    if (board[i]) continue;
    const next = board.slice() as BoardState;
    next[i] = isMaximizing ? "O" : "X";
    scores.push(minimax(next, depth + 1, !isMaximizing, maxDepth));
  }
  return isMaximizing
    ? Math.max(...scores)
    : Math.min(...scores);
}

function getAIMove(board: BoardState, difficulty: AIDifficulty): number {
  const empty = board.map((c, i) => (c === null ? i : -1)).filter(i => i >= 0);
  if (empty.length === 0) return -1;

  // Easy: 40% random, 60% smart (depth 2)
  // Medium: 20% random, 80% smart (depth 4)
  // Hard: 100% optimal (full depth)
  const randomChance = difficulty === "easy" ? 0.4 : difficulty === "medium" ? 0.2 : 0;
  const maxDepth = difficulty === "easy" ? 2 : difficulty === "medium" ? 4 : 9;

  if (Math.random() < randomChance) {
    return empty[Math.floor(Math.random() * empty.length)]!;
  }

  let bestScore = -Infinity;
  let bestMove = empty[0]!;

  for (const i of empty) {
    const next = board.slice() as BoardState;
    next[i] = "O";
    const score = minimax(next, 0, false, maxDepth);
    if (score > bestScore) {
      bestScore = score;
      bestMove = i;
    }
  }
  return bestMove;
}

const EMPTY_BOARD: BoardState = Array(9).fill(null);
const DEFAULT_SCORES: Scores = { x: 0, o: 0, draws: 0 };

const SPRING_CONFIG = { type: "spring" as const, stiffness: 300, damping: 30 };

// ─── Component ────────────────────────────────────────────────────────────────

export default function TicTacToeClient() {
  const [board, setBoard] = useState<BoardState>(EMPTY_BOARD);
  const [current, setCurrent] = useState<Player>("X");
  const [scores, setScores] = useState<Scores>(DEFAULT_SCORES);
  const [winResult, setWinResult] = useState<{ winner: Player | "draw"; line: number[] | null } | null>(null);
  const [scoresLoaded, setScoresLoaded] = useState(false);
  const [mode, setMode] = useState<GameMode>("pvp");
  const [aiDifficulty, setAIDifficulty] = useState<AIDifficulty>("medium");
  const [aiThinking, setAiThinking] = useState(false);

  // Load persisted scores on mount with legacy migration
  useEffect(() => {
    idbStorage.getItem(SCORE_KEY).then((raw) => {
      if (raw) {
        try {
          setScores(JSON.parse(raw));
        } catch {
          logger.warn("[TicTacToe] Failed to parse persisted scores");
        }
        setScoresLoaded(true);
      } else {
        // Migration from legacy namespace
        idbStorage.getItem("karuvi.fun.ttt.scores").then((legacy) => {
          if (legacy) {
            try {
              const parsed = JSON.parse(legacy);
              setScores(parsed);
              idbStorage.setItem(SCORE_KEY, legacy);
              idbStorage.removeItem("karuvi.fun.ttt.scores");
            } catch {
              logger.warn("[TicTacToe] Failed to parse legacy persisted scores");
            }
          }
          setScoresLoaded(true);
        }).catch(() => setScoresLoaded(true));
      }
    });
  }, []);

  // Persist scores whenever they change (after initial load)
  useEffect(() => {
    if (!scoresLoaded) return;
    idbStorage.setItem(SCORE_KEY, JSON.stringify(scores)).catch((e) =>
      logger.error("[TicTacToe] Failed to persist scores", { error: e })
    );
  }, [scores, scoresLoaded]);

  const processResult = useCallback((nextBoard: BoardState) => {
    const result = checkWinner(nextBoard);
    if (result.winner) {
      setWinResult(result as { winner: Player | "draw"; line: number[] | null });
      setScores((prev) => {
        if (result.winner === "X") return { ...prev, x: prev.x + 1 };
        if (result.winner === "O") return { ...prev, o: prev.o + 1 };
        return { ...prev, draws: prev.draws + 1 };
      });
      return true;
    }
    return false;
  }, []);

  // AI move effect
  useEffect(() => {
    if (mode !== "ai" || current !== "O" || winResult || aiThinking) return;
    if (board.every(c => c === null) && current === "O") return;

    const hasPlayed = board.some(c => c !== null);
    if (!hasPlayed) return;

    setAiThinking(true);
    const timer = setTimeout(() => {
      const move = getAIMove(board, aiDifficulty);
      if (move >= 0) {
        const nextBoard = board.slice() as BoardState;
        nextBoard[move] = "O";
        setBoard(nextBoard);
        if (!processResult(nextBoard)) {
          setCurrent("X");
        }
      }
      setAiThinking(false);
    }, 400); // Small delay for feel

    return () => clearTimeout(timer);
  }, [board, current, mode, winResult, aiDifficulty, aiThinking, processResult]);

  const handleCellClick = useCallback(
    (index: number) => {
      if (board[index] || winResult) return;
      if (mode === "ai" && current === "O") return; // AI's turn

      const nextBoard = board.slice() as BoardState;
      nextBoard[index] = current;

      setBoard(nextBoard);
      if (!processResult(nextBoard)) {
        setCurrent(current === "X" ? "O" : "X");
      }
    },
    [board, current, winResult, mode, processResult]
  );

  const resetGame = useCallback(() => {
    setBoard(EMPTY_BOARD);
    setCurrent("X");
    setWinResult(null);
    setAiThinking(false);
  }, []);

  const resetAll = useCallback(() => {
    resetGame();
    setScores(DEFAULT_SCORES);
  }, [resetGame]);

  const switchMode = useCallback((newMode: GameMode) => {
    setMode(newMode);
    resetGame();
    setScores(DEFAULT_SCORES);
  }, [resetGame]);

  const { winner, line: winLine } = winResult ?? { winner: null, line: null };

  const statusText = useMemo(() => {
    if (aiThinking) return "AI is thinking...";
    if (winner) {
      if (winner === "draw") return "It's a draw!";
      if (mode === "ai") return winner === "X" ? "You win! 🎉" : "AI wins!";
      return `Player ${winner} wins! 🎉`;
    }
    if (mode === "ai") return current === "X" ? "Your turn" : "AI's turn";
    return `Player ${current}'s turn`;
  }, [winner, current, mode, aiThinking]);

  return (
    <div className="max-w-lg mx-auto space-y-6">
      {/* ── Mode Selector ── */}
      <div className="flex gap-2 justify-center">
        {([
          { id: "pvp" as const, label: "2 Players", icon: <Users className="w-4 h-4" /> },
          { id: "ai" as const, label: "vs AI", icon: <Bot className="w-4 h-4" /> },
        ]).map(({ id, label, icon }) => (
          <m.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            key={id}
            onClick={() => switchMode(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
              mode === id
                ? "bg-primary text-white"
                : "bg-surface border border-border text-text-2 hover:border-primary/50"
            }`}
          >
            {icon} {label}
          </m.button>
        ))}
      </div>

      {/* ── AI Difficulty (only in AI mode) ── */}
      <AnimatePresence>
        {mode === "ai" && (
          <m.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex gap-2 justify-center overflow-hidden"
          >
            {(["easy", "medium", "hard"] as const).map((diff) => (
              <m.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                key={diff}
                onClick={() => { setAIDifficulty(diff); resetGame(); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  aiDifficulty === diff
                    ? "bg-primary/20 text-primary border border-primary/30"
                    : "bg-surface border border-border text-text-4 hover:text-text-2 hover:border-primary/30"
                }`}
              >
                {diff}
              </m.button>
            ))}
          </m.div>
        )}
      </AnimatePresence>

      {/* ── Score Panel ── */}
      <div className="grid grid-cols-3 gap-3">
        {([
          { label: mode === "ai" ? "You (X)" : "Player X", key: "x" as const },
          { label: "Draw", key: "draws" as const },
          { label: mode === "ai" ? "AI (O)" : "Player O", key: "o" as const },
        ]).map(({ label, key }) => {
          const count = scores[key];
          const isActive =
            (!winner && key === "x" && current === "X") ||
            (!winner && key === "o" && current === "O");
          return (
            <div
              key={label}
              className={`rounded-2xl border p-4 flex flex-col items-center gap-1 transition-all ${
                isActive
                  ? "border-primary bg-primary/10"
                  : "border-border bg-surface"
              }`}
              aria-label={`${label} score: ${count}`}
            >
              <Trophy className="w-4 h-4 text-primary" aria-hidden="true" />
              <span className="text-2xl font-black text-text">{count}</span>
              <span className="text-xs font-bold text-text-4 uppercase tracking-widest text-center">
                {label}
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
        {aiThinking && (
          <m.span
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {statusText}
          </m.span>
        )}
        {!aiThinking && statusText}
      </p>

      {/* ── Board ── */}
      <div className="relative">
        <div
          className="grid grid-cols-3 gap-3"
          role="grid"
          aria-label="Tic-Tac-Toe board"
        >
          {board.map((cell, i) => {
            const isWinCell = winLine?.includes(i) ?? false;
            const isDisabled = !!cell || !!winner || (mode === "ai" && current === "O");
            return (
              <m.button
                key={i}
                role="gridcell"
                aria-label={`Cell ${i + 1}${cell ? `, ${cell}` : ", empty"}`}
                onClick={() => handleCellClick(i)}
                disabled={isDisabled}
                whileHover={!isDisabled ? { scale: 1.04, y: -2 } : {}}
                whileTap={!isDisabled ? { scale: 0.96 } : {}}
                className={`
                  aspect-square rounded-2xl border-2 flex items-center justify-center text-5xl font-black transition-all
                  ${isWinCell ? "border-primary bg-primary/20" : "border-border bg-surface"}
                  ${!isDisabled ? "hover:border-primary/50 hover:bg-primary/5 cursor-pointer" : ""}
                  ${cell ? "cursor-default" : ""}
                  ${winner && !isWinCell ? "opacity-40" : ""}
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary
                `}
              >
                <AnimatePresence mode="wait">
                  {cell && (
                    <m.span
                      key={cell + i}
                      initial={{ scale: 0, rotate: -20 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0 }}
                      transition={SPRING_CONFIG}
                      className={cell === "X" ? "text-blue" : "text-danger"}
                    >
                      {cell}
                    </m.span>
                  )}
                </AnimatePresence>
              </m.button>
            );
          })}
        </div>

        {/* ── Win/Draw Overlay ── */}
        <AnimatePresence>
          {winner && (
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 rounded-2xl bg-surface/90 backdrop-blur-sm flex flex-col items-center justify-center gap-3 z-content"
              role="alert"
              aria-live="assertive"
            >
              {winner === "draw" ? (
                <Sparkles className="w-10 h-10 text-primary" />
              ) : (
                <Trophy className="w-10 h-10 text-primary" />
              )}
              <h2 className="text-2xl font-black text-text">
                {winner === "draw"
                  ? "It's a Draw!"
                  : mode === "ai"
                    ? winner === "X" ? "You Win! 🎉" : "AI Wins!"
                    : `Player ${winner} Wins! 🎉`}
              </h2>
              <m.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={resetGame}
                className="px-6 py-2.5 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                Play Again
              </m.button>
            </m.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Actions ── */}
      <div className="flex gap-3 justify-center">
        <m.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={resetGame}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label="Start a new game"
        >
          <RotateCcw className="w-4 h-4" aria-hidden="true" />
          New Game
        </m.button>
        <m.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={resetAll}
          className="flex items-center gap-2 px-5 py-2.5 bg-surface border border-border text-text-2 rounded-xl font-bold hover:border-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label="Reset all scores"
        >
          Reset Scores
        </m.button>
      </div>
    </div>
  );
}
