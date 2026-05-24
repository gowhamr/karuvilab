import { ShieldCheck } from "lucide-react";

interface PrivacyBadgeProps {
  message?: string;
  className?: string;
}

export function PrivacyBadge({ message = "Processed entirely in your browser", className = "" }: PrivacyBadgeProps) {
  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50/50 dark:bg-indigo-500/5 border border-indigo-100 dark:border-indigo-500/10 rounded-lg text-xs font-medium text-indigo-700 dark:text-indigo-400 ${className}`}>
      <ShieldCheck className="w-3.5 h-3.5" />
      <span>{message}</span>
    </div>
  );
}
