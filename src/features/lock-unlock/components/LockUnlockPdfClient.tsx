"use client";
import { useState, useRef, useId } from "react";
// Removed pdf-lib import
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { useObjectUrlManager } from "@/src/lib/hooks";
import { useToast } from "@/components/ui/Toast";

import { DropZone } from "@/components/ui/DropZone";
import { WorkflowSuggestions } from "@/components/ui/WorkflowSuggestions";
import { useWorkflowInput } from "@/src/lib/hooks/useWorkflowInput";
import { useWorkflowStore } from "@/src/store/useWorkflowStore";

const cat = CATEGORIES.find(c => c.id === "pdf")!;

export default function LockUnlockPdfClient() {
  const userId = useId();
  const ownerId = useId();
  const unlockId = useId();
  const { createUrl, revokeUrl } = useObjectUrlManager();
  const [file, setFile] = useState<File | null>(null);

  const { toast } = useToast();
  
  const handleFile = (files: FileList | File[] | null) => {
    const f = files instanceof FileList ? files[0] : files?.[0];
    if (!f) return;
    
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
  const [mode, setMode] = useState<"lock" | "unlock">("lock");
  const [password, setPassword] = useState("");
  const [ownerPassword, setOwnerPassword] = useState("");
  const [unlockPassword, setUnlockPassword] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [abortController, setAbortController] = useState<AbortController | null>(null);

  const inputClass = "w-full px-4 py-3 bg-bg border border-border rounded-xl focus:ring-2 focus:ring-blue outline-none transition-all";

  const process = async () => {
    if (!file) { setError("Please select a PDF file."); return; }
    setProcessing(true);
    setError("");
    setSuccess("");
    const controller = new AbortController();
    setAbortController(controller);
    try {
      const { workerManager } = await import("@/src/workers/manager");
      const bytes = await file.arrayBuffer();

      if (mode === "lock") {
        if (!password) { setError("Please enter a user password."); setProcessing(false); return; }
        
        const outBytes = await workerManager.lockPdf(
          bytes,
          password,
          ownerPassword || password,
          undefined,
          controller.signal
        );
        
        const blob = new Blob([outBytes as any], { type: "application/pdf" });
        const name = file.name.replace(/\.pdf$/i, "") + "-locked.pdf";
        const url = createUrl(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = name;
        a.click();
        
        useWorkflowStore.getState().syncToolOutput("lock-unlock", [{ blob, name, type: "pdf" }]);
        // KL-06: Let useObjectUrlManager handle cleanup
        setSuccess("PDF locked successfully and downloaded.");
      } else {
        if (!unlockPassword) { setError("Please enter the PDF password."); setProcessing(false); return; }
        
        const outBytes = await workerManager.unlockPdf(
          bytes,
          unlockPassword,
          undefined,
          controller.signal
        );
        
        const blob = new Blob([outBytes as any], { type: "application/pdf" });
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
    } catch (e: any) {
      if (e?.message === "Task cancelled" || e?.name === "AbortError") {
        setError("Operation cancelled.");
      } else if (e?.message?.includes("password") || e?.message?.includes("Password")) {
        setError("Incorrect password. Please check and try again.");
      } else {
        setError(e?.message || "Failed to process PDF.");
      }
    } finally {
      setProcessing(false);
      setAbortController(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        {(["lock","unlock"] as const).map(m => (
          <button key={m} onClick={() => setMode(m)} className={`px-5 py-2 rounded-xl text-sm font-semibold capitalize transition-colors ${mode === m ? "bg-blue text-white" : "bg-surface border border-border text-text-3 hover:border-blue hover:text-blue"}`}>
            {m === "lock" ? "🔒 Lock (Add Password)" : "🔓 Unlock (Remove Password)"}
          </button>
        ))}
      </div>

      <DropZone
        onFilesSelected={handleFile}
        accept=".pdf,application/pdf"
        title={file ? file.name : "Drop a PDF here or click to select"}
        description={file ? `${(file.size / 1024).toFixed(0)} KB` : "Supports standard PDF files"}
        icon={<div className="text-4xl">{file ? "📄" : (mode === "lock" ? "🔒" : "🔓")}</div>}
      />

      <div className="bg-surface border border-border p-5 rounded-2xl shadow-sm space-y-4">
        {mode === "lock" ? (
          <>
            <div className="space-y-1">
              <label htmlFor={userId} className="text-sm font-medium">User Password (required to open the PDF)</label>
              <input id={userId} type="password" className={inputClass} value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" />
            </div>
            <div className="space-y-1">
              <label htmlFor={ownerId} className="text-sm font-medium">Owner Password (optional — for permissions)</label>
              <input id={ownerId} type="password" className={inputClass} value={ownerPassword} onChange={e => setOwnerPassword(e.target.value)} placeholder="Leave blank to use user password" />
            </div>
            <p className="text-xs text-text-4">The owner password controls editing/printing permissions. If left blank, the user password is used for both.</p>
          </>
        ) : (
          <div className="space-y-1">
            <label htmlFor={unlockId} className="text-sm font-medium">PDF Password</label>
            <input id={unlockId} type="password" className={inputClass} value={unlockPassword} onChange={e => setUnlockPassword(e.target.value)} placeholder="Enter the PDF password" />
            <p className="text-xs text-text-4">Enter the password to decrypt and save the PDF without protection.</p>
          </div>
        )}
      </div>

      {error && <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl text-red-600 text-sm">{error}</div>}
      {success && <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl text-green-700 text-sm">{success}</div>}

      <div className="flex gap-4">
        <button
          onClick={process}
          disabled={!file || processing}
          className="flex-1 py-4 bg-blue text-white font-bold rounded-xl hover:scale-102 active:scale-98 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100 shadow-lg shadow-blue/20"
        >
          {processing ? "Processing…" : mode === "lock" ? "Lock PDF" : "Unlock PDF"}
        </button>
        {processing && (
          <button
            onClick={() => abortController?.abort()}
            className="px-6 py-4 bg-red-500/10 text-red-500 font-bold rounded-xl hover:bg-red-500/20 transition-all"
          >
            Cancel
          </button>
        )}
      </div>

      <WorkflowSuggestions />
    </div>
  );
}
