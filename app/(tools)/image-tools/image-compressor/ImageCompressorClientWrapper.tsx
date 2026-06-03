"use client";

import dynamic from 'next/dynamic';

const ImageCompressorClient = dynamic(() => import('@/src/features/image-compressor/components/ImageCompressorClient'), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-video bg-surface border border-border rounded-[32px] flex items-center justify-center animate-pulse">
      <div className="text-text-4 font-black uppercase tracking-widest">Initializing Engine...</div>
    </div>
  ),
});

export default function ImageCompressorClientWrapper() {
  return <ImageCompressorClient />;
}
