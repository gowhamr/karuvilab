"use client";
import { useState, useEffect, useCallback } from "react";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";

const cat = CATEGORIES.find((c) => c.id === "calculators")!;

type Op = "+" | "-" | "*" | "/" | null;

function formatDisplay(val: string): string {
  if (val === "Error") return val;
  const num = parseFloat(val);
  if (isNaN(num)) return val;
  if (val.endsWith(".")) return val;
  if (Math.abs(num) > 1e15) return num.toExponential(6);
  return num.toLocaleString("en-IN", { maximumFractionDigits: 10 });
}

export default function StandardCalculatorClient() {
  const [current, setCurrent] = useState("0");
  const [previous, setPrevious] = useState<string | null>(null);
  const [operator, setOperator] = useState<Op>(null);
  const [waitNext, setWaitNext] = useState(false);

  const handleDigit = useCallback(
    (d: string) => {
      if (current === "Error") {
        setCurrent(d);
        return;
      }
      if (waitNext) {
        setCurrent(d);
        setWaitNext(false);
        return;
      }
      if (d === "." && current.includes(".")) return;
      setCurrent((c) => (c === "0" && d !== "." ? d : c + d));
    },
    [current, waitNext]
  );

  const handleOp = useCallback(
    (op: Op) => {
      if (current === "Error") return;
      if (previous !== null && operator && !waitNext) {
        const a = parseFloat(previous);
        const b = parseFloat(current);
        let res: number;
        if (operator === "+") res = a + b;
        else if (operator === "-") res = a - b;
        else if (operator === "*") res = a * b;
        else {
          if (b === 0) { setCurrent("Error"); setPrevious(null); setOperator(null); setWaitNext(true); return; }
          res = a / b;
        }
        const s = String(parseFloat(res.toFixed(10)));
        setCurrent(s);
        setPrevious(s);
      } else {
        setPrevious(current);
      }
      setOperator(op);
      setWaitNext(true);
    },
    [current, previous, operator, waitNext]
  );

  const handleEquals = useCallback(() => {
    if (current === "Error" || !operator || previous === null) return;
    const a = parseFloat(previous);
    const b = parseFloat(current);
    let res: number;
    if (operator === "+") res = a + b;
    else if (operator === "-") res = a - b;
    else if (operator === "*") res = a * b;
    else {
      if (b === 0) { setCurrent("Error"); setPrevious(null); setOperator(null); setWaitNext(true); return; }
      res = a / b;
    }
    const s = String(parseFloat(res.toFixed(10)));
    setCurrent(s);
    setPrevious(null);
    setOperator(null);
    setWaitNext(true);
  }, [current, previous, operator]);

  const handleAC = () => { setCurrent("0"); setPrevious(null); setOperator(null); setWaitNext(false); };
  const handleCE = () => { setCurrent("0"); setWaitNext(false); };
  const handleToggleSign = () => {
    if (current === "Error" || current === "0") return;
    setCurrent((c) => c.startsWith("-") ? c.slice(1) : "-" + c);
  };
  const handlePercent = () => {
    const n = parseFloat(current);
    if (!isNaN(n)) setCurrent(String(n / 100));
  };

  // Keyboard support
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key >= "0" && e.key <= "9") handleDigit(e.key);
      else if (e.key === ".") handleDigit(".");
      else if (e.key === "+") handleOp("+");
      else if (e.key === "-") handleOp("-");
      else if (e.key === "*") handleOp("*");
      else if (e.key === "/") { e.preventDefault(); handleOp("/"); }
      else if (e.key === "Enter" || e.key === "=") handleEquals();
      else if (e.key === "Escape") handleAC();
      else if (e.key === "Backspace") {
        setCurrent((c) => {
          if (c === "Error" || c.length <= 1) return "0";
          return c.slice(0, -1) || "0";
        });
      }
      else if (e.key === "%") handlePercent();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleDigit, handleOp, handleEquals]);

  const opLabel: Record<string, string> = { "+": "+", "-": "−", "*": "×", "/": "÷" };

  const BtnClass = (type: "num" | "op" | "eq" | "fn") => {
    const base = "flex items-center justify-center rounded-xl text-xl font-bold h-14 transition-all active:scale-95 select-none cursor-pointer";
    if (type === "eq") return base + " bg-blue text-white shadow-lg shadow-blue/20 hover:opacity-90 col-span-2";
    if (type === "op") return base + " bg-blue/10 text-blue hover:bg-blue/20 border border-blue/20";
    if (type === "fn") return base + " bg-surface border border-border text-text-3 hover:border-blue hover:text-blue";
    return base + " bg-surface border border-border hover:bg-bg";
  };

  return (
    
      <div className="max-w-sm mx-auto">
        {/* Display */}
        <div className="bg-surface border border-border rounded-2xl p-5 mb-4 space-y-1">
          <div className="text-sm text-text-4 h-5 font-mono">
            {previous && operator ? `${previous} ${opLabel[operator] ?? operator}` : ""}
          </div>
          <div className="text-4xl font-black text-right truncate text-text leading-tight">
            {formatDisplay(current)}
          </div>
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-4 gap-2">
          <button className={BtnClass("fn")} onClick={handleAC}>AC</button>
          <button className={BtnClass("fn")} onClick={handleCE}>CE</button>
          <button className={BtnClass("fn")} onClick={handlePercent}>%</button>
          <button className={BtnClass("op")} onClick={() => handleOp("/")}>÷</button>

          <button className={BtnClass("num")} onClick={() => handleDigit("7")}>7</button>
          <button className={BtnClass("num")} onClick={() => handleDigit("8")}>8</button>
          <button className={BtnClass("num")} onClick={() => handleDigit("9")}>9</button>
          <button className={BtnClass("op")} onClick={() => handleOp("*")}>×</button>

          <button className={BtnClass("num")} onClick={() => handleDigit("4")}>4</button>
          <button className={BtnClass("num")} onClick={() => handleDigit("5")}>5</button>
          <button className={BtnClass("num")} onClick={() => handleDigit("6")}>6</button>
          <button className={BtnClass("op")} onClick={() => handleOp("-")}>−</button>

          <button className={BtnClass("num")} onClick={() => handleDigit("1")}>1</button>
          <button className={BtnClass("num")} onClick={() => handleDigit("2")}>2</button>
          <button className={BtnClass("num")} onClick={() => handleDigit("3")}>3</button>
          <button className={BtnClass("op")} onClick={() => handleOp("+")}>+</button>

          <button className={BtnClass("fn")} onClick={handleToggleSign}>±</button>
          <button className={BtnClass("num")} onClick={() => handleDigit("0")}>0</button>
          <button className={BtnClass("num")} onClick={() => handleDigit(".")}>.</button>
          <button className={BtnClass("eq")} onClick={handleEquals}>=</button>
        </div>

        <p className="text-xs text-text-4 text-center mt-4">
          Supports keyboard input: 0–9, +, −, *, /, Enter, Esc
        </p>
      </div>
    
  );
}
