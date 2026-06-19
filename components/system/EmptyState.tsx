import { ReactNode } from "react";
import { Check, ShieldCheck, Zap } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: ReactNode;
  cta?: {
    label: string;
    onClick: () => void;
  };
  workflow?: string[];
  benefits?: string[];
  formats?: string[];
  className?: string;
}

export function EmptyState({ 
  title, 
  description, 
  icon, 
  cta, 
  workflow, 
  benefits,
  formats,
  className = "" 
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-12 text-center bg-surface border-2 border-dashed border-border rounded-4xl ${className}`}>
      {icon && (
        <div className="w-16 h-16 mb-6 text-blue bg-blue/5 rounded-2xl flex items-center justify-center">
          {icon}
        </div>
      )}
      
      <div className="space-y-3 mb-8">
        <h3 className="text-2xl font-black text-text tracking-tight">{title}</h3>
        <p className="text-base text-text-3 max-w-xl mx-auto leading-relaxed font-medium">
          {description}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl mb-10 text-left">
        {benefits && benefits.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-tiny font-bold uppercase tracking-widest-sm text-text-4 flex items-center gap-2">
              <Zap className="w-3 h-3 text-blue" /> Key Benefits
            </h4>
            <ul className="space-y-2">
              {benefits.map((benefit, i) => (
                <li key={i} className="flex items-start gap-2 text-sm font-bold text-text-2">
                  <Check className="w-4 h-4 text-success shrink-0 mt-0.5" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        )}

        {formats && formats.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-tiny font-bold uppercase tracking-widest-sm text-text-4">Supported Formats</h4>
            <div className="flex flex-wrap gap-2">
              {formats.map((f, i) => (
                <span key={i} className="px-2.5 py-1 bg-bg border border-border rounded-lg text-xs font-black text-text-4 uppercase tracking-tighter">
                  {f}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="w-full max-w-2xl p-6 bg-blue/5 border border-blue/10 rounded-2xl mb-10 flex items-center gap-4 text-left">
        <ShieldCheck className="w-8 h-8 text-blue shrink-0" />
        <div className="space-y-1">
          <p className="text-xs font-black text-blue uppercase tracking-widest">Privacy First</p>
          <p className="text-sm font-bold text-text-2">All processing occurs directly in your browser. Files are not uploaded to any server.</p>
        </div>
      </div>

      {cta && (
        <button
          onClick={cta.onClick}
          className="h-14 px-8 bg-blue text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-102 active:scale-95 transition-all shadow-md shadow-blue/10"
        >
          {cta.label}
        </button>
      )}

      {workflow && workflow.length > 0 && (
        <div className="mt-12 pt-12 border-t border-border w-full text-left">
          <p className="text-tiny font-bold uppercase tracking-widest-sm text-text-4 mb-6">Standard Workflow</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {workflow.map((step, idx) => (
              <div key={idx} className="flex flex-col gap-1">
                <span className="text-xs font-black text-blue/40 uppercase tracking-widest">Step {idx + 1}</span>
                <p className="text-xs font-bold text-text-2 leading-snug">{step}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
