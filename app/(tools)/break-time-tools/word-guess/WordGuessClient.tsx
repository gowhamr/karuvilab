"use client";

import React, { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { m, AnimatePresence } from "framer-motion";
import { RotateCcw, Trophy, Sparkles, HelpCircle, Delete, CornerDownLeft } from "lucide-react";
import { idbStorage } from "@/src/store/idb-storage";
import { logger } from "@/src/lib/logger";

// ─── Word Lists ──────────────────────────────────────────────────────────────

const WORD_BANK = [
  "ABOUT", "ABOVE", "ADMIT", "ADOPT", "ADULT", "AFTER", "AGAIN", "AGENT", "AGREE", "AHEAD",
  "ALARM", "ALBUM", "ALERT", "ALIEN", "ALIGN", "ALIVE", "ALLOW", "ALONE", "ALONG", "ALTER",
  "AMONG", "ANGER", "ANGLE", "ANGRY", "APART", "APPLE", "APPLY", "ARENA", "ARGUE", "ARISE",
  "ARRAY", "ARROW", "ASSET", "AUDIO", "AWAKE", "BASIC", "BEACH", "BEGIN", "BELOW", "BIRTH",
  "BLACK", "BLADE", "BLAME", "BLIND", "BLOCK", "BLOOD", "BOARD", "BOOST", "BRAIN", "BRAND",
  "BREAD", "BREAK", "BRICK", "BRIDE", "BRIEF", "BRING", "BROAD", "BROWN", "BRUSH", "BUILD",
  "CABLE", "CAMERA", "CANDY", "CARRY", "CARVE", "CATCH", "CAUSE", "CHAIN", "CHAIR", "CHART",
  "CHASE", "CHEAP", "CHEST", "CHIEF", "CHILD", "CIVIL", "CLAIM", "CLASS", "CLEAN", "CLEAR",
  "CLIMB", "CLOCK", "CLOSE", "CLOUD", "COACH", "COAST", "COUNT", "COURT", "COVER", "CRAFT",
  "CRASH", "CREAM", "CRIME", "CROSS", "CROWD", "CROWN", "CRUDE", "CYCLE", "DAILY", "DANCE",
  "DEATH", "DELAY", "DEPTH", "DIRTY", "DOUBT", "DRAFT", "DRAMA", "DREAM", "DRESS", "DRIFT",
  "DRIVE", "EARLY", "EARTH", "ELITE", "EMPTY", "ENEMY", "ENJOY", "ENTER", "ENTRY", "EQUAL",
  "EVENT", "EVERY", "EXTRA", "FAITH", "FALSE", "FANCY", "FAULT", "FIBER", "FIELD", "FIFTH",
  "FIGHT", "FINAL", "FIRST", "FLAME", "FLASH", "FLEET", "FLUID", "FOCUS", "FORCE", "FRAME",
  "FRESH", "FRONT", "FRUIT", "GIANT", "GLASS", "GLOBE", "GLOVE", "GRACE", "GRADE", "GRAND",
  "GRANT", "GRASS", "GRAVE", "GREAT", "GREEN", "GREET", "GROUP", "GROWTH", "GUARD", "GUEST",
  "GUIDE", "HABIT", "HAPPY", "HARSH", "HEART", "HEAVY", "HELLO", "HONOR", "HOTEL", "HOUSE",
  "IMAGE", "INDEX", "INNER", "INPUT", "IRONI", "ISSUE", "JOINT", "JUDGE", "JUICE", "KNOCK",
  "LABEL", "LABOR", "LEVEL", "LIGHT", "LIMIT", "LOCAL", "LOGIC", "LUCKY", "LUNCH", "MAGIC",
  "MAJOR", "MARCH", "MATCH", "METAL", "MODEL", "MONEY", "MONTH", "MOTOR", "MOUNT", "MOUSE",
  "MOUTH", "MUSIC", "NEVER", "NIGHT", "NOISE", "NORTH", "NOVEL", "NURSE", "OFFER", "ORDER",
  "OTHER", "OWNER", "PANEL", "PAPER", "PARTY", "PEACE", "PHASE", "PHONE", "PHOTO", "PIANO",
  "PIECE", "PILOT", "PITCH", "PLACE", "PLAIN", "PLANE", "PLANT", "PLATE", "POINT", "POUND",
  "POWER", "PRESS", "PRICE", "PRIDE", "PRIME", "PRIZE", "PROUD", "PROVE", "QUEEN", "QUICK",
  "QUIET", "QUITE", "RADIO", "RAISE", "RANGE", "RATIO", "REACH", "REACT", "READY", "REFER",
  "RELAX", "REPLY", "ROUTE", "ROYAL", "RULER", "RURAL", "SCALE", "SCENE", "SCOPE", "SCORE",
  "SENSE", "SERVE", "SHADE", "SHAFT", "SHAKE", "SHARE", "SHARP", "SHEET", "SHELF", "SHIFT",
  "SHINE", "SHIRT", "SHOCK", "SHOOT", "SHORT", "SIGHT", "SINCE", "SKILL", "SLEEP", "SLIDE",
  "SMALL", "SMART", "SMILE", "SMOKE", "SOLID", "SOLVE", "SOUND", "SOUTH", "SPACE", "SPARE",
  "SPEAK", "SPEED", "SPEND", "SPICE", "SPIRE", "SPLIT", "SPORT", "STAFF", "STAGE", "STAIR",
  "STAMP", "STAND", "STARE", "START", "STATE", "STEAM", "STEEL", "STEEP", "STEER", "STICK",
  "STILL", "STONE", "STORE", "STORM", "STORY", "STRIP", "STUDY", "STYLE", "SUGAR", "SUITE",
  "SUPER", "SWEET", "SWEPT", "SWIFT", "SWING", "TABLE", "TASTE", "THEME", "THERE", "THICK",
  "THING", "THINK", "THIRD", "THREE", "THROW", "TIGHT", "TITLE", "TODAY", "TOKEN", "TOTAL",
  "TOUCH", "TOUGH", "TOWER", "TRACK", "TRADE", "TRAIL", "TRAIN", "TREAT", "TREND", "TRIAL",
  "TRIBE", "TRICK", "TRIPY", "TRUCK", "TRUTH", "TUMOR", "TWICE", "UNDER", "UNION", "UNITY",
  "UNTIL", "UPPER", "UPSET", "URBAN", "USAGE", "VAGUE", "VALID", "VALUE", "VAPOR", "VAULT",
  "VENUE", "VIRUS", "VISIT", "VITAL", "VOICE", "WASTE", "WATCH", "WATER", "WHEEL", "WHERE",
  "WHICH", "WHILE", "WHITE", "WHOLE", "WOMAN", "WORLD", "WORRY", "WORTH", "WRITE", "WRONG",
  "YIELD", "YOUTH"
];

const STATS_KEY = "karuvi.breaktime.wordguess.stats";

interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  guesses: number[]; // size 6 array mapping win distribution
}

const DEFAULT_STATS: GameStats = {
  gamesPlayed: 0,
  gamesWon: 0,
  currentStreak: 0,
  maxStreak: 0,
  guesses: [0, 0, 0, 0, 0, 0],
};

const KEYBOARD_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "DELETE"]
];

const SPRING_CONFIG = { type: "spring" as const, stiffness: 300, damping: 30 };

// ─── Component ────────────────────────────────────────────────────────────────

export default function WordGuessClient() {
  const [targetWord, setTargetWord] = useState("");
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [gameState, setGameState] = useState<"playing" | "won" | "lost">("playing");
  const [invalidWordShake, setInvalidWordShake] = useState(false);

  // Stats
  const [stats, setStats] = useState<GameStats>(DEFAULT_STATS);
  const [statsLoaded, setStatsLoaded] = useState(false);

  // Load stats
  useEffect(() => {
    idbStorage.getItem(STATS_KEY).then((raw) => {
      if (raw) {
        try {
          setStats(JSON.parse(raw));
        } catch {
          logger.warn("[WordGuess] Failed to parse persisted stats");
        }
      }
      setStatsLoaded(true);
    }).catch((e) => {
      logger.error("[WordGuess] Failed to load stats", { error: e });
      setStatsLoaded(true);
    });
  }, []);

  const saveStats = useCallback((updatedStats: GameStats) => {
    setStats(updatedStats);
    if (statsLoaded) {
      idbStorage.setItem(STATS_KEY, JSON.stringify(updatedStats)).catch(e =>
        logger.error("[WordGuess] Failed to save stats", { error: e })
      );
    }
  }, [statsLoaded]);

  // Start new game
  const initGame = useCallback(() => {
    const randomWord = WORD_BANK[Math.floor(Math.random() * WORD_BANK.length)]!;
    setTargetWord(randomWord);
    setGuesses([]);
    setCurrentGuess("");
    setGameState("playing");
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  // Keyboard letter inputs
  const handleInput = useCallback((char: string) => {
    if (gameState !== "playing") return;

    if (char === "ENTER") {
      if (currentGuess.length < 5) {
        setInvalidWordShake(true);
        setTimeout(() => setInvalidWordShake(false), 500);
        return;
      }

      const guessUpper = currentGuess.toUpperCase();
      
      // Validation: Must be a word in our bank
      if (!WORD_BANK.includes(guessUpper)) {
        setInvalidWordShake(true);
        setTimeout(() => setInvalidWordShake(false), 500);
        return;
      }

      const nextGuesses = [...guesses, guessUpper];
      setGuesses(nextGuesses);
      setCurrentGuess("");

      if (guessUpper === targetWord) {
        setGameState("won");
        // Update win stats
        const guessIdx = nextGuesses.length - 1;
        const newStats = {
          gamesPlayed: stats.gamesPlayed + 1,
          gamesWon: stats.gamesWon + 1,
          currentStreak: stats.currentStreak + 1,
          maxStreak: Math.max(stats.maxStreak, stats.currentStreak + 1),
          guesses: stats.guesses.map((val, idx) => (idx === guessIdx ? val + 1 : val)),
        };
        saveStats(newStats);
      } else if (nextGuesses.length >= 6) {
        setGameState("lost");
        // Update lose stats
        const newStats = {
          ...stats,
          gamesPlayed: stats.gamesPlayed + 1,
          currentStreak: 0,
        };
        saveStats(newStats);
      }
    } else if (char === "DELETE" || char === "BACKSPACE") {
      setCurrentGuess(p => p.slice(0, -1));
    } else if (/^[a-zA-Z]$/.test(char)) {
      if (currentGuess.length < 5) {
        setCurrentGuess(p => p + char.toUpperCase());
      }
    }
  }, [currentGuess, guesses, gameState, targetWord, stats, saveStats]);

  // Physical key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        handleInput("ENTER");
      } else if (e.key === "Backspace") {
        handleInput("DELETE");
      } else {
        handleInput(e.key);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleInput]);

  // Compute used keyboard character colors
  const characterStates = useMemo(() => {
    const charMap = new Map<string, "correct" | "present" | "absent" | null>();

    guesses.forEach(guess => {
      for (let i = 0; i < 5; i++) {
        const char = guess[i]!;
        if (targetWord[i] === char) {
          charMap.set(char, "correct");
        } else if (targetWord.includes(char)) {
          // Keep "correct" if it was already marked correct
          if (charMap.get(char) !== "correct") {
            charMap.set(char, "present");
          }
        } else {
          charMap.set(char, "absent");
        }
      }
    });

    return charMap;
  }, [guesses, targetWord]);

  // Style evaluation helper
  const getTileClass = (char: string, pos: number, isSubmitted: boolean) => {
    if (!isSubmitted) return "bg-surface border-2 border-border text-text font-black text-2xl";
    if (targetWord[pos] === char) {
      return "bg-emerald-600 text-white font-black text-2xl border-emerald-700 shadow-md shadow-emerald-500/10";
    }
    if (targetWord.includes(char)) {
      return "bg-amber-500 text-white font-black text-2xl border-amber-600 shadow-md shadow-amber-500/10";
    }
    return "bg-surface-elevated/40 border border-border/40 text-text-4 text-2xl font-bold opacity-60";
  };

  const getKeyboardKeyClass = (key: string) => {
    const state = characterStates.get(key);
    const base = "flex-1 aspect-square sm:aspect-[2/3] max-h-12 flex items-center justify-center rounded-lg text-xs sm:text-sm font-bold uppercase transition-all select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";

    if (key === "ENTER" || key === "DELETE") {
      return `${base} bg-surface-elevated text-text-2 border border-border/60 hover:border-primary/50 cursor-pointer`;
    }

    if (state === "correct") {
      return `${base} bg-emerald-600 text-white border border-emerald-700 shadow-sm`;
    }
    if (state === "present") {
      return `${base} bg-amber-500 text-white border border-amber-600 shadow-sm`;
    }
    if (state === "absent") {
      return `${base} bg-surface-elevated/40 border border-border/20 text-text-4 opacity-50`;
    }
    return `${base} bg-surface border border-border text-text hover:border-primary/50 cursor-pointer`;
  };

  // Guess display rows (6 attempts total)
  const rows = Array.from({ length: 6 }, (_, i) => {
    const guess = guesses[i];
    const isCurrentRow = i === guesses.length;
    const isSubmitted = i < guesses.length;

    return (
      <div key={i} className="grid grid-cols-5 gap-2 max-w-[280px] mx-auto">
        {Array.from({ length: 5 }, (_, cellIdx) => {
          let char = "";
          if (isSubmitted && guess) {
            char = guess[cellIdx] || "";
          } else if (isCurrentRow) {
            char = currentGuess[cellIdx] || "";
          }

          const hasChar = char !== "";
          const tileClass = getTileClass(char, cellIdx, isSubmitted);

          return (
            <m.div
              key={cellIdx}
              animate={isCurrentRow && hasChar ? { scale: [1, 1.08, 1] } : {}}
              transition={{ duration: 0.15 }}
              className={`
                aspect-square rounded-xl flex items-center justify-center transition-all select-none
                ${tileClass}
              `}
            >
              {isSubmitted ? (
                <m.div
                  initial={{ rotateX: -90, opacity: 0 }}
                  animate={{ rotateX: 0, opacity: 1 }}
                  transition={{ delay: cellIdx * 0.1, duration: 0.3 }}
                >
                  {char}
                </m.div>
              ) : (
                char
              )}
            </m.div>
          );
        })}
      </div>
    );
  });

  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* ── Header Toolbar ── */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          {[{ label: "Streak", val: stats.currentStreak }, { label: "Max Streak", val: stats.maxStreak }].map(({ label, val }) => (
            <div key={label} className="rounded-xl bg-surface border border-border px-4 py-2 text-center min-w-[80px]">
              <div className="text-[10px] font-bold text-text-4 uppercase tracking-widest">{label}</div>
              <div className="text-lg font-black text-text">{val}</div>
            </div>
          ))}
        </div>
        <m.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={initGame}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <RotateCcw className="w-4 h-4" /> New Game
        </m.button>
      </div>

      {/* ── Letter Grid Row Area ── */}
      <m.div
        animate={invalidWordShake ? { x: [-10, 10, -8, 8, -5, 5, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="space-y-2 py-4"
      >
        {rows}
      </m.div>

      {/* ── Keyboard Keys Layout ── */}
      <div className="space-y-1.5 py-2">
        {KEYBOARD_ROWS.map((row, rowIdx) => (
          <div key={rowIdx} className="flex gap-1 justify-center max-w-full">
            {row.map((key) => {
              const isAction = key === "ENTER" || key === "DELETE";
              return (
                <m.button
                  key={key}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleInput(key)}
                  className={getKeyboardKeyClass(key)}
                  style={{ flex: isAction ? 1.5 : 1 }}
                  aria-label={key}
                >
                  {key === "DELETE" ? (
                    <Delete className="w-4 h-4" />
                  ) : key === "ENTER" ? (
                    <CornerDownLeft className="w-4 h-4" />
                  ) : (
                    key
                  )}
                </m.button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Game Over / Win celebration Overlay */}
      <AnimatePresence>
        {gameState !== "playing" && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-surface/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 z-modal"
          >
            <m.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="max-w-sm w-full bg-surface border border-border p-6 rounded-3xl text-center space-y-4 shadow-xl"
            >
              {gameState === "won" ? (
                <>
                  <Sparkles className="w-12 h-12 text-primary mx-auto animate-bounce" />
                  <h2 className="text-2xl font-black text-text">Word Guessed! 🎉</h2>
                  <p className="text-text-3 text-sm">
                    You found the word <strong>{targetWord}</strong> in <strong>{guesses.length}</strong> tries.
                  </p>
                </>
              ) : (
                <>
                  <Trophy className="w-12 h-12 text-danger mx-auto animate-pulse" />
                  <h2 className="text-2xl font-black text-text">Out of Guesses</h2>
                  <p className="text-text-3 text-sm">
                    The secret word was <strong className="text-primary text-lg block mt-1">{targetWord}</strong>
                  </p>
                </>
              )}

              {/* Stats Box */}
              <div className="border border-border/80 rounded-2xl p-4 bg-surface-elevated/20 grid grid-cols-3 gap-2 text-center text-sm font-medium">
                <div>
                  <span className="text-text-4 block text-xs">Played</span>
                  <span className="text-base font-black text-text">{stats.gamesPlayed}</span>
                </div>
                <div>
                  <span className="text-text-4 block text-xs">Win Rate</span>
                  <span className="text-base font-black text-text">
                    {stats.gamesPlayed > 0 ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) : 0}%
                  </span>
                </div>
                <div>
                  <span className="text-text-4 block text-xs">Streak</span>
                  <span className="text-base font-black text-text">{stats.currentStreak}</span>
                </div>
              </div>

              <div className="flex gap-3 justify-center">
                <m.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={initGame}
                  className="px-6 py-2.5 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  Play Again
                </m.button>
              </div>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
