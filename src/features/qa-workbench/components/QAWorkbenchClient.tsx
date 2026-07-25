"use client";

import React, { useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import RegexTesterClient from "@/src/features/regex/components/RegexTesterClient";
import JsonFormatterClient from "@/src/features/json-formatter/components/JsonFormatterClient";
import DiffCheckerClient from "@/src/features/diff-checker/components/DiffCheckerClient";
import FakeDataGeneratorClient from "@/src/features/fake-data-generator/components/FakeDataGeneratorClient";
import { ApiTester } from "./ApiTester";
import { Regex, Code2, Braces, Database, Network } from "lucide-react";

type TabId = "api" | "regex" | "json" | "diff" | "fakedata";

const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: "api", label: "API Tester", icon: Network },
  { id: "regex", label: "Regex Tester", icon: Regex },
  { id: "json", label: "JSON Formatter", icon: Braces },
  { id: "diff", label: "Text Diff", icon: Code2 },
  { id: "fakedata", label: "Mock Data", icon: Database },
];

export default function QAWorkbenchClient() {
  const [activeTab, setActiveTab] = useState<TabId>("api");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 p-2 bg-surface border border-border rounded-2xl">
        {TABS.map(tab => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold transition-all text-sm ${
                isActive 
                  ? "bg-blue text-white shadow-md shadow-blue/20" 
                  : "bg-transparent text-text-4 hover:text-text-2 hover:bg-bg"
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="min-h-[500px]">
        <AnimatePresence mode="wait">
          <m.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
          >
            {activeTab === "api" && <ApiTester />}
            {activeTab === "regex" && <RegexTesterClient />}
            {activeTab === "json" && <JsonFormatterClient />}
            {activeTab === "diff" && <DiffCheckerClient />}
            {activeTab === "fakedata" && <FakeDataGeneratorClient />}
          </m.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
