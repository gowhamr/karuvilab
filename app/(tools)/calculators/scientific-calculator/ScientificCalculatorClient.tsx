"use client";

import React, { useState } from "react";
import { m } from "framer-motion";
import { workerOrchestrator } from "@/src/engine/workers/WorkerOrchestrator";

export default function ScientificCalculatorClient() {
  const [display, setDisplay] = useState("0");
  const [expression, setExpression] = useState("");
  const [mode, setMode] = useState<"deg" | "rad">("deg");

  const append = (val: string) => {
    if (display === "0" && val !== ".") {
      setDisplay(val);
    } else {
      setDisplay(display + val);
    }
  };

  const clear = () => {
    setDisplay("0");
    setExpression("");
  };

  const calculate = async () => {
    try {
      let expr = display
        .replace(/sin\(/g, `Math.sin(${mode === 'deg' ? 'Math.PI/180*' : ''}`)
        .replace(/cos\(/g, `Math.cos(${mode === 'deg' ? 'Math.PI/180*' : ''}`)
        .replace(/tan\(/g, `Math.tan(${mode === 'deg' ? 'Math.PI/180*' : ''}`)
        .replace(/log\(/g, "Math.log10(")
        .replace(/ln\(/g, "Math.log(")
        .replace(/sqrt\(/g, "Math.sqrt(")
        .replace(/π/g, "Math.PI")
        .replace(/e/g, "Math.E")
        .replace(/\^/g, "**");

      const result = await workerOrchestrator.run<number>("evaluateMath", [expr]);
      setExpression(display + " =");
      setDisplay(String(Number(result.toFixed(10))));
    } catch (e) {
      setDisplay("Error");
    }
  };

  const buttons = [
    { label: "sin", action: () => append("sin(") },
    { label: "cos", action: () => append("cos(") },
    { label: "tan", action: () => append("tan(") },
    { label: "deg/rad", action: () => setMode(mode === "deg" ? "rad" : "deg") },
    { label: "log", action: () => append("log(") },
    { label: "ln", action: () => append("ln(") },
    { label: "(", action: () => append("(") },
    { label: ")", action: () => append(")") },
    { label: "sqrt", action: () => append("sqrt(") },
    { label: "^", action: () => append("^") },
    { label: "π", action: () => append("π") },
    { label: "e", action: () => append("e") },
    { label: "7", action: () => append("7") },
    { label: "8", action: () => append("8") },
    { label: "9", action: () => append("9") },
    { label: "/", action: () => append("/") },
    { label: "4", action: () => append("4") },
    { label: "5", action: () => append("5") },
    { label: "6", action: () => append("6") },
    { label: "*", action: () => append("*") },
    { label: "1", action: () => append("1") },
    { label: "2", action: () => append("2") },
    { label: "3", action: () => append("3") },
    { label: "-", action: () => append("-") },
    { label: "0", action: () => append("0") },
    { label: ".", action: () => append(".") },
    { label: "C", action: clear, className: "text-error" },
    { label: "+", action: () => append("+") },
    { label: "=", action: calculate, className: "col-span-4 bg-blue text-white hover:bg-blue/90" },
  ];

  return (
    <div className="max-w-md mx-auto p-8 bg-surface border border-border rounded-[40px] shadow-2xl space-y-6">
      <div className="bg-bg border border-border rounded-2xl p-6 text-right space-y-2">
        <div className="text-xs font-bold text-text-4 uppercase tracking-widest h-4">
          {expression} {mode.toUpperCase()}
        </div>
        <div className="text-4xl font-black tracking-tight text-text truncate">
          {display}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {buttons.map((btn, i) => (
          <m.button
            key={i}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={btn.action}
            className={`p-4 text-sm font-bold rounded-xl border border-border bg-bg hover:border-blue/50 transition-all ${btn.className || "text-text-2"}`}
          >
            {btn.label === "deg/rad" ? mode.toUpperCase() : btn.label}
          </m.button>
        ))}
      </div>
    </div>
  );
}
