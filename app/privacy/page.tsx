import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | KaruviLab",
  description: "Learn how KaruviLab protects your data. Discover our local-first, zero-upload processing philosophy and how we comply with GDPR and CCPA privacy standards.",
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
        <p>While your tool data remains entirely on your device, we collect limited, non-personally identifiable information to keep the website functional and secure:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Technical Data:</strong> Browser type, operating system, network status, and general device information.</li>
          <li><strong>Analytics Data:</strong> Aggregated, anonymized data regarding page views, tool usage frequency, and error reports to help us improve performance.</li>
          <li><strong>Contact Data:</strong> If you reach out to us via email for support or feedback, we collect your email address and message contents solely to respond to your inquiry.</li>
        </ul>
      </section>

      <section className="space-y-4 text-text-2 leading-relaxed">
        <h2 className="text-2xl font-black text-text">4. Browser Storage and Local Data Scope</h2>
        <p>KaruviLab operates as an ad-free, local-first platform. We do not use third-party advertising cookies, do not track your browsing history across external websites, and do not serve advertisements.</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Zero Advertising Trackers:</strong> We do not partner with advertising networks or deploy third-party advertising cookies.</li>
          <li><strong>No Data Selling or Sharing:</strong> Your file content, tool inputs, and usage behaviors are never monetized, rented, or shared with third parties.</li>
          <li><strong>Local Storage Scope:</strong> We use your browser's native LocalStorage and IndexedDB strictly on your device to store your app settings (theme, font scaling), starred favorites, saved tool states (such as Notes drafts, calculator scenarios, custom templates, and color palettes), and game high scores. All stored data physically remains on your device.</li>
        </ul>
      </section>

      <section className="space-y-4 text-text-2 leading-relaxed">
        <h2 className="text-2xl font-black text-text">5. Third-Party Infrastructure Services</h2>
        <p>To deliver a fast, reliable, and secure platform, we utilize essential infrastructure providers:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Vercel Speed Insights & Analytics:</strong> Used strictly for measuring aggregate performance and Core Web Vitals anonymously, without collecting personally identifiable information.</li>
          <li><strong>Vercel / Cloudflare:</strong> Used for global hosting, static asset delivery, and DDoS mitigation.</li>
        </ul>
        <p>These infrastructure providers operate under strict security standards and do not have access to your client-side processed files or tool data.</p>
      </section>

      <section className="space-y-4 text-text-2 leading-relaxed">
        <h2 className="text-2xl font-black text-text">6. Data Retention and Local Storage Controls</h2>
        <p>
          KaruviLab utilizes your browser's LocalStorage and IndexedDB to save your settings, tool drafts, calculator scenarios, and local history. 
          <strong>This data never leaves your device.</strong> You can manage or delete your local data at any time using the <strong>"Clear All Tool Data"</strong> control (to wipe tool drafts, history, and cached scenarios while retaining app settings) or the <strong>"Factory Reset App"</strong> control (to perform a complete wipe of all local storage, settings, favorites, and cached assets) in the KaruviLab Settings menu under Data Management, or by clearing your browser cache. Emails sent to support are retained only as long as necessary to resolve the inquiry.
        </p>
      </section>

      <section className="space-y-4 text-text-2 leading-relaxed">
        <h2 className="text-2xl font-black text-text">7. Your Privacy Rights (GDPR & CCPA Compliance)</h2>
        <p>Under global data protection laws (including GDPR and CCPA), KaruviLab enforces privacy by design. Because we do not collect personal profiles, harvest file data, or share data with ad brokers, your privacy rights are natively respected:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>No Personal Data Sale or Sharing:</strong> KaruviLab does not "sell" or "share" personal information or browsing history under CCPA/CPRA definitions.</li>
          <li><strong>Right to Erasure & Data Control:</strong> You maintain 100% ownership of all local data. You can erase all saved tool settings, drafts, and local history at any time using "Clear All Tool Data" or "Factory Reset App" in Settings, or by clearing browser storage.</li>
          <li><strong>Right to Access:</strong> You may request information regarding any support communications or non-identifiable technical logs by contacting our privacy team.</li>
        </ul>
        <p>Because core tool data never leaves your device, you already maintain complete ownership and control over your files and inputs.</p>
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
        <p><strong>Email:</strong> <a href="mailto:KaruviLab@proton.me" className="text-blue hover:underline">KaruviLab@proton.me</a></p>
      </section>
    </div>
  );
}