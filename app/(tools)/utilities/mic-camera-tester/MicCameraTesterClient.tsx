"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Camera, Mic, MicOff, Video, VideoOff, Settings, Camera as CameraIcon, RefreshCw, Download } from "lucide-react";
import { m, AnimatePresence } from "framer-motion";
import { ToolShell } from "@/components/ui/ToolShell";

export default function MicCameraTesterClient() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<string>("");
  const [selectedAudio, setSelectedAudio] = useState<string>("");
  const [isInitializing, setIsInitializing] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices()
      .then(deviceList => {
        setDevices(deviceList);
        const videoInputs = deviceList.filter(d => d.kind === "videoinput");
        const audioInputs = deviceList.filter(d => d.kind === "audioinput");
        if (videoInputs.length > 0 && videoInputs[0]) setSelectedVideo(videoInputs[0].deviceId);
        if (audioInputs.length > 0 && audioInputs[0]) setSelectedAudio(audioInputs[0].deviceId);
      })
      .catch(err => {
        console.warn("Could not enumerate devices:", err);
      });
  }, []);

  const stopTest = useCallback(() => {
    if (stream) stream.getTracks().forEach(track => track.stop());
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
    }
    setStream(null);
    setAudioLevel(0);
    setIsInitializing(false);
  }, [stream]);

  const startTest = async () => {
    setIsInitializing(true);
    setError(null);
    stopTest();

    try {
      const constraints: MediaStreamConstraints = {
        video: selectedVideo ? { deviceId: { exact: selectedVideo } } : true,
        audio: selectedAudio ? { deviceId: { exact: selectedAudio } } : true,
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      // Audio analysis
      audioContextRef.current = new AudioContext();
      analyzerRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(mediaStream);
      source.connect(analyzerRef.current);
      analyzerRef.current.fftSize = 256;

      const bufferLength = analyzerRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateAudioLevel = () => {
        if (analyzerRef.current) {
          analyzerRef.current.getByteFrequencyData(dataArray);
          const sum = dataArray.reduce((a, b) => a + b, 0);
          setAudioLevel(sum / bufferLength);
        }
        animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
      };
      updateAudioLevel();

      // Refresh device list to get true names once permission is granted
      navigator.mediaDevices.enumerateDevices().then(setDevices).catch(() => {});

    } catch (err: any) {
      console.error(err);
      setError(err.name === 'NotAllowedError' ? "Permission denied. Please allow access in your browser settings." : (err.message || "Could not access hardware. Ensure it is not used by another app."));
    } finally {
      setIsInitializing(false);
    }
  };

  useEffect(() => {
    return () => stopTest();
  }, [stopTest]);

  const takeSnapshot = () => {
    if (!videoRef.current || !canvasRef.current || !stream) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `snapshot-${new Date().getTime()}.png`;
      link.click();
    }
  };

  const handleDeviceChange = (kind: "video" | "audio", deviceId: string) => {
    if (kind === "video") setSelectedVideo(deviceId);
    else setSelectedAudio(deviceId);
    
    // Automatically restart with new device if already running
    if (stream) {
      setTimeout(startTest, 100);
    }
  };

  return (
    <ToolShell
      title="Mic & Camera Tester"
      description="Privately verify your webcam and microphone functionality entirely within your browser."
    >
      <div className="space-y-8">
        {/* Error Recovery Banner */}
        <AnimatePresence>
          {error && (
            <m.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0 }}
              className="p-4 bg-error/10 border border-error/20 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-error"
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-error animate-pulse" />
                <div>
                  <p className="text-sm font-bold">Failed to load media devices</p>
                  <p className="text-[10px] uppercase tracking-widest opacity-80 mt-1">{error}</p>
                </div>
              </div>
              <button 
                onClick={startTest}
                className="px-4 py-2 bg-error text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:opacity-90 flex items-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" /> Retry
              </button>
            </m.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Hardware View */}
          <div className="relative aspect-video bg-surface rounded-4xl overflow-hidden border border-border group shadow-sm flex items-center justify-center">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className={`w-full h-full object-cover transition-opacity duration-300 ${stream && !isInitializing ? 'opacity-100' : 'opacity-0'}`} 
            />
            
            {(!stream || isInitializing) && (
              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 text-text-4 bg-bg/50 backdrop-blur-sm">
                {isInitializing ? (
                  <RefreshCw className="w-12 h-12 animate-spin text-blue" aria-hidden="true" />
                ) : (
                  <>
                    <VideoOff className="w-16 h-16 opacity-20" aria-hidden="true" />
                    <p className="text-sm font-medium uppercase tracking-widest text-text-3">Stream Inactive</p>
                  </>
                )}
              </div>
            )}
            
            {stream && !isInitializing && (
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                <div className="px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full border border-white/10 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                  <span className="text-[9px] font-black text-white uppercase tracking-widest">Live</span>
                </div>
              </div>
            )}
            
            <canvas ref={canvasRef} className="hidden" aria-hidden="true" />
          </div>

          {/* Controls & Metrics */}
          <div className="space-y-6 flex flex-col justify-center">
            <div className="p-6 sm:p-8 bg-surface border border-border rounded-4xl space-y-8">
              
              {/* Device Selectors */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="video-select" className="text-[10px] font-black uppercase tracking-widest text-text-4 ml-2">Camera</label>
                  <select 
                    id="video-select"
                    className="w-full px-4 py-3 bg-bg border border-border rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue outline-none"
                    value={selectedVideo}
                    onChange={(e) => handleDeviceChange("video", e.target.value)}
                    disabled={isInitializing}
                  >
                    {devices.filter(d => d.kind === "videoinput").map(d => (
                      <option key={d.deviceId} value={d.deviceId}>{d.label || `Camera ${d.deviceId.substring(0,5)}...`}</option>
                    ))}
                    {devices.filter(d => d.kind === "videoinput").length === 0 && <option value="">Default Camera</option>}
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="audio-select" className="text-[10px] font-black uppercase tracking-widest text-text-4 ml-2">Microphone</label>
                  <select 
                    id="audio-select"
                    className="w-full px-4 py-3 bg-bg border border-border rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue outline-none"
                    value={selectedAudio}
                    onChange={(e) => handleDeviceChange("audio", e.target.value)}
                    disabled={isInitializing}
                  >
                    {devices.filter(d => d.kind === "audioinput").map(d => (
                      <option key={d.deviceId} value={d.deviceId}>{d.label || `Mic ${d.deviceId.substring(0,5)}...`}</option>
                    ))}
                    {devices.filter(d => d.kind === "audioinput").length === 0 && <option value="">Default Microphone</option>}
                  </select>
                </div>
              </div>

              {/* Audio Meter */}
              <div className="space-y-3">
                <dl className="flex justify-between items-end">
                  <dt className="text-sm font-bold flex items-center gap-2">
                    <Mic className="w-4 h-4 text-blue" aria-hidden="true" />
                    Input Level
                  </dt>
                  <dd className="text-xs font-bold text-text-4 tabular-nums w-8 text-right">{Math.round(audioLevel)}%</dd>
                </dl>
                <div className="h-3 bg-bg rounded-full overflow-hidden border border-border">
                  <m.div 
                    className="h-full bg-blue shadow-[0_0_20px_rgba(79,70,229,0.5)]"
                    animate={{ width: `${Math.min(audioLevel * 1.5, 100)}%` }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={stream ? stopTest : startTest}
                  disabled={isInitializing}
                  className={`flex items-center justify-center gap-2 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                    stream 
                      ? 'bg-error/10 text-error border border-error/30 hover:bg-error/20' 
                      : 'bg-blue text-white hover:bg-blue/90 shadow-md shadow-blue/10'
                  } disabled:opacity-50`}
                >
                  {stream ? <><VideoOff className="w-4 h-4" aria-hidden="true" /> Stop Test</> : <><Video className="w-4 h-4" aria-hidden="true" /> Start Test</>}
                </button>
                
                <button
                  onClick={takeSnapshot}
                  disabled={!stream || isInitializing}
                  className="flex items-center justify-center gap-2 py-3.5 bg-surface border border-border rounded-xl font-black text-xs uppercase tracking-widest text-text-2 hover:border-blue hover:text-blue transition-all disabled:opacity-30 disabled:hover:border-border disabled:hover:text-text-2"
                >
                  <CameraIcon className="w-4 h-4" aria-hidden="true" /> Snapshot
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <dl className="p-4 bg-surface border border-border rounded-2xl space-y-1">
                <dt className="text-[9px] font-black text-blue uppercase tracking-widest flex items-center gap-1.5">
                  <Settings className="w-3 h-3" aria-hidden="true" /> Privacy
                </dt>
                <dd className="text-xs font-bold text-text-2 leading-tight">Stream never leaves browser</dd>
              </dl>
              <dl className="p-4 bg-surface border border-border rounded-2xl space-y-1">
                <dt className="text-[9px] font-black text-success uppercase tracking-widest flex items-center gap-1.5">
                  <RefreshCw className="w-3 h-3" aria-hidden="true" /> Latency
                </dt>
                <dd className="text-xs font-bold text-text-2 leading-tight">Zero-delay local loopback</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </ToolShell>
  );
}