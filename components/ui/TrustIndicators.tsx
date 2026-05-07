import { TRUST_INDICATORS } from "./Icons";

export function TrustIndicators() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 pt-4">
      {TRUST_INDICATORS.map(({ icon: Icon, label }) => (
        <div key={label} className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-blue/5 flex items-center justify-center group-hover:bg-blue/10 transition-colors">
            <Icon className="w-4 h-4 text-blue" />
          </div>
          <span className="text-xs font-bold text-text-4 tracking-wide uppercase">{label}</span>
        </div>
      ))}
    </div>
  );
}
