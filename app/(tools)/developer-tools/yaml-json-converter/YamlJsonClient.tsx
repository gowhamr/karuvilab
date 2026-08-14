"use client";

import { useState, useCallback } from "react";
import YAML from "yaml";
import { ToolWorkspace } from "@/components/ui/ToolWorkspace";
import { ToolInput } from "@/components/ui/ToolInput";
import { ToolResultArea } from "@/components/ui/ToolResultArea";

export default function YamlJsonClient() {
  const [direction, setDirection] = useState<"yaml2json" | "json2yaml">("yaml2json");
  const [inputText, setInputText] = useState(`name: KaruviLab
version: 2.1.0
features:
  - fast
  - private
  - offline
settings:
  theme: dark
  autoSave: true`);
  const [outputText, setOutputText] = useState("");
  const [error, setError] = useState<string | undefined>(undefined);

  const handleConvert = useCallback(() => {
    setError(undefined);
    if (!inputText.trim()) {
      setOutputText("");
      return;
    }
    
    if (inputText.length > 5 * 1024 * 1024) {
      setError("Input text exceeds 5MB limit");
      setOutputText("");
      return;
    }

    try {
      if (direction === "yaml2json") {
        const parsed = YAML.parse(inputText);
        setOutputText(JSON.stringify(parsed, null, 2));
      } else {
        const parsed = JSON.parse(inputText);
        setOutputText(YAML.stringify(parsed));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Conversion failed due to invalid syntax.");
    }
  }, [inputText, direction]);

  const toggleDirection = (nextDir: string) => {
    if (nextDir === direction) return;
    setDirection(nextDir as "yaml2json" | "json2yaml");
    setInputText(outputText || inputText);
    setOutputText("");
    setError(undefined);
  };

  return (
    <ToolWorkspace
      layout="split"
      tabs={{
        options: [
          { id: "yaml2json", label: "YAML to JSON" },
          { id: "json2yaml", label: "JSON to YAML" }
        ],
        activeId: direction,
        onChange: toggleDirection
      }}
      input={
        <ToolInput
          label={`Input ${direction === "yaml2json" ? "YAML" : "JSON"}`}
          value={inputText}
          onChange={setInputText}
          rows={14}
          mono
        />
      }
      optionsPanel={
        <button
          onClick={handleConvert}
          className="w-full py-3 rounded-xl bg-primary text-white font-bold text-sm hover:opacity-90 transition"
        >
          Convert Now
        </button>
      }
      output={
        <ToolResultArea
          label={`Output ${direction === "yaml2json" ? "JSON" : "YAML"}`}
          value={outputText}
          error={error}
          language={direction === "yaml2json" ? "json" : "yaml"}
          onClear={() => {
            setInputText("");
            setOutputText("");
            setError(undefined);
          }}
        />
      }
    />
  );
}
