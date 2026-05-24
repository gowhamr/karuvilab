import { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: ReactNode;
  cta?: {
    label: string;
    onClick: () => void;
  };
  workflow?: string[];
  className?: string;
}

export function EmptyState({ title, description, icon, cta, workflow, className = "" }: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center bg-slate-50/50 dark:bg-slate-800/20 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700/50 ${className}`}>
      {icon && (
        <div className="w-12 h-12 mb-4 text-indigo-500/80 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl flex items-center justify-center">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>

      {workflow && workflow.length > 0 && (
        <div className="text-left w-full max-w-xs mb-6 space-y-3">
          <p className="text-xs font-medium text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">Sample Workflow</p>
          <ol className="space-y-2 relative border-l border-slate-200 dark:border-slate-700 ml-2">
            {workflow.map((step, idx) => (
              <li key={idx} className="text-sm text-slate-600 dark:text-slate-400 pl-4 relative">
                <span className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-700 ring-4 ring-slate-50 dark:ring-[#0F172A]" />
                {step}
              </li>
            ))}
          </ol>
        </div>
      )}

      {cta && (
        <button
          onClick={cta.onClick}
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-900"
        >
          {cta.label}
        </button>
      )}
    </div>
  );
}
