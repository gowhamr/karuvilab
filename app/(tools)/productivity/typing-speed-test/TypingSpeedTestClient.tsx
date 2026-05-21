"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { Timer, Trophy, Target, RefreshCw } from "lucide-react";
import { m } from "framer-motion";

const SAMPLE_TEXTS = [
  "The quick brown fox jumps over the lazy dog. This sentence contains every letter in the English alphabet.",
  "Programming is the art of telling another human what one wants the computer to do.",
  "In software development, debugging is twice as hard as writing the code in the first place.",
  "The best way to predict the future is to invent it. Innovation distinguishes between a leader and a follower."
];

export default function TypingSpeedTestClient() {
  const [textIndex, setTextIndex] = useState(0);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"idle" | "typing" | "finished">("idle");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const targetText = SAMPLE_TEXTS[textIndex]!;

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (status === "idle") {
      setStatus("typing");
      setStartTime(Date.now());
    }
    setInput(val);

    if (val === targetText) {
      setStatus("finished");
      setEndTime(Date.now());
    }
  };

  const reset = () => {
    setInput("");
    setStatus("idle");
    setStartTime(null);
    setEndTime(null);
    setTextIndex((textIndex + 1) % SAMPLE_TEXTS.length);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const stats = useMemo(() => {
    if (status === "idle") return { wpm: 0, accuracy: 0, time: 0 };
    
    const timeElapsed = (status === "finished" ? (endTime! - startTime!) : (Date.now() - startTime!)) / 1000 / 60; // in minutes
    
    let correctChars = 0;
    for (let i = 0; i < input.length; i++) {
      if (input[i] === targetText[i]) correctChars++;
    }

    const accuracy = input.length > 0 ? (correctChars / input.length) * 100 : 0;
    const wpm = timeElapsed > 0 ? (correctChars / 5) / timeElapsed : 0;

    return {
      wpm: Math.round(wpm),
      accuracy: Math.round(accuracy),
      time: Math.round(timeElapsed * 60)
    };
  }, [input, status, startTime, endTime, targetText]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === "typing") {
      interval = setInterval(() => {
        setInput(i => i); // Force re-render for timer
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status]);

  const renderText = () => {
    return targetText.split("").map((char, index) => {
      let color = "text-text-4";
      if (index < input.length) {
        color = input[index] === char ? "text-success" : "text-error bg-error/10";
      }
      return (
        <span key={index} className={`transition-colors ${color}`}>
          {char}
        </span>
      );
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="grid grid-cols-3 gap-4">
        <div className="p-6 bg-surface border border-border rounded-3xl flex flex-col items-center justify-center space-y-2">
          <Trophy className="w-6 h-6 text-blue" />
          <div className="text-3xl font-black">{stats.wpm}</div>
          <div className="text-[10px] font-bold text-text-4 uppercase tracking-widest">WPM</div>
        </div>
        <div className="p-6 bg-surface border border-border rounded-3xl flex flex-col items-center justify-center space-y-2">
          <Target className="w-6 h-6 text-blue" />
          <div className="text-3xl font-black">{stats.accuracy}%</div>
          <div className="text-[10px] font-bold text-text-4 uppercase tracking-widest">Accuracy</div>
        </div>
        <div className="p-6 bg-surface border border-border rounded-3xl flex flex-col items-center justify-center space-y-2">
          <Timer className="w-6 h-6 text-blue" />
          <div className="text-3xl font-black">{stats.time}s</div>
          <div className="text-[10px] font-bold text-text-4 uppercase tracking-widest">Time</div>
        </div>
      </div>

      <div className="p-8 bg-surface border border-border rounded-[32px] space-y-6 relative overflow-hidden">
        <div 
          className="text-2xl leading-relaxed font-medium font-mono"
          onClick={() => inputRef.current?.focus()}
        >
          {renderText()}
        </div>

        <textarea
          ref={inputRef}
          value={input}
          onChange={handleInput}
          disabled={status === "finished"}
          className="absolute inset-0 w-full h-full opacity-0 cursor-text resize-none"
          autoFocus
          spellCheck={false}
        />

        {status === "finished" && (
          <m.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-4 pt-6 border-t border-border"
          >
            <span className="text-xl font-bold text-success">Great job!</span>
            <button
              onClick={reset}
              className="flex items-center gap-2 px-6 py-3 bg-blue text-white rounded-xl font-bold hover:shadow-lg transition-all"
            >
              <RefreshCw className="w-4 h-4" /> Try Again
            </button>
          </m.div>
        )}
      </div>

      <div className="flex justify-between items-center px-4">
        <p className="text-sm text-text-4 font-medium">Click the text to start typing.</p>
        <button
          onClick={reset}
          className="flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-lg text-sm font-bold text-text-2 hover:border-blue transition-all"
        >
          <RefreshCw className="w-4 h-4" /> Reset
        </button>
      </div>
    </div>
  );
}
