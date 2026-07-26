import React from 'react';
import { Card } from '@/components/ui/Card';
import { BookOpen, GraduationCap, ShieldCheck, Zap, Server, AlertTriangle } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface LearningHubProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function LearningHub({ title, description, children }: LearningHubProps) {
  return (
    <div className="w-full mt-16 space-y-8 pb-16">
      <div className="flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-blue/10 text-blue flex items-center justify-center shadow-sm">
          <GraduationCap className="w-8 h-8" />
        </div>
        <h2 className="text-3xl md:text-4xl font-black tracking-tight text-text-primary">
          {title}
        </h2>
        {description && (
          <p className="text-text-secondary text-lg max-w-2xl">
            {description}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {children}
      </div>
    </div>
  );
}

export type LearningSectionType = 'architecture' | 'api' | 'security' | 'performance' | 'standards' | 'failures' | 'general' | 'algorithm';

interface LearningSectionProps {
  type?: LearningSectionType;
  title: string;
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
}

const SECTION_ICONS: Record<LearningSectionType, React.ElementType> = {
  architecture: Server,
  api: BookOpen,
  security: ShieldCheck,
  performance: Zap,
  standards: BookOpen,
  failures: AlertTriangle,
  general: BookOpen,
  algorithm: Server,
};

export function LearningSection({ type = 'general', title, children, className, fullWidth }: LearningSectionProps) {
  const Icon = SECTION_ICONS[type];

  return (
    <Card 
      variant="glass" 
      padding="lg" 
      className={cn(
        "flex flex-col gap-4 shadow-sm relative overflow-hidden", 
        fullWidth ? "md:col-span-2 lg:col-span-3" : "",
        className
      )}
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-blue" />
      <div className="flex items-center gap-3 border-b border-border/50 pb-4">
        <div className="w-8 h-8 rounded-lg bg-blue/10 flex items-center justify-center text-blue">
          <Icon className="w-4 h-4" />
        </div>
        <h3 className="text-lg font-bold text-text-primary">
          {title}
        </h3>
      </div>
      <div className="text-text-secondary text-body leading-relaxed space-y-4">
        {children}
      </div>
    </Card>
  );
}
