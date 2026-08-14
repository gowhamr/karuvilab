"use client";

import { useState, useMemo } from "react";
import { ToolWorkspace } from "@/components/ui/ToolWorkspace";
import { ToolInput } from "@/components/ui/ToolInput";
import { ToolResultArea } from "@/components/ui/ToolResultArea";

const fmt = (n: number) =>
  n.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 6 });

type Mode = "m1" | "m2" | "m3";

export default function PercentageCalculatorClient() {
  const [activeTab, setActiveTab] = useState<Mode>("m1");

  // Mode 1: What is X% of Y?
  const [m1x, setM1x] = useState("20");
  const [m1y, setM1y] = useState("500");

  // Mode 2: X is what % of Y?
  const [m2x, setM2x] = useState("80");
  const [m2y, setM2y] = useState("400");

  // Mode 3: % change from X to Y
  const [m3x, setM3x] = useState("200");
  const [m3y, setM3y] = useState("250");

  const r1 = useMemo(() => {
    const x = parseFloat(m1x) || 0;
    const y = parseFloat(m1y) || 0;
    return (x / 100) * y;
  }, [m1x, m1y]);

  const r2 = useMemo(() => {
    const x = parseFloat(m2x) || 0;
    const y = parseFloat(m2y) || 0;
    if (y === 0) return null;
    return (x / y) * 100;
  }, [m2x, m2y]);

  const r3 = useMemo(() => {
    const x = parseFloat(m3x) || 0;
    const y = parseFloat(m3y) || 0;
    if (x === 0) return null;
    return ((y - x) / Math.abs(x)) * 100;
  }, [m3x, m3y]);

  const tabs = {
    options: [
      { id: "m1" as const, label: "What is X% of Y?" },
      { id: "m2" as const, label: "X is what % of Y?" },
      { id: "m3" as const, label: "% Change" }
    ],
    activeId: activeTab,
    onChange: setActiveTab
  };

  const renderInput = () => {
    switch (activeTab) {
      case "m1":
        return (
          <div className="space-y-4">
            <ToolInput
              label="Percentage (X)"
              type="number"
              value={m1x}
              onChange={setM1x}
              placeholder="e.g. 20"
            />
            <ToolInput
              label="Value (Y)"
              type="number"
              value={m1y}
              onChange={setM1y}
              placeholder="e.g. 500"
            />
          </div>
        );
      case "m2":
        return (
          <div className="space-y-4">
            <ToolInput
              label="Value (X)"
              type="number"
              value={m2x}
              onChange={setM2x}
              placeholder="e.g. 80"
            />
            <ToolInput
              label="Total (Y)"
              type="number"
              value={m2y}
              onChange={setM2y}
              placeholder="e.g. 400"
            />
          </div>
        );
      case "m3":
        return (
          <div className="space-y-4">
            <ToolInput
              label="Original Value (From)"
              type="number"
              value={m3x}
              onChange={setM3x}
              placeholder="e.g. 200"
            />
            <ToolInput
              label="New Value (To)"
              type="number"
              value={m3y}
              onChange={setM3y}
              placeholder="e.g. 250"
            />
          </div>
        );
    }
  };

  const renderOutput = () => {
    switch (activeTab) {
      case "m1":
        return (
          <div className="h-full flex flex-col space-y-4">
            <ToolResultArea
              label="Result"
              value={fmt(r1)}
              className="flex-1"
              contentClassName="text-3xl font-black text-blue flex items-center justify-center"
            />
            <div className="text-sm text-text-3 px-2 text-center bg-bg/50 py-3 rounded-xl">
              {m1x || 0}% of {m1y || 0} = <strong className="text-text">{fmt(r1)}</strong>
            </div>
          </div>
        );
      case "m2":
        return (
          <div className="h-full flex flex-col space-y-4">
            <ToolResultArea
              label="Percentage"
              value={r2 !== null ? fmt(r2) + "%" : "—"}
              className="flex-1"
              contentClassName="text-3xl font-black text-blue flex items-center justify-center"
            />
            {r2 !== null && (
              <div className="text-sm text-text-3 px-2 text-center bg-bg/50 py-3 rounded-xl">
                {m2x || 0} is <strong className="text-text">{fmt(r2)}%</strong> of {m2y || 0}
              </div>
            )}
          </div>
        );
      case "m3":
        return (
          <div className="h-full flex flex-col space-y-4">
            <ToolResultArea
              label={r3 !== null && r3 >= 0 ? "Increase" : (r3 !== null ? "Decrease" : "Result")}
              value={r3 !== null ? (r3 >= 0 ? "+" : "") + fmt(r3) + "%" : "—"}
              className="flex-1"
              contentClassName={`text-3xl font-black flex items-center justify-center ${
                r3 !== null ? (r3 >= 0 ? "text-green-500" : "text-red-400") : "text-blue"
              }`}
            />
            {r3 !== null && (
              <div className="text-sm text-text-3 px-2 text-center bg-bg/50 py-3 rounded-xl">
                From {m3x || 0} to {m3y || 0} is a{" "}
                <strong className={r3 >= 0 ? "text-green-500" : "text-red-400"}>
                  {r3 >= 0 ? "+" : ""}{fmt(r3)}% {r3 >= 0 ? "increase" : "decrease"}
                </strong>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <ToolWorkspace
      tabs={tabs}
      input={renderInput()}
      output={renderOutput()}
    />
  );
}
