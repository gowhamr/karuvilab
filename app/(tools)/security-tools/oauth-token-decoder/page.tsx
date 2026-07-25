import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';
import OAuthClientWrapper from './OAuthClientWrapper';

const toolId = 'oauth-token-decoder';
const cat = CATEGORIES.find(c => c.id === 'security');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell
      title="OAuth 2.0 Token Decoder & Inspector"
      description="Inspect OAuth 2.0 access tokens, identity tokens, scopes, claims, client IDs, and expiration status."
      category={cat}
      toolId={toolId}
    >
      <OAuthClientWrapper />

      <LearningHub title="Understanding OAuth 2.0 and OIDC">
        
        <LearningSection type="architecture" title="Delegated Authorization">
          <p>OAuth 2.0 is an authorization framework that enables a third-party application to obtain limited access to an HTTP service, either on behalf of a resource owner by orchestrating an approval interaction, or by allowing the third-party application to obtain access on its own behalf.</p>
          <p className="mt-2">For example, it allows a website to access your Google Contacts without you ever giving that website your Google password. It solves the "password anti-pattern".</p>
        </LearningSection>
        
        <LearningSection type="api" title="Tokens: Access vs ID">
          <p>Modern flows typically involve two types of tokens:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Access Token (OAuth):</strong> Used to access APIs (e.g., read emails, post a tweet). It proves <em>authorization</em>. It is meant to be read by the API server (the Resource Server), not the client app.</li>
            <li><strong>ID Token (OpenID Connect):</strong> Used to log the user into the client application. It proves <em>authentication</em>. It is meant to be read by the client app to know who logged in.</li>
          </ul>
        </LearningSection>

        <LearningSection type="security" title="The Format: JWT vs Opaque">
          <p>The OAuth 2.0 specification does <strong>not</strong> require tokens to be JWTs. Tokens can be "Opaque" (just a random string of characters) where the API server must ask the Authorization Server "Is this token valid?" for every request.</p>
          <p className="mt-2">However, most modern systems use JSON Web Tokens (JWTs) as Access Tokens. This allows the API server to cryptographically verify the token offline, greatly improving system performance and scalability.</p>
        </LearningSection>

        <LearningSection type="failures" title="The Implicit Flow is Dead">
          <p>Historically, Single Page Applications (SPAs) used the "Implicit Flow" to receive tokens directly in the URL hash fragment (<code>#access_token=...</code>). This was dangerous because the token could be logged in browser history or leaked via the <code>Referer</code> header.</p>
          <p className="mt-2">Today, best practice requires SPAs and mobile apps to use the <strong>Authorization Code Flow with PKCE</strong>. The app receives a short-lived one-time code, which it exchanges for tokens via a secure POST request, keeping the tokens out of the URL.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "According to OAuth 2.0 and OpenID Connect, which token should a client application use to access a backend API on behalf of the user?",
                options: [
                  "The ID Token",
                  "The Access Token",
                  "The Refresh Token",
                  "The Authorization Code"
                ],
                correctIndex: 1,
                explanation: "The Access Token is designed for API authorization. The ID Token is strictly for authenticating the user to the client application itself."
              },
              {
                question: "Why has the OAuth 2.0 'Implicit Flow' been deprecated for modern web applications?",
                options: [
                  "It is too slow.",
                  "It exposes the Access Token in the URL, risking leakage to browser history or Referer headers.",
                  "It does not support JWTs.",
                  "It requires a client secret, which SPAs cannot secure."
                ],
                correctIndex: 1,
                explanation: "Returning tokens in the URL fragment is a security risk. The Authorization Code flow with PKCE is now the standard for public clients."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
