"use client";

import { IMAGE_FORMATS, PRESETS, ImageFormat, ConversionPreset } from "../types";
import { SliderField } from "@/components/ui/SliderField";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/Accordion";
import { Settings2, Zap, Scaling, Crown } from "lucide-react";
import { motion } from "framer-motion";

interface ImageConverterControlsProps {
  targetFmt: ImageFormat;
  setTargetFmt: (fmt: ImageFormat) => void;
  quality: number;
  setQuality: (q: number) => void;
  preset: ConversionPreset;
  setPreset: (p: ConversionPreset) => void;
}

export function ImageConverterControls({
  targetFmt,
  setTargetFmt,
  quality,
  setQuality,
  preset,
  setPreset,
}: ImageConverterControlsProps) {
  const fmtInfo = IMAGE_FORMATS.find((f) => f.value === targetFmt)!;

  const handlePresetChange = (p: ConversionPreset) => {
    setPreset(p);
    setQuality(PRESETS[p].quality);
  };

  const getPresetIcon = (p: ConversionPreset) => {
    switch (p) {
      case "fast": return <Zap className="w-4 h-4" />;
      case "balanced": return <Scaling className="w-4 h-4" />;
      case "high-quality": return <Crown className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-surface border border-border rounded-4xl p-6 sm:p-8 shadow-sm space-y-8">
      {/* Format Selection */}
      <div className="space-y-4">
        <label className="text-tiny font-bold uppercase tracking-widest-sm-lg text-text-4">
          Output Format
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {IMAGE_FORMATS.map((f) => (
            <button
              key={f.value}
              onClick={() => setTargetFmt(f.value)}
              className={`relative py-4 rounded-2xl text-tiny font-bold uppercase tracking-widest-sm transition-all border ${
                targetFmt === f.value
                  ? "bg-blue text-white border-blue shadow-lg shadow-blue/20"
                  : "bg-bg text-text-3 border-border hover:border-blue/50"
              }`}
            >
              {f.label}
              {targetFmt === f.value && (
                <motion.div
                  layoutId="active-fmt"
                  className="absolute inset-0 rounded-2xl border-2 border-white/20"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Presets */}
      <div className="space-y-4">
        <label className="text-tiny font-bold uppercase tracking-widest-sm-lg text-text-4">
          Conversion Preset
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(Object.keys(PRESETS) as ConversionPreset[]).map((p) => (
            <button
              key={p}
              onClick={() => handlePresetChange(p)}
              className={`flex items-start gap-4 p-4 rounded-2xl transition-all border text-left ${
                preset === p
                  ? "bg-blue/5 border-blue"
                  : "bg-bg border-border hover:border-border/80"
              }`}
            >
              <div className={`mt-0.5 p-2 rounded-xl ${
                preset === p ? "bg-blue text-white" : "bg-surface text-text-4"
              }`}>
                {getPresetIcon(p)}
              </div>
              <div>
                <p className={`font-black text-xs uppercase tracking-wider ${
                  preset === p ? "text-blue" : "text-text"
                }`}>
                  {PRESETS[p].label}
                </p>
                <p className="text-xs text-text-4 font-medium mt-0.5 leading-relaxed">
                  {PRESETS[p].description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Options */}
      <Accordion type="single" collapsible className="border-t border-border pt-2">
        <AccordionItem value="advanced" className="border-none">
          <AccordionTrigger className="hover:no-underline py-2">
            <div className="flex items-center gap-2 text-text-3">
              <Settings2 className="w-4 h-4" />
              <span className="text-xs font-black uppercase tracking-wider">Advanced Settings</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-6 space-y-6">
            {fmtInfo.lossy && (
              <SliderField
                id="quality"
                label="Quality Compression"
                min={1}
                max={100}
                value={quality}
                onChange={setQuality}
                format={(v) => `${v}%`}
              />
            )}
            {!fmtInfo.lossy && (
              <p className="text-xs text-text-4 italic">
                {fmtInfo.label} is a lossless format. Quality settings do not apply.
              </p>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
