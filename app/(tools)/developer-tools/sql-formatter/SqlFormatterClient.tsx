"use client";

import { useState, useCallback } from "react";
import { Wand2 } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { ToolWorkspace } from "@/components/ui/ToolWorkspace";
import { ToolInput } from "@/components/ui/ToolInput";
import { ToolResultArea } from "@/components/ui/ToolResultArea";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";

export function formatSql(sql: string, uppercaseKeywords: boolean = true, indentSpaces: number = 2): string {
  if (!sql.trim()) return "";

  const keywords = [
    "SELECT", "FROM", "WHERE", "AND", "OR", "GROUP BY", "ORDER BY", "HAVING", "LIMIT",
    "INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL JOIN", "CROSS JOIN", "JOIN",
    "ON", "INSERT INTO", "VALUES", "UPDATE", "SET", "DELETE FROM", "CREATE TABLE",
    "ALTER TABLE", "DROP TABLE", "UNION ALL", "UNION", "AS", "IN", "NOT IN",
    "EXISTS", "BETWEEN", "LIKE", "IS NULL", "IS NOT NULL", "CASE", "WHEN", "THEN", "ELSE", "END"
  ];

  let cleaned = sql.replace(/\s+/g, " ");

  // Handle Keyword Upper/Lower Casing
  keywords.forEach((kw) => {
    const regex = new RegExp(`\\b${kw.replace(/ /g, "\\s+")}\\b`, "gi");
    cleaned = cleaned.replace(regex, uppercaseKeywords ? kw : kw.toLowerCase());
  });

  // Break lines on major clause boundaries
  const majorClauses = [
    "SELECT", "FROM", "WHERE", "GROUP BY", "ORDER BY", "HAVING", "LIMIT",
    "INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL JOIN", "CROSS JOIN", "JOIN",
    "INSERT INTO", "VALUES", "UPDATE", "SET", "DELETE FROM", "UNION ALL", "UNION"
  ];

  let formatted = cleaned;
  majorClauses.forEach((clause) => {
    const target = uppercaseKeywords ? clause : clause.toLowerCase();
    const regex = new RegExp(`\\b${target}\\b`, "g");
    formatted = formatted.replace(regex, `\n${target}`);
  });

  const indent = " ".repeat(indentSpaces);
  return formatted
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      if (majorClauses.some((c) => line.toUpperCase().startsWith(c))) {
        return line;
      }
      return indent + line;
    })
    .join("\n");
}

export default function SqlFormatterClient() {
  const { toast } = useToast();
  const [inputSql, setInputSql] = useState("select u.id, u.name, count(o.id) as total_orders from users u left join orders o on u.id = o.user_id where u.status = 'active' and u.created_at >= '2026-01-01' group by u.id, u.name having count(o.id) > 5 order by total_orders desc limit 10");
  const [uppercaseKeywords, setUppercaseKeywords] = useState(true);
  const [indentSpaces, setIndentSpaces] = useState(2);
  const [formattedSql, setFormattedSql] = useState("");

  const handleFormat = useCallback(() => {
    setFormattedSql(formatSql(inputSql, uppercaseKeywords, indentSpaces));
  }, [inputSql, uppercaseKeywords, indentSpaces]);

  return (
    <ToolWorkspace
      input={
        <ToolInput
          label="Raw SQL Query"
          value={inputSql}
          onChange={(val) => {
            if (val.length > 5 * 1024 * 1024) {
              toast("Input text exceeds 5MB limit", "error");
            } else {
              setInputSql(val);
            }
          }}
          rows={12}
          mono
          id="sql-raw-input"
          placeholder="Enter SQL here..."
        />
      }
      optionsPanel={
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center w-full">
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
            <Checkbox
              label="Uppercase SQL Keywords"
              checked={uppercaseKeywords}
              onChange={(e) => setUppercaseKeywords(e.target.checked)}
            />
            <div className="flex items-center gap-2 px-1">
              <span className="text-sm font-bold text-text-2">Indent:</span>
              <select
                value={indentSpaces}
                onChange={(e) => setIndentSpaces(Number(e.target.value))}
                className="w-[120px] px-4 py-3 bg-bg border border-divider rounded-input outline-none transition-all min-h-12 text-text-primary text-body focus:ring-4 focus:ring-inset focus:ring-primary/10 focus:border-primary"
              >
                <option value={2}>2 Spaces</option>
                <option value={4}>4 Spaces</option>
              </select>
            </div>
          </div>
          <Button
            id="sql-format-btn"
            onClick={handleFormat}
            variant="primary"
            className="w-full sm:w-auto"
          >
            <Wand2 className="w-4 h-4" />
            Format SQL Query
          </Button>
        </div>
      }
      output={
        <ToolResultArea
          label="Formatted Output"
          value={formattedSql}
          language="sql"
        />
      }
    />
  );
}
