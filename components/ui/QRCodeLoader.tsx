"use client";
import Script from "next/script";

export function QRCodeLoader({ onLoad }: { onLoad: () => void }) {
  return (
    <Script 
      src="https://unpkg.com/qrcode@1.5.3/build/qrcode.min.js" 
      strategy="afterInteractive"
      onLoad={onLoad} 
    />
  );
}
