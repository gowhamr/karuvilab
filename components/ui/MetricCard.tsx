interface MetricCardProps {
  label: string;
  value: string;
  accent?: boolean;
  sub?: string;
}

export function MetricCard({ label, value, accent = false, sub }: MetricCardProps) {
  return (
    <div className="bg-surface border border-border p-5 rounded-xl">
      <div className="text-[10px] font-bold text-text-4 uppercase tracking-wider mb-1">{label}</div>
      <div className={`text-2xl font-black ${accent ? "text-blue" : "text-text"}`}>{value}</div>
      {sub && <div className="text-xs text-text-4 mt-1">{sub}</div>}
    </div>
  );
}
