"use client";
import { useEffect } from "react";

export function QRCodeLoader({ onLoad }: { onLoad: () => void }) {
  useEffect(() => {
    if ((window as any).QRCode) {
      onLoad();
      return;
    }

    const script = document.createElement("script");
    const localSrc = "/lib/qrcode/qrcode.min.js";
    const cdnSrc = "https://cdn.jsdelivr.net/npm/qrcode@1.5.1/build/qrcode.min.js";

    script.src = localSrc;
    script.async = true;

    script.onload = () => {
      onLoad();
    };

    script.onerror = () => {
      if (script.src.includes(localSrc)) {
        console.warn("Local QRCode script failed, falling back to CDN...");
        const fallbackScript = document.createElement("script");
        fallbackScript.src = cdnSrc;
        fallbackScript.async = true;
        fallbackScript.onload = onLoad;
        document.body.appendChild(fallbackScript);
      }
    };

    document.body.appendChild(script);

    return () => {};
  }, [onLoad]);

  return null;
}
