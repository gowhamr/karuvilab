"use client";
import { useState, useMemo } from "react";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";

const cat = CATEGORIES.find(c => c.id === "seo")!;

const POWER_WORDS = ["amazing","best","free","new","now","proven","ultimate","complete","essential","incredible","powerful","instant","guaranteed","exclusive","secret","insider","remarkable","surprising","outstanding","phenomenal","revolutionary","breakthrough"];
const POSITIVE_WORDS = ["great","good","best","top","better","amazing","excellent","wonderful","brilliant","perfect","awesome","fantastic","love","easy","simple","fast","quick","powerful","ultimate","leading","effective","proven","trusted","reliable","smart","beautiful","fun","incredible","outstanding","rewarding","helpful","comprehensive","expert","premium","superior","innovative"];
const NEGATIVE_WORDS = ["bad","worst","never","stop","avoid","mistakes","errors","fail","wrong","danger","warning","risk","problem","issue","difficult","hard","struggle","pain","trouble","break"];

interface Criterion {
  id: string;
  label: string;
  pass: boolean | "warn";
  note: string;
  points: number;
}

function analyzeTtitle(title: string): { score: number; criteria: Criterion[] } {
  const len = title.length;
  const words = title.toLowerCase().split(/\s+/).filter(Boolean);
  const firstWord = words[0] || "";
  const hasPowerWord = POWER_WORDS.some(pw => title.toLowerCase().includes(pw));
  const hasNumber = /\d/.test(title);
  const posCount = POSITIVE_WORDS.filter(w => title.toLowerCase().includes(w)).length;
  const negCount = NEGATIVE_WORDS.filter(w => title.toLowerCase().includes(w)).length;

  let lengthPass: boolean | "warn";
  let lengthNote: string;
  let lengthPoints: number;
  if (len >= 50 && len <= 60) { lengthPass = true; lengthNote = `${len} chars — perfect length (50–60).`; lengthPoints = 25; }
  else if ((len >= 40 && len < 50) || (len > 60 && len <= 70)) { lengthPass = "warn"; lengthNote = `${len} chars — acceptable but not ideal. Aim for 50–60.`; lengthPoints = 12; }
  else if (len === 0) { lengthPass = false; lengthNote = "Title is empty."; lengthPoints = 0; }
  else if (len < 40) { lengthPass = false; lengthNote = `${len} chars — too short. Aim for 50–60 characters.`; lengthPoints = 5; }
  else { lengthPass = false; lengthNote = `${len} chars — too long. May be truncated in search results.`; lengthPoints = 5; }

  let emotionPass: boolean | "warn";
  let emotionNote: string;
  let emotionPoints: number;
  if (posCount > 0) { emotionPass = true; emotionNote = `Positive emotional tone detected (${posCount} word${posCount > 1 ? "s" : ""}).`; emotionPoints = 15; }
  else if (negCount > 0) { emotionPass = "warn"; emotionNote = "Negative tone — can work for click-bait but use carefully."; emotionPoints = 10; }
  else { emotionPass = false; emotionNote = "No emotional words detected. Adding one could boost CTR."; emotionPoints = 0; }

  const criteria: Criterion[] = [
    {
      id: "length",
      label: "Title Length (50–60 chars)",
      pass: lengthPass,
      note: lengthNote,
      points: lengthPoints,
    },
    {
      id: "keyword",
      label: "Keyword at Start",
      pass: words.length > 0 && firstWord.length > 3,
      note: words.length > 0 && firstWord.length > 3
        ? `Starts with "${firstWord}" — good keyword placement.`
        : "Consider starting with your primary keyword.",
      points: 20,
    },
    {
      id: "power",
      label: "Power Word",
      pass: hasPowerWord,
      note: hasPowerWord ? "Contains a power word — great for CTR!" : `No power words found. Try: ${POWER_WORDS.slice(0, 5).join(", ")}, etc.`,
      points: hasPowerWord ? 20 : 0,
    },
    {
      id: "number",
      label: "Contains Number",
      pass: hasNumber,
      note: hasNumber ? "Numbers improve click-through rates." : "Adding a number (e.g. '7 Ways to…') often boosts CTR.",
      points: hasNumber ? 10 : 0,
    },
    {
      id: "emotion",
      label: "Emotional Appeal",
      pass: emotionPass,
      note: emotionNote,
      points: emotionPoints,
    },
  ];

  const maxPoints = criteria.reduce((sum, c) => sum + (c.id === "keyword" || c.id === "power" || c.id === "number" || c.id === "emotion" ? (c.id === "keyword" ? 20 : c.id === "power" ? 20 : c.id === "number" ? 10 : 15) : 25), 0);
  const earned = criteria.reduce((sum, c) => sum + c.points, 0);
  const score = Math.round((earned / 90) * 100);

  return { score: Math.min(100, score), criteria };
}

export default function SeoTitleTesterClient() {
  const [title, setTitle] = useState("");

  const { score, criteria } = useMemo(() => analyzeTtitle(title), [title]);

  const scoreColor = score >= 70 ? "text-green-500" : score >= 40 ? "text-yellow-500" : "text-red-500";
  const scoreBg = score >= 70 ? "bg-green-500" : score >= 40 ? "bg-yellow-500" : "bg-red-500";

  const passIcon = (pass: boolean | "warn") =>
    pass === true ? "✓" : pass === "warn" ? "⚠" : "✗";
  const passColor = (pass: boolean | "warn") =>
    pass === true ? "text-green-500" : pass === "warn" ? "text-yellow-500" : "text-red-500";

  return (
    <div className="space-y-6">
      <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-4">
        <label className="text-sm font-medium">Your Title</label>
        <input
          type="text"
          className="w-full px-4 py-3 bg-bg border border-border rounded-xl focus:ring-2 focus:ring-blue outline-none transition-all text-lg"
          placeholder="Enter your SEO title here..."
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <div className="flex items-center justify-between text-xs text-text-4">
          <span>{title.length} characters</span>
          <span className={title.length > 60 ? "text-red-500" : title.length > 50 ? "text-green-500" : "text-text-4"}>
            {title.length < 50 ? `${50 - title.length} more to ideal` : title.length <= 60 ? "Perfect length!" : `${title.length - 60} over limit`}
          </span>
        </div>
      </div>

      {title && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Score */}
          <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-6">
            <div className="flex items-center gap-6">
              <div className={`text-6xl font-black ${scoreColor}`}>{score}</div>
              <div>
                <p className="font-bold text-lg">{score >= 70 ? "Great!" : score >= 40 ? "Needs Work" : "Poor"}</p>
                <p className="text-sm text-text-3">out of 100</p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-bg rounded-full h-3 overflow-hidden">
              <div className={`h-3 rounded-full transition-all duration-500 ${scoreBg}`} style={{ width: `${score}%` }} />
            </div>

            <div className="space-y-3">
              {criteria.map(c => (
                <div key={c.id} className="flex items-start gap-3">
                  <span className={`text-base font-bold flex-shrink-0 mt-0.5 ${passColor(c.pass)}`}>{passIcon(c.pass)}</span>
                  <div>
                    <p className="text-sm font-semibold">{c.label}</p>
                    <p className="text-xs text-text-3 mt-0.5">{c.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Google preview */}
          <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-4">
            <h2 className="font-bold text-text-2 text-sm uppercase tracking-wider">Google Preview</h2>
            <p className="text-xs text-text-4">~600px width container with title truncation at 60 chars</p>
            <div className="bg-white dark:bg-zinc-900 border border-border rounded-xl p-5 max-w-full">
              <p className="text-blue text-xl font-medium overflow-hidden text-ellipsis whitespace-nowrap max-w-full">
                {title || "Your Title Here"}
              </p>
              <p className="text-green-600 dark:text-green-400 text-sm mt-0.5">https://example.com › page-url</p>
              <p className="text-text-3 text-sm mt-1 line-clamp-2">
                Your meta description will appear here. Keep it between 120–160 characters for best results.
              </p>
            </div>
            <div className="text-xs text-text-4 space-y-1">
              <p>Title length: <strong className={title.length > 60 ? "text-red-500" : "text-green-500"}>{title.length} chars</strong></p>
              {title.length > 60 && (
                <p className="text-red-500">Truncated version: <strong>"{title.slice(0, 60)}…"</strong></p>
              )}
            </div>
          </div>
        </div>
      )}

      {!title && (
        <div className="bg-surface border border-border p-12 rounded-2xl shadow-sm text-center text-text-4">
          Type a title above to see your SEO score and Google preview.
        </div>
      )}
    </div>
  );
}
