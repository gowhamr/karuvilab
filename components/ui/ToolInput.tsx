"use client";

import React from "react";

interface ToolInputProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  rows?: number;
  type?: "text" | "number" | "password";
  description?: string;
  mono?: boolean;
}

export function ToolInput({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  rows = 1, 
  type = "text",
  description,
  mono = false
}: ToolInputProps) {
  const baseClasses = `
    w-full px-4 py-3 bg-bg border border-border rounded-xl outline-none transition-all
    focus:ring-4 focus:ring-blue/10 focus:border-blue placeholder:text-text-4
    min-h-[48px] ${mono ? "font-mono text-sm" : "text-base"}
  `;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-end">
        <label className="text-sm font-bold text-text-2">{label}</label>
        {description && <span className="text-[10px] text-text-4 uppercase font-bold tracking-wider">{description}</span>}
      </div>
      {rows > 1 ? (
        <textarea
          className={baseClasses}
          rows={rows}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          type={type}
          className={baseClasses}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}
