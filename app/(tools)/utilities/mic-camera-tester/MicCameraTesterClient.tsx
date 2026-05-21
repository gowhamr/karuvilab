"use client";

import React, { useState, useEffect, useRef } from "react";
import { Camera, Mic, MicOff, Video, VideoOff, Settings, Camera as CameraIcon } from "lucide-react";
import { m } from "framer-motion";

export default function MicCameraTesterClient() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const startTest = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(mediaStream);
      if (videoRef.current) videoRef.current.srcObject = mediaStream;

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
    } catch (err: any) {
      setError(err.message || "Could not access camera or microphone.");
    }
  };

  const stopTest = () => {
    if (stream) stream.getTracks().forEach(track => track.stop());
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (audioContextRef.current) audioContextRef.current.close();
    setStream(null);
    setAudioLevel(0);
  };

  useEffect(() => {
    return () => stopTest();
  }, []);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="relative aspect-video bg-black rounded-[32px] overflow-hidden border border-border group shadow-2xl">
          {stream ? (
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 text-text-4">
              <VideoOff className="w-16 h-16 opacity-20" />
              <p className="text-sm font-medium">Camera is inactive</p>
            </div>
          )}
          
          <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between pointer-events-none">
            <div className="px-4 py-2 bg-black/60 backdrop-blur-md rounded-full border border-white/10 flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${stream ? 'bg-success animate-pulse' : 'bg-text-4'}`} />
              <span className="text-[10px] font-bold text-white uppercase tracking-widest">{stream ? 'Live' : 'Off'}</span>
            </div>
          </div>
        </div>

        <div className="space-y-6 flex flex-col justify-center">
          <div className="p-8 bg-surface border border-border rounded-[32px] space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Mic className="w-5 h-5 text-blue" />
                  Microphone Level
                </h3>
                <span className="text-xs font-bold text-text-4">{Math.round(audioLevel)}%</span>
              </div>
              <div className="h-4 bg-bg rounded-full overflow-hidden border border-border">
                <m.div 
                  className="h-full bg-blue shadow-[0_0_20px_rgba(79,70,229,0.5)]"
                  animate={{ width: `${Math.min(audioLevel * 1.5, 100)}%` }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={stream ? stopTest : startTest}
                className={`flex items-center justify-center gap-3 py-4 rounded-2xl font-bold transition-all ${stream ? 'bg-error/10 text-error border border-error/30 hover:bg-error/20' : 'bg-blue text-white hover:bg-blue/90 shadow-lg shadow-blue/20'}`}
              >
                {stream ? <><VideoOff className="w-5 h-5" /> Stop Test</> : <><Video className="w-5 h-5" /> Start Test</>}
              </button>
              
              <button
                disabled={!stream}
                className="flex items-center justify-center gap-3 py-4 bg-surface border border-border rounded-2xl font-bold text-text-2 hover:border-blue transition-all disabled:opacity-50"
              >
                <CameraIcon className="w-5 h-5" /> Snapshot
              </button>
            </div>

            {error && (
              <div className="p-4 bg-error/10 border border-error/20 rounded-xl flex items-center gap-3 text-error text-sm font-medium">
                <div className="w-1.5 h-1.5 rounded-full bg-error" />
                {error}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-surface border border-border rounded-2xl space-y-1">
              <p className="text-[10px] font-black text-text-4 uppercase tracking-widest">Privacy Guard</p>
              <p className="text-xs font-medium text-text-2">Stream never leaves browser</p>
            </div>
            <div className="p-4 bg-surface border border-border rounded-2xl space-y-1">
              <p className="text-[10px] font-black text-text-4 uppercase tracking-widest">Latency</p>
              <p className="text-xs font-medium text-text-2">Ultra-low local loopback</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
