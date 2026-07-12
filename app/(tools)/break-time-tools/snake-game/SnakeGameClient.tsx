"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { m, AnimatePresence } from "framer-motion";
import { RotateCcw, Trophy, Play, Pause, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Zap } from "lucide-react";
import { idbStorage } from "@/src/store/idb-storage";
import { logger } from "@/src/lib/logger";

// ─── Constants & Types ────────────────────────────────────────────────────────

const GRID_SIZE = 20;
const CELL_COUNT = 20; // 20x20 grid
const BEST_SCORE_KEY = "karuvi.breaktime.snake.best";

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
type Position = { x: number; y: number };
type GameState = "IDLE" | "PLAYING" | "PAUSED" | "GAMEOVER";
type SpeedMode = "slow" | "medium" | "fast";

const SPEED_VALS: Record<SpeedMode, number> = {
  slow: 140,
  medium: 90,
  fast: 60,
};

const SPRING_CONFIG = { type: "spring" as const, stiffness: 300, damping: 30 };

// Helper to check collision
function checkSelfCollision(head: Position, body: Position[]): boolean {
  return body.some(segment => segment.x === head.x && segment.y === head.y);
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SnakeGameClient() {
  const [gameState, setGameState] = useState<GameState>("IDLE");
  const [snake, setSnake] = useState<Position[]>([
    { x: 10, y: 10 },
    { x: 10, y: 11 },
    { x: 10, y: 12 },
  ]);
  const [direction, setDirection] = useState<Direction>("UP");
  const [food, setFood] = useState<Position>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [bestLoaded, setBestLoaded] = useState(false);
  const [speedMode, setSpeedMode] = useState<SpeedMode>("medium");
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const nextDirectionRef = useRef<Direction>("UP");
  const gameIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  // Load best score
  useEffect(() => {
    idbStorage.getItem(BEST_SCORE_KEY).then((raw) => {
      if (raw) setBest(parseInt(raw, 10) || 0);
      setBestLoaded(true);
    }).catch((e) => {
      logger.error("[Snake] Failed to load best score", { error: e });
      setBestLoaded(true);
    });
  }, []);

  // Save best score
  const updateBest = useCallback((newScore: number) => {
    setBest((prev) => {
      const next = Math.max(prev, newScore);
      if (next === newScore && bestLoaded) {
        idbStorage.setItem(BEST_SCORE_KEY, String(next)).catch((e) => {
          logger.error("[Snake] Failed to save best score", { error: e });
        });
      }
      return next;
    });
  }, [bestLoaded]);

  // Generate random food position not on the snake
  const generateFood = useCallback((currentSnake: Position[]): Position => {
    let newFood: Position;
    let isOnSnake = true;
    while (isOnSnake) {
      newFood = {
        x: Math.floor(Math.random() * CELL_COUNT),
        y: Math.floor(Math.random() * CELL_COUNT),
      };
      isOnSnake = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
    }
    return newFood!;
  }, []);

  // Start / restart game
  const startGame = useCallback(() => {
    const initialSnake = [
      { x: 10, y: 10 },
      { x: 10, y: 11 },
      { x: 10, y: 12 },
    ];
    setSnake(initialSnake);
    setDirection("UP");
    nextDirectionRef.current = "UP";
    setFood(generateFood(initialSnake));
    setScore(0);
    setGameState("PLAYING");
  }, [generateFood]);

  const togglePause = useCallback(() => {
    setGameState(prev => {
      if (prev === "PLAYING") return "PAUSED";
      if (prev === "PAUSED") return "PLAYING";
      return prev;
    });
  }, []);

  // Direction handlers
  const changeDirection = useCallback((newDir: Direction) => {
    const currentDir = direction;
    if (newDir === "UP" && currentDir !== "DOWN") nextDirectionRef.current = "UP";
    if (newDir === "DOWN" && currentDir !== "UP") nextDirectionRef.current = "DOWN";
    if (newDir === "LEFT" && currentDir !== "RIGHT") nextDirectionRef.current = "LEFT";
    if (newDir === "RIGHT" && currentDir !== "LEFT") nextDirectionRef.current = "RIGHT";
  }, [direction]);

  // Keyboard handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === " ") {
        e.preventDefault();
        if (gameState === "PLAYING" || gameState === "PAUSED") {
          togglePause();
        } else if (gameState === "IDLE" || gameState === "GAMEOVER") {
          startGame();
        }
        return;
      }

      if (gameState !== "PLAYING") return;

      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          e.preventDefault();
          changeDirection("UP");
          break;
        case "ArrowDown":
        case "s":
        case "S":
          e.preventDefault();
          changeDirection("DOWN");
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          e.preventDefault();
          changeDirection("LEFT");
          break;
        case "ArrowRight":
        case "d":
        case "D":
          e.preventDefault();
          changeDirection("RIGHT");
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState, changeDirection, togglePause, startGame]);

  // Touch handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const t = e.touches[0];
    if (t) touchStart.current = { x: t.clientX, y: t.clientY };
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStart.current || gameState !== "PLAYING") return;
    const t = e.changedTouches[0];
    if (!t) return;
    const dx = t.clientX - touchStart.current.x;
    const dy = t.clientY - touchStart.current.y;
    touchStart.current = null;

    if (Math.abs(dx) < 15 && Math.abs(dy) < 15) return;

    if (Math.abs(dx) > Math.abs(dy)) {
      changeDirection(dx > 0 ? "RIGHT" : "LEFT");
    } else {
      changeDirection(dy > 0 ? "DOWN" : "UP");
    }
  }, [gameState, changeDirection]);

  // Game loop
  useEffect(() => {
    if (gameState !== "PLAYING") {
      if (gameIntervalRef.current) clearInterval(gameIntervalRef.current);
      return;
    }

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = { ...prevSnake[0]! };
        const currentDir = nextDirectionRef.current;
        setDirection(currentDir);

        switch (currentDir) {
          case "UP": head.y -= 1; break;
          case "DOWN": head.y += 1; break;
          case "LEFT": head.x -= 1; break;
          case "RIGHT": head.x += 1; break;
        }

        // Wall collision
        if (head.x < 0 || head.x >= CELL_COUNT || head.y < 0 || head.y >= CELL_COUNT) {
          setGameState("GAMEOVER");
          updateBest(score);
          return prevSnake;
        }

        // Self collision
        if (checkSelfCollision(head, prevSnake)) {
          setGameState("GAMEOVER");
          updateBest(score);
          return prevSnake;
        }

        const newSnake = [head, ...prevSnake];

        // Food collision
        if (head.x === food.x && head.y === food.y) {
          setScore(s => {
            const nextScore = s + 1;
            updateBest(nextScore);
            return nextScore;
          });
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop(); // remove tail
        }

        return newSnake;
      });
    };

    gameIntervalRef.current = setInterval(moveSnake, SPEED_VALS[speedMode]);
    return () => {
      if (gameIntervalRef.current) clearInterval(gameIntervalRef.current);
    };
  }, [gameState, food, speedMode, score, generateFood, updateBest]);

  // Canvas rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear board
    ctx.fillStyle = "#0F172A"; // bg-surface (slate-900)
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Grid Lines (subtle)
    ctx.strokeStyle = "#1E293B"; // border-border (slate-800)
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= CELL_COUNT; i++) {
      const pos = i * GRID_SIZE;
      ctx.beginPath();
      ctx.moveTo(pos, 0);
      ctx.lineTo(pos, canvas.height);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, pos);
      ctx.lineTo(canvas.width, pos);
      ctx.stroke();
    }

    // Draw Food
    const foodX = food.x * GRID_SIZE + GRID_SIZE / 2;
    const foodY = food.y * GRID_SIZE + GRID_SIZE / 2;
    ctx.font = `${GRID_SIZE - 2}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("🍎", foodX, foodY);

    // Draw Snake
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      const x = segment.x * GRID_SIZE;
      const y = segment.y * GRID_SIZE;

      ctx.fillStyle = isHead ? "#4F46E5" : "#6366F1"; // Indigo head, slightly lighter body

      // Rounded rectangles for segments
      const radius = isHead ? 6 : 4;
      ctx.beginPath();
      ctx.roundRect(x + 1, y + 1, GRID_SIZE - 2, GRID_SIZE - 2, radius);
      ctx.fill();

      // Draw eyes on the head
      if (isHead) {
        ctx.fillStyle = "#FFFFFF";
        let eye1 = { x: 0, y: 0 };
        let eye2 = { x: 0, y: 0 };
        const eyeOffset = 4;
        const eyeSize = 2.5;

        switch (direction) {
          case "UP":
            eye1 = { x: x + eyeOffset, y: y + eyeOffset };
            eye2 = { x: x + GRID_SIZE - eyeOffset, y: y + eyeOffset };
            break;
          case "DOWN":
            eye1 = { x: x + eyeOffset, y: y + GRID_SIZE - eyeOffset };
            eye2 = { x: x + GRID_SIZE - eyeOffset, y: y + GRID_SIZE - eyeOffset };
            break;
          case "LEFT":
            eye1 = { x: x + eyeOffset, y: y + eyeOffset };
            eye2 = { x: x + eyeOffset, y: y + GRID_SIZE - eyeOffset };
            break;
          case "RIGHT":
            eye1 = { x: x + GRID_SIZE - eyeOffset, y: y + eyeOffset };
            eye2 = { x: x + GRID_SIZE - eyeOffset, y: y + GRID_SIZE - eyeOffset };
            break;
        }
        ctx.beginPath();
        ctx.arc(eye1.x, eye1.y, eyeSize, 0, Math.PI * 2);
        ctx.arc(eye2.x, eye2.y, eyeSize, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }, [snake, food, direction]);

  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {[{ label: "Score", val: score }, { label: "Best", val: best }].map(({ label, val }) => (
            <div key={label} className="rounded-xl bg-surface border border-border px-4 py-2 text-center min-w-[80px]">
              <div className="text-xs font-bold text-text-4 uppercase tracking-widest">{label}</div>
              <div className="text-xl font-black text-text">{val}</div>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          {gameState === "PLAYING" && (
            <m.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={togglePause}
              className="flex items-center justify-center p-3 bg-surface border border-border text-text-2 hover:border-primary hover:text-primary rounded-xl font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary "
              title="Pause"
              aria-label="Pause game"
            >
              <Pause className="w-4 h-4" />
            </m.button>
          )}
          {gameState === "PAUSED" && (
            <m.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={togglePause}
              className="flex items-center justify-center p-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary "
              title="Resume"
              aria-label="Resume game"
            >
              <Play className="w-4 h-4" />
            </m.button>
          )}
          {(gameState === "IDLE" || gameState === "GAMEOVER") && (
            <m.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={startGame}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary "
              aria-label="Start Game"
            >
              <Play className="w-4 h-4" /> Start Game
            </m.button>
          )}
        </div>
      </div>

      {/* ── Difficulty / Speed Selector ── */}
      <div className="flex gap-2 justify-center">
        {(["slow", "medium", "fast"] as const).map((mode) => (
          <m.button
            key={mode}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={gameState === "PLAYING" || gameState === "PAUSED"}
            onClick={() => setSpeedMode(mode)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50 ${
              speedMode === mode
                ? "bg-primary/20 text-primary border border-primary/30"
                : "bg-surface border border-border text-text-4 hover:text-text-2 hover:border-primary/50"
            }`}
          >
            <Zap className="w-3 h-3" />
            {mode}
          </m.button>
        ))}
      </div>

      {/* ── Game Board Canvas ── */}
      <div
        className="relative rounded-2xl bg-surface border border-border overflow-hidden select-none touch-none aspect-square flex items-center justify-center"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        role="application"
        aria-label="Snake Game grid. Use keyboard arrow keys/WASD or swipe to move."
      >
        <canvas
          ref={canvasRef}
          width={GRID_SIZE * CELL_COUNT}
          height={GRID_SIZE * CELL_COUNT}
          className="w-full h-full block"
        />

        {/* Start / Game Over Overlays */}
        <AnimatePresence>
          {gameState === "IDLE" && (
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-surface/90 backdrop-blur-xs flex flex-col items-center justify-center gap-4 text-center p-6"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-3xl animate-bounce">
                🐍
              </div>
              <h2 className="text-2xl font-black text-text">Retro Snake</h2>
              <p className="text-text-3 text-sm max-w-xs">
                Eat red apples to grow and score. Avoid walls and colliding with yourself.
              </p>
              <m.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startGame}
                className="px-6 py-2.5 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                Play Now
              </m.button>
            </m.div>
          )}

          {gameState === "PAUSED" && (
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-surface/85 backdrop-blur-xs flex flex-col items-center justify-center gap-3"
            >
              <Pause className="w-10 h-10 text-primary animate-pulse" />
              <h3 className="text-xl font-bold text-text">Game Paused</h3>
              <p className="text-xs text-text-4">Press Space or Pause to resume</p>
            </m.div>
          )}

          {gameState === "GAMEOVER" && (
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-surface/95 backdrop-blur-sm flex flex-col items-center justify-center gap-4 text-center z-10"
              role="alert"
              aria-live="assertive"
            >
              <Trophy className="w-12 h-12 text-primary animate-pulse" />
              <div>
                <h2 className="text-2xl font-black text-text">Game Over!</h2>
                <p className="text-text-3 text-sm mt-1">
                  You scored <strong>{score}</strong> points.
                  {score === best && score > 0 && <span className="block text-primary font-bold mt-1">🏆 New Best Score!</span>}
                </p>
              </div>
              <m.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startGame}
                className="px-6 py-2.5 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                Play Again
              </m.button>
            </m.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Mobile Controls (Arrow pad) ── */}
      <div className="grid grid-cols-3 gap-2 max-w-[160px] mx-auto sm:hidden" aria-label="Touch controls">
        <div />
        <m.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => changeDirection("UP")} className="p-3.5 rounded-xl bg-surface border border-border hover:border-primary hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label="Move up">
          <ChevronUp className="w-5 h-5 mx-auto" />
        </m.button>
        <div />
        <m.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => changeDirection("LEFT")} className="p-3.5 rounded-xl bg-surface border border-border hover:border-primary hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label="Move left">
          <ChevronLeft className="w-5 h-5 mx-auto" />
        </m.button>
        <m.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => changeDirection("DOWN")} className="p-3.5 rounded-xl bg-surface border border-border hover:border-primary hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label="Move down">
          <ChevronDown className="w-5 h-5 mx-auto" />
        </m.button>
        <m.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => changeDirection("RIGHT")} className="p-3.5 rounded-xl bg-surface border border-border hover:border-primary hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label="Move right">
          <ChevronRight className="w-5 h-5 mx-auto" />
        </m.button>
      </div>

      <p className="text-center text-xs text-text-4">
        Arrow keys or WASD to control. Space to Pause/Start. Swipe on mobile.
      </p>
    </div>
  );
}
