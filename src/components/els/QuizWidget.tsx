"use client";

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, XCircle, HelpCircle } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
}

interface QuizWidgetProps {
  question: string;
  options: QuizOption[];
}

export function QuizWidget({ question, options }: QuizWidgetProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const selectedOption = options.find(o => o.id === selectedId);
  const isCorrect = selectedOption?.isCorrect;

  return (
    <Card variant="interactive" padding="lg" className="border-border/50 bg-bg space-y-6">
      <div className="flex gap-3">
        <div className="w-8 h-8 rounded-full bg-blue/10 flex items-center justify-center text-blue shrink-0">
          <HelpCircle className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-sm font-bold uppercase tracking-widest text-text-3 mb-1">Concept Check</h4>
          <p className="text-body font-medium text-text-primary">{question}</p>
        </div>
      </div>

      <div className="space-y-3">
        {options.map(option => {
          const isSelected = selectedId === option.id;
          const showSuccess = isSubmitted && isSelected && option.isCorrect;
          const showError = isSubmitted && isSelected && !option.isCorrect;
          const showMissed = isSubmitted && !isSelected && option.isCorrect;

          return (
            <button
              key={option.id}
              onClick={() => {
                if (!isSubmitted) setSelectedId(option.id);
              }}
              disabled={isSubmitted}
              className={cn(
                "w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between",
                !isSubmitted && isSelected ? "border-blue bg-blue/5 shadow-sm" : "border-border/60 hover:border-blue/30 bg-surface",
                showSuccess ? "border-emerald-500 bg-emerald-500/10 text-emerald-700" : "",
                showError ? "border-red-500 bg-red-500/10 text-red-700" : "",
                showMissed ? "border-emerald-500/50 bg-emerald-500/5" : "",
                isSubmitted && !isSelected && !option.isCorrect ? "opacity-50 grayscale" : ""
              )}
            >
              <span className="font-medium">{option.text}</span>
              {showSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
              {showError && <XCircle className="w-5 h-5 text-red-500" />}
            </button>
          );
        })}
      </div>

      {!isSubmitted && (
        <div className="flex justify-end">
          <Button 
            variant="primary" 
            disabled={!selectedId} 
            onClick={() => setIsSubmitted(true)}
          >
            Check Answer
          </Button>
        </div>
      )}

      {isSubmitted && selectedOption && (
        <div className={cn(
          "p-4 rounded-xl border mt-4 animate-in fade-in slide-in-from-top-2",
          isCorrect ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-800" : "bg-blue/10 border-blue/20 text-blue-dark"
        )}>
          <p className="font-bold mb-1">
            {isCorrect ? "Correct!" : "Not quite."}
          </p>
          <p className="text-sm">
            {selectedOption.explanation}
          </p>
        </div>
      )}
    </Card>
  );
}
