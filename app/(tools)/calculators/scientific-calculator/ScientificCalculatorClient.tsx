"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { m, AnimatePresence } from "framer-motion";
import { workerOrchestrator } from "@/src/engine/workers/WorkerOrchestrator";
import { Trash2, History as HistoryIcon, X } from "lucide-react";

interface HistoryItem {
  expression: string;
  result: string;
  timestamp: number;
}

export default function ScientificCalculatorClient() {
  const [display, setDisplay] = useState("0");
  const [expression, setExpression] = useState("");
  const [mode, setMode] = useState<"deg" | "rad">("deg");
  const [ans, setAns] = useState<string>("0");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const append = useCallback((val: string) => {
    setDisplay((prev) => {
      if (prev === "0" && !isNaN(Number(val))) return val;
      if (prev === "Error") return val;
      return prev + val;
    });
  }, []);

  const clear = useCallback(() => {
    setDisplay("0");
    setExpression("");
  }, []);

  const backspace = useCallback(() => {
    setDisplay((prev) => {
      if (prev.length <= 1 || prev === "Error") return "0";
      // Handle multi-char functions like sin(, cos(, etc.
      if (prev.endsWith("sin(") || prev.endsWith("cos(") || prev.endsWith("tan(") || prev.endsWith("log(") || prev.endsWith("ln(")) {
        return prev.slice(0, -4) || "0";
      }
      if (prev.endsWith("asin(") || prev.endsWith("acos(") || prev.endsWith("atan(") || prev.endsWith("sqrt(") || prev.endsWith("cbrt(")) {
        return prev.slice(0, -5) || "0";
      }
      return prev.slice(0, -1);
    });
  }, []);

  const calculate = useCallback(async () => {
    if (display === "Error") return;
    try {
      let expr = display
        .replace(/π/g, "Math.PI")
        .replace(/e/g, "Math.E")
        .replace(/Ans/g, ans)
        .replace(/%/g, "/100")
        .replace(/\^/g, "**")
        .replace(/(\d+\.?\d*)!/g, "factorial($1)");

      // Inverse Trig (higher priority than basic trig)
      if (mode === "deg") {
        expr = expr
          .replace(/asin\(/g, "(180/Math.PI*Math.asin(")
          .replace(/acos\(/g, "(180/Math.PI*Math.acos(")
          .replace(/atan\(/g, "(180/Math.PI*Math.atan(");
      } else {
        expr = expr
          .replace(/asin\(/g, "Math.asin(")
          .replace(/acos\(/g, "Math.acos(")
          .replace(/atan\(/g, "Math.atan(");
      }

      // Basic Trig
      if (mode === "deg") {
        expr = expr
          .replace(/sin\(/g, "Math.sin(Math.PI/180*")
          .replace(/cos\(/g, "Math.cos(Math.PI/180*")
          .replace(/tan\(/g, "Math.tan(Math.PI/180*");
      } else {
        expr = expr
          .replace(/sin\(/g, "Math.sin(")
          .replace(/cos\(/g, "Math.cos(")
          .replace(/tan\(/g, "Math.tan(");
      }

      // Others
      expr = expr
        .replace(/log\(/g, "Math.log10(")
        .replace(/ln\(/g, "Math.log(")
        .replace(/sqrt\(/g, "Math.sqrt(")
        .replace(/cbrt\(/g, "Math.cbrt(");

      const result = await workerOrchestrator.run<number>("evaluateMath", [expr]);
      const formattedResult = String(Number(result.toFixed(10)));
      
      setHistory(prev => [{
        expression: display,
        result: formattedResult,
        timestamp: Date.now()
      }, ...prev].slice(0, 50));
      
      setAns(formattedResult);
      setExpression(display + " =");
      setDisplay(formattedResult);
    } catch (e) {
      setDisplay("Error");
    }
  }, [display, mode, ans]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") return;

      if (e.key >= "0" && e.key <= "9") append(e.key);
      else if (e.key === ".") append(".");
      else if (e.key === "+") append("+");
      else if (e.key === "-") append("-");
      else if (e.key === "*") append("*");
      else if (e.key === "/") append("/");
      else if (e.key === "(") append("(");
      else if (e.key === ")") append(")");
      else if (e.key === "^") append("^");
      else if (e.key === "!") append("!");
      else if (e.key === "%") append("%");
      else if (e.key === "Enter" || e.key === "=") {
        e.preventDefault();
        calculate();
      }
      else if (e.key === "Backspace") {
        e.preventDefault();
        backspace();
      }
      else if (e.key === "Escape") {
        e.preventDefault();
        clear();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [append, backspace, calculate, clear]);

  const sciButtons = [
    { label: "sin", action: () => append("sin(") },
    { label: "cos", action: () => append("cos(") },
    { label: "tan", action: () => append("tan(") },
    { label: "asin", action: () => append("asin(") },
    { label: "acos", action: () => append("acos(") },
    { label: "atan", action: () => append("atan(") },
    { label: "log", action: () => append("log(") },
    { label: "ln", action: () => append("ln(") },
    { label: "x^y", action: () => append("^") },
    { label: "sqrt", action: () => append("sqrt(") },
    { label: "cbrt", action: () => append("cbrt(") },
    { label: "x!", action: () => append("!") },
    { label: "π", action: () => append("π") },
    { label: "e", action: () => append("e") },
    { label: "Ans", action: () => append("Ans") },
    { label: "(", action: () => append("(") },
    { label: ")", action: () => append(")") },
    { label: mode.toUpperCase(), action: () => setMode(mode === "deg" ? "rad" : "deg"), className: "text-blue bg-blue/5" },
  ];

  const basicButtons = [
    { label: "7", action: () => append("7") },
    { label: "8", action: () => append("8") },
    { label: "9", action: () => append("9") },
    { label: "÷", action: () => append("/"), className: "text-blue bg-blue/5" },
    { label: "4", action: () => append("4") },
    { label: "5", action: () => append("5") },
    { label: "6", action: () => append("6") },
    { label: "×", action: () => append("*"), className: "text-blue bg-blue/5" },
    { label: "1", action: () => append("1") },
    { label: "2", action: () => append("2") },
    { label: "3", action: () => append("3") },
    { label: "−", action: () => append("-"), className: "text-blue bg-blue/5" },
    { label: "0", action: () => append("0") },
    { label: ".", action: () => append(".") },
    { label: "AC", action: clear, className: "text-error bg-error/5" },
    { label: "+", action: () => append("+"), className: "text-blue bg-blue/5" },
    { label: "DEL", action: backspace, className: "text-text-3" },
    { label: "%", action: () => append("%"), className: "text-text-3" },
    { label: "=", action: calculate, className: "col-span-2 bg-blue text-white hover:bg-blue/90 shadow-md shadow-blue/10" },
  ];

  return (
    <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-8 items-start">
      {/* Calculator Main */}
      <div className="flex-1 w-full space-y-6">
        {/* Display */}
        <div className="bg-surface border border-border rounded-4xl p-8 text-right space-y-2 shadow-sm relative overflow-hidden group">
           <div className="absolute top-4 left-6 opacity-0 group-hover:opacity-100 transition-opacity">
             <button 
               onClick={() => setShowHistory(!showHistory)}
               className="p-2 hover:bg-bg rounded-full transition-colors text-text-3"
               title="View History"
             >
               <HistoryIcon size={18} />
             </button>
           </div>
          <div className="text-sm font-bold text-text-4 uppercase tracking-widest h-5 flex justify-end items-center gap-2">
            <span className="truncate max-w-64">{expression}</span>
            <span className="bg-blue/10 text-blue px-2 py-0.5 rounded text-xs">{mode.toUpperCase()}</span>
          </div>
          <div 
            aria-live="polite"
            className="text-5xl font-black tracking-tighter text-text truncate leading-tight"
          >
            {display}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* Scientific Section */}
          <div className="md:col-span-2 grid grid-cols-3 gap-2 p-2 bg-bg/50 rounded-3xl border border-border/50">
            {sciButtons.map((btn, i) => (
              <m.button
                key={`sci-${i}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={btn.action}
                className={`p-3 text-xs font-bold rounded-xl border border-border bg-surface hover:border-blue/30 hover:bg-surface/80 transition-all ${btn.className || "text-text-2"}`}
              >
                {btn.label}
              </m.button>
            ))}
          </div>

          {/* Basic Section */}
          <div className="md:col-span-3 grid grid-cols-4 gap-2 p-2 bg-bg/50 rounded-3xl border border-border/50">
            {basicButtons.map((btn, i) => (
              <m.button
                key={`basic-${i}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={btn.action}
                className={`p-4 text-lg font-bold rounded-xl border border-border bg-surface hover:border-blue/30 hover:bg-surface/80 transition-all flex items-center justify-center ${btn.className || "text-text"}`}
              >
                {btn.label}
              </m.button>
            ))}
          </div>
        </div>
      </div>

      {/* History Panel (Desktop Sidebar / Overlay on Mobile) */}
      <AnimatePresence>
        {(showHistory || (typeof window !== 'undefined' && window.innerWidth >= 1024)) && (
          <m.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className={`w-full lg:w-80 bg-surface border border-border rounded-4xl overflow-hidden flex flex-col h-full lg:h-full shadow-xl lg:shadow-none ${!showHistory ? 'hidden lg:flex' : 'fixed inset-4 z-modal lg:relative lg:inset-0'}`}
          >
            <div className="p-6 border-b border-border flex justify-between items-center bg-bg/30">
              <div className="flex items-center gap-2 font-bold text-text">
                <HistoryIcon size={18} className="text-blue" />
                History
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setHistory([])}
                  className="p-2 hover:bg-error/10 hover:text-error rounded-full transition-colors text-text-4"
                  title="Clear History"
                >
                  <Trash2 size={16} />
                </button>
                <button 
                  onClick={() => setShowHistory(false)}
                  className="p-2 hover:bg-bg rounded-full transition-colors text-text-4 lg:hidden"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar" ref={scrollRef}>
              {history.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-text-4 space-y-2 opacity-50">
                  <HistoryIcon size={32} />
                  <p className="text-xs">No recent calculations</p>
                </div>
              ) : (
                history.map((item, i) => (
                  <m.button
                    key={item.timestamp}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => {
                      setDisplay(item.result);
                      setExpression(item.expression + " =");
                      if (window.innerWidth < 1024) setShowHistory(false);
                    }}
                    className="w-full text-right p-4 rounded-2xl border border-border hover:border-blue/30 hover:bg-bg/50 transition-all space-y-1 group"
                  >
                    <div className="text-xs text-text-4 font-mono truncate opacity-60 group-hover:opacity-100 transition-opacity">
                      {item.expression}
                    </div>
                    <div className="text-lg font-black text-text group-hover:text-blue transition-colors">
                      {item.result}
                    </div>
                  </m.button>
                ))
              )}
            </div>
          </m.div>
        )}
      </AnimatePresence>

      {/* Mobile History Toggle Overlay */}
      {showHistory && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-modal-backdrop lg:hidden" 
          onClick={() => setShowHistory(false)}
        />
      )}
    </div>
  );
}
