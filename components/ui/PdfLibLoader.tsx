"use client";
import { useEffect, useState } from "react";
import Script from "next/script";

export function PdfLibLoader({ onLoad }: { onLoad: () => void }) {
  return (
    <Script 
      src="https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js" 
      strategy="beforeInteractive"
      onLoad={onLoad} 
    />
  );
}
