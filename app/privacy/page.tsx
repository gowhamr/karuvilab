import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | KaruviLab",
  description: "Learn how KaruviLab protects your data. Discover our local-first, zero-upload processing philosophy and how we comply with GDPR, CCPA, and AdSense requirements.",
};

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 space-y-8">
      <h1 className="text-4xl font-black tracking-tight text-text">Privacy Policy</h1>
      <p className="text-text-4 font-bold">Effective Date: May 30, 2026</p>

      <section className="space-y-4 text-text-2 leading-relaxed">
        <h2 className="text-2xl font-black text-text">1. Introduction & Our Privacy Philosophy</h2>
        <p>
          Welcome to KaruviLab ("KV", "we", "our", "us"). We are fundamentally committed to your privacy. 
          Unlike traditional web applications, KaruviLab is built on a <strong>Local-First, Zero-Server-Upload</strong> architecture. 
          This means the vast majority of our tools process your data (images, PDFs, text, code, financial inputs) 
          entirely within your web browser. Your sensitive files and inputs are never uploaded to, processed by, 
          or stored on our servers.
        </p>
      </section>

      <section className="space-y-4 text-text-2 leading-relaxed">
        <h2 className="text-2xl font-black text-text">2. Information We Do Not Collect</h2>
        <p>Because of our browser-native architecture, we <strong>do not</strong> collect, store, or have access to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>The contents of any files (PDFs, Images, Audio, Video) you process.</li>
          <li>Financial data entered into our calculators.</li>
          <li>Source code or text pasted into our developer tools.</li>
          <li>Account passwords (as we do not require mandatory account creation).</li>
        </ul>
      </section>

      <section className="space-y-4 text-text-2 leading-relaxed">
        <h2 className="text-2xl font-black text-text">3. Information We Collect</h2>
        <p>While your tool data remains entirely on your device, we do collect limited, non-personally identifiable information to keep the website functional and secure:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Technical Data:</strong> Browser type, operating system, network status, and general device information.</li>
          <li><strong>Analytics Data:</strong> Aggregated, anonymized data regarding page views, tool usage frequency, and error reports to help us improve performance.</li>
          <li><strong>Contact Data:</strong> If you reach out to us via email for support or feedback, we collect your email address and message contents solely to respond to your inquiry.</li>
        </ul>
      </section>

      <section className="space-y-4 text-text-2 leading-relaxed">
        <h2 className="text-2xl font-black text-text">4. Cookies and Advertising (Google AdSense)</h2>
        <p>KaruviLab uses cookies to enhance your experience, monitor website performance, and serve advertisements. We partner with third-party advertising networks, including Google AdSense, to display ads.</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Google AdSense:</strong> Third-party vendors, including Google, use cookies to serve ads based on your prior visits to our website or other websites.</li>
          <li><strong>Personalized Ads:</strong> Google's use of advertising cookies enables it and its partners to serve ads based on your internet browsing history.</li>
          <li><strong>Opt-Out:</strong> You may opt out of personalized advertising by visiting <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-blue hover:underline">Google Ads Settings</a> or <a href="https://optout.networkadvertising.org" target="_blank" rel="noopener noreferrer" className="text-blue hover:underline">www.aboutads.info</a>.</li>
        </ul>
      </section>

      <section className="space-y-4 text-text-2 leading-relaxed">
        <h2 className="text-2xl font-black text-text">5. Third-Party Services</h2>
        <p>To provide a robust platform, we utilize a few trusted third-party services:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Vercel Analytics:</strong> Used for tracking page load speeds and core web vitals anonymously.</li>
          <li><strong>Cloudflare / Vercel:</strong> Used for hosting and content delivery network (CDN) routing.</li>
          <li><strong>Google AdSense:</strong> Used for serving relevant advertisements.</li>
        </ul>
        <p>These services operate under their respective privacy policies and are bound by stringent data protection laws.</p>
      </section>

      <section className="space-y-4 text-text-2 leading-relaxed">
        <h2 className="text-2xl font-black text-text">6. Data Retention and Local Storage</h2>
        <p>
          KaruviLab utilizes your browser's LocalStorage and IndexedDB to save your settings (e.g., dark mode preferences) 
          and preserve the state of tools (e.g., your saved EMI calculator scenarios). 
          <strong>This data never leaves your device.</strong> You can delete it at any time by utilizing the "Factory Reset App" 
          feature in the KaruviLab Settings menu, or by clearing your browser cache. Emails sent to support are retained only as long as necessary to resolve the inquiry.
        </p>
      </section>

      <section className="space-y-4 text-text-2 leading-relaxed">
        <h2 className="text-2xl font-black text-text">7. Your User Rights (GDPR & CCPA Compliance)</h2>
        <p>Depending on your region, you have the following rights regarding any data we may possess:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Right to Access & Portability:</strong> You may request a record of any personal data we hold about you.</li>
          <li><strong>Right to Erasure (Right to be Forgotten):</strong> You may request that we delete your contact emails or any server-side logs containing your IP address.</li>
          <li><strong>Right to Restrict Processing:</strong> You may decline advertising cookies via our cookie consent banner.</li>
        </ul>
        <p>Because core tool data is never transmitted to us, you already maintain complete ownership and control over your files and inputs. To exercise any regional rights regarding analytics or contact data, please email us.</p>
      </section>

      <section className="space-y-4 text-text-2 leading-relaxed">
        <h2 className="text-2xl font-black text-text">8. Children's Privacy</h2>
        <p>
          KaruviLab's tools are designed for general audiences and professionals. We do not knowingly collect personally 
          identifiable information from children under the age of 13. If you believe a child has provided us with personal 
          data (e.g., via a support email), please contact us so we can delete it immediately.
        </p>
      </section>

      <section className="space-y-4 text-text-2 leading-relaxed">
        <h2 className="text-2xl font-black text-text">9. Contact Information</h2>
        <p>If you have any questions or concerns regarding this Privacy Policy, your data rights, or our browser-native architecture, please contact our Privacy Team.</p>
        <p><strong>Email:</strong> <a href="mailto:support@karuvilab.com" className="text-blue hover:underline">support@karuvilab.com</a></p>
      </section>
    </div>
  );
}