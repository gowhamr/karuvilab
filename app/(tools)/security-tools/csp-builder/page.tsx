import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';
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

      <LearningHub title="Understanding Content Security Policy (CSP)">
        
        <LearningSection type="architecture" title="Mitigating XSS">
          <p>Cross-Site Scripting (XSS) occurs when an attacker tricks a browser into executing malicious JavaScript on a legitimate website. Even if your site's logic is secure, a compromised third-party script (like an analytics or ad tag) can steal your users' data.</p>
        </LearningSection>
        
        <LearningSection type="security" title="The Defensive Header">
          <p>A Content Security Policy (CSP) is an HTTP header returned by your web server that strictly declares where resources can be loaded from. For example, <code>script-src 'self' https://trusted.com;</code> tells the browser to <strong>only</strong> execute JavaScript from your own domain or <code>trusted.com</code>.</p>
          <p className="mt-2">If a hacker successfully injects <code>&lt;script src="http://evil.com/malware.js"&gt;&lt;/script&gt;</code> into a comment on your site, the user's browser will outright block the script from downloading because <code>evil.com</code> is not on the CSP allowlist.</p>
        </LearningSection>

        <LearningSection type="api" title="Nonces and Inline Scripts">
          <p>By default, a strong CSP blocks all inline scripts (like <code>&lt;script&gt;alert(1)&lt;/script&gt;</code>) and <code>eval()</code> calls to prevent reflected XSS attacks.</p>
          <p className="mt-2">To allow specific inline scripts safely, modern policies use cryptographic nonces (<code>script-src 'nonce-r4nd0m'</code>). The server generates a random string per-request, and only scripts that include that exact string in their tag (<code>&lt;script nonce="r4nd0m"&gt;</code>) will execute. This forces attackers to somehow guess the server-generated random string for their injected script to work.</p>
        </LearningSection>

        <LearningSection type="failures" title="Report-Only Mode">
          <p>Deploying a strict CSP on an existing, complex website will almost certainly break functionality because you will inevitably forget to allowlist a legitimate third-party service.</p>
          <p className="mt-2">To prevent this, deploy the policy using the <code>Content-Security-Policy-Report-Only</code> header first. In this mode, the browser won't block any scripts, but it will ping a monitoring endpoint with a JSON report every time a violation occurs. Once the reports show zero legitimate violations, you can enforce the policy.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "If an attacker successfully injects a malicious script tag into your website's HTML, how does a Content Security Policy protect the user?",
                options: [
                  "It automatically deletes the script tag from the DOM.",
                  "It instructs the browser to block execution or loading of the script if its source is not explicitly allowlisted in the policy.",
                  "It encrypts the script so it cannot execute.",
                  "It alerts the user with a popup warning."
                ],
                correctIndex: 1,
                explanation: "CSP acts as an allowlist enforced by the browser. If the script's source domain isn't explicitly approved by the server's HTTP header, the browser simply refuses to load or execute it."
              },
              {
                question: "What is the primary benefit of using a 'nonce' in your CSP's script-src directive?",
                options: [
                  "It speeds up script execution.",
                  "It encrypts the inline script.",
                  "It allows you to safely execute specific inline scripts while still blocking attacker-injected inline scripts.",
                  "It caches the policy in the browser."
                ],
                correctIndex: 2,
                explanation: "A nonce (Number Used Once) ensures that only inline scripts generated intentionally by the server (which knows the random nonce) are allowed to execute."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
