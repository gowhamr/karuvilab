"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useWorkflowStore } from "@/src/store/workflowStore";
import { DropZone } from "@/components/ui/DropZone";
import { ToolResultArea } from "@/components/ui/ToolResultArea";
import { useObjectUrlManager } from "@/src/lib/hooks";
import { Camera, Image as ImageIcon, VideoOff, ScanLine, ExternalLink, AlertCircle } from "lucide-react";
import { m } from "framer-motion";
import { useToast } from "@/components/ui/Toast";

// ─── Feature detection ──────────────────────────────────────────────────────

function isBarcodeDetectorSupported(): boolean {
  return typeof window !== "undefined" && "BarcodeDetector" in window;
}

// ─── jsQR fallback (loaded dynamically when BarcodeDetector is absent) ──────
// jsqr is a pure-JS QR code decoder (~30 KB gzip, no WASM dependency).
// It decodes QR codes only; for other barcode formats (EAN, Code128, etc.),
// BarcodeDetector is required. A notice is shown when running in fallback mode.

type JsQRFn = (data: Uint8ClampedArray, width: number, height: number) => { data: string } | null;
let jsqrModule: JsQRFn | null = null;
let jsqrLoadAttempted = false;

async function loadJsQR(): Promise<JsQRFn | null> {
  if (jsqrLoadAttempted) return jsqrModule;
  jsqrLoadAttempted = true;
  try {
    const mod = await import("jsqr");
    jsqrModule = (mod.default ?? mod) as unknown as JsQRFn;
    return jsqrModule;
  } catch {
    // jsqr unavailable — fallback not active
    return null;
  }
}

// ─── Canvas frame extraction ─────────────────────────────────────────────────

function getVideoFrameImageData(video: HTMLVideoElement, canvas: HTMLCanvasElement): ImageData | null {
  if (video.readyState < 2 || video.videoWidth === 0) return null;
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.drawImage(video, 0, 0);
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function BarcodeScannerClient() {
  const router = useRouter();
  const { toast } = useToast();
  const { createUrl, revokeUrl } = useObjectUrlManager();

  const [mode, setMode] = useState<"camera" | "image">("camera");
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [format, setFormat] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);
  const [fallbackUnavailable, setFallbackUnavailable] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scanTrigger, setScanTrigger] = useState(0);

  useEffect(() => {
    if (mode !== "camera") return;

    let active = true;
    let localStream: MediaStream | null = null;
    let animFrame: number | null = null;

    const nativeSupported = isBarcodeDetectorSupported();

    const stopCamera = () => {
      localStream?.getTracks().forEach(t => t.stop());
      setStream(null);
      if (animFrame) cancelAnimationFrame(animFrame);
    };

    const scanFrame = async () => {
      if (!videoRef.current || !canvasRef.current || !active) return;

      if (nativeSupported) {
        // ── Native BarcodeDetector path ────────────────────────────────
        try {
          const detector = new (window as any).BarcodeDetector();
          const barcodes = await detector.detect(videoRef.current);
          if (barcodes.length > 0 && active) {
            setResult(barcodes[0].rawValue);
            setFormat(barcodes[0].format ?? "barcode");
            beep();
            toast("Scan Successful!", "success");
            stopCamera();
            return;
          }
        } catch {
          // ignore per-frame errors; keep scanning
        }
      } else {
        // ── jsQR fallback path ──────────────────────────────────────────
        const jsqr = await loadJsQR();
        if (!jsqr) {
          if (active) {
            setFallbackUnavailable(true);
            setError(
              "Native barcode scanning is not supported in this browser, and the fallback library (jsqr) is not installed. " +
              "Please use Chrome/Edge, or switch to Image mode and upload a QR code image."
            );
          }
          return;
        }
        setUsingFallback(true);
        const imageData = getVideoFrameImageData(videoRef.current, canvasRef.current);
        if (imageData) {
          const code = jsqr(imageData.data, imageData.width, imageData.height);
          if (code && active) {
            setResult(code.data);
            setFormat("qr_code (jsqr fallback)");
            beep();
            toast("QR Code Scanned!", "success");
            stopCamera();
            return;
          }
        }
      }

      if (active) {
        animFrame = requestAnimationFrame(scanFrame);
      }
    };

    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        localStream = mediaStream;
        setStream(mediaStream);
        if (videoRef.current) videoRef.current.srcObject = mediaStream;
        scanFrame();
      } catch {
        setError("Could not access camera. Please allow camera permissions or try image upload.");
        toast("Could not access camera", "error");
        setMode("image");
      }
    };

    // Detect fallback mode before starting so UI shows the notice immediately
    if (!nativeSupported) setUsingFallback(true);

    startCamera();

    return () => {
      active = false;
      stopCamera();
    };
  }, [mode, scanTrigger, toast]);

  const handleImageUpload = useCallback(async (files: FileList | File[]) => {
    const file = files[0];
    if (!file) return;

    setError(null);
    const img = new Image();
    const url = createUrl(file);
    img.src = url;
    await new Promise<void>(r => { img.onload = () => r(); });

    if (isBarcodeDetectorSupported()) {
      // ── Native path ────────────────────────────────────────────────
      try {
        const detector = new (window as any).BarcodeDetector();
        const barcodes = await detector.detect(img);
        if (barcodes.length > 0) {
          setResult(barcodes[0].rawValue);
          setFormat(barcodes[0].format ?? "barcode");
          toast("Barcode found in image!", "success");
        } else {
          setError("No barcode found in this image.");
          toast("No barcode found.", "error");
        }
      } catch {
        setError("Error analyzing image.");
        toast("Failed to analyze image.", "error");
      }
    } else {
      // ── jsQR fallback path ─────────────────────────────────────────
      setUsingFallback(true);
      const jsqr = await loadJsQR();
      if (!jsqr) {
        setFallbackUnavailable(true);
        setError(
          "QR scanning is not supported in this browser and the fallback library (jsqr) is not available. " +
          "Try Chrome or Edge for full barcode support."
        );
        revokeUrl(url);
        return;
      }

      // Draw image onto canvas to extract pixel data
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsqr(imageData.data, imageData.width, imageData.height);
        if (code) {
          setResult(code.data);
          setFormat("qr_code (jsqr fallback)");
          toast("QR Code found!", "success");
        } else {
          setError("No QR code found in this image. Note: fallback mode only detects QR codes, not other barcode formats.");
          toast("No QR code found.", "error");
        }
      }
    }
    revokeUrl(url);
  }, [createUrl, revokeUrl, toast]);

  return (
    <div className="space-y-8">
      {/* Browser compatibility notice */}
      {usingFallback && !fallbackUnavailable && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-start gap-3" role="alert">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-bold text-amber-400">Fallback mode — QR codes only</p>
            <p className="text-amber-400/80 mt-0.5">
              Your browser doesn&apos;t support the native Barcode Detection API (Firefox/Safari/iOS). 
              A JS fallback is active and can detect <strong>QR codes</strong> only. 
              For full barcode format support (EAN, Code128, etc.), use Chrome or Edge on desktop.
            </p>
          </div>
        </div>
      )}

      {/* Mode tabs */}
      <div className="flex bg-surface border border-border p-1 rounded-xl w-fit mx-auto">
        <button
          id="barcode-mode-camera"
          onClick={() => setMode("camera")}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${mode === "camera" ? "bg-blue text-white shadow-md" : "text-text-3 hover:text-text"}`}
        >
          <Camera className="w-4 h-4" /> Camera
        </button>
        <button
          id="barcode-mode-image"
          onClick={() => setMode("image")}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${mode === "image" ? "bg-blue text-white shadow-md" : "text-text-3 hover:text-text"}`}
        >
          <ImageIcon className="w-4 h-4" /> Image
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          {mode === "camera" ? (
            <div className="relative aspect-square md:aspect-video bg-black rounded-4xl overflow-hidden border border-border shadow-xl">
              {stream ? (
                <>
                  <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                  <div className="absolute inset-0 border-[40px] border-black/40 pointer-events-none" />
                  <m.div
                    className="absolute inset-x-12 h-0.5 bg-blue shadow-glow-primary"
                    animate={{ top: ["20%", "80%", "20%"] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                  />
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-text-4 space-y-4">
                  <VideoOff className="w-16 h-16 opacity-20" />
                  <p className="text-sm font-medium">Camera is inactive</p>
                </div>
              )}
              <canvas ref={canvasRef} className="hidden" />
            </div>
          ) : (
            <DropZone
              onFilesSelected={handleImageUpload}
              accept="image/*"
              title="Upload Image"
              description="Upload an image containing a QR or barcode"
              icon={<ScanLine className="w-8 h-8" />}
            />
          )}

          {error && (
            <div className="p-4 bg-error/10 text-error text-sm font-bold rounded-xl border border-error/20" role="alert">
              {error}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <ToolResultArea value={result || ""} label="Scanned Data" />
          {result && (
            <div className="flex flex-col gap-3">
              {result.startsWith("http") && (
                <a
                  href={result}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-4 bg-blue/10 text-blue rounded-2xl font-bold hover:bg-blue/20 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" /> Open Link
                </a>
              )}
              <button
                id="barcode-recreate-qr"
                onClick={() => {
                  useWorkflowStore.getState().setPendingQrData(result);
                  router.push("/utilities/qrcode");
                }}
                className="flex items-center justify-center gap-2 w-full py-4 bg-blue text-white rounded-2xl font-bold hover:bg-blue-dark transition-colors shadow-lg shadow-blue/20"
              >
                Recreate QR
              </button>
            </div>
          )}
          {format && (
            <div className="p-4 bg-surface border border-border rounded-2xl flex items-center justify-between">
              <span className="text-xs font-bold text-text-4 uppercase tracking-widest">Format</span>
              <span className="font-bold text-blue bg-blue/10 px-3 py-1 rounded-lg">{format.toUpperCase()}</span>
            </div>
          )}
          {result && mode === "camera" && (
            <button
              id="barcode-scan-another"
              onClick={() => {
                setResult(null);
                setFormat(null);
                setScanTrigger(prev => prev + 1);
              }}
              className="w-full py-4 bg-surface border border-border text-text-2 rounded-2xl font-bold hover:border-blue hover:text-blue transition-all"
            >
              Scan Another
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

let globalAudioCtx: AudioContext | null = null;
function beep() {
  try {
    if (!globalAudioCtx) {
      globalAudioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = globalAudioCtx;
    if (ctx.state === 'suspended') ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.value = 800;
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.05);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.1);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  } catch {}
}
