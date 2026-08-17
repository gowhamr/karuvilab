"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useMemo, useEffect } from "react";
import { CATEGORIES } from "@/src/tool-registry";
import { CopyButton } from "@/components/ui/CopyButton";
const cat = CATEGORIES.find(c => c.id === "developer");
function jsonToCSV(json) {
    const data = JSON.parse(json);
    if (!Array.isArray(data))
        throw new Error("Input must be a JSON array of objects");
    if (data.length === 0)
        return "";
    const headers = Array.from(new Set(data.flatMap(row => Object.keys(row))));
    const escape = (v) => {
        const str = v == null ? "" : String(v);
        if (str.includes(",") || str.includes('"') || str.includes("\n")) {
            return '"' + str.replace(/"/g, '""') + '"';
        }
        return str;
    };
    const rows = data.map(row => headers.map(h => escape(row[h])).join(","));
    return [headers.map(h => escape(h)).join(","), ...rows].join("\n");
}
function csvToJSON(csv) {
    const lines = csv.trim().split("\n");
    if (lines.length < 2)
        throw new Error("CSV must have at least a header row and one data row");
    function parseCSVLine(line) {
        const result = [];
        let current = "";
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
            const ch = line[i];
            if (ch === '"') {
                if (inQuotes && line[i + 1] === '"') {
                    current += '"';
                    i++;
                }
                else {
                    inQuotes = !inQuotes;
                }
            }
            else if (ch === "," && !inQuotes) {
                result.push(current);
                current = "";
            }
            else {
                current += ch;
            }
        }
        result.push(current);
        return result;
    }
    const headers = parseCSVLine(lines[0]);
    const rows = lines.slice(1).map(line => {
        const values = parseCSVLine(line);
        return Object.fromEntries(headers.map((h, i) => [h, values[i] ?? ""]));
    });
    return JSON.stringify(rows, null, 2);
}
import { useWorkflowIntegration } from "@/src/lib/workflow-hook";
import { useWorkflowStore } from "@/src/store/useWorkflowStore";
import { WorkflowSuggestions } from "@/components/ui/WorkflowSuggestions";
const toolId = "json-csv";
export default function JSONCSVConverterClient() {
    const [tab, setTab] = useState("json-csv");
    const [input, setInput] = useState("");
    const { suggestedText } = useWorkflowIntegration(toolId);
    const setActiveItems = useWorkflowStore(state => state.setActiveItems);
    const addToChain = useWorkflowStore(state => state.addToChain);
    useEffect(() => {
        if (suggestedText) {
            Promise.resolve().then(() => {
                setInput(suggestedText);
            });
        }
    }, [suggestedText]);
    const { output, error } = useMemo(() => {
        if (!input.trim())
            return { output: "", error: "" };
        try {
            const res = tab === "json-csv" ? jsonToCSV(input) : csvToJSON(input);
            return { output: res, error: "" };
        }
        catch (e) {
            return { output: "", error: e.message };
        }
    }, [input, tab]);
    // Update workflow store when output changes
    useEffect(() => {
        if (output && !error) {
            const outType = tab === "json-csv" ? "csv" : "json";
            setActiveItems([{
                    text: output,
                    name: `converted-${Date.now()}.${outType}`,
                    type: outType
                }]);
            addToChain(toolId);
        }
    }, [output, error, tab, setActiveItems, addToChain]);
    const placeholders = {
        "json-csv": '[{"name":"Alice","age":30},{"name":"Bob","age":25}]',
        "csv-json": "name,age\nAlice,30\nBob,25",
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-5", children: [_jsx("div", { className: "flex gap-2", children: ["json-csv", "csv-json"].map(t => (_jsx("button", { onClick: () => { setTab(t); setInput(""); }, className: `px-5 py-2 rounded-xl text-sm font-bold transition-all ${tab === t ? "bg-blue text-white" : "bg-bg border border-border text-text-2 hover:border-blue"}`, children: t === "json-csv" ? "JSON → CSV" : "CSV → JSON" }, t))) }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-bold text-text-2", children: tab === "json-csv" ? "JSON Input" : "CSV Input" }), _jsx("textarea", { className: "w-full px-4 py-3 bg-bg border border-border rounded-xl font-mono text-sm focus:ring-2 focus:ring-blue outline-none transition-all resize-none", rows: 8, placeholder: placeholders[tab], value: input, onChange: e => setInput(e.target.value) })] }), error && (_jsx("div", { className: "bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-sm text-red-500", children: error }))] }), output && !error && (_jsxs("div", { className: "bg-surface border border-border p-5 rounded-2xl space-y-3", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("label", { className: "text-sm font-bold text-text-2", children: tab === "json-csv" ? "CSV Output" : "JSON Output" }), _jsx(CopyButton, { text: output })] }), _jsx("textarea", { readOnly: true, className: "w-full px-4 py-3 bg-bg border border-border rounded-xl font-mono text-sm text-text resize-none outline-none", rows: 10, value: output })] })), output && !error && (_jsx(WorkflowSuggestions, {}))] }));
}
