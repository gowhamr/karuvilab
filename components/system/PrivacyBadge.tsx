import { ShieldCheck } from "lucide-react";

interface PrivacyBadgeProps {
  message?: string;
  className?: string;
}

export function PrivacyBadge({ message = "Processed entirely in your browser", className = "" }: PrivacyBadgeProps) {
  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue/5 border border-blue/10 rounded-lg text-xs font-medium text-blue ${className}`}>
      <ShieldCheck className="w-3.5 h-3.5" />
      <span>{message}</span>
    </div>
  );
}
