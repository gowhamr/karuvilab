"use client";

import { useState, useCallback } from "react";
import { CopyButton } from "@/components/ui/CopyButton";
import { Code2, Wand2 } from "lucide-react";

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
  const [inputSql, setInputSql] = useState("select u.id, u.name, count(o.id) as total_orders from users u left join orders o on u.id = o.user_id where u.status = 'active' and u.created_at >= '2026-01-01' group by u.id, u.name having count(o.id) > 5 order by total_orders desc limit 10");
  const [uppercaseKeywords, setUppercaseKeywords] = useState(true);
  const [indentSpaces, setIndentSpaces] = useState(2);
  const [formattedSql, setFormattedSql] = useState("");

  const handleFormat = useCallback(() => {
    setFormattedSql(formatSql(inputSql, uppercaseKeywords, indentSpaces));
  }, [inputSql, uppercaseKeywords, indentSpaces]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Controls */}
      <div className="p-4 rounded-xl bg-surface-2 border border-border flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-xs font-semibold text-text">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={uppercaseKeywords}
              onChange={(e) => setUppercaseKeywords(e.target.checked)}
              className="rounded border-border"
            />
            Uppercase SQL Keywords
          </label>

          <div className="flex items-center gap-2">
            <span className="text-text-muted">Indent:</span>
            <select
              value={indentSpaces}
              onChange={(e) => setIndentSpaces(Number(e.target.value))}
              className="px-2 py-1 rounded bg-surface border border-border text-xs"
            >
              <option value={2}>2 Spaces</option>
              <option value={4}>4 Spaces</option>
            </select>
          </div>
        </div>

        <button
          id="sql-format-btn"
          onClick={handleFormat}
          className="px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-sm flex items-center gap-2 hover:opacity-90 transition"
        >
          <Wand2 className="w-4 h-4" />
          Format SQL Query
        </button>
      </div>

      {/* Editor Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-text flex items-center gap-2">
            <Code2 className="w-4 h-4 text-sky-400" />
            Raw SQL Query:
          </label>
          <textarea
            id="sql-raw-input"
            rows={12}
            value={inputSql}
            onChange={(e) => setInputSql(e.target.value)}
            className="w-full p-4 rounded-xl bg-surface border border-border font-mono text-xs focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-text">Formatted Output:</label>
            <CopyButton text={formattedSql} />
          </div>
          <textarea
            id="sql-formatted-output"
            rows={12}
            readOnly
            value={formattedSql}
            placeholder="Click 'Format SQL Query' to view beautified output..."
            className="w-full p-4 rounded-xl bg-surface border border-border font-mono text-xs text-emerald-300 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
