'use client';
import dynamic from 'next/dynamic';

const CaseStudyClient = dynamic(() => import('./CaseStudyClient'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-mat-base flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#4F46E5] to-[#3B82F6] flex items-center justify-center shadow-2xl shadow-[#4F46E5]/30 animate-pulse">
          <span className="text-white font-black text-2xl" style={{ fontFamily: 'var(--font-dm-serif)' }}>KV</span>
        </div>
        <p className="text-text-2 text-sm font-medium">Loading Case Study…</p>
      </div>
    </div>
  ),
});

export function CaseStudyClientWrapper() {
  return <CaseStudyClient />;
}
