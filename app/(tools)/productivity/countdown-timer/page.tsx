import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';

import CountdownTimerClientWrapper from './CountdownTimerClientWrapper';

const toolId = 'countdown-timer';
const cat = CATEGORIES.find(c => c.id === 'productivity');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Countdown Timer"
      description="A professional countdown timer with fullscreen dashboard mode and custom alarm sounds."
      category={cat}
      toolId={toolId}
    >
      <CountdownTimerClientWrapper />
    </ToolShell>
  );
}
