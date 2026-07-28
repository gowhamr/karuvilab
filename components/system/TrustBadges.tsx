import { ShieldCheck, CloudOff, WifiOff, Wifi, UserMinus } from "lucide-react";
import { m } from "framer-motion";

interface TrustBadgeProps {
  className?: string;
  requiresNetwork?: boolean | undefined;
}

export function TrustBadges({ className = "", requiresNetwork = false }: TrustBadgeProps) {
  const badges = [
    { icon: CloudOff, label: "No Uploads", color: "text-blue" },
    { icon: ShieldCheck, label: "Browser Processing", color: "text-success" },
    requiresNetwork ? { icon: Wifi, label: "Requires Network", color: "text-blue" } : null,
    { icon: UserMinus, label: "No Account Required", color: "text-text-4" },
  ].filter(Boolean) as { icon: any; label: string; color: string }[];

  return (
    <div className={`flex flex-wrap items-center gap-4 lg:gap-6 ${className}`}>
      {badges.map((badge, i) => (
        <m.div
          key={badge.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-surface/50 border border-border/40 rounded-xl"
        >
          <badge.icon className={`w-3.5 h-3.5 ${badge.color}`} />
          <span className="text-tiny font-bold uppercase tracking-widest-sm text-text-3">
            {badge.label}
          </span>
        </m.div>
      ))}
    </div>
  );
}
