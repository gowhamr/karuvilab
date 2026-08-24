'use client';

import { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, Send, Check } from 'lucide-react';
import { m, AnimatePresence } from 'framer-motion';
import { cn } from '@/src/lib/utils';
import { Turnstile } from './Turnstile';

interface ToolFeedbackProps {
  toolId: string;
  toolName: string;
}

export function ToolFeedback({ toolId, toolName }: ToolFeedbackProps) {
  const [mounted, setMounted] = useState(false);
  const [vote, setVote] = useState<'up' | 'down' | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [comment, setComment] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');

  useEffect(() => {
    Promise.resolve().then(() => {
      setMounted(true);
    });
    try {
      const saved = localStorage.getItem(`kv-feedback-${toolId}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        Promise.resolve().then(() => {
          setVote(parsed.vote);
          setSubmitted(parsed.submitted);
        });
      }
    } catch (e) {
      console.error('Error reading feedback from localStorage:', e);
    }
  }, [toolId]);

  const handleVote = async (type: 'up' | 'down') => {
    setVote(type);
    
    // For positive feedback, submit immediately without comment form
    if (type === 'up') {
      setIsSubmitting(true);
      try {
        const effectiveToken = turnstileToken || 'cf-fallback-token';
        const response = await fetch('/api/send-feedback/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fromEmail: 'anonymous@karuvilab.com',
            message: `Thumbs Up feedback for tool "${toolName}" (ID: ${toolId})`,
            category: 'other',
            diagnosticInfo: JSON.stringify({
              url: window.location.href,
              userAgent: navigator.userAgent,
              timestamp: new Date().toISOString(),
            }),
            turnstileToken: effectiveToken,
          }),
        });

        let data;
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          data = await response.json();
        } else {
          await response.text();
          throw new Error(`Server Error (${response.status}): Expected JSON but received HTML. This might be due to static hosting (like GitHub Pages) which doesn't support API routes.`);
        }

        if (!response.ok) {
          throw new Error(data?.error || 'API failed');
        }

        setSubmitted(true);
        localStorage.setItem(
          `kv-feedback-${toolId}`,
          JSON.stringify({ vote: 'up', submitted: true })
        );
      } catch (err) {
        // Even if API fails, save state locally for seamless offline UX
        setSubmitted(true);
        localStorage.setItem(
          `kv-feedback-${toolId}`,
          JSON.stringify({ vote: 'up', submitted: true })
        );
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const finalEmail = email.trim() || 'anonymous@karuvilab.com';
      const finalMessage = `Thumbs Down feedback for tool "${toolName}" (ID: ${toolId})\n\nComment: ${comment.trim()}`;
      const effectiveToken = turnstileToken || 'cf-fallback-token';
      
      const response = await fetch('/api/send-feedback/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fromEmail: finalEmail,
          message: finalMessage,
          category: 'other',
          diagnosticInfo: JSON.stringify({
            url: window.location.href,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString(),
          }),
          turnstileToken: effectiveToken,
        }),
      });

      let data;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        await response.text();
        throw new Error(`Server Error (${response.status}): Expected JSON but received HTML. This might be due to static hosting (like GitHub Pages) which doesn't support API routes.`);
      }

      if (!response.ok) {
        throw new Error(data?.error || 'Failed to submit feedback');
      }

      setSubmitted(true);
      localStorage.setItem(
        `kv-feedback-${toolId}`,
        JSON.stringify({ vote: 'down', submitted: true })
      );
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetFeedback = () => {
    setVote(null);
    setSubmitted(false);
    setComment('');
    setEmail('');
    setErrorMessage('');
    localStorage.removeItem(`kv-feedback-${toolId}`);
  };

  if (!mounted) {
    // Return placeholder of same dimensions to prevent CLS layout shift
    return (
      <div className="bg-mat-surface border border-mat-border shadow-mat-shine rounded-2xl p-5 space-y-4 min-h-28" />
    );
  }

  return (
    <div className="bg-mat-surface border border-mat-border shadow-mat-shine rounded-2xl p-5 space-y-4">
      {mounted && <Turnstile onSuccess={setTurnstileToken} invisible />}
      <AnimatePresence mode="wait">
        {submitted ? (
          <m.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20 }}
            className="flex flex-col items-center text-center space-y-3 py-2"
          >
            <m.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center",
                vote === 'up' ? "bg-success/10 text-success" : "bg-error/10 text-error"
              )}
            >
              {vote === 'up' ? (
                <ThumbsUp className="w-5 h-5 fill-current" />
              ) : (
                <ThumbsDown className="w-5 h-5 fill-current" />
              )}
            </m.div>
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-text">Thank you!</h3>
              <p className="text-xs text-text-3">
                {vote === 'up' 
                  ? "We're glad this tool was helpful!" 
                  : "Your feedback helps us make this tool better."}
              </p>
            </div>
            <button
              onClick={resetFeedback}
              className="text-xs font-bold text-brand-primary hover:underline uppercase tracking-wider pt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded-sm"
            >
              Change feedback
            </button>
          </m.div>
        ) : (
          <m.div key="vote-selection" className="space-y-4">
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-text">Was this tool helpful?</h3>
              <p className="text-xs text-text-3 leading-relaxed">
                Help us keep refining the workspace.
              </p>
            </div>

            <div className="flex gap-3">
              <m.button
                type="button"
                onClick={() => handleVote('up')}
                disabled={isSubmitting}
                className={cn(
                  "flex-1 h-11 border rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-brand-primary",
                  vote === 'up' 
                    ? "bg-success/15 border-success text-success" 
                    : "bg-mat-base border-mat-border text-text-2 hover:bg-mat-hover"
                )}
                whileHover={{ rotate: 8, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Thumbs up - tool was helpful"
              >
                {isSubmitting && vote === 'up' ? (
                  <div className="w-4 h-4 border border-success border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <ThumbsUp className="w-4 h-4" />
                    <span>Yes</span>
                  </>
                )}
              </m.button>

              <m.button
                type="button"
                onClick={() => handleVote('down')}
                disabled={isSubmitting}
                className={cn(
                  "flex-1 h-11 border rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-brand-primary",
                  vote === 'down' 
                    ? "bg-error/15 border-error text-error" 
                    : "bg-mat-base border-mat-border text-text-2 hover:bg-mat-hover"
                )}
                whileHover={{ rotate: -8, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Thumbs down - tool was not helpful"
              >
                <ThumbsDown className="w-4 h-4" />
                <span>No</span>
              </m.button>
            </div>

            <AnimatePresence>
              {vote === 'down' && (
                <m.form
                  onSubmit={handleCommentSubmit}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="space-y-3 pt-2 border-t border-mat-border overflow-hidden"
                >
                  <div className="space-y-2">
                    <label htmlFor="widget-comment" className="text-tiny font-bold uppercase tracking-widest-sm text-text-4 ml-1">
                      What can we improve?
                    </label>
                    <textarea
                      id="widget-comment"
                      required
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Tell us what went wrong..."
                      className="w-full min-h-18 p-3 bg-mat-base border border-mat-border rounded-xl outline-none focus:border-brand-primary/50 focus:ring-4 focus:ring-brand-primary/5 transition-all font-medium text-xs resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="widget-email" className="text-tiny font-bold uppercase tracking-widest-sm text-text-4 ml-1">
                      Email Address (Optional)
                    </label>
                    <input
                      id="widget-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full h-9 px-3 bg-mat-base border border-mat-border rounded-xl outline-none focus:border-brand-primary/50 focus:ring-4 focus:ring-brand-primary/5 transition-all font-medium text-xs"
                    />
                  </div>

                  {errorMessage && (
                    <p className="text-xs text-error font-bold ml-1">{errorMessage}</p>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-9 bg-brand-primary text-white rounded-xl font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 shadow-md hover:scale-102 active:scale-95 transition-all disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
                   aria-label="Send">
                    {isSubmitting ? (
                      <div className="w-3.5 h-3.5 border border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-3 h-3" />
                        <span>Send Feedback</span>
                      </>
                    )}
                  </button>
                </m.form>
              )}
            </AnimatePresence>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
