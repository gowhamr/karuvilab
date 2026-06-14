"use client";

import React, { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { m, AnimatePresence, useReducedMotion } from "framer-motion";
import { X, Send, CircleAlert as AlertCircle, Sparkles, CircleCheckBig as CheckCircle2, Monitor, Info, ChevronDown } from "lucide-react";
import { useSupportStore, FeedbackType } from "@/src/store/useSupportStore";
import { getSystemInfo, SystemInfo } from "@/src/lib/support-utils";
import { cn } from "@/src/lib/utils";
import { FileUpload } from "./FileUpload";
import { supportsBlur } from "@/src/lib/deviceCapability";

const FEEDBACK_OPTIONS: { value: FeedbackType; label: string; icon: any }[] = [
  { value: "calculation", label: "Calculation Wrong", icon: AlertCircle },
  { value: "bug", label: "UI Broken", icon: AlertCircle },
  { value: "performance", label: "Performance Issue", icon: AlertCircle },
  { value: "feature", label: "Feature Request", icon: Sparkles },
  { value: "other", label: "Other", icon: Info },
];

export function FeedbackModal() {
  const shouldReduceMotion = useReducedMotion();
  const isOpen = useSupportStore(state => state.isOpen);
  const closeFeedback = useSupportStore(state => state.closeFeedback);
  const type = useSupportStore(state => state.type);
  const context = useSupportStore(state => state.context);
  const setType = (t: FeedbackType) => useSupportStore.setState({ type: t });

  const [description, setDescription] = useState("");
  const [fromEmail, setFromEmail] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [sysInfo, setSysInfo] = useState<SystemInfo | null>(null);
  const [blurEnabled, setBlurEnabled] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setBlurEnabled(supportsBlur());
      setSysInfo(getSystemInfo());
      setIsSuccess(false);
      setDescription("");
      setFromEmail("");
      setScreenshot(null);
      setErrorMessage("");
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    
    try {
      const response = await fetch('/api/send-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fromEmail,
          message: description,
          category: type,
          diagnosticInfo: JSON.stringify(sysInfo),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit feedback');
      }

      setIsSuccess(true);
      setTimeout(() => {
        closeFeedback();
      }, 2000);
    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && closeFeedback()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[300] bg-black/50 backdrop-blur-sm animate-in fade-in duration-300" />
        
        <Dialog.Content className={cn(
          "fixed z-[301] overflow-hidden flex flex-col transition-all duration-300",
          blurEnabled ? "kv-glass" : "bg-mat-overlay border border-mat-border shadow-mat-shine",
          // Mobile: Bottom Sheet
          "bottom-0 left-0 right-0 rounded-t-[32px] max-h-[90vh] animate-in slide-in-from-bottom-full md:slide-in-from-bottom-0",
          // Desktop: Centered Modal
          "md:bottom-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:rounded-4xl md:max-h-[85vh]"
        )}>
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-6 border-b border-border/50">
            <div>
              <Dialog.Title className="text-xl font-black tracking-tight">
                {isSuccess ? "Thank You!" : "Feedback"}
              </Dialog.Title>
              <Dialog.Description className="text-xs font-black uppercase tracking-widest text-text-4">
                {isSuccess ? "We've received your report" : "Help us improve KV"}
              </Dialog.Description>
            </div>
            <Dialog.Close className="p-2 hover:bg-bg rounded-xl text-text-4 transition-all active:scale-90" aria-label="Close feedback dialog">
              <X className="w-5 h-5" />
            </Dialog.Close>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar">
            <AnimatePresence mode="wait">
              {isSuccess ? (
                <m.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.4 }}
                  className="py-12 flex flex-col items-center text-center space-y-4"
                >
                  <div className="w-20 h-20 rounded-full bg-blue/10 flex items-center justify-center text-blue">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-black text-lg">Report Submitted</h3>
                    <p className="text-sm text-text-4 font-bold">Our team will review this shortly.</p>
                  </div>
                </m.div>
              ) : (
                <m.form 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
                  onSubmit={handleSubmit} 
                  className="space-y-6"
                >
                  {/* Context Banner */}
                  {context?.toolName && (
                    <div className="p-4 bg-brand-primary/5 border border-brand-primary/10 rounded-2xl flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center text-white">
                        <Monitor className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-tiny font-black text-brand-primary uppercase tracking-widest">Reporting For</p>
                        <p className="text-xs font-bold text-text truncate">{context.toolName}</p>
                      </div>
                    </div>
                  )}

                  {/* Issue Type */}
                  <div className="space-y-2">
                    <label htmlFor="issue-type" className="text-xs font-black uppercase tracking-widest text-text-4 ml-1">Type of Feedback</label>
                    <div className="relative">
                      <select 
                        id="issue-type"
                        value={type}
                        onChange={(e) => setType(e.target.value as FeedbackType)}
                        className="w-full h-14 px-5 pr-12 bg-mat-base border border-mat-border rounded-2xl outline-none focus:border-brand-primary/50 focus:ring-4 focus:ring-brand-primary/5 transition-all font-bold text-sm appearance-none"
                      >
                        {FEEDBACK_OPTIONS.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-4 pointer-events-none" />
                    </div>
                  </div>

                  {/* Email Address */}
                  <div className="space-y-2">
                    <label htmlFor="feedback-email" className="text-xs font-black uppercase tracking-widest text-text-4 ml-1">Email Address</label>
                    <input 
                      id="feedback-email"
                      type="email"
                      required
                      value={fromEmail}
                      onChange={(e) => setFromEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full h-14 px-5 bg-mat-base border border-mat-border rounded-2xl outline-none focus:border-brand-primary/50 focus:ring-4 focus:ring-brand-primary/5 transition-all font-bold text-sm"
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <label htmlFor="feedback-description" className="text-xs font-black uppercase tracking-widest text-text-4 ml-1">Description</label>
                    <textarea 
                      id="feedback-description"
                      required
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="What happened? Any steps to reproduce?"
                      className="w-full min-h-30 p-5 bg-mat-base border border-mat-border rounded-2xl outline-none focus:border-brand-primary/50 focus:ring-4 focus:ring-brand-primary/5 transition-all font-bold text-sm resize-none"
                    />
                  </div>

                  {/* Screenshot */}
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-text-4 ml-1">Attach Screenshot (Optional)</label>
                    <FileUpload 
                      onFileSelect={setScreenshot}
                      className="group relative w-full h-20 border-2 border-dashed border-mat-border rounded-2xl flex items-center justify-center bg-mat-base/50 hover:bg-mat-surface hover:border-brand-primary/30 transition-colors cursor-pointer"
                    />
                  </div>

                  {/* System Info */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between ml-1">
                       <label className="text-xs font-black uppercase tracking-widest text-text-4">Diagnostic Info</label>
                       <span className="text-tiny font-bold text-text-4 opacity-60 italic">Captured automatically</span>
                    </div>
                    <div className="p-4 bg-elevated/50 border border-border rounded-2xl space-y-2 text-xs font-bold text-text-3 font-mono">
                      <div className="flex justify-between border-b border-border/50 pb-2">
                        <span>Browser</span>
                        <span className="text-text">{sysInfo?.browser}</span>
                      </div>
                      <div className="flex justify-between border-b border-border/50 pb-2">
                        <span>OS</span>
                        <span className="text-text">{sysInfo?.os}</span>
                      </div>
                      <div className="flex justify-between border-b border-border/50 pb-2">
                        <span>Screen</span>
                        <span className="text-text">{sysInfo?.screenSize}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Route</span>
                        <span className="text-text truncate ml-4">{context?.route || "/"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Error Message */}
                  {errorMessage && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      <p className="text-xs font-bold">{errorMessage}</p>
                    </div>
                  )}

                  {/* Submit */}
                  <div className="space-y-3">
                    <button 
                      disabled={isSubmitting}
                      type="submit"
                      className="w-full h-16 bg-brand-primary text-white rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-md shadow-brand-primary/10 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
                     aria-label="Send">
                      {isSubmitting ? (
                        <div className="w-5 h-5 border border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Submit Feedback
                        </>
                      )}
                    </button>
                    <p className="text-xs text-center font-bold text-text-4">
                      Your message will be transmitted securely to our support team. No file contents are ever included.
                    </p>
                  </div>
                </m.form>
              )}
            </AnimatePresence>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
