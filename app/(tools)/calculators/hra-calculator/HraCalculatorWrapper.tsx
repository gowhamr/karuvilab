'use client';
import dynamic from 'next/dynamic';
import { ToolSkeleton } from '@/components/ui/ToolSkeleton';

const HraCalculatorClient = dynamic(() => import('./HraCalculatorClient'), { ssr: false, loading: () => <ToolSkeleton /> });

export default function HraCalculatorWrapper() {
  return <HraCalculatorClient />;
}