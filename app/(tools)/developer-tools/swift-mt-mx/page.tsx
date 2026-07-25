import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { swiftMtMx } from '@/src/registry/tools/swift-mt-mx';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import ToolClientWrapper from './ToolClientWrapper';
import { generateToolMetadata } from '@/src/lib/seo';

const cat = CATEGORIES.find(c => c.id === 'developer');

export const metadata: Metadata = generateToolMetadata(swiftMtMx.id);

export default function SwiftMtMxPage() {
  return (
    <ToolShell title={swiftMtMx.name} toolId={swiftMtMx.id} category={cat}>
      <ToolClientWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-swift"
          title="How it Works: MT vs MX Messages"
          preview="Learn how trillions of dollars are routed globally using archaic text formats."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              When a bank in New York sends a billion dollars to a bank in London, they don't send a JSON payload over a REST API. They use the SWIFT network (Society for Worldwide Interbank Financial Telecommunication).
            </p>
            <h3>MT (Message Text)</h3>
            <p>
              Created in the 1970s, the MT format is heavily optimized for telex machines. An MT103 (Single Customer Credit Transfer) is composed of numeric tags like <code>:20:</code> (Sender's Reference) and <code>:32A:</code> (Value Date, Currency, Amount). Because bandwidth was incredibly expensive, it is highly compressed and completely unreadable to the untrained eye.
            </p>
            <h3>MX (ISO 20022)</h3>
            <p>
              The global financial system is currently migrating to ISO 20022 (MX messages). Unlike MT, MX messages are heavily structured XML documents. While they consume significantly more bandwidth, they allow for much richer data payloads (like full addresses and compliance screening information) which are essential for modern anti-money laundering (AML) regulations.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
