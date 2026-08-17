"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useId } from "react";
// Removed pdf-lib import
import { CATEGORIES } from "@/src/tool-registry";
import { useObjectUrlManager } from "@/src/lib/hooks";
import { useToast } from "@/components/ui/Toast";
import { DropZone } from "@/components/ui/DropZone";
import { WorkflowSuggestions } from "@/components/ui/WorkflowSuggestions";
import { useWorkflowInput } from "@/src/lib/hooks/useWorkflowInput";
import { useWorkflowStore } from "@/src/store/useWorkflowStore";
const cat = CATEGORIES.find(c => c.id === "pdf");
export default function LockUnlockPdfClient() {
    const userId = useId();
    const ownerId = useId();
    const unlockId = useId();
    const { createUrl, revokeUrl } = useObjectUrlManager();
    const [file, setFile] = useState(null);
    const { toast } = useToast();
    const handleFile = (files) => {
        const f = files instanceof FileList ? files[0] : files?.[0];
        if (!f)
            return;
        if (f.type !== "application/pdf" && !f.name.endsWith(".pdf")) {
            toast(`Invalid file type: ${f.name}. Only PDFs are allowed.`, "error");
            return;
        }
        if (f.size > 100 * 1024 * 1024) {
            toast(`File too large: ${f.name}. Maximum size is 100MB.`, "error");
            return;
        }
        setFile(f);
    };
    useWorkflowInput(handleFile);
    const [mode, setMode] = useState("lock");
    const [password, setPassword] = useState("");
    const [ownerPassword, setOwnerPassword] = useState("");
    const [unlockPassword, setUnlockPassword] = useState("");
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [abortController, setAbortController] = useState(null);
    const inputClass = "w-full px-4 py-3 bg-bg border border-border rounded-xl focus:ring-2 focus:ring-blue outline-none transition-all";
    const process = async () => {
        if (!file) {
            setError("Please select a PDF file.");
            return;
        }
        setProcessing(true);
        setError("");
        setSuccess("");
        const controller = new AbortController();
        setAbortController(controller);
        try {
            const { workerManager } = await import("@/src/workers/manager");
            const bytes = await file.arrayBuffer();
            if (mode === "lock") {
                if (!password) {
                    setError("Please enter a user password.");
                    setProcessing(false);
                    return;
                }
                const outBytes = await workerManager.lockPdf(bytes, password, ownerPassword || password, undefined, controller.signal);
                const blob = new Blob([outBytes], { type: "application/pdf" });
                const name = file.name.replace(/\.pdf$/i, "") + "-locked.pdf";
                const url = createUrl(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = name;
                a.click();
                useWorkflowStore.getState().syncToolOutput("lock-unlock", [{ blob, name, type: "pdf" }]);
                // KL-06: Let useObjectUrlManager handle cleanup
                setSuccess("PDF locked successfully and downloaded.");
            }
            else {
                if (!unlockPassword) {
                    setError("Please enter the PDF password.");
                    setProcessing(false);
                    return;
                }
                const outBytes = await workerManager.unlockPdf(bytes, unlockPassword, undefined, controller.signal);
                const blob = new Blob([outBytes], { type: "application/pdf" });
                const name = file.name.replace(/\.pdf$/i, "") + "-unlocked.pdf";
                const url = createUrl(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = name;
                a.click();
                useWorkflowStore.getState().syncToolOutput("lock-unlock", [{ blob, name, type: "pdf" }]);
                // KL-06: Let useObjectUrlManager handle cleanup
                setSuccess("PDF unlocked successfully and downloaded.");
            }
        }
        catch (e) {
            if (e?.message === "Task cancelled" || e?.name === "AbortError") {
                setError("Operation cancelled.");
            }
            else if (e?.message?.includes("password") || e?.message?.includes("Password")) {
                setError("Incorrect password. Please check and try again.");
            }
            else {
                setError(e?.message || "Failed to process PDF.");
            }
        }
        finally {
            setProcessing(false);
            setAbortController(null);
        }
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "flex gap-2", children: ["lock", "unlock"].map(m => (_jsx("button", { onClick: () => setMode(m), className: `px-5 py-2 rounded-xl text-sm font-semibold capitalize transition-colors ${mode === m ? "bg-blue text-white" : "bg-surface border border-border text-text-3 hover:border-blue hover:text-blue"}`, children: m === "lock" ? "🔒 Lock (Add Password)" : "🔓 Unlock (Remove Password)" }, m))) }), _jsx(DropZone, { onFilesSelected: handleFile, accept: ".pdf,application/pdf", title: file ? file.name : "Drop a PDF here or click to select", description: file ? `${(file.size / 1024).toFixed(0)} KB` : "Supports standard PDF files", icon: _jsx("div", { className: "text-4xl", children: file ? "📄" : (mode === "lock" ? "🔒" : "🔓") }) }), _jsx("div", { className: "bg-surface border border-border p-5 rounded-2xl shadow-sm space-y-4", children: mode === "lock" ? (_jsxs(_Fragment, { children: [_jsxs("div", { className: "space-y-1", children: [_jsx("label", { htmlFor: userId, className: "text-sm font-medium", children: "User Password (required to open the PDF)" }), _jsx("input", { id: userId, type: "password", className: inputClass, value: password, onChange: e => setPassword(e.target.value), placeholder: "Enter password" })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { htmlFor: ownerId, className: "text-sm font-medium", children: "Owner Password (optional \u2014 for permissions)" }), _jsx("input", { id: ownerId, type: "password", className: inputClass, value: ownerPassword, onChange: e => setOwnerPassword(e.target.value), placeholder: "Leave blank to use user password" })] }), _jsx("p", { className: "text-xs text-text-4", children: "The owner password controls editing/printing permissions. If left blank, the user password is used for both." })] })) : (_jsxs("div", { className: "space-y-1", children: [_jsx("label", { htmlFor: unlockId, className: "text-sm font-medium", children: "PDF Password" }), _jsx("input", { id: unlockId, type: "password", className: inputClass, value: unlockPassword, onChange: e => setUnlockPassword(e.target.value), placeholder: "Enter the PDF password" }), _jsx("p", { className: "text-xs text-text-4", children: "Enter the password to decrypt and save the PDF without protection." })] })) }), error && _jsx("div", { className: "p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl text-red-600 text-sm", children: error }), success && _jsx("div", { className: "p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl text-green-700 text-sm", children: success }), _jsxs("div", { className: "flex gap-4", children: [_jsx("button", { onClick: process, disabled: !file || processing, className: "flex-1 py-4 bg-blue text-white font-bold rounded-xl hover:scale-102 active:scale-98 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100 shadow-lg shadow-blue/20", children: processing ? "Processing…" : mode === "lock" ? "Lock PDF" : "Unlock PDF" }), processing && (_jsx("button", { onClick: () => abortController?.abort(), className: "px-6 py-4 bg-red-500/10 text-red-500 font-bold rounded-xl hover:bg-red-500/20 transition-all", children: "Cancel" }))] }), _jsx(WorkflowSuggestions, {})] }));
}
