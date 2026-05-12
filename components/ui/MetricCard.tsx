interface MetricCardProps {
  label: string;
  value: string;
  accent?: boolean;
  sub?: string;
}

export function MetricCard({ label, value, accent = false, sub }: MetricCardProps) {
  return (
    <dl className="bg-surface border border-border p-5 rounded-xl">
      <dt className="text-[10px] font-bold text-text-4 uppercase tracking-wider mb-1">{label}</dt>
      <dd className={`text-2xl font-black ${accent ? "text-blue" : "text-text"}`}>{value}</dd>
      {sub && <dd className="text-xs text-text-4 mt-1">{sub}</dd>}
    </dl>
  );
}
