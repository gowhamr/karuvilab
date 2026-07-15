"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { m, AnimatePresence } from "framer-motion";
import { RotateCcw, Trophy, Play, Pause, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Zap, RefreshCw } from "lucide-react";
import { idbStorage } from "@/src/store/idb-storage";
import { logger } from "@/src/lib/logger";

const triggerHaptic = (type: 'eat' | 'golden' | 'death') => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    if (type === 'eat') navigator.vibrate(15);
    else if (type === 'golden') navigator.vibrate([30, 50, 30]);
    else if (type === 'death') navigator.vibrate([100, 50, 200]);
  }
};

// ─── Constants & Types ────────────────────────────────────────────────────────

const GRID_SIZE = 20;
const CELL_COUNT = 20; // 20x20 grid
const BEST_SCORE_KEY = "karuvi.breaktime.snake.best";
const COINS_KEY = "karuvi.breaktime.snake.coins";
const UNLOCKED_THEMES_KEY = "karuvi.breaktime.snake.unlocked";
const ACTIVE_THEME_KEY = "karuvi.breaktime.snake.theme";

type ThemeID = "default" | "neon" | "retro" | "nature";
type PowerUpType = "speed" | "shrink" | "invincible" | "magnet" | "fire" | "ice";
type PowerUp = { x: number; y: number; type: PowerUpType };

const THEMES: Record<ThemeID, {
  id: ThemeID;
  name: string;
  cost: number;
  bg: string;
  grid: string;
  head: string;
  body: string;
  apple: string;
  golden: string;
  glow: string;
}> = {
  default: { id: "default", name: "Classic", cost: 0, bg: "#0F172A", grid: "#1E293B", head: "#4F46E5", body: "#6366F1", apple: "🍎", golden: "🌟", glow: "#F59E0B" },
  neon: { id: "neon", name: "Cyber Neon", cost: 50, bg: "#000000", grid: "#330033", head: "#FF00FF", body: "#00FFFF", apple: "💎", golden: "🔮", glow: "#00FFFF" },
  retro: { id: "retro", name: "Retro Green", cost: 150, bg: "#0F380F", grid: "#306230", head: "#8BAC0F", body: "#9BBC0F", apple: "🟩", golden: "🟨", glow: "#8BAC0F" },
  nature: { id: "nature", name: "Zen Garden", cost: 300, bg: "#F5F5DC", grid: "#D2B48C", head: "#228B22", body: "#32CD32", apple: "🌸", golden: "🌻", glow: "#FFD700" }
};

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
  const directionRef = useRef<Direction>("UP");
  const [food, setFood] = useState<Position & { type: "normal" | "golden", spawnTime: number }>({ x: 5, y: 5, type: "normal", spawnTime: Date.now() });
  const [score, setScore] = useState(0);
  const [floatingScores, setFloatingScores] = useState<{id: number, x: number, y: number, val: number}[]>([]);
  const [best, setBest] = useState(0);
  const [bestLoaded, setBestLoaded] = useState(false);
  const [speedMode, setSpeedMode] = useState<SpeedMode>("medium");
  const [wrapAround, setWrapAround] = useState(false);
  const [coins, setCoins] = useState(0);
  const [unlockedThemes, setUnlockedThemes] = useState<ThemeID[]>(["default"]);
  const [activeTheme, setActiveTheme] = useState<ThemeID>("default");
  const [showShop, setShowShop] = useState(false);
  const [bossMode, setBossMode] = useState(false);
  const [activePowerUp, setActivePowerUp] = useState<{type: PowerUpType, expiresAt: number} | null>(null);
  const [boardPowerUp, setBoardPowerUp] = useState<PowerUp | null>(null);
  const [portals, setPortals] = useState<{in: Position, out: Position} | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const inputQueueRef = useRef<Direction[]>([]);
  const gameIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const bossSnakeRef = useRef<Position[]>([]);
  const bossTickRef = useRef(false);

  // Load data
  useEffect(() => {
    Promise.all([
      idbStorage.getItem(BEST_SCORE_KEY),
      idbStorage.getItem(COINS_KEY),
      idbStorage.getItem(UNLOCKED_THEMES_KEY),
      idbStorage.getItem(ACTIVE_THEME_KEY)
    ]).then(([rawBest, rawCoins, rawUnlocked, rawActive]) => {
      if (rawBest) setBest(parseInt(rawBest, 10) || 0);
      if (rawCoins) setCoins(parseInt(rawCoins, 10) || 0);
      if (rawUnlocked) setUnlockedThemes(JSON.parse(rawUnlocked) as ThemeID[]);
      if (rawActive) setActiveTheme(rawActive as ThemeID);
      setBestLoaded(true);
    }).catch((e) => {
      logger.error("[Snake] Failed to load data", { error: e });
      setBestLoaded(true);
    });
  }, []);

  const addCoins = useCallback((amount: number) => {
    setCoins(prev => {
      const next = prev + amount;
      if (bestLoaded) idbStorage.setItem(COINS_KEY, String(next));
      return next;
    });
  }, [bestLoaded]);

  const unlockTheme = useCallback((id: ThemeID) => {
    const theme = THEMES[id];
    if (coins >= theme.cost && !unlockedThemes.includes(id)) {
      setCoins(prev => {
        const next = prev - theme.cost;
        if (bestLoaded) idbStorage.setItem(COINS_KEY, String(next));
        return next;
      });
      setUnlockedThemes(prev => {
        const next = [...prev, id];
        if (bestLoaded) idbStorage.setItem(UNLOCKED_THEMES_KEY, JSON.stringify(next));
        return next;
      });
      setActiveTheme(id);
      if (bestLoaded) idbStorage.setItem(ACTIVE_THEME_KEY, id);
    }
  }, [coins, unlockedThemes, bestLoaded]);

  const selectTheme = useCallback((id: ThemeID) => {
    if (unlockedThemes.includes(id)) {
      setActiveTheme(id);
      if (bestLoaded) idbStorage.setItem(ACTIVE_THEME_KEY, id);
    }
  }, [unlockedThemes, bestLoaded]);

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

  const generateFood = useCallback((currentSnake: Position[]): Position & { type: "normal" | "golden", spawnTime: number } => {
    let newFood: Position;
    let isOnSnake = true;
    while (isOnSnake) {
      newFood = {
        x: Math.floor(Math.random() * CELL_COUNT),
        y: Math.floor(Math.random() * CELL_COUNT),
      };
      isOnSnake = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
    }
    const isGolden = Math.random() < 0.15; // 15% chance
    return { ...newFood!, type: isGolden ? "golden" : "normal", spawnTime: Date.now() };
  }, []);

  const generatePowerUp = useCallback((currentSnake: Position[], currentFood: Position): PowerUp | null => {
    if (Math.random() > 0.15) return null; // 15% chance to spawn when eaten
    const types: PowerUpType[] = ["speed", "shrink", "invincible", "magnet", "fire", "ice"];
    const type = types[Math.floor(Math.random() * types.length)];
    if (!type) return null;
    let newPos: Position;
    let isInvalid = true;
    while (isInvalid) {
      newPos = { x: Math.floor(Math.random() * CELL_COUNT), y: Math.floor(Math.random() * CELL_COUNT) };
      isInvalid = (newPos.x === currentFood.x && newPos.y === currentFood.y) || currentSnake.some(s => s.x === newPos.x && s.y === newPos.y);
    }
    return { ...newPos!, type };
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
    directionRef.current = "UP";
    inputQueueRef.current = [];
    setFood(generateFood(initialSnake));
    setScore(0);
    setActivePowerUp(null);
    setBoardPowerUp(null);
    if (Math.random() > 0.4) {
      setPortals({
        in: { x: Math.floor(Math.random() * (CELL_COUNT - 4)) + 2, y: Math.floor(Math.random() * (CELL_COUNT - 4)) + 2 },
        out: { x: Math.floor(Math.random() * (CELL_COUNT - 4)) + 2, y: Math.floor(Math.random() * (CELL_COUNT - 4)) + 2 }
      });
    } else {
      setPortals(null);
    }
    if (bossMode) {
      bossSnakeRef.current = [
        { x: CELL_COUNT - 2, y: CELL_COUNT - 2 },
        { x: CELL_COUNT - 2, y: CELL_COUNT - 1 },
      ];
      bossTickRef.current = false;
    } else {
      bossSnakeRef.current = [];
    }
    setGameState("PLAYING");
  }, [generateFood, bossMode]);

  const togglePause = useCallback(() => {
    setGameState(prev => {
      if (prev === "PLAYING") return "PAUSED";
      if (prev === "PAUSED") return "PLAYING";
      return prev;
    });
  }, []);

  // Direction handlers
  const changeDirection = useCallback((newDir: Direction) => {
    const lastInput = inputQueueRef.current.length > 0 
      ? inputQueueRef.current[inputQueueRef.current.length - 1] 
      : directionRef.current;

    if (newDir === lastInput) return;
    if (inputQueueRef.current.length >= 2) return;

    if (newDir === "UP" && lastInput !== "DOWN") inputQueueRef.current.push("UP");
    else if (newDir === "DOWN" && lastInput !== "UP") inputQueueRef.current.push("DOWN");
    else if (newDir === "LEFT" && lastInput !== "RIGHT") inputQueueRef.current.push("LEFT");
    else if (newDir === "RIGHT" && lastInput !== "LEFT") inputQueueRef.current.push("RIGHT");
  }, []);

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
      // MUST NOT mutate refs inside setSnake (React StrictMode double-invokes state updaters)
      const currentDir = inputQueueRef.current.length > 0 ? inputQueueRef.current.shift()! : directionRef.current;
      directionRef.current = currentDir;
      setDirection(currentDir);

      setSnake(prevSnake => {
        const head = { ...prevSnake[0]! };

        switch (currentDir) {
          case "UP": head.y -= 1; break;
          case "DOWN": head.y += 1; break;
          case "LEFT": head.x -= 1; break;
          case "RIGHT": head.x += 1; break;
        }
        
        const isInvincible = activePowerUp?.type === "invincible";
        const isFire = activePowerUp?.type === "fire";
        const isIce = activePowerUp?.type === "ice";
        
        // Magnet effect
        if (activePowerUp?.type === "magnet") {
           const fdx = head.x - food.x;
           const fdy = head.y - food.y;
           if (Math.abs(fdx) <= 3 && Math.abs(fdy) <= 3) {
               setFood(prev => ({ ...prev, x: prev.x + (fdx === 0 ? 0 : Math.sign(fdx)), y: prev.y + (fdy === 0 ? 0 : Math.sign(fdy)) }));
           }
        }
        
        // Portals (Gravity Zones)
        if (portals) {
            if (head.x === portals.in.x && head.y === portals.in.y) {
               head.x = portals.out.x;
               head.y = portals.out.y;
               triggerHaptic('golden');
            } else if (head.x === portals.out.x && head.y === portals.out.y) {
               head.x = portals.in.x;
               head.y = portals.in.y;
               triggerHaptic('golden');
            }
        }

        // Wall collision
        if (head.x < 0 || head.x >= CELL_COUNT || head.y < 0 || head.y >= CELL_COUNT) {
          if (wrapAround) {
            if (head.x < 0) head.x = CELL_COUNT - 1;
            if (head.x >= CELL_COUNT) head.x = 0;
            if (head.y < 0) head.y = CELL_COUNT - 1;
            if (head.y >= CELL_COUNT) head.y = 0;
          } else if (!isInvincible) {
            triggerHaptic('death');
            setGameState("GAMEOVER");
            updateBest(score);
            return prevSnake;
          } else {
            if (head.x < 0) head.x = CELL_COUNT - 1;
            if (head.x >= CELL_COUNT) head.x = 0;
            if (head.y < 0) head.y = CELL_COUNT - 1;
            if (head.y >= CELL_COUNT) head.y = 0;
          }
        }

        // Self collision
        // The tail moves forward, so moving into the old tail's position is safe unless eating
        const willEat = head.x === food.x && head.y === food.y;
        const bodyToCheck = willEat ? prevSnake : prevSnake.slice(0, -1);
        
        if (!isInvincible && checkSelfCollision(head, bodyToCheck)) {
          triggerHaptic('death');
          setGameState("GAMEOVER");
          updateBest(score);
          return prevSnake;
        }

        // --- Boss Logic Start ---
        const bossSnake = bossSnakeRef.current;
        let playerHitBoss = false;
        let bossKilled = false;

        if (bossMode && bossSnake.length > 0) {
          if (isIce) {
             // Boss is frozen, skip movement!
          } else {
             bossTickRef.current = !bossTickRef.current;
             if (bossTickRef.current) {
               const headOfBoss = bossSnake[0];
               if (headOfBoss) {
                 const bossHead = { x: headOfBoss.x, y: headOfBoss.y };
                 
                 // Refined hunting logic: A* or direct chase with obstacle avoidance
                 const dx = head.x - bossHead.x;
                 const dy = head.y - bossHead.y;
                 
                 if (Math.abs(dx) > Math.abs(dy)) {
                    bossHead.x += dx > 0 ? 1 : -1;
                 } else if (dy !== 0) {
                    bossHead.y += dy > 0 ? 1 : -1;
                 }
                 
                 bossHead.x = Math.max(0, Math.min(CELL_COUNT - 1, bossHead.x));
                 bossHead.y = Math.max(0, Math.min(CELL_COUNT - 1, bossHead.y));

                 bossSnake.unshift(bossHead);
                 
                 if (bossSnake.length > 3 + Math.floor(score / 15)) {
                   bossSnake.pop();
                 }
               }
             }
          }
          
          if (bossSnake.some(b => b.x === head.x && b.y === head.y)) playerHitBoss = true;
          
          const bh = bossSnake[0];
          if (bh && prevSnake.some(s => s.x === bh.x && s.y === bh.y)) playerHitBoss = true;

          // If fire is active, touching the boss burns it and we get bonus points!
          if (playerHitBoss && isFire) {
             playerHitBoss = false;
             bossKilled = true;
             // Respawn boss elsewhere
             bossSnakeRef.current = [
               { x: Math.floor(Math.random() * CELL_COUNT), y: Math.floor(Math.random() * CELL_COUNT) }
             ];
             const floatId = Date.now();
             setFloatingScores(prev => [...prev, { id: floatId, x: bossSnake[0]!.x, y: bossSnake[0]!.y, val: 50 }]);
             setScore(s => { const next = s + 50; updateBest(next); return next; });
             addCoins(50);
             triggerHaptic('golden');
          }
        }
        
        if (playerHitBoss && !isInvincible && !isFire) {
          triggerHaptic('death');
          setGameState("GAMEOVER");
          updateBest(score);
          return prevSnake;
        }
        // --- Boss Logic End ---

        const newSnake = [head, ...prevSnake];

        const foodAge = Date.now() - food.spawnTime;
        const isHazardous = foodAge > 12000 && food.type === "normal"; // Normal apples go bad after 12s
        
        if (foodAge > 18000 && food.type === "normal") {
           // Despawn rotten food
           setFood(generateFood(prevSnake));
        }

        // Food collision
        if (head.x === food.x && head.y === food.y) {
          if (isHazardous && !isInvincible) {
            triggerHaptic('death');
            setGameState("GAMEOVER");
            updateBest(score);
            return prevSnake;
          }

          triggerHaptic(food.type === 'golden' ? 'golden' : 'eat');
          const ageBonus = isHazardous ? 0 : Math.floor(foodAge / 3000); // Up to +4 bonus for aging
          const points = (food.type === "golden" ? 3 : 1) + ageBonus;
          const floatId = Date.now();
          setFloatingScores(prev => [...prev, { id: floatId, x: food.x, y: food.y, val: points }]);
          setTimeout(() => setFloatingScores(prev => prev.filter(f => f.id !== floatId)), 800);

          setScore(s => {
            const nextScore = s + points;
            updateBest(nextScore);
            return nextScore;
          });
          addCoins(points);
          
          if (food.type === "golden") {
             // Add 2 extra segments at the tail
             const tail = newSnake[newSnake.length - 1];
             if (tail) {
               newSnake.push({ ...tail });
               newSnake.push({ ...tail });
             }
          }

          setFood(generateFood(newSnake));
          if (!boardPowerUp) setBoardPowerUp(generatePowerUp(newSnake, food));
        } else {
          newSnake.pop(); // remove tail
        }
        
        // Power-up collision
        if (boardPowerUp && head.x === boardPowerUp.x && head.y === boardPowerUp.y) {
           triggerHaptic('golden');
           setActivePowerUp({ type: boardPowerUp.type, expiresAt: Date.now() + 10000 }); // 10s
           setBoardPowerUp(null);
           if (boardPowerUp.type === "shrink") {
               if (newSnake.length > 5) newSnake.splice(5);
           }
        }

        return newSnake;
      });
    };

    let currentSpeed = SPEED_VALS[speedMode];
    if (activePowerUp?.type === "speed") {
      currentSpeed = currentSpeed * 0.55;
    }

    gameIntervalRef.current = setInterval(moveSnake, currentSpeed);
    return () => {
      if (gameIntervalRef.current) clearInterval(gameIntervalRef.current);
    };
  }, [gameState, food, speedMode, score, generateFood, updateBest, wrapAround, addCoins, activePowerUp, boardPowerUp, generatePowerUp, portals]);

  // Clear expired power-up
  useEffect(() => {
    if (!activePowerUp) return;
    const remaining = activePowerUp.expiresAt - Date.now();
    if (remaining <= 0) {
      setActivePowerUp(null);
      return;
    }
    const timer = setTimeout(() => {
      setActivePowerUp(null);
    }, remaining);
    return () => clearTimeout(timer);
  }, [activePowerUp]);

  // Canvas rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const theme = THEMES[activeTheme];

    // Clear board
    ctx.fillStyle = theme.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Grid Lines (subtle)
    ctx.strokeStyle = theme.grid;
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
    
    const foodAge = Date.now() - food.spawnTime;
    const isHazardous = foodAge > 12000 && food.type === "normal";

    if (food.type === "golden") {
      ctx.shadowColor = theme.glow;
      ctx.shadowBlur = 12;
      ctx.fillText(theme.golden, foodX, foodY);
      ctx.shadowBlur = 0;
    } else {
      if (isHazardous) {
        ctx.shadowColor = "#EF4444";
        ctx.shadowBlur = 10;
        ctx.fillText("☠️", foodX, foodY);
        ctx.shadowBlur = 0;
      } else {
        ctx.fillText(theme.apple, foodX, foodY);
        // Draw age indicator
        if (foodAge > 3000) {
            ctx.beginPath();
            ctx.arc(foodX, foodY, GRID_SIZE / 2, -Math.PI / 2, -Math.PI / 2 + (foodAge / 12000) * Math.PI * 2);
            ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
            ctx.lineWidth = 2;
            ctx.stroke();
        }
      }
    }
    
    if (portals) {
       ctx.font = `${GRID_SIZE - 2}px sans-serif`;
       ctx.shadowColor = "#3B82F6";
       ctx.shadowBlur = 15;
       ctx.fillText("🌀", portals.in.x * GRID_SIZE + GRID_SIZE/2, portals.in.y * GRID_SIZE + GRID_SIZE/2);
       ctx.shadowColor = "#F97316";
       ctx.fillText("🌀", portals.out.x * GRID_SIZE + GRID_SIZE/2, portals.out.y * GRID_SIZE + GRID_SIZE/2);
       ctx.shadowBlur = 0;
    }
    
    // Draw Power-up
    if (boardPowerUp) {
      const pX = boardPowerUp.x * GRID_SIZE + GRID_SIZE / 2;
      const pY = boardPowerUp.y * GRID_SIZE + GRID_SIZE / 2;
      let icon = "⚡";
      if (boardPowerUp.type === "shrink") icon = "📉";
      if (boardPowerUp.type === "invincible") icon = "🛡️";
      if (boardPowerUp.type === "magnet") icon = "🧲";
      if (boardPowerUp.type === "fire") icon = "🔥";
      if (boardPowerUp.type === "ice") icon = "❄️";
      
      ctx.shadowColor = "#FFFFFF";
      ctx.shadowBlur = 8;
      ctx.fillText(icon, pX, pY);
      ctx.shadowBlur = 0;
    }

    // Draw Snake
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      const x = segment.x * GRID_SIZE;
      const y = segment.y * GRID_SIZE;

      let fill = isHead ? theme.head : theme.body;
      if (activePowerUp?.type === "invincible") fill = index % 2 === 0 ? "#FFD700" : "#FFFFFF";
      else if (activePowerUp?.type === "fire") fill = index % 2 === 0 ? "#EF4444" : "#F97316"; // Red/Orange
      else if (activePowerUp?.type === "ice") fill = index % 2 === 0 ? "#38BDF8" : "#BAE6FD"; // Blue/Light Blue
      
      ctx.fillStyle = fill;

      // Rounded rectangles for segments
      const radius = isHead ? 6 : (activePowerUp?.type === 'fire' ? 2 : 4);
      
      if (activePowerUp?.type === 'fire' || activePowerUp?.type === 'ice') {
         ctx.shadowColor = fill;
         ctx.shadowBlur = 8;
      }
      
      ctx.beginPath();
      ctx.roundRect(x + 1, y + 1, GRID_SIZE - 2, GRID_SIZE - 2, radius);
      ctx.fill();
      ctx.shadowBlur = 0;

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

    // Draw Boss
    if (bossMode) {
      bossSnakeRef.current.forEach((segment, index) => {
        const isHead = index === 0;
        ctx.fillStyle = activePowerUp?.type === 'ice' ? "#7DD3FC" : (isHead ? "#EF4444" : "#F87171"); // Frozen or Red
        if (activePowerUp?.type === 'ice') {
           ctx.shadowColor = "#38BDF8";
           ctx.shadowBlur = 10;
        }
        ctx.beginPath();
        ctx.roundRect(segment.x * GRID_SIZE + 1, segment.y * GRID_SIZE + 1, GRID_SIZE - 2, GRID_SIZE - 2, isHead ? 6 : 4);
        ctx.fill();
        ctx.shadowBlur = 0;
        
        if (isHead) {
          ctx.font = `${GRID_SIZE - 4}px sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("💀", segment.x * GRID_SIZE + GRID_SIZE / 2, segment.y * GRID_SIZE + GRID_SIZE / 2);
        }
      });
    }
  }, [snake, food, direction, activeTheme, bossMode, portals, boardPowerUp, activePowerUp]);

  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <div className="rounded-xl bg-surface border border-border px-4 py-2 text-center min-w-[70px]">
            <div className="text-[10px] font-bold text-text-4 uppercase tracking-widest">Score</div>
            <div className="text-xl font-black text-text">{score}</div>
          </div>
          <div className="rounded-xl bg-surface border border-border px-4 py-2 text-center min-w-[70px] hidden sm:block">
            <div className="text-[10px] font-bold text-text-4 uppercase tracking-widest">Best</div>
            <div className="text-xl font-black text-text-3">{best}</div>
          </div>
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
              <Play className="w-4 h-4" /> Start
            </m.button>
          )}
        </div>

        <div className="flex gap-2">
          {activePowerUp && (
            <div className={`rounded-xl px-4 py-2 text-center min-w-[70px] flex items-center justify-center animate-pulse border ${
               activePowerUp.type === 'fire' ? 'bg-rose-500/20 border-rose-500/50' : 
               activePowerUp.type === 'ice' ? 'bg-sky-500/20 border-sky-500/50' : 
               'bg-primary/20 border-primary/50'
            }`} title="Power-up Active!">
              <span className="text-xl">
                {activePowerUp.type === "speed" ? "⚡" : activePowerUp.type === "shrink" ? "📉" : activePowerUp.type === "invincible" ? "🛡️" : activePowerUp.type === "magnet" ? "🧲" : activePowerUp.type === "fire" ? "🔥" : "❄️"}
              </span>
            </div>
          )}
          <div className="rounded-xl bg-surface border border-border px-4 py-2 text-center min-w-[70px]">
            <div className="text-[10px] font-bold text-text-4 uppercase tracking-widest">Length</div>
            <div className="text-xl font-black text-text">{snake.length}</div>
          </div>
        </div>
      </div>

      {/* ── Settings Row ── */}
      <div className="flex flex-wrap gap-3 justify-center items-center">
        {/* Wrap Around Toggle */}
        <m.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={gameState === "PLAYING" || gameState === "PAUSED"}
          onClick={() => setWrapAround(!wrapAround)}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50 ${
            wrapAround
              ? "bg-blue/20 text-blue border border-blue/30"
              : "bg-surface border border-border text-text-4 hover:text-text-2 hover:border-blue/50"
          }`}
          title={wrapAround ? "Walls Wrap Around" : "Walls are Solid"}
        >
          <RefreshCw className="w-3 h-3" />
          Wrap Walls
        </m.button>

        <div className="w-px h-6 bg-border mx-1 hidden sm:block"></div>

        {/* Shop Button */}
        <m.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowShop(true)}
          disabled={gameState === "PLAYING"}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-surface border border-border text-amber-500 hover:border-amber-500/50 transition-all focus-visible:outline-none disabled:opacity-50"
        >
          <span>🟡</span> {coins}
        </m.button>

        <div className="w-px h-6 bg-border mx-1 hidden sm:block"></div>

        {/* Boss Mode Toggle */}
        <m.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={gameState === "PLAYING" || gameState === "PAUSED"}
          onClick={() => setBossMode(!bossMode)}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50 ${
            bossMode
              ? "bg-rose-500/20 text-rose-500 border border-rose-500/30"
              : "bg-surface border border-border text-text-4 hover:text-text-2 hover:border-rose-500/50"
          }`}
          title={bossMode ? "Boss Mode Enabled" : "Enable Boss Mode"}
        >
          <span>💀</span>
          Boss Mode
        </m.button>

        <div className="w-px h-6 bg-border mx-1 hidden sm:block"></div>

        {/* Speed Selector */}
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
      <m.div
        animate={gameState === "GAMEOVER" ? { x: [-8, 8, -8, 8, -4, 4, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="relative rounded-2xl bg-surface border border-border overflow-hidden select-none touch-none aspect-square flex items-center justify-center shadow-lg"
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

          {showShop && (
            <m.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0 bg-surface/95 backdrop-blur-sm flex flex-col items-center justify-center p-4 z-20"
            >
              <div className="w-full max-w-sm bg-bg border border-border rounded-2xl p-5 shadow-xl flex flex-col gap-4 max-h-full overflow-y-auto">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-text">Themes</h3>
                  <div className="flex items-center gap-1 text-amber-500 font-bold bg-amber-500/10 px-3 py-1 rounded-full text-sm">
                    <span>🟡</span> {coins}
                  </div>
                </div>
                
                <div className="grid gap-3">
                  {(Object.keys(THEMES) as ThemeID[]).map(id => {
                    const theme = THEMES[id];
                    const isUnlocked = unlockedThemes.includes(id);
                    const isActive = activeTheme === id;
                    
                    return (
                      <div key={id} className={`flex items-center justify-between p-3 rounded-xl border ${isActive ? 'border-primary bg-primary/5' : 'border-border bg-surface'}`}>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg border border-border/50 shadow-inner flex items-center justify-center text-sm" style={{ backgroundColor: theme.bg, color: theme.head }}>
                            {theme.apple}
                          </div>
                          <div>
                            <div className="font-bold text-sm text-text">{theme.name}</div>
                            {!isUnlocked && <div className="text-xs text-amber-500 font-semibold">{theme.cost} Coins</div>}
                          </div>
                        </div>
                        
                        {isActive ? (
                          <span className="text-xs font-bold text-primary px-2 py-1 bg-primary/10 rounded-md uppercase tracking-wider">Active</span>
                        ) : isUnlocked ? (
                          <button onClick={() => selectTheme(id)} className="text-xs font-bold text-text-3 hover:text-text px-3 py-1.5 bg-border/50 hover:bg-border rounded-lg transition-colors">Use</button>
                        ) : (
                          <button 
                            disabled={coins < theme.cost}
                            onClick={() => unlockTheme(id)} 
                            className="text-xs font-bold text-white px-3 py-1.5 bg-amber-500 hover:bg-amber-600 disabled:bg-surface-2 disabled:text-text-4 rounded-lg transition-colors"
                          >
                            Unlock
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
                
                <button 
                  onClick={() => setShowShop(false)}
                  className="mt-2 w-full py-2.5 bg-surface-2 hover:bg-border text-text-2 font-bold rounded-xl transition-colors text-sm"
                >
                  Close
                </button>
              </div>
            </m.div>
          )}
        </AnimatePresence>

        {/* Floating Scores */}
        <AnimatePresence>
          {floatingScores.map((fs) => (
            <m.div
              key={fs.id}
              initial={{ opacity: 1, y: 0, scale: 0.5 }}
              animate={{ opacity: 0, y: -40, scale: 1.2 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute font-black text-2xl drop-shadow-md pointer-events-none"
              style={{
                left: `calc(${(fs.x / CELL_COUNT) * 100}% + ${50 / CELL_COUNT}%)`,
                top: `calc(${(fs.y / CELL_COUNT) * 100}% + ${50 / CELL_COUNT}%)`,
                transform: 'translate(-50%, -50%)',
                color: fs.val > 1 ? "#F59E0B" : "#10B981", // Amber for golden, Green for normal
              }}
            >
              +{fs.val}
            </m.div>
          ))}
        </AnimatePresence>
      </m.div>

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
