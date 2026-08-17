// src/tool-engine/hooks/useDownload.ts
import { useCallback } from "react";
import { blobManager } from "@/src/lib/blob-manager";
export function useDownload() {
    const download = useCallback((result) => {
        if (result.outputType !== "download" || !result.blob)
            return;
        const url = blobManager.create(result.blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = result.filename || "download";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        // Give the browser time to start the download before revoking
        setTimeout(() => {
            blobManager.revoke(url);
        }, 1000);
    }, []);
    return { download };
}
