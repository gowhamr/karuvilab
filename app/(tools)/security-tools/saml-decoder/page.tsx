import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';
import SamlClientWrapper from './SamlClientWrapper';

const toolId = 'saml-decoder';
const cat = CATEGORIES.find(c => c.id === 'security');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell
      title="SAML Request & Assertion Decoder"
      description="Decode Base64/URL encoded SAML2 Requests and Responses into formatted XML with extracted attributes."
      category={cat}
      toolId={toolId}
    >
      <SamlClientWrapper />

      <LearningHub title="Understanding SAML 2.0 (Security Assertion Markup Language)">
        
        <LearningSection type="architecture" title="SSO and Federation">
          <p>SAML is an XML-based standard for exchanging authentication and authorization data between an <strong>Identity Provider (IdP)</strong> (like Okta, Entra ID) and a <strong>Service Provider (SP)</strong> (like Salesforce, KaruviLab).</p>
          <p className="mt-2">It enables Enterprise Single Sign-On (SSO). Instead of creating a password for every app, employees log into the IdP once. The IdP then sends cryptographically signed SAML XML messages to the SPs, telling them "I have authenticated this user, log them in."</p>
        </LearningSection>
        
        <LearningSection type="api" title="Requests vs Responses">
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>SAMLRequest (AuthnRequest):</strong> Sent from the SP to the IdP, usually via a browser HTTP Redirect. It says "Please authenticate this user for me." Because it passes via URL, it is often DEFLATE compressed before Base64 encoding.</li>
            <li><strong>SAMLResponse (Assertion):</strong> Sent from the IdP back to the SP, usually via an HTTP POST containing a hidden form. It contains the user's identity, attributes, and digital signatures proving it came from the IdP.</li>
          </ul>
        </LearningSection>

        <LearningSection type="security" title="XML Signature Wrapping (XSW)">
          <p>SAML relies heavily on XML Digital Signatures to prevent tampering. However, XML parsing is notoriously complex. A classic attack against SAML is <strong>XML Signature Wrapping (XSW)</strong>.</p>
          <p className="mt-2">In an XSW attack, a hacker intercepts the SAML Response, duplicates the Assertion, modifies the identity in the unsigned copy (e.g., changing their email to <code>admin@company.com</code>), and tricks the Service Provider's XML parser into verifying the signature on the original assertion but reading the identity from the fake one.</p>
        </LearningSection>

        <LearningSection type="failures" title="Missing Validation">
          <p>Service Providers must strictly validate the SAML Response to be secure. Common failures include:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li><strong>Ignoring the Audience Restriction:</strong> Failing to verify that the token was explicitly minted <em>for your app</em> (preventing token reuse across apps).</li>
            <li><strong>Not checking timestamps:</strong> Failing to enforce <code>NotBefore</code> and <code>NotOnOrAfter</code>, allowing replay attacks of old tokens.</li>
            <li><strong>Accepting unsigned assertions:</strong> The IdP must sign the assertion, the response, or both.</li>
          </ul>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "In a SAML SSO flow, why is a SAMLRequest usually compressed with DEFLATE before being Base64 encoded?",
                options: [
                  "To encrypt the data and hide it from the user.",
                  "Because it is often sent in a URL query parameter (HTTP Redirect Binding) and needs to be as short as possible to avoid URL length limits.",
                  "Because XML parsers natively require DEFLATE compression.",
                  "To speed up the Digital Signature calculation."
                ],
                correctIndex: 1,
                explanation: "HTTP Redirect binding passes the SAMLRequest in the query string. Browsers/servers have URL length limits, so DEFLATE compression is used to shrink the bloated XML."
              },
              {
                question: "What is an XML Signature Wrapping (XSW) attack?",
                options: [
                  "Stealing the private key used to sign the SAML token.",
                  "Injecting JavaScript into the XML elements.",
                  "Exploiting how an SP parses XML to make it verify a valid signature but process a maliciously altered unsigned assertion.",
                  "Bypassing the IdP login screen completely."
                ],
                correctIndex: 2,
                explanation: "XSW exploits logic flaws in XML DOM parsers, tricking them into separating the signature verification step from the data extraction step."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
